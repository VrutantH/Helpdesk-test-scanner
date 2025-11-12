import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';

/**
 * Get all projects with optional filtering
 */
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    const query: any = {};
    
    // Search by name, code, or projectId
    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    // Calculate actual user count for each project
    const projectsWithUserCount = await Promise.all(
      projects.map(async (project) => {
        const userCount = await User.countDocuments({ projects: project._id });
        return {
          ...project.toObject(),
          users: userCount,
        };
      })
    );
    
    const total = await Project.countDocuments(query);
    
    console.log(`📋 Retrieved ${projects.length} projects (Total: ${total})`);
    
    return res.json({
      success: true,
      data: {
        projects: projectsWithUserCount,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
          itemsPerPage: Number(limit),
        },
      },
    });
    
  } catch (error) {
    console.error('Get all projects error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get single project by ID
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    // Calculate actual user count
    const userCount = await User.countDocuments({ projects: project._id });
    
    const projectWithUserCount = {
      ...project.toObject(),
      users: userCount,
    };
    
    console.log(`📋 Retrieved project: ${project.name} (${userCount} users)`);
    
    return res.json({
      success: true,
      data: { project: projectWithUserCount },
    });
    
  } catch (error) {
    console.error('Get project by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Create new project
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    
    // Check if code already exists
    const existingProject = await Project.findOne({ code: projectData.code.toUpperCase() });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: 'Project code already exists',
      });
    }
    
    // Create new project
    const project = new Project({
      ...projectData,
      code: projectData.code.toUpperCase(),
      createdBy: req.body.createdBy, // TODO: Get from authenticated user
    });
    
    await project.save();
    
    console.log(`✅ Created new project: ${project.name} (${project.projectId})`);
    
    return res.status(201).json({
      success: true,
      data: { project },
      message: 'Project created successfully',
    });
    
  } catch (error: any) {
    console.error('Create project error:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      errors: error.errors,
    });
  }
};

/**
 * Update project
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if code is being updated and if it's unique
    if (updateData.code) {
      const existingProject = await Project.findOne({ 
        code: updateData.code.toUpperCase(),
        _id: { $ne: id },
      });
      if (existingProject) {
        return res.status(400).json({
          success: false,
          message: 'Project code already exists',
        });
      }
      updateData.code = updateData.code.toUpperCase();
    }
    
    const project = await Project.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedBy: req.body.updatedBy, // TODO: Get from authenticated user
      },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    console.log(`✅ Updated project: ${project.name} (${project.projectId})`);
    
    return res.json({
      success: true,
      data: { project },
      message: 'Project updated successfully',
    });
    
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Delete project
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    console.log(`🗑️ Deleted project: ${project.name} (${project.projectId})`);
    
    return res.json({
      success: true,
      message: 'Project deleted successfully',
    });
    
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Toggle project status (active/inactive)
 */
export const toggleProjectStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    project.isActive = !project.isActive;
    project.status = project.isActive ? 'active' : 'inactive';
    await project.save();
    
    console.log(`🔄 Toggled project status: ${project.name} -> ${project.status}`);
    
    return res.json({
      success: true,
      data: { project },
      message: `Project ${project.status === 'active' ? 'activated' : 'deactivated'} successfully`,
    });
    
  } catch (error) {
    console.error('Toggle project status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Update project modules
 */
export const updateProjectModules = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { modules } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      id,
      { modules },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    console.log(`✅ Updated modules for project: ${project.name}`);
    
    return res.json({
      success: true,
      data: { project },
      message: 'Project modules updated successfully',
    });
    
  } catch (error) {
    console.error('Update project modules error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get project statistics
 */
export const getProjectStats = async (req: Request, res: Response) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const inactiveProjects = await Project.countDocuments({ status: 'inactive' });
    const suspendedProjects = await Project.countDocuments({ status: 'suspended' });
    
    return res.json({
      success: true,
      data: {
        total: totalProjects,
        active: activeProjects,
        inactive: inactiveProjects,
        suspended: suspendedProjects,
      },
    });
    
  } catch (error) {
    console.error('Get project stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get project branding by custom URL path
 */
export const getProjectBranding = async (req: Request, res: Response) => {
  try {
    const { urlPath } = req.params;
    
    console.log(`🔍 Looking for project with customUrlPath: ${urlPath}`);
    
    const project = await Project.findOne({ 'branding.customUrlPath': urlPath });
    
    if (!project) {
      console.log(`❌ Project not found with customUrlPath: ${urlPath}`);
      return res.status(404).json({
        success: false,
        message: 'Project not found',
        error: 'No project found with this URL path',
      });
    }
    
    // Return only the necessary branding information
    const brandingData = {
      projectId: project._id.toString(),
      name: project.name,
      customUrlPath: project.branding?.customUrlPath,
      primaryColor: project.branding?.colorTheme?.primary || '#2563EB',
      secondaryColor: project.branding?.colorTheme?.secondary || '#764ba2',
      logoUrl: project.branding?.logo,
      welcomeText: project.branding?.headerText,
      footerText: project.branding?.footerText,
    };
    
    console.log(`✅ Found project branding: ${project.name}`);
    
    return res.json({
      success: true,
      data: brandingData,
    });
    
  } catch (error) {
    console.error('Get project branding error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get project ticket submission settings
 */
export const getProjectTicketSettings = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    
    console.log(`🔍 Looking for ticket settings for project: ${projectId}`);
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    
    // Return ticket submission settings with defaults
    const settings = {
      mode: project.configuration?.ticketSubmissionSettings?.mode || 'both',
      enableOnlineForm: project.configuration?.ticketSubmissionSettings?.enableOnlineForm !== false,
      enableOfflineCenter: project.configuration?.ticketSubmissionSettings?.enableOfflineCenter !== false,
      onlineFormFields: project.configuration?.ticketSubmissionSettings?.onlineFormFields || [
        { fieldName: 'Name', fieldType: 'text', required: true, placeholder: 'Enter your name' },
        { fieldName: 'Email', fieldType: 'email', required: true, placeholder: 'Enter your email' },
        { fieldName: 'Phone', fieldType: 'phone', required: true, placeholder: 'Enter your phone number' },
        { fieldName: 'Subject', fieldType: 'text', required: true, placeholder: 'Enter subject' },
        { fieldName: 'Description', fieldType: 'textarea', required: true, placeholder: 'Describe your issue' },
      ],
      offlineCenters: project.configuration?.ticketSubmissionSettings?.offlineCenters || [],
      welcomeMessage: project.configuration?.ticketSubmissionSettings?.welcomeMessage || 'Welcome! Submit your ticket below and our team will assist you.',
      successMessage: project.configuration?.ticketSubmissionSettings?.successMessage || 'Your ticket has been successfully submitted. We will get back to you soon.',
      announcement: project.configuration?.ticketSubmissionSettings?.announcement || '',
      allowAttachments: project.configuration?.ticketSubmissionSettings?.allowAttachments !== false,
      maxAttachmentSize: project.configuration?.ticketSubmissionSettings?.maxAttachmentSize || 10,
      allowedFileTypes: project.configuration?.ticketSubmissionSettings?.allowedFileTypes || ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
    };
    
    console.log(`✅ Found ticket settings for project: ${project.name}`);
    
    return res.json(settings);
    
  } catch (error) {
    console.error('Get project ticket settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Status } from '../models/Status';
import SLARule from '../models/sla-module/SLARule';
import { AuthRequest } from '../middleware/auth';

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
      code: project.code,
      branding: {
        customUrlPath: project.branding?.customUrlPath,
        logo: project.branding?.logo,
        favicon: project.branding?.favicon,
        headerText: project.branding?.headerText,
        footerText: project.branding?.footerText,
        colorTheme: {
          primary: project.branding?.colorTheme?.primary || '#667eea',
          secondary: project.branding?.colorTheme?.secondary || '#1f2937',
          accent: project.branding?.colorTheme?.accent || '#764ba2',
          background: project.branding?.colorTheme?.background || '#ffffff',
        },
      },
      knowledgeBase: (project as any).knowledgeBase ?? true, // Enable KB by default
      ticketSubmissionMode: (project as any).ticketSubmissionSettings?.mode || 'both', // online, offline, or both
    };
    
    console.log(`✅ Found project branding: ${project.name}`, brandingData);
    
    // Set cache control headers to prevent stale branding data
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
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
      // Fetch categories from Category model (master)
      categories: await (async () => {
        const categories = await Category.find({ 
          projectId: project._id, 
          isActive: true 
        }).select('name').sort({ order: 1, name: 1 });
        return categories.map(cat => cat.name);
      })(),
      // Fetch allowed statuses from Status model (master)
      allowedStatuses: await (async () => {
        const statuses = await Status.find({ 
          projectId: project._id, 
          isActive: true 
        }).select('name code color isDefault isClosed').sort({ displayOrder: 1 });
        return statuses;
      })(),
      // Fetch priorities from SLA Rules
      allowedPriorities: await (async () => {
        console.log('🔍 Querying SLA rules:');
        console.log('  Project ID:', project._id);
        console.log('  Project ID type:', typeof project._id);
        console.log('  SLARule collection:', SLARule.collection.name);
        
        const query = {
          projectIds: { $in: [project._id] },  // Use $in because projectIds is an array
          isActive: true,
          priority: { $exists: true, $ne: null }
        };
        console.log('  Query:', JSON.stringify(query));
        
        const slaRules = await SLARule.find(query).select('priority');
        console.log('  Raw results:', JSON.stringify(slaRules, null, 2));
        
        // Extract unique priorities
        const uniquePriorities = [...new Set(slaRules.map(rule => rule.priority))];
        console.log(`📊 Found ${uniquePriorities.length} unique priorities from ${slaRules.length} SLA rules for project ${project.name}:`, uniquePriorities);
        
        return uniquePriorities;
      })(),
    };
    
    console.log(`✅ Found ticket settings for project: ${project.name}`);
    
    return res.json({
      success: true,
      data: settings,
    });
    
  } catch (error) {
    console.error('Get project ticket settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Get offline module settings for a project
 */
export const getOfflineSettings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    let settings = project.configuration?.offlineModuleSettings || {
      registrationFields: [
        { id: '1', fieldName: 'First Name', fieldType: 'text', required: true, placeholder: 'Enter first name', order: 1 },
        { id: '2', fieldName: 'Last Name', fieldType: 'text', required: true, placeholder: 'Enter last name', order: 2 },
        { id: '3', fieldName: 'Email', fieldType: 'email', required: true, placeholder: 'student@example.com', order: 3 },
        { id: '4', fieldName: 'Phone', fieldType: 'phone', required: false, placeholder: '+91 98765 43210', order: 4 },
      ],
      ticketFields: [
        { id: 'category-fixed', fieldName: 'Category', fieldType: 'category', required: true, placeholder: 'Select category', isFixed: true, isEnabled: true, order: 1 },
        { id: '1', fieldName: 'Title', fieldType: 'text', required: true, placeholder: 'Brief description of issue', order: 2 },
        { id: '2', fieldName: 'Description', fieldType: 'textarea', required: true, placeholder: 'Detailed description...', order: 3 },
        { id: '3', fieldName: 'Attachments', fieldType: 'file', required: false, placeholder: '', allowMultiple: true, maxFiles: 5, allowedFileTypes: ['pdf', 'jpg', 'png', 'doc', 'docx'], order: 4 },
      ],
      allowAgentToMarkResolved: true,
      allowAgentToEscalate: true,
      autoAssignToCreatingAgent: false,
      requireStudentVerification: false,
      notificationSettings: {
        notifyStudentOnRegistration: true,
        notifyStudentOnTicketCreation: true,
        sendWelcomeEmail: true,
      },
    };

    // Convert to plain object to remove Mongoose metadata
    if (project.configuration?.offlineModuleSettings) {
      settings = JSON.parse(JSON.stringify(settings));
      
      // Ensure category field exists in ticket fields
      if (settings.ticketFields) {
        const hasCategoryField = settings.ticketFields.some((f: any) => 
          f.fieldType === 'category' || f.fieldType === 'category-select' || f.fieldName === 'Category'
        );
        if (!hasCategoryField) {
          settings.ticketFields = [
            { id: 'category-fixed', fieldName: 'Category', fieldType: 'category', required: true, placeholder: 'Select category', isFixed: true, isEnabled: true, order: 1 },
            ...settings.ticketFields.map((f: any) => ({ ...f, order: (f.order || 0) + 1 }))
          ];
        }
      }
    }

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Get offline settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Update offline module settings for a project
 */
export const updateOfflineSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let settings = req.body;

    // Clean the settings - remove MongoDB _id fields from nested arrays
    if (settings.registrationFields) {
      settings.registrationFields = settings.registrationFields.map((field: any) => {
        const { _id, ...cleanField } = field;
        return cleanField;
      });
    }

    if (settings.ticketFields) {
      settings.ticketFields = settings.ticketFields.map((field: any) => {
        const { _id, ...cleanField } = field;
        return cleanField;
      });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Initialize configuration if it doesn't exist
    if (!project.configuration) {
      project.configuration = {};
    }

    // Update offline module settings
    project.configuration.offlineModuleSettings = settings;
    project.updatedAt = new Date();
    if (req.user?.userId) {
      project.updatedBy = req.user.userId as any;
    }

    await project.save();

    console.log(`✅ Offline module settings updated for project: ${project.name}`);

    return res.json({
      success: true,
      message: 'Offline module settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Update offline settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Update project ticket settings
 */
export const updateProjectTicketSettings = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { numbering, statuses, types } = req.body;

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Initialize configuration structure if needed
    if (!project.configuration) {
      (project as any).configuration = {};
    }
    if (!(project as any).configuration.ticketSubmissionSettings) {
      (project as any).configuration.ticketSubmissionSettings = {};
    }

    // Update ticket configuration
    if (numbering) {
      (project as any).configuration.ticketSubmissionSettings.numbering = numbering;
    }
    if (statuses) {
      (project as any).configuration.ticketSubmissionSettings.statuses = statuses;
    }
    if (types) {
      (project as any).configuration.ticketSubmissionSettings.types = types;
    }

    await project.save();

    return res.json({
      success: true,
      message: 'Ticket settings updated successfully',
      data: {
        numbering: (project as any).configuration?.ticketSubmissionSettings?.numbering,
        statuses: (project as any).configuration?.ticketSubmissionSettings?.statuses,
        types: (project as any).configuration?.ticketSubmissionSettings?.types,
      },
    });
  } catch (error) {
    console.error('Update ticket settings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

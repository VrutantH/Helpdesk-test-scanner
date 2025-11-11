import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';

/**
 * Get all projects with optional filtering
 */
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { search, organizationType, status, page = 1, limit = 10 } = req.query;
    
    const query: any = {};
    
    // Search by name, code, or projectId
    if (search && typeof search === 'string') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { projectId: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (organizationType) {
      query.organizationType = organizationType;
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
    
    const projectsByType = await Project.aggregate([
      {
        $group: {
          _id: '$organizationType',
          count: { $sum: 1 },
        },
      },
    ]);
    
    return res.json({
      success: true,
      data: {
        total: totalProjects,
        active: activeProjects,
        inactive: inactiveProjects,
        suspended: suspendedProjects,
        byType: projectsByType,
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

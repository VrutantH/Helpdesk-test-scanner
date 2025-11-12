import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Role } from '../models/Role';

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private
export const getRoles = async (req: AuthRequest, res: Response) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch roles',
    });
  }
};

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Private
export const getRoleById = async (req: AuthRequest, res: Response) => {
  try {
    const role = await Role.findById(req.params.id).populate('permissions');
    if (!role) {
      res.status(404).json({
        success: false,
        error: 'Role not found',
      });
      return;
    }
    res.json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch role',
    });
  }
};

// @desc    Create new role
// @route   POST /api/roles
// @access  Private
export const createRole = async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, description, permissions, type, projects, projectId } = req.body;

    // Check if role with same code already exists
    const existingRole = await Role.findOne({ code: code?.toUpperCase() });
    if (existingRole) {
      res.status(400).json({
        success: false,
        error: 'Role with this code already exists',
      });
      return;
    }

    // Prepare role data
    const roleData: any = {
      name,
      code: code?.toUpperCase(),
      description,
      permissions: permissions || [],
      type: type || 'custom',
    };

    // Handle project mapping
    // If projects array provided, use it
    // If single projectId provided (backward compatibility), convert to array
    if (projects && Array.isArray(projects) && projects.length > 0) {
      roleData.projects = projects;
      roleData.projectId = projects[0]; // Set first project as projectId for backward compatibility
    } else if (projectId) {
      roleData.projectId = projectId;
      roleData.projects = [projectId];
    }

    // System roles (like SuperAdmin) should not have project mapping
    if (type === 'system') {
      delete roleData.projects;
      delete roleData.projectId;
    }

    const role = await Role.create(roleData);

    const populatedRole = await Role.findById(role._id).populate('permissions');

    res.status(201).json({
      success: true,
      data: populatedRole,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create role',
    });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private
export const updateRole = async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, description, permissions, projects, projectId } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(404).json({
        success: false,
        error: 'Role not found',
      });
      return;
    }

    // Prevent updating system roles' project mapping
    if (role.type === 'system' && (projects || projectId)) {
      res.status(400).json({
        success: false,
        error: 'Cannot modify project mapping for system roles',
      });
      return;
    }

    // Check if code is being changed and if it conflicts
    if (code && code.toUpperCase() !== role.code) {
      const existingRole = await Role.findOne({ code: code.toUpperCase() });
      if (existingRole) {
        res.status(400).json({
          success: false,
          error: 'Role with this code already exists',
        });
        return;
      }
    }

    role.name = name || role.name;
    role.code = code?.toUpperCase() || role.code;
    role.description = description || role.description;
    
    if (permissions !== undefined) {
      role.permissions = permissions;
    }

    // Update project mapping
    if (projects && Array.isArray(projects)) {
      role.projects = projects;
      role.projectId = projects.length > 0 ? projects[0] : undefined;
    } else if (projectId) {
      role.projectId = projectId;
      role.projects = [projectId];
    }

    await role.save();

    const populatedRole = await Role.findById(role._id).populate('permissions');

    res.json({
      success: true,
      data: populatedRole,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update role',
    });
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private
export const deleteRole = async (req: AuthRequest, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      res.status(404).json({
        success: false,
        error: 'Role not found',
      });
      return;
    }

    // Prevent deletion of system roles
    if (role.isSystem) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete system roles',
      });
      return;
    }

    await role.deleteOne();

    res.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete role',
    });
  }
};

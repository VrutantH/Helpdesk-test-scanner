import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Role } from '../models/Role';

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private
export const getRoles = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, includeSystem = 'true', isActive } = req.query as Record<string, string | undefined>;

    const query: any = {};

    if (typeof isActive !== 'undefined') {
      query.isActive = isActive !== 'false';
    }

    if (projectId) {
      const clauses: Record<string, any>[] = [
        { projects: projectId },
        { projectId },
      ];
      if (includeSystem !== 'false') {
        clauses.push({ type: 'system' });
      }
      query.$or = clauses;
    }

    const roles = await Role.find(Object.keys(query).length ? query : {}).populate('permissions');
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
    const { name, code, description, permissions, type, projects, projectId, isMaster } = req.body;

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
      isMaster: isMaster || false,
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
    const { name, code, description, permissions, projects, projectId, isMaster } = req.body;

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

    if (isMaster !== undefined) {
      role.isMaster = isMaster;
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

// @desc    Clone role from master role
// @route   POST /api/roles/:id/clone
// @access  Private
export const cloneRole = async (req: AuthRequest, res: Response) => {
  try {
    const { name, code, description, projects, projectId } = req.body;
    const masterRoleId = req.params.id;

    const masterRole = await Role.findById(masterRoleId);
    if (!masterRole) {
      res.status(404).json({
        success: false,
        error: 'Master role not found',
      });
      return;
    }

    // Check if role with same code already exists
    const existingRole = await Role.findOne({ code: code?.toUpperCase() });
    if (existingRole) {
      res.status(400).json({
        success: false,
        error: 'Role with this code already exists',
      });
      return;
    }

    // Clone the role with new name, code, and project mapping
    const roleData: any = {
      name: name || `${masterRole.name} (Copy)`,
      code: code?.toUpperCase(),
      description: description || masterRole.description,
      permissions: masterRole.permissions, // Copy all permissions
      type: 'custom', // Cloned roles are always custom
      isMaster: false, // Cloned roles are not master by default
      masterRoleId: masterRole._id, // Reference to master role
    };

    // Handle project mapping for cloned role
    if (projects && Array.isArray(projects) && projects.length > 0) {
      roleData.projects = projects;
      roleData.projectId = projects[0];
    } else if (projectId) {
      roleData.projectId = projectId;
      roleData.projects = [projectId];
    }

    const clonedRole = await Role.create(roleData);
    const populatedRole = await Role.findById(clonedRole._id).populate('permissions');

    res.status(201).json({
      success: true,
      data: populatedRole,
      message: 'Role cloned successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to clone role',
    });
  }
};

// @desc    Get master roles
// @route   GET /api/roles/master
// @access  Private
export const getMasterRoles = async (req: AuthRequest, res: Response) => {
  try {
    const masterRoles = await Role.find({ isMaster: true, isActive: true }).populate('permissions');
    res.json({
      success: true,
      data: masterRoles,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch master roles',
    });
  }
};

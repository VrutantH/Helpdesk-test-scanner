import { Request, Response } from 'express';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import mongoose from 'mongoose';

// Get all roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const { projectId, type, search } = req.query;

    const filter: any = {};

    if (projectId) {
      filter.$or = [
        { projectId: projectId },
        { type: 'system' }
      ];
    }

    if (type) {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const roles = await Role.find(filter)
      .populate('permissions')
      .sort({ type: -1, name: 1 });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch roles',
    });
  }
};

// Get role by ID
export const getRoleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id).populate('permissions');

    if (!role) {
      res.status(404).json({
        success: false,
        message: 'Role not found',
      });
      return;
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error: any) {
    console.error('Get role error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch role',
    });
  }
};

// Create new role
export const createRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, description, projectId, permissions } = req.body;

    // Check if role code already exists for this project
    const existingRole = await Role.findOne({ 
      code: code.toUpperCase(),
      projectId: projectId || null 
    });

    if (existingRole) {
      res.status(400).json({
        success: false,
        message: 'Role with this code already exists for this project',
      });
      return;
    }

    const role = new Role({
      name,
      code: code.toUpperCase(),
      description,
      projectId: projectId || null,
      permissions: permissions || [],
      type: 'custom',
    });

    await role.save();

    const populatedRole = await Role.findById(role._id).populate('permissions');

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: populatedRole,
    });
  } catch (error: any) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create role',
    });
  }
};

// Update role
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findById(id);

    if (!role) {
      res.status(404).json({
        success: false,
        message: 'Role not found',
      });
      return;
    }

    // Prevent modification of system roles
    if (role.type === 'system') {
      res.status(403).json({
        success: false,
        message: 'System roles cannot be modified',
      });
      return;
    }

    role.name = name || role.name;
    role.description = description !== undefined ? description : role.description;
    role.permissions = permissions || role.permissions;

    await role.save();

    const updatedRole = await Role.findById(role._id).populate('permissions');

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: updatedRole,
    });
  } catch (error: any) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update role',
    });
  }
};

// Delete role
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
      res.status(404).json({
        success: false,
        message: 'Role not found',
      });
      return;
    }

    // Prevent deletion of system roles
    if (role.type === 'system') {
      res.status(403).json({
        success: false,
        message: 'System roles cannot be deleted',
      });
      return;
    }

    // Check if any users are assigned this role
    if (role.agentCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete role. ${role.agentCount} agent(s) are currently assigned to this role`,
      });
      return;
    }

    await Role.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete role',
    });
  }
};

// Get all permissions
export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const filter: any = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { module: { $regex: search, $options: 'i' } }
      ];
    }

    const permissions = await Permission.find(filter).sort({ category: 1, module: 1, name: 1 });

    // Group permissions by category
    const groupedPermissions = permissions.reduce((acc: any, perm) => {
      if (!acc[perm.category]) {
        acc[perm.category] = [];
      }
      acc[perm.category].push(perm);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        all: permissions,
        grouped: groupedPermissions,
      },
    });
  } catch (error: any) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch permissions',
    });
  }
};

// Toggle role status
export const toggleRoleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);

    if (!role) {
      res.status(404).json({
        success: false,
        message: 'Role not found',
      });
      return;
    }

    // Prevent deactivation of system roles
    if (role.type === 'system') {
      res.status(403).json({
        success: false,
        message: 'System roles cannot be deactivated',
      });
      return;
    }

    role.isActive = !role.isActive;
    await role.save();

    res.json({
      success: true,
      message: `Role ${role.isActive ? 'activated' : 'deactivated'} successfully`,
      data: role,
    });
  } catch (error: any) {
    console.error('Toggle role status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle role status',
    });
  }
};

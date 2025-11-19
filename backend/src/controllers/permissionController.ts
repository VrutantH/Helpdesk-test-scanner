import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Permission } from '../models/Permission';

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private
export const getPermissions = async (req: AuthRequest, res: Response) => {
  try {
    const { category, isActive } = req.query as Record<string, string | undefined>;

    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (typeof isActive !== 'undefined') {
      query.isActive = isActive !== 'false';
    }

    const permissions = await Permission.find(query).sort({ category: 1, module: 1, name: 1 });
    
    res.json({
      success: true,
      data: permissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch permissions',
    });
  }
};

// @desc    Get permissions grouped by category and module
// @route   GET /api/permissions/grouped
// @access  Private
export const getPermissionsGrouped = async (req: AuthRequest, res: Response) => {
  try {
    const permissions = await Permission.find({ isActive: true }).sort({ category: 1, module: 1, name: 1 });
    
    // Group by category first, then by module
    const grouped: Record<string, Record<string, any[]>> = {};
    
    permissions.forEach(permission => {
      const category = permission.category;
      const module = permission.module;
      
      if (!grouped[category]) {
        grouped[category] = {};
      }
      
      if (!grouped[category][module]) {
        grouped[category][module] = [];
      }
      
      grouped[category][module].push({
        _id: permission._id,
        name: permission.name,
        code: permission.code,
        description: permission.description,
      });
    });
    
    res.json({
      success: true,
      data: grouped,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch grouped permissions',
    });
  }
};

// @desc    Get permission by ID
// @route   GET /api/permissions/:id
// @access  Private
export const getPermissionById = async (req: AuthRequest, res: Response) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      res.status(404).json({
        success: false,
        error: 'Permission not found',
      });
      return;
    }
    res.json({
      success: true,
      data: permission,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch permission',
    });
  }
};

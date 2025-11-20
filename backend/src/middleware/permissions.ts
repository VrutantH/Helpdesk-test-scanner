import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { Permission } from '../models/Permission';

/**
 * Middleware factory to require a specific permission code.
 * It checks if the current user's role (from JWT payload) contains that permission.
 * Now supports both permission codes (strings) and permission IDs (ObjectIds) for backward compatibility.
 */
export const requirePermission = (code: string) => async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const rolePerms = req.user?.role?.permissions || [];
    
    // Check if permissions are stored as codes (new optimized format)
    const hasPermissionByCode = rolePerms.some((p: any) => {
      const permCode = typeof p === 'string' ? p : p.code;
      return permCode === code;
    });

    if (hasPermissionByCode) {
      next();
      return;
    }

    // Fallback: Check by permission ID (old format for backward compatibility)
    const perm = await Permission.findOne({ code });
    if (!perm) {
      console.log(`❌ [PERMISSION] Permission ${code} not found in database`);
      res.status(403).json({ success: false, message: `Permission ${code} not found` });
      return;
    }

    const permId = perm._id.toString();
    const hasPermissionById = rolePerms.some((p: any) => {
      try {
        return p.toString() === permId;
      } catch (e) {
        return false;
      }
    });

    if (!hasPermissionById) {
      console.log(`❌ [PERMISSION] User ${req.user?.email} lacks permission: ${code}`);
      res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
      return;
    }

    next();
    return;
  } catch (err) {
    console.error('Permission check error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
    return;
  }
};

/**
 * Middleware factory to check permission by code or resource and action.
 * Can be called as:
 * - checkPermission('PERMISSION_CODE') - direct permission code
 * - checkPermission('resource', 'action') - constructs "resource.action"
 */
export const checkPermission = (resourceOrCode: string, action?: string) => {
  const code = action ? `${resourceOrCode}.${action}` : resourceOrCode;
  return requirePermission(code);
};

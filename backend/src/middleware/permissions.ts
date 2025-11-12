import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { Permission } from '../models/Permission';

/**
 * Middleware factory to require a specific permission code.
 * It looks up the permission by code and checks if the current user's role
 * (from the JWT payload attached by authMiddleware) contains that permission id.
 */
export const requirePermission = (code: string) => async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const perm = await Permission.findOne({ code });
    if (!perm) {
      res.status(403).json({ success: false, message: `Permission ${code} not found` });
      return;
    }

    const rolePerms = req.user?.role?.permissions || [];
    const permId = perm._id.toString();

    const has = rolePerms.some((p: any) => {
      try {
        return p.toString() === permId;
      } catch (e) {
        return false;
      }
    });

    if (!has) {
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
 * Middleware factory to check permission by resource and action.
 * Constructs permission code as "resource.action" and checks if user has it.
 */
export const checkPermission = (resource: string, action: string) => {
  const code = `${resource}.${action}`;
  return requirePermission(code);
};

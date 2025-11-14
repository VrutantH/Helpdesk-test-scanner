import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: any;
    firstName?: string;
    lastName?: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ [AUTH] No token provided');
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    // Get JWT_SECRET dynamically to ensure it's loaded from .env
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    console.log('🔐 [AUTH] Using JWT_SECRET:', jwtSecret);
    console.log('🎫 [AUTH] Token to verify (first 20 chars):', token.substring(0, 20));
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    console.log('✅ [AUTH] Token verified for user:', decoded.userId, decoded.email);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };

    next();
  } catch (error) {
    console.error('❌ [AUTH] Token verification failed:', error instanceof Error ? error.message : error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Export alias for backward compatibility
export const auth = authMiddleware;

// Public auth middleware - allows requests without authentication
export const publicAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  console.log('✅ [PUBLIC_AUTH] Middleware executing');
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(`✅ [PUBLIC_AUTH] Token present: ${token ? 'YES' : 'NO'}`);

    if (!token) {
      // No token - continue without authentication
      console.log('✅ [PUBLIC_AUTH] No token - continuing WITHOUT auth (public access)');
      next();
      return;
    }

    // Get JWT_SECRET dynamically to ensure it's loaded from .env
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const decoded = jwt.verify(token, jwtSecret) as any;
    console.log(`✅ [PUBLIC_AUTH] Token verified for user: ${decoded.userId}`);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };

    next();
  } catch (error) {
    // Invalid/expired token - continue without authentication
    console.log('✅ [PUBLIC_AUTH] Invalid token - continuing WITHOUT auth');
    next();
  }
};

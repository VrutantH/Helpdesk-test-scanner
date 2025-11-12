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
    console.log(`[AUTH] Token extracted: ${token ? 'YES' : 'NO'}`);

    if (!token) {
      console.log('[AUTH] No token provided');
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    console.log(`[AUTH] JWT Secret being used: ${jwtSecret}`);
    console.log(`[AUTH] Verifying token...`);
    
    const decoded = jwt.verify(token, jwtSecret) as any;
    console.log(`[AUTH] Token verified successfully. UserId: ${decoded.userId}`);
    
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };

    next();
  } catch (error) {
    console.error('[AUTH] Error in middleware:', (error as any).message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Export alias for backward compatibility
export const auth = authMiddleware;

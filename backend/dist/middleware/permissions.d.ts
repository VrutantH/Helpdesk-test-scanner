import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
export declare const requirePermission: (code: string) => (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=permissions.d.ts.map
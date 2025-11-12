import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getAllActivityLogs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getActivityLogById: (req: Request, res: Response) => Promise<void>;
export declare const createActivityLog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getActivityStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const exportActivityLogs: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=activityLogController.d.ts.map
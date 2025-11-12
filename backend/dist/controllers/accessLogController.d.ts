import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getAllAccessLogs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAccessLogById: (req: Request, res: Response) => Promise<void>;
export declare const createAccessLog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAccessStats: (req: AuthRequest, res: Response) => Promise<void>;
export declare const exportAccessLogs: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=accessLogController.d.ts.map
import { Request, Response } from 'express';
export declare const createForm: (req: any, res: Response) => Promise<void>;
export declare const getForms: (req: Request, res: Response) => Promise<void>;
export declare const getFormById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateForm: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteForm: (req: any, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getFormAuditLogs: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=formController.d.ts.map
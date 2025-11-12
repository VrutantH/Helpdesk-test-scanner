import { Request, Response } from 'express';
export declare const getStates: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getStateById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createState: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateState: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteState: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleStateStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=stateController.d.ts.map
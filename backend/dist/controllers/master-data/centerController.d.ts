import { Request, Response } from 'express';
export declare const getCenters: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCenterById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createCenter: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCenter: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteCenter: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleCenterStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=centerController.d.ts.map
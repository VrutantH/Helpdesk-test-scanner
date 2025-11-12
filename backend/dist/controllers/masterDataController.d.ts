import { Request, Response } from 'express';
export declare const getMasterDataByCategory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllCategories: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createMasterData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateMasterData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteMasterData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleMasterDataStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const bulkCreateMasterData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=masterDataController.d.ts.map
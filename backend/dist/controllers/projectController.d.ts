import { Request, Response } from 'express';
export declare const getAllProjects: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleProjectStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProjectModules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProjectStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProjectBranding: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=projectController.d.ts.map
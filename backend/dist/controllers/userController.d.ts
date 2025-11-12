import { Request, Response } from 'express';
export declare const getAllUsers: (req: Request, res: Response) => Promise<void>;
export declare const getUserById: (req: Request, res: Response) => Promise<void>;
export declare const createUser: (req: Request, res: Response) => Promise<void>;
export declare const updateUser: (req: Request, res: Response) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response) => Promise<void>;
export declare const toggleUserStatus: (req: Request, res: Response) => Promise<void>;
export declare const searchHRMSEmployees: (req: Request, res: Response) => Promise<void>;
export declare const validateEmployeeCode: (req: Request, res: Response) => Promise<void>;
export declare const bulkImportFromHRMS: (req: Request, res: Response) => Promise<void>;
export declare const resetUserPassword: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map
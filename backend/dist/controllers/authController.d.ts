import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
interface LoginRequest {
    email: string;
    password: string;
    projectId?: string;
}
interface ForgotPasswordRequest {
    email: string;
}
interface VerifyOTPRequest {
    email: string;
    otp: string;
}
interface ResetPasswordRequest {
    email: string;
    newPassword: string;
}
export declare const login: (req: Request<{}, {}, LoginRequest>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const forgotPassword: (req: Request<{}, {}, ForgotPasswordRequest>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const verifyOTP: (req: Request<{}, {}, VerifyOTPRequest>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const resetPassword: (req: Request<{}, {}, ResetPasswordRequest>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=authController.d.ts.map
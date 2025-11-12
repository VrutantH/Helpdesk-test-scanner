import { Request, Response } from 'express';
interface SendOTPRequest {
    mobile: string;
}
interface VerifyOTPRequest {
    mobile: string;
    otp: string;
}
interface ResetPasswordRequest {
    mobile: string;
    otp: string;
    newPassword: string;
}
export declare const sendOTP: (req: Request<{}, {}, SendOTPRequest>, res: Response) => Promise<Response>;
export declare const verifyOTP: (req: Request<{}, {}, VerifyOTPRequest>, res: Response) => Promise<Response>;
export declare const resetPassword: (req: Request<{}, {}, ResetPasswordRequest>, res: Response) => Promise<Response>;
export declare const getUserByMobile: (req: Request<{}, {}, SendOTPRequest>, res: Response) => Promise<Response>;
export declare const getCurrentOTP: (req: Request<{}, {}, SendOTPRequest>, res: Response) => Promise<Response>;
export {};
//# sourceMappingURL=forgotPasswordController.d.ts.map
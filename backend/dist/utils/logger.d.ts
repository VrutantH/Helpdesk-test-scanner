import { Request } from 'express';
export declare const getClientIp: (req: Request) => string;
export declare const getUserAgent: (req: Request) => string;
export declare const logActivity: (params: {
    userId: string;
    userName: string;
    userEmail: string;
    action: "create" | "update" | "delete" | "edit";
    entity: string;
    entityId?: string;
    entityName?: string;
    changes?: Array<{
        field: string;
        oldValue: any;
        newValue: any;
    }>;
    description?: string;
    req?: Request;
    projectId?: string;
    projectName?: string;
    role?: string;
    metadata?: Record<string, any>;
}) => Promise<void>;
export declare const logAccess: (params: {
    userId?: string;
    userName?: string;
    userEmail: string;
    action: "login" | "logout" | "login_failed" | "password_reset" | "forgot_password" | "session_expired";
    success: boolean;
    failureReason?: string;
    req?: Request;
    projectId?: string;
    projectName?: string;
    role?: string;
    sessionDuration?: number;
    metadata?: Record<string, any>;
}) => Promise<void>;
export declare const logLogin: (userId: string, userName: string, userEmail: string, req: Request, status: "success" | "failure", failureReason?: string, projectName?: string, roleName?: string) => Promise<void>;
export declare const logLogout: (userId: string, userName: string, userEmail: string, req: Request, projectName?: string, roleName?: string, sessionDuration?: number) => Promise<void>;
//# sourceMappingURL=logger.d.ts.map
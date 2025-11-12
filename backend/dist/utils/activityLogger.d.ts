import { Request } from 'express';
interface LogActivityParams {
    userId: string;
    userName: string;
    userEmail: string;
    eventType: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view' | 'download' | 'upload' | 'export' | 'import' | 'other';
    eventCategory: 'Authentication' | 'User Management' | 'Project Management' | 'Ticket Management' | 'Role Management' | 'Permission Management' | 'Settings' | 'Reports' | 'System' | 'Other';
    module: string;
    action: string;
    summary: string;
    details: string;
    metadata?: Record<string, any>;
    status?: 'success' | 'failure' | 'warning';
    errorMessage?: string;
    req?: Request;
}
export declare const logActivity: (params: LogActivityParams) => Promise<void>;
export declare const logLogin: (userId: string, userName: string, userEmail: string, req?: Request, status?: "success" | "failure", errorMessage?: string, projectName?: string, roleName?: string) => Promise<void>;
export declare const logLogout: (userId: string, userName: string, userEmail: string, req?: Request, projectName?: string, roleName?: string) => Promise<void>;
export declare const logUserCreate: (creatorId: string, creatorName: string, creatorEmail: string, newUserName: string, newUserEmail: string, req?: Request) => Promise<void>;
export declare const logUserUpdate: (updaterId: string, updaterName: string, updaterEmail: string, targetUserName: string, targetUserEmail: string, changes: Record<string, any>, req?: Request) => Promise<void>;
export declare const logUserDelete: (deleterId: string, deleterName: string, deleterEmail: string, deletedUserName: string, deletedUserEmail: string, req?: Request) => Promise<void>;
export declare const logProjectCreate: (userId: string, userName: string, userEmail: string, projectName: string, projectId: string, req?: Request) => Promise<void>;
export declare const logProjectUpdate: (userId: string, userName: string, userEmail: string, projectName: string, projectId: string, changes: Record<string, any>, req?: Request) => Promise<void>;
export declare const logProjectDelete: (userId: string, userName: string, userEmail: string, projectName: string, projectId: string, req?: Request) => Promise<void>;
export declare const logRoleCreate: (userId: string, userName: string, userEmail: string, roleName: string, roleId: string, req?: Request) => Promise<void>;
export declare const logRoleUpdate: (userId: string, userName: string, userEmail: string, roleName: string, roleId: string, changes: Record<string, any>, req?: Request) => Promise<void>;
export declare const logRoleDelete: (userId: string, userName: string, userEmail: string, roleName: string, roleId: string, req?: Request) => Promise<void>;
export {};
//# sourceMappingURL=activityLogger.d.ts.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logLogout = exports.logLogin = exports.logAccess = exports.logActivity = exports.getUserAgent = exports.getClientIp = void 0;
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const AccessLog_1 = __importDefault(require("../models/AccessLog"));
const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || 'unknown';
};
exports.getClientIp = getClientIp;
const getUserAgent = (req) => {
    return req.headers['user-agent'] || 'unknown';
};
exports.getUserAgent = getUserAgent;
const logActivity = async (params) => {
    try {
        const logData = {
            userId: params.userId,
            userName: params.userName,
            userEmail: params.userEmail,
            action: params.action,
            entity: params.entity,
            entityId: params.entityId,
            entityName: params.entityName,
            changes: params.changes,
            description: params.description,
            project: params.projectId,
            projectName: params.projectName,
            role: params.role,
            metadata: params.metadata,
            timestamp: new Date()
        };
        if (params.req) {
            logData.ipAddress = (0, exports.getClientIp)(params.req);
            logData.userAgent = (0, exports.getUserAgent)(params.req);
        }
        const log = new ActivityLog_1.default(logData);
        await log.save();
        console.log(`✅ Activity logged: ${params.action} ${params.entity} by ${params.userEmail}`);
    }
    catch (error) {
        console.error('❌ Error logging activity:', error);
    }
};
exports.logActivity = logActivity;
const logAccess = async (params) => {
    try {
        const logData = {
            userId: params.userId,
            userName: params.userName,
            userEmail: params.userEmail,
            action: params.action,
            success: params.success,
            failureReason: params.failureReason,
            project: params.projectId,
            projectName: params.projectName,
            role: params.role,
            sessionDuration: params.sessionDuration,
            metadata: params.metadata,
            timestamp: new Date()
        };
        if (params.req) {
            logData.ipAddress = (0, exports.getClientIp)(params.req);
            logData.userAgent = (0, exports.getUserAgent)(params.req);
        }
        const log = new AccessLog_1.default(logData);
        await log.save();
        console.log(`✅ Access logged: ${params.action} by ${params.userEmail} (success: ${params.success})`);
    }
    catch (error) {
        console.error('❌ Error logging access:', error);
    }
};
exports.logAccess = logAccess;
const logLogin = async (userId, userName, userEmail, req, status, failureReason, projectName, roleName) => {
    await (0, exports.logAccess)({
        userId: status === 'success' ? userId : undefined,
        userName: status === 'success' ? userName : undefined,
        userEmail,
        action: status === 'success' ? 'login' : 'login_failed',
        success: status === 'success',
        failureReason,
        req,
        projectName,
        role: roleName
    });
};
exports.logLogin = logLogin;
const logLogout = async (userId, userName, userEmail, req, projectName, roleName, sessionDuration) => {
    await (0, exports.logAccess)({
        userId,
        userName,
        userEmail,
        action: 'logout',
        success: true,
        req,
        projectName,
        role: roleName,
        sessionDuration
    });
};
exports.logLogout = logLogout;
//# sourceMappingURL=logger.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRoleDelete = exports.logRoleUpdate = exports.logRoleCreate = exports.logProjectDelete = exports.logProjectUpdate = exports.logProjectCreate = exports.logUserDelete = exports.logUserUpdate = exports.logUserCreate = exports.logLogout = exports.logLogin = exports.logActivity = void 0;
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const axios_1 = __importDefault(require("axios"));
const getLocationFromIP = async (ipAddress) => {
    try {
        if (!ipAddress || ipAddress === 'Unknown' || ipAddress === '::1' || ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
            return { country: 'India', city: 'Unknown', region: 'Unknown' };
        }
        const response = await axios_1.default.get(`http://ip-api.com/json/${ipAddress}?fields=status,country,regionName,city`, {
            timeout: 3000
        });
        if (response.data && response.data.status === 'success') {
            return {
                country: response.data.country || 'Unknown',
                city: response.data.city || 'Unknown',
                region: response.data.regionName || 'Unknown'
            };
        }
    }
    catch (error) {
        console.error('Error fetching location from IP:', error);
    }
    return { country: 'Unknown', city: 'Unknown', region: 'Unknown' };
};
const logActivity = async (params) => {
    try {
        const { userId, userName, userEmail, eventType, eventCategory, module, action, summary, details, metadata, status = 'success', errorMessage, req } = params;
        const logData = {
            userId,
            userName,
            userEmail,
            eventType,
            eventCategory,
            module,
            action,
            summary,
            details,
            metadata,
            status,
            errorMessage,
            timestamp: new Date()
        };
        if (req) {
            logData.ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
            logData.userAgent = req.get('user-agent') || 'Unknown';
            if (eventCategory === 'Authentication' && logData.ipAddress) {
                const location = await getLocationFromIP(logData.ipAddress);
                logData.metadata = {
                    ...logData.metadata,
                    country: location.country,
                    city: location.city,
                    region: location.region,
                    loginSource: 'Form Login',
                    brandName: logData.metadata?.brandName || 'Individual'
                };
            }
        }
        const log = new ActivityLog_1.default(logData);
        await log.save();
        console.log(`Activity logged: ${eventType} - ${module} - ${action}`);
    }
    catch (error) {
        console.error('Error logging activity:', error);
    }
};
exports.logActivity = logActivity;
const logLogin = async (userId, userName, userEmail, req, status = 'success', errorMessage, projectName, roleName) => {
    const metadata = {};
    if (projectName) {
        metadata.brandName = projectName;
    }
    if (roleName) {
        metadata.roleName = roleName;
    }
    await (0, exports.logActivity)({
        userId,
        userName,
        userEmail,
        eventType: 'login',
        eventCategory: 'Authentication',
        module: 'Authentication',
        action: 'User Login',
        summary: `${userName} logged in`,
        details: `User ${userName} (${userEmail}) logged into the system`,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        status,
        errorMessage,
        req
    });
};
exports.logLogin = logLogin;
const logLogout = async (userId, userName, userEmail, req, projectName, roleName) => {
    console.log('🔄 logLogout called with:', { userId, userName, userEmail, projectName, roleName });
    try {
        const metadata = {};
        if (projectName) {
            metadata.brandName = projectName;
        }
        if (roleName) {
            metadata.roleName = roleName;
        }
        await (0, exports.logActivity)({
            userId,
            userName,
            userEmail,
            eventType: 'logout',
            eventCategory: 'Authentication',
            module: 'Authentication',
            action: 'User Logout',
            summary: `${userName} logged out`,
            details: `User ${userName} (${userEmail}) logged out of the system`,
            metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
            req
        });
        console.log('✅ logLogout completed successfully');
    }
    catch (error) {
        console.error('❌ logLogout error:', error);
        throw error;
    }
};
exports.logLogout = logLogout;
const logUserCreate = async (creatorId, creatorName, creatorEmail, newUserName, newUserEmail, req) => {
    await (0, exports.logActivity)({
        userId: creatorId,
        userName: creatorName,
        userEmail: creatorEmail,
        eventType: 'create',
        eventCategory: 'User Management',
        module: 'Users',
        action: 'Create User',
        summary: `Created new user: ${newUserName}`,
        details: `User ${creatorName} created a new user account for ${newUserName} (${newUserEmail})`,
        metadata: { newUserName, newUserEmail },
        req
    });
};
exports.logUserCreate = logUserCreate;
const logUserUpdate = async (updaterId, updaterName, updaterEmail, targetUserName, targetUserEmail, changes, req) => {
    await (0, exports.logActivity)({
        userId: updaterId,
        userName: updaterName,
        userEmail: updaterEmail,
        eventType: 'update',
        eventCategory: 'User Management',
        module: 'Users',
        action: 'Update User',
        summary: `Updated user: ${targetUserName}`,
        details: `User ${updaterName} updated user account for ${targetUserName} (${targetUserEmail})`,
        metadata: { targetUserName, targetUserEmail, changes },
        req
    });
};
exports.logUserUpdate = logUserUpdate;
const logUserDelete = async (deleterId, deleterName, deleterEmail, deletedUserName, deletedUserEmail, req) => {
    await (0, exports.logActivity)({
        userId: deleterId,
        userName: deleterName,
        userEmail: deleterEmail,
        eventType: 'delete',
        eventCategory: 'User Management',
        module: 'Users',
        action: 'Delete User',
        summary: `Deleted user: ${deletedUserName}`,
        details: `User ${deleterName} deleted user account for ${deletedUserName} (${deletedUserEmail})`,
        metadata: { deletedUserName, deletedUserEmail },
        req
    });
};
exports.logUserDelete = logUserDelete;
const logProjectCreate = async (userId, userName, userEmail, projectName, projectId, req) => {
    await (0, exports.logActivity)({
        userId,
        userName,
        userEmail,
        eventType: 'create',
        eventCategory: 'Project Management',
        module: 'Projects',
        action: 'Create Project',
        summary: `Created project: ${projectName}`,
        details: `User ${userName} created a new project: ${projectName}`,
        metadata: { projectName, projectId },
        req
    });
};
exports.logProjectCreate = logProjectCreate;
const logProjectUpdate = async (userId, userName, userEmail, projectName, projectId, changes, req) => {
    await (0, exports.logActivity)({
        userId,
        userName,
        userEmail,
        eventType: 'update',
        eventCategory: 'Project Management',
        module: 'Projects',
        action: 'Update Project',
        summary: `Updated project: ${projectName}`,
        details: `User ${userName} updated project: ${projectName}`,
        metadata: { projectName, projectId, changes },
        req
    });
};
exports.logProjectUpdate = logProjectUpdate;
const logProjectDelete = async (userId, userName, userEmail, projectName, projectId, req) => {
    await (0, exports.logActivity)({
        userId,
        userName,
        userEmail,
        eventType: 'delete',
        eventCategory: 'Project Management',
        module: 'Projects',
        action: 'Delete Project',
        summary: `Deleted project: ${projectName}`,
        details: `User ${userName} deleted project: ${projectName}`,
        metadata: { projectName, projectId },
        req
    });
};
exports.logProjectDelete = logProjectDelete;
const logRoleCreate = async (userId, userName, userEmail, roleName, roleId, req) => {
    await (0, exports.logActivity)({
        userId,
        userName,
        userEmail,
        eventType: 'create',
        eventCategory: 'Role Management',
        module: 'Roles',
        action: 'Create Role',
        summary: `Created role: ${roleName}`,
        details: `User ${userName} created a new role: ${roleName}`,
        metadata: { roleName, roleId },
        req
    });
};
exports.logRoleCreate = logRoleCreate;
const logRoleUpdate = async (userId, userName, userEmail, roleName, roleId, changes, req) => {
    await (0, exports.logActivity)({
        userId,
        userName,
        userEmail,
        eventType: 'update',
        eventCategory: 'Role Management',
        module: 'Roles',
        action: 'Update Role',
        summary: `Updated role: ${roleName}`,
        details: `User ${userName} updated role: ${roleName}`,
        metadata: { roleName, roleId, changes },
        req
    });
};
exports.logRoleUpdate = logRoleUpdate;
const logRoleDelete = async (userId, userName, userEmail, roleName, roleId, req) => {
    await (0, exports.logActivity)({
        userId,
        userName,
        userEmail,
        eventType: 'delete',
        eventCategory: 'Role Management',
        module: 'Roles',
        action: 'Delete Role',
        summary: `Deleted role: ${roleName}`,
        details: `User ${userName} deleted role: ${roleName}`,
        metadata: { roleName, roleId },
        req
    });
};
exports.logRoleDelete = logRoleDelete;
//# sourceMappingURL=activityLogger.js.map
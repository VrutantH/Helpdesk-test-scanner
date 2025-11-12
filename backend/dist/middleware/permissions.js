"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = void 0;
const Permission_1 = require("../models/Permission");
const requirePermission = (code) => async (req, res, next) => {
    try {
        const perm = await Permission_1.Permission.findOne({ code });
        if (!perm) {
            res.status(403).json({ success: false, message: `Permission ${code} not found` });
            return;
        }
        const rolePerms = req.user?.role?.permissions || [];
        const permId = perm._id.toString();
        const has = rolePerms.some((p) => {
            try {
                return p.toString() === permId;
            }
            catch (e) {
                return false;
            }
        });
        if (!has) {
            res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
            return;
        }
        next();
        return;
    }
    catch (err) {
        console.error('Permission check error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
    }
};
exports.requirePermission = requirePermission;
//# sourceMappingURL=permissions.js.map
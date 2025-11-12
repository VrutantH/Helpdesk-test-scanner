"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEulaHistory = exports.checkEulaStatus = exports.acceptEula = void 0;
const User_1 = require("../models/User");
const EulaAcceptance_1 = __importDefault(require("../models/EulaAcceptance"));
const CURRENT_EULA_VERSION = '1.0';
const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        const ips = forwarded.split(',');
        return ips[0].trim();
    }
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        return realIp;
    }
    return req.socket.remoteAddress || 'Unknown';
};
const acceptEula = async (req, res) => {
    try {
        const { userId, eulaVersion } = req.body;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        const user = await User_1.User.findById(userId).populate('role');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        let roleCode = 'user';
        if (user.role && typeof user.role === 'object' && 'code' in user.role) {
            roleCode = user.role.code.toLowerCase();
        }
        console.log(`🔍 User role: ${roleCode}, Role object:`, user.role);
        const versionToAccept = eulaVersion || CURRENT_EULA_VERSION;
        const existingAcceptance = await EulaAcceptance_1.default.findOne({
            userId: user._id,
            eulaVersion: versionToAccept
        });
        if (existingAcceptance) {
            console.log(`ℹ️  User ${user.email} has already accepted EULA version ${versionToAccept}`);
            return res.json({
                success: true,
                message: 'EULA already accepted',
                acceptance: {
                    id: existingAcceptance._id,
                    userName: existingAcceptance.userName,
                    userEmail: existingAcceptance.userEmail,
                    userRole: existingAcceptance.userRole,
                    ipAddress: existingAcceptance.ipAddress,
                    eulaVersion: existingAcceptance.eulaVersion,
                    acceptedAt: existingAcceptance.acceptedAt
                }
            });
        }
        const ipAddress = getClientIp(req);
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const eulaAcceptance = await EulaAcceptance_1.default.create({
            userId: user._id,
            userName: `${user.firstName} ${user.lastName}`.trim(),
            userEmail: user.email,
            userRole: roleCode,
            ipAddress,
            userAgent,
            eulaVersion: versionToAccept,
            acceptedAt: new Date()
        });
        console.log(`✅ EULA Acceptance recorded - User: ${user.email}, IP: ${ipAddress}, Role: ${roleCode}, Version: ${eulaAcceptance.eulaVersion}`);
        return res.json({
            success: true,
            message: 'EULA accepted successfully',
            acceptance: {
                id: eulaAcceptance._id,
                userName: eulaAcceptance.userName,
                userEmail: eulaAcceptance.userEmail,
                userRole: eulaAcceptance.userRole,
                ipAddress: eulaAcceptance.ipAddress,
                eulaVersion: eulaAcceptance.eulaVersion,
                acceptedAt: eulaAcceptance.acceptedAt
            }
        });
    }
    catch (error) {
        console.error('❌ Accept EULA error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.acceptEula = acceptEula;
const checkEulaStatus = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        const user = await User_1.User.findById(userId).populate('role');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const acceptance = await EulaAcceptance_1.default.findOne({
            userId: user._id,
            eulaVersion: CURRENT_EULA_VERSION
        }).sort({ acceptedAt: -1 });
        const hasAccepted = !!acceptance;
        console.log(`ℹ️  EULA Status check - User: ${user.email}, Accepted: ${hasAccepted}, Version: ${CURRENT_EULA_VERSION}`);
        return res.json({
            success: true,
            eulaAccepted: hasAccepted,
            eulaVersion: CURRENT_EULA_VERSION,
            acceptance: acceptance ? {
                ipAddress: acceptance.ipAddress,
                acceptedAt: acceptance.acceptedAt,
                eulaVersion: acceptance.eulaVersion
            } : null
        });
    }
    catch (error) {
        console.error('❌ Check EULA status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.checkEulaStatus = checkEulaStatus;
const getEulaHistory = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        const acceptances = await EulaAcceptance_1.default.find({ userId })
            .sort({ acceptedAt: -1 })
            .limit(10);
        return res.json({
            success: true,
            count: acceptances.length,
            acceptances: acceptances.map(acc => ({
                id: acc._id,
                userName: acc.userName,
                userEmail: acc.userEmail,
                userRole: acc.userRole,
                ipAddress: acc.ipAddress,
                userAgent: acc.userAgent,
                eulaVersion: acc.eulaVersion,
                acceptedAt: acc.acceptedAt
            }))
        });
    }
    catch (error) {
        console.error('❌ Get EULA history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getEulaHistory = getEulaHistory;
//# sourceMappingURL=eulaController.js.map
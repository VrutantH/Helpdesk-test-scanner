"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAccessLogs = exports.getAccessStats = exports.createAccessLog = exports.getAccessLogById = exports.getAllAccessLogs = void 0;
const AccessLog_1 = __importDefault(require("../models/AccessLog"));
const getAllAccessLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, userId, action, success, startDate, endDate, search } = req.query;
        const filter = {};
        if (userId) {
            filter.userId = userId;
        }
        if (action) {
            filter.action = action;
        }
        if (success !== undefined) {
            filter.success = success === 'true';
        }
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) {
                filter.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.timestamp.$lte = new Date(endDate);
            }
        }
        if (search) {
            filter.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } },
                { projectName: { $regex: search, $options: 'i' } },
                { ipAddress: { $regex: search, $options: 'i' } }
            ];
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const [logs, total] = await Promise.all([
            AccessLog_1.default.find(filter)
                .populate('userId', 'firstName lastName email')
                .populate('project', 'name code')
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            AccessLog_1.default.countDocuments(filter)
        ]);
        res.status(200).json({
            success: true,
            data: logs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        console.error('Error fetching access logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch access logs',
            error: error.message
        });
    }
};
exports.getAllAccessLogs = getAllAccessLogs;
const getAccessLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await AccessLog_1.default.findById(id)
            .populate('userId', 'firstName lastName email')
            .populate('project', 'name code');
        if (!log) {
            res.status(404).json({
                success: false,
                message: 'Access log not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: log
        });
    }
    catch (error) {
        console.error('Error fetching access log:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch access log',
            error: error.message
        });
    }
};
exports.getAccessLogById = getAccessLogById;
const createAccessLog = async (req, res) => {
    try {
        const logData = {
            ...req.body,
            timestamp: new Date()
        };
        const log = new AccessLog_1.default(logData);
        await log.save();
        res.status(201).json({
            success: true,
            message: 'Access log created successfully',
            data: log
        });
    }
    catch (error) {
        console.error('Error creating access log:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create access log',
            error: error.message
        });
    }
};
exports.createAccessLog = createAccessLog;
const getAccessStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.timestamp = {};
            if (startDate) {
                dateFilter.timestamp.$gte = new Date(startDate);
            }
            if (endDate) {
                dateFilter.timestamp.$lte = new Date(endDate);
            }
        }
        const [loginStats, failureStats, totalLogs] = await Promise.all([
            AccessLog_1.default.aggregate([
                { $match: { ...dateFilter, action: 'login' } },
                { $group: { _id: '$success', count: { $sum: 1 } } }
            ]),
            AccessLog_1.default.aggregate([
                { $match: { ...dateFilter, success: false } },
                { $group: { _id: '$failureReason', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            AccessLog_1.default.countDocuments(dateFilter)
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalLogs,
                loginStats,
                failureStats
            }
        });
    }
    catch (error) {
        console.error('Error fetching access stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch access statistics',
            error: error.message
        });
    }
};
exports.getAccessStats = getAccessStats;
const exportAccessLogs = async (req, res) => {
    try {
        const { userId, action, success, startDate, endDate } = req.query;
        const filter = {};
        if (userId)
            filter.userId = userId;
        if (action)
            filter.action = action;
        if (success !== undefined)
            filter.success = success === 'true';
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate)
                filter.timestamp.$gte = new Date(startDate);
            if (endDate)
                filter.timestamp.$lte = new Date(endDate);
        }
        const logs = await AccessLog_1.default.find(filter)
            .populate('userId', 'firstName lastName email')
            .populate('project', 'name code')
            .sort({ timestamp: -1 })
            .limit(10000)
            .lean();
        res.status(200).json({
            success: true,
            data: logs,
            count: logs.length
        });
    }
    catch (error) {
        console.error('Error exporting access logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export access logs',
            error: error.message
        });
    }
};
exports.exportAccessLogs = exportAccessLogs;
//# sourceMappingURL=accessLogController.js.map
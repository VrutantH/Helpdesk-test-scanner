"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportActivityLogs = exports.getActivityStats = exports.createActivityLog = exports.getActivityLogById = exports.getAllActivityLogs = void 0;
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const getAllActivityLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, userId, action, entity, startDate, endDate, search } = req.query;
        const filter = {};
        if (userId) {
            filter.userId = userId;
        }
        if (action) {
            filter.action = action;
        }
        if (entity) {
            filter.entity = entity;
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
                { entityName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const [logs, total] = await Promise.all([
            ActivityLog_1.default.find(filter)
                .populate('userId', 'firstName lastName email')
                .populate('project', 'name code')
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            ActivityLog_1.default.countDocuments(filter)
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
        console.error('Error fetching activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity logs',
            error: error.message
        });
    }
};
exports.getAllActivityLogs = getAllActivityLogs;
const getActivityLogById = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await ActivityLog_1.default.findById(id)
            .populate('userId', 'firstName lastName email')
            .populate('project', 'name code');
        if (!log) {
            res.status(404).json({
                success: false,
                message: 'Activity log not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: log
        });
    }
    catch (error) {
        console.error('Error fetching activity log:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity log',
            error: error.message
        });
    }
};
exports.getActivityLogById = getActivityLogById;
const createActivityLog = async (req, res) => {
    try {
        const logData = {
            ...req.body,
            timestamp: new Date()
        };
        const log = new ActivityLog_1.default(logData);
        await log.save();
        res.status(201).json({
            success: true,
            message: 'Activity log created successfully',
            data: log
        });
    }
    catch (error) {
        console.error('Error creating activity log:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create activity log',
            error: error.message
        });
    }
};
exports.createActivityLog = createActivityLog;
const getActivityStats = async (req, res) => {
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
        const [actionStats, entityStats, totalLogs] = await Promise.all([
            ActivityLog_1.default.aggregate([
                { $match: dateFilter },
                { $group: { _id: '$action', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            ActivityLog_1.default.aggregate([
                { $match: dateFilter },
                { $group: { _id: '$entity', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            ActivityLog_1.default.countDocuments(dateFilter)
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalLogs,
                byAction: actionStats,
                byEntity: entityStats
            }
        });
    }
    catch (error) {
        console.error('Error fetching activity stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity statistics',
            error: error.message
        });
    }
};
exports.getActivityStats = getActivityStats;
const exportActivityLogs = async (req, res) => {
    try {
        const { userId, action, entity, startDate, endDate } = req.query;
        const filter = {};
        if (userId)
            filter.userId = userId;
        if (action)
            filter.action = action;
        if (entity)
            filter.entity = entity;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate)
                filter.timestamp.$gte = new Date(startDate);
            if (endDate)
                filter.timestamp.$lte = new Date(endDate);
        }
        const logs = await ActivityLog_1.default.find(filter)
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
        console.error('Error exporting activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export activity logs',
            error: error.message
        });
    }
};
exports.exportActivityLogs = exportActivityLogs;
//# sourceMappingURL=activityLogController.js.map
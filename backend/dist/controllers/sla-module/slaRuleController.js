"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleSLARuleStatus = exports.deleteSLARule = exports.updateSLARule = exports.createSLARule = exports.getSLARuleById = exports.getAllSLARules = void 0;
const SLARule_1 = __importDefault(require("../../models/sla-module/SLARule"));
const getAllSLARules = async (req, res) => {
    try {
        const { projectId, priority, isActive } = req.query;
        const filter = {};
        if (projectId) {
            filter.projectIds = projectId;
        }
        if (priority) {
            filter.priority = priority;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }
        const slaRules = await SLARule_1.default.find(filter)
            .populate('projectIds', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: slaRules,
        });
    }
    catch (error) {
        console.error('Error fetching SLA rules:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch SLA rules',
            error: error.message,
        });
    }
};
exports.getAllSLARules = getAllSLARules;
const getSLARuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const slaRule = await SLARule_1.default.findById(id)
            .populate('projectIds', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        if (!slaRule) {
            res.status(404).json({
                success: false,
                message: 'SLA rule not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: slaRule,
        });
    }
    catch (error) {
        console.error('Error fetching SLA rule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch SLA rule',
            error: error.message,
        });
    }
};
exports.getSLARuleById = getSLARuleById;
const createSLARule = async (req, res) => {
    try {
        const slaRuleData = {
            ...req.body,
            createdBy: req.user?.userId,
        };
        const slaRule = new SLARule_1.default(slaRuleData);
        await slaRule.save();
        const populatedRule = await SLARule_1.default.findById(slaRule._id)
            .populate('projectIds', 'name code')
            .populate('createdBy', 'firstName lastName email');
        res.status(201).json({
            success: true,
            message: 'SLA rule created successfully',
            data: populatedRule,
        });
    }
    catch (error) {
        console.error('Error creating SLA rule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create SLA rule',
            error: error.message,
        });
    }
};
exports.createSLARule = createSLARule;
const updateSLARule = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.userId,
        };
        const slaRule = await SLARule_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate('projectIds', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        if (!slaRule) {
            res.status(404).json({
                success: false,
                message: 'SLA rule not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'SLA rule updated successfully',
            data: slaRule,
        });
    }
    catch (error) {
        console.error('Error updating SLA rule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update SLA rule',
            error: error.message,
        });
    }
};
exports.updateSLARule = updateSLARule;
const deleteSLARule = async (req, res) => {
    try {
        const { id } = req.params;
        const slaRule = await SLARule_1.default.findByIdAndDelete(id);
        if (!slaRule) {
            res.status(404).json({
                success: false,
                message: 'SLA rule not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'SLA rule deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting SLA rule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete SLA rule',
            error: error.message,
        });
    }
};
exports.deleteSLARule = deleteSLARule;
const toggleSLARuleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const slaRule = await SLARule_1.default.findById(id);
        if (!slaRule) {
            res.status(404).json({
                success: false,
                message: 'SLA rule not found',
            });
            return;
        }
        slaRule.isActive = !slaRule.isActive;
        slaRule.updatedBy = req.user?.userId;
        await slaRule.save();
        res.status(200).json({
            success: true,
            message: `SLA rule ${slaRule.isActive ? 'activated' : 'deactivated'} successfully`,
            data: slaRule,
        });
    }
    catch (error) {
        console.error('Error toggling SLA rule status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle SLA rule status',
            error: error.message,
        });
    }
};
exports.toggleSLARuleStatus = toggleSLARuleStatus;
//# sourceMappingURL=slaRuleController.js.map
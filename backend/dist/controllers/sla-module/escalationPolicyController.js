"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleEscalationPolicyStatus = exports.deleteEscalationPolicy = exports.updateEscalationPolicy = exports.createEscalationPolicy = exports.getEscalationPolicyById = exports.getAllEscalationPolicies = void 0;
const EscalationPolicy_1 = __importDefault(require("../../models/sla-module/EscalationPolicy"));
const getAllEscalationPolicies = async (req, res) => {
    try {
        const { projectId, isActive } = req.query;
        const filter = {};
        if (projectId) {
            filter.projectId = projectId;
        }
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }
        const policies = await EscalationPolicy_1.default.find(filter)
            .populate('projectId', 'name code')
            .populate('projectIds', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: policies,
        });
    }
    catch (error) {
        console.error('Error fetching escalation policies:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch escalation policies',
            error: error.message,
        });
    }
};
exports.getAllEscalationPolicies = getAllEscalationPolicies;
const getEscalationPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await EscalationPolicy_1.default.findById(id)
            .populate('projectId', 'name code')
            .populate('projectIds', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        if (!policy) {
            res.status(404).json({
                success: false,
                message: 'Escalation policy not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: policy,
        });
    }
    catch (error) {
        console.error('Error fetching escalation policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch escalation policy',
            error: error.message,
        });
    }
};
exports.getEscalationPolicyById = getEscalationPolicyById;
const createEscalationPolicy = async (req, res) => {
    try {
        const policyData = {
            ...req.body,
            createdBy: req.user?.userId,
        };
        const policy = new EscalationPolicy_1.default(policyData);
        await policy.save();
        const populatedPolicy = await EscalationPolicy_1.default.findById(policy._id)
            .populate('projectId', 'name code')
            .populate('projectIds', 'name code')
            .populate('createdBy', 'firstName lastName email');
        res.status(201).json({
            success: true,
            message: 'Escalation policy created successfully',
            data: populatedPolicy,
        });
    }
    catch (error) {
        console.error('Error creating escalation policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create escalation policy',
            error: error.message,
        });
    }
};
exports.createEscalationPolicy = createEscalationPolicy;
const updateEscalationPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedBy: req.user?.userId,
        };
        const policy = await EscalationPolicy_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate('projectId', 'name code')
            .populate('projectIds', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        if (!policy) {
            res.status(404).json({
                success: false,
                message: 'Escalation policy not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Escalation policy updated successfully',
            data: policy,
        });
    }
    catch (error) {
        console.error('Error updating escalation policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update escalation policy',
            error: error.message,
        });
    }
};
exports.updateEscalationPolicy = updateEscalationPolicy;
const deleteEscalationPolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await EscalationPolicy_1.default.findByIdAndDelete(id);
        if (!policy) {
            res.status(404).json({
                success: false,
                message: 'Escalation policy not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Escalation policy deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting escalation policy:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete escalation policy',
            error: error.message,
        });
    }
};
exports.deleteEscalationPolicy = deleteEscalationPolicy;
const toggleEscalationPolicyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const policy = await EscalationPolicy_1.default.findById(id);
        if (!policy) {
            res.status(404).json({
                success: false,
                message: 'Escalation policy not found',
            });
            return;
        }
        policy.isActive = !policy.isActive;
        policy.updatedBy = req.user?.userId;
        await policy.save();
        res.status(200).json({
            success: true,
            message: `Escalation policy ${policy.isActive ? 'activated' : 'deactivated'} successfully`,
            data: policy,
        });
    }
    catch (error) {
        console.error('Error toggling escalation policy status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle escalation policy status',
            error: error.message,
        });
    }
};
exports.toggleEscalationPolicyStatus = toggleEscalationPolicyStatus;
//# sourceMappingURL=escalationPolicyController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleAutoAssignmentRuleStatus = exports.deleteAutoAssignmentRule = exports.updateAutoAssignmentRule = exports.createAutoAssignmentRule = exports.getAutoAssignmentRuleById = exports.getAutoAssignmentRules = void 0;
const ticket_module_1 = require("../../models/ticket-module");
const getAutoAssignmentRules = async (req, res) => {
    try {
        const { isActive } = req.query;
        const filter = {};
        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }
        const rules = await ticket_module_1.AutoAssignment.find(filter).sort({ priority: -1, createdAt: -1 });
        return res.json({
            success: true,
            data: rules,
            message: 'Auto assignment rules retrieved successfully',
        });
    }
    catch (error) {
        console.error('Error fetching auto assignment rules:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch auto assignment rules',
        });
    }
};
exports.getAutoAssignmentRules = getAutoAssignmentRules;
const getAutoAssignmentRuleById = async (req, res) => {
    try {
        const { id } = req.params;
        const rule = await ticket_module_1.AutoAssignment.findById(id);
        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Auto assignment rule not found',
            });
        }
        return res.json({
            success: true,
            data: rule,
            message: 'Auto assignment rule retrieved successfully',
        });
    }
    catch (error) {
        console.error('Error fetching auto assignment rule:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch auto assignment rule',
        });
    }
};
exports.getAutoAssignmentRuleById = getAutoAssignmentRuleById;
const createAutoAssignmentRule = async (req, res) => {
    try {
        const ruleData = req.body;
        const existing = await ticket_module_1.AutoAssignment.findOne({ ruleName: ruleData.ruleName });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Rule with this name already exists',
            });
        }
        ruleData.lastModifiedBy = req.body.userId || 'System';
        ruleData.lastModified = new Date();
        ruleData.executionCount = 0;
        const rule = new ticket_module_1.AutoAssignment(ruleData);
        await rule.save();
        return res.status(201).json({
            success: true,
            data: rule,
            message: 'Auto assignment rule created successfully',
        });
    }
    catch (error) {
        console.error('Error creating auto assignment rule:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create auto assignment rule',
        });
    }
};
exports.createAutoAssignmentRule = createAutoAssignmentRule;
const updateAutoAssignmentRule = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        updateData.lastModifiedBy = req.body.userId || 'System';
        updateData.lastModified = new Date();
        const rule = await ticket_module_1.AutoAssignment.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Auto assignment rule not found',
            });
        }
        return res.json({
            success: true,
            data: rule,
            message: 'Auto assignment rule updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating auto assignment rule:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update auto assignment rule',
        });
    }
};
exports.updateAutoAssignmentRule = updateAutoAssignmentRule;
const deleteAutoAssignmentRule = async (req, res) => {
    try {
        const { id } = req.params;
        const rule = await ticket_module_1.AutoAssignment.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Auto assignment rule not found',
            });
        }
        return res.json({
            success: true,
            data: rule,
            message: 'Auto assignment rule deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting auto assignment rule:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete auto assignment rule',
        });
    }
};
exports.deleteAutoAssignmentRule = deleteAutoAssignmentRule;
const toggleAutoAssignmentRuleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const rule = await ticket_module_1.AutoAssignment.findById(id);
        if (!rule) {
            return res.status(404).json({
                success: false,
                error: 'Auto assignment rule not found',
            });
        }
        rule.isActive = !rule.isActive;
        rule.lastModifiedBy = req.body.userId || 'System';
        rule.lastModified = new Date();
        await rule.save();
        return res.json({
            success: true,
            data: rule,
            message: `Rule ${rule.isActive ? 'activated' : 'deactivated'} successfully`,
        });
    }
    catch (error) {
        console.error('Error toggling auto assignment rule status:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to toggle rule status',
        });
    }
};
exports.toggleAutoAssignmentRuleStatus = toggleAutoAssignmentRuleStatus;
//# sourceMappingURL=autoAssignmentController.js.map
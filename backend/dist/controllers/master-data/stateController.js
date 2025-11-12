"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStateStatus = exports.deleteState = exports.updateState = exports.createState = exports.getStateById = exports.getStates = void 0;
const State_1 = __importDefault(require("../../models/master-data/State"));
const getStates = async (req, res) => {
    try {
        const { includeInactive } = req.query;
        const filter = includeInactive === 'true' ? {} : { isActive: true };
        const states = await State_1.default.find(filter).sort({ displayOrder: 1, value: 1 });
        console.log(`📋 Retrieved ${states.length} states`);
        return res.json({
            success: true,
            data: states
        });
    }
    catch (error) {
        console.error('❌ Error fetching states:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch states'
        });
    }
};
exports.getStates = getStates;
const getStateById = async (req, res) => {
    try {
        const { id } = req.params;
        const state = await State_1.default.findById(id);
        if (!state) {
            return res.status(404).json({
                success: false,
                message: 'State not found'
            });
        }
        return res.json({
            success: true,
            data: state
        });
    }
    catch (error) {
        console.error('❌ Error fetching state:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch state'
        });
    }
};
exports.getStateById = getStateById;
const createState = async (req, res) => {
    try {
        const { key, value, description, displayOrder, isActive, country } = req.body;
        const existingState = await State_1.default.findOne({ key: key.toLowerCase() });
        if (existingState) {
            return res.status(400).json({
                success: false,
                message: 'State with this key already exists'
            });
        }
        const state = await State_1.default.create({
            key: key.toLowerCase(),
            value,
            description,
            displayOrder: displayOrder || 0,
            isActive: isActive !== undefined ? isActive : true,
            country: country || 'india'
        });
        console.log(`✅ Created state: ${state.value}`);
        return res.status(201).json({
            success: true,
            message: 'State created successfully',
            data: state
        });
    }
    catch (error) {
        console.error('❌ Error creating state:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create state'
        });
    }
};
exports.createState = createState;
const updateState = async (req, res) => {
    try {
        const { id } = req.params;
        const { key, value, description, displayOrder, isActive, country } = req.body;
        const state = await State_1.default.findByIdAndUpdate(id, {
            key: key?.toLowerCase(),
            value,
            description,
            displayOrder,
            isActive,
            country,
            updatedAt: new Date()
        }, { new: true, runValidators: true });
        if (!state) {
            return res.status(404).json({
                success: false,
                message: 'State not found'
            });
        }
        console.log(`✅ Updated state: ${state.value}`);
        return res.json({
            success: true,
            message: 'State updated successfully',
            data: state
        });
    }
    catch (error) {
        console.error('❌ Error updating state:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update state'
        });
    }
};
exports.updateState = updateState;
const deleteState = async (req, res) => {
    try {
        const { id } = req.params;
        const state = await State_1.default.findByIdAndDelete(id);
        if (!state) {
            return res.status(404).json({
                success: false,
                message: 'State not found'
            });
        }
        console.log(`🗑️  Deleted state: ${state.value}`);
        return res.json({
            success: true,
            message: 'State deleted successfully'
        });
    }
    catch (error) {
        console.error('❌ Error deleting state:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete state'
        });
    }
};
exports.deleteState = deleteState;
const toggleStateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const state = await State_1.default.findById(id);
        if (!state) {
            return res.status(404).json({
                success: false,
                message: 'State not found'
            });
        }
        state.isActive = !state.isActive;
        await state.save();
        console.log(`🔄 Toggled state status: ${state.value} - ${state.isActive ? 'Active' : 'Inactive'}`);
        return res.json({
            success: true,
            message: `State ${state.isActive ? 'activated' : 'deactivated'} successfully`,
            data: state
        });
    }
    catch (error) {
        console.error('❌ Error toggling state status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to toggle state status'
        });
    }
};
exports.toggleStateStatus = toggleStateStatus;
//# sourceMappingURL=stateController.js.map
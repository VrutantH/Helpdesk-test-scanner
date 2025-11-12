"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleIntegrationStatus = exports.deleteIntegration = exports.updateIntegration = exports.createIntegration = exports.getIntegrationById = exports.getAllIntegrations = exports.getIntegrationsByProject = void 0;
const Integration_1 = require("../models/Integration");
const mongoose_1 = __importDefault(require("mongoose"));
const getIntegrationsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid project ID',
            });
            return;
        }
        const integrations = await Integration_1.Integration.find({ projectId })
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        const formattedIntegrations = integrations.map((integration) => {
            const obj = integration.toObject();
            return {
                ...obj,
                config: obj.config instanceof Map ? Object.fromEntries(obj.config) : obj.config || {},
            };
        });
        res.status(200).json({
            success: true,
            data: formattedIntegrations,
        });
    }
    catch (error) {
        console.error('Error fetching integrations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch integrations',
            error: error.message,
        });
    }
};
exports.getIntegrationsByProject = getIntegrationsByProject;
const getAllIntegrations = async (req, res) => {
    try {
        const { projectId, type, status } = req.query;
        const query = {};
        if (projectId && mongoose_1.default.Types.ObjectId.isValid(projectId)) {
            query.projectId = projectId;
        }
        if (type) {
            query.type = type;
        }
        if (status) {
            query.status = status;
        }
        const integrations = await Integration_1.Integration.find(query)
            .populate('projectId', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        const formattedIntegrations = integrations.map((integration) => {
            const obj = integration.toObject();
            return {
                ...obj,
                config: obj.config instanceof Map ? Object.fromEntries(obj.config) : obj.config || {},
            };
        });
        res.status(200).json({
            success: true,
            data: formattedIntegrations,
        });
    }
    catch (error) {
        console.error('Error fetching integrations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch integrations',
            error: error.message,
        });
    }
};
exports.getAllIntegrations = getAllIntegrations;
const getIntegrationById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid integration ID',
            });
            return;
        }
        const integration = await Integration_1.Integration.findById(id)
            .populate('projectId', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        if (!integration) {
            res.status(404).json({
                success: false,
                message: 'Integration not found',
            });
            return;
        }
        const obj = integration.toObject();
        res.status(200).json({
            success: true,
            data: {
                ...obj,
                config: obj.config instanceof Map ? Object.fromEntries(obj.config) : obj.config || {},
            },
        });
    }
    catch (error) {
        console.error('Error fetching integration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch integration',
            error: error.message,
        });
    }
};
exports.getIntegrationById = getIntegrationById;
const createIntegration = async (req, res) => {
    try {
        const { projectId, type, provider, status, config } = req.body;
        if (!projectId || !type || !provider || !config) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: projectId, type, provider, config',
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid project ID',
            });
            return;
        }
        const existingIntegration = await Integration_1.Integration.findOne({ projectId, type });
        if (existingIntegration) {
            res.status(409).json({
                success: false,
                message: `Integration type '${type}' already exists for this project`,
            });
            return;
        }
        const integration = new Integration_1.Integration({
            projectId,
            type,
            provider,
            status: status || 'active',
            config: new Map(Object.entries(config)),
            createdBy: req.user?.userId,
            updatedBy: req.user?.userId,
        });
        await integration.save();
        const populatedIntegration = await Integration_1.Integration.findById(integration._id)
            .populate('projectId', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        const obj = populatedIntegration.toObject();
        res.status(201).json({
            success: true,
            message: 'Integration created successfully',
            data: {
                ...obj,
                config: obj.config instanceof Map ? Object.fromEntries(obj.config) : obj.config || {},
            },
        });
    }
    catch (error) {
        console.error('Error creating integration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create integration',
            error: error.message,
        });
    }
};
exports.createIntegration = createIntegration;
const updateIntegration = async (req, res) => {
    try {
        const { id } = req.params;
        const { provider, status, config } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid integration ID',
            });
            return;
        }
        const integration = await Integration_1.Integration.findById(id);
        if (!integration) {
            res.status(404).json({
                success: false,
                message: 'Integration not found',
            });
            return;
        }
        if (provider)
            integration.provider = provider;
        if (status)
            integration.status = status;
        if (config)
            integration.config = new Map(Object.entries(config));
        integration.updatedBy = req.user?.userId;
        await integration.save();
        const populatedIntegration = await Integration_1.Integration.findById(integration._id)
            .populate('projectId', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        const obj = populatedIntegration.toObject();
        res.status(200).json({
            success: true,
            message: 'Integration updated successfully',
            data: {
                ...obj,
                config: obj.config instanceof Map ? Object.fromEntries(obj.config) : obj.config || {},
            },
        });
    }
    catch (error) {
        console.error('Error updating integration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update integration',
            error: error.message,
        });
    }
};
exports.updateIntegration = updateIntegration;
const deleteIntegration = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid integration ID',
            });
            return;
        }
        const integration = await Integration_1.Integration.findByIdAndDelete(id);
        if (!integration) {
            res.status(404).json({
                success: false,
                message: 'Integration not found',
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Integration deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting integration:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete integration',
            error: error.message,
        });
    }
};
exports.deleteIntegration = deleteIntegration;
const toggleIntegrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: 'Invalid integration ID',
            });
            return;
        }
        const integration = await Integration_1.Integration.findById(id);
        if (!integration) {
            res.status(404).json({
                success: false,
                message: 'Integration not found',
            });
            return;
        }
        integration.status = integration.status === 'active' ? 'inactive' : 'active';
        integration.updatedBy = req.user?.userId;
        await integration.save();
        const populatedIntegration = await Integration_1.Integration.findById(integration._id)
            .populate('projectId', 'name code')
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        const obj = populatedIntegration.toObject();
        res.status(200).json({
            success: true,
            message: `Integration ${integration.status === 'active' ? 'activated' : 'deactivated'} successfully`,
            data: {
                ...obj,
                config: obj.config instanceof Map ? Object.fromEntries(obj.config) : obj.config || {},
            },
        });
    }
    catch (error) {
        console.error('Error toggling integration status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle integration status',
            error: error.message,
        });
    }
};
exports.toggleIntegrationStatus = toggleIntegrationStatus;
//# sourceMappingURL=integrationController.js.map
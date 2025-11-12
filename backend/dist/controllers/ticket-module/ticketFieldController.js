"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDefaultTicketFields = exports.deleteTicketField = exports.updateTicketField = exports.createTicketField = exports.getTicketFieldById = exports.getTicketFields = void 0;
const ticket_module_1 = require("../../models/ticket-module");
const getTicketFields = async (req, res) => {
    try {
        const { type, visibleInAgentPortal, visibleInCustomerPortal } = req.query;
        const filter = { isActive: true };
        if (type) {
            filter.type = type;
        }
        if (visibleInAgentPortal !== undefined) {
            filter.visibleInAgentPortal = visibleInAgentPortal === 'true';
        }
        if (visibleInCustomerPortal !== undefined) {
            filter.visibleInCustomerPortal = visibleInCustomerPortal === 'true';
        }
        const fields = await ticket_module_1.TicketField.find(filter).sort({ displayOrder: 1 });
        return res.json({
            success: true,
            data: fields,
            message: 'Ticket fields retrieved successfully',
        });
    }
    catch (error) {
        console.error('Error fetching ticket fields:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch ticket fields',
        });
    }
};
exports.getTicketFields = getTicketFields;
const getTicketFieldById = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await ticket_module_1.TicketField.findOne({ $or: [{ _id: id }, { id: id }, { apiName: id }] });
        if (!field) {
            return res.status(404).json({
                success: false,
                error: 'Ticket field not found',
            });
        }
        return res.json({
            success: true,
            data: field,
            message: 'Ticket field retrieved successfully',
        });
    }
    catch (error) {
        console.error('Error fetching ticket field:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch ticket field',
        });
    }
};
exports.getTicketFieldById = getTicketFieldById;
const createTicketField = async (req, res) => {
    try {
        const fieldData = req.body;
        const existing = await ticket_module_1.TicketField.findOne({ apiName: fieldData.apiName });
        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'Field with this API name already exists',
            });
        }
        const field = new ticket_module_1.TicketField(fieldData);
        await field.save();
        return res.status(201).json({
            success: true,
            data: field,
            message: 'Ticket field created successfully',
        });
    }
    catch (error) {
        console.error('Error creating ticket field:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create ticket field',
        });
    }
};
exports.createTicketField = createTicketField;
const updateTicketField = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const field = await ticket_module_1.TicketField.findOneAndUpdate({ $or: [{ _id: id }, { id: id }, { apiName: id }] }, { $set: updateData }, { new: true, runValidators: true });
        if (!field) {
            return res.status(404).json({
                success: false,
                error: 'Ticket field not found',
            });
        }
        return res.json({
            success: true,
            data: field,
            message: 'Ticket field updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating ticket field:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update ticket field',
        });
    }
};
exports.updateTicketField = updateTicketField;
const deleteTicketField = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await ticket_module_1.TicketField.findOneAndUpdate({ $or: [{ _id: id }, { id: id }, { apiName: id }] }, { $set: { isActive: false } }, { new: true });
        if (!field) {
            return res.status(404).json({
                success: false,
                error: 'Ticket field not found',
            });
        }
        return res.json({
            success: true,
            data: field,
            message: 'Ticket field deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting ticket field:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete ticket field',
        });
    }
};
exports.deleteTicketField = deleteTicketField;
const seedDefaultTicketFields = async (req, res) => {
    try {
        const defaultFields = [
            {
                id: 'agent',
                icon: '👤',
                labelAgentPortal: 'Agent',
                labelCustomerPortal: 'Assigned To',
                apiName: 'agent',
                type: 'System',
                fieldType: 'dropdown',
                required: false,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: false,
                displayOrder: 1,
            },
            {
                id: 'brand',
                icon: '🏢',
                labelAgentPortal: 'Project',
                labelCustomerPortal: 'Project',
                apiName: 'brand',
                type: 'System',
                fieldType: 'dropdown',
                required: true,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: true,
                displayOrder: 2,
            },
            {
                id: 'category',
                icon: '📁',
                labelAgentPortal: 'Category',
                labelCustomerPortal: 'Category',
                apiName: 'category',
                type: 'System',
                fieldType: 'dropdown',
                required: false,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: true,
                displayOrder: 3,
            },
            {
                id: 'cc',
                icon: '📧',
                labelAgentPortal: 'CC',
                labelCustomerPortal: 'CC',
                apiName: 'cc',
                type: 'System',
                fieldType: 'text',
                required: false,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: true,
                displayOrder: 4,
            },
            {
                id: 'description',
                icon: '📝',
                labelAgentPortal: 'Description',
                labelCustomerPortal: 'Description',
                apiName: 'description',
                type: 'System',
                fieldType: 'textarea',
                required: true,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: true,
                displayOrder: 5,
            },
            {
                id: 'external_reference_id',
                icon: '🔗',
                labelAgentPortal: 'External Reference ID',
                labelCustomerPortal: 'Reference ID',
                apiName: 'external_reference_id',
                type: 'System',
                fieldType: 'text',
                required: false,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: false,
                displayOrder: 6,
            },
            {
                id: 'group',
                icon: '👥',
                labelAgentPortal: 'Group',
                labelCustomerPortal: 'Department',
                apiName: 'group',
                type: 'System',
                fieldType: 'dropdown',
                required: false,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: false,
                displayOrder: 7,
            },
            {
                id: 'priority',
                icon: '⚡',
                labelAgentPortal: 'Priority',
                labelCustomerPortal: 'Priority',
                apiName: 'priority',
                type: 'System',
                fieldType: 'dropdown',
                required: false,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: false,
                displayOrder: 8,
            },
            {
                id: 'status',
                icon: '🔄',
                labelAgentPortal: 'Status',
                labelCustomerPortal: 'Status',
                apiName: 'status',
                type: 'System',
                fieldType: 'dropdown',
                required: true,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: true,
                displayOrder: 9,
            },
            {
                id: 'subject',
                icon: '📌',
                labelAgentPortal: 'Subject',
                labelCustomerPortal: 'Subject',
                apiName: 'subject',
                type: 'System',
                fieldType: 'text',
                required: true,
                visibleInAgentPortal: true,
                visibleInCustomerPortal: true,
                displayOrder: 10,
            },
        ];
        for (const field of defaultFields) {
            const existing = await ticket_module_1.TicketField.findOne({ apiName: field.apiName });
            if (!existing) {
                await ticket_module_1.TicketField.create(field);
            }
        }
        const allFields = await ticket_module_1.TicketField.find({}).sort({ displayOrder: 1 });
        return res.json({
            success: true,
            data: allFields,
            message: 'Default ticket fields seeded successfully',
        });
    }
    catch (error) {
        console.error('Error seeding ticket fields:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to seed ticket fields',
        });
    }
};
exports.seedDefaultTicketFields = seedDefaultTicketFields;
//# sourceMappingURL=ticketFieldController.js.map
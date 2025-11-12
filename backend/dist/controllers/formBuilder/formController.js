"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormAuditLogs = exports.deleteForm = exports.updateForm = exports.getFormById = exports.getForms = exports.createForm = void 0;
const Form_1 = __importDefault(require("../../models/formBuilder/Form"));
const FormAuditLog_1 = __importDefault(require("../../models/formBuilder/FormAuditLog"));
const createForm = async (req, res) => {
    try {
        const { name, description, context, fields } = req.body;
        const form = await Form_1.default.create({
            name,
            description,
            context,
            versions: [{ version: 1, fields, createdBy: req.user?._id, createdAt: new Date() }],
            activeVersion: 1,
            auditTrail: [],
        });
        await FormAuditLog_1.default.create({
            formId: form._id,
            action: 'create',
            performedBy: req.user?._id,
            details: { name, description, context, fields },
        });
        res.status(201).json(form);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create form', details: error });
    }
};
exports.createForm = createForm;
const getForms = async (req, res) => {
    try {
        const forms = await Form_1.default.find();
        res.json(forms);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch forms', details: error });
    }
};
exports.getForms = getForms;
const getFormById = async (req, res) => {
    try {
        const form = await Form_1.default.findById(req.params.id);
        if (!form)
            return res.status(404).json({ error: 'Form not found' });
        return res.json(form);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch form', details: error });
    }
};
exports.getFormById = getFormById;
const updateForm = async (req, res) => {
    try {
        const { name, description, context, fields, migrationPolicy } = req.body;
        const form = await Form_1.default.findById(req.params.id);
        if (!form)
            return res.status(404).json({ error: 'Form not found' });
        const newVersion = {
            version: form.versions.length + 1,
            fields,
            createdBy: req.user?._id,
            createdAt: new Date(),
            migrationPolicy,
        };
        form.versions.push(newVersion);
        form.activeVersion = newVersion.version;
        if (name)
            form.name = name;
        if (description)
            form.description = description;
        if (context)
            form.context = context;
        await form.save();
        await FormAuditLog_1.default.create({
            formId: form._id,
            action: 'update',
            performedBy: req.user?._id,
            details: { name, description, context, fields, migrationPolicy },
        });
        return res.json(form);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update form', details: error });
    }
};
exports.updateForm = updateForm;
const deleteForm = async (req, res) => {
    try {
        const form = await Form_1.default.findByIdAndDelete(req.params.id);
        if (!form)
            return res.status(404).json({ error: 'Form not found' });
        await FormAuditLog_1.default.create({
            formId: form._id,
            action: 'delete',
            performedBy: req.user?._id,
            details: {},
        });
        return res.json({ message: 'Form deleted' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to delete form', details: error });
    }
};
exports.deleteForm = deleteForm;
const getFormAuditLogs = async (req, res) => {
    try {
        const logs = await FormAuditLog_1.default.find({ formId: req.params.id });
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs', details: error });
    }
};
exports.getFormAuditLogs = getFormAuditLogs;
//# sourceMappingURL=formController.js.map
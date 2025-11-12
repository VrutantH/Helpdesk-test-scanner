"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const formController_1 = require("../../controllers/formBuilder/formController");
const auth_1 = require("../../middleware/auth");
const permissions_1 = require("../../middleware/permissions");
const router = (0, express_1.Router)();
router.post('/', auth_1.authMiddleware, (0, permissions_1.requirePermission)('FIELDS_MANAGE_TICKET_FORMS'), formController_1.createForm);
router.get('/', auth_1.authMiddleware, (0, permissions_1.requirePermission)('FIELDS_VIEW_TICKET_FIELDS'), formController_1.getForms);
router.get('/:id', auth_1.authMiddleware, (0, permissions_1.requirePermission)('FIELDS_VIEW_TICKET_FIELDS'), formController_1.getFormById);
router.put('/:id', auth_1.authMiddleware, (0, permissions_1.requirePermission)('FIELDS_MANAGE_TICKET_FORMS'), formController_1.updateForm);
router.delete('/:id', auth_1.authMiddleware, (0, permissions_1.requirePermission)('FIELDS_MANAGE_TICKET_FORMS'), formController_1.deleteForm);
router.get('/:id/audit-logs', auth_1.authMiddleware, (0, permissions_1.requirePermission)('FIELDS_MANAGE_TICKET_FORMS'), formController_1.getFormAuditLogs);
exports.default = router;
//# sourceMappingURL=formRoutes.js.map
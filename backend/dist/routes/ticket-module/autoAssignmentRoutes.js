"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autoAssignmentController_1 = require("../../controllers/ticket-module/autoAssignmentController");
const router = express_1.default.Router();
router.get('/', autoAssignmentController_1.getAutoAssignmentRules);
router.get('/:id', autoAssignmentController_1.getAutoAssignmentRuleById);
router.post('/', autoAssignmentController_1.createAutoAssignmentRule);
router.put('/:id', autoAssignmentController_1.updateAutoAssignmentRule);
router.delete('/:id', autoAssignmentController_1.deleteAutoAssignmentRule);
router.patch('/:id/toggle', autoAssignmentController_1.toggleAutoAssignmentRuleStatus);
exports.default = router;
//# sourceMappingURL=autoAssignmentRoutes.js.map
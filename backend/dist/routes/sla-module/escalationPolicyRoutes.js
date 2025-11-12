"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const escalationPolicyController_1 = require("../../controllers/sla-module/escalationPolicyController");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authMiddleware);
router.patch('/:id/toggle-status', escalationPolicyController_1.toggleEscalationPolicyStatus);
router.get('/', escalationPolicyController_1.getAllEscalationPolicies);
router.get('/:id', escalationPolicyController_1.getEscalationPolicyById);
router.post('/', escalationPolicyController_1.createEscalationPolicy);
router.put('/:id', escalationPolicyController_1.updateEscalationPolicy);
router.delete('/:id', escalationPolicyController_1.deleteEscalationPolicy);
exports.default = router;
//# sourceMappingURL=escalationPolicyRoutes.js.map
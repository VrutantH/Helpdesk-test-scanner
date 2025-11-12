"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slaRuleController_1 = require("../../controllers/sla-module/slaRuleController");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authMiddleware);
router.patch('/:id/toggle-status', slaRuleController_1.toggleSLARuleStatus);
router.get('/', slaRuleController_1.getAllSLARules);
router.get('/:id', slaRuleController_1.getSLARuleById);
router.post('/', slaRuleController_1.createSLARule);
router.put('/:id', slaRuleController_1.updateSLARule);
router.delete('/:id', slaRuleController_1.deleteSLARule);
exports.default = router;
//# sourceMappingURL=slaRuleRoutes.js.map
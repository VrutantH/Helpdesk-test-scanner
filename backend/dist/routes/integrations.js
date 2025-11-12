"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const integrationController_1 = require("../controllers/integrationController");
const router = express_1.default.Router();
router.get('/', integrationController_1.getAllIntegrations);
router.get('/project/:projectId', integrationController_1.getIntegrationsByProject);
router.get('/:id', integrationController_1.getIntegrationById);
router.post('/', integrationController_1.createIntegration);
router.put('/:id', integrationController_1.updateIntegration);
router.delete('/:id', integrationController_1.deleteIntegration);
router.patch('/:id/toggle-status', integrationController_1.toggleIntegrationStatus);
exports.default = router;
//# sourceMappingURL=integrations.js.map
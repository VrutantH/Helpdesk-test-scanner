"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleController_1 = require("../controllers/roleController");
const router = express_1.default.Router();
router.get('/roles', roleController_1.getAllRoles);
router.get('/roles/:id', roleController_1.getRoleById);
router.post('/roles', roleController_1.createRole);
router.put('/roles/:id', roleController_1.updateRole);
router.delete('/roles/:id', roleController_1.deleteRole);
router.patch('/roles/:id/toggle-status', roleController_1.toggleRoleStatus);
router.get('/permissions', roleController_1.getAllPermissions);
exports.default = router;
//# sourceMappingURL=roleRoutes.js.map
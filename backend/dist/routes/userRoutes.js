"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.get('/', userController_1.getAllUsers);
router.get('/:id', userController_1.getUserById);
router.post('/', userController_1.createUser);
router.put('/:id', userController_1.updateUser);
router.delete('/:id', userController_1.deleteUser);
router.patch('/:id/toggle-status', userController_1.toggleUserStatus);
router.post('/:id/reset-password', userController_1.resetUserPassword);
router.get('/hrms/search', userController_1.searchHRMSEmployees);
router.get('/hrms/validate/:employeeCode', userController_1.validateEmployeeCode);
router.post('/hrms/bulk-import', userController_1.bulkImportFromHRMS);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
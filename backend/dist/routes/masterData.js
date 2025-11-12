"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const masterDataController_1 = require("../controllers/masterDataController");
const router = express_1.default.Router();
router.get('/categories', masterDataController_1.getAllCategories);
router.get('/category/:category', masterDataController_1.getMasterDataByCategory);
router.post('/', masterDataController_1.createMasterData);
router.post('/bulk', masterDataController_1.bulkCreateMasterData);
router.put('/:id', masterDataController_1.updateMasterData);
router.delete('/:id', masterDataController_1.deleteMasterData);
router.patch('/:id/toggle-status', masterDataController_1.toggleMasterDataStatus);
exports.default = router;
//# sourceMappingURL=masterData.js.map
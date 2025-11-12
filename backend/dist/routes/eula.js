"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eulaController_1 = require("../controllers/eulaController");
const router = express_1.default.Router();
router.post('/accept-eula', eulaController_1.acceptEula);
router.get('/eula-status', eulaController_1.checkEulaStatus);
router.get('/eula-history', eulaController_1.getEulaHistory);
exports.default = router;
//# sourceMappingURL=eula.js.map
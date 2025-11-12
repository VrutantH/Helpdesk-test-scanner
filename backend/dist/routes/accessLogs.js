"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const accessLogController_1 = require("../controllers/accessLogController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', accessLogController_1.getAllAccessLogs);
router.get('/stats', accessLogController_1.getAccessStats);
router.get('/export', accessLogController_1.exportAccessLogs);
router.get('/:id', accessLogController_1.getAccessLogById);
router.post('/', accessLogController_1.createAccessLog);
exports.default = router;
//# sourceMappingURL=accessLogs.js.map
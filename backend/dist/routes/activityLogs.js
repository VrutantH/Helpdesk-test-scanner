"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const activityLogController_1 = require("../controllers/activityLogController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', activityLogController_1.getAllActivityLogs);
router.get('/stats', activityLogController_1.getActivityStats);
router.get('/export', activityLogController_1.exportActivityLogs);
router.get('/:id', activityLogController_1.getActivityLogById);
router.post('/', activityLogController_1.createActivityLog);
exports.default = router;
//# sourceMappingURL=activityLogs.js.map
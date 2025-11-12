"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forgotPasswordController_1 = require("../controllers/forgotPasswordController");
const router = (0, express_1.Router)();
router.post('/send-otp', forgotPasswordController_1.sendOTP);
router.post('/verify-otp', forgotPasswordController_1.verifyOTP);
router.post('/reset', forgotPasswordController_1.resetPassword);
router.post('/check-mobile', forgotPasswordController_1.getUserByMobile);
router.post('/get-otp', forgotPasswordController_1.getCurrentOTP);
exports.default = router;
//# sourceMappingURL=forgotPassword.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const validateRequest_1 = require("../middleware/validateRequest");
const rateLimiter_1 = require("../middleware/rateLimiter");
const auth_1 = require("../middleware/auth");
const forgotPassword_1 = __importDefault(require("./forgotPassword"));
const router = (0, express_1.Router)();
router.use(rateLimiter_1.authRateLimit);
router.post('/login', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validateRequest_1.validateRequest
], authController_1.login);
router.post('/forgot-password', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    validateRequest_1.validateRequest
], authController_1.forgotPassword);
router.post('/verify-otp', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('otp')
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage('OTP must be a 6-digit number'),
    validateRequest_1.validateRequest
], authController_1.verifyOTP);
router.post('/reset-password', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    validateRequest_1.validateRequest
], authController_1.resetPassword);
router.post('/logout', auth_1.authMiddleware, authController_1.logout);
router.post('/refresh', (req, res) => {
    res.json({
        success: true,
        message: 'Token refresh endpoint - to be implemented',
    });
});
router.use('/forgot-password', forgotPassword_1.default);
exports.default = router;
//# sourceMappingURL=auth.js.map
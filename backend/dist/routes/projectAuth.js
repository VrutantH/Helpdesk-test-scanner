"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const rateLimiter_1 = require("../middleware/rateLimiter");
const projectAuthController_1 = require("../controllers/projectAuthController");
const router = (0, express_1.Router)();
router.use(rateLimiter_1.authRateLimit);
router.get('/branding/:urlPath', projectAuthController_1.getProjectBrandingByUrl);
router.post('/login', [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('projectId')
        .notEmpty()
        .withMessage('Project ID is required'),
    validateRequest_1.validateRequest
], projectAuthController_1.projectLogin);
exports.default = router;
//# sourceMappingURL=projectAuth.js.map
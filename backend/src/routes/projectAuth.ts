import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authRateLimit } from '../middleware/rateLimiter';
import { 
  getProjectBrandingByUrl, 
  projectLogin,
  projectLoginByUrl
} from '../controllers/projectAuthController';

const router = Router();

// Apply rate limiting to auth routes
router.use(authRateLimit);

// @desc    Get project branding by custom URL or domain
// @route   GET /api/project-auth/branding/:urlPath
// @access  Public (no authentication required)
router.get('/branding/:urlPath', getProjectBrandingByUrl);

// @desc    Project-specific login by custom URL path
// @route   POST /api/project-auth/:customUrlPath/login
// @access  Public
router.post('/:customUrlPath/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateRequest
], projectLoginByUrl);

// @desc    Project-specific login
// @route   POST /api/project-auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required'),
  validateRequest
], projectLogin);

export default router;

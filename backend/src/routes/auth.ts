import { Router } from 'express';
import { body } from 'express-validator';
import { 
  login, 
  forgotPassword, 
  verifyOTP, 
  resetPassword, 
  logout 
} from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { authRateLimit } from '../middleware/rateLimiter';
import { authMiddleware } from '../middleware/auth';
import forgotPasswordRoutes from './forgotPassword';

const router = Router();

// Apply rate limiting to auth routes
router.use(authRateLimit);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest
], login);

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  validateRequest
], forgotPassword);

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
  validateRequest
], verifyOTP);

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validateRequest
], resetPassword);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', authMiddleware, logout);

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', (req, res) => {
  res.json({
    success: true,
    message: 'Token refresh endpoint - to be implemented',
  });
});

// Mobile-based forgot password routes
router.use('/forgot-password', forgotPasswordRoutes);

export default router;
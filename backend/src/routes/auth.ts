import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { authRateLimit, forgotPasswordRateLimit } from '../middleware/rateLimiter';
import {
  login,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = Router();

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authRateLimit, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
], login);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', auth, logout);

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', forgotPasswordRateLimit, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  validateRequest,
], forgotPassword);

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').notEmpty().withMessage('OTP is required'),
  validateRequest,
], verifyOTP);

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest,
], resetPassword);

export default router;

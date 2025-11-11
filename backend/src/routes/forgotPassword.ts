import { Router } from 'express';
import { sendOTP, verifyOTP, resetPassword, getUserByMobile, getCurrentOTP } from '../controllers/forgotPasswordController';
// import { passwordResetRateLimit, otpRateLimit } from '../middleware/rateLimiter'; // Temporarily disabled for testing

const router = Router();

// Send OTP to mobile number - rate limiting temporarily disabled
router.post('/send-otp', sendOTP);

// Verify OTP - rate limiting temporarily disabled  
router.post('/verify-otp', verifyOTP);

// Reset password - rate limiting temporarily disabled
router.post('/reset', resetPassword);

// Get user info by mobile
router.post('/check-mobile', getUserByMobile);

// Get current OTP for testing/development
router.post('/get-otp', getCurrentOTP);

export default router;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentOTP = exports.getUserByMobile = exports.resetPassword = exports.verifyOTP = exports.sendOTP = void 0;
const User_1 = require("../models/User");
const config_1 = require("../config");
const sendOTP = async (req, res) => {
    try {
        console.log('📧 Send OTP request received:', req.body);
        const { mobile } = req.body;
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobile || !mobileRegex.test(mobile)) {
            console.log('❌ Invalid mobile number:', mobile);
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number'
            });
        }
        console.log('🔍 Looking for user with mobile:', mobile);
        const user = await User_1.User.findOne({ mobile, isActive: true });
        if (!user) {
            console.log('❌ No user found with mobile:', mobile);
            return res.status(404).json({
                success: false,
                message: 'No account found with this mobile number'
            });
        }
        console.log('✅ User found:', user.firstName, user.lastName);
        const otp = user.generateResetPasswordOTP();
        await user.save();
        console.log(`📱 OTP for mobile ${mobile}: ${otp} (expires in ${config_1.config.OTP_EXPIRY_MINUTES} minutes)`);
        const response = {
            success: true,
            message: 'OTP generated successfully',
            expiresIn: config_1.config.OTP_EXPIRY_MINUTES * 60,
            accountHolder: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
            },
            developmentOTP: otp
        };
        console.log('📤 Sending response:', response);
        return res.json(response);
    }
    catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobile || !mobileRegex.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number'
            });
        }
        if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 6-digit OTP'
            });
        }
        const user = await User_1.User.findOne({ mobile, isActive: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this mobile number'
            });
        }
        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires || user.resetPasswordOTPExpires < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }
        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please check and try again.'
            });
        }
        return res.json({
            success: true,
            message: 'OTP verified successfully. You can now reset your password.'
        });
    }
    catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.verifyOTP = verifyOTP;
const resetPassword = async (req, res) => {
    try {
        console.log('🔐 Reset password request:', { mobile: req.body.mobile, otpLength: req.body.otp?.length, passwordLength: req.body.newPassword?.length });
        const { mobile, otp, newPassword } = req.body;
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobile || !mobileRegex.test(mobile)) {
            console.log('❌ Invalid mobile');
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number'
            });
        }
        if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            console.log('❌ Invalid OTP format');
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 6-digit OTP'
            });
        }
        if (!newPassword || newPassword.length < 6) {
            console.log('❌ Password too short');
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }
        console.log('🔍 Finding user...');
        const user = await User_1.User.findOne({ mobile, isActive: true });
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({
                success: false,
                message: 'No account found with this mobile number'
            });
        }
        console.log('✅ User found. Verifying OTP...');
        console.log('Stored OTP:', user.resetPasswordOTP, 'Provided:', otp);
        console.log('OTP expires:', user.resetPasswordOTPExpires, 'Now:', new Date());
        if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp || !user.resetPasswordOTPExpires || user.resetPasswordOTPExpires < new Date()) {
            console.log('❌ OTP verification failed');
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP. Please start the process again.'
            });
        }
        console.log('✅ OTP verified. Updating password...');
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpires = undefined;
        user.resetPasswordAttempts = 0;
        user.resetPasswordLockedUntil = undefined;
        await user.save();
        console.log(`🔐 Password reset successful for mobile ${mobile} (${user.firstName} ${user.lastName})`);
        return res.json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });
    }
    catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.resetPassword = resetPassword;
const getUserByMobile = async (req, res) => {
    try {
        const { mobile } = req.body;
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobile || !mobileRegex.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number'
            });
        }
        const user = await User_1.User.findOne({ mobile, isActive: true }).select('firstName lastName email');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this mobile number'
            });
        }
        return res.json({
            success: true,
            user: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
            }
        });
    }
    catch (error) {
        console.error('Get user by mobile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getUserByMobile = getUserByMobile;
const getCurrentOTP = async (req, res) => {
    try {
        const { mobile } = req.body;
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobile || !mobileRegex.test(mobile)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number'
            });
        }
        const user = await User_1.User.findOne({ mobile, isActive: true }).select('firstName lastName resetPasswordOTP resetPasswordOTPExpires');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this mobile number'
            });
        }
        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires || user.resetPasswordOTPExpires < new Date()) {
            return res.json({
                success: true,
                hasOTP: false,
                message: 'No active OTP found. Please request a new one.',
                accountHolder: `${user.firstName} ${user.lastName}`
            });
        }
        const timeRemaining = Math.ceil((user.resetPasswordOTPExpires.getTime() - Date.now()) / 1000 / 60);
        return res.json({
            success: true,
            hasOTP: true,
            otp: user.resetPasswordOTP,
            expiresInMinutes: timeRemaining,
            accountHolder: `${user.firstName} ${user.lastName}`,
            message: `Active OTP found for ${user.firstName} ${user.lastName}`
        });
    }
    catch (error) {
        console.error('Get current OTP error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getCurrentOTP = getCurrentOTP;
//# sourceMappingURL=forgotPasswordController.js.map
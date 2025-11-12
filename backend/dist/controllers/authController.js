"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPassword = exports.verifyOTP = exports.forgotPassword = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../utils/emailService");
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const EulaAcceptance_1 = __importDefault(require("../models/EulaAcceptance"));
const logger_1 = require("../utils/logger");
const otpStore = new Map();
const login = async (req, res) => {
    try {
        const { email, password, projectId } = req.body;
        console.log('🔐 Login attempt:', email, projectId ? `(Project: ${projectId})` : '');
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }
        const user = await User_1.User.findOne({ email: email.toLowerCase(), isActive: true }).populate('role');
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        if (projectId) {
            const isAuthorized = user.projects?.some((pid) => pid.toString() === projectId.toString());
            if (!isAuthorized) {
                console.log('❌ User not authorized for project:', projectId);
                await (0, logger_1.logLogin)(user._id.toString(), `${user.firstName} ${user.lastName}`, user.email, req, 'failure', 'User not authorized for this project');
                return res.status(403).json({
                    success: false,
                    error: 'You are not authorized to access this project'
                });
            }
        }
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log('❌ Invalid password for:', email);
            await (0, logger_1.logLogin)(user._id.toString(), `${user.firstName} ${user.lastName}`, user.email, req, 'failure', 'Invalid password');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        user.lastLogin = new Date();
        await user.save();
        const CURRENT_EULA_VERSION = '1.0';
        const eulaAcceptance = await EulaAcceptance_1.default.findOne({
            userId: user._id,
            eulaVersion: CURRENT_EULA_VERSION
        }).sort({ acceptedAt: -1 });
        const eulaAccepted = !!eulaAcceptance;
        console.log(`📋 EULA Check for ${email}:`);
        console.log(`   - Acceptance found: ${!!eulaAcceptance}`);
        console.log(`   - eulaAccepted value: ${eulaAccepted}`);
        if (eulaAcceptance) {
            console.log(`   - Accepted at: ${eulaAcceptance.acceptedAt}`);
            console.log(`   - Version: ${eulaAcceptance.eulaVersion}`);
        }
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };
        const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
        const options = {
            expiresIn: '7d'
        };
        const token = jsonwebtoken_1.default.sign(payload, secret, options);
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        console.log('✅ Login successful:', email);
        let projectName = 'Individual';
        const origin = req.get('origin') || req.get('referer');
        if (origin) {
            console.log('🌐 Login origin:', origin);
            const project = await Project_1.Project.findOne({
                'branding.domainUrl': { $regex: origin.replace(/https?:\/\//, ''), $options: 'i' },
                isActive: true
            });
            if (project) {
                projectName = project.name;
                console.log('✅ Project found:', projectName);
            }
            else if (user.projects && user.projects.length > 0) {
                const userProject = await Project_1.Project.findById(user.projects[0]);
                if (userProject) {
                    projectName = userProject.name;
                    console.log('✅ Using user\'s first project:', projectName);
                }
            }
        }
        else if (user.projects && user.projects.length > 0) {
            const userProject = await Project_1.Project.findById(user.projects[0]);
            if (userProject) {
                projectName = userProject.name;
                console.log('✅ Using user\'s project (no origin):', projectName);
            }
        }
        let roleName = 'User';
        if (user.role) {
            if (typeof user.role === 'object') {
                if ('name' in user.role) {
                    roleName = user.role.name;
                    console.log('✅ Using populated role name:', roleName);
                }
                else {
                    console.log('⚠️  Role object exists but no name field, keys:', Object.keys(user.role));
                }
            }
            else {
                console.log('⚠️  Role is not an object:', typeof user.role);
            }
        }
        else {
            console.log('⚠️  Role is null or undefined');
        }
        await (0, logger_1.logLogin)(user._id.toString(), `${user.firstName} ${user.lastName}`, user.email, req, 'success', undefined, projectName, roleName);
        return res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: roleName,
                    eulaAccepted: eulaAccepted
                },
                token
            },
            message: 'Login successful'
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }
        if (email !== 'admin@helpdesk.gov.in') {
            return res.status(404).json({
                success: false,
                error: 'Email address not found in our records'
            });
        }
        const otp = crypto_1.default.randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        const otpId = crypto_1.default.randomUUID();
        otpStore.set(otpId, { otp, expires, email });
        try {
            await (0, emailService_1.sendOTPEmail)(email, otp);
        }
        catch (emailError) {
            console.error('Email sending failed:', emailError);
        }
        console.log(`OTP for ${email}: ${otp}`);
        return res.json({
            success: true,
            data: { otpId },
            message: 'OTP has been sent to your email address'
        });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.forgotPassword = forgotPassword;
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Email and OTP are required'
            });
        }
        let validOtpId = null;
        for (const [id, data] of otpStore.entries()) {
            if (data.email === email && data.otp === otp && data.expires > new Date()) {
                validOtpId = id;
                break;
            }
        }
        if (!validOtpId) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or expired OTP'
            });
        }
        return res.json({
            success: true,
            data: { verified: true },
            message: 'OTP verified successfully'
        });
    }
    catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.verifyOTP = verifyOTP;
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Email and new password are required'
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }
        let otpVerified = false;
        for (const [id, data] of otpStore.entries()) {
            if (data.email === email) {
                otpVerified = true;
                otpStore.delete(id);
                break;
            }
        }
        if (!otpVerified) {
            return res.status(400).json({
                success: false,
                error: 'OTP verification required'
            });
        }
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
        console.log(`Password reset for ${email}: ${hashedPassword}`);
        return res.json({
            success: true,
            data: { updated: true },
            message: 'Password has been reset successfully'
        });
    }
    catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.resetPassword = resetPassword;
const logout = async (req, res) => {
    try {
        console.log('🔓 Logout request received');
        const userId = req.user?.userId;
        const userEmail = req.user?.email;
        console.log('User info from token:', { userId, userEmail });
        if (userId) {
            try {
                const user = await User_1.User.findById(userId).populate('role');
                console.log('User found:', user ? `${user.firstName} ${user.lastName}` : 'Not found');
                if (user) {
                    let roleName = 'User';
                    if (user.role && typeof user.role === 'object' && 'name' in user.role) {
                        roleName = user.role.name;
                        console.log('✅ Logout - Using role name:', roleName);
                    }
                    let projectName = 'Individual';
                    const origin = req.get('origin') || req.get('referer');
                    if (origin) {
                        console.log('🌐 Logout origin:', origin);
                        const project = await Project_1.Project.findOne({
                            'branding.domainUrl': { $regex: origin.replace(/https?:\/\//, ''), $options: 'i' },
                            isActive: true
                        });
                        if (project) {
                            projectName = project.name;
                            console.log('✅ Project found:', projectName);
                        }
                        else if (user.projects && user.projects.length > 0) {
                            const userProject = await Project_1.Project.findById(user.projects[0]);
                            if (userProject) {
                                projectName = userProject.name;
                                console.log('✅ Using user\'s first project:', projectName);
                            }
                        }
                    }
                    else if (user.projects && user.projects.length > 0) {
                        const userProject = await Project_1.Project.findById(user.projects[0]);
                        if (userProject) {
                            projectName = userProject.name;
                            console.log('✅ Using user\'s project (no origin):', projectName);
                        }
                    }
                    console.log('Logging logout activity...');
                    await (0, logger_1.logLogout)(user._id.toString(), `${user.firstName} ${user.lastName}`, user.email, req, projectName, roleName);
                    console.log('✅ Logout activity logged successfully');
                }
            }
            catch (err) {
                console.error('❌ Error logging logout activity:', err);
            }
        }
        else {
            console.log('⚠️  No userId found in request');
        }
        res.clearCookie('authToken');
        return res.json({
            success: true,
            message: 'Logged out successfully'
        });
    }
    catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.logout = logout;
//# sourceMappingURL=authController.js.map
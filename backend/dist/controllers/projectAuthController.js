"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectLogin = exports.getProjectBrandingByUrl = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const logger_1 = require("../utils/logger");
const getProjectBrandingByUrl = async (req, res) => {
    try {
        const { urlPath } = req.params;
        console.log('🎨 Fetching project branding for:', urlPath);
        let project = await Project_1.Project.findOne({
            $or: [
                { 'branding.customUrlPath': urlPath.toLowerCase() },
                { 'branding.domainUrl': { $regex: new RegExp(urlPath, 'i') } }
            ],
            isActive: true,
            status: 'active'
        }).select('name code branding settings configuration.customizationSettings');
        if (!project) {
            console.log('❌ Project not found for URL:', urlPath);
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }
        console.log('✅ Project found:', project.name);
        return res.json({
            success: true,
            data: {
                projectId: project._id,
                name: project.name,
                code: project.code,
                branding: {
                    logo: project.branding?.logo,
                    colorTheme: project.branding?.colorTheme || {
                        primary: '#7c3aed',
                        secondary: '#1f2937',
                        accent: '#3b82f6',
                        background: '#ffffff'
                    },
                    headerText: project.branding?.headerText || project.name,
                    footerText: project.branding?.footerText,
                    favicon: project.branding?.favicon,
                    customUrlPath: project.branding?.customUrlPath,
                    domainUrl: project.branding?.domainUrl
                },
                settings: {
                    defaultLanguage: project.settings?.defaultLanguage || 'en',
                    timezone: project.settings?.timezone || 'Asia/Kolkata',
                    dateFormat: project.settings?.dateFormat || 'DD/MM/YYYY'
                },
                customization: {
                    loginPageBackgroundImage: project.configuration?.customizationSettings?.loginPageBackgroundImage,
                    themeMode: project.configuration?.customizationSettings?.themeMode || 'light',
                    themeColor: project.configuration?.customizationSettings?.themeColor || '#444ce7'
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching project branding:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.getProjectBrandingByUrl = getProjectBrandingByUrl;
const projectLogin = async (req, res) => {
    try {
        const { email, password, projectId } = req.body;
        console.log('🔐 Project login attempt:', email, 'Project:', projectId);
        if (!email || !password || !projectId) {
            return res.status(400).json({
                success: false,
                error: 'Email, password, and project ID are required'
            });
        }
        const user = await User_1.User.findOne({
            email: email.toLowerCase(),
            isActive: true
        }).populate('role');
        if (!user) {
            console.log('❌ User not found:', email);
            await (0, logger_1.logLogin)('', '', email, req, 'failure', 'User not found');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const isAuthorized = user.projects?.some((pid) => pid.toString() === projectId.toString());
        if (!isAuthorized) {
            console.log('❌ User not authorized for project:', projectId);
            await (0, logger_1.logLogin)(user._id.toString(), `${user.firstName} ${user.lastName}`, user.email, req, 'failure', 'User not authorized for this project');
            return res.status(403).json({
                success: false,
                error: 'You are not authorized to access this project'
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
        const project = await Project_1.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role,
            projectId: project._id,
            projectName: project.name
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
        console.log('✅ Project login successful:', email, 'Project:', project.name);
        let roleName = 'User';
        if (user.role && typeof user.role === 'object' && 'name' in user.role) {
            roleName = user.role.name;
        }
        await (0, logger_1.logLogin)(user._id.toString(), `${user.firstName} ${user.lastName}`, user.email, req, 'success', undefined, project.name, roleName);
        return res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: roleName,
                    project: {
                        id: project._id,
                        name: project.name,
                        code: project.code
                    }
                },
                token
            },
            message: 'Login successful'
        });
    }
    catch (error) {
        console.error('Project login error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
exports.projectLogin = projectLogin;
//# sourceMappingURL=projectAuthController.js.map
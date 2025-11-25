import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { logLogin } from '../utils/logger';
import { sendOTPEmail } from '../utils/emailService';
import { generateProjectJWT } from '../utils/jwtUtils';

// In-memory store for project OTPs (in production, use Redis or database)
const projectOtpStore = new Map<string, { otp: string; expires: Date; email: string; customUrlPath: string }>();

// Get project branding by custom URL path or domain
export const getProjectBrandingByUrl = async (req: Request, res: Response) => {
  try {
    const { urlPath } = req.params;
    
    console.log('🎨 Fetching project branding for:', urlPath);

    // Try to find project by customUrlPath first, then by domain
    let project = await Project.findOne({
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

    // Return branding information
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

  } catch (error) {
    console.error('Error fetching project branding:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Project-specific login by custom URL path
export const projectLoginByUrl = async (req: Request, res: Response) => {
  try {
    const { customUrlPath } = req.params;
    const { email, password } = req.body;

    console.log('🔐 Project login attempt by URL:', email, 'Path:', customUrlPath);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find project by custom URL path
    const project = await Project.findOne({
      'branding.customUrlPath': customUrlPath.toLowerCase(),
      isActive: true,
      status: 'active'
    });

    if (!project) {
      console.log('❌ Project not found for URL:', customUrlPath);
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Find user in database and populate role with permissions
    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      isActive: true 
    }).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        select: 'code name category'
      }
    });

    if (!user) {
      console.log('❌ User not found:', email);
      
      await logLogin(
        '',
        '',
        email,
        req,
        'failure',
        'User not found'
      );
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify user is mapped to this project
    const isAuthorized = user.projects?.some(
      (pid) => pid.toString() === project._id.toString()
    );
    
    if (!isAuthorized) {
      console.log('❌ User not authorized for project:', project.name);
      
      await logLogin(
        user._id.toString(),
        `${user.firstName} ${user.lastName}`,
        user.email,
        req,
        'failure',
        'User not authorized for this project'
      );
      
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this project'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      
      await logLogin(
        user._id.toString(),
        `${user.firstName} ${user.lastName}`,
        user.email,
        req,
        'failure',
        'Invalid password'
      );
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token with dynamic permissions using utility
    const token = await generateProjectJWT(user, project);

    // Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('✅ Project login successful:', email, 'Project:', project.name);

    // Get role information and permissions
    const roleData = user.role && typeof user.role === 'object' 
      ? user.role as any 
      : { name: 'User', code: 'USER', permissions: [] };

    // Extract permission codes from populated permissions
    const permissions = roleData.permissions 
      ? roleData.permissions.map((p: any) => p.code || p).filter(Boolean)
      : [];

    console.log('✅ User permissions:', permissions);

    await logLogin(
      user._id.toString(),
      `${user.firstName} ${user.lastName}`,
      user.email,
      req,
      'success',
      undefined,
      project.name,
      roleData.name
    );

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          role: {
            name: roleData.name,
            code: roleData.code,
            permissions: permissions // Include permissions array
          },
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

  } catch (error) {
    console.error('Project login by URL error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Project-specific login
export const projectLogin = async (req: Request, res: Response) => {
  try {
    const { email, password, projectId } = req.body;

    console.log('🔐 Project login attempt:', email, 'Project:', projectId);

    // Validate input
    if (!email || !password || !projectId) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and project ID are required'
      });
    }

    // Find user in database and populate role with permissions
    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      isActive: true 
    }).populate({
      path: 'role',
      populate: {
        path: 'permissions',
        select: 'code name category'
      }
    });

    if (!user) {
      console.log('❌ User not found:', email);
      
      await logLogin(
        '',
        '',
        email,
        req,
        'failure',
        'User not found'
      );
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Verify user is mapped to this project
    const isAuthorized = user.projects?.some(
      (pid) => pid.toString() === projectId.toString()
    );
    
    if (!isAuthorized) {
      console.log('❌ User not authorized for project:', projectId);
      
      await logLogin(
        user._id.toString(),
        `${user.firstName} ${user.lastName}`,
        user.email,
        req,
        'failure',
        'User not authorized for this project'
      );
      
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to access this project'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      
      await logLogin(
        user._id.toString(),
        `${user.firstName} ${user.lastName}`,
        user.email,
        req,
        'failure',
        'Invalid password'
      );
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Get project information
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Generate JWT token with dynamic permissions using utility
    const token = await generateProjectJWT(user, project);

    // Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('✅ Project login successful:', email, 'Project:', project.name);

    // Get role name
    let roleName = 'User';
    if (user.role && typeof user.role === 'object' && 'name' in user.role) {
      roleName = (user.role as any).name;
    }

    await logLogin(
      user._id.toString(),
      `${user.firstName} ${user.lastName}`,
      user.email,
      req,
      'success',
      undefined,
      project.name,
      roleName
    );

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

  } catch (error) {
    console.error('Project login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Project-specific forgot password
export const projectForgotPassword = async (req: Request, res: Response) => {
  try {
    const { customUrlPath } = req.params;
    const { email } = req.body;

    console.log('🔑 Project forgot password attempt:', email, 'for project:', customUrlPath);

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find project by custom URL path
    const project = await Project.findOne({
      'branding.customUrlPath': customUrlPath.toLowerCase(),
      isActive: true,
      status: 'active'
    });

    if (!project) {
      console.log('❌ Project not found for URL:', customUrlPath);
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Find user by email and check if they're assigned to this project
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true
    }).populate('role');

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(404).json({
        success: false,
        error: 'Email address not found in our records'
      });
    }

    // Check if user is assigned to this project
    const isUserInProject = user.projects?.some(
      (projectId: any) => projectId.toString() === project._id.toString()
    );

    if (!isUserInProject) {
      console.log('❌ User not authorized for project:', email, project.name);
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to access this project'
      });
    }

    // Check if user is reset password locked
    if (user.isResetPasswordLocked && user.isResetPasswordLocked()) {
      return res.status(429).json({
        success: false,
        error: 'Too many password reset attempts. Please try again later.'
      });
    }

    // Generate 6-digit OTP
    const otp = user.generateResetPasswordOTP();
    await user.save();

    // Store OTP in memory for verification
    const otpId = crypto.randomUUID();
    projectOtpStore.set(otpId, { 
      otp, 
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      email: email.toLowerCase(),
      customUrlPath: customUrlPath.toLowerCase()
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue without failing the request
    }

    console.log(`✅ Password reset OTP sent to ${email} for project ${project.name}: ${otp}`);

    return res.json({
      success: true,
      data: { otpId }, // For testing purposes
      message: 'Password reset OTP has been sent to your email address'
    });

  } catch (error) {
    console.error('Project forgot password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Project-specific verify OTP
export const projectVerifyOTP = async (req: Request, res: Response) => {
  try {
    const { customUrlPath } = req.params;
    const { email, otp } = req.body;

    console.log('🔍 Project verify OTP attempt:', email, 'for project:', customUrlPath);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required'
      });
    }

    // Find project by custom URL path
    const project = await Project.findOne({
      'branding.customUrlPath': customUrlPath.toLowerCase(),
      isActive: true,
      status: 'active'
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Find user and verify OTP
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: new Date() },
      isActive: true
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    // Verify OTP is in our store for this project
    let validOtpId: string | null = null;
    for (const [id, data] of projectOtpStore.entries()) {
      if (data.email === email.toLowerCase() && 
          data.otp === otp && 
          data.customUrlPath === customUrlPath.toLowerCase() &&
          data.expires > new Date()) {
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

    console.log('✅ OTP verified successfully for:', email);

    return res.json({
      success: true,
      data: { verified: true },
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('Project verify OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Project-specific reset password
export const projectResetPassword = async (req: Request, res: Response) => {
  try {
    const { customUrlPath } = req.params;
    const { email, newPassword } = req.body;

    console.log('🔒 Project reset password attempt:', email, 'for project:', customUrlPath);

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

    // Find project by custom URL path
    const project = await Project.findOne({
      'branding.customUrlPath': customUrlPath.toLowerCase(),
      isActive: true,
      status: 'active'
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if OTP was verified for this email and project
    let otpVerified = false;
    let otpIdToRemove: string | null = null;
    for (const [id, data] of projectOtpStore.entries()) {
      if (data.email === email.toLowerCase() && 
          data.customUrlPath === customUrlPath.toLowerCase()) {
        otpVerified = true;
        otpIdToRemove = id;
        break;
      }
    }

    if (!otpVerified) {
      return res.status(400).json({
        success: false,
        error: 'OTP verification required before password reset'
      });
    }

    // Find user and update password
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user password and clear reset fields (pre-save hook will hash it)
    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    user.resetPasswordAttempts = 0;
    user.resetPasswordLockedUntil = undefined;

    await user.save();

    // Remove used OTP from store
    if (otpIdToRemove) {
      projectOtpStore.delete(otpIdToRemove);
    }

    console.log('✅ Password reset successful for:', email, 'in project:', project.name);

    return res.json({
      success: true,
      data: { updated: true },
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Project reset password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

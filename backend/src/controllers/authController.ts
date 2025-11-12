import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { sendOTPEmail } from '../utils/emailService';
import { User } from '../models/User';
import { Project } from '../models/Project';
import EulaAcceptance from '../models/EulaAcceptance';
import { logLogin, logLogout } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

// In-memory store for OTPs (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: Date; email: string }>();

interface LoginRequest {
  email: string;
  password: string;
  projectId?: string; // Optional project ID for project-specific login
}

interface ForgotPasswordRequest {
  email: string;
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    const { email, password, projectId } = req.body;

    console.log('🔐 Login attempt:', email, projectId ? `(Project: ${projectId})` : '');

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user in database and populate role
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).populate('role');

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // If projectId is provided, verify user is mapped to that project
    if (projectId) {
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
    }

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
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

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Check if user has accepted the current EULA version (1.0)
    const CURRENT_EULA_VERSION = '1.0';
    const eulaAcceptance = await EulaAcceptance.findOne({
      userId: user._id,
      version: CURRENT_EULA_VERSION
    }).sort({ acceptedAt: -1 });

    const eulaAccepted = !!eulaAcceptance;

    console.log(`📋 EULA Check for ${email}:`);
    console.log(`   - Acceptance found: ${!!eulaAcceptance}`);
    console.log(`   - eulaAccepted value: ${eulaAccepted}`);
    if (eulaAcceptance) {
      console.log(`   - Accepted at: ${eulaAcceptance.acceptedAt}`);
      console.log(`   - Version: ${eulaAcceptance.version}`);
    }

    // Generate JWT token
    const payload = { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    };
    const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    const options: SignOptions = { 
      expiresIn: '7d'
    };
    
    const token = jwt.sign(payload, secret, options);

    // Set HTTP-only cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log('✅ Login successful:', email);

    // Get project information based on origin/domain
    let projectName = 'Individual'; // Default for Super Admin or no project
    const origin = req.get('origin') || req.get('referer');
    
    if (origin) {
      console.log('🌐 Login origin:', origin);
      
      // Try to find project by domain URL
      const project = await Project.findOne({ 
        'branding.domainUrl': { $regex: origin.replace(/https?:\/\//, ''), $options: 'i' },
        isActive: true 
      });
      
      if (project) {
        projectName = project.name;
        console.log('✅ Project found:', projectName);
      } else if (user.projects && user.projects.length > 0) {
        // If no project found by domain but user has projects, use first project
        const userProject = await Project.findById(user.projects[0]);
        if (userProject) {
          projectName = userProject.name;
          console.log('✅ Using user\'s first project:', projectName);
        }
      }
    } else if (user.projects && user.projects.length > 0) {
      // No origin header, but user has projects
      const userProject = await Project.findById(user.projects[0]);
      if (userProject) {
        projectName = userProject.name;
        console.log('✅ Using user\'s project (no origin):', projectName);
      }
    }

    // Get role name from populated role or handle if not populated
    let roleName = 'User';
    if (user.role) {
      if (typeof user.role === 'object') {
        if ('name' in user.role) {
          roleName = (user.role as any).name;
          console.log('✅ Using populated role name:', roleName);
        } else {
          console.log('⚠️  Role object exists but no name field, keys:', Object.keys(user.role));
        }
      } else {
        console.log('⚠️  Role is not an object:', typeof user.role);
      }
    } else {
      console.log('⚠️  Role is null or undefined');
    }

    await logLogin(
      user._id.toString(),
      `${user.firstName} ${user.lastName}`,
      user.email,
      req,
      'success',
      undefined,
      projectName,
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
          eulaAccepted: eulaAccepted
        },
        token
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const forgotPassword = async (req: Request<{}, {}, ForgotPasswordRequest>, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Check if user exists (For demo, only allow specific email)
    if (email !== 'admin@helpdesk.gov.in') {
      return res.status(404).json({
        success: false,
        error: 'Email address not found in our records'
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    const otpId = crypto.randomUUID();
    otpStore.set(otpId, { otp, expires, email });

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // For demo, continue without sending actual email
    }

    // For demo purposes, log the OTP
    console.log(`OTP for ${email}: ${otp}`);

    return res.json({
      success: true,
      data: { otpId }, // In production, don't send this
      message: 'OTP has been sent to your email address'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const verifyOTP = async (req: Request<{}, {}, VerifyOTPRequest>, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required'
      });
    }

    // Find OTP in store
    let validOtpId: string | null = null;
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

  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const resetPassword = async (req: Request<{}, {}, ResetPasswordRequest>, res: Response) => {
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

    // Check if OTP was verified for this email (simplified check)
    let otpVerified = false;
    for (const [id, data] of otpStore.entries()) {
      if (data.email === email) {
        otpVerified = true;
        otpStore.delete(id); // Remove used OTP
        break;
      }
    }

    if (!otpVerified) {
      return res.status(400).json({
        success: false,
        error: 'OTP verification required'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // In production, update user password in database
    console.log(`Password reset for ${email}: ${hashedPassword}`);

    return res.json({
      success: true,
      data: { updated: true },
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    console.log('🔓 Logout request received');
    
    // Get user info from auth middleware
    const userId = req.user?.userId;
    const userEmail = req.user?.email;
    
    console.log('User info from token:', { userId, userEmail });
    
    // If we have user info, fetch full user details for logging
    if (userId) {
      try {
        const user = await User.findById(userId).populate('role');
        console.log('User found:', user ? `${user.firstName} ${user.lastName}` : 'Not found');
        
        if (user) {
          // Get role name
          let roleName = 'User';
          if (user.role && typeof user.role === 'object' && 'name' in user.role) {
            roleName = (user.role as any).name;
            console.log('✅ Logout - Using role name:', roleName);
          }
          
          // Get project information based on origin/domain
          let projectName = 'Individual'; // Default for Super Admin or no project
          const origin = req.get('origin') || req.get('referer');
          
          if (origin) {
            console.log('🌐 Logout origin:', origin);
            
            // Try to find project by domain URL
            const project = await Project.findOne({ 
              'branding.domainUrl': { $regex: origin.replace(/https?:\/\//, ''), $options: 'i' },
              isActive: true 
            });
            
            if (project) {
              projectName = project.name;
              console.log('✅ Project found:', projectName);
            } else if (user.projects && user.projects.length > 0) {
              // If no project found by domain but user has projects, use first project
              const userProject = await Project.findById(user.projects[0]);
              if (userProject) {
                projectName = userProject.name;
                console.log('✅ Using user\'s first project:', projectName);
              }
            }
          } else if (user.projects && user.projects.length > 0) {
            // No origin header, but user has projects
            const userProject = await Project.findById(user.projects[0]);
            if (userProject) {
              projectName = userProject.name;
              console.log('✅ Using user\'s project (no origin):', projectName);
            }
          }
          
          console.log('Logging logout activity...');
          await logLogout(
            user._id.toString(),
            `${user.firstName} ${user.lastName}`,
            user.email,
            req,
            projectName,
            roleName
          );
          console.log('✅ Logout activity logged successfully');
        }
      } catch (err) {
        console.error('❌ Error logging logout activity:', err);
        // Continue with logout even if logging fails
      }
    } else {
      console.log('⚠️  No userId found in request');
    }

    // Clear the auth cookie
    res.clearCookie('authToken');

    return res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
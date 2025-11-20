import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { logLogin } from '../utils/logger';

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

    // Find user in database and populate role
    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      isActive: true 
    }).populate('role');

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

    // Generate JWT token with permissions (optimized - only codes)
    const permissions = (user.role as any)?.permissions || [];
    const permissionCodes = permissions.map((p: any) => p.code || p);
    
    const payload = { 
      userId: user._id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role ? {
        _id: (user.role as any)._id,
        code: (user.role as any).code,
        name: (user.role as any).name,
        permissions: permissionCodes // Only store permission codes
      } : null,
      projectId: project._id,
      projectName: project.name
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

    console.log('✅ Project login successful:', email, 'Project:', project.name);

    // Get role information
    const roleData = user.role && typeof user.role === 'object' 
      ? user.role as any 
      : { name: 'User', code: 'USER' };

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
            code: roleData.code
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

    // Find user in database and populate role
    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      isActive: true 
    }).populate('role');

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

    // Generate JWT token with permissions (optimized - only codes)
    const permissions = (user.role as any)?.permissions || [];
    const permissionCodes = permissions.map((p: any) => p.code || p);
    
    const payload = { 
      userId: user._id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role ? {
        _id: (user.role as any)._id,
        code: (user.role as any).code,
        name: (user.role as any).name,
        permissions: permissionCodes // Only store permission codes
      } : null,
      projectId: project._id,
      projectName: project.name
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

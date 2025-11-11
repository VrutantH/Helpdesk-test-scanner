import { Request, Response } from 'express';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { hrmsService } from '../services/hrmsService';
import mongoose from 'mongoose';

/**
 * Get all users with filters and pagination
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = '',
      isActive = '',
      project = '',
      department = '',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter query
    const filter: any = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeCode: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (isActive !== '') {
      filter.isActive = isActive === 'true';
    }

    if (project) {
      filter.projects = project;
    }

    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -resetPasswordOTP -resetPasswordOTPExpires')
        .populate('role', 'name code')
        .populate('projects', 'name code')
        .populate('reportingManager', 'firstName lastName email employeeCode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message,
    });
  }
};

/**
 * Get single user by ID
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password -resetPasswordOTP -resetPasswordOTPExpires')
      .populate('role', 'name code permissions')
      .populate('projects', 'name code')
      .populate('reportingManager', 'firstName lastName email employeeCode')
      .lean();

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message,
    });
  }
};

/**
 * Create new user (manual creation or HRMS import)
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      mobile,
      role,
      employeeCode,
      department,
      designation,
      joiningDate,
      reportingManager,
      projects,
      syncFromHRMS = false,
    } = req.body;

    // Validate required fields
    // When syncing from HRMS with employeeCode, email can be fetched from HRMS
    if (!role) {
      res.status(400).json({
        success: false,
        error: 'Role is required',
      });
      return;
    }

    if (!syncFromHRMS && !email) {
      res.status(400).json({
        success: false,
        error: 'Email is required',
      });
      return;
    }

    if (syncFromHRMS && !employeeCode) {
      res.status(400).json({
        success: false,
        error: 'Employee code is required when syncing from HRMS',
      });
      return;
    }

    // Check if email already exists (skip if syncing from HRMS and email not provided yet)
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
        return;
      }
    }

    // Check if employee code already exists
    if (employeeCode) {
      const existingEmployee = await User.findOne({ employeeCode });
      if (existingEmployee) {
        res.status(400).json({
          success: false,
          error: 'User with this employee code already exists',
        });
        return;
      }
    }

    // Validate role exists
    const roleDoc = await Role.findById(role);
    if (!roleDoc) {
      res.status(400).json({
        success: false,
        error: 'Invalid role ID',
      });
      return;
    }

    let userData: any = {
      email,
      password: password || Math.random().toString(36).slice(-10), // Generate random password if not provided
      firstName,
      lastName,
      mobile,
      role,
      department,
      designation,
      reportingManager,
      projects: projects || [],
    };

    // Sync from HRMS if requested
    if (syncFromHRMS && employeeCode) {
      try {
        const hrmsData = await hrmsService.syncEmployeeData(employeeCode);
        userData = {
          ...userData,
          ...hrmsData,
          // Override with provided data if any
          firstName: firstName || hrmsData.firstName,
          lastName: lastName || hrmsData.lastName,
          email: email || hrmsData.email,
          mobile: mobile || hrmsData.mobile,
        };

        // Check if email from HRMS already exists
        if (userData.email) {
          const existingUserByEmail = await User.findOne({ email: userData.email });
          if (existingUserByEmail) {
            res.status(400).json({
              success: false,
              error: `User with email ${userData.email} already exists`,
            });
            return;
          }
        }
      } catch (hrmsError: any) {
        res.status(400).json({
          success: false,
          error: 'Failed to sync from HRMS',
          message: hrmsError.message,
        });
        return;
      }
    } else if (employeeCode) {
      userData.employeeCode = employeeCode;
    }

    if (joiningDate) {
      userData.joiningDate = new Date(joiningDate);
    }

    const user = new User(userData);
    await user.save();

    // Populate role and projects before returning
    await user.populate('role', 'name code');
    await user.populate('projects', 'name code');

    const userResponse: any = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordOTP;
    delete userResponse.resetPasswordOTPExpires;

    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
      return;
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        success: false,
        error: `User with this ${field} already exists`,
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create user',
    });
  }
};

/**
 * Update user
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      mobile,
      role,
      employeeCode,
      department,
      designation,
      joiningDate,
      reportingManager,
      projects,
      syncFromHRMS = false,
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Check if email is being changed and if it's unique
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
        return;
      }
      user.email = req.body.email;
    }

    // Check if employee code is being changed and if it's unique
    if (employeeCode && employeeCode !== user.employeeCode) {
      const existingEmployee = await User.findOne({ employeeCode });
      if (existingEmployee) {
        res.status(400).json({
          success: false,
          error: 'User with this employee code already exists',
        });
        return;
      }
    }

    // Validate role if being updated
    if (role) {
      const roleDoc = await Role.findById(role);
      if (!roleDoc) {
        res.status(400).json({
          success: false,
          error: 'Invalid role ID',
        });
        return;
      }
      user.role = role;
    }

    // Sync from HRMS if requested
    if (syncFromHRMS && (employeeCode || user.employeeCode)) {
      try {
        const hrmsData = await hrmsService.syncEmployeeData(employeeCode || user.employeeCode!);
        Object.assign(user, hrmsData);
      } catch (hrmsError: any) {
        res.status(400).json({
          success: false,
          error: 'Failed to sync from HRMS',
          message: hrmsError.message,
        });
        return;
      }
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (mobile !== undefined) user.mobile = mobile;
    if (employeeCode !== undefined) user.employeeCode = employeeCode;
    if (department !== undefined) user.department = department;
    if (designation !== undefined) user.designation = designation;
    if (joiningDate !== undefined) user.joiningDate = new Date(joiningDate);
    if (reportingManager !== undefined) user.reportingManager = reportingManager;
    if (projects !== undefined) user.projects = projects;

    await user.save();

    await user.populate('role', 'name code');
    await user.populate('projects', 'name code');
    await user.populate('reportingManager', 'firstName lastName email employeeCode');

    const userResponse: any = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordOTP;
    delete userResponse.resetPasswordOTPExpires;

    res.json({
      success: true,
      data: userResponse,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message,
    });
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Don't allow deleting super admin
    await user.populate('role', 'code type');
    if ((user.role as any).code === 'SUPER_ADMIN') {
      res.status(403).json({
        success: false,
        error: 'Cannot delete Super Admin user',
      });
      return;
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message,
    });
  }
};

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('role', 'code type');
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Don't allow deactivating super admin
    if ((user.role as any).code === 'SUPER_ADMIN') {
      res.status(403).json({
        success: false,
        error: 'Cannot deactivate Super Admin user',
      });
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    await user.populate('role', 'name code');
    await user.populate('projects', 'name code');

    const userResponse: any = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordOTP;
    delete userResponse.resetPasswordOTPExpires;

    res.json({
      success: true,
      data: userResponse,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error: any) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle user status',
      message: error.message,
    });
  }
};

/**
 * Search HRMS employees
 */
export const searchHRMSEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
      return;
    }

    const employees = await hrmsService.searchEmployees(query);

    res.json({
      success: true,
      data: employees,
    });
  } catch (error: any) {
    console.error('Error searching HRMS employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search HRMS employees',
      message: error.message,
    });
  }
};

/**
 * Validate employee code from HRMS
 */
export const validateEmployeeCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeCode } = req.params;

    if (!employeeCode) {
      res.status(400).json({
        success: false,
        error: 'Employee code is required',
      });
      return;
    }

    const isValid = await hrmsService.validateEmployeeCode(employeeCode);

    if (!isValid) {
      res.status(404).json({
        success: false,
        error: 'Employee code not found in HRMS',
      });
      return;
    }

    const employee = await hrmsService.getEmployeeByCode(employeeCode);

    res.json({
      success: true,
      data: employee,
      message: 'Employee code is valid',
    });
  } catch (error: any) {
    console.error('Error validating employee code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate employee code',
      message: error.message,
    });
  }
};

/**
 * Bulk import users from HRMS
 */
export const bulkImportFromHRMS = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeCodes, roleId, projectIds } = req.body;

    if (!Array.isArray(employeeCodes) || employeeCodes.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Employee codes array is required',
      });
      return;
    }

    if (!roleId) {
      res.status(400).json({
        success: false,
        error: 'Role ID is required',
      });
      return;
    }

    // Validate role
    const role = await Role.findById(roleId);
    if (!role) {
      res.status(400).json({
        success: false,
        error: 'Invalid role ID',
      });
      return;
    }

    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    for (const employeeCode of employeeCodes) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ employeeCode });
        if (existingUser) {
          results.failed.push({
            employeeCode,
            reason: 'User already exists',
          });
          continue;
        }

        // Fetch from HRMS
        const hrmsData = await hrmsService.syncEmployeeData(employeeCode);

        // Create user
        const user = new User({
          ...hrmsData,
          role: roleId,
          projects: projectIds || [],
          password: Math.random().toString(36).slice(-10), // Random password
        });

        await user.save();
        results.success.push({
          employeeCode,
          userId: user._id,
          name: `${user.firstName} ${user.lastName}`,
        });
      } catch (error: any) {
        results.failed.push({
          employeeCode,
          reason: error.message,
        });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `Imported ${results.success.length} users, ${results.failed.length} failed`,
    });
  } catch (error: any) {
    console.error('Error bulk importing users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to bulk import users',
      message: error.message,
    });
  }
};

/**
 * Reset user password (admin function)
 */
export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long',
      });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    user.resetPasswordAttempts = 0;
    user.resetPasswordLockedUntil = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
      message: error.message,
    });
  }
};

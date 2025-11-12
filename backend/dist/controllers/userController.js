"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPassword = exports.bulkImportFromHRMS = exports.validateEmployeeCode = exports.searchHRMSEmployees = exports.toggleUserStatus = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const hrmsService_1 = require("../services/hrmsService");
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', role = '', isActive = '', project = '', department = '', } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const filter = {};
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
            User_1.User.find(filter)
                .select('-password -resetPasswordOTP -resetPasswordOTPExpires')
                .populate('role', 'name code')
                .populate('projects', 'name code')
                .populate('reportingManager', 'firstName lastName email employeeCode')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            User_1.User.countDocuments(filter),
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
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users',
            message: error.message,
        });
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id)
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
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user',
            message: error.message,
        });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, mobile, role, employeeCode, department, designation, joiningDate, reportingManager, projects, syncFromHRMS = false, } = req.body;
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
        if (email) {
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: 'User with this email already exists',
                });
                return;
            }
        }
        if (employeeCode) {
            const existingEmployee = await User_1.User.findOne({ employeeCode });
            if (existingEmployee) {
                res.status(400).json({
                    success: false,
                    error: 'User with this employee code already exists',
                });
                return;
            }
        }
        const roleDoc = await Role_1.Role.findById(role);
        if (!roleDoc) {
            res.status(400).json({
                success: false,
                error: 'Invalid role ID',
            });
            return;
        }
        let userData = {
            email,
            password: password || Math.random().toString(36).slice(-10),
            firstName,
            lastName,
            mobile,
            role,
            department,
            designation,
            reportingManager,
            projects: projects || [],
        };
        if (syncFromHRMS && employeeCode) {
            try {
                const hrmsData = await hrmsService_1.hrmsService.syncEmployeeData(employeeCode);
                if (hrmsData) {
                    userData = {
                        ...userData,
                        ...hrmsData,
                        firstName: firstName || hrmsData.firstName,
                        lastName: lastName || hrmsData.lastName,
                        email: email || hrmsData.email,
                        mobile: mobile || hrmsData.mobile,
                    };
                }
                if (userData.email) {
                    const existingUserByEmail = await User_1.User.findOne({ email: userData.email });
                    if (existingUserByEmail) {
                        res.status(400).json({
                            success: false,
                            error: `User with email ${userData.email} already exists`,
                        });
                        return;
                    }
                }
            }
            catch (hrmsError) {
                res.status(400).json({
                    success: false,
                    error: 'Failed to sync from HRMS',
                    message: hrmsError.message,
                });
                return;
            }
        }
        else if (employeeCode) {
            userData.employeeCode = employeeCode;
        }
        if (joiningDate) {
            userData.joiningDate = new Date(joiningDate);
        }
        const user = new User_1.User(userData);
        await user.save();
        await user.populate('role', 'name code');
        await user.populate('projects', 'name code');
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.resetPasswordOTP;
        delete userResponse.resetPasswordOTPExpires;
        res.status(201).json({
            success: true,
            data: userResponse,
            message: 'User created successfully',
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                error: messages.join(', '),
            });
            return;
        }
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
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, mobile, role, employeeCode, department, designation, joiningDate, reportingManager, projects, syncFromHRMS = false, } = req.body;
        const user = await User_1.User.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }
        if (req.body.email && req.body.email !== user.email) {
            const existingUser = await User_1.User.findOne({ email: req.body.email });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: 'User with this email already exists',
                });
                return;
            }
            user.email = req.body.email;
        }
        if (employeeCode && employeeCode !== user.employeeCode) {
            const existingEmployee = await User_1.User.findOne({ employeeCode });
            if (existingEmployee) {
                res.status(400).json({
                    success: false,
                    error: 'User with this employee code already exists',
                });
                return;
            }
        }
        if (role) {
            const roleDoc = await Role_1.Role.findById(role);
            if (!roleDoc) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid role ID',
                });
                return;
            }
            user.role = role;
        }
        if (syncFromHRMS && (employeeCode || user.employeeCode)) {
            try {
                const hrmsData = await hrmsService_1.hrmsService.syncEmployeeData(employeeCode || user.employeeCode);
                Object.assign(user, hrmsData);
            }
            catch (hrmsError) {
                res.status(400).json({
                    success: false,
                    error: 'Failed to sync from HRMS',
                    message: hrmsError.message,
                });
                return;
            }
        }
        if (firstName !== undefined)
            user.firstName = firstName;
        if (lastName !== undefined)
            user.lastName = lastName;
        if (mobile !== undefined)
            user.mobile = mobile;
        if (employeeCode !== undefined)
            user.employeeCode = employeeCode;
        if (department !== undefined)
            user.department = department;
        if (designation !== undefined)
            user.designation = designation;
        if (joiningDate !== undefined)
            user.joiningDate = new Date(joiningDate);
        if (reportingManager !== undefined)
            user.reportingManager = reportingManager;
        if (projects !== undefined)
            user.projects = projects;
        await user.save();
        await user.populate('role', 'name code');
        await user.populate('projects', 'name code');
        await user.populate('reportingManager', 'firstName lastName email employeeCode');
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.resetPasswordOTP;
        delete userResponse.resetPasswordOTPExpires;
        res.json({
            success: true,
            data: userResponse,
            message: 'User updated successfully',
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update user',
            message: error.message,
        });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }
        await user.populate('role', 'code type');
        if (user.role.code === 'SUPER_ADMIN') {
            res.status(403).json({
                success: false,
                error: 'Cannot delete Super Admin user',
            });
            return;
        }
        await User_1.User.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user',
            message: error.message,
        });
    }
};
exports.deleteUser = deleteUser;
const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findById(id).populate('role', 'code type');
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found',
            });
            return;
        }
        if (user.role.code === 'SUPER_ADMIN') {
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
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.resetPasswordOTP;
        delete userResponse.resetPasswordOTPExpires;
        res.json({
            success: true,
            data: userResponse,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        });
    }
    catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to toggle user status',
            message: error.message,
        });
    }
};
exports.toggleUserStatus = toggleUserStatus;
const searchHRMSEmployees = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            res.status(400).json({
                success: false,
                error: 'Search query is required',
            });
            return;
        }
        const employees = await hrmsService_1.hrmsService.searchEmployees(query);
        res.json({
            success: true,
            data: employees,
        });
    }
    catch (error) {
        console.error('Error searching HRMS employees:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search HRMS employees',
            message: error.message,
        });
    }
};
exports.searchHRMSEmployees = searchHRMSEmployees;
const validateEmployeeCode = async (req, res) => {
    try {
        const { employeeCode } = req.params;
        if (!employeeCode) {
            res.status(400).json({
                success: false,
                error: 'Employee code is required',
            });
            return;
        }
        const isValid = await hrmsService_1.hrmsService.validateEmployeeCode(employeeCode);
        if (!isValid) {
            res.status(404).json({
                success: false,
                error: 'Employee code not found in HRMS',
            });
            return;
        }
        const employee = await hrmsService_1.hrmsService.getEmployeeByCode(employeeCode);
        res.json({
            success: true,
            data: employee,
            message: 'Employee code is valid',
        });
    }
    catch (error) {
        console.error('Error validating employee code:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to validate employee code',
            message: error.message,
        });
    }
};
exports.validateEmployeeCode = validateEmployeeCode;
const bulkImportFromHRMS = async (req, res) => {
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
        const role = await Role_1.Role.findById(roleId);
        if (!role) {
            res.status(400).json({
                success: false,
                error: 'Invalid role ID',
            });
            return;
        }
        const results = {
            success: [],
            failed: [],
        };
        for (const employeeCode of employeeCodes) {
            try {
                const existingUser = await User_1.User.findOne({ employeeCode });
                if (existingUser) {
                    results.failed.push({
                        employeeCode,
                        reason: 'User already exists',
                    });
                    continue;
                }
                const hrmsData = await hrmsService_1.hrmsService.syncEmployeeData(employeeCode);
                if (!hrmsData) {
                    results.failed.push({
                        employeeCode,
                        reason: 'No HRMS data found',
                    });
                    continue;
                }
                const user = new User_1.User({
                    ...hrmsData,
                    role: roleId,
                    projects: projectIds || [],
                    password: Math.random().toString(36).slice(-10),
                });
                await user.save();
                results.success.push({
                    employeeCode,
                    userId: user._id,
                    name: `${user.firstName} ${user.lastName}`,
                });
            }
            catch (error) {
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
    }
    catch (error) {
        console.error('Error bulk importing users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to bulk import users',
            message: error.message,
        });
    }
};
exports.bulkImportFromHRMS = bulkImportFromHRMS;
const resetUserPassword = async (req, res) => {
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
        const user = await User_1.User.findById(id);
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
    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to reset password',
            message: error.message,
        });
    }
};
exports.resetUserPassword = resetUserPassword;
//# sourceMappingURL=userController.js.map
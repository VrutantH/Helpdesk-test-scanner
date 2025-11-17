import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserPermissions,
  searchHRMSEmployees,
  validateEmployeeCode,
} from '../controllers/userController';

const router = Router();

// All user routes require authentication
router.use(auth);

// HRMS routes (must be before /:id route to avoid conflicts)
// @desc    Search HRMS employees
// @route   GET /api/users/hrms/search
// @access  Private
router.get('/hrms/search', searchHRMSEmployees);

// @desc    Validate employee code
// @route   GET /api/users/hrms/validate/:employeeCode
// @access  Private
router.get('/hrms/validate/:employeeCode', validateEmployeeCode);

// @desc    Get all users
// @route   GET /api/users
// @access  Private
router.get('/', getAllUsers);

// @desc    Create new user
// @route   POST /api/users
// @access  Private
router.post('/', createUser);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', getUserById);

// @desc    Get user permissions
// @route   GET /api/users/:id/permissions
// @access  Private
router.get('/:id/permissions', getUserPermissions);

// @desc    Toggle user status
// @route   PATCH /api/users/:id/toggle-status
// @access  Private
router.patch('/:id/toggle-status', toggleUserStatus);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', updateUser);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
router.delete('/:id', deleteUser);

export default router;

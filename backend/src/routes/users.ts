import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

// All user routes require authentication
router.use(auth);

// @desc    Get all users
// @route   GET /api/users
// @access  Private
router.get('/', getAllUsers);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', getUserById);

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', updateUser);

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
router.delete('/:id', deleteUser);

export default router;

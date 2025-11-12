import { Router } from 'express';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController';

const router = Router();

// All role routes require authentication
router.use(auth);

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private
router.get('/roles', getRoles);

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Private
router.get('/roles/:id', getRoleById);

// @desc    Create new role
// @route   POST /api/roles
// @access  Private (requires permission)
router.post('/roles', checkPermission('role', 'create'), createRole);

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private (requires permission)
router.put('/roles/:id', checkPermission('role', 'update'), updateRole);

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private (requires permission)
router.delete('/roles/:id', checkPermission('role', 'delete'), deleteRole);

export default router;

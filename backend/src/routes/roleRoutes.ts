import express from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  toggleRoleStatus,
} from '../controllers/roleController';

const router = express.Router();

// Role routes
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRoleById);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);
router.patch('/roles/:id/toggle-status', toggleRoleStatus);

// Permission routes
router.get('/permissions', getAllPermissions);

export default router;

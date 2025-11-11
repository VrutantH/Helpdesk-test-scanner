import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  searchHRMSEmployees,
  validateEmployeeCode,
  bulkImportFromHRMS,
  resetUserPassword,
} from '../controllers/userController';

const router = express.Router();

// User CRUD routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.post('/:id/reset-password', resetUserPassword);

// HRMS integration routes
router.get('/hrms/search', searchHRMSEmployees);
router.get('/hrms/validate/:employeeCode', validateEmployeeCode);
router.post('/hrms/bulk-import', bulkImportFromHRMS);

export default router;

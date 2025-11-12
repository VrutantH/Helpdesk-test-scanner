import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getAllAccessLogs,
  getAccessLogById,
  createAccessLog,
  getAccessStats,
  exportAccessLogs
} from '../controllers/accessLogController';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// @desc    Get all access logs with filters
// @route   GET /api/access-logs
// @access  Private (Admin/Superadmin)
router.get('/', getAllAccessLogs);

// @desc    Get access log statistics
// @route   GET /api/access-logs/stats
// @access  Private (Admin/Superadmin)
router.get('/stats', getAccessStats);

// @desc    Export access logs
// @route   GET /api/access-logs/export
// @access  Private (Admin/Superadmin)
router.get('/export', exportAccessLogs);

// @desc    Get single access log by ID
// @route   GET /api/access-logs/:id
// @access  Private (Admin/Superadmin)
router.get('/:id', getAccessLogById);

// @desc    Create access log
// @route   POST /api/access-logs
// @access  Private (typically called by system)
router.post('/', createAccessLog);

export default router;

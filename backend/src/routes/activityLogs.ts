import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getAllActivityLogs,
  getActivityLogById,
  createActivityLog,
  getActivityStats,
  exportActivityLogs
} from '../controllers/activityLogController';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// @desc    Get all activity logs with filters
// @route   GET /api/activity-logs
// @access  Private (Admin/Superadmin)
router.get('/', getAllActivityLogs);

// @desc    Get activity log statistics
// @route   GET /api/activity-logs/stats
// @access  Private (Admin/Superadmin)
router.get('/stats', getActivityStats);

// @desc    Export activity logs
// @route   GET /api/activity-logs/export
// @access  Private (Admin/Superadmin)
router.get('/export', exportActivityLogs);

// @desc    Get single activity log by ID
// @route   GET /api/activity-logs/:id
// @access  Private (Admin/Superadmin)
router.get('/:id', getActivityLogById);

// @desc    Create activity log
// @route   POST /api/activity-logs
// @access  Private (typically called by system)
router.post('/', createActivityLog);

export default router;

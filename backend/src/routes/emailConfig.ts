import express from 'express';
import {
  getEmailConfig,
  updateEmailConfig,
  testEmailConfig,
  updateEmailTrigger,
} from '../controllers/emailConfigController';
import { authMiddleware } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';

const router = express.Router();

// Get email configuration for a project
router.get('/:projectId', authMiddleware, checkPermission('PROJECT_MANAGE_SETTINGS'), getEmailConfig);

// Update email configuration
router.put('/:projectId', authMiddleware, checkPermission('PROJECT_MANAGE_SETTINGS'), updateEmailConfig);

// Test email configuration
router.post('/:projectId/test', authMiddleware, checkPermission('PROJECT_MANAGE_SETTINGS'), testEmailConfig);

// Update specific email trigger
router.put('/:projectId/triggers/:triggerName', authMiddleware, checkPermission('PROJECT_MANAGE_SETTINGS'), updateEmailTrigger);

export default router;

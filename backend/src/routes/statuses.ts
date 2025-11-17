import express from 'express';
import {
  getStatusesByProject,
  createStatus,
  updateStatus,
  deleteStatus,
  getStatusById,
  reorderStatuses,
} from '../controllers/statusController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all statuses for a project
router.get('/project/:projectId', getStatusesByProject);

// Create a new status
router.post('/project/:projectId', authMiddleware, createStatus);

// Reorder statuses
router.put('/project/:projectId/reorder', authMiddleware, reorderStatuses);

// Get a single status
router.get('/:statusId', getStatusById);

// Update a status
router.put('/:statusId', authMiddleware, updateStatus);

// Delete a status
router.delete('/:statusId', authMiddleware, deleteStatus);

export default router;

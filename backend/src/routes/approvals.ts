import express from 'express';
import {
  getWorkflowsByProject,
  createWorkflow,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
} from '../controllers/approvalController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get workflows for a project
router.get('/project/:projectId', getWorkflowsByProject);

// Create a new workflow
router.post('/', authMiddleware, createWorkflow);

// Get a single workflow
router.get('/:id', getWorkflowById);

// Update a workflow
router.put('/:id', authMiddleware, updateWorkflow);

// Delete (soft) a workflow
router.delete('/:id', authMiddleware, deleteWorkflow);

export default router;

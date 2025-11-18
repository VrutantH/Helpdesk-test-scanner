import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  updateProjectModules,
  getProjectStats,
  getProjectBranding,
  getProjectTicketSettings,
  getOfflineSettings,
  updateOfflineSettings,
} from '../controllers/projectController';

const router = express.Router();

// Get all projects with optional filtering
router.get('/', getAllProjects);

// Get project statistics
router.get('/stats', getProjectStats);

// Get project branding by custom URL path (must be before /:id to avoid conflicts)
router.get('/branding/:urlPath', getProjectBranding);

// Get project ticket submission settings
router.get('/:projectId/ticket-settings', getProjectTicketSettings);

// Get offline module settings
router.get('/:id/offline-settings', getOfflineSettings);

// Update offline module settings
router.put('/:id/offline-settings', updateOfflineSettings);

// Get single project by ID
router.get('/:id', getProjectById);

// Create new project
router.post('/', createProject);

// Update project
router.put('/:id', updateProject);

// Delete project
router.delete('/:id', deleteProject);

// Toggle project status
router.patch('/:id/toggle-status', toggleProjectStatus);

// Update project modules
router.patch('/:id/modules', updateProjectModules);

export default router;

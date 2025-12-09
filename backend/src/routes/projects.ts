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
  getProjectByDomain,
  getProjectTicketSettings,
  updateProjectTicketSettings,
  getOfflineSettings,
  updateOfflineSettings,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';

const router = express.Router();

// Get all projects with optional filtering
router.get('/', authMiddleware, checkPermission('PROJECT_VIEW_ALL'), getAllProjects);

// Get project statistics
router.get('/stats', authMiddleware, checkPermission('PROJECT_VIEW_ALL'), getProjectStats);

// Get project branding by custom URL path (must be before /:id to avoid conflicts)
router.get('/branding/:urlPath', getProjectBranding);

// Get project configuration by domain (for login page - favicon, background, announcement)
router.get('/by-domain/:domain', getProjectByDomain);

// Get project ticket submission settings (public endpoint for student portal)
router.get('/:projectId/ticket-settings', getProjectTicketSettings);

// Update project ticket submission settings
router.put('/:projectId/ticket-settings', authMiddleware, checkPermission('PROJECT_MANAGE_SETTINGS'), updateProjectTicketSettings);

// Get offline module settings
router.get('/:id/offline-settings', authMiddleware, checkPermission(['PROJECT_VIEW_ALL', 'OFFLINE_MODULE_ACCESS']), getOfflineSettings);

// Update offline module settings
router.put('/:id/offline-settings', authMiddleware, checkPermission('PROJECT_MANAGE_SETTINGS'), updateOfflineSettings);

// Get single project by ID
router.get('/:id', authMiddleware, checkPermission('PROJECT_VIEW_ALL'), getProjectById);

// Create new project
router.post('/', authMiddleware, checkPermission('PROJECT_CREATE'), createProject);

// Update project
router.put('/:id', authMiddleware, checkPermission('PROJECT_EDIT'), updateProject);

// Delete project
router.delete('/:id', authMiddleware, checkPermission('PROJECT_DELETE'), deleteProject);

// Toggle project status
router.patch('/:id/toggle-status', authMiddleware, checkPermission('PROJECT_TOGGLE_STATUS'), toggleProjectStatus);

// Update project modules
router.patch('/:id/modules', authMiddleware, checkPermission('PROJECT_MANAGE_SETTINGS'), updateProjectModules);

export default router;

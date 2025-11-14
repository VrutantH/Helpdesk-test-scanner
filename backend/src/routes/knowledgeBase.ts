import { Router } from 'express';
import { auth, publicAuth } from '../middleware/auth';
import { requireSuperAdmin } from '../middleware/roleCheck';
import {
  getArticlesByProject,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  articleFeedback,
  getCategories
} from '../controllers/knowledgeBaseController';

const router = Router();

// Public routes - accessible without authentication
router.get('/project/:projectId', publicAuth, getArticlesByProject);
router.get('/project/:projectId/categories', publicAuth, getCategories);
router.get('/:id', publicAuth, getArticleById);
router.post('/:id/feedback', articleFeedback); // Public feedback

// Protected routes (SuperAdmin only)
router.post('/', auth, requireSuperAdmin, createArticle);
router.put('/:id', auth, requireSuperAdmin, updateArticle);
router.delete('/:id', auth, requireSuperAdmin, deleteArticle);

export default router;

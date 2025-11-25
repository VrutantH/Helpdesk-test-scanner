import { Router } from 'express';
import { auth, publicAuth } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
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

// Public routes - accessible without authentication (for student portal)
router.get('/project/:projectId', publicAuth, getArticlesByProject);
router.get('/project/:projectId/categories', publicAuth, getCategories);
router.get('/:id', publicAuth, getArticleById);
router.post('/:id/feedback', articleFeedback); // Public feedback

// Protected routes - permission-based access control
router.post('/', auth, checkPermission('KB_CREATE'), createArticle);
router.put('/:id', auth, checkPermission('KB_EDIT'), updateArticle);
router.delete('/:id', auth, checkPermission('KB_DELETE'), deleteArticle);

export default router;

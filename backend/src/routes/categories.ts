import express from 'express';
import {
  getCategoriesByProject,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/permissions';

const router = express.Router();

// Get all categories (admin/debug endpoint)
router.get('/all', authMiddleware, getAllCategories);

// Get all categories for a project
router.get('/project/:projectId', getCategoriesByProject);

// Create new category
router.post('/project/:projectId', authMiddleware, requirePermission('MASTER_DATA_MANAGE_CATEGORIES'), createCategory);

// Get single category
router.get('/:categoryId', authMiddleware, requirePermission('MASTER_DATA_VIEW'), getCategoryById);

// Update a category
router.put('/:categoryId', authMiddleware, requirePermission('MASTER_DATA_MANAGE_CATEGORIES'), updateCategory);

// Delete a category
router.delete('/:categoryId', authMiddleware, requirePermission('MASTER_DATA_MANAGE_CATEGORIES'), deleteCategory);

export default router;

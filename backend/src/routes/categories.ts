import express from 'express';
import {
  getCategoriesByProject,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all categories for a project
router.get('/project/:projectId', getCategoriesByProject);

// Create a new category
router.post('/project/:projectId', authMiddleware, createCategory);

// Get a single category
router.get('/:categoryId', getCategoryById);

// Update a category
router.put('/:categoryId', authMiddleware, updateCategory);

// Delete a category
router.delete('/:categoryId', authMiddleware, deleteCategory);

export default router;

import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getMasterData,
  getMasterDataByCategory,
  createMasterData,
  updateMasterData,
  deleteMasterData,
} from '../controllers/masterDataController';

const router = Router();

// All master data routes require authentication
router.use(auth);

// @desc    Get all master data
// @route   GET /api/master-data
// @access  Private
router.get('/', getMasterData);

// @desc    Get master data by category
// @route   GET /api/master-data/category/:category
// @access  Private
router.get('/category/:category', getMasterDataByCategory);

// @desc    Create master data
// @route   POST /api/master-data
// @access  Private
router.post('/', createMasterData);

// @desc    Update master data
// @route   PUT /api/master-data/:id
// @access  Private
router.put('/:id', updateMasterData);

// @desc    Delete master data
// @route   DELETE /api/master-data/:id
// @access  Private
router.delete('/:id', deleteMasterData);

export default router;

import express from 'express';
import {
  getMasterDataByCategory,
  getAllCategories,
  createMasterData,
  updateMasterData,
  deleteMasterData,
  toggleMasterDataStatus,
  bulkCreateMasterData,
} from '../controllers/masterDataController';

const router = express.Router();

// Get all categories
router.get('/categories', getAllCategories);

// Get master data by category
router.get('/category/:category', getMasterDataByCategory);

// Create single master data item
router.post('/', createMasterData);

// Bulk create master data items
router.post('/bulk', bulkCreateMasterData);

// Update master data item
router.put('/:id', updateMasterData);

// Delete master data item
router.delete('/:id', deleteMasterData);

// Toggle master data status
router.patch('/:id/toggle-status', toggleMasterDataStatus);

export default router;

import { Router } from 'express';
import { auth } from '../middleware/auth';
import { getCities, getStates } from '../controllers/master-data/cityStateController';

const router = Router();

// All routes require authentication
router.use(auth);

// @desc    Get all cities
// @route   GET /api/masters/cities
// @access  Private
router.get('/cities', getCities);

// @desc    Get all states/regions  
// @route   GET /api/masters/states
// @access  Private
router.get('/states', getStates);

export default router;

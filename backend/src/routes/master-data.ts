import { Router } from 'express';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';
import { getCities, getStates } from '../controllers/master-data/cityStateController';
import { getCountries } from '../controllers/master-data/countryController';

const router = Router();

// All routes require authentication
router.use(auth);

// @desc    Get all countries
// @route   GET /api/masters/countries
// @access  Private - requires view permission
router.get('/countries', checkPermission('MASTER_DATA_VIEW'), getCountries);

// @desc    Get all cities
// @route   GET /api/masters/cities
// @access  Private - requires view permission
router.get('/cities', checkPermission('MASTER_DATA_VIEW'), getCities);

// @desc    Get all states/regions  
// @route   GET /api/masters/states
// @access  Private - requires view permission
router.get('/states', checkPermission('MASTER_DATA_VIEW'), getStates);

export default router;


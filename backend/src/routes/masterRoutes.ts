import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} from '../controllers/master-data/countryController';

import {
  getStates,
  createState,
  updateState,
  deleteState,
} from '../controllers/master-data/stateController';

import {
  getCities,
  createCity,
  updateCity,
  deleteCity,
} from '../controllers/master-data/cityController';

const router = Router();

// All routes require authentication
router.use(auth);

// Country routes
router.get('/countries', getCountries);
router.post('/countries', createCountry);
router.put('/countries/:id', updateCountry);
router.delete('/countries/:id', deleteCountry);

// State routes
router.get('/states', getStates);
router.post('/states', createState);
router.put('/states/:id', updateState);
router.delete('/states/:id', deleteState);

// City routes
router.get('/cities', getCities);
router.post('/cities', createCity);
router.put('/cities/:id', updateCity);
router.delete('/cities/:id', deleteCity);

export default router;

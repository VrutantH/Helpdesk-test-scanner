import { Router } from 'express';
import * as cityController from '../../controllers/master-data/cityController';

const router = Router();

// City routes
router.get('/', cityController.getCities);
router.get('/:id', cityController.getCityById);
router.post('/', cityController.createCity);
router.put('/:id', cityController.updateCity);
router.delete('/:id', cityController.deleteCity);
router.patch('/:id/toggle-status', cityController.toggleCityStatus);

export default router;

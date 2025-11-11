import { Router } from 'express';
import * as stateController from '../../controllers/master-data/stateController';

const router = Router();

// State routes
router.get('/', stateController.getStates);
router.get('/:id', stateController.getStateById);
router.post('/', stateController.createState);
router.put('/:id', stateController.updateState);
router.delete('/:id', stateController.deleteState);
router.patch('/:id/toggle-status', stateController.toggleStateStatus);

export default router;

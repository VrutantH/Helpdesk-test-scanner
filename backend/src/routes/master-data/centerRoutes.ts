import { Router } from 'express';
import * as centerController from '../../controllers/master-data/centerController';

const router = Router();

// Center routes
router.get('/', centerController.getCenters);
router.get('/:id', centerController.getCenterById);
router.post('/', centerController.createCenter);
router.put('/:id', centerController.updateCenter);
router.delete('/:id', centerController.deleteCenter);
router.patch('/:id/toggle-status', centerController.toggleCenterStatus);

export default router;

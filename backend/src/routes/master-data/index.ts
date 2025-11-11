import { Router } from 'express';
import stateRoutes from './stateRoutes';
import cityRoutes from './cityRoutes';
import centerRoutes from './centerRoutes';
import otherRoutes from './otherRoutes';

const router = Router();

// Mount all master data routes
router.use('/states', stateRoutes);
router.use('/cities', cityRoutes);
router.use('/centers', centerRoutes);
router.use('/', otherRoutes); // This handles all other simple master data types

export default router;

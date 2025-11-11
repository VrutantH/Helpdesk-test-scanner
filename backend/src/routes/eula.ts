import express from 'express';
import { acceptEula, checkEulaStatus, getEulaHistory } from '../controllers/eulaController';

const router = express.Router();

// Accept EULA
router.post('/accept-eula', acceptEula);

// Check EULA status
router.get('/eula-status', checkEulaStatus);

// Get EULA acceptance history for a user
router.get('/eula-history', getEulaHistory);

export default router;

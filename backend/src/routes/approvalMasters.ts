import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getApprovalMasters } from '../controllers/approvalMasterController';

const router = Router();

router.get('/', authMiddleware, getApprovalMasters);

export default router;

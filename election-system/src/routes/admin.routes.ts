import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// All admin routes require admin authentication
router.use(authenticate, requireAdmin);

// Constituency Management
router.post('/constituencies', adminController.createConstituency);
router.get('/constituencies', adminController.listConstituencies);

// User Management
router.get('/users', adminController.searchUsers);
router.patch('/users/:nationalId/promote', adminController.promoteToEC);
router.patch('/users/:nationalId/demote', adminController.demoteToVoter);

export default router;

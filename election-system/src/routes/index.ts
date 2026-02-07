import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import ecRoutes from './ec.routes';
import voteRoutes from './vote.routes';
import publicRoutes from './public.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/ec', ecRoutes);
router.use('/vote', voteRoutes);
router.use('/public', publicRoutes);

export default router;

import { Router } from 'express';
import * as ecController from '../controllers/ecController';
import { authenticate, requireEC } from '../middlewares/auth.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';

const router = Router();

// All EC routes require EC authentication
router.use(authenticate, requireEC);

// Party Management
router.post('/parties', uploadSingle('logo'), ecController.createParty);
router.get('/parties', ecController.listParties);

// Candidate Management
router.post('/candidates', uploadSingle('image'), ecController.createCandidate);
router.get('/constituencies/:constituencyId/candidates', ecController.getConstituencyCandidates);

// Constituency Status Management
router.get('/constituencies', ecController.listConstituencies);
router.patch('/constituencies/:id/close', ecController.closeConstituency);
router.patch('/constituencies/:id/open', ecController.openConstituency);

export default router;

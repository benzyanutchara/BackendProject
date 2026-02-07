import { Router } from 'express';
import * as publicController from '../controllers/publicController';

const router = Router();

// Constituency endpoints (public - no authentication required)
router.get('/constituencies', publicController.listConstituencies);
router.get('/constituencies/:id/results', publicController.getConstituencyResults);

// Party endpoints (public)
router.get('/parties', publicController.listParties);
router.get('/parties/overview', publicController.getPartyOverview);
router.get('/parties/:id', publicController.getPartyDetails);

export default router;

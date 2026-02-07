import { Router } from 'express';
import * as voteController from '../controllers/voteController';
import { authenticate, requireUser } from '../middlewares/auth.middleware';

const router = Router();

// All vote routes require user authentication
router.use(authenticate, requireUser);

// Get candidates for voting (in user's constituency)
router.get('/candidates', voteController.getCandidates);

// Cast or update vote
router.post('/', voteController.castVote);

// Get current user's vote
router.get('/my-vote', voteController.getMyVote);

// Remove vote
router.delete('/', voteController.removeVote);

export default router;

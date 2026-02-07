import { Request, Response } from 'express';
import { VoteService } from '../services/vote.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';

const voteService = new VoteService();

export const castVote = asyncHandler(async (req: Request, res: Response) => {
  const { candidateId } = req.body;
  const { userId, constituencyId } = req.user!;

  const vote = await voteService.castVote(userId, candidateId, constituencyId);

  sendCreated(res, vote, 'Vote cast successfully');
});

export const getMyVote = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.user!;

  const vote = await voteService.getUserVote(userId);

  sendSuccess(res, vote);
});

export const removeVote = asyncHandler(async (req: Request, res: Response) => {
  const { userId, constituencyId } = req.user!;

  await voteService.removeVote(userId, constituencyId);

  sendNoContent(res);
});

export const getCandidates = asyncHandler(async (req: Request, res: Response) => {
  const { constituencyId } = req.user!;

  const candidates = await voteService.getCandidatesForVoting(constituencyId);

  sendSuccess(res, candidates);
});

import { VoteRepository } from '../repositories/vote.repository';
import { CandidateRepository } from '../repositories/candidate.repository';
import { AppError } from '../utils/appError';

const voteRepo = new VoteRepository();
const candidateRepo = new CandidateRepository();

export class VoteService {
  async castVote(userId: string, candidateId: number, userConstituencyId: number) {
    // Get candidate with constituency info
    const candidate = await candidateRepo.findByIdWithConstituency(candidateId);
    if (!candidate) {
      throw new AppError('Candidate not found', 404);
    }

    // Check if user is voting in their own constituency
    if (candidate.constituency_id !== userConstituencyId) {
      throw new AppError('You can only vote for candidates in your constituency', 403);
    }

    // Check if constituency is closed
    if (candidate.is_closed) {
      throw new AppError('Voting is closed in this constituency', 403);
    }

    return voteRepo.upsert(userId, candidateId);
  }

  async getUserVote(userId: string) {
    return voteRepo.findByUserId(userId);
  }

  async removeVote(userId: string, userConstituencyId: number) {
    const vote = await voteRepo.findByUserId(userId);
    if (!vote) {
      throw new AppError('No vote to remove', 404);
    }

    // Get candidate to check if constituency is closed
    const candidate = await candidateRepo.findByIdWithConstituency(vote.candidate_id);
    if (candidate?.is_closed) {
      throw new AppError('Cannot remove vote after constituency is closed', 403);
    }

    await voteRepo.delete(userId);
    return { message: 'Vote removed successfully' };
  }

  async getCandidatesForVoting(constituencyId: number) {
    return candidateRepo.findByConstituency(constituencyId);
  }
}

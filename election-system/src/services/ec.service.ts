import { PartyRepository } from '../repositories/party.repository';
import { CandidateRepository } from '../repositories/candidate.repository';
import { ConstituencyRepository } from '../repositories/constituency.repository';
import { uploadToSupabase } from '../utils/upload.utils';
import { AppError } from '../utils/appError';

const partyRepo = new PartyRepository();
const candidateRepo = new CandidateRepository();
const constituencyRepo = new ConstituencyRepository();

export class ECService {
  async createParty(data: { name: string; policy: string; logoFile: Express.Multer.File }) {
    // Check if party name already exists
    const existing = await partyRepo.findByName(data.name);
    if (existing) {
      throw new AppError('Party name already exists', 400);
    }

    const logoUrl = await uploadToSupabase(data.logoFile, 'parties');
    return partyRepo.create({
      name: data.name,
      policy: data.policy,
      logoUrl,
    });
  }

  async listParties() {
    return partyRepo.list();
  }

  async createCandidate(data: {
    title: string;
    firstName: string;
    lastName: string;
    number: number;
    partyId: number;
    constituencyId: number;
    imageFile: Express.Multer.File;
  }) {
    // Verify party exists
    const party = await partyRepo.findById(data.partyId);
    if (!party) {
      throw new AppError('Party not found', 404);
    }

    // Verify constituency exists
    const constituency = await constituencyRepo.findById(data.constituencyId);
    if (!constituency) {
      throw new AppError('Constituency not found', 404);
    }

    // Check if candidate number already exists in this constituency
    const existing = await candidateRepo.findByNumberInConstituency(data.constituencyId, data.number);
    if (existing) {
      throw new AppError('Candidate number already exists in this constituency', 400);
    }

    const imageUrl = await uploadToSupabase(data.imageFile, 'candidates');
    return candidateRepo.create({
      title: data.title,
      firstName: data.firstName,
      lastName: data.lastName,
      number: data.number,
      partyId: data.partyId,
      constituencyId: data.constituencyId,
      imageUrl,
    });
  }

  async getConstituencyCandidates(constituencyId: number) {
    const constituency = await constituencyRepo.findById(constituencyId);
    if (!constituency) {
      throw new AppError('Constituency not found', 404);
    }

    return candidateRepo.findByConstituency(constituencyId);
  }

  async closeConstituency(id: number) {
    const constituency = await constituencyRepo.findById(id);
    if (!constituency) {
      throw new AppError('Constituency not found', 404);
    }

    if (constituency.is_closed) {
      throw new AppError('Constituency is already closed', 400);
    }

    return constituencyRepo.updateClosedStatus(id, true);
  }

  async openConstituency(id: number) {
    const constituency = await constituencyRepo.findById(id);
    if (!constituency) {
      throw new AppError('Constituency not found', 404);
    }

    if (!constituency.is_closed) {
      throw new AppError('Constituency is already open', 400);
    }

    return constituencyRepo.updateClosedStatus(id, false);
  }

  async listConstituencies() {
    return constituencyRepo.list();
  }
}

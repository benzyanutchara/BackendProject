import { ConstituencyRepository } from '../repositories/constituency.repository';
import { PartyRepository } from '../repositories/party.repository';
import { AppError } from '../utils/appError';

const constituencyRepo = new ConstituencyRepository();
const partyRepo = new PartyRepository();

export class PublicService {
  async listConstituencies() {
    return constituencyRepo.list();
  }

  async getConstituencyResults(constituencyId: number) {
    const constituency = await constituencyRepo.findById(constituencyId);
    if (!constituency) {
      throw new AppError('Constituency not found', 404);
    }

    // Only show vote counts if constituency is closed
    const candidates = await constituencyRepo.getCandidatesWithVotes(
      constituencyId,
      constituency.is_closed
    );

    return { constituency, candidates };
  }

  async listParties() {
    return partyRepo.listBasic();
  }

  async getPartyDetails(partyId: number) {
    const party = await partyRepo.findByIdWithCandidates(partyId);
    if (!party) {
      throw new AppError('Party not found', 404);
    }
    return party;
  }

  async getPartyOverview() {
    const closedConstituencies = await constituencyRepo.getClosedConstituencies();
    const partySeats = new Map<number, { party: any; seats: number }>();

    closedConstituencies.forEach((constituency) => {
      if (!constituency.candidates || !constituency.candidates.length) return;

      // Find the winner (candidate with most votes)
      const validCandidates = constituency.candidates.filter((c: any) => c.id !== null);
      if (validCandidates.length === 0) return;

      const winner = validCandidates.reduce((max: any, c: any) =>
        (c.vote_count || 0) > (max?.vote_count || 0) ? c : max
      );

      if (winner?.vote_count > 0) {
        if (!partySeats.has(winner.party_id)) {
          partySeats.set(winner.party_id, {
            party: {
              id: winner.party_id,
              name: winner.party_name,
              logo_url: winner.party_logo_url,
            },
            seats: 0,
          });
        }
        partySeats.get(winner.party_id)!.seats++;
      }
    });

    const parties = Array.from(partySeats.values())
      .map(({ party, seats }) => ({
        id: party.id,
        name: party.name,
        logoUrl: party.logo_url,
        seats,
      }))
      .sort((a, b) => b.seats - a.seats);

    return {
      totalSeats: parties.reduce((sum, p) => sum + p.seats, 0),
      closedConstituencies: closedConstituencies.length,
      parties,
    };
  }
}

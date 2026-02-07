import { ConstituencyRepository } from '../repositories/constituency.repository';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/appError';

const constituencyRepo = new ConstituencyRepository();
const userRepo = new UserRepository();

export class AdminService {
  async createConstituency(province: string, districtNumber: number) {
    // Check if constituency already exists
    const existing = await constituencyRepo.findByProvinceAndDistrict(province, districtNumber);
    if (existing) {
      throw new AppError('Constituency already exists', 400);
    }

    return constituencyRepo.create(province, districtNumber);
  }

  async listConstituencies() {
    return constituencyRepo.list();
  }

  async promoteToEC(nationalId: string) {
    const user = await userRepo.findByNationalId(nationalId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === 'EC') {
      throw new AppError('User is already an EC', 400);
    }

    return userRepo.updateRole(nationalId, 'EC');
  }

  async demoteToVoter(nationalId: string) {
    const user = await userRepo.findByNationalId(nationalId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === 'VOTER') {
      throw new AppError('User is already a VOTER', 400);
    }

    return userRepo.updateRole(nationalId, 'VOTER');
  }

  async searchUsers(searchTerm?: string) {
    if (searchTerm && searchTerm.trim()) {
      return userRepo.searchByNationalId(searchTerm.trim());
    }
    return userRepo.list();
  }
}

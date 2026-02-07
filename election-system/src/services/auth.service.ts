import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { AdminRepository } from '../repositories/admin.repository';
import { ConstituencyRepository } from '../repositories/constituency.repository';
import { AppError } from '../utils/appError';
import { generateToken } from '../utils/jwt';

const userRepo = new UserRepository();
const adminRepo = new AdminRepository();
const constituencyRepo = new ConstituencyRepository();

export class AuthService {
  async registerUser(data: {
    nationalId: string;
    password: string;
    title: string;
    firstName: string;
    lastName: string;
    address: string;
    constituencyId: number;
  }) {
    // Check if national ID already exists
    const existingUser = await userRepo.findByNationalId(data.nationalId);
    if (existingUser) {
      throw new AppError('National ID already registered', 400);
    }

    // Validate national ID format
    if (!/^\d{13}$/.test(data.nationalId)) {
      throw new AppError('National ID must be exactly 13 digits', 400);
    }

    // Verify constituency exists
    const constituency = await constituencyRepo.findById(data.constituencyId);
    if (!constituency) {
      throw new AppError('Constituency not found', 404);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepo.create({ ...data, password: hashedPassword });
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async loginUser(nationalId: string, password: string) {
    const user = await userRepo.findByNationalId(nationalId);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      constituencyId: user.constituency_id,
    });

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  async loginAdmin(username: string, password: string) {
    const admin = await adminRepo.findByUsername(username);
    if (!admin) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({ adminId: admin.id, role: 'ADMIN' });
    const { password: _, ...adminWithoutPassword } = admin;
    return { token, admin: adminWithoutPassword };
  }

  async getProfile(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

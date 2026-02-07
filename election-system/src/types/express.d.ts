import { UserRole } from './models';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: UserRole;
        constituencyId: number;
      };
      admin?: {
        adminId: number;
        role: 'ADMIN';
      };
    }
  }
}

export {};

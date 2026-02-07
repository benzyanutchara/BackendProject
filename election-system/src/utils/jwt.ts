import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRole } from '../types/models';

interface UserTokenPayload {
  userId: string;
  role: UserRole;
  constituencyId: number;
}

interface AdminTokenPayload {
  adminId: number;
  role: 'ADMIN';
}

type TokenPayload = UserTokenPayload | AdminTokenPayload;

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwt.secret) as TokenPayload;
};

export const isUserPayload = (payload: TokenPayload): payload is UserTokenPayload => {
  return 'userId' in payload;
};

export const isAdminPayload = (payload: TokenPayload): payload is AdminTokenPayload => {
  return 'adminId' in payload;
};

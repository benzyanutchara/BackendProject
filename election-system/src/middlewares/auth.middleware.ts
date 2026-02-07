import { Request, Response, NextFunction } from 'express';
import { verifyToken, isUserPayload, isAdminPayload } from '../utils/jwt';
import { AppError } from '../utils/appError';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (isUserPayload(payload)) {
      req.user = {
        userId: payload.userId,
        role: payload.role,
        constituencyId: payload.constituencyId,
      };
    } else if (isAdminPayload(payload)) {
      req.admin = {
        adminId: payload.adminId,
        role: payload.role,
      };
    }

    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new AppError('User authentication required', 401));
  }
  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.admin) {
    return next(new AppError('Admin authentication required', 401));
  }
  next();
};

export const requireEC = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'EC') {
    return next(new AppError('EC staff authentication required', 403));
  }
  next();
};

export const requireVoter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'VOTER') {
    return next(new AppError('Voter authentication required', 403));
  }
  next();
};

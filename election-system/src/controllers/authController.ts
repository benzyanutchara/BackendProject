import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/response';

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { nationalId, password, title, firstName, lastName, address, constituencyId } = req.body;

  const user = await authService.registerUser({
    nationalId,
    password,
    title,
    firstName,
    lastName,
    address,
    constituencyId,
  });

  sendCreated(res, { user }, 'User registered successfully');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { nationalId, password } = req.body;

  const result = await authService.loginUser(nationalId, password);

  sendSuccess(res, result, 'Login successful');
});

export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const result = await authService.loginAdmin(username, password);

  sendSuccess(res, result, 'Admin login successful');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const user = await authService.getProfile(userId);

  sendSuccess(res, { user });
});

import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/response';

const adminService = new AdminService();

export const createConstituency = asyncHandler(async (req: Request, res: Response) => {
  const { province, districtNumber } = req.body;

  const constituency = await adminService.createConstituency(province, districtNumber);

  sendCreated(res, constituency, 'Constituency created successfully');
});

export const listConstituencies = asyncHandler(async (req: Request, res: Response) => {
  const constituencies = await adminService.listConstituencies();

  sendSuccess(res, constituencies);
});

export const promoteToEC = asyncHandler(async (req: Request, res: Response) => {
  const { nationalId } = req.params;

  const user = await adminService.promoteToEC(nationalId);

  sendSuccess(res, user, 'User promoted to EC successfully');
});

export const demoteToVoter = asyncHandler(async (req: Request, res: Response) => {
  const { nationalId } = req.params;

  const user = await adminService.demoteToVoter(nationalId);

  sendSuccess(res, user, 'User demoted to VOTER successfully');
});

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;

  const users = await adminService.searchUsers(search as string | undefined);

  sendSuccess(res, users);
});

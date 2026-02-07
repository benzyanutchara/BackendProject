import { Request, Response } from 'express';
import { PublicService } from '../services/public.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

const publicService = new PublicService();

export const listConstituencies = asyncHandler(async (req: Request, res: Response) => {
  const constituencies = await publicService.listConstituencies();

  sendSuccess(res, constituencies);
});

export const getConstituencyResults = asyncHandler(async (req: Request, res: Response) => {
  const constituencyId = parseInt(req.params.id, 10);

  const results = await publicService.getConstituencyResults(constituencyId);

  sendSuccess(res, results);
});

export const listParties = asyncHandler(async (req: Request, res: Response) => {
  const parties = await publicService.listParties();

  sendSuccess(res, parties);
});

export const getPartyDetails = asyncHandler(async (req: Request, res: Response) => {
  const partyId = parseInt(req.params.id, 10);

  const party = await publicService.getPartyDetails(partyId);

  sendSuccess(res, party);
});

export const getPartyOverview = asyncHandler(async (req: Request, res: Response) => {
  const overview = await publicService.getPartyOverview();

  sendSuccess(res, overview);
});

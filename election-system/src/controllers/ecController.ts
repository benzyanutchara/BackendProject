import { Request, Response } from 'express';
import { ECService } from '../services/ec.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import { AppError } from '../utils/appError';

const ecService = new ECService();

export const createParty = asyncHandler(async (req: Request, res: Response) => {
  const { name, policy } = req.body;
  const logoFile = req.file;

  if (!logoFile) {
    throw new AppError('Logo file is required', 400);
  }

  const party = await ecService.createParty({
    name,
    policy,
    logoFile,
  });

  sendCreated(res, party, 'Party created successfully');
});

export const listParties = asyncHandler(async (req: Request, res: Response) => {
  const parties = await ecService.listParties();

  sendSuccess(res, parties);
});

export const createCandidate = asyncHandler(async (req: Request, res: Response) => {
  const { title, firstName, lastName, number, partyId, constituencyId } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    throw new AppError('Image file is required', 400);
  }

  const candidate = await ecService.createCandidate({
    title,
    firstName,
    lastName,
    number: parseInt(number, 10),
    partyId: parseInt(partyId, 10),
    constituencyId: parseInt(constituencyId, 10),
    imageFile,
  });

  sendCreated(res, candidate, 'Candidate created successfully');
});

export const getConstituencyCandidates = asyncHandler(async (req: Request, res: Response) => {
  const constituencyId = parseInt(req.params.constituencyId, 10);

  const candidates = await ecService.getConstituencyCandidates(constituencyId);

  sendSuccess(res, candidates);
});

export const closeConstituency = asyncHandler(async (req: Request, res: Response) => {
  const constituencyId = parseInt(req.params.id, 10);

  const constituency = await ecService.closeConstituency(constituencyId);

  sendSuccess(res, constituency, 'Constituency closed successfully');
});

export const openConstituency = asyncHandler(async (req: Request, res: Response) => {
  const constituencyId = parseInt(req.params.id, 10);

  const constituency = await ecService.openConstituency(constituencyId);

  sendSuccess(res, constituency, 'Constituency opened successfully');
});

export const listConstituencies = asyncHandler(async (req: Request, res: Response) => {
  const constituencies = await ecService.listConstituencies();

  sendSuccess(res, constituencies);
});

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  // Handle PostgreSQL errors
  if ((err as any).code === '23505') {
    statusCode = 400;
    message = 'Duplicate entry';
  }

  if ((err as any).code === '23503') {
    statusCode = 400;
    message = 'Referenced record not found';
  }

  // Log error for debugging (in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

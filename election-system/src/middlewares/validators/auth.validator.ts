import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/appError';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(messages, 400));
  }
  next();
};

export const validateRegister = [
  body('nationalId')
    .trim()
    .isLength({ min: 13, max: 13 })
    .withMessage('National ID must be exactly 13 digits')
    .isNumeric()
    .withMessage('National ID must contain only numbers'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('constituencyId')
    .isInt({ min: 1 })
    .withMessage('Valid constituency ID is required'),
  handleValidationErrors,
];

export const validateLogin = [
  body('nationalId')
    .trim()
    .isLength({ min: 13, max: 13 })
    .withMessage('National ID must be exactly 13 digits')
    .isNumeric()
    .withMessage('National ID must contain only numbers'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

export const validateAdminLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

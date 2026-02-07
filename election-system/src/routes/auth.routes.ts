import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate, requireUser } from '../middlewares/auth.middleware';
import {
  validateRegister,
  validateLogin,
  validateAdminLogin,
} from '../middlewares/validators/auth.validator';

const router = Router();

// User Registration
router.post('/register', validateRegister, authController.register);

// User Login
router.post('/login', validateLogin, authController.login);

// Admin Login
router.post('/admin/login', validateAdminLogin, authController.adminLogin);

// Get User Profile (requires authentication)
router.get('/profile', authenticate, requireUser, authController.getProfile);

export default router;

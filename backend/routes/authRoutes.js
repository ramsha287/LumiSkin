/**
 * Authentication Routes
 * Handles user registration, login, and authentication endpoints
 */

import express from 'express';
import { authenticateToken, protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  refreshToken,
  completeProfile,
  logout
} from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../validators/authValidator.js';
import { updateProfileValidation, changePasswordValidation, deleteAccountValidation } from '../validators/authValidator.js';

const router = express.Router();


// Public routes (no authentication required)
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes (authentication required)
router.get('/profile', authenticateToken, getProfile);
router.put(
  '/complete-profile',
  authenticateToken,
  protect,
  [
    body('skinType').optional().isIn(['oily','dry','combination','sensitive']),
    body('skinConcerns').optional().isArray(),
    body('allergies').optional().isArray(),
    body('budget').optional().isIn(['low', 'medium', 'high', 'luxury'])
  ],
  completeProfile
);
router.put('/update-profile', authenticateToken, updateProfileValidation, updateProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);
router.delete('/account', authenticateToken, deleteAccountValidation, deleteAccount);
router.post('/refresh-token', authenticateToken, refreshToken);
router.post('/logout', authenticateToken, logout);

export default router; 
/**
 * User Routes
 * Handles user management endpoints
 */
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/authController.js';
const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get user profile
router.get('/profile', getProfile);

// Update user profile
router.put('/profile', updateProfile);

export default router; 
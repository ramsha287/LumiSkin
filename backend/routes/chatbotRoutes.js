/**
 * Chatbot Routes
 * Handles AI skincare advice endpoints
 */
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// TODO: Implement chatbot controller functions
// For now, return placeholder responses

// Send message to chatbot
router.post('/message', (req, res) => {
  res.json({
    message: 'Send message to chatbot - TODO: Implement',
    response: {}
  });
});

// Get chat history
router.get('/history', (req, res) => {
  res.json({
    message: 'Get chat history - TODO: Implement',
    history: []
  });
});

// Clear chat history
router.delete('/history', (req, res) => {
  res.json({
    message: 'Clear chat history - TODO: Implement'
  });
});

export default router; 
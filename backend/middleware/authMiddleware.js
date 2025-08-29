// import express from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import dotenv from 'dotenv';

// dotenv.config();
// envpath = 'backend\.env';

// JWT_SECRET = load.
// /**
//  * JWT Authentication Middleware
//  * Verifies JWT tokens and attaches user data to request object
//  */

// /**
//  * Middleware to verify JWT token and authenticate user
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  * @param {Function} next - Express next function
//  */
// const authenticateToken = async (req, res, next) => {
//   try {
//     // Get token from header
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//     if (!token) {
//       return res.status(401).json({ 
//         error: 'Access denied. No token provided.' 
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     // Get user from database
//     const user = await User.findById(decoded.userId).select('-password');
    
//     if (!user) {
//       return res.status(401).json({ 
//         error: 'Invalid token. User not found.' 
//       });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({ 
//         error: 'Account is deactivated.' 
//       });
//     }

//     // Attach user to request object
//     req.user = user;
//     next();

//   } catch (error) {
//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({ 
//         error: 'Invalid token.' 
//       });
//     }
    
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ 
//         error: 'Token expired.' 
//       });
//     }

//     console.error('Auth middleware error:', error);
//     res.status(500).json({ 
//       error: 'Authentication error.' 
//     });
//   }
// };

// /**
//  * Optional authentication middleware
//  * Similar to authenticateToken but doesn't require token
//  * Useful for routes that can work with or without authentication
//  */
// const optionalAuth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token) {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decoded.userId).select('-password');
      
//       if (user && user.isActive) {
//         req.user = user;
//       }
//     }

//     next();
//   } catch (error) {
//     // Continue without authentication if token is invalid
//     next();
//   }
// };

// /**
//  * Middleware to check if user has specific role (for future role-based access)
//  * @param {String} role - Required role
//  */
// const requireRole = (role) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ 
//         error: 'Authentication required.' 
//       });
//     }

//     // For now, all authenticated users have the same access
//     // This can be extended for role-based access control
//     next();
//   };
// };

// /**
//  * Middleware to check if user owns the resource
//  * @param {String} resourceUserIdField - Field name containing user ID in request
//  */
// const requireOwnership = (resourceUserIdField = 'userId') => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ 
//         error: 'Authentication required.' 
//       });
//     }

//     const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
//     if (resourceUserId && resourceUserId !== req.user._id.toString()) {
//       return res.status(403).json({ 
//         error: 'Access denied. You can only access your own resources.' 
//       });
//     }

//     next();
//   };
// };

// /**
//  * Generate JWT token for user
//  * @param {Object} user - User object
//  * @returns {String} JWT token
//  */
// const generateToken = (user) => {
//   return jwt.sign(
//     { 
//       _id: user._id.toString(),
//       email: user.email 
//     },
//     process.env.JWT_SECRET,
//     { 
//       expiresIn: '7d' 
//     }
//   );
// };

// const protect = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ 
//       error: 'Authentication required.' 
//     });
//   }
//   next();
// };

// export {
//   authenticateToken,
//   optionalAuth,
//   requireRole,
//   requireOwnership,
//   generateToken,
//   protect
// }; 

// authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env located in backend folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

/**
 * Middleware to verify JWT token and authenticate user
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer <token>

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use decoded._id as per your token payload
    const user = await User.findById(decoded._id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated.' });
    }

    req.user = user; // Attach user to request for later use
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error.' });
  }
};

/**
 * Optional auth middleware for routes that can work with or without a logged-in user
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore errors and continue without authentication
    next();
  }
};

/**
 * Middleware to require authentication before accessing route
 */
const protect = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  next();
};

/**
 * Generate JWT token for a user
 * @param {Object} user - User object
 * @returns {String} JWT token string
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

export {
  authenticateToken,
  optionalAuth,
  protect,
  generateToken,
};

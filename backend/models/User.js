import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


/**
 * User Schema - Stores user authentication and profile information
 * Includes skin type, allergies, budget preferences, and analysis history
 */

const userSchema = new mongoose.Schema({
  // Authentication fields
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },

  // Skin profile
  skinType: {
    type: String,
    enum: ['oily', 'dry', 'combination', 'normal', 'sensitive'],
    required: false
  },
  skinConcerns: [{
    type: String,
    enum: ['acne', 'pores', 'pigmentation', 'aging', 'sensitivity', 'dryness'],
    required: false
  }],
  allergies: [{
    type: String,
    trim: true,
    required: false
  }],
  budget: {
    type: String,
    enum: ['low', 'medium', 'high', 'luxury'],
    required: false
  },

  // Analysis history
  analysisCount: {
    type: Number,
    default: 0
  },
  lastAnalysisDate: {
    type: Date
  },

  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ skinType: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema); 
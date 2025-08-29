const mongoose = require('mongoose');

/**
 * Product Schema - Stores skincare product information
 * Includes ingredients, pricing, skin type compatibility, and recommendations
 */

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  concentration: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  benefits: [{
    type: String,
    enum: ['acne-fighting', 'anti-aging', 'brightening', 'hydrating', 'soothing', 'exfoliating']
  }],
  warnings: [{
    type: String,
    enum: ['sensitive-skin', 'pregnancy', 'sun-sensitivity', 'irritation']
  }]
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen', 'treatment', 'mask', 'exfoliant'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  ingredients: [ingredientSchema],
  skinTypeCompatibility: [{
    type: String,
    enum: ['oily', 'dry', 'combination', 'normal', 'sensitive']
  }],
  skinConcernTargets: [{
    type: String,
    enum: ['acne', 'pores', 'pigmentation', 'aging', 'sensitivity', 'dryness']
  }],
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    size: {
      type: String,
      trim: true
    }
  },
  budget: {
    type: String,
    enum: ['low', 'medium', 'high', 'luxury'],
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  imageUrl: {
    type: String,
    trim: true
  },
  purchaseUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  recommendationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
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

// Indexes for faster queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ skinTypeCompatibility: 1 });
productSchema.index({ skinConcernTargets: 1 });
productSchema.index({ budget: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ 'ingredients.name': 1 });
productSchema.index({ recommendationScore: -1 });

// Method to check if product contains specific ingredient
productSchema.methods.containsIngredient = function(ingredientName) {
  return this.ingredients.some(ingredient => 
    ingredient.name.toLowerCase().includes(ingredientName.toLowerCase()) && ingredient.isActive
  );
};

// Method to get active ingredients
productSchema.methods.getActiveIngredients = function() {
  return this.ingredients.filter(ingredient => ingredient.isActive);
};

// Method to check skin type compatibility
productSchema.methods.isCompatibleWithSkinType = function(skinType) {
  return this.skinTypeCompatibility.includes(skinType);
};

// Method to check skin concern targeting
productSchema.methods.targetsSkinConcern = function(concern) {
  return this.skinConcernTargets.includes(concern);
};

// Method to get price per unit (if size is available)
productSchema.methods.getPricePerUnit = function() {
  if (!this.price.size) return null;
  
  // Extract numeric value from size string (e.g., "30ml" -> 30)
  const sizeMatch = this.price.size.match(/(\d+)/);
  if (!sizeMatch) return null;
  
  const size = parseFloat(sizeMatch[1]);
  return this.price.amount / size;
};

// Static method to find products by skin concern and budget
productSchema.statics.findByConcernAndBudget = function(concern, budget) {
  return this.find({
    skinConcernTargets: concern,
    budget: budget,
    isActive: true
  }).sort({ recommendationScore: -1, rating: { average: -1 } });
};

module.exports = mongoose.model('Product', productSchema); 
/**
 * Product Recommender Utility
 * Maps ingredients to recommended products based on user preferences and skin concerns
 * Provides personalized product recommendations with scoring and filtering
 */

const Product = require('../models/Product');

/**
 * Get personalized product recommendations
 * @param {Array} skinConcerns - User's skin concerns
 * @param {String} skinType - User's skin type
 * @param {String} budget - User's budget preference
 * @param {Array} allergies - User's allergies
 * @param {Number} limit - Number of products to return
 * @returns {Object} Recommended products with scores and categories
 */
const getProductRecommendations = async (skinConcerns, skinType, budget, allergies = [], limit = 10) => {
  try {
    const recommendations = {
      products: [],
      categories: {},
      totalFound: 0,
      filters: {
        skinConcerns,
        skinType,
        budget,
        allergies
      }
    };

    // Get products for each skin concern
    for (const concern of skinConcerns) {
      const concernProducts = await getProductsForConcern(concern, skinType, budget, allergies);
      recommendations.products.push(...concernProducts);
    }

    // Remove duplicates and calculate scores
    recommendations.products = deduplicateAndScore(recommendations.products, skinConcerns, skinType, budget);
    
    // Sort by recommendation score
    recommendations.products.sort((a, b) => b.recommendationScore - a.recommendationScore);
    
    // Limit results
    recommendations.products = recommendations.products.slice(0, limit);
    
    // Group by category
    recommendations.categories = groupProductsByCategory(recommendations.products);
    
    recommendations.totalFound = recommendations.products.length;

    return recommendations;

  } catch (error) {
    console.error('Error getting product recommendations:', error);
    throw new Error('Failed to get product recommendations');
  }
};

/**
 * Get products for specific skin concern
 * @param {String} concern - Skin concern
 * @param {String} skinType - Skin type
 * @param {String} budget - Budget preference
 * @param {Array} allergies - User allergies
 * @returns {Array} Array of product objects
 */
const getProductsForConcern = async (concern, skinType, budget, allergies) => {
  const query = {
    skinConcernTargets: concern,
    isActive: true
  };

  // Add skin type filter if specified
  if (skinType && skinType !== 'normal') {
    query.skinTypeCompatibility = skinType;
  }

  // Add budget filter
  if (budget && budget !== 'medium') {
    query.budget = budget;
  }

  const products = await Product.find(query)
    .populate('ingredients')
    .limit(20);

  // Filter out products with allergens
  const filteredProducts = filterAllergenProducts(products, allergies);
  
  return filteredProducts;
};

/**
 * Filter out products containing allergens
 * @param {Array} products - Array of products
 * @param {Array} allergies - User's allergies
 * @returns {Array} Filtered products
 */
const filterAllergenProducts = (products, allergies) => {
  if (!allergies || allergies.length === 0) {
    return products;
  }

  return products.filter(product => {
    const productIngredients = product.ingredients.map(ing => ing.name.toLowerCase());
    return !allergies.some(allergy => 
      productIngredients.some(ingredient => 
        ingredient.includes(allergy.toLowerCase())
      )
    );
  });
};

/**
 * Remove duplicates and calculate recommendation scores
 * @param {Array} products - Array of products
 * @param {Array} skinConcerns - User's skin concerns
 * @param {String} skinType - User's skin type
 * @param {String} budget - User's budget
 * @returns {Array} Deduplicated and scored products
 */
const deduplicateAndScore = (products, skinConcerns, skinType, budget) => {
  const uniqueProducts = new Map();

  products.forEach(product => {
    const productId = product._id.toString();
    
    if (!uniqueProducts.has(productId)) {
      // Calculate recommendation score
      const score = calculateRecommendationScore(product, skinConcerns, skinType, budget);
      product.recommendationScore = score;
      
      uniqueProducts.set(productId, product);
    } else {
      // If product already exists, update score if this match is better
      const existingProduct = uniqueProducts.get(productId);
      const newScore = calculateRecommendationScore(product, skinConcerns, skinType, budget);
      
      if (newScore > existingProduct.recommendationScore) {
        existingProduct.recommendationScore = newScore;
      }
    }
  });

  return Array.from(uniqueProducts.values());
};

/**
 * Calculate recommendation score for a product
 * @param {Object} product - Product object
 * @param {Array} skinConcerns - User's skin concerns
 * @param {String} skinType - User's skin type
 * @param {String} budget - User's budget
 * @returns {Number} Recommendation score (0-100)
 */
const calculateRecommendationScore = (product, skinConcerns, skinType, budget) => {
  let score = 0;

  // Base score from product's existing recommendation score
  score += product.recommendationScore * 0.3;

  // Rating score (0-25 points)
  score += (product.rating.average / 5) * 25;

  // Skin concern match score (0-25 points)
  const concernMatches = skinConcerns.filter(concern => 
    product.skinConcernTargets.includes(concern)
  );
  score += (concernMatches.length / skinConcerns.length) * 25;

  // Skin type compatibility score (0-15 points)
  if (product.skinTypeCompatibility.includes(skinType)) {
    score += 15;
  }

  // Budget match score (0-10 points)
  if (product.budget === budget) {
    score += 10;
  } else if (getBudgetDifference(product.budget, budget) === 1) {
    score += 5;
  }

  // Price efficiency score (0-10 points)
  score += calculatePriceEfficiencyScore(product);

  // Popularity bonus (0-5 points)
  if (product.rating.count > 100) {
    score += 5;
  } else if (product.rating.count > 50) {
    score += 3;
  } else if (product.rating.count > 10) {
    score += 1;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Calculate budget difference between product and user preference
 * @param {String} productBudget - Product budget
 * @param {String} userBudget - User budget
 * @returns {Number} Budget difference (0 = same, 1 = adjacent, 2 = far)
 */
const getBudgetDifference = (productBudget, userBudget) => {
  const budgetOrder = ['low', 'medium', 'high', 'luxury'];
  const productIndex = budgetOrder.indexOf(productBudget);
  const userIndex = budgetOrder.indexOf(userBudget);
  
  return Math.abs(productIndex - userIndex);
};

/**
 * Calculate price efficiency score
 * @param {Object} product - Product object
 * @returns {Number} Price efficiency score (0-10)
 */
const calculatePriceEfficiencyScore = (product) => {
  const pricePerUnit = product.getPricePerUnit();
  if (!pricePerUnit) return 5; // Neutral score if price per unit not available

  // Define price ranges for different budgets
  const priceRanges = {
    low: { min: 0, max: 0.5 },
    medium: { min: 0.3, max: 1.5 },
    high: { min: 1.0, max: 3.0 },
    luxury: { min: 2.0, max: 10.0 }
  };

  const range = priceRanges[product.budget];
  if (!range) return 5;

  // Score based on how well the price fits the budget range
  if (pricePerUnit >= range.min && pricePerUnit <= range.max) {
    return 10; // Perfect fit
  } else if (pricePerUnit < range.min) {
    return 8; // Good value
  } else {
    return 3; // Expensive for category
  }
};

/**
 * Group products by category
 * @param {Array} products - Array of products
 * @returns {Object} Products grouped by category
 */
const groupProductsByCategory = (products) => {
  const categories = {};

  products.forEach(product => {
    const category = product.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(product);
  });

  return categories;
};

/**
 * Get products by category
 * @param {String} category - Product category
 * @param {String} skinType - User's skin type
 * @param {String} budget - User's budget
 * @param {Number} limit - Number of products to return
 * @returns {Array} Products in the specified category
 */
const getProductsByCategory = async (category, skinType, budget, limit = 10) => {
  const query = {
    category,
    isActive: true
  };

  if (skinType && skinType !== 'normal') {
    query.skinTypeCompatibility = skinType;
  }

  if (budget && budget !== 'medium') {
    query.budget = budget;
  }

  const products = await Product.find(query)
    .sort({ recommendationScore: -1, rating: { average: -1 } })
    .limit(limit);

  return products;
};

/**
 * Search products by name or brand
 * @param {String} searchTerm - Search term
 * @param {String} skinType - User's skin type
 * @param {String} budget - User's budget
 * @param {Number} limit - Number of products to return
 * @returns {Array} Matching products
 */
const searchProducts = async (searchTerm, skinType, budget, limit = 10) => {
  const query = {
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { brand: { $regex: searchTerm, $options: 'i' } }
    ],
    isActive: true
  };

  if (skinType && skinType !== 'normal') {
    query.skinTypeCompatibility = skinType;
  }

  if (budget && budget !== 'medium') {
    query.budget = budget;
  }

  const products = await Product.find(query)
    .sort({ recommendationScore: -1, rating: { average: -1 } })
    .limit(limit);

  return products;
};

/**
 * Get trending products (most recommended)
 * @param {Number} limit - Number of products to return
 * @returns {Array} Trending products
 */
const getTrendingProducts = async (limit = 10) => {
  const products = await Product.find({ isActive: true })
    .sort({ recommendationScore: -1, rating: { average: -1 } })
    .limit(limit);

  return products;
};

/**
 * Get budget-friendly alternatives
 * @param {String} productId - Original product ID
 * @param {String} targetBudget - Target budget
 * @param {Number} limit - Number of alternatives to return
 * @returns {Array} Budget-friendly alternatives
 */
const getBudgetAlternatives = async (productId, targetBudget, limit = 5) => {
  const originalProduct = await Product.findById(productId);
  if (!originalProduct) {
    throw new Error('Original product not found');
  }

  const query = {
    category: originalProduct.category,
    budget: targetBudget,
    isActive: true,
    _id: { $ne: productId }
  };

  const alternatives = await Product.find(query)
    .sort({ recommendationScore: -1, rating: { average: -1 } })
    .limit(limit);

  return alternatives;
};

module.exports = {
  getProductRecommendations,
  getProductsByCategory,
  searchProducts,
  getTrendingProducts,
  getBudgetAlternatives,
  calculateRecommendationScore
}; 
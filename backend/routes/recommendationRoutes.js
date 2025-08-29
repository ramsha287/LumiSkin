/**
 * Recommendation Routes
 * API endpoints for product and ingredient recommendations
 */

const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getPersonalizedRecommendations, getRecommendationsByAnalysis, getIngredientRecommendations, handleGetProductRecommendations , checkCompatibility } = require('../controllers/recommendationController');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * @route   POST /api/recommendations/personalized
 * @desc    Get personalized product recommendations based on user profile
 * @access  Private
 */
router.post('/personalized', getPersonalizedRecommendations);

/**
 * @route   GET /api/recommendations/analysis/:analysisId
 * @desc    Get recommendations based on specific analysis results
 * @access  Private
 */
router.get('/analysis/:analysisId', getRecommendationsByAnalysis);

/**
 * @route   GET /api/recommendations/ingredients
 * @desc    Get ingredient recommendations for skin concerns
 * @access  Private
 */
router.get('/ingredients', getIngredientRecommendations);

/**
 * @route   GET /api/recommendations/products
 * @desc    Get product recommendations filtered by criteria
 * @access  Private
 */
router.get('/products', handleGetProductRecommendations );

/**
 * @route   POST /api/recommendations/compatibility
 * @desc    Check ingredient compatibility
 * @access  Private
 */
router.post('/compatibility', checkCompatibility);

/**
 * @route   GET /api/recommendations/profile/:profileId
 * @desc    Get recommendations for existing user profile
 * @access  Private
 */
router.get('/profile/:profileId', async (req, res) => {
    try {
        const { profileId } = req.params;
        const { max_products = 5 } = req.query;
        
        // Call ML service for recommendations
        const response = await fetch(`${process.env.ML_SERVICE_URL}/recommendations/${profileId}?max_products=${max_products}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`ML service error: ${response.status}`);
        }
        
        const recommendations = await response.json();
        
        res.json({
            success: true,
            data: recommendations
        });
        
    } catch (error) {
        console.error('Error getting recommendations by profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get recommendations',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/recommendations/products/:productId
 * @desc    Get detailed product information
 * @access  Private
 */
router.get('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Call ML service for product details
        const response = await fetch(`${process.env.ML_SERVICE_URL}/products/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`ML service error: ${response.status}`);
        }
        
        const product = await response.json();
        
        res.json({
            success: true,
            data: product
        });
        
    } catch (error) {
        console.error('Error getting product details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get product details',
            error: error.message
        });
    }
});

module.exports = router; 
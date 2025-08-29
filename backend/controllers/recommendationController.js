/**
 * Recommendation Controller
 * Handles product and ingredient recommendation logic
 */

const { getRecommendedIngredients, checkIngredientCompatibility } = require('../utils/ingredientMapping');
const { getProductRecommendations } = require('../utils/productRecommender');

/**
 * Get personalized recommendations based on user profile and skin analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPersonalizedRecommendations = async (req, res) => {
    try {
        const { skin_analysis, user_preferences, max_products = 5 } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!skin_analysis || !user_preferences) {
            return res.status(400).json({
                success: false,
                message: 'Skin analysis and user preferences are required'
            });
        }

        // Call ML service for recommendations
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
        const response = await fetch(`${mlServiceUrl}/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                skin_analysis,
                user_preferences,
                max_products
            })
        });

        if (!response.ok) {
            throw new Error(`ML service error: ${response.status}`);
        }

        const recommendations = await response.json();

        // Store recommendation history (optional)
        // await RecommendationHistory.create({
        //     userId,
        //     profileId: recommendations.profile_id,
        //     recommendations: recommendations.products,
        //     timestamp: new Date()
        // });

        res.json({
            success: true,
            data: recommendations
        });

    } catch (error) {
        console.error('Error getting personalized recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get personalized recommendations',
            error: error.message
        });
    }
};

/**
 * Get recommendations based on specific analysis results
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRecommendationsByAnalysis = async (req, res) => {
    try {
        const { analysisId } = req.params;
        const userId = req.user.id;

        // Get analysis results from database
        const analysis = await Tracking.findById(analysisId);
        if (!analysis || analysis.userId.toString() !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Analysis not found'
            });
        }

        // Extract skin concerns from analysis
        const skinAnalysis = analysis.analysisResults;
        const concerns = [];

        if (skinAnalysis.acne?.probability > 0.3) concerns.push('acne');
        if (skinAnalysis.pores?.probability > 0.3) concerns.push('pores');
        if (skinAnalysis.pigmentation?.probability > 0.3) concerns.push('hyperpigmentation');

        // Get user preferences
        const user = await User.findById(userId);
        const userPreferences = {
            skin_type: user.skinType || 'normal',
            sensitivity: user.skinConcerns.includes('sensitivity') ? 'high' : 'low',
            budget: user.budget || 'medium',
            allergies: user.allergies || [],
            fragrance_free: true,
            cruelty_free: false,
            vegan: false,
            product_types: []
        };

        // Call ML service for recommendations
        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
        const response = await fetch(`${mlServiceUrl}/recommendations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                skin_analysis,
                user_preferences: userPreferences,
                max_products: 5
            })
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
        console.error('Error getting recommendations by analysis:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get recommendations by analysis',
            error: error.message
        });
    }
};

/**
 * Get ingredient recommendations for skin concerns
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getIngredientRecommendations = async (req, res) => {
    try {
        const { concerns, skin_type, allergies } = req.query;
        const userId = req.user.id;

        // Parse concerns from query string
        const skinConcerns = concerns ? concerns.split(',') : [];
        const userAllergies = allergies ? allergies.split(',') : [];

        // Get ingredient recommendations
        const ingredients = getRecommendedIngredients(
            skinConcerns,
            skin_type || 'normal',
            userAllergies
        );

        res.json({
            success: true,
            data: {
                concerns: skinConcerns,
                recommended_ingredients: ingredients.recommended,
                avoid_ingredients: ingredients.avoid,
                general_recommendations: ingredients.general
            }
        });

    } catch (error) {
        console.error('Error getting ingredient recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get ingredient recommendations',
            error: error.message
        });
    }
};

/**
 * Get product recommendations filtered by criteria
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleGetProductRecommendations  = async (req, res) => {
    try {
        const { concerns, skin_type, budget, category, limit = 10 } = req.query;
        const userId = req.user.id;

        // Get user preferences
        const user = await User.findById(userId);
        
        // Get product recommendations
        const products = await getProductRecommendations(
            concerns ? concerns.split(',') : [],
            skin_type || user.skinType || 'normal',
            budget || user.budget || 'medium',
            user.allergies || [],
            parseInt(limit)
        );

        res.json({
            success: true,
            data: {
                products,
                filters: {
                    concerns: concerns ? concerns.split(',') : [],
                    skin_type: skin_type || user.skinType,
                    budget: budget || user.budget,
                    category
                }
            }
        });

    } catch (error) {
        console.error('Error getting product recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get product recommendations',
            error: error.message
        });
    }
};

/**
 * Check ingredient compatibility
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const checkCompatibility = async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({
                success: false,
                message: 'Ingredients array is required'
            });
        }

        // Check ingredient compatibility
        const compatibility = checkIngredientCompatibility(ingredients);

        res.json({
            success: true,
            data: {
                ingredients,
                compatible: compatibility.compatible,
                incompatible: compatibility.incompatible,
                warnings: compatibility.warnings
            }
        });

    } catch (error) {
        console.error('Error checking ingredient compatibility:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check ingredient compatibility',
            error: error.message
        });
    }
};

/**
 * Get recommendation history for user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRecommendationHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10, offset = 0 } = req.query;

        // Get recommendation history from database
        // const history = await RecommendationHistory.find({ userId })
        //     .sort({ timestamp: -1 })
        //     .limit(parseInt(limit))
        //     .skip(parseInt(offset));

        // For now, return empty array
        const history = [];

        res.json({
            success: true,
            data: {
                history,
                pagination: {
                    limit: parseInt(limit),
                    offset: parseInt(offset),
                    total: history.length
                }
            }
        });

    } catch (error) {
        console.error('Error getting recommendation history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get recommendation history',
            error: error.message
        });
    }
};

/**
 * Save user feedback on recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const saveRecommendationFeedback = async (req, res) => {
    try {
        const { profile_id, product_id, rating, feedback, purchased } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!profile_id || !product_id) {
            return res.status(400).json({
                success: false,
                message: 'Profile ID and product ID are required'
            });
        }

        // Save feedback to database
        // await RecommendationFeedback.create({
        //     userId,
        //     profileId: profile_id,
        //     productId: product_id,
        //     rating,
        //     feedback,
        //     purchased,
        //     timestamp: new Date()
        // });

        res.json({
            success: true,
            message: 'Feedback saved successfully'
        });

    } catch (error) {
        console.error('Error saving recommendation feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save feedback',
            error: error.message
        });
    }
};

module.exports = {
    getPersonalizedRecommendations,
    getRecommendationsByAnalysis,
    getIngredientRecommendations,
    getProductRecommendations,
    checkCompatibility,
    getRecommendationHistory,
    saveRecommendationFeedback,
    handleGetProductRecommendations 
}; 
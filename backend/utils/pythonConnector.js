/**
 * Python Connector Utility
 * Connects Node.js backend to FastAPI ML service for image analysis
 * Handles image upload, prediction requests, and result processing
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

/**
 * Configuration for ML service connection
 */
const ML_SERVICE_CONFIG = {
  baseURL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds timeout
  retries: 3,
  retryDelay: 1000 // 1 second
};

/**
 * Send image to ML service for analysis
 * @param {String} imagePath - Path to the uploaded image
 * @param {Object} options - Additional options for analysis
 * @returns {Object} Analysis results from ML service
 */
const analyzeImage = async (imagePath, options = {}) => {
  try {
    // Validate image file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error('Image file not found');
    }

    // Create form data for image upload
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    // Add any additional options as form fields
    if (options.analysisType) {
      formData.append('analysis_type', options.analysisType);
    }
    if (options.confidenceThreshold) {
      formData.append('confidence_threshold', options.confidenceThreshold);
    }

    // Make request to FastAPI ML service
    const response = await makeMLRequest('/predict', formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });

    // Validate and process response
    const results = validateMLResponse(response.data);
    
    return {
      success: true,
      results,
      timestamp: new Date().toISOString(),
      imagePath
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      imagePath
    };
  }
};

/**
 * Make request to ML service with retry logic
 * @param {String} endpoint - ML service endpoint
 * @param {Object} data - Request data
 * @param {Object} config - Request configuration
 * @returns {Object} Axios response
 */
const makeMLRequest = async (endpoint, data, config = {}) => {
  let lastError;

  for (let attempt = 1; attempt <= ML_SERVICE_CONFIG.retries; attempt++) {
    try {
      const response = await axios({
        method: 'POST',
        url: `${ML_SERVICE_CONFIG.baseURL}${endpoint}`,
        data,
        timeout: ML_SERVICE_CONFIG.timeout,
        ...config
      });

      return response;

    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      // Log retry attempt
      console.warn(`ML service request failed (attempt ${attempt}/${ML_SERVICE_CONFIG.retries}):`, error.message);

      // Wait before retry (except on last attempt)
      if (attempt < ML_SERVICE_CONFIG.retries) {
        await new Promise(resolve => setTimeout(resolve, ML_SERVICE_CONFIG.retryDelay * attempt));
      }
    }
  }

  // All retries failed
  throw new Error(`ML service request failed after ${ML_SERVICE_CONFIG.retries} attempts: ${lastError.message}`);
};

/**
 * Validate ML service response
 * @param {Object} response - Response from ML service
 * @returns {Object} Validated and processed results
 */
const validateMLResponse = (response) => {
  // Check if response has required structure
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format from ML service');
  }

  // FastAPI response structure
  const results = response.results || response;

  // Validate required fields
  const requiredFields = ['acne', 'pores', 'pigmentation', 'skin_tone'];
  const missingFields = requiredFields.filter(field => !results[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields in ML response: ${missingFields.join(', ')}`);
  }

  // Validate and normalize each concern
  const validatedResults = {
    acne: validateConcernResult(results.acne, 'acne'),
    pores: validateConcernResult(results.pores, 'pores'),
    pigmentation: validateConcernResult(results.pigmentation, 'pigmentation'),
    skinTone: validateSkinToneResult(results.skin_tone)
  };

  // Calculate overall score if not provided
  if (!results.overall_score) {
    validatedResults.overallScore = calculateOverallScore(validatedResults);
  } else {
    validatedResults.overallScore = Math.max(0, Math.min(100, results.overall_score));
  }

  return validatedResults;
};

/**
 * Validate individual concern result
 * @param {Object} result - Concern result from ML service
 * @param {String} concernType - Type of concern
 * @returns {Object} Validated concern result
 */
const validateConcernResult = (result, concernType) => {
  if (!result || typeof result !== 'object') {
    throw new Error(`Invalid ${concernType} result format`);
  }

  // Validate probability
  if (typeof result.probability !== 'number' || result.probability < 0 || result.probability > 1) {
    throw new Error(`Invalid ${concernType} probability value`);
  }

  // Validate severity if provided
  if (result.severity && !['mild', 'moderate', 'severe'].includes(result.severity)) {
    throw new Error(`Invalid ${concernType} severity value`);
  }

  return {
    probability: Math.round(result.probability * 100) / 100,
    severity: result.severity || 'mild', // Default to mild if not provided
    confidence: result.confidence || 0.8, // Default confidence
    ...result // Include any additional fields
  };
};

/**
 * Validate skin tone result
 * @param {Object} result - Skin tone result from ML service
 * @returns {Object} Validated skin tone result
 */
const validateSkinToneResult = (result) => {
  if (!result || typeof result !== 'object') {
    throw new Error('Invalid skin tone result format');
  }

  const validTones = ['very-fair', 'fair', 'medium', 'olive', 'dark', 'very-dark'];
  
  if (!result.classification || !validTones.includes(result.classification)) {
    throw new Error('Invalid skin tone classification');
  }

  if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
    throw new Error('Invalid skin tone confidence value');
  }

  return {
    classification: result.classification,
    confidence: Math.round(result.confidence * 100) / 100
  };
};

/**
 * Calculate overall skin health score
 * @param {Object} results - Individual concern results
 * @returns {Number} Overall score (0-100)
 */
const calculateOverallScore = (results) => {
  const weights = {
    acne: 0.35,      // Higher weight for acne
    pores: 0.25,     // Medium weight for pores
    pigmentation: 0.30, // Medium weight for pigmentation
    skinTone: 0.10   // Lower weight for skin tone
  };

  let totalScore = 0;
  let totalWeight = 0;

  // Calculate weighted score based on severity
  Object.entries(weights).forEach(([concern, weight]) => {
    if (results[concern]) {
      const severityScore = getSeverityScore(results[concern].severity);
      totalScore += severityScore * weight;
      totalWeight += weight;
    }
  });

  // Normalize to 0-100 scale
  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 50;
};

/**
 * Get numeric score for severity level
 * @param {String} severity - Severity level
 * @returns {Number} Numeric score (0-1)
 */
const getSeverityScore = (severity) => {
  const scores = {
    'mild': 0.8,      // Good skin health
    'moderate': 0.5,  // Moderate concerns
    'severe': 0.2     // Significant concerns
  };

  return scores[severity] || 0.5;
};

/**
 * Check ML service health
 * @returns {Object} Health status
 */
const checkMLServiceHealth = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_CONFIG.baseURL}/health`, {
      timeout: 5000
    });

    return {
      status: 'healthy',
      response: response.data,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get ML service configuration
 * @returns {Object} Current configuration
 */
const getMLServiceConfig = () => {
  return {
    ...ML_SERVICE_CONFIG,
    baseURL: ML_SERVICE_CONFIG.baseURL
  };
};

/**
 * Update ML service configuration
 * @param {Object} newConfig - New configuration
 */
const updateMLServiceConfig = (newConfig) => {
  Object.assign(ML_SERVICE_CONFIG, newConfig);
};

/**
 * Batch analyze multiple images
 * @param {Array} imagePaths - Array of image paths
 * @param {Object} options - Analysis options
 * @returns {Array} Array of analysis results
 */
const batchAnalyzeImages = async (imagePaths, options = {}) => {
  const results = [];
  const batchSize = options.batchSize || 5;
  
  // Process images in batches
  for (let i = 0; i < imagePaths.length; i += batchSize) {
    const batch = imagePaths.slice(i, i + batchSize);
    const batchPromises = batch.map(imagePath => analyzeImage(imagePath, options));
    
    const batchResults = await Promise.allSettled(batchPromises);
    results.push(...batchResults.map(result => 
      result.status === 'fulfilled' ? result.value : { success: false, error: result.reason.message }
    ));
  }

  return results;
};

module.exports = {
  analyzeImage,
  checkMLServiceHealth,
  getMLServiceConfig,
  updateMLServiceConfig,
  batchAnalyzeImages,
  validateMLResponse
}; 
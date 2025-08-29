/**
 * Severity Mapping Utility
 * Converts CNN model probabilities to severity levels (mild/moderate/severe)
 * Provides consistent severity classification across different skin concerns
 */

/**
 * Maps probability scores to severity levels
 * @param {Number} probability - Probability score from 0 to 1
 * @param {String} concernType - Type of skin concern (acne, pores, pigmentation)
 * @returns {Object} Severity classification with level and confidence
 */
const mapProbabilityToSeverity = (probability, concernType = 'general') => {
  // Validate input
  if (typeof probability !== 'number' || probability < 0 || probability > 1) {
    throw new Error('Probability must be a number between 0 and 1');
  }

  // Define severity thresholds based on concern type
  const thresholds = getSeverityThresholds(concernType);
  
  let severity, confidence;

  if (probability <= thresholds.mild) {
    severity = 'mild';
    confidence = calculateConfidence(probability, 0, thresholds.mild);
  } else if (probability <= thresholds.moderate) {
    severity = 'moderate';
    confidence = calculateConfidence(probability, thresholds.mild, thresholds.moderate);
  } else {
    severity = 'severe';
    confidence = calculateConfidence(probability, thresholds.moderate, 1);
  }

  return {
    severity,
    confidence: Math.round(confidence * 100) / 100,
    probability: Math.round(probability * 100) / 100
  };
};

/**
 * Get severity thresholds for different skin concerns
 * @param {String} concernType - Type of skin concern
 * @returns {Object} Thresholds for mild, moderate, and severe
 */
const getSeverityThresholds = (concernType) => {
  const thresholds = {
    acne: {
      mild: 0.3,
      moderate: 0.7
    },
    pores: {
      mild: 0.25,
      moderate: 0.65
    },
    pigmentation: {
      mild: 0.35,
      moderate: 0.75
    },
    general: {
      mild: 0.3,
      moderate: 0.7
    }
  };

  return thresholds[concernType] || thresholds.general;
};

/**
 * Calculate confidence score within a severity range
 * @param {Number} probability - Current probability
 * @param {Number} min - Minimum value for the range
 * @param {Number} max - Maximum value for the range
 * @returns {Number} Confidence score between 0 and 1
 */
const calculateConfidence = (probability, min, max) => {
  const range = max - min;
  const position = (probability - min) / range;
  
  // Higher confidence when closer to the center of the range
  const centerDistance = Math.abs(position - 0.5);
  return Math.max(0.5, 1 - centerDistance);
};

/**
 * Map multiple skin concerns to overall severity
 * @param {Object} concerns - Object with concern probabilities
 * @returns {Object} Overall severity assessment
 */
const mapOverallSeverity = (concerns) => {
  const severityScores = {
    mild: 0,
    moderate: 0,
    severe: 0
  };

  let totalWeight = 0;

  // Process each concern
  Object.entries(concerns).forEach(([concern, probability]) => {
    if (typeof probability === 'number' && probability >= 0 && probability <= 1) {
      const severity = mapProbabilityToSeverity(probability, concern);
      
      // Weight based on concern importance
      const weight = getConcernWeight(concern);
      severityScores[severity.severity] += weight;
      totalWeight += weight;
    }
  });

  // Calculate weighted average
  if (totalWeight === 0) {
    return {
      severity: 'mild',
      confidence: 0,
      overallScore: 0
    };
  }

  // Determine overall severity
  let overallSeverity = 'mild';
  if (severityScores.severe / totalWeight > 0.4) {
    overallSeverity = 'severe';
  } else if (severityScores.moderate / totalWeight > 0.3) {
    overallSeverity = 'moderate';
  }

  // Calculate overall score (0-100)
  const overallScore = Math.round(
    (severityScores.mild * 25 + severityScores.moderate * 60 + severityScores.severe * 90) / totalWeight
  );

  return {
    severity: overallSeverity,
    confidence: Math.round((severityScores[overallSeverity] / totalWeight) * 100) / 100,
    overallScore: Math.max(0, Math.min(100, overallScore)),
    breakdown: severityScores
  };
};

/**
 * Get weight for different skin concerns
 * @param {String} concern - Skin concern type
 * @returns {Number} Weight value
 */
const getConcernWeight = (concern) => {
  const weights = {
    acne: 1.2,      // Higher weight for acne
    pores: 0.8,     // Lower weight for pores
    pigmentation: 1.0, // Standard weight
    skinTone: 0.5   // Lower weight for skin tone
  };

  return weights[concern] || 1.0;
};

/**
 * Get severity description and recommendations
 * @param {String} severity - Severity level
 * @param {String} concern - Skin concern type
 * @returns {Object} Description and recommendations
 */
const getSeverityInfo = (severity, concern = 'general') => {
  const info = {
    mild: {
      description: 'Minor skin concern that can be managed with basic care',
      urgency: 'low',
      recommendations: ['Gentle cleansing', 'Basic moisturizing', 'Sun protection']
    },
    moderate: {
      description: 'Noticeable skin concern requiring targeted treatment',
      urgency: 'medium',
      recommendations: ['Targeted treatments', 'Regular monitoring', 'Professional consultation']
    },
    severe: {
      description: 'Significant skin concern requiring immediate attention',
      urgency: 'high',
      recommendations: ['Professional consultation', 'Medical treatment', 'Regular monitoring']
    }
  };

  const baseInfo = info[severity] || info.mild;
  
  // Add concern-specific recommendations
  const specificRecommendations = getConcernSpecificRecommendations(concern, severity);
  
  return {
    ...baseInfo,
    recommendations: [...baseInfo.recommendations, ...specificRecommendations]
  };
};

/**
 * Get concern-specific recommendations
 * @param {String} concern - Skin concern type
 * @param {String} severity - Severity level
 * @returns {Array} Specific recommendations
 */
const getConcernSpecificRecommendations = (concern, severity) => {
  const recommendations = {
    acne: {
      mild: ['Salicylic acid cleanser', 'Non-comedogenic products'],
      moderate: ['Benzoyl peroxide treatment', 'Avoid touching face'],
      severe: ['Prescription medications', 'Dermatologist consultation']
    },
    pores: {
      mild: ['Gentle exfoliation', 'Oil-free products'],
      moderate: ['Chemical exfoliants', 'Clay masks'],
      severe: ['Professional treatments', 'Regular deep cleaning']
    },
    pigmentation: {
      mild: ['Vitamin C serum', 'Consistent sun protection'],
      moderate: ['Retinoids', 'Professional treatments'],
      severe: ['Medical-grade treatments', 'Dermatologist consultation']
    }
  };

  return recommendations[concern]?.[severity] || [];
};

/**
 * Validate severity mapping results
 * @param {Object} result - Severity mapping result
 * @returns {Boolean} Whether the result is valid
 */
const validateSeverityResult = (result) => {
  const validSeverities = ['mild', 'moderate', 'severe'];
  
  return (
    result &&
    typeof result === 'object' &&
    validSeverities.includes(result.severity) &&
    typeof result.confidence === 'number' &&
    result.confidence >= 0 &&
    result.confidence <= 1
  );
};

module.exports = {
  mapProbabilityToSeverity,
  mapOverallSeverity,
  getSeverityInfo,
  validateSeverityResult,
  getSeverityThresholds,
  calculateConfidence
}; 
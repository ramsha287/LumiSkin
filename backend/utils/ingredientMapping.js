/**
 * Ingredient Mapping Utility
 * Maps skin concerns to recommended ingredients and their benefits
 * Provides ingredient information, warnings, and usage guidelines
 */

/**
 * Get recommended ingredients for specific skin concerns
 * @param {Array} skinConcerns - Array of skin concerns
 * @param {String} skinType - User's skin type
 * @param {Array} allergies - User's allergies
 * @returns {Object} Recommended ingredients with details
 */
const getRecommendedIngredients = (skinConcerns, skinType = 'normal', allergies = []) => {
  const recommendations = {
    ingredients: [],
    warnings: [],
    categories: {}
  };

  // Process each skin concern
  skinConcerns.forEach(concern => {
    const concernIngredients = getIngredientsForConcern(concern, skinType);
    recommendations.ingredients.push(...concernIngredients);
  });

  // Filter out allergens and add warnings
  recommendations.ingredients = filterAllergens(recommendations.ingredients, allergies);
  
  // Group by category
  recommendations.categories = groupIngredientsByCategory(recommendations.ingredients);
  
  // Add general recommendations
  recommendations.general = getGeneralRecommendations(skinType, skinConcerns);

  return recommendations;
};

/**
 * Get ingredients for specific skin concern
 * @param {String} concern - Skin concern
 * @param {String} skinType - Skin type
 * @returns {Array} Array of ingredient objects
 */
const getIngredientsForConcern = (concern, skinType) => {
  const ingredientDatabase = {
    acne: [
      {
        name: 'Salicylic Acid',
        category: 'exfoliant',
        concentration: '0.5-2%',
        benefits: ['unclogs pores', 'reduces inflammation', 'exfoliates dead skin'],
        warnings: ['can be drying', 'avoid with sensitive skin'],
        skinTypeCompatibility: ['oily', 'combination', 'normal'],
        frequency: 'daily',
        timeOfDay: 'evening'
      },
      {
        name: 'Benzoyl Peroxide',
        category: 'antibacterial',
        concentration: '2.5-5%',
        benefits: ['kills acne bacteria', 'reduces inflammation', 'prevents breakouts'],
        warnings: ['can bleach fabrics', 'may cause irritation'],
        skinTypeCompatibility: ['oily', 'combination'],
        frequency: 'daily',
        timeOfDay: 'evening'
      },
      {
        name: 'Niacinamide',
        category: 'vitamin',
        concentration: '2-5%',
        benefits: ['reduces oil production', 'minimizes pores', 'anti-inflammatory'],
        warnings: ['may cause flushing in high doses'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      }
    ],
    pores: [
      {
        name: 'Retinoids',
        category: 'vitamin',
        concentration: '0.01-1%',
        benefits: ['increases cell turnover', 'unclogs pores', 'improves texture'],
        warnings: ['causes sun sensitivity', 'may cause irritation'],
        skinTypeCompatibility: ['all'],
        frequency: 'start 2-3x/week',
        timeOfDay: 'evening'
      },
      {
        name: 'Clay',
        category: 'absorbent',
        concentration: 'varies',
        benefits: ['absorbs excess oil', 'deep cleanses', 'tightens pores'],
        warnings: ['can be drying', 'avoid with dry skin'],
        skinTypeCompatibility: ['oily', 'combination'],
        frequency: '1-2x/week',
        timeOfDay: 'evening'
      },
      {
        name: 'Alpha Hydroxy Acids (AHA)',
        category: 'exfoliant',
        concentration: '5-10%',
        benefits: ['exfoliates surface', 'improves texture', 'reduces pore appearance'],
        warnings: ['causes sun sensitivity', 'may cause irritation'],
        skinTypeCompatibility: ['all'],
        frequency: '2-3x/week',
        timeOfDay: 'evening'
      }
    ],
    pigmentation: [
      {
        name: 'Vitamin C',
        category: 'antioxidant',
        concentration: '10-20%',
        benefits: ['brightens skin', 'fades dark spots', 'protects from free radicals'],
        warnings: ['unstable in light', 'may cause irritation'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'morning'
      },
      {
        name: 'Hydroquinone',
        category: 'depigmenting',
        concentration: '2-4%',
        benefits: ['fades dark spots', 'inhibits melanin production'],
        warnings: ['prescription required', 'may cause irritation'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'evening'
      },
      {
        name: 'Kojic Acid',
        category: 'depigmenting',
        concentration: '1-2%',
        benefits: ['fades dark spots', 'antioxidant properties'],
        warnings: ['may cause irritation'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'evening'
      }
    ],
    aging: [
      {
        name: 'Retinoids',
        category: 'vitamin',
        concentration: '0.01-1%',
        benefits: ['increases collagen', 'reduces fine lines', 'improves texture'],
        warnings: ['causes sun sensitivity', 'may cause irritation'],
        skinTypeCompatibility: ['all'],
        frequency: 'start 2-3x/week',
        timeOfDay: 'evening'
      },
      {
        name: 'Peptides',
        category: 'protein',
        concentration: 'varies',
        benefits: ['stimulates collagen', 'reduces fine lines', 'improves elasticity'],
        warnings: ['minimal'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      },
      {
        name: 'Hyaluronic Acid',
        category: 'humectant',
        concentration: '0.5-2%',
        benefits: ['hydrates skin', 'plumps fine lines', 'improves texture'],
        warnings: ['minimal'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      }
    ],
    sensitivity: [
      {
        name: 'Ceramides',
        category: 'lipid',
        concentration: 'varies',
        benefits: ['strengthens barrier', 'reduces irritation', 'locks in moisture'],
        warnings: ['minimal'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      },
      {
        name: 'Centella Asiatica',
        category: 'herbal',
        concentration: 'varies',
        benefits: ['soothes irritation', 'promotes healing', 'anti-inflammatory'],
        warnings: ['minimal'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      },
      {
        name: 'Aloe Vera',
        category: 'herbal',
        concentration: 'varies',
        benefits: ['soothes irritation', 'hydrates', 'anti-inflammatory'],
        warnings: ['minimal'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      }
    ],
    dryness: [
      {
        name: 'Hyaluronic Acid',
        category: 'humectant',
        concentration: '0.5-2%',
        benefits: ['attracts moisture', 'hydrates skin', 'plumps fine lines'],
        warnings: ['minimal'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      },
      {
        name: 'Glycerin',
        category: 'humectant',
        concentration: '5-15%',
        benefits: ['attracts moisture', 'hydrates skin', 'improves texture'],
        warnings: ['minimal'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      },
      {
        name: 'Squalane',
        category: 'emollient',
        concentration: 'varies',
        benefits: ['locks in moisture', 'improves texture', 'non-comedogenic'],
        warnings: ['minimal'],
        skinTypeCompatibility: ['all'],
        frequency: 'daily',
        timeOfDay: 'both'
      }
    ]
  };

  return ingredientDatabase[concern] || [];
};

/**
 * Filter out ingredients that user is allergic to
 * @param {Array} ingredients - Array of ingredients
 * @param {Array} allergies - User's allergies
 * @returns {Array} Filtered ingredients
 */
const filterAllergens = (ingredients, allergies) => {
  if (!allergies || allergies.length === 0) {
    return ingredients;
  }

  return ingredients.filter(ingredient => {
    const ingredientName = ingredient.name.toLowerCase();
    return !allergies.some(allergy => 
      ingredientName.includes(allergy.toLowerCase())
    );
  });
};

/**
 * Group ingredients by category
 * @param {Array} ingredients - Array of ingredients
 * @returns {Object} Ingredients grouped by category
 */
const groupIngredientsByCategory = (ingredients) => {
  const categories = {};

  ingredients.forEach(ingredient => {
    const category = ingredient.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(ingredient);
  });

  return categories;
};

/**
 * Get general recommendations based on skin type and concerns
 * @param {String} skinType - Skin type
 * @param {Array} skinConcerns - Skin concerns
 * @returns {Object} General recommendations
 */
const getGeneralRecommendations = (skinType, skinConcerns) => {
  const recommendations = {
    cleansing: getCleansingRecommendations(skinType),
    moisturizing: getMoisturizingRecommendations(skinType),
    sunProtection: getSunProtectionRecommendations(skinType, skinConcerns),
    lifestyle: getLifestyleRecommendations(skinConcerns)
  };

  return recommendations;
};

/**
 * Get cleansing recommendations
 * @param {String} skinType - Skin type
 * @returns {Object} Cleansing recommendations
 */
const getCleansingRecommendations = (skinType) => {
  const recommendations = {
    oily: {
      frequency: 'twice daily',
      type: 'gentle foaming cleanser',
      ingredients: ['salicylic acid', 'niacinamide'],
      avoid: ['harsh scrubs', 'alcohol-based cleansers']
    },
    dry: {
      frequency: 'once daily',
      type: 'cream or oil cleanser',
      ingredients: ['ceramides', 'hyaluronic acid'],
      avoid: ['foaming cleansers', 'hot water']
    },
    combination: {
      frequency: 'twice daily',
      type: 'gentle gel cleanser',
      ingredients: ['niacinamide', 'glycerin'],
      avoid: ['harsh scrubs']
    },
    sensitive: {
      frequency: 'once daily',
      type: 'fragrance-free cream cleanser',
      ingredients: ['ceramides', 'centella asiatica'],
      avoid: ['fragrance', 'essential oils', 'hot water']
    },
    normal: {
      frequency: 'twice daily',
      type: 'gentle cleanser',
      ingredients: ['glycerin', 'niacinamide'],
      avoid: ['harsh scrubs']
    }
  };

  return recommendations[skinType] || recommendations.normal;
};

/**
 * Get moisturizing recommendations
 * @param {String} skinType - Skin type
 * @returns {Object} Moisturizing recommendations
 */
const getMoisturizingRecommendations = (skinType) => {
  const recommendations = {
    oily: {
      type: 'lightweight gel or lotion',
      ingredients: ['niacinamide', 'hyaluronic acid'],
      avoid: ['heavy creams', 'mineral oil']
    },
    dry: {
      type: 'rich cream or balm',
      ingredients: ['ceramides', 'squalane', 'hyaluronic acid'],
      avoid: ['alcohol', 'fragrance']
    },
    combination: {
      type: 'lightweight lotion',
      ingredients: ['niacinamide', 'hyaluronic acid'],
      avoid: ['heavy creams']
    },
    sensitive: {
      type: 'fragrance-free cream',
      ingredients: ['ceramides', 'centella asiatica'],
      avoid: ['fragrance', 'essential oils']
    },
    normal: {
      type: 'lightweight lotion',
      ingredients: ['hyaluronic acid', 'glycerin'],
      avoid: ['heavy creams']
    }
  };

  return recommendations[skinType] || recommendations.normal;
};

/**
 * Get sun protection recommendations
 * @param {String} skinType - Skin type
 * @param {Array} skinConcerns - Skin concerns
 * @returns {Object} Sun protection recommendations
 */
const getSunProtectionRecommendations = (skinType, skinConcerns) => {
  const spf = skinConcerns.includes('pigmentation') ? 'SPF 50+' : 'SPF 30+';
  
  const recommendations = {
    spf: spf,
    type: skinType === 'oily' ? 'oil-free gel' : 'lightweight lotion',
    ingredients: ['zinc oxide', 'titanium dioxide'],
    reapplication: 'every 2 hours',
    notes: 'Apply 15 minutes before sun exposure'
  };

  return recommendations;
};

/**
 * Get lifestyle recommendations
 * @param {Array} skinConcerns - Skin concerns
 * @returns {Object} Lifestyle recommendations
 */
const getLifestyleRecommendations = (skinConcerns) => {
  const recommendations = {
    diet: ['Stay hydrated', 'Eat antioxidant-rich foods', 'Limit dairy if acne-prone'],
    sleep: ['Get 7-9 hours of sleep', 'Sleep on clean pillowcases'],
    stress: ['Practice stress management', 'Exercise regularly'],
    environment: ['Avoid touching face', 'Clean phone regularly', 'Use humidifier in dry climates']
  };

  if (skinConcerns.includes('acne')) {
    recommendations.diet.push('Limit high-glycemic foods');
    recommendations.environment.push('Change pillowcases weekly');
  }

  if (skinConcerns.includes('pigmentation')) {
    recommendations.environment.push('Wear wide-brimmed hats');
    recommendations.environment.push('Seek shade during peak hours');
  }

  return recommendations;
};

/**
 * Check ingredient compatibility
 * @param {Array} ingredients - Array of ingredients to check
 * @returns {Object} Compatibility warnings and recommendations
 */
const checkIngredientCompatibility = (ingredients) => {
  const warnings = [];
  const recommendations = [];

  // Check for incompatible combinations
  const incompatibilities = [
    {
      ingredients: ['Vitamin C', 'Retinoids'],
      issue: 'Can cause irritation when used together',
      recommendation: 'Use Vitamin C in morning, Retinoids in evening'
    },
    {
      ingredients: ['Benzoyl Peroxide', 'Retinoids'],
      issue: 'Can reduce effectiveness of both ingredients',
      recommendation: 'Use on alternate days or different times'
    },
    {
      ingredients: ['AHA', 'Retinoids'],
      issue: 'Can cause excessive irritation',
      recommendation: 'Start with one ingredient, gradually introduce the other'
    }
  ];

  incompatibilities.forEach(combo => {
    const hasBoth = combo.ingredients.every(ingredient =>
      ingredients.some(ing => ing.name.includes(ingredient))
    );

    if (hasBoth) {
      warnings.push(combo.issue);
      recommendations.push(combo.recommendation);
    }
  });

  return { warnings, recommendations };
};

module.exports = {
  getRecommendedIngredients,
  getIngredientsForConcern,
  checkIngredientCompatibility,
  getGeneralRecommendations
}; 
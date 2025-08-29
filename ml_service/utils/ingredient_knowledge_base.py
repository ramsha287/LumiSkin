"""
Ingredient Knowledge Base
Comprehensive mapping of skin concerns to dermatologist-approved ingredients
"""

# Skin Concern to Ingredient Mapping
CONCERN_TO_INGREDIENTS = {
    "acne": {
        "recommended": [
            "salicylic acid",
            "niacinamide", 
            "benzoyl peroxide",
            "azelaic acid",
            "tea tree oil",
            "zinc",
            "sulfur",
            "glycolic acid",
            "lactic acid",
            "retinol"
        ],
        "avoid_if_sensitive": [
            "high percentage aha/bha",
            "strong retinoids",
            "fragrance",
            "alcohol denat"
        ],
        "strength_levels": {
            "salicylic acid": {"mild": "0.5-1%", "moderate": "2%", "strong": "2%+"},
            "benzoyl peroxide": {"mild": "2.5%", "moderate": "5%", "strong": "10%"},
            "niacinamide": {"mild": "2-5%", "moderate": "10%", "strong": "10%+"},
            "azelaic acid": {"mild": "10%", "moderate": "15%", "strong": "20%"}
        }
    },
    
    "hyperpigmentation": {
        "recommended": [
            "vitamin c",
            "niacinamide",
            "alpha arbutin",
            "azelaic acid",
            "kojic acid",
            "tranexamic acid",
            "licorice root extract",
            "vitamin e",
            "ferulic acid",
            "glutathione"
        ],
        "avoid_if_sensitive": [
            "hydroquinone",
            "high percentage acids",
            "fragrance",
            "essential oils"
        ],
        "strength_levels": {
            "vitamin c": {"mild": "5-10%", "moderate": "15-20%", "strong": "20%+"},
            "niacinamide": {"mild": "2-5%", "moderate": "10%", "strong": "10%+"},
            "alpha arbutin": {"mild": "1-2%", "moderate": "2-4%", "strong": "4%+"}
        }
    },
    
    "dryness": {
        "recommended": [
            "hyaluronic acid",
            "ceramides",
            "squalane",
            "glycerin",
            "shea butter",
            "jojoba oil",
            "argan oil",
            "vitamin e",
            "panthenol",
            "urea"
        ],
        "avoid_if_sensitive": [
            "fragrance",
            "alcohol",
            "strong acids",
            "retinoids"
        ],
        "strength_levels": {
            "hyaluronic acid": {"mild": "0.5-1%", "moderate": "1-2%", "strong": "2%+"},
            "ceramides": {"mild": "0.5-1%", "moderate": "1-2%", "strong": "2%+"},
            "glycerin": {"mild": "2-5%", "moderate": "5-10%", "strong": "10%+"}
        }
    },
    
    "wrinkles": {
        "recommended": [
            "retinol",
            "peptides",
            "bakuchiol",
            "vitamin c",
            "niacinamide",
            "hyaluronic acid",
            "copper peptides",
            "matrixyl",
            "argireline",
            "collagen"
        ],
        "avoid_if_sensitive": [
            "high percentage retinol",
            "strong acids",
            "fragrance",
            "essential oils"
        ],
        "strength_levels": {
            "retinol": {"mild": "0.01-0.03%", "moderate": "0.05-0.1%", "strong": "0.1%+"},
            "bakuchiol": {"mild": "0.5-1%", "moderate": "1-2%", "strong": "2%+"}
        }
    },
    
    "redness": {
        "recommended": [
            "centella asiatica",
            "panthenol",
            "niacinamide",
            "aloe vera",
            "green tea extract",
            "chamomile",
            "licorice root",
            "zinc",
            "vitamin e",
            "ceramides"
        ],
        "avoid_if_sensitive": [
            "fragrance",
            "alcohol",
            "strong acids",
            "retinoids",
            "essential oils"
        ],
        "strength_levels": {
            "centella asiatica": {"mild": "0.5-1%", "moderate": "1-2%", "strong": "2%+"},
            "panthenol": {"mild": "1-2%", "moderate": "2-5%", "strong": "5%+"}
        }
    },
    
    "pores": {
        "recommended": [
            "niacinamide",
            "salicylic acid",
            "glycolic acid",
            "lactic acid",
            "zinc",
            "clay",
            "vitamin c",
            "retinol",
            "azelaic acid",
            "tea tree oil"
        ],
        "avoid_if_sensitive": [
            "high percentage acids",
            "strong retinoids",
            "fragrance",
            "alcohol"
        ],
        "strength_levels": {
            "niacinamide": {"mild": "2-5%", "moderate": "10%", "strong": "10%+"},
            "salicylic acid": {"mild": "0.5-1%", "moderate": "2%", "strong": "2%+"}
        }
    },
    
    "dullness": {
        "recommended": [
            "vitamin c",
            "glycolic acid",
            "lactic acid",
            "niacinamide",
            "alpha hydroxy acids",
            "vitamin e",
            "ferulic acid",
            "kojic acid",
            "licorice root",
            "peptides"
        ],
        "avoid_if_sensitive": [
            "high percentage acids",
            "strong retinoids",
            "fragrance",
            "alcohol"
        ],
        "strength_levels": {
            "vitamin c": {"mild": "5-10%", "moderate": "15-20%", "strong": "20%+"},
            "glycolic acid": {"mild": "5-10%", "moderate": "10-15%", "strong": "15%+"}
        }
    }
}

# Skin Type Specific Recommendations
SKIN_TYPE_RECOMMENDATIONS = {
    "oily": {
        "preferred_ingredients": ["niacinamide", "salicylic acid", "zinc", "clay"],
        "avoid_ingredients": ["heavy oils", "petrolatum", "lanolin"],
        "texture_preferences": ["gel", "serum", "light lotion"],
        "frequency": "twice daily"
    },
    
    "dry": {
        "preferred_ingredients": ["hyaluronic acid", "ceramides", "squalane", "glycerin"],
        "avoid_ingredients": ["alcohol", "fragrance", "strong acids"],
        "texture_preferences": ["cream", "balm", "oil"],
        "frequency": "twice daily"
    },
    
    "combination": {
        "preferred_ingredients": ["niacinamide", "hyaluronic acid", "lightweight oils"],
        "avoid_ingredients": ["heavy creams", "strong acids"],
        "texture_preferences": ["gel", "light cream", "serum"],
        "frequency": "twice daily"
    },
    
    "sensitive": {
        "preferred_ingredients": ["centella asiatica", "panthenol", "ceramides", "aloe vera"],
        "avoid_ingredients": ["fragrance", "alcohol", "essential oils", "strong acids"],
        "texture_preferences": ["cream", "balm", "gentle lotion"],
        "frequency": "once daily initially"
    },
    
    "normal": {
        "preferred_ingredients": ["vitamin c", "niacinamide", "hyaluronic acid"],
        "avoid_ingredients": ["irritating ingredients"],
        "texture_preferences": ["any texture"],
        "frequency": "twice daily"
    }
}

# Product Category Mapping
PRODUCT_CATEGORIES = {
    "cleanser": {
        "ingredients": ["salicylic acid", "glycolic acid", "niacinamide", "ceramides"],
        "usage": "morning and evening",
        "texture": "gel, foam, cream"
    },
    
    "toner": {
        "ingredients": ["niacinamide", "glycolic acid", "lactic acid", "vitamin c"],
        "usage": "after cleansing",
        "texture": "liquid, mist"
    },
    
    "serum": {
        "ingredients": ["vitamin c", "niacinamide", "retinol", "hyaluronic acid"],
        "usage": "after toner, before moisturizer",
        "texture": "liquid, gel"
    },
    
    "moisturizer": {
        "ingredients": ["ceramides", "hyaluronic acid", "squalane", "glycerin"],
        "usage": "after serum",
        "texture": "cream, gel, lotion"
    },
    
    "sunscreen": {
        "ingredients": ["zinc oxide", "titanium dioxide", "niacinamide"],
        "usage": "morning, last step",
        "texture": "cream, gel, lotion"
    },
    
    "treatment": {
        "ingredients": ["retinol", "azelaic acid", "benzoyl peroxide", "alpha arbutin"],
        "usage": "evening, after serum",
        "texture": "cream, gel, liquid"
    }
}

# Budget Tiers
BUDGET_TIERS = {
    "low": {
        "range": "$5-$25",
        "brands": ["The Ordinary", "CeraVe", "Neutrogena", "Simple"],
        "priorities": ["effectiveness", "value", "availability"]
    },
    
    "medium": {
        "range": "$25-$75",
        "brands": ["Paula's Choice", "The Inkey List", "La Roche-Posay", "CeraVe"],
        "priorities": ["quality", "effectiveness", "ingredient concentration"]
    },
    
    "high": {
        "range": "$75-$200",
        "brands": ["Skinceuticals", "Drunk Elephant", "Sunday Riley", "Tatcha"],
        "priorities": ["luxury", "innovation", "brand reputation"]
    },
    
    "luxury": {
        "range": "$200+",
        "brands": ["La Mer", "La Prairie", "Sisley", "Chantecaille"],
        "priorities": ["luxury", "exclusivity", "premium ingredients"]
    }
}

# Ingredient Compatibility Matrix
INGREDIENT_COMPATIBILITY = {
    "vitamin_c": {
        "compatible": ["vitamin_e", "ferulic_acid", "hyaluronic_acid"],
        "incompatible": ["niacinamide", "retinol", "benzoyl_peroxide"],
        "best_time": "morning"
    },
    
    "niacinamide": {
        "compatible": ["hyaluronic_acid", "peptides", "ceramides"],
        "incompatible": ["vitamin_c", "strong_acids"],
        "best_time": "any"
    },
    
    "retinol": {
        "compatible": ["hyaluronic_acid", "ceramides", "peptides"],
        "incompatible": ["vitamin_c", "benzoyl_peroxide", "strong_acids"],
        "best_time": "evening"
    },
    
    "salicylic_acid": {
        "compatible": ["niacinamide", "hyaluronic_acid"],
        "incompatible": ["retinol", "strong_acids"],
        "best_time": "morning"
    },
    
    "benzoyl_peroxide": {
        "compatible": ["clindamycin", "zinc"],
        "incompatible": ["retinol", "vitamin_c"],
        "best_time": "evening"
    }
}

def get_ingredients_for_concern(concern, skin_type="normal", sensitivity="low"):
    """
    Get recommended ingredients for a specific skin concern
    
    Args:
        concern (str): Skin concern (acne, hyperpigmentation, etc.)
        skin_type (str): Skin type (oily, dry, etc.)
        sensitivity (str): Sensitivity level (low, medium, high)
        
    Returns:
        dict: Recommended ingredients and avoid list
    """
    if concern not in CONCERN_TO_INGREDIENTS:
        return {"recommended": [], "avoid": [], "strength_levels": {}}
    
    concern_data = CONCERN_TO_INGREDIENTS[concern]
    recommended = concern_data["recommended"].copy()
    avoid = concern_data["avoid_if_sensitive"].copy()
    
    # Adjust based on skin type
    skin_type_data = SKIN_TYPE_RECOMMENDATIONS.get(skin_type, {})
    skin_type_avoid = skin_type_data.get("avoid_ingredients", [])
    avoid.extend(skin_type_avoid)
    
    # Adjust based on sensitivity
    if sensitivity in ["medium", "high"]:
        # Remove strong ingredients for sensitive skin
        strong_ingredients = ["retinol", "high percentage acids", "benzoyl peroxide"]
        recommended = [ing for ing in recommended if ing not in strong_ingredients]
    
    return {
        "recommended": recommended,
        "avoid": list(set(avoid)),  # Remove duplicates
        "strength_levels": concern_data.get("strength_levels", {})
    }

def get_product_recommendations(concerns, skin_type="normal", budget="medium", 
                              sensitivity="low", product_type=None):
    """
    Get comprehensive product recommendations
    
    Args:
        concerns (list): List of skin concerns
        skin_type (str): Skin type
        budget (str): Budget tier
        sensitivity (str): Sensitivity level
        product_type (str): Specific product type (optional)
        
    Returns:
        dict: Comprehensive recommendations
    """
    all_ingredients = []
    avoid_ingredients = []
    
    # Collect ingredients for all concerns
    for concern in concerns:
        concern_data = get_ingredients_for_concern(concern, skin_type, sensitivity)
        all_ingredients.extend(concern_data["recommended"])
        avoid_ingredients.extend(concern_data["avoid"])
    
    # Remove duplicates and avoid ingredients
    all_ingredients = list(set(all_ingredients))
    avoid_ingredients = list(set(avoid_ingredients))
    
    # Filter out ingredients to avoid
    final_ingredients = [ing for ing in all_ingredients if ing not in avoid_ingredients]
    
    # Get product categories
    if product_type:
        categories = [product_type]
    else:
        categories = list(PRODUCT_CATEGORIES.keys())
    
    # Get budget information
    budget_data = BUDGET_TIERS.get(budget, BUDGET_TIERS["medium"])
    
    return {
        "ingredients": final_ingredients,
        "avoid_ingredients": avoid_ingredients,
        "product_categories": categories,
        "budget": budget_data,
        "skin_type": skin_type,
        "sensitivity": sensitivity,
        "concerns": concerns
    }

def check_ingredient_compatibility(ingredient1, ingredient2):
    """
    Check if two ingredients are compatible
    
    Args:
        ingredient1 (str): First ingredient
        ingredient2 (str): Second ingredient
        
    Returns:
        bool: True if compatible, False otherwise
    """
    if ingredient1 in INGREDIENT_COMPATIBILITY:
        return ingredient2 not in INGREDIENT_COMPATIBILITY[ingredient1]["incompatible"]
    return True

def get_optimal_usage_time(ingredient):
    """
    Get optimal usage time for an ingredient
    
    Args:
        ingredient (str): Ingredient name
        
    Returns:
        str: Optimal usage time (morning, evening, any)
    """
    if ingredient in INGREDIENT_COMPATIBILITY:
        return INGREDIENT_COMPATIBILITY[ingredient]["best_time"]
    return "any"

def get_strength_recommendation(ingredient, skin_type, sensitivity):
    """
    Get strength recommendation for an ingredient
    
    Args:
        ingredient (str): Ingredient name
        skin_type (str): Skin type
        sensitivity (str): Sensitivity level
        
    Returns:
        str: Recommended strength level
    """
    # Find which concern this ingredient belongs to
    for concern, data in CONCERN_TO_INGREDIENTS.items():
        if ingredient in data["recommended"]:
            strength_levels = data.get("strength_levels", {})
            if ingredient in strength_levels:
                if sensitivity == "high":
                    return "mild"
                elif sensitivity == "medium":
                    return "mild"
                else:
                    return "moderate"
    
    return "moderate" 
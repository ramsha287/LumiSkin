"""
Product Recommender Service
Generates personalized product recommendations based on skin analysis and user preferences
"""

import json
import logging
from typing import Dict, List, Optional, Any
from .ingredient_knowledge_base import (
    get_product_recommendations, 
    check_ingredient_compatibility,
    get_optimal_usage_time,
    get_strength_recommendation
)

logger = logging.getLogger(__name__)

class ProductRecommender:
    def __init__(self):
        """Initialize the product recommender"""
        self.product_database = self._load_product_database()
        self.user_profiles = {}
        
    def _load_product_database(self) -> Dict[str, Any]:
        """
        Load product database from JSON file or create sample data
        
        Returns:
            dict: Product database
        """
        try:
            with open('data/products.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning("Product database not found, using sample data")
            return self._create_sample_products()
    
    def _create_sample_products(self) -> Dict[str, Any]:
        """
        Create sample product database for testing
        
        Returns:
            dict: Sample product database
        """
        return {
            "products": [
                {
                    "id": "prod_001",
                    "name": "The Ordinary Niacinamide 10% + Zinc 1%",
                    "brand": "The Ordinary",
                    "category": "serum",
                    "ingredients": ["niacinamide", "zinc"],
                    "price": 15.99,
                    "rating": 4.5,
                    "reviews": 12500,
                    "budget_tier": "low",
                    "skin_type": ["oily", "combination", "normal"],
                    "concerns": ["acne", "pores", "hyperpigmentation"],
                    "texture": "serum",
                    "size": "30ml",
                    "availability": True,
                    "fragrance_free": True,
                    "cruelty_free": True,
                    "vegan": True,
                    "usage": "morning and evening",
                    "description": "High-strength vitamin and mineral formula for blemish and congestion-prone skin"
                },
                {
                    "id": "prod_002",
                    "name": "Paula's Choice 2% BHA Liquid Exfoliant",
                    "brand": "Paula's Choice",
                    "category": "toner",
                    "ingredients": ["salicylic acid", "betaine salicylate"],
                    "price": 32.00,
                    "rating": 4.7,
                    "reviews": 8900,
                    "budget_tier": "medium",
                    "skin_type": ["oily", "combination", "normal"],
                    "concerns": ["acne", "pores", "dullness"],
                    "texture": "liquid",
                    "size": "118ml",
                    "availability": True,
                    "fragrance_free": True,
                    "cruelty_free": True,
                    "vegan": True,
                    "usage": "evening",
                    "description": "Gentle leave-on exfoliant that unclogs pores and smooths fine lines"
                },
                {
                    "id": "prod_003",
                    "name": "CeraVe Moisturizing Cream",
                    "brand": "CeraVe",
                    "category": "moisturizer",
                    "ingredients": ["ceramides", "hyaluronic acid", "glycerin"],
                    "price": 19.99,
                    "rating": 4.6,
                    "reviews": 15600,
                    "budget_tier": "low",
                    "skin_type": ["dry", "normal", "sensitive"],
                    "concerns": ["dryness", "redness"],
                    "texture": "cream",
                    "size": "454g",
                    "availability": True,
                    "fragrance_free": True,
                    "cruelty_free": False,
                    "vegan": False,
                    "usage": "morning and evening",
                    "description": "Rich, non-greasy moisturizer with essential ceramides"
                },
                {
                    "id": "prod_004",
                    "name": "Skinceuticals C E Ferulic",
                    "brand": "Skinceuticals",
                    "category": "serum",
                    "ingredients": ["vitamin c", "vitamin e", "ferulic acid"],
                    "price": 169.00,
                    "rating": 4.8,
                    "reviews": 3200,
                    "budget_tier": "high",
                    "skin_type": ["normal", "combination", "dry"],
                    "concerns": ["hyperpigmentation", "wrinkles", "dullness"],
                    "texture": "serum",
                    "size": "30ml",
                    "availability": True,
                    "fragrance_free": True,
                    "cruelty_free": False,
                    "vegan": False,
                    "usage": "morning",
                    "description": "Antioxidant serum for environmental protection and anti-aging"
                },
                {
                    "id": "prod_005",
                    "name": "La Roche-Posay Effaclar Duo",
                    "brand": "La Roche-Posay",
                    "category": "treatment",
                    "ingredients": ["niacinamide", "salicylic acid", "zinc"],
                    "price": 28.99,
                    "rating": 4.4,
                    "reviews": 7800,
                    "budget_tier": "medium",
                    "skin_type": ["oily", "combination"],
                    "concerns": ["acne", "pores"],
                    "texture": "gel",
                    "size": "40ml",
                    "availability": True,
                    "fragrance_free": True,
                    "cruelty_free": False,
                    "vegan": False,
                    "usage": "morning and evening",
                    "description": "Dual-action acne treatment with niacinamide and salicylic acid"
                }
            ]
        }
    
    def create_user_profile(self, skin_analysis: Dict, user_preferences: Dict) -> str:
        """
        Create a user profile from skin analysis and preferences
        
        Args:
            skin_analysis (dict): Results from skin analysis
            user_preferences (dict): User preferences and constraints
            
        Returns:
            str: User profile ID
        """
        import uuid
        
        profile_id = str(uuid.uuid4())
        
        # Extract skin concerns from analysis
        concerns = []
        if skin_analysis.get('acne', {}).get('probability', 0) > 0.3:
            concerns.append('acne')
        if skin_analysis.get('pores', {}).get('probability', 0) > 0.3:
            concerns.append('pores')
        if skin_analysis.get('pigmentation', {}).get('probability', 0) > 0.3:
            concerns.append('hyperpigmentation')
        
        # Determine skin type from analysis or user input
        skin_type = user_preferences.get('skin_type', 'normal')
        
        # Create profile
        profile = {
            'id': profile_id,
            'concerns': concerns,
            'skin_type': skin_type,
            'sensitivity': user_preferences.get('sensitivity', 'low'),
            'budget': user_preferences.get('budget', 'medium'),
            'allergies': user_preferences.get('allergies', []),
            'preferences': {
                'fragrance_free': user_preferences.get('fragrance_free', True),
                'cruelty_free': user_preferences.get('cruelty_free', False),
                'vegan': user_preferences.get('vegan', False),
                'product_types': user_preferences.get('product_types', [])
            },
            'analysis_results': skin_analysis,
            'created_at': '2024-01-01T00:00:00Z'
        }
        
        self.user_profiles[profile_id] = profile
        return profile_id
    
    def get_recommendations(self, profile_id: str, max_products: int = 5) -> Dict[str, Any]:
        """
        Get personalized product recommendations
        
        Args:
            profile_id (str): User profile ID
            max_products (int): Maximum number of products to recommend
            
        Returns:
            dict: Personalized recommendations
        """
        if profile_id not in self.user_profiles:
            raise ValueError(f"Profile {profile_id} not found")
        
        profile = self.user_profiles[profile_id]
        
        # Get ingredient recommendations
        ingredient_recs = get_product_recommendations(
            concerns=profile['concerns'],
            skin_type=profile['skin_type'],
            budget=profile['budget'],
            sensitivity=profile['sensitivity']
        )
        
        # Filter and score products
        scored_products = self._score_products(
            products=self.product_database['products'],
            profile=profile,
            ingredient_recs=ingredient_recs
        )
        
        # Sort by score and get top recommendations
        scored_products.sort(key=lambda x: x['score'], reverse=True)
        top_products = scored_products[:max_products]
        
        # Generate recommendations
        recommendations = {
            'profile_id': profile_id,
            'ingredient_advice': self._generate_ingredient_advice(ingredient_recs),
            'products': top_products,
            'routine_suggestions': self._generate_routine_suggestions(top_products),
            'usage_tips': self._generate_usage_tips(profile, ingredient_recs)
        }
        
        return recommendations
    
    def _score_products(self, products: List[Dict], profile: Dict, 
                       ingredient_recs: Dict) -> List[Dict]:
        """
        Score products based on user profile and ingredient recommendations
        
        Args:
            products (list): List of products to score
            profile (dict): User profile
            ingredient_recs (dict): Ingredient recommendations
            
        Returns:
            list: Products with scores
        """
        scored_products = []
        
        for product in products:
            score = 0
            
            # Ingredient match score (40% weight)
            ingredient_score = self._calculate_ingredient_score(
                product['ingredients'], 
                ingredient_recs['ingredients'],
                ingredient_recs['avoid_ingredients']
            )
            score += ingredient_score * 0.4
            
            # Skin type compatibility (20% weight)
            if profile['skin_type'] in product['skin_type']:
                score += 1.0 * 0.2
            elif 'normal' in product['skin_type']:
                score += 0.7 * 0.2
            else:
                score += 0.3 * 0.2
            
            # Concern match (20% weight)
            concern_score = self._calculate_concern_score(
                product['concerns'], 
                profile['concerns']
            )
            score += concern_score * 0.2
            
            # Budget compatibility (10% weight)
            if product['budget_tier'] == profile['budget']:
                score += 1.0 * 0.1
            elif self._budget_compatible(product['budget_tier'], profile['budget']):
                score += 0.7 * 0.1
            else:
                score += 0.3 * 0.1
            
            # User preferences (10% weight)
            preference_score = self._calculate_preference_score(product, profile)
            score += preference_score * 0.1
            
            # Add product with score
            product_with_score = product.copy()
            product_with_score['score'] = score
            scored_products.append(product_with_score)
        
        return scored_products
    
    def _calculate_ingredient_score(self, product_ingredients: List[str], 
                                  recommended_ingredients: List[str],
                                  avoid_ingredients: List[str]) -> float:
        """Calculate ingredient match score"""
        score = 0
        
        # Check for recommended ingredients
        for ingredient in recommended_ingredients:
            if any(ingredient in prod_ing.lower() for prod_ing in product_ingredients):
                score += 1.0
        
        # Penalize avoid ingredients
        for ingredient in avoid_ingredients:
            if any(ingredient in prod_ing.lower() for prod_ing in product_ingredients):
                score -= 0.5
        
        # Normalize score
        max_possible = len(recommended_ingredients)
        if max_possible > 0:
            score = max(0, score / max_possible)
        
        return score
    
    def _calculate_concern_score(self, product_concerns: List[str], 
                               user_concerns: List[str]) -> float:
        """Calculate concern match score"""
        if not user_concerns:
            return 0.5  # Neutral score if no specific concerns
        
        matches = len(set(product_concerns) & set(user_concerns))
        return matches / len(user_concerns)
    
    def _budget_compatible(self, product_budget: str, user_budget: str) -> bool:
        """Check if product budget is compatible with user budget"""
        budget_hierarchy = ['low', 'medium', 'high', 'luxury']
        user_idx = budget_hierarchy.index(user_budget)
        product_idx = budget_hierarchy.index(product_budget)
        
        return product_idx <= user_idx
    
    def _calculate_preference_score(self, product: Dict, profile: Dict) -> float:
        """Calculate preference match score"""
        score = 0
        preferences = profile['preferences']
        
        # Fragrance free preference
        if preferences.get('fragrance_free') and product.get('fragrance_free'):
            score += 0.3
        
        # Cruelty free preference
        if preferences.get('cruelty_free') and product.get('cruelty_free'):
            score += 0.3
        
        # Vegan preference
        if preferences.get('vegan') and product.get('vegan'):
            score += 0.2
        
        # Product type preference
        if preferences.get('product_types'):
            if product['category'] in preferences['product_types']:
                score += 0.2
        
        return score
    
    def _generate_ingredient_advice(self, ingredient_recs: Dict) -> str:
        """Generate human-readable ingredient advice"""
        ingredients = ingredient_recs['ingredients']
        concerns = ingredient_recs['concerns']
        
        if not ingredients:
            return "Based on your skin profile, focus on gentle, hydrating ingredients."
        
        advice = f"For your skin concerns ({', '.join(concerns)}), look for products containing: "
        advice += ', '.join(ingredients[:5])  # Top 5 ingredients
        
        if ingredient_recs['avoid_ingredients']:
            advice += f". Avoid: {', '.join(ingredient_recs['avoid_ingredients'][:3])}"
        
        return advice
    
    def _generate_routine_suggestions(self, products: List[Dict]) -> List[Dict]:
        """Generate routine suggestions from recommended products"""
        routine = {
            'morning': [],
            'evening': []
        }
        
        for product in products:
            usage = product.get('usage', 'any')
            if 'morning' in usage.lower():
                routine['morning'].append(product)
            if 'evening' in usage.lower():
                routine['evening'].append(product)
        
        return routine
    
    def _generate_usage_tips(self, profile: Dict, ingredient_recs: Dict) -> List[str]:
        """Generate usage tips based on profile and ingredients"""
        tips = []
        
        # Sensitivity tips
        if profile['sensitivity'] in ['medium', 'high']:
            tips.append("Start with lower concentrations and patch test new products")
            tips.append("Use products once daily initially, then increase frequency")
        
        # Skin type tips
        if profile['skin_type'] == 'oily':
            tips.append("Use lightweight, non-comedogenic products")
        elif profile['skin_type'] == 'dry':
            tips.append("Layer products and use occlusive moisturizers")
        
        # Ingredient tips
        for ingredient in ingredient_recs['ingredients'][:3]:
            optimal_time = get_optimal_usage_time(ingredient)
            if optimal_time != 'any':
                tips.append(f"Use {ingredient} products in the {optimal_time}")
        
        return tips
    
    def update_product_database(self, new_products: List[Dict]):
        """Update product database with new products"""
        self.product_database['products'].extend(new_products)
        
        # Save to file
        try:
            with open('data/products.json', 'w') as f:
                json.dump(self.product_database, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save product database: {e}")
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict]:
        """Get product by ID"""
        for product in self.product_database['products']:
            if product['id'] == product_id:
                return product
        return None 
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';

// Simulated ingredient database
// Replace with your actual DB or external API call
const INGREDIENTS_DB = {
  "retinol": {
    category: "Vitamin A derivative",
    harmful: false,
    description: "Retinol helps reduce wrinkles and improve skin texture."
  },
  "paraben": {
    category: "Preservative",
    harmful: true,
    description: "Parabens may cause skin irritation and have potential hormone disruption effects."
  },
  "salicylic acid": {
    category: "Beta hydroxy acid",
    harmful: false,
    description: "Helps exfoliate and treat acne."
  },
  "niacinamide": {
    category: "Vitamin B3 derivative",
    harmful: false,
    description: "Reduces inflammation, brightens skin, and improves skin barrier function."
  },
  "hyaluronic acid": {
    category: "Humectant",
    harmful: false,
    description: "Hydrates skin by attracting and retaining moisture."
  },
  "benzoyl peroxide": {
    category: "Anti-acne agent",
    harmful: true,
    description: "Kills acne-causing bacteria but may cause dryness or irritation."
  },
  "glycolic acid": {
    category: "Alpha hydroxy acid",
    harmful: false,
    description: "Exfoliates and improves skin texture and tone."
  },
  "tocopherol": {
    category: "Vitamin E antioxidant",
    harmful: false,
    description: "Protects skin cells against oxidative damage."
  },
  "shea butter": {
    category: "Emollient",
    harmful: false,
    description: "Moisturizes and nourishes dry skin."
  },
  "fragrance": {
    category: "Additive",
    harmful: true,
    description: "Can cause skin irritation and allergic reactions."
  },
  "alcohol denat": {
    category: "Solvent/Preservative",
    harmful: true,
    description: "Can dry out and irritate the skin."
  },
  "zinc oxide": {
    category: "Physical sunscreen agent",
    harmful: false,
    description: "Blocks UVA and UVB rays to protect skin from sun damage."
  },
  "dimethicone": {
    category: "Silicone emollient",
    harmful: false,
    description: "Smooths skin surface and locks in moisture."
  },
  "ceramide": {
    category: "Skin barrier lipid",
    harmful: false,
    description: "Helps restore skin barrier and retain moisture."
  },
  "panthenol": {
    category: "Provitamin B5",
    harmful: false,
    description: "Soothes and moisturizes skin."
  },
  "allantoin": {
    category: "Skin protectant",
    harmful: false,
    description: "Promotes wound healing and soothes irritation."
  },
  "azelaic acid": {
    category: "Anti-inflammatory",
    harmful: false,
    description: "Helps reduce redness and treat acne."
  },
  "squalane": {
    category: "Emollient",
    harmful: false,
    description: "Softens skin and reduces moisture loss."
  },
  "caffeine": {
    category: "Stimulant",
    harmful: false,
    description: "Reduces puffiness and inflammation."
  },
  "green tea extract": {
    category: "Antioxidant",
    harmful: false,
    description: "Protects skin from free radical damage."
  },
  "licorice root extract": {
    category: "Skin brightener",
    harmful: false,
    description: "Helps reduce hyperpigmentation."
  }
  // Add as many as needed...
};

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /check - Analyze list of ingredients for safety and suitability
router.post('/check', (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "ingredients must be a non-empty array" });
  }

  const analysis = ingredients.map((ingredient) => {
    const info = INGREDIENTS_DB[ingredient.toLowerCase()];

    return {
      ingredient,
      found: !!info,
      harmful: info ? info.harmful : null,
      category: info ? info.category : "Unknown",
      description: info ? info.description : "No information available",
    };
  });

  res.json({
    message: "Ingredient check result",
    analysis,
  });
});

// GET /info/:ingredient - Get detailed info about one ingredient
router.get('/info/:ingredient', (req, res) => {
  const ingredient = req.params.ingredient.toLowerCase();
  const info = INGREDIENTS_DB[ingredient];

  if (!info) {
    return res.status(404).json({ error: "Ingredient not found" });
  }

  res.json({ ingredient, ...info });
});

// GET /search - Search ingredients by keyword query param `q`
router.get('/search', (req, res) => {
  const q = (req.query.q || "").toLowerCase();

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required for search" });
  }

  // Simple substring search in keys and descriptions
  const results = Object.entries(INGREDIENTS_DB)
    .filter(([name, info]) => name.includes(q) || (info.description && info.description.toLowerCase().includes(q)))
    .map(([name, info]) => ({ ingredient: name, ...info }));

  res.json({
    message: "Search results",
    results
  });
});

export default router;

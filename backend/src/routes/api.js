import express from 'express';
import { isLiveAIReady } from '../config/gemini.js';
import { scanPantry } from '../controllers/pantryController.js';
import { generateRecipes } from '../controllers/recipeController.js';
import { getIngredientSubstitute } from '../controllers/substituteController.js';

const router = express.Router();

// Health & Mode Status
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Chef.ai Backend API',
    mode: isLiveAIReady ? 'live' : 'mock',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Pantry Endpoints
router.post('/pantry/scan', scanPantry);

// Recipe Endpoints
router.post('/recipes/generate', generateRecipes);
router.post('/recipes/substitute', getIngredientSubstitute);

export default router;

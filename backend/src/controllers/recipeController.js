import { generateRecipesWithAI } from '../services/geminiService.js';

/**
 * Handle AI & Pantry-driven recipe generation
 * POST /api/recipes/generate
 */
export async function generateRecipes(req, res, next) {
  try {
    const { ingredients = [], filter = 'All', sortBy = 'Best Match' } = req.body || {};

    const result = await generateRecipesWithAI(ingredients, filter, sortBy);

    return res.status(200).json({
      success: true,
      message: `Generated ${result.recipes.length} recipe suggestions`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

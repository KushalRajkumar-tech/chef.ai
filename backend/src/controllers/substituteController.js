import { findSubstitutesWithAI } from '../services/geminiService.js';

/**
 * Handle smart AI ingredient substitution queries
 * POST /api/recipes/substitute
 */
export async function getIngredientSubstitute(req, res, next) {
  try {
    const { ingredient, targetIngredient, targetRecipe, recipeContext = '' } = req.body || {};
    const itemToSwap = (ingredient || targetIngredient || '').trim();

    if (!itemToSwap) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: "ingredient" must be a non-empty string.'
      });
    }

    const context = recipeContext || targetRecipe || '';
    const result = await findSubstitutesWithAI(itemToSwap, context);

    return res.status(200).json({
      success: true,
      message: `Found substitutions for ${itemToSwap}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

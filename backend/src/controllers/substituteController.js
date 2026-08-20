import { findSubstitutesWithAI } from '../services/geminiService.js';

/**
 * Handle smart AI ingredient substitution queries
 * POST /api/recipes/substitute
 */
export async function getIngredientSubstitute(req, res, next) {
  try {
    const { ingredient, recipeContext = '' } = req.body || {};

    if (!ingredient || typeof ingredient !== 'string' || ingredient.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: "ingredient" must be a non-empty string.'
      });
    }

    const result = await findSubstitutesWithAI(ingredient.trim(), recipeContext);

    return res.status(200).json({
      success: true,
      message: `Found substitutions for ${ingredient}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

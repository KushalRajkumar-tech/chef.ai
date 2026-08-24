import { generateRecipesWithAI } from '../services/geminiService.js';

/**
 * Handle AI & Pantry-driven recipe generation
 * POST /api/recipes/generate
 */
export async function generateRecipes(req, res, next) {
  try {
    const {
      ingredients = [],
      filter = 'All',
      sortBy = 'Best Match',
      searchQuery = '',
      search = '',
      dietaryRestrictions = [],
      mealType = 'Any'
    } = req.body || {};

    const effectiveFilter = filter !== 'All' ? filter : (dietaryRestrictions[0] || 'All');
    const effectiveSearch = (searchQuery || search || '').trim();

    const result = await generateRecipesWithAI(ingredients, effectiveFilter, sortBy, effectiveSearch);

    return res.status(200).json({
      success: true,
      message: `Generated ${result.recipes?.length || 0} recipe suggestions`,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

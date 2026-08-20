import { aiClient, isLiveAIReady, GEMINI_MODEL } from '../config/gemini.js';
import { MOCK_PANTRY_ITEMS, getMockRecipes, getMockSubstitution } from './mockDataService.js';

/**
 * Scan an uploaded pantry image using Gemini Vision (or fallback to mock)
 * @param {string} imageBase64 - Base64 encoded image string (with or without data URI prefix)
 * @param {string} mimeType - e.g. "image/jpeg" or "image/png"
 */
export async function scanPantryWithAI(imageBase64, mimeType = 'image/jpeg') {
  if (!isLiveAIReady || !aiClient) {
    console.log('🤖 [GeminiService] Live AI not active. Returning curated pantry scan mock data.');
    return {
      source: 'mock',
      items: MOCK_PANTRY_ITEMS,
      totalCount: MOCK_PANTRY_ITEMS.length,
      expiringSoonCount: MOCK_PANTRY_ITEMS.filter(i => i.freshness === 'expiring_soon' || i.freshness === 'expired').length
    };
  }

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are Chef.ai, a computer vision culinary assistant. 
Analyze this kitchen/pantry/fridge image and identify all visible food items, produce, dairy, spices, and ingredients.
Return a STRICT JSON array of objects with the following structure:
[
  {
    "id": "ing_1",
    "name": "Eggs",
    "quantity": "6 large",
    "category": "Dairy & Eggs" (choose from: "Produce", "Dairy & Eggs", "Spices & Oils", "Pantry Staples", "Bakery", "Meat & Seafood"),
    "freshness": "fresh" (choose from: "fresh", "expiring_soon", "shelf_stable"),
    "daysLeft": 7
  }
]
Output ONLY valid JSON without markdown fences.`;

    const response = await aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/jpeg'
              }
            }
          ]
        }
      ]
    });

    const text = response.text ? response.text.trim() : '';
    const cleanJsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const items = JSON.parse(cleanJsonText);

    return {
      source: 'live_gemini',
      items,
      totalCount: items.length,
      expiringSoonCount: items.filter(i => i.freshness === 'expiring_soon' || i.freshness === 'expired').length
    };
  } catch (err) {
    console.error('⚠️ [GeminiService] Vision scan failed, falling back to mock dataset:', err.message);
    return {
      source: 'mock_fallback',
      items: MOCK_PANTRY_ITEMS,
      totalCount: MOCK_PANTRY_ITEMS.length,
      expiringSoonCount: MOCK_PANTRY_ITEMS.filter(i => i.freshness === 'expiring_soon' || i.freshness === 'expired').length,
      warning: err.message
    };
  }
}

/**
 * Generate recipe suggestions based on ingredients and filters
 */
export async function generateRecipesWithAI(ingredients = [], filter = 'All', sortBy = 'Best Match') {
  if (!isLiveAIReady || !aiClient || ingredients.length === 0) {
    console.log('🤖 [GeminiService] Generating recipes via culinary rules engine (Mock/Local mode).');
    const recipes = getMockRecipes(ingredients, filter, sortBy);
    return {
      source: 'mock',
      filterApplied: filter,
      sortByApplied: sortBy,
      recipes
    };
  }

  try {
    const prompt = `You are Chef.ai, a master chef AI. Given these pantry ingredients: ${ingredients.join(', ')}
and dietary/time filter: "${filter}", generate 3 to 4 creative, delicious recipes.
For each recipe, calculate how well the user's pantry matches it.

Return ONLY a JSON array of recipe objects conforming strictly to this format:
[
  {
    "id": "rec_unique_id",
    "title": "Recipe Name",
    "description": "Appetizing 1-2 sentence culinary description",
    "cuisine": "Italian | Indian | Mediterranean | Asian | Mexican | American",
    "tags": ["Quick (<20m)", "High Protein", "Vegetarian"],
    "prepTimeMinutes": 5,
    "cookTimeMinutes": 15,
    "totalTimeMinutes": 20,
    "calories": 480,
    "macros": { "protein": "24g", "carbs": "50g", "fats": "16g", "fiber": "5g" },
    "difficulty": "Easy" | "Medium" | "Hard",
    "defaultServings": 2,
    "imageUrl": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    "ingredients": [
      { "name": "Ingredient 1", "amount": "200", "unit": "g", "inPantry": true, "isMissing": false }
    ],
    "missingIngredients": ["Missing Item 1"],
    "pantryMatchPercentage": 90,
    "isAllAvailable": false,
    "substitutionTip": {
      "missingItem": "Heavy Cream",
      "recommendedSwap": "Greek Yogurt + Milk (1:1 ratio)",
      "swapReason": "Replicates creaminess with lower fat"
    },
    "instructions": [
      {
        "stepNumber": 1,
        "title": "Prep & Chop",
        "description": "Detailed clear instruction for this step.",
        "timerMinutes": 5,
        "timerLabel": "Prep Timer"
      }
    ]
  }
]
Output ONLY raw JSON.`;

    const response = await aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    const text = response.text ? response.text.trim() : '';
    const cleanJsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const recipes = JSON.parse(cleanJsonText);

    return {
      source: 'live_gemini',
      filterApplied: filter,
      sortByApplied: sortBy,
      recipes
    };
  } catch (err) {
    console.error('⚠️ [GeminiService] Recipe generation failed, falling back to mock dataset:', err.message);
    const recipes = getMockRecipes(ingredients, filter, sortBy);
    return {
      source: 'mock_fallback',
      filterApplied: filter,
      sortByApplied: sortBy,
      recipes,
      warning: err.message
    };
  }
}

/**
 * Find culinary substitutions for a missing ingredient
 */
export async function findSubstitutesWithAI(ingredientName, recipeContext = '') {
  if (!isLiveAIReady || !aiClient) {
    console.log(`🤖 [GeminiService] Finding substitution for "${ingredientName}" via culinary dictionary.`);
    const sub = getMockSubstitution(ingredientName);
    return {
      source: 'mock',
      ...sub
    };
  }

  try {
    const prompt = `You are Chef.ai culinary intelligence. Suggest 2-3 optimal kitchen substitutes for: "${ingredientName}"
Recipe Context: "${recipeContext || 'General cooking'}"

Return ONLY a JSON object formatted as:
{
  "target": "${ingredientName}",
  "alternatives": [
    {
      "name": "Alternative Name",
      "ratio": "1:1 replacement ratio instruction",
      "bestFor": "Types of dishes it works best in",
      "notes": "Flavor or cooking behavior notes",
      "dietary": ["Vegan", "Dairy-Free"]
    }
  ]
}
Output ONLY raw JSON.`;

    const response = await aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    const text = response.text ? response.text.trim() : '';
    const cleanJsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJsonText);

    return {
      source: 'live_gemini',
      ...result
    };
  } catch (err) {
    console.error('⚠️ [GeminiService] Substitution lookup failed, falling back to mock dictionary:', err.message);
    const sub = getMockSubstitution(ingredientName);
    return {
      source: 'mock_fallback',
      ...sub,
      warning: err.message
    };
  }
}

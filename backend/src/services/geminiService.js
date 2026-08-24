import { aiClient, isLiveAIReady, GEMINI_FALLBACK_MODELS } from '../config/gemini.js';
import { MOCK_PANTRY_ITEMS, getMockRecipes, getMockSubstitution } from './mockDataService.js';

/**
 * Helper to call Gemini models with fallback across multiple model tiers
 */
async function callGeminiWithFallback(generateOptions) {
  if (!isLiveAIReady || !aiClient) {
    throw new Error('Gemini API client not initialized or no key present');
  }

  let lastError = null;
  for (const modelName of GEMINI_FALLBACK_MODELS) {
    try {
      const response = await aiClient.models.generateContent({
        ...generateOptions,
        model: modelName
      });
      if (response && response.text) {
        return response;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[GeminiService] Model ${modelName} failed (${err.message}). Trying next fallback model...`);
    }
  }
  throw lastError || new Error('All Gemini model fallbacks failed');
}

/**
 * Helper to safely extract JSON from AI response text
 */
function extractJson(rawText) {
  if (!rawText) return null;
  let cleaned = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
  
  // Direct parse
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Array regex extraction
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch {}
    }
    // Object regex extraction
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        return JSON.parse(objMatch[0]);
      } catch {}
    }
    throw new Error(`Failed to parse AI JSON response: ${cleaned.substring(0, 100)}...`);
  }
}

/**
 * Scan an uploaded pantry image using Gemini Vision (or fallback to mock)
 * @param {string} imageBase64 - Base64 encoded image string
 * @param {string} mimeType - e.g. "image/jpeg" or "image/png"
 */
export async function scanPantryWithAI(imageBase64, mimeType = 'image/jpeg') {
  if (!isLiveAIReady || !aiClient) {
    console.log('🍲 [GeminiService] Live AI not configured. Serving curated pantry scan mock data.');
    return {
      source: 'mock',
      items: MOCK_PANTRY_ITEMS,
      detectedIngredients: MOCK_PANTRY_ITEMS.map(i => i.name),
      totalCount: MOCK_PANTRY_ITEMS.length,
      expiringSoonCount: MOCK_PANTRY_ITEMS.filter(i => i.freshness === 'expiring_soon' || i.freshness === 'expired').length
    };
  }

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are Chef.ai, an expert computer vision culinary assistant.
Analyze this kitchen, fridge, or pantry image carefully and identify all visible food items, produce, dairy, grains, meat, and spices.
Return a STRICT JSON array of objects with the following structure:
[
  {
    "id": "ing_1",
    "name": "Eggs",
    "quantity": "6 large",
    "category": "Dairy & Eggs",
    "freshness": "fresh",
    "daysLeft": 7
  }
]
Categories must be one of: "Produce", "Dairy & Eggs", "Spices & Oils", "Pantry Staples", "Bakery", "Meat & Seafood".
Freshness must be one of: "fresh", "expiring_soon", "shelf_stable".
Output ONLY valid JSON without markdown formatting.`;

    const response = await callGeminiWithFallback({
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
    const items = extractJson(text);

    return {
      source: 'live_gemini',
      items: Array.isArray(items) ? items : [items],
      detectedIngredients: Array.isArray(items) ? items.map(i => i.name) : [],
      totalCount: Array.isArray(items) ? items.length : 0,
      expiringSoonCount: Array.isArray(items) ? items.filter(i => i.freshness === 'expiring_soon' || i.freshness === 'expired').length : 0
    };
  } catch (err) {
    console.error('⚠️ [GeminiService] Vision scan error, using fallback dataset:', err.message);
    return {
      source: 'mock_fallback',
      items: MOCK_PANTRY_ITEMS,
      detectedIngredients: MOCK_PANTRY_ITEMS.map(i => i.name),
      totalCount: MOCK_PANTRY_ITEMS.length,
      expiringSoonCount: MOCK_PANTRY_ITEMS.filter(i => i.freshness === 'expiring_soon' || i.freshness === 'expired').length,
      warning: err.message
    };
  }
}

/**
 * Generate highly accurate recipe suggestions based on user ingredients and filters
 */
export async function generateRecipesWithAI(ingredients = [], filter = 'All', sortBy = 'Best Match', searchQuery = '') {
  if (!isLiveAIReady || !aiClient) {
    console.log('🍲 [GeminiService] Generating recipes via smart culinary engine (Local mode).');
    const recipes = getMockRecipes(ingredients, filter, sortBy, searchQuery);
    return {
      source: 'mock',
      filterApplied: filter,
      sortByApplied: sortBy,
      recipes
    };
  }

  try {
    const userIngredientsList = ingredients.length > 0 ? ingredients.join(', ') : 'Pantry staples';
    
    let focusDirective = '';
    if (searchQuery && searchQuery.trim()) {
      focusDirective = `The user specifically searched for / wants to cook: "${searchQuery.trim()}".
Generate 3 distinct, delicious variations of "${searchQuery.trim()}" (e.g. Classic style, Quick weeknight style, Chef Special style).
Utilize the user's ingredients (${userIngredientsList}) as the core basis and specify which other ingredients are needed.`;
    } else {
      focusDirective = `The user has provided these specific ingredients: ${userIngredientsList}.
Generate 3 distinct, creative, restaurant-quality recipes where these ingredients are the PRIMARY stars of the dishes.`;
    }

    const prompt = `You are Chef.ai, a Michelin-star culinary AI assistant.
${focusDirective}

Dietary/Speed Filter to apply: "${filter}"

STRICT ACCURACY RULES:
1. For every ingredient in the recipe's "ingredients" array:
   - If the ingredient matches or is part of the user's pantry list (${userIngredientsList}), set "inPantry": true, "isMissing": false.
   - If it is not in the user's list, set "inPantry": false, "isMissing": true and include its name in "missingIngredients".
2. Calculate "pantryMatchPercentage" accurately as Math.round((number of inPantry ingredients / total ingredients) * 100).
3. Provide realistic prepTimeMinutes, cookTimeMinutes, totalTimeMinutes, calories, and macros.
4. Provide 3-5 clear, numbered step-by-step cooking instructions with realistic timerMinutes for timed steps (e.g. boiling, baking, searing).
5. If there are missing ingredients, provide a smart culinary "substitutionTip".

Return ONLY a JSON array conforming strictly to this format without markdown fences:
[
  {
    "id": "rec_1",
    "title": "Exact Recipe Name",
    "description": "Appetizing 1-2 sentence culinary summary of the dish.",
    "cuisine": "Italian",
    "tags": ["Quick (<20m)", "High Protein"],
    "prepTimeMinutes": 5,
    "cookTimeMinutes": 15,
    "totalTimeMinutes": 20,
    "calories": 480,
    "macros": { "protein": "28g", "carbs": "45g", "fats": "16g", "fiber": "4g" },
    "difficulty": "Easy",
    "defaultServings": 2,
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    "ingredients": [
      { "name": "Exact Ingredient Name", "amount": "200", "unit": "g", "inPantry": true, "isMissing": false }
    ],
    "missingIngredients": [],
    "pantryMatchPercentage": 100,
    "isAllAvailable": true,
    "substitutionTip": null,
    "instructions": [
      {
        "stepNumber": 1,
        "title": "Prep Aromatics",
        "description": "Mince garlic and chop produce finely.",
        "timerMinutes": 3,
        "timerLabel": "Prep Timer"
      },
      {
        "stepNumber": 2,
        "title": "Sauté and Simmer",
        "description": "Heat pan with olive oil and sauté until golden.",
        "timerMinutes": 8,
        "timerLabel": "Sauté Timer"
      }
    ]
  }
]`;

    const response = await callGeminiWithFallback({
      contents: prompt
    });

    const text = response.text ? response.text.trim() : '';
    const recipes = extractJson(text);

    return {
      source: 'live_gemini',
      filterApplied: filter,
      sortByApplied: sortBy,
      searchQueryApplied: searchQuery,
      recipes: Array.isArray(recipes) ? recipes : [recipes]
    };
  } catch (err) {
    console.error('⚠️ [GeminiService] Live generation error, using smart synthesis fallback:', err.message);
    const recipes = getMockRecipes(ingredients, filter, sortBy, searchQuery);
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
    console.log(`🍲 [GeminiService] Finding substitution for "${ingredientName}" via culinary dictionary.`);
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
      "name": "Alternative Ingredient Name",
      "ratio": "1:1 replacement ratio instruction (e.g. 3/4 cup Greek Yogurt + 1/4 cup Milk)",
      "bestFor": "Sauces, curries, baking",
      "notes": "Culinary behavior and mouthfeel notes",
      "dietary": ["Vegetarian", "High Protein"]
    }
  ]
}
Output ONLY raw JSON without markdown formatting.`;

    const response = await callGeminiWithFallback({
      contents: prompt
    });

    const text = response.text ? response.text.trim() : '';
    const result = extractJson(text);

    return {
      source: 'live_gemini',
      ...result
    };
  } catch (err) {
    console.error('⚠️ [GeminiService] Substitution lookup error, using fallback dictionary:', err.message);
    const sub = getMockSubstitution(ingredientName);
    return {
      source: 'mock_fallback',
      ...sub,
      warning: err.message
    };
  }
}

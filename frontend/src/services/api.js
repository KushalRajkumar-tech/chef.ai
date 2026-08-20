const API_BASE_URL = '/api';

/**
 * Fetch wrapper with error handling and fallback logic.
 */
async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API Client] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Check Backend Health & Mode
  async checkHealth() {
    try {
      return await fetchApi('/health');
    } catch {
      return { status: 'offline', mode: 'mock-frontend', service: 'Chef.ai Standalone' };
    }
  },

  // Scan Pantry (Image or Text)
  async scanPantry(payload) {
    try {
      return await fetchApi('/pantry/scan', {
        method: 'POST',
        body: JSON.stringify(typeof payload === 'string' ? { text: payload } : payload),
      });
    } catch {
      // Fallback response if offline
      return {
        success: true,
        detectedIngredients: ['Eggs', 'Tomatoes', 'Garlic', 'Olive Oil', 'Parmesan'],
        confidence: 0.95,
        source: 'Frontend Fallback',
      };
    }
  },

  // Generate Recipes
  async generateRecipes(ingredients, dietaryRestrictions = [], mealType = 'Any') {
    try {
      return await fetchApi('/recipes/generate', {
        method: 'POST',
        body: JSON.stringify({ ingredients, dietaryRestrictions, mealType }),
      });
    } catch {
      // Fallback mock recipes if offline
      return {
        success: true,
        mode: 'mock',
        recipes: [
          {
            id: 'recipe-1',
            title: 'Creamy Garlic Parmesan Pasta',
            cuisine: 'Italian',
            prepTime: 20,
            calories: 520,
            matchPercentage: 95,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOtz5o2jWaPZxsZgbb0RNYuhF82KgRvCTR3bUz9w9blI29vypsoNWss5BJmdmsqR2idccG0zT1rEhhBkDi37aG8RfiUXHZbrLRoFbEF8jQKKGTQUsKxjMReREeJXrYeoHdRSdpQBhOioHQeJjp7dFlRwe8iED4jXHZqD3bl_eG92sO40MzEEjlc3rdHrUxJElFmhRQ_W2sY3fyc6E_zDwU-KJe478rYvuRInvZcnjTVxJVtzvtp2oqy8QKLXyorFnw8fdfNkSRzrc',
            ingredients: [
              { name: '200g Fettuccine', available: true },
              { name: '3 cloves minced garlic', available: true },
              { name: '50g grated parmesan', available: true },
              { name: '1 tbsp olive oil', available: true },
              { name: '1/2 cup heavy cream', available: false },
            ],
            instructions: [
              'Boil pasta in salted water until al dente.',
              'Sauté minced garlic in olive oil over medium heat until fragrant (approx. 2 mins).',
              'Reduce heat, stir in cream and grated parmesan until sauce thickens.',
              'Toss cooked pasta in garlic cream sauce, garnish with cracked black pepper and serve hot.'
            ],
            missingIngredients: ['Heavy Cream'],
            substitutions: [
              { original: 'Heavy Cream', substitute: 'Greek Yogurt + Milk', ratio: '1:1 ratio' }
            ],
            macros: { protein: '18g', carbs: '62g', fats: '24g' }
          },
          {
            id: 'recipe-2',
            title: 'Shakshuka with Warm Spices',
            cuisine: 'Middle Eastern',
            prepTime: 25,
            calories: 380,
            matchPercentage: 90,
            image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80',
            ingredients: [
              { name: '4 fresh eggs', available: true },
              { name: '4 ripe tomatoes (chopped)', available: true },
              { name: '2 cloves minced garlic', available: true },
              { name: '1 tbsp olive oil', available: true },
              { name: '1/2 tsp cumin & paprika', available: true }
            ],
            instructions: [
              'Heat olive oil in a skillet over medium heat.',
              'Add minced garlic and spices, cooking until fragrant.',
              'Add chopped tomatoes and simmer for 10 minutes until sauce thickens.',
              'Make small wells in sauce, crack eggs in, cover and cook for 5-7 minutes until whites are set.'
            ],
            missingIngredients: [],
            substitutions: [],
            macros: { protein: '22g', carbs: '19g', fats: '21g' }
          }
        ]
      };
    }
  },

  // Get AI Substitute
  async getSubstitute(ingredient, targetRecipe = 'General Recipe', pantryContext = []) {
    try {
      return await fetchApi('/recipes/substitute', {
        method: 'POST',
        body: JSON.stringify({ ingredient, targetRecipe, pantryContext }),
      });
    } catch {
      return {
        success: true,
        substitute: 'Greek Yogurt + Milk',
        ratio: '1:1 ratio',
        culinaryTip: 'Whisk 3/4 cup Greek yogurt with 1/4 cup milk to match heavy cream viscosity without adding excess fat.',
      };
    }
  }
};

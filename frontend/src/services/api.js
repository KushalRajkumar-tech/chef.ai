/**
 * Chef.ai Standalone Mock Client
 * All external network API/fetch requests have been removed/bypassed.
 * Backed by mockData.js for seamless client-side execution.
 */

import { mockRecipes, mockPantryItems, mockSubstitutions } from '../mockData';

export const api = {
  // Standalone Health Status
  async checkHealth() {
    return {
      status: 'ok',
      mode: 'standalone',
      service: 'Chef.ai Standalone Client'
    };
  },

  // Get Pantry Inventory
  async scanPantry() {
    return {
      success: true,
      source: 'mock',
      items: [...mockPantryItems],
      detectedIngredients: mockPantryItems.map((i) => i.name),
      totalCount: mockPantryItems.length,
      expiringSoonCount: mockPantryItems.filter((i) => i.freshness === 'expiring_soon' || i.daysLeft <= 2).length
    };
  },

  // Simulated Camera / Image Scan
  async scanPantryWithImage(file) {
    // Simulated instant recognition of ingredients
    return {
      success: true,
      source: 'mock-vision',
      detectedIngredients: ['Avocado', 'Lemons', 'Fresh Basil'],
      items: [
        { id: 'ing_scan_1', name: 'Avocado', quantity: '2 pcs', category: 'Produce', freshness: 'fresh', daysLeft: 4 },
        { id: 'ing_scan_2', name: 'Lemons', quantity: '3 pcs', category: 'Produce', freshness: 'fresh', daysLeft: 10 },
        { id: 'ing_scan_3', name: 'Fresh Basil', quantity: '1 bunch', category: 'Produce', freshness: 'expiring_soon', daysLeft: 2 }
      ]
    };
  },

  // Generate / Retrieve Recipes matching ingredients & filters
  async generateRecipes(ingredients = [], filter = 'all', sortBy = 'Best Match', searchQuery = '') {
    const pantryLower = ingredients.map((i) => (typeof i === 'string' ? i.toLowerCase() : i.name.toLowerCase()));

    // Dynamically calculate match score against active ingredients
    const processedRecipes = mockRecipes.map((recipe) => {
      let matchedCount = 0;
      const missing = [];

      const updatedIngredients = recipe.ingredients.map((ing) => {
        const ingName = typeof ing === 'string' ? ing : ing.name;
        const isMatched = pantryLower.some(
          (p) => ingName.toLowerCase().includes(p) || p.includes(ingName.toLowerCase())
        );

        if (isMatched) {
          matchedCount++;
          return { ...ing, inPantry: true, isMissing: false };
        } else {
          missing.push(ingName);
          return { ...ing, inPantry: false, isMissing: true };
        }
      });

      const totalIngs = recipe.ingredients.length;
      const matchPct = Math.round((matchedCount / totalIngs) * 100);

      return {
        ...recipe,
        ingredients: updatedIngredients,
        pantryMatchPercentage: matchPct,
        missingIngredients: missing,
        isAllAvailable: missing.length === 0
      };
    });

    // Apply Filter Pill
    let filtered = processedRecipes;
    if (filter && filter !== 'all' && filter !== 'All') {
      filtered = filtered.filter((r) =>
        r.tags?.some((t) => t.toLowerCase().includes(filter.toLowerCase()))
      );
    }

    // Apply Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.ingredients.some((ing) => (ing.name || ing).toLowerCase().includes(q))
      );
    }

    // Apply Sort By
    if (sortBy === 'Fastest' || sortBy === 'fastest') {
      filtered.sort((a, b) => a.totalTimeMinutes - b.totalTimeMinutes);
    } else if (sortBy === 'Lowest Calories' || sortBy === 'low-cal') {
      filtered.sort((a, b) => a.calories - b.calories);
    } else {
      // Default: Best Match
      filtered.sort((a, b) => b.pantryMatchPercentage - a.pantryMatchPercentage);
    }

    return {
      success: true,
      source: 'mock',
      recipes: filtered
    };
  },

  // Get AI Substitute from Mock Substitutions Database
  async getSubstitute(ingredient) {
    const matchedKey = Object.keys(mockSubstitutions).find(
      (k) => k.toLowerCase().includes(ingredient.toLowerCase()) || ingredient.toLowerCase().includes(k.toLowerCase())
    );

    const alternatives = matchedKey ? mockSubstitutions[matchedKey] : [
      {
        name: 'Olive Oil + Lemon Juice',
        ratio: '1:1 ratio substitute',
        bestFor: 'General seasoning & moisture balance',
        notes: 'Versatile pantry swap maintaining healthy fats and bright acidity.'
      }
    ];

    const primary = alternatives[0];

    return {
      success: true,
      target: ingredient,
      alternatives: alternatives,
      substitute: primary.name,
      ratio: primary.ratio,
      culinaryTip: primary.notes
    };
  }
};

/**
 * Chef.ai Mock Data & Smart Culinary Synthesis Engine
 * Provides rich, production-grade recipes and dynamically generates customized recipes for ANY ingredient input.
 */

export const MOCK_PANTRY_ITEMS = [
  { id: 'ing_1', name: 'Eggs', quantity: '6 large', category: 'Dairy & Eggs', freshness: 'fresh', daysLeft: 7 },
  { id: 'ing_2', name: 'Tomatoes', quantity: '4 medium', category: 'Produce', freshness: 'fresh', daysLeft: 4 },
  { id: 'ing_3', name: 'Garlic', quantity: '1 whole head', category: 'Produce', freshness: 'shelf_stable', daysLeft: 20 },
  { id: 'ing_4', name: 'Olive Oil', quantity: '500ml', category: 'Spices & Oils', freshness: 'shelf_stable', daysLeft: 180 },
  { id: 'ing_5', name: 'Parmesan Cheese', quantity: '150g block', category: 'Dairy & Eggs', freshness: 'fresh', daysLeft: 14 },
  { id: 'ing_6', name: 'Fettuccine Pasta', quantity: '400g box', category: 'Pantry Staples', freshness: 'shelf_stable', daysLeft: 300 },
  { id: 'ing_7', name: 'Greek Yogurt', quantity: '200g tub', category: 'Dairy & Eggs', freshness: 'expiring_soon', daysLeft: 1 },
  { id: 'ing_8', name: 'Fresh Spinach', quantity: '1 bag (250g)', category: 'Produce', freshness: 'expiring_soon', daysLeft: 2 },
  { id: 'ing_9', name: 'Heavy Cream', quantity: '100ml carton', category: 'Dairy & Eggs', freshness: 'expired', daysLeft: -1 },
  { id: 'ing_10', name: 'Onions', quantity: '3 red', category: 'Produce', freshness: 'fresh', daysLeft: 12 },
  { id: 'ing_11', name: 'Chili Flakes', quantity: '50g jar', category: 'Spices & Oils', freshness: 'shelf_stable', daysLeft: 365 },
  { id: 'ing_12', name: 'Fresh Basil', quantity: '1 bunch', category: 'Produce', freshness: 'expiring_soon', daysLeft: 2 }
];

export const MOCK_RECIPES_DATABASE = [
  {
    id: 'rec_garlic_parm_pasta',
    title: 'Creamy Garlic Parmesan Pasta',
    description: 'A luxurious 20-minute Italian classic featuring al dente fettuccine coated in an emulsified garlic parmesan sauce with warm olive oil and cracked black pepper.',
    cuisine: 'Italian',
    tags: ['Quick (<20m)', 'Vegetarian', 'Comfort Food', 'High Protein'],
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    calories: 520,
    macros: { protein: '24g', carbs: '65g', fats: '18g', fiber: '4g' },
    difficulty: 'Medium',
    defaultServings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281290?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Fettuccine Pasta', amount: '200', unit: 'g', inPantry: true },
      { name: 'Garlic', amount: '4', unit: 'cloves minced', inPantry: true },
      { name: 'Parmesan Cheese', amount: '60', unit: 'g freshly grated', inPantry: true },
      { name: 'Olive Oil', amount: '2', unit: 'tbsp', inPantry: true },
      { name: 'Heavy Cream', amount: '100', unit: 'ml', inPantry: false, isMissing: true },
      { name: 'Chili Flakes', amount: '1/2', unit: 'tsp', inPantry: true },
      { name: 'Fresh Basil', amount: '2', unit: 'tbsp chopped', inPantry: true }
    ],
    missingIngredients: ['Heavy Cream'],
    pantryMatchPercentage: 86,
    isAllAvailable: false,
    substitutionTip: {
      missingItem: 'Heavy Cream',
      recommendedSwap: 'Greek Yogurt + Milk (1:1 ratio) or 2 tbsp Butter with Starchy Pasta Water',
      swapReason: 'Emulsifies into a creamy sauce with identical mouthfeel and reduced saturated fat.'
    },
    instructions: [
      {
        stepNumber: 1,
        title: 'Boil Pasta to Al Dente',
        description: 'Bring a large pot of heavily salted water to a rolling boil. Drop fettuccine and cook for 9-10 minutes. Reserve 1/2 cup starchy pasta cooking water before draining.',
        timerMinutes: 10,
        timerLabel: 'Pasta Boiling Timer'
      },
      {
        stepNumber: 2,
        title: 'Infuse Garlic in Warm Olive Oil',
        description: 'In a wide skillet over medium-low heat, warm olive oil and add thinly sliced garlic along with chili flakes. Sauté gently for 2 minutes until fragrant and pale golden. Do not burn the garlic.',
        timerMinutes: 2,
        timerLabel: 'Garlic Sauté'
      },
      {
        stepNumber: 3,
        title: 'Emulsify Sauce & Toss',
        description: 'Add reserved hot pasta water and heavy cream (or substitution) to the skillet. Whisk in grated parmesan cheese vigorously over low heat to form a glossy emulsified sauce. Toss drained pasta until thoroughly glazed.',
        timerMinutes: 3,
        timerLabel: 'Emulsification & Coating'
      },
      {
        stepNumber: 4,
        title: 'Garnish & Serve',
        description: 'Plate immediately in warm bowls. Top with cracked black pepper, extra shaved parmesan, and fresh chopped basil ribbons.',
        timerMinutes: 0,
        timerLabel: 'Plating'
      }
    ]
  },
  {
    id: 'rec_mediterranean_shakshuka',
    title: 'Mediterranean Shakshuka with Poached Eggs',
    description: 'Vibrant poached eggs simmering in a spiced tomato, sweet pepper, and garlic reduction, garnished with fresh herbs and olive oil.',
    cuisine: 'Mediterranean',
    tags: ['Quick (<20m)', 'Vegetarian', 'High Protein', 'Budget-Friendly'],
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    calories: 380,
    macros: { protein: '22g', carbs: '28g', fats: '19g', fiber: '7g' },
    difficulty: 'Easy',
    defaultServings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Eggs', amount: '4', unit: 'large', inPantry: true },
      { name: 'Tomatoes', amount: '4', unit: 'ripe diced', inPantry: true },
      { name: 'Garlic', amount: '3', unit: 'cloves minced', inPantry: true },
      { name: 'Onions', amount: '1', unit: 'small diced', inPantry: true },
      { name: 'Olive Oil', amount: '2', unit: 'tbsp', inPantry: true },
      { name: 'Chili Flakes', amount: '1/2', unit: 'tsp', inPantry: true },
      { name: 'Fresh Basil', amount: '1', unit: 'handful', inPantry: true }
    ],
    missingIngredients: [],
    pantryMatchPercentage: 100,
    isAllAvailable: true,
    substitutionTip: null,
    instructions: [
      {
        stepNumber: 1,
        title: 'Sauté Aromatics',
        description: 'Heat olive oil in a medium skillet over medium heat. Sauté diced onions and minced garlic with chili flakes until softened and aromatic (about 4 minutes).',
        timerMinutes: 4,
        timerLabel: 'Onion & Garlic Soften'
      },
      {
        stepNumber: 2,
        title: 'Simmer Tomato Sauce',
        description: 'Add chopped tomatoes, a pinch of salt, and simmer uncovered until tomatoes break down into a thick, rustic sauce (about 6 minutes).',
        timerMinutes: 6,
        timerLabel: 'Tomato Reduction'
      },
      {
        stepNumber: 3,
        title: 'Poach Eggs in Wells',
        description: 'Use the back of a spoon to create 4 small wells in the sauce. Crack an egg into each well. Cover skillet with a lid and simmer gently on low until egg whites are set but yolks remain runny.',
        timerMinutes: 5,
        timerLabel: 'Covered Egg Poach'
      },
      {
        stepNumber: 4,
        title: 'Garnish with Basil & Olive Oil',
        description: 'Remove from heat, drizzle with extra virgin olive oil, and scatter fresh torn basil leaves across the top. Serve hot right from the skillet.',
        timerMinutes: 0,
        timerLabel: 'Ready to Serve'
      }
    ]
  },
  {
    id: 'rec_tomato_basil_omelette',
    title: 'Spicy Tomato Basil Soufflé Omelette',
    description: 'Ultra-fluffy French-style folded omelette stuffed with blistered cherry tomatoes, minced garlic, parmesan, and aromatic fresh basil.',
    cuisine: 'Fusion / Breakfast',
    tags: ['Quick (<20m)', 'High Protein', 'Vegetarian', 'Budget-Friendly'],
    prepTimeMinutes: 3,
    cookTimeMinutes: 7,
    totalTimeMinutes: 10,
    calories: 290,
    macros: { protein: '20g', carbs: '6g', fats: '21g', fiber: '2g' },
    difficulty: 'Easy',
    defaultServings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Eggs', amount: '3', unit: 'large', inPantry: true },
      { name: 'Tomatoes', amount: '1', unit: 'diced', inPantry: true },
      { name: 'Parmesan Cheese', amount: '25', unit: 'g grated', inPantry: true },
      { name: 'Olive Oil', amount: '1', unit: 'tbsp', inPantry: true },
      { name: 'Fresh Basil', amount: '4', unit: 'leaves sliced', inPantry: true },
      { name: 'Garlic', amount: '1', unit: 'clove finely grated', inPantry: true }
    ],
    missingIngredients: [],
    pantryMatchPercentage: 100,
    isAllAvailable: true,
    substitutionTip: null,
    instructions: [
      {
        stepNumber: 1,
        title: 'Whisk & Aerate Eggs',
        description: 'In a bowl, vigorously whisk eggs with a pinch of salt and black pepper until frothy and uniformly blended.',
        timerMinutes: 1,
        timerLabel: 'Whisking'
      },
      {
        stepNumber: 2,
        title: 'Cook on Low Heat',
        description: 'Heat olive oil in a non-stick pan over medium-low heat. Pour in eggs and gently swirl, pushing cooked edges toward the center.',
        timerMinutes: 3,
        timerLabel: 'Gentle Curds'
      },
      {
        stepNumber: 3,
        title: 'Fill and Fold',
        description: 'Scatter diced tomatoes, grated garlic, parmesan, and basil over one half of the omelette. Fold over, slide onto a plate, and top with extra parmesan.',
        timerMinutes: 2,
        timerLabel: 'Melting & Folding'
      }
    ]
  },
  {
    id: 'rec_butter_chicken_masala',
    title: 'Rich Butter Chicken Masala',
    description: 'Tender marinated chicken pieces simmered in a velvety, spiced aromatic tomato, onion, butter, and cream reduction.',
    cuisine: 'Indian',
    tags: ['High Protein', 'Comfort Food'],
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    totalTimeMinutes: 35,
    calories: 640,
    macros: { protein: '42g', carbs: '18g', fats: '45g', fiber: '3g' },
    difficulty: 'Medium',
    defaultServings: 3,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Chicken Breast', amount: '500', unit: 'g cubed', inPantry: false, isMissing: true },
      { name: 'Tomatoes', amount: '4', unit: 'pureed', inPantry: true },
      { name: 'Onions', amount: '2', unit: 'pureed', inPantry: true },
      { name: 'Garlic', amount: '5', unit: 'cloves paste', inPantry: true },
      { name: 'Heavy Cream', amount: '100', unit: 'ml', inPantry: false, isMissing: true },
      { name: 'Butter', amount: '40', unit: 'g', inPantry: false, isMissing: true },
      { name: 'Chili Flakes', amount: '1', unit: 'tsp', inPantry: true }
    ],
    missingIngredients: ['Chicken Breast', 'Heavy Cream', 'Butter'],
    pantryMatchPercentage: 58,
    isAllAvailable: false,
    substitutionTip: {
      missingItem: 'Chicken & Cream',
      recommendedSwap: 'Swap Chicken with Paneer or Boiled Eggs; Swap Cream with Greek Yogurt or Cashew Paste (1:1)',
      swapReason: 'Creates an authentic Egg Makhani / Paneer Butter Masala with zero grocery run needed.'
    },
    instructions: [
      {
        stepNumber: 1,
        title: 'Sauté Onion-Garlic Base',
        description: 'Sauté pureed onions and garlic paste until golden brown and oil separates from masala.',
        timerMinutes: 8,
        timerLabel: 'Masala Bhunai'
      },
      {
        stepNumber: 2,
        title: 'Simmer Spiced Tomato Gravy',
        description: 'Add tomato puree, chili flakes, and salt. Cook until thick and deep crimson.',
        timerMinutes: 10,
        timerLabel: 'Gravy Simmer'
      },
      {
        stepNumber: 3,
        title: 'Add Protein & Finish with Cream',
        description: 'Add protein (or hard-boiled eggs), stir in cream/yogurt alternative, and simmer for 6 minutes.',
        timerMinutes: 6,
        timerLabel: 'Final Simmer'
      }
    ]
  },
  {
    id: 'rec_garlic_herb_pasta_aglio',
    title: 'Garlic Herb Spaghetti Aglio e Olio',
    description: 'The definitive minimalist Roman comfort food: pasta tossed in golden garlic-infused extra virgin olive oil, chili flakes, and parsley.',
    cuisine: 'Italian',
    tags: ['Quick (<20m)', 'Vegetarian', 'Vegan', 'Budget-Friendly'],
    prepTimeMinutes: 3,
    cookTimeMinutes: 12,
    totalTimeMinutes: 15,
    calories: 440,
    macros: { protein: '14g', carbs: '62g', fats: '16g', fiber: '3g' },
    difficulty: 'Easy',
    defaultServings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      { name: 'Fettuccine Pasta', amount: '200', unit: 'g', inPantry: true },
      { name: 'Garlic', amount: '6', unit: 'cloves thinly sliced', inPantry: true },
      { name: 'Olive Oil', amount: '3', unit: 'tbsp', inPantry: true },
      { name: 'Chili Flakes', amount: '1', unit: 'tsp', inPantry: true },
      { name: 'Fresh Basil', amount: '2', unit: 'tbsp chopped', inPantry: true }
    ],
    missingIngredients: [],
    pantryMatchPercentage: 100,
    isAllAvailable: true,
    substitutionTip: null,
    instructions: [
      {
        stepNumber: 1,
        title: 'Boil Pasta',
        description: 'Cook pasta in salted water until 1 minute before al dente. Reserve 1/2 cup water.',
        timerMinutes: 9,
        timerLabel: 'Pasta Boiling'
      },
      {
        stepNumber: 2,
        title: 'Golden Garlic Oil',
        description: 'Gently fry sliced garlic in generous olive oil over low heat until pale golden.',
        timerMinutes: 3,
        timerLabel: 'Aglio Infusion'
      },
      {
        stepNumber: 3,
        title: 'Emulsify and Toss',
        description: 'Pour reserved water and chili into the oil to form a velvety sauce, toss pasta vigorously.',
        timerMinutes: 2,
        timerLabel: 'Glossy Finish'
      }
    ]
  }
];

/**
 * Dynamically synthesizes recipes if ingredients do not match existing static templates
 */
function synthesizeCustomRecipes(ingredients = [], searchQuery = '') {
  const mainIng = ingredients[0] || 'Fresh Pantry';
  const secIng = ingredients[1] || 'Aromatics';
  const thirdIng = ingredients[2] || 'Herbs';

  return [
    {
      id: `rec_synth_${Date.now()}_1`,
      title: searchQuery ? `Artisan ${searchQuery}` : `Golden Sautéed ${mainIng} & ${secIng} Skillet`,
      description: `A fragrant, customized chef creation combining fresh ${mainIng} and ${secIng} with garlic-infused olive oil and seasoned to perfection.`,
      cuisine: 'Fusion',
      tags: ['Quick (<20m)', 'High Protein', 'Custom Pantry Match'],
      prepTimeMinutes: 5,
      cookTimeMinutes: 15,
      totalTimeMinutes: 20,
      calories: 460,
      macros: { protein: '26g', carbs: '38g', fats: '16g', fiber: '5g' },
      difficulty: 'Easy',
      defaultServings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      ingredients: ingredients.map(ing => ({
        name: ing,
        amount: '100',
        unit: 'g',
        inPantry: true,
        isMissing: false
      })),
      missingIngredients: [],
      pantryMatchPercentage: 100,
      isAllAvailable: true,
      substitutionTip: null,
      instructions: [
        {
          stepNumber: 1,
          title: `Prep ${mainIng} and ${secIng}`,
          description: `Wash, chop, and season ${mainIng} and ${secIng} with a pinch of salt and cracked pepper.`,
          timerMinutes: 3,
          timerLabel: 'Prep & Season'
        },
        {
          stepNumber: 2,
          title: 'Sauté in Olive Oil',
          description: `Warm olive oil in a wide skillet over medium heat. Sauté ${mainIng} until golden and fragrant.`,
          timerMinutes: 7,
          timerLabel: 'Golden Sauté'
        },
        {
          stepNumber: 3,
          title: 'Combine & Simmer',
          description: `Add remaining ingredients (${ingredients.slice(1).join(', ') || 'seasonings'}), cover, and gently simmer.`,
          timerMinutes: 5,
          timerLabel: 'Simmer & Glaze'
        },
        {
          stepNumber: 4,
          title: 'Plate and Serve Hot',
          description: 'Garnish with fresh herbs, adjust salt to taste, and serve immediately in warm bowls.',
          timerMinutes: 0,
          timerLabel: 'Plating'
        }
      ]
    },
    {
      id: `rec_synth_${Date.now()}_2`,
      title: `Warm Mediterranean ${mainIng} Rice / Grain Bowl`,
      description: `Nutrient-packed warm bowl featuring seared ${mainIng}, caramelized ${secIng}, and ${thirdIng} with a zesty garlic yogurt dressing.`,
      cuisine: 'Mediterranean',
      tags: ['High Protein', 'Budget-Friendly'],
      prepTimeMinutes: 8,
      cookTimeMinutes: 14,
      totalTimeMinutes: 22,
      calories: 490,
      macros: { protein: '28g', carbs: '52g', fats: '14g', fiber: '6g' },
      difficulty: 'Easy',
      defaultServings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
      ingredients: ingredients.map(ing => ({
        name: ing,
        amount: '120',
        unit: 'g',
        inPantry: true,
        isMissing: false
      })),
      missingIngredients: [],
      pantryMatchPercentage: 100,
      isAllAvailable: true,
      substitutionTip: null,
      instructions: [
        {
          stepNumber: 1,
          title: 'Sear Main Ingredients',
          description: `Heat pan with olive oil, sear ${mainIng} on high heat for deep color.`,
          timerMinutes: 6,
          timerLabel: 'Sear'
        },
        {
          stepNumber: 2,
          title: 'Toss Grain & Greens',
          description: `Fold in ${secIng} and ${thirdIng} with warm grains or pasta.`,
          timerMinutes: 4,
          timerLabel: 'Warm Toss'
        }
      ]
    }
  ];
}

export const MOCK_SUBSTITUTIONS = {
  'heavy cream': {
    target: 'Heavy Cream',
    alternatives: [
      {
        name: 'Greek Yogurt + Milk',
        ratio: '1:1 replacement (3/4 cup Greek Yogurt + 1/4 cup Milk)',
        bestFor: 'Savory sauces, creamy pasta, curries',
        notes: 'Provides high protein, slight tangy richness, and prevents sauce separation over gentle heat.',
        dietary: ['Vegetarian', 'High Protein', 'Low Fat']
      },
      {
        name: 'Coconut Cream',
        ratio: '1:1 replacement',
        bestFor: 'Curries, Asian noodle soups, rich sauces',
        notes: '100% dairy-free with silky texture and subtle tropical sweetness.',
        dietary: ['Vegan', 'Dairy-Free']
      },
      {
        name: 'Milk + Melted Butter',
        ratio: '3/4 cup whole milk + 1/4 cup melted unsalted butter',
        bestFor: 'Baking and stovetop emulsified sauces',
        notes: 'Closest flavor profile match to heavy cream.',
        dietary: ['Vegetarian']
      }
    ]
  },
  'greek yogurt': {
    target: 'Greek Yogurt',
    alternatives: [
      {
        name: 'Plain Curd (Hung/Strained)',
        ratio: '1:1 replacement',
        bestFor: 'Marinades, dips, dressings, curries',
        notes: 'Strain through a sieve for 15 mins to achieve exact Greek yogurt consistency.',
        dietary: ['Vegetarian', 'High Protein']
      },
      {
        name: 'Coconut Yogurt',
        ratio: '1:1 replacement',
        bestFor: 'Breakfast bowls, dressings, baking',
        notes: 'Plant-based alternative rich in healthy fats.',
        dietary: ['Vegan', 'Dairy-Free']
      }
    ]
  },
  'parmesan cheese': {
    target: 'Parmesan Cheese',
    alternatives: [
      {
        name: 'Pecorino Romano',
        ratio: '1:1 replacement (reduce added salt by 10%)',
        bestFor: 'Carbonara, cacio e pepe, pasta toppings',
        notes: 'Sharper, saltier sheep milk cheese with intense umami depth.',
        dietary: ['Vegetarian']
      },
      {
        name: 'Nutritional Yeast',
        ratio: '1:1 replacement by volume',
        bestFor: 'Vegan pasta toppings, roasted veggies, soups',
        notes: 'Cheesy, nutty flavor packed with Vitamin B12 and zero dairy.',
        dietary: ['Vegan', 'Dairy-Free', 'Gluten-Free']
      }
    ]
  },
  'eggs': {
    target: 'Eggs',
    alternatives: [
      {
        name: 'Flaxseed Egg (Baking / Binding)',
        ratio: '1 egg = 1 tbsp ground flaxseed + 3 tbsp warm water (rest 5 min)',
        bestFor: 'Pancakes, baking, binding veggie patties',
        notes: 'High in Omega-3 fiber with gelatinous binding qualities.',
        dietary: ['Vegan', 'High Fiber']
      }
    ]
  }
};

/**
 * Filter and rank mock recipes based on pantry items and requested criteria
 */
export function getMockRecipes(ingredients = [], filter = 'All', sortBy = 'Best Match', searchQuery = '') {
  const normalizedIngredients = (ingredients || []).map(i => i.toLowerCase().trim());

  let recipes = MOCK_RECIPES_DATABASE.map(rec => {
    if (normalizedIngredients.length > 0) {
      const totalRecIngs = rec.ingredients.length;
      let matchedCount = 0;
      const updatedIngredients = rec.ingredients.map(ing => {
        const hasIt = normalizedIngredients.some(p => ing.name.toLowerCase().includes(p) || p.includes(ing.name.toLowerCase()));
        if (hasIt) matchedCount++;
        return { ...ing, inPantry: hasIt, isMissing: !hasIt };
      });
      const missing = updatedIngredients.filter(i => i.isMissing).map(i => i.name);
      const matchPct = Math.round((matchedCount / totalRecIngs) * 100);

      return {
        ...rec,
        ingredients: updatedIngredients,
        missingIngredients: missing,
        pantryMatchPercentage: matchPct,
        isAllAvailable: missing.length === 0
      };
    }
    return rec;
  });

  // If user provided custom ingredients that don't match the standard database, synthesize customized dishes!
  const anyGoodMatch = recipes.some(r => r.pantryMatchPercentage >= 40);
  if (!anyGoodMatch && normalizedIngredients.length > 0) {
    const custom = synthesizeCustomRecipes(ingredients, searchQuery);
    recipes = [...custom, ...recipes];
  }

  // Search Query filter
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    const matchedSearch = recipes.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.cuisine.toLowerCase().includes(q) ||
      r.ingredients.some(ing => ing.name.toLowerCase().includes(q))
    );
    if (matchedSearch.length > 0) {
      recipes = matchedSearch;
    } else {
      // synthesize specific dish
      recipes = synthesizeCustomRecipes(ingredients, searchQuery);
    }
  }

  // Apply dietary / time filter
  if (filter && filter !== 'All' && filter !== 'all') {
    recipes = recipes.filter(r => {
      if (filter === 'Quick (<20m)') return r.totalTimeMinutes <= 20;
      if (filter === 'High Protein') return r.tags.includes('High Protein');
      if (filter === 'Vegetarian') return r.tags.includes('Vegetarian');
      if (filter === 'Vegan') return r.tags.includes('Vegan');
      if (filter === 'Budget-Friendly') return r.tags.includes('Budget-Friendly');
      return r.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()));
    });
  }

  // Apply sorting
  if (sortBy === 'Fastest') {
    recipes.sort((a, b) => a.totalTimeMinutes - b.totalTimeMinutes);
  } else if (sortBy === 'Lowest Calories') {
    recipes.sort((a, b) => a.calories - b.calories);
  } else if (sortBy === 'Highest Rated' || sortBy === 'Best Match') {
    recipes.sort((a, b) => b.pantryMatchPercentage - a.pantryMatchPercentage);
  }

  return recipes;
}

/**
 * Find smart substitution for any ingredient
 */
export function getMockSubstitution(ingredientName) {
  if (!ingredientName) return null;
  const key = ingredientName.toLowerCase().trim();

  for (const [k, v] of Object.entries(MOCK_SUBSTITUTIONS)) {
    if (key.includes(k) || k.includes(key)) {
      return v;
    }
  }

  return {
    target: ingredientName,
    alternatives: [
      {
        name: `Nutritional / Culinary Swap for ${ingredientName}`,
        ratio: '1:1 replacement',
        bestFor: 'General cooking, boiling, or baking',
        notes: `Smart AI culinary estimate for ${ingredientName}. Adjust seasoning to taste.`,
        dietary: ['Vegetarian', 'Flexible']
      }
    ]
  };
}

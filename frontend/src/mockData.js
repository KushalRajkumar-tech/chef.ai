/**
 * Chef.ai Mock Dataset
 * Standalone mock data for recipes, pantry items, and ingredient substitutions.
 */

export const mockRecipes = [
  {
    id: 'rec_1',
    title: 'Creamy Garlic Parmesan Fettuccine',
    description: 'Silky skillet pasta tossed with golden sautéed garlic, emulsified heavy cream, and aged parmesan cheese.',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281290?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Italian',
    difficulty: 'Easy',
    prepTime: 5,
    cookTime: 15,
    totalTimeMinutes: 20,
    calories: 540,
    defaultServings: 2,
    macros: {
      protein: '18g',
      carbs: '62g',
      fats: '24g'
    },
    tags: ['Quick (<20m)', 'Vegetarian', 'Budget-Friendly'],
    pantryMatchPercentage: 100,
    missingIngredients: [],
    ingredients: [
      { name: 'Fettuccine Pasta', amount: '200', unit: 'g', inPantry: true },
      { name: 'Garlic', amount: '4', unit: 'cloves', inPantry: true },
      { name: 'Heavy Cream', amount: '150', unit: 'ml', inPantry: true, isMissing: false },
      { name: 'Parmesan Cheese', amount: '60', unit: 'g', inPantry: true },
      { name: 'Butter', amount: '30', unit: 'g', inPantry: true },
      { name: 'Olive Oil', amount: '1', unit: 'tbsp', inPantry: true },
      { name: 'Black Pepper', amount: '1', unit: 'tsp', inPantry: true },
      { name: 'Fresh Basil', amount: '8', unit: 'leaves', inPantry: true }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Boil Fettuccine',
        description: 'Bring a pot of salted water to a rolling boil. Drop pasta and cook for 8 minutes until al dente. Reserve 1/2 cup pasta water before draining.',
        timerMinutes: 8
      },
      {
        stepNumber: 2,
        title: 'Sauté Minced Garlic',
        description: 'Melt butter with olive oil in a wide skillet over medium heat. Sauté thinly sliced garlic for 2 minutes until fragrant and lightly golden.',
        timerMinutes: 2
      },
      {
        stepNumber: 3,
        title: 'Simmer Cream & Parmesan',
        description: 'Pour in heavy cream and gently simmer. Remove from high heat and vigorously whisk in grated parmesan cheese until silky and smooth.',
        timerMinutes: 3
      },
      {
        stepNumber: 4,
        title: 'Toss & Garnish',
        description: 'Add drained pasta to the skillet with a splash of reserved pasta water. Toss vigorously until coated. Garnish with cracked black pepper and fresh basil.',
        timerMinutes: 1
      }
    ]
  },
  {
    id: 'rec_2',
    title: 'Rustic Mediterranean Shakshuka',
    description: 'Gently poached eggs simmered in a spiced reduction of crushed tomatoes, onions, garlic, and fresh herbs.',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Mediterranean',
    difficulty: 'Easy',
    prepTime: 8,
    cookTime: 18,
    totalTimeMinutes: 26,
    calories: 380,
    defaultServings: 2,
    macros: {
      protein: '22g',
      carbs: '24g',
      fats: '19g'
    },
    tags: ['High Protein', 'Vegetarian', 'Budget-Friendly'],
    pantryMatchPercentage: 100,
    missingIngredients: [],
    ingredients: [
      { name: 'Eggs', amount: '4', unit: 'large', inPantry: true },
      { name: 'Tomatoes', amount: '4', unit: 'medium', inPantry: true },
      { name: 'Garlic', amount: '3', unit: 'cloves', inPantry: true },
      { name: 'Olive Oil', amount: '2', unit: 'tbsp', inPantry: true },
      { name: 'Black Pepper', amount: '1', unit: 'tsp', inPantry: true },
      { name: 'Fresh Basil', amount: '6', unit: 'leaves', inPantry: true }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Sauté Aromatics',
        description: 'Heat olive oil in a deep skillet over medium heat. Sauté minced garlic and crushed pepper until fragrant.',
        timerMinutes: 3
      },
      {
        stepNumber: 2,
        title: 'Simmer Tomato Sauce',
        description: 'Add diced ripe tomatoes and season to taste. Cover and simmer on low heat until tomatoes break down into a thick ragù.',
        timerMinutes: 8
      },
      {
        stepNumber: 3,
        title: 'Poach Eggs',
        description: 'Create small wells in the tomato sauce and crack eggs directly in. Cover with a lid and cook on low heat until whites are set and yolks remain runny.',
        timerMinutes: 5
      },
      {
        stepNumber: 4,
        title: 'Serve Skillet',
        description: 'Scatter fresh basil leaves over the skillet and finish with coarse black pepper. Serve hot with crusty bread.',
        timerMinutes: 1
      }
    ]
  },
  {
    id: 'rec_3',
    title: 'Pan-Seared Garlic Herb Butter Salmon',
    description: 'Crispy-skin salmon fillets seared to perfection and basted with foaming garlic-herb butter and citrus.',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Modern American',
    difficulty: 'Medium',
    prepTime: 5,
    cookTime: 12,
    totalTimeMinutes: 17,
    calories: 520,
    defaultServings: 2,
    macros: {
      protein: '42g',
      carbs: '4g',
      fats: '36g'
    },
    tags: ['Quick (<20m)', 'High Protein'],
    pantryMatchPercentage: 85,
    missingIngredients: ['Salmon Fillets'],
    ingredients: [
      { name: 'Salmon Fillets', amount: '2', unit: 'fillets', inPantry: false, isMissing: true },
      { name: 'Butter', amount: '35', unit: 'g', inPantry: true },
      { name: 'Garlic', amount: '4', unit: 'cloves', inPantry: true },
      { name: 'Olive Oil', amount: '1', unit: 'tbsp', inPantry: true },
      { name: 'Fresh Basil', amount: '6', unit: 'leaves', inPantry: true },
      { name: 'Black Pepper', amount: '1', unit: 'tsp', inPantry: true }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Prep Salmon',
        description: 'Pat salmon fillets thoroughly dry with paper towels. Season generously with salt and coarse black pepper.',
        timerMinutes: 2
      },
      {
        stepNumber: 2,
        title: 'Crisp Skin',
        description: 'Heat olive oil in a skillet over medium-high heat. Place salmon skin-side down and press gently. Cook undisturbed until skin is crispy.',
        timerMinutes: 5
      },
      {
        stepNumber: 3,
        title: 'Baste with Garlic Butter',
        description: 'Flip salmon, reduce heat, add butter and crushed garlic cloves. Tilt the skillet and continuously spoon foaming butter over fillets.',
        timerMinutes: 4
      },
      {
        stepNumber: 4,
        title: 'Rest & Plate',
        description: 'Transfer salmon to plates, spoon pan juices over top, and let rest for 2 minutes before serving.',
        timerMinutes: 2
      }
    ]
  },
  {
    id: 'rec_4',
    title: 'Artisan Skillet Margherita Flatbread',
    description: 'Crispy stovetop flatbread topped with fragrant garlic oil, bubbly melted mozzarella, and fresh garden tomatoes.',
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Italian',
    difficulty: 'Easy',
    prepTime: 5,
    cookTime: 10,
    totalTimeMinutes: 15,
    calories: 460,
    defaultServings: 2,
    macros: {
      protein: '20g',
      carbs: '48g',
      fats: '18g'
    },
    tags: ['Quick (<20m)', 'Vegetarian'],
    pantryMatchPercentage: 85,
    missingIngredients: ['Flatbread Dough'],
    ingredients: [
      { name: 'Flatbread Dough', amount: '2', unit: 'rounds', inPantry: false, isMissing: true },
      { name: 'Tomatoes', amount: '2', unit: 'medium', inPantry: true },
      { name: 'Parmesan Cheese', amount: '40', unit: 'g', inPantry: true },
      { name: 'Garlic', amount: '2', unit: 'cloves', inPantry: true },
      { name: 'Olive Oil', amount: '2', unit: 'tbsp', inPantry: true },
      { name: 'Fresh Basil', amount: '8', unit: 'leaves', inPantry: true }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Prepare Garlic Oil',
        description: 'Whisk olive oil with minced garlic, a pinch of salt, and freshly ground black pepper.',
        timerMinutes: 1
      },
      {
        stepNumber: 2,
        title: 'Sear Dough Base',
        description: 'Heat a dry skillet over medium-high heat. Place flatbread and cook until blistered bubbles appear on bottom.',
        timerMinutes: 3
      },
      {
        stepNumber: 3,
        title: 'Top & Melt',
        description: 'Flip flatbread, brush with garlic oil, arrange sliced tomatoes and cheese. Cover pan to melt cheese completely.',
        timerMinutes: 4
      },
      {
        stepNumber: 4,
        title: 'Slice & Garnish',
        description: 'Remove from heat, scatter fresh basil leaves, drizzle with olive oil, slice and enjoy.',
        timerMinutes: 1
      }
    ]
  },
  {
    id: 'rec_5',
    title: 'Crispy Golden Tofu & Broccoli Bowl',
    description: 'Wok-crisped high-protein tofu cubes tossed with tender broccoli florets, garlic, and savory seasoning.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Asian Fusion',
    difficulty: 'Easy',
    prepTime: 8,
    cookTime: 12,
    totalTimeMinutes: 20,
    calories: 410,
    defaultServings: 2,
    macros: {
      protein: '26g',
      carbs: '22g',
      fats: '21g'
    },
    tags: ['Quick (<20m)', 'High Protein', 'Vegan', 'Vegetarian'],
    pantryMatchPercentage: 90,
    missingIngredients: ['Firm Tofu'],
    ingredients: [
      { name: 'Firm Tofu', amount: '300', unit: 'g', inPantry: false, isMissing: true },
      { name: 'Broccoli', amount: '1', unit: 'head', inPantry: true },
      { name: 'Rice', amount: '150', unit: 'g', inPantry: true },
      { name: 'Garlic', amount: '3', unit: 'cloves', inPantry: true },
      { name: 'Olive Oil', amount: '2', unit: 'tbsp', inPantry: true },
      { name: 'Black Pepper', amount: '1', unit: 'tsp', inPantry: true }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Press & Cube Tofu',
        description: 'Press excess moisture from tofu using paper towels. Cut into 1-inch bite-sized cubes.',
        timerMinutes: 2
      },
      {
        stepNumber: 2,
        title: 'Sear Tofu to Golden Crisp',
        description: 'Heat olive oil in skillet. Sear tofu cubes until each side is golden brown and crunchy.',
        timerMinutes: 6
      },
      {
        stepNumber: 3,
        title: 'Sauté Broccoli & Garlic',
        description: 'Toss in chopped broccoli florets and minced garlic. Stir-fry vigorously for 3 minutes until broccoli is vibrant green.',
        timerMinutes: 3
      },
      {
        stepNumber: 4,
        title: 'Assemble Bowl',
        description: 'Serve crispy tofu and sautéed broccoli over steamed rice with cracked black pepper.',
        timerMinutes: 1
      }
    ]
  },
  {
    id: 'rec_6',
    title: 'Tuscan Pan-Roasted Garlic Chicken',
    description: 'Juicy chicken breast cutlets simmered in a fragrant garlic-herb olive oil reduction with sweet blistered tomatoes.',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    cuisine: 'Mediterranean',
    difficulty: 'Easy',
    prepTime: 7,
    cookTime: 15,
    totalTimeMinutes: 22,
    calories: 490,
    defaultServings: 2,
    macros: {
      protein: '44g',
      carbs: '8g',
      fats: '26g'
    },
    tags: ['Quick (<20m)', 'High Protein', 'Budget-Friendly'],
    pantryMatchPercentage: 100,
    missingIngredients: [],
    ingredients: [
      { name: 'Chicken Breast', amount: '400', unit: 'g', inPantry: true },
      { name: 'Garlic', amount: '4', unit: 'cloves', inPantry: true },
      { name: 'Tomatoes', amount: '3', unit: 'medium', inPantry: true },
      { name: 'Olive Oil', amount: '2', unit: 'tbsp', inPantry: true },
      { name: 'Butter', amount: '20', unit: 'g', inPantry: true },
      { name: 'Fresh Basil', amount: '8', unit: 'leaves', inPantry: true },
      { name: 'Black Pepper', amount: '1', unit: 'tsp', inPantry: true }
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Sear Chicken Cutlets',
        description: 'Season chicken with salt and black pepper. Sear in olive oil over medium-high heat for 5 minutes per side until golden.',
        timerMinutes: 5
      },
      {
        stepNumber: 2,
        title: 'Blister Garlic & Tomatoes',
        description: 'Add butter, crushed garlic, and halved tomatoes around the chicken in the skillet. Sauté until tomatoes soften.',
        timerMinutes: 4
      },
      {
        stepNumber: 3,
        title: 'Simmer Pan Sauce',
        description: 'Cover pan and simmer for 4 minutes until chicken is cooked through and pan sauce is aromatic.',
        timerMinutes: 4
      },
      {
        stepNumber: 4,
        title: 'Garnish & Plate',
        description: 'Spoon blistered tomato garlic sauce over sliced chicken breast and garnish with fresh basil.',
        timerMinutes: 1
      }
    ]
  }
];

export const mockPantryItems = [
  { id: 'ing_1', name: 'Chicken Breast', quantity: '400g', category: 'Pantry Staples', freshness: 'fresh', daysLeft: 4 },
  { id: 'ing_2', name: 'Rice', quantity: '500g', category: 'Pantry Staples', freshness: 'shelf_stable', daysLeft: 180 },
  { id: 'ing_3', name: 'Broccoli', quantity: '1 head', category: 'Produce', freshness: 'fresh', daysLeft: 3 },
  { id: 'ing_4', name: 'Garlic', quantity: '1 whole head', category: 'Produce', freshness: 'shelf_stable', daysLeft: 20 },
  { id: 'ing_5', name: 'Olive Oil', quantity: '500ml', category: 'Spices & Oils', freshness: 'shelf_stable', daysLeft: 180 },
  { id: 'ing_6', name: 'Eggs', quantity: '6 large', category: 'Dairy & Eggs', freshness: 'fresh', daysLeft: 6 },
  { id: 'ing_7', name: 'Tomatoes', quantity: '4 medium', category: 'Produce', freshness: 'fresh', daysLeft: 2 },
  { id: 'ing_8', name: 'Heavy Cream', quantity: '200ml', category: 'Dairy & Eggs', freshness: 'expiring_soon', daysLeft: 1 },
  { id: 'ing_9', name: 'Parmesan Cheese', quantity: '150g', category: 'Dairy & Eggs', freshness: 'fresh', daysLeft: 14 },
  { id: 'ing_10', name: 'Butter', quantity: '200g', category: 'Dairy & Eggs', freshness: 'fresh', daysLeft: 12 },
  { id: 'ing_11', name: 'Fettuccine Pasta', quantity: '400g', category: 'Pantry Staples', freshness: 'shelf_stable', daysLeft: 120 },
  { id: 'ing_12', name: 'Fresh Basil', quantity: '1 bunch', category: 'Produce', freshness: 'expiring_soon', daysLeft: 2 }
];

export const mockSubstitutions = {
  'Heavy Cream': [
    {
      name: 'Greek Yogurt + Milk',
      ratio: '1:1 ratio (3/4 cup Greek Yogurt + 1/4 cup Milk)',
      bestFor: 'Savory sauces, creamy pasta',
      notes: 'Whisk 3/4 cup Greek yogurt with 1/4 cup milk to match heavy cream viscosity without excess fat.'
    },
    {
      name: 'Coconut Milk + Butter',
      ratio: '1:1 replacement',
      bestFor: 'Curries, rich soups, velvety sauces',
      notes: 'Gives rich creamy mouthfeel with a subtle silky finish. Dairy-free friendly.'
    }
  ],
  'Parmesan Cheese': [
    {
      name: 'Pecorino Romano / Aged Cheddar',
      ratio: '1:1 grated',
      bestFor: 'Pasta dishes, gratins, risottos',
      notes: 'Offers high savory umami and sharp nutty depth.'
    },
    {
      name: 'Nutritional Yeast + Pinch of Salt',
      ratio: '1/2 cup yeast for 1/2 cup parmesan',
      bestFor: 'Vegan cooking, pestos, salads',
      notes: 'Adds savory, cheesy notes with zero dairy.'
    }
  ],
  'Salmon Fillets': [
    {
      name: 'Chicken Breast Cutlets',
      ratio: '1:1 protein swap',
      bestFor: 'Skillet searing with garlic herb butter',
      notes: 'Absorbs the garlic butter pan sauce wonderfully.'
    },
    {
      name: 'Extra Firm Tofu Steaks',
      ratio: '1:1 protein swap',
      bestFor: 'Pan-searing and basting',
      notes: 'High protein plant-based swap that crisps nicely in olive oil.'
    }
  ],
  'Flatbread Dough': [
    {
      name: 'Pita Bread / Flour Tortillas',
      ratio: '1:1 skillet base',
      bestFor: 'Quick 5-minute stovetop pizzas',
      notes: 'Crisps quickly in a hot skillet for ultra-crispy artisan base.'
    }
  ],
  'Firm Tofu': [
    {
      name: 'Boiled Eggs / Paneer / Chickpeas',
      ratio: '1:1 protein swap',
      bestFor: 'Stir-fries and grain bowls',
      notes: 'Provides high protein yield and hearty texture.'
    }
  ]
};

// Expose on global window object as well for direct HTML script tag compatibility
if (typeof window !== 'undefined') {
  window.mockRecipes = mockRecipes;
  window.mockPantryItems = mockPantryItems;
  window.mockSubstitutions = mockSubstitutions;
}

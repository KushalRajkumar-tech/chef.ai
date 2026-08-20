import React, { useState, useEffect } from 'react';
import PantryScanner from './components/PantryScanner';
import RecipeFeed from './components/RecipeFeed';
import RecipeModal from './components/RecipeModal';
import SubstitutionDrawer from './components/SubstitutionDrawer';
import { api } from './services/api';

export default function App() {
  const [ingredients, setIngredients] = useState(['Eggs', 'Tomatoes', 'Garlic', 'Olive Oil', 'Parmesan']);
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'feed'
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [missingIngredientForSwap, setMissingIngredientForSwap] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendMode, setBackendMode] = useState('connecting');

  useEffect(() => {
    async function init() {
      const health = await api.checkHealth();
      setBackendMode(health.mode || 'offline');
      fetchInitialRecipes(ingredients);
    }
    init();
  }, []);

  const fetchInitialRecipes = async (ingList) => {
    setIsGenerating(true);
    try {
      const res = await api.generateRecipes(ingList);
      if (res && res.recipes) {
        setRecipes(res.recipes);
      }
    } catch (err) {
      console.warn('Backend fetch failed, using fallback recipes:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddIngredient = (item) => {
    if (!ingredients.includes(item)) {
      const updated = [...ingredients, item];
      setIngredients(updated);
    }
  };

  const handleRemoveIngredient = (item) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const handleScanPantry = async () => {
    setIsScanning(true);
    try {
      const res = await api.scanPantry('Simulated Pantry Camera Scan');
      if (res && res.detectedIngredients) {
        setIngredients((prev) => Array.from(new Set([...prev, ...res.detectedIngredients])));
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateRecipes = () => {
    fetchInitialRecipes(ingredients);
    setActiveTab('feed');
  };

  const handleOpenSubstituteDrawer = (ingredientName) => {
    setMissingIngredientForSwap(ingredientName || 'Heavy Cream');
    setIsDrawerOpen(true);
  };

  const handleApplySwap = (original, substitute) => {
    if (!selectedRecipe) return;
    const updatedIngredients = selectedRecipe.ingredients?.map((ing) => {
      const name = typeof ing === 'string' ? ing : ing.name;
      if (name.toLowerCase().includes(original.toLowerCase())) {
        return { name: `${substitute} (Swapped from ${original})`, available: true };
      }
      return ing;
    });

    const updatedMissing = selectedRecipe.missingIngredients?.filter(
      (m) => !m.toLowerCase().includes(original.toLowerCase())
    );

    setSelectedRecipe({
      ...selectedRecipe,
      ingredients: updatedIngredients,
      missingIngredients: updatedMissing,
    });
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col pt-16 pb-[88px] md:pb-0">
      {/* TopAppBar from Stitch JSON */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-secondary/10 shadow-sm flex justify-between items-center h-16 px-gutter max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('hub')}>
          <img
            alt="Chef.ai Logo"
            className="h-8 w-8 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGGS7fY_LdaaG52oA99rnd_YjgEMLqkFn4PvTg0NiZ_4RFHA6p4bk_FhEBbSQ57mApZtcmYIiOyOIV57ymRwfIlA7je07pxwPXdKGBAaqInGrz-vll67iFt9dqZ6sBe6asLM4M7kIxeRh5ZM0AikK7nOpcVhwHDBhmSXGPiva8v_oPpXBhIpmf5VsZd9ybnyMkPEwuRLOq49BFJbSy2VsyD8XWJ2EtuemwSSbGEuPKTCuq2u2_xWLY1PdZDezZTQZMame2Ke1_ApM"
          />
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">
            Chef.ai
          </span>
        </div>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab('hub')}
            className={`font-label-md text-label-md transition-colors flex items-center gap-2 py-4 ${
              activeTab === 'hub'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'hub' ? "'FILL' 1" : "'FILL' 0" }}>
              inventory_2
            </span>
            Hub &amp; Pantry
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`font-label-md text-label-md transition-colors flex items-center gap-2 py-4 ${
              activeTab === 'feed'
                ? 'text-primary border-b-2 border-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'feed' ? "'FILL' 1" : "'FILL' 0" }}>
              explore
            </span>
            Discover
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={handleScanPantry}
            className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-sm text-label-sm shadow-[0_0_20px_rgba(255,191,0,0.15)] active:scale-95 duration-200 transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '16px' }}>
              barcode_scanner
            </span>
            {isScanning ? 'Scanning...' : 'Scan Pantry'}
          </button>
          
          <div
            onClick={() => setIsDrawerOpen(true)}
            className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-outline/20 cursor-pointer hover:border-primary transition-colors"
            title="Open AI Substitutions Drawer"
          >
            <img
              className="w-full h-full object-cover"
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpCbgE35yrcsUKbNcpWdCmLzg7tOtcR8o0iUtlgg0wSpHr66Sro7muwdP-C0xzAEzSYwPiaFWQWGJQ4r1rn_ZDsUhqegRHV6FHghNT1zBL3wre6TkRcQ5CRb6wqkS9gmJYD6VV8c4LSQ1DTD8t4RYUCRkTkTlaFC14D0U3wI45JlRHduaI54GrGdHNboXukmtCsNFR79wHVG7VbMyCzsMEjAu8Vu_0sdkwIRb6MYv1PQr5JeF1Y0Cdp0tEHjHgn9C5btl719D07mk"
            />
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-gutter py-stack-md flex flex-col gap-stack-md">
        {activeTab === 'hub' ? (
          <PantryScanner
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onScanClick={handleScanPantry}
            onGenerateRecipes={handleGenerateRecipes}
            isScanning={isScanning}
            isGenerating={isGenerating}
            activeFilter={activeFilter}
            onSelectFilter={(f) => {
              setActiveFilter(f);
              setActiveTab('feed');
            }}
          />
        ) : (
          <RecipeFeed
            recipes={recipes}
            onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
          />
        )}
      </main>

      {/* Cook-Along Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onOpenSubstituteDrawer={handleOpenSubstituteDrawer}
        />
      )}

      {/* AI Substitutions Bottom Drawer */}
      <SubstitutionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        missingIngredient={missingIngredientForSwap}
        onApplySwap={handleApplySwap}
      />

      {/* BottomNavBar from Stitch JSON */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container dark:bg-surface-container shadow-[0_-4px_40px_rgba(0,0,0,0.25)] flex justify-around items-center px-4 py-3 pb-safe">
        <button
          onClick={() => setActiveTab('hub')}
          className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 ${
            activeTab === 'hub' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'hub' ? "'FILL' 1" : "'FILL' 0" }}>
            home
          </span>
          <span className="font-label-sm text-label-sm mt-1">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center p-2 transition-all active:scale-90 ${
            activeTab === 'feed' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'feed' ? "'FILL' 1" : "'FILL' 0" }}>
            search
          </span>
          <span className="font-label-sm text-label-sm mt-1">Discovery</span>
        </button>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-transform shadow-[0_0_15px_rgba(255,191,0,0.2)]"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            inventory_2
          </span>
          <span className="font-label-sm text-label-sm mt-1">Pantry</span>
        </button>
      </nav>
    </div>
  );
}

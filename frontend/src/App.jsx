import React, { useState, useEffect } from 'react';
import PantryScanner from './components/PantryScanner';
import RecipeFeed from './components/RecipeFeed';
import RecipeModal from './components/RecipeModal';
import SubstitutionDrawer from './components/SubstitutionDrawer';
import { api } from './services/api';

export default function App() {
  const [ingredients, setIngredients] = useState(['Chicken Breast', 'Rice', 'Broccoli', 'Garlic', 'Olive Oil']);
  const [pantryItems, setPantryItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('hub'); // 'hub' | 'feed'
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [missingIngredientForSwap, setMissingIngredientForSwap] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendMode, setBackendMode] = useState('connecting');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function init() {
      try {
        const health = await api.checkHealth();
        setBackendMode(health.mode || 'offline');
        
        // Initial recipes for the default ingredients
        fetchInitialRecipes(ingredients, 'all');

        // Sync pantry inventory
        const pantryRes = await api.scanPantry();
        if (pantryRes && pantryRes.items) {
          setPantryItems(pantryRes.items);
        }
      } catch (err) {
        console.warn('Init error:', err);
      }
    }
    init();
  }, []);

  const fetchInitialRecipes = async (ingList, filter = activeFilter, searchQuery = '') => {
    setIsGenerating(true);
    try {
      const res = await api.generateRecipes(ingList, filter, 'Best Match', searchQuery);
      if (res && res.recipes && res.recipes.length > 0) {
        setRecipes(res.recipes);
      }
    } catch (err) {
      console.warn('Backend fetch failed, using fallback recipes:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddIngredient = (item) => {
    const trimmed = item.trim();
    if (!ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...ingredients, trimmed];
      setIngredients(updated);
      showToast(`Added "${trimmed}"! Updating recipes...`, 'success');
      // Automatically refresh recipes for new ingredient
      fetchInitialRecipes(updated, activeFilter);
    }
  };

  const handleRemoveIngredient = (item) => {
    const updated = ingredients.filter((i) => i.toLowerCase() !== item.toLowerCase());
    setIngredients(updated);
    showToast(`Removed "${item}"`, 'info');
    fetchInitialRecipes(updated, activeFilter);
  };

  const handleImageScan = async (file) => {
    setIsScanning(true);
    showToast('Analyzing food photo with AI Vision...', 'info');
    try {
      const res = await api.scanPantryWithImage(file);
      if (res && res.detectedIngredients && res.detectedIngredients.length > 0) {
        const merged = Array.from(new Set([...ingredients, ...res.detectedIngredients]));
        setIngredients(merged);
        if (res.items) setPantryItems(res.items);
        showToast(`AI detected ${res.detectedIngredients.length} ingredients!`, 'success');
        fetchInitialRecipes(merged, activeFilter);
      } else {
        showToast('No new ingredients recognized in photo', 'warning');
      }
    } catch (err) {
      console.error('Scan error:', err);
      showToast('Photo scan failed. Using offline inventory.', 'warning');
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateRecipes = async () => {
    showToast(`Chef.ai is creating recipes with your ${ingredients.length} ingredients!`, 'success');
    await fetchInitialRecipes(ingredients, activeFilter);
    setActiveTab('feed');
  };

  const handleSelectFilter = (filter) => {
    setActiveFilter(filter);
    fetchInitialRecipes(ingredients, filter);
  };

  const handleSearchAI = async (query) => {
    showToast(`Chef.ai is crafting a recipe for "${query}"...`, 'info');
    await fetchInitialRecipes(ingredients, activeFilter, query);
    setActiveTab('feed');
    showToast(`Created custom dishes for "${query}"!`, 'success');
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
        return {
          ...ing,
          name: `${substitute} (Replaced ${original})`,
          inPantry: true,
          isMissing: false,
          available: true,
        };
      }
      return ing;
    });

    const updatedMissing = selectedRecipe.missingIngredients?.filter(
      (m) => !m.toLowerCase().includes(original.toLowerCase())
    );

    const newRecipe = {
      ...selectedRecipe,
      ingredients: updatedIngredients,
      missingIngredients: updatedMissing,
      pantryMatchPercentage: 100,
      isAllAvailable: (updatedMissing || []).length === 0,
    };

    setSelectedRecipe(newRecipe);

    // Update in main feed list as well
    setRecipes((prev) =>
      prev.map((r) => (r.id === newRecipe.id ? newRecipe : r))
    );

    showToast(`Swapped "${original}" with "${substitute}"!`, 'success');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-16 pb-[88px] md:pb-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top duration-300">
          <div className={`px-4 py-2.5 rounded-xl shadow-xl border text-sm font-semibold flex items-center gap-2 backdrop-blur-md ${
            toast.type === 'success' 
              ? 'bg-green-950/90 text-green-300 border-green-700/50' 
              : toast.type === 'warning'
              ? 'bg-amber-950/90 text-amber-300 border-amber-700/50'
              : 'bg-surface-container-high/90 text-on-surface border-primary/30'
          }`}>
            <span className="material-symbols-outlined text-base">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'warning' ? 'warning' : 'info'}
            </span>
            {toast.message}
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#131313]/90 backdrop-blur-md border-b border-secondary/10 shadow-md flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('hub')}>
          <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-black shadow-md">
            <span className="material-symbols-outlined text-2xl font-bold">restaurant</span>
          </div>
          <span className="font-headline-md text-xl font-bold text-primary">
            Chef.ai
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant border border-outline/20">
            {backendMode === 'live' ? '⚡ Live AI' : '🍲 Culinary Engine'}
          </span>
        </div>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab('hub')}
            className={`font-label-md text-sm transition-all flex items-center gap-2 py-5 cursor-pointer ${
              activeTab === 'hub'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'hub' ? "'FILL' 1" : "'FILL' 0" }}>
              inventory_2
            </span>
            Hub &amp; Pantry
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`font-label-md text-sm transition-all flex items-center gap-2 py-5 cursor-pointer ${
              activeTab === 'feed'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: activeTab === 'feed' ? "'FILL' 1" : "'FILL' 0" }}>
              explore
            </span>
            Discover Recipes
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="bg-surface-container hover:bg-surface-container-high text-primary px-3.5 py-1.5 rounded-full font-label-sm text-xs font-semibold border border-primary/30 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Open Pantry Inventory & AI Substitutions"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              swap_horiz
            </span>
            AI Swaps
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
        {activeTab === 'hub' ? (
          <PantryScanner
            ingredients={ingredients}
            pantryItems={pantryItems}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onImageScan={handleImageScan}
            onGenerateRecipes={handleGenerateRecipes}
            onSearchDish={handleSearchAI}
            isScanning={isScanning}
            isGenerating={isGenerating}
            activeFilter={activeFilter}
            onSelectFilter={handleSelectFilter}
          />
        ) : (
          <RecipeFeed
            recipes={recipes}
            onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
            onBackToHub={() => setActiveTab('hub')}
            onSearchAI={handleSearchAI}
            isGenerating={isGenerating}
          />
        )}
      </main>

      {/* Cook-Along Detail Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onOpenSubstituteDrawer={handleOpenSubstituteDrawer}
        />
      )}

      {/* AI Substitutions & Pantry Manager Drawer */}
      <SubstitutionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        missingIngredient={missingIngredientForSwap}
        pantryItems={pantryItems}
        onApplySwap={handleApplySwap}
        onAddIngredient={handleAddIngredient}
      />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#131313]/95 backdrop-blur-md border-t border-secondary/10 flex justify-around items-center px-4 py-2.5">
        <button
          onClick={() => setActiveTab('hub')}
          className={`flex flex-col items-center justify-center p-1.5 transition-all ${
            activeTab === 'hub' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: activeTab === 'hub' ? "'FILL' 1" : "'FILL' 0" }}>
            home
          </span>
          <span className="text-[11px] mt-0.5">Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center p-1.5 transition-all ${
            activeTab === 'feed' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: activeTab === 'feed' ? "'FILL' 1" : "'FILL' 0" }}>
            explore
          </span>
          <span className="text-[11px] mt-0.5">Discover</span>
        </button>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 text-on-surface-variant hover:text-primary transition-all"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: isDrawerOpen ? "'FILL' 1" : "'FILL' 0" }}>
            inventory_2
          </span>
          <span className="text-[11px] mt-0.5">Pantry</span>
        </button>
      </nav>
    </div>
  );
}

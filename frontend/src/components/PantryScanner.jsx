import React, { useState, useEffect } from 'react';

export default function PantryScanner({
  ingredients = [],
  pantryItems = [],
  onAddIngredient,
  onRemoveIngredient,
  onGenerateRecipes,
  isGenerating,
  activeFilter,
  onSelectFilter
}) {
  const [newIngredient, setNewIngredient] = useState('');
  
  // Mock AI Scanning Modal State (3-second simulated experience)
  const [isMockScanningOpen, setIsMockScanningOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedItemPreview, setDetectedItemPreview] = useState('Fresh Avocado');

  const dummyScanItems = [
    'Fresh Avocado',
    'Ripe Lemons',
    'Fresh Rosemary',
    'Bell Peppers',
    'Button Mushrooms',
    'Baby Spinach'
  ];

  // Start the 3-second Mock Scan
  const handleStartMockScan = () => {
    // Choose a dummy item not yet in the pantry
    const nextItem = dummyScanItems.find(
      (item) => !ingredients.some((i) => i.toLowerCase() === item.toLowerCase())
    ) || 'Fresh Avocado';

    setDetectedItemPreview(nextItem);
    setScanProgress(0);
    setIsMockScanningOpen(true);
  };

  useEffect(() => {
    let timer = null;
    let progressInterval = null;

    if (isMockScanningOpen) {
      // Smoothly animate progress bar from 0% to 100% over 3s
      const startTime = Date.now();
      const duration = 3000;

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / duration) * 100));
        setScanProgress(pct);
      }, 50);

      // Auto-complete at exactly 3 seconds
      timer = setTimeout(() => {
        setIsMockScanningOpen(false);
        setScanProgress(100);
        if (onAddIngredient && detectedItemPreview) {
          onAddIngredient(detectedItemPreview);
        }
      }, duration);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [isMockScanningOpen, detectedItemPreview, onAddIngredient]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient.trim());
      setNewIngredient('');
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Recipes', icon: 'restaurant' },
    { id: 'Quick (<20m)', label: 'Quick (<20m)', icon: 'timer' },
    { id: 'High Protein', label: 'High Protein', icon: 'fitness_center' },
    { id: 'Vegetarian', label: 'Vegetarian', icon: 'eco' },
    { id: 'Vegan', label: 'Vegan', icon: 'psychiatry' },
    { id: 'Budget-Friendly', label: 'Budget-Friendly', icon: 'savings' },
  ];

  const suggestedPantryTags = [
    'Chicken Breast', 'Salmon', 'Rice', 'Broccoli', 'Eggs', 'Tomatoes', 
    'Garlic', 'Olive Oil', 'Parmesan Cheese', 'Fettuccine Pasta', 'Avocado', 'Spinach'
  ];

  const expiringCount = pantryItems.filter(
    (i) => i.freshness === 'expiring_soon' || i.daysLeft <= 2
  ).length || 2;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      
      {/* Header Text */}
      <section className="flex flex-col gap-1 mt-2">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface font-bold">
          Dashboard &amp; Ingredient Hub
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Add your kitchen ingredients or try our AI Scanner to discover personalized recipes.
        </p>
      </section>

      {/* Quick Stats Bento */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-5 border border-secondary/10 shadow-sm flex flex-col gap-2 relative overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
            <span className="pill-btn-inactive font-label-sm text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Pantry
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">{ingredients.length}</span>
            <span className="font-label-md text-xs text-on-surface-variant">Active Ingredients</span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-error/20 shadow-sm flex flex-col gap-2 relative overflow-hidden transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <span className="badge-alert font-label-sm text-xs px-2.5 py-0.5 rounded-full font-bold">
              Alert
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-xl text-headline-xl text-error font-bold">{expiringCount}</span>
            <span className="font-label-md text-xs text-on-surface-variant">Expiring Soon (&le; 2d)</span>
          </div>
        </div>
      </section>

      {/* Filter Carousel */}
      <section className="w-full -mx-4 px-4 md:mx-0 md:px-0 py-1 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-2.5 w-max">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => onSelectFilter(filter.id)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'pill-btn-active font-bold'
                    : 'pill-btn-inactive font-medium'
                }`}
              >
                {filter.icon && (
                  <span
                    className="material-symbols-outlined text-[18px] transition-colors"
                    style={{
                      color: isActive ? 'var(--icon-accent-active)' : 'var(--icon-accent)',
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                    }}
                  >
                    {filter.icon}
                  </span>
                )}
                {filter.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Ingredient Card */}
      <section className="card-panel rounded-2xl border border-secondary/10 shadow-xl overflow-hidden flex flex-col backdrop-blur-xl">
        
        {/* Photo Upload / Fake AI Scanner Zone */}
        <div
          onClick={handleStartMockScan}
          className="p-6 border-b border-secondary/10 flex flex-col items-center justify-center gap-3 relative group cursor-pointer transition-colors bg-surface-container-lowest/50 hover:bg-surface-container-lowest/80"
          title="Click to launch 3-second AI Scanner simulation"
        >
          <div className="w-14 h-14 rounded-full bg-surface-container border border-outline/20 flex items-center justify-center group-hover:border-primary-container group-hover:scale-105 transition-all duration-300 shadow-inner">
            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              add_a_photo
            </span>
          </div>
          <div className="text-center">
            <p className="font-label-md text-sm text-on-surface font-bold flex items-center justify-center gap-1.5">
              <span>Tap to upload or take a food photo</span>
              <span className="text-[10px] uppercase font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full">
                AI Vision
              </span>
            </p>
            <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
              Simulated optical scanner catalogs groceries automatically
            </p>
          </div>
        </div>

        {/* Ingredient Entry & Tags / Empty State */}
        <div className="p-6 bg-surface-container/30 flex flex-col gap-4">
          
          {/* Manual Input Form */}
          <form onSubmit={handleAdd} className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              add_circle
            </span>
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Type ANY ingredient (e.g. Avocado, Salmon, Garlic, Pasta)..."
              className="w-full bg-surface-container-low text-on-surface font-body-md text-sm pl-12 pr-24 py-3.5 rounded-xl border border-secondary/10 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/60 transition-all outline-none"
            />
            <button
              type="submit"
              disabled={!newIngredient.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-container text-on-primary-container text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-30 transition-all hover:bg-primary-fixed cursor-pointer"
            >
              + Add
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-xs text-on-surface-variant font-medium">Quick suggestions:</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPantryTags
                .filter((tag) => !ingredients.some((i) => i.toLowerCase() === tag.toLowerCase()))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onAddIngredient(tag)}
                    className="pill-btn-inactive text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </div>

          {/* =============================================================== */}
          {/* INGREDIENT TAGS LIST vs. BEAUTIFUL EMPTY STATE GRAPHICS         */}
          {/* =============================================================== */}
          {ingredients.length === 0 ? (
            <div className="py-8 px-4 rounded-2xl bg-surface-container-low/70 border border-secondary/10 flex flex-col items-center text-center gap-4 transition-all duration-300 animate-in fade-in zoom-in-95">
              
              {/* Custom Clean Inline SVG Empty State Illustration */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                <svg
                  className="w-24 h-24 text-icon-accent float-gentle"
                  style={{ color: 'var(--icon-accent)' }}
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Floating Steam / Aroma Lines */}
                  <path
                    d="M38 22C38 18 42 16 42 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                  <path
                    d="M50 20C50 15 54 14 54 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="opacity-80"
                  />
                  <path
                    d="M62 23C62 19 66 17 66 13"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="opacity-60"
                  />

                  {/* Pantry Basket Outline */}
                  <path
                    d="M20 40H80L72 78C71.5 81 68.8 83 65.5 83H34.5C31.2 83 28.5 81 28 78L20 40Z"
                    fill="currentColor"
                    fillOpacity="0.12"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />

                  {/* Basket Rim */}
                  <rect
                    x="16"
                    y="36"
                    width="68"
                    height="7"
                    rx="3.5"
                    fill="currentColor"
                    fillOpacity="0.25"
                    stroke="currentColor"
                    strokeWidth="2"
                  />

                  {/* Basket Handle */}
                  <path
                    d="M32 36C32 24 68 24 68 36"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="4 3"
                  />

                  {/* Inside Sparkle Accent */}
                  <path
                    d="M50 52L52 57L57 59L52 61L50 66L48 61L43 59L48 57L50 52Z"
                    fill="currentColor"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              {/* Empty Message */}
              <div className="flex flex-col gap-1 max-w-sm">
                <h3 className="font-headline font-bold text-base md:text-lg text-on-surface">
                  Your pantry is looking a little bare!
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Add some ingredients to begin or use the AI Scanner to discover custom chef recipes.
                </p>
              </div>

              {/* Action Buttons to populate with 1-click */}
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => ['Chicken Breast', 'Garlic', 'Olive Oil', 'Tomatoes'].forEach(onAddIngredient)}
                  className="text-xs bg-primary-container text-on-primary-container font-bold px-3.5 py-1.5 rounded-full hover:bg-primary-fixed transition-all cursor-pointer shadow-sm"
                >
                  + Add Mediterranean Staples
                </button>
                <button
                  type="button"
                  onClick={handleStartMockScan}
                  className="text-xs bg-surface-container hover:bg-surface-container-high text-primary font-bold px-3.5 py-1.5 rounded-full border border-primary/30 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Scan Pantry
                </button>
              </div>

            </div>
          ) : (
            /* Populated Tags Container */
            <div className="flex flex-wrap gap-2 pt-2 border-t border-secondary/5 transition-all duration-300">
              {ingredients.map((item, idx) => (
                <div
                  key={idx}
                  className="badge-tag px-3 py-1.5 rounded-full font-label-sm text-xs font-semibold flex items-center gap-1.5 group cursor-default border transition-colors"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveIngredient(item)}
                    className="material-symbols-outlined text-[16px] opacity-75 hover:opacity-100 hover:text-error hover:scale-110 transition-all cursor-pointer"
                    title={`Remove ${item}`}
                  >
                    cancel
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Primary Recipe Generation CTA Button */}
          <button
            onClick={onGenerateRecipes}
            disabled={isGenerating || ingredients.length === 0}
            className="w-full bg-primary-container hover:bg-primary-fixed text-on-primary-container font-headline font-bold py-3.5 rounded-xl mt-2 active:scale-[0.99] transition-all shadow-[0_4px_16px_rgba(255,191,0,0.25)] flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer text-sm"
          >
            <span className={`material-symbols-outlined ${isGenerating ? 'animate-spin' : ''}`}>
              {isGenerating ? 'progress_activity' : 'restaurant_menu'}
            </span>
            {isGenerating ? 'Chef.ai is Generating Recipes...' : `Discover Recipes with ${ingredients.length} Ingredients`}
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3-SECOND MOCK AI SCANNING POPUP MODAL                                    */}
      {/* ========================================================================= */}
      {isMockScanningOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="card-panel border border-primary/40 rounded-3xl w-full max-w-md p-6 shadow-2xl flex flex-col items-center gap-5 relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Top Header */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">camera</span>
                <h3 className="font-headline font-bold text-base text-on-surface">AI Optical Pantry Scanner</h3>
              </div>
              <span className="text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {Math.round((3000 - (scanProgress / 100) * 3000) / 1000)}s
              </span>
            </div>

            {/* Wireframe Viewfinder with Sweeping Laser Line */}
            <div className="relative w-full h-56 rounded-2xl bg-black/80 overflow-hidden border border-primary/30 flex items-center justify-center shadow-inner">
              
              {/* Background Mock Grocery View */}
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
                alt="Pantry Items in frame"
                className="w-full h-full object-cover opacity-60 scale-105"
              />

              {/* Sweeping CSS Laser Line */}
              <div className="scan-laser-line" />

              {/* Wireframe Corner Brackets [ ] */}
              <div className="absolute inset-4 pointer-events-none flex flex-col justify-between reticle-bracket">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                </div>
                
                {/* Center Targeting Box */}
                <div className="self-center flex flex-col items-center gap-1 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/40">
                  <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span>Targeting: {detectedItemPreview}</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-mono">Confidence: 99.4%</span>
                </div>

                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
                </div>
              </div>
            </div>

            {/* Animated Status Pill & Progress Bar */}
            <div className="w-full flex flex-col gap-2 text-center">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5 text-primary font-semibold">
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  AI Vision Analyzing Pantry...
                </span>
                <span className="font-mono text-xs font-bold text-primary">{scanProgress}%</span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-container transition-all duration-75 ease-linear"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <p className="text-[11px] text-on-surface-variant mt-1">
                Auto-cataloging fresh produce without accessing device hardware.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

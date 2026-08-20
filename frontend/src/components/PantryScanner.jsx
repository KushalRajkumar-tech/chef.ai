import React, { useState } from 'react';

export default function PantryScanner({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onScanClick,
  onGenerateRecipes,
  isScanning,
  isGenerating,
  activeFilter,
  onSelectFilter
}) {
  const [newIngredient, setNewIngredient] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient.trim());
      setNewIngredient('');
    }
  };

  const filterOptions = [
    { id: 'quick', label: 'Quick (<20m)', icon: 'timer' },
    { id: 'high-protein', label: 'High Protein' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'budget', label: 'Budget-Friendly' },
  ];

  return (
    <div className="flex flex-col gap-stack-md w-full max-w-7xl mx-auto">
      {/* Header Text */}
      <section className="flex flex-col gap-1 mt-4">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          Dashboard &amp; Hub
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage your ingredients and discover recipes.
        </p>
      </section>

      {/* Quick Stats Bento */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-4 border border-secondary/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Total</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-xl text-headline-xl text-on-surface">{ingredients.length}</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Items in Pantry</span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-4 border border-error/20 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col gap-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <span className="font-label-sm text-label-sm text-error">Alert</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-xl text-headline-xl text-on-surface">3</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Expiring Soon</span>
          </div>
        </div>
      </section>

      {/* Filter Carousel */}
      <section className="w-full -mx-gutter px-gutter py-2 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-3 w-max">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => onSelectFilter(isActive ? 'all' : filter.id)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1 border ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_15px_rgba(255,191,0,0.1)] font-semibold'
                    : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {filter.icon && (
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                    {filter.icon}
                  </span>
                )}
                {filter.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Ingredient Input Card (Glassmorphism) */}
      <section className="bg-[#1E1E1E] rounded-2xl border border-secondary/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col relative z-10 backdrop-blur-xl">
        {/* Top Drop Zone */}
        <div
          onClick={onScanClick}
          className="p-6 border-b border-secondary/10 flex flex-col items-center justify-center gap-3 bg-surface-container-lowest/50 relative group cursor-pointer hover:bg-surface-container-lowest/70 transition-colors"
        >
          <div className="w-16 h-16 rounded-full bg-surface-container border border-outline/20 flex items-center justify-center group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300 shadow-inner">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>
              add_a_photo
            </span>
          </div>
          <div className="text-center">
            <p className="font-label-md text-label-md text-on-surface">
              {isScanning ? 'Scanning photo with AI...' : 'Tap to capture or drop an image'}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              AI will automatically detect ingredients
            </p>
          </div>
        </div>

        {/* Bottom Search & Tags */}
        <div className="p-6 bg-surface-container/30 flex flex-col gap-4">
          <form onSubmit={handleAdd} className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add ingredient manually..."
              className="w-full bg-[#161616] border-none text-on-surface font-body-md text-body-md pl-12 pr-4 py-3 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-on-surface-variant transition-all outline-none border-b-2 border-transparent focus:border-b-primary"
            />
          </form>

          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, idx) => (
              <div
                key={idx}
                className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1 group cursor-pointer hover:bg-primary/20 transition-colors"
              >
                {item}
                <span
                  onClick={() => onRemoveIngredient(item)}
                  className="material-symbols-outlined text-[14px] opacity-70 group-hover:opacity-100"
                >
                  close
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onGenerateRecipes}
            disabled={isGenerating || ingredients.length === 0}
            className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md py-3 rounded-lg mt-2 active:scale-[0.98] transition-transform shadow-[0_4px_14px_rgba(255,191,0,0.15)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined">magic_button</span>
            {isGenerating ? 'Cooking up AI Recipes...' : 'Generate Recipes'}
          </button>
        </div>
      </section>

      {/* Ambient Spacer */}
      <div className="h-stack-lg" />
    </div>
  );
}

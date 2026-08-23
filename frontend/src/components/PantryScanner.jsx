import React, { useState, useRef } from 'react';

export default function PantryScanner({
  ingredients,
  pantryItems = [],
  onAddIngredient,
  onRemoveIngredient,
  onImageScan,
  onGenerateRecipes,
  isScanning,
  isGenerating,
  activeFilter,
  onSelectFilter
}) {
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newIngredient.trim()) {
      onAddIngredient(newIngredient.trim());
      setNewIngredient('');
    }
  };

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const previewUrl = URL.createObjectURL(file);
    setSelectedImagePreview(previewUrl);
    if (onImageScan) {
      onImageScan(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
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
    (i) => i.freshness === 'expiring_soon' || i.freshness === 'expired'
  ).length || 2;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header Text */}
      <section className="flex flex-col gap-1 mt-2">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
          Dashboard &amp; Ingredient Hub
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Add your kitchen ingredients or scan your fridge to discover personalized AI recipes.
        </p>
      </section>

      {/* Quick Stats Bento */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-5 border border-secondary/10 shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">Pantry</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-xl text-headline-xl text-on-surface font-bold">{ingredients.length}</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Active Ingredients</span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl p-5 border border-error/20 shadow-sm flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <span className="font-label-sm text-label-sm text-error bg-error-container/20 px-2 py-0.5 rounded-full">Urgent</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-xl text-headline-xl text-error font-bold">{expiringCount}</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Expiring Soon</span>
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
                className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_12px_rgba(255,191,0,0.25)] font-semibold'
                    : 'bg-surface-container border-outline-variant/40 text-on-surface hover:bg-surface-container-high hover:border-primary/40'
                }`}
              >
                {filter.icon && (
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
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
      <section className="bg-[#1E1E1E] rounded-2xl border border-secondary/10 shadow-xl overflow-hidden flex flex-col backdrop-blur-xl">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
          }}
          className="hidden"
        />

        {/* Photo Upload / Capture Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-6 border-b border-secondary/10 flex flex-col items-center justify-center gap-3 relative group cursor-pointer transition-colors ${
            isDragOver
              ? 'bg-primary-container/10 border-primary'
              : 'bg-surface-container-lowest/50 hover:bg-surface-container-lowest/80'
          }`}
        >
          {selectedImagePreview ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary shadow-lg">
                <img src={selectedImagePreview} alt="Captured Pantry" className="w-full h-full object-cover" />
                {isScanning && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-primary text-xs font-semibold gap-1">
                    <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                    Scanning...
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="text-xs bg-surface-container text-on-surface px-3 py-1 rounded-full hover:bg-surface-container-high border border-outline/30"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImagePreview(null);
                  }}
                  className="text-xs text-error hover:underline px-2 py-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-surface-container border border-outline/20 flex items-center justify-center group-hover:border-primary/50 group-hover:scale-105 transition-all duration-300 shadow-inner">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-2xl">
                  {isScanning ? 'progress_activity' : 'add_a_photo'}
                </span>
              </div>
              <div className="text-center">
                <p className="font-label-md text-label-md text-on-surface font-semibold">
                  {isScanning ? 'Gemini AI is analyzing your pantry...' : 'Tap to upload or take a food photo'}
                </p>
                <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">
                  AI vision automatically identifies items and freshness
                </p>
              </div>
            </>
          )}
        </div>

        {/* Ingredient Entry & Tags */}
        <div className="p-6 bg-surface-container/30 flex flex-col gap-4">
          <form onSubmit={handleAdd} className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              add_circle
            </span>
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Type ANY ingredient (e.g. Salmon, Chicken, Garlic, Avocado)..."
              className="w-full bg-[#161616] text-on-surface font-body-md text-body-md pl-12 pr-24 py-3.5 rounded-xl border border-secondary/10 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/60 transition-all outline-none"
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
            <span className="font-label-sm text-xs text-on-surface-variant/80">Quick suggestions:</span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPantryTags
                .filter((tag) => !ingredients.some((i) => i.toLowerCase() === tag.toLowerCase()))
                .slice(0, 8)
                .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onAddIngredient(tag)}
                    className="text-xs bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary px-2.5 py-1 rounded-md border border-outline/20 transition-colors cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </div>

          {/* Current Ingredient Tags */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-secondary/5">
            {ingredients.map((item, idx) => (
              <div
                key={idx}
                className="bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 group cursor-default hover:bg-primary/20 transition-colors"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(item)}
                  className="material-symbols-outlined text-[16px] text-primary/70 hover:text-error hover:scale-110 transition-all cursor-pointer"
                  title={`Remove ${item}`}
                >
                  cancel
                </button>
              </div>
            ))}
          </div>

          {/* Single Clear Primary CTA Button */}
          <button
            onClick={onGenerateRecipes}
            disabled={isGenerating || ingredients.length === 0}
            className="w-full bg-primary-container hover:bg-primary-fixed text-on-primary-container font-label-md text-label-md font-bold py-3.5 rounded-xl mt-2 active:scale-[0.99] transition-all shadow-[0_4px_16px_rgba(255,191,0,0.25)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer text-sm"
          >
            <span className={`material-symbols-outlined ${isGenerating ? 'animate-spin' : ''}`}>
              {isGenerating ? 'progress_activity' : 'restaurant_menu'}
            </span>
            {isGenerating ? 'Chef.ai is Generating Recipes...' : `Discover Recipes with ${ingredients.length} Ingredients`}
          </button>
        </div>
      </section>
    </div>
  );
}

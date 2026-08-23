import React, { useState } from 'react';

export default function RecipeFeed({
  recipes = [],
  onSelectRecipe,
  onBackToHub,
  onSearchAI,
  isGenerating
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('best-match');
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && onSearchAI) {
      onSearchAI(searchTerm.trim());
    }
  };

  const filteredAndSortedRecipes = recipes
    .filter((r) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      const matchesTitle = r.title?.toLowerCase().includes(q);
      const matchesCuisine = r.cuisine?.toLowerCase().includes(q);
      const matchesIng = r.ingredients?.some((ing) => {
        const name = typeof ing === 'string' ? ing : ing.name;
        return name?.toLowerCase().includes(q);
      });
      return matchesTitle || matchesCuisine || matchesIng;
    })
    .sort((a, b) => {
      if (sortBy === 'fastest') {
        const timeA = a.totalTimeMinutes || a.prepTime || 99;
        const timeB = b.totalTimeMinutes || b.prepTime || 99;
        return timeA - timeB;
      }
      if (sortBy === 'low-cal') {
        return (a.calories || 999) - (b.calories || 999);
      }
      if (sortBy === 'best-match') {
        return (b.pantryMatchPercentage || b.matchPercentage || 0) - (a.pantryMatchPercentage || a.matchPercentage || 0);
      }
      return 0;
    });

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
            Recipe Discovery Feed
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Dishes crafted for your pantry. Type any dish and press Enter to generate with AI.
          </p>
        </div>

        {/* Clean Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search or type dish name + Enter..."
            className="w-full bg-[#161616] text-on-surface border border-secondary/15 rounded-full py-2.5 pl-12 pr-10 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/60 shadow-inner"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </form>
      </div>

      {/* Sorting Tabs & Filters */}
      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2.5 min-w-max pb-1">
          <button
            onClick={() => setSortBy('best-match')}
            className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer border ${
              sortBy === 'best-match'
                ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_12px_rgba(255,191,0,0.2)] font-bold'
                : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            Best Match
          </button>

          <button
            onClick={() => setSortBy('fastest')}
            className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer border ${
              sortBy === 'fastest'
                ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_12px_rgba(255,191,0,0.2)] font-bold'
                : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">timer</span>
            Fastest (&lt;20m)
          </button>

          <button
            onClick={() => setSortBy('low-cal')}
            className={`px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-1.5 transition-all cursor-pointer border ${
              sortBy === 'low-cal'
                ? 'bg-primary-container text-on-primary-container border-primary-container shadow-[0_0_12px_rgba(255,191,0,0.2)] font-bold'
                : 'bg-surface-container text-on-surface-variant border-outline-variant/30 hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
            Lowest Calories
          </button>
        </div>
      </div>

      {/* Recipe Count Info */}
      <div className="flex justify-between items-center text-xs text-on-surface-variant border-b border-secondary/5 pb-2">
        <span>{filteredAndSortedRecipes.length} recipes ready</span>
        {onBackToHub && (
          <button onClick={onBackToHub} className="text-primary hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">arrow_back</span>
            Edit Ingredients
          </button>
        )}
      </div>

      {/* Recipe Cards Grid */}
      {filteredAndSortedRecipes.length === 0 ? (
        <div className="bg-[#1E1E1E] rounded-2xl p-10 text-center flex flex-col items-center gap-4 border border-secondary/10">
          <span className="material-symbols-outlined text-4xl text-primary/50">soup_kitchen</span>
          <h3 className="font-headline-md text-on-surface font-bold">
            {searchTerm ? `No local matches for "${searchTerm}"` : 'No recipes yet'}
          </h3>
          <p className="text-on-surface-variant text-xs max-w-sm">
            {searchTerm ? `Click below to have Chef.ai generate "${searchTerm}" recipes.` : 'Add ingredients to generate recipes.'}
          </p>
          {searchTerm && onSearchAI && (
            <button
              onClick={() => onSearchAI(searchTerm)}
              disabled={isGenerating}
              className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-bold text-xs hover:bg-primary-fixed flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Generate &quot;{searchTerm}&quot;
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAndSortedRecipes.map((recipe) => {
            const isBookmarked = bookmarkedIds.has(recipe.id);
            const matchScore = recipe.pantryMatchPercentage || recipe.matchPercentage || 90;
            const missingList = recipe.missingIngredients || [];
            const hasMissing = missingList.length > 0;
            const prepTime = recipe.totalTimeMinutes || recipe.prepTime || 20;
            const imgSrc = recipe.imageUrl || recipe.image || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80';

            return (
              <article
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className="bg-[#1E1E1E] rounded-2xl overflow-hidden relative group border border-secondary/10 shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Image Header */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={imgSrc}
                    />

                    {/* Match Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full border border-secondary/10 flex items-center gap-1.5 shadow-md">
                        <span
                          className="material-symbols-outlined text-primary-container text-[14px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                        <span className="font-label-sm text-xs text-on-surface font-bold">
                          {matchScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Bookmark Icon */}
                    <button
                      onClick={(e) => toggleBookmark(e, recipe.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-surface/70 backdrop-blur-md flex items-center justify-center hover:bg-surface transition-colors text-on-surface border border-secondary/10 shadow-md"
                      title="Save Recipe"
                    >
                      <span
                        className="material-symbols-outlined text-[18px] text-primary"
                        style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        {isBookmarked ? 'bookmark' : 'bookmark_border'}
                      </span>
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-primary">
                        {recipe.cuisine || 'Fusion'}
                      </span>
                      {recipe.difficulty && (
                        <span className="text-[11px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                          {recipe.difficulty}
                        </span>
                      )}
                    </div>

                    <h3 className="font-headline-md text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug mb-1.5">
                      {recipe.title}
                    </h3>

                    <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                      {recipe.description || 'Delicious home-cooked dish matched to your pantry ingredients.'}
                    </p>

                    {/* Meta Pills */}
                    <div className="flex flex-wrap gap-2 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-md">
                        <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                        {prepTime}m
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-md">
                        <span className="material-symbols-outlined text-[14px] text-primary">local_fire_department</span>
                        {recipe.calories} kcal
                      </div>
                      {recipe.macros?.protein && (
                        <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-md">
                          <span className="material-symbols-outlined text-[14px] text-primary">fitness_center</span>
                          {recipe.macros.protein}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Availability Badge */}
                <div className="px-5 pb-5 pt-0 flex items-center justify-between">
                  {hasMissing ? (
                    <span className="text-[11px] text-error font-medium bg-error-container/15 border border-error-container/30 px-2.5 py-1 rounded-full truncate max-w-[65%]">
                      Missing: {missingList.join(', ')}
                    </span>
                  ) : (
                    <span className="text-[11px] text-green-400 font-medium bg-green-950/40 border border-green-800/40 px-2.5 py-1 rounded-full">
                      All Ingredients Ready
                    </span>
                  )}

                  <span className="text-xs text-primary font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Cook <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

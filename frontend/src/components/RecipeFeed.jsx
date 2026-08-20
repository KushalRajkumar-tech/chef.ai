import React, { useState } from 'react';

export default function RecipeFeed({ recipes, onSelectRecipe }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('best-match');
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

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'fastest') return (r.prepTime || 99) <= 20;
    if (activeTab === 'low-cal') return (r.calories || 999) <= 450;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Mobile Search (Visible only on small screens) */}
      <div className="md:hidden relative w-full mb-2">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search recipes or ingredients..."
          className="w-full bg-[#161616] text-on-surface border border-surface-container-high rounded-full py-3 pl-12 pr-4 text-base focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/70 shadow-inner"
        />
      </div>

      {/* Filter Pills */}
      <div className="overflow-x-auto hide-scrollbar mb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-3 min-w-max pb-2">
          <button
            onClick={() => setActiveTab('best-match')}
            className={`px-5 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container ${
              activeTab === 'best-match'
                ? 'bg-primary-container/20 text-primary-container border border-primary-container/30 hover:bg-primary-container/30'
                : 'bg-surface-container text-on-surface-variant border border-surface-container-highest hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            Best Match
          </button>

          <button
            onClick={() => setActiveTab('fastest')}
            className={`px-5 py-2 rounded-full font-label-md text-label-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container ${
              activeTab === 'fastest'
                ? 'bg-primary-container/20 text-primary-container border border-primary-container/30 hover:bg-primary-container/30'
                : 'bg-surface-container text-on-surface-variant border border-surface-container-highest hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Fastest (&lt;20m)
          </button>

          <button
            onClick={() => setActiveTab('low-cal')}
            className={`px-5 py-2 rounded-full font-label-md text-label-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container ${
              activeTab === 'low-cal'
                ? 'bg-primary-container/20 text-primary-container border border-primary-container/30 hover:bg-primary-container/30'
                : 'bg-surface-container text-on-surface-variant border border-surface-container-highest hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            Lowest Calories
          </button>

          <button className="bg-surface-container text-on-surface-variant border border-surface-container-highest px-5 py-2 rounded-full font-label-md text-label-md hover:text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">star</span> Highest Rated
          </button>

          <button className="bg-surface-container text-on-surface-variant border border-surface-container-highest w-10 h-10 rounded-full flex items-center justify-center hover:text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container ml-2">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end mb-2">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          Pantry Matches
        </h2>
        <span className="font-label-md text-label-md text-on-surface-variant">
          Showing {filteredRecipes.length} recipes
        </span>
      </div>

      {/* Recipe Feed Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
        {filteredRecipes.map((recipe) => {
          const isBookmarked = bookmarkedIds.has(recipe.id);
          const hasMissing = recipe.missingIngredients && recipe.missingIngredients.length > 0;

          return (
            <article
              key={recipe.id}
              onClick={() => onSelectRecipe(recipe)}
              className="bg-[#1E1E1E] rounded-2xl overflow-hidden relative group border border-secondary/5 shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
            >
              <div className="relative h-64 md:h-72 w-full">
                <img
                  alt={recipe.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={recipe.image}
                />
                {/* Top Overlays */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full border border-secondary/10 flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-primary-container text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface">
                      {recipe.matchPercentage}% Match
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => toggleBookmark(e, recipe.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface/60 backdrop-blur-md flex items-center justify-center hover:bg-surface/90 transition-colors text-on-surface border border-secondary/10 focus:outline-none"
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    bookmark
                  </span>
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E]/20 to-transparent pointer-events-none" />
              </div>

              <div className="p-6 relative -mt-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-md text-headline-md text-on-surface pr-4 leading-tight group-hover:text-primary transition-colors">
                    {recipe.title}
                  </h3>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant mb-4">
                  {recipe.cuisine || 'International'}
                </p>

                <div className="flex flex-wrap gap-4 mb-5">
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    {recipe.prepTime}m
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                    {recipe.calories} kcal
                  </div>
                </div>

                {hasMissing ? (
                  <div className="inline-flex items-center gap-2 bg-error-container/20 text-error border border-error-container/40 px-3 py-1.5 rounded-full font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Missing: {recipe.missingIngredients.join(', ')}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-green-900/20 text-green-400 border border-green-900/50 px-3 py-1.5 rounded-full font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    All Ingredients Available
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

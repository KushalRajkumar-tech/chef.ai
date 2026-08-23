import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function SubstitutionDrawer({
  isOpen,
  onClose,
  missingIngredient,
  pantryItems = [],
  onApplySwap,
  onAddIngredient
}) {
  if (!isOpen) return null;

  const [activeIngredient, setActiveIngredient] = useState(missingIngredient || 'Heavy Cream');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedAlternativeIdx, setSelectedAlternativeIdx] = useState(0);
  const [customItemInput, setCustomItemInput] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const [substituteData, setSubstituteData] = useState({
    target: 'Heavy Cream',
    alternatives: [
      {
        name: 'Greek Yogurt + Milk',
        ratio: '1:1 replacement (3/4 cup Greek Yogurt + 1/4 cup Milk)',
        bestFor: 'Savory sauces, creamy pasta, curries',
        notes: 'Provides high protein, slight tangy richness, and prevents sauce separation over gentle heat.',
        dietary: ['Vegetarian', 'High Protein']
      }
    ],
    culinaryTip: 'Whisk 3/4 cup Greek yogurt with 1/4 cup milk to match heavy cream viscosity without adding excess fat.'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (missingIngredient) {
      setActiveIngredient(missingIngredient);
      fetchSwap(missingIngredient);
    } else {
      fetchSwap(activeIngredient);
    }
  }, [missingIngredient]);

  const fetchSwap = async (item) => {
    if (!item) return;
    setIsLoading(true);
    try {
      const res = await api.getSubstitute(item);
      if (res && res.alternatives && res.alternatives.length > 0) {
        setSubstituteData({
          target: res.target || item,
          alternatives: res.alternatives,
          culinaryTip: res.culinaryTip || res.alternatives[0]?.notes || 'Smart AI swap maintains texture and flavor balance.'
        });
        setSelectedAlternativeIdx(0);
      }
    } catch (err) {
      console.warn('Swap fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSwapItem = (itemName) => {
    setActiveIngredient(itemName);
    fetchSwap(itemName);
  };

  const handleApply = () => {
    const chosen = substituteData.alternatives?.[selectedAlternativeIdx];
    if (chosen && onApplySwap) {
      onApplySwap(activeIngredient, chosen.name);
    }
    onClose();
  };

  const handleAddCustomSubmit = (e) => {
    e.preventDefault();
    if (customItemInput.trim() && onAddIngredient) {
      onAddIngredient(customItemInput.trim());
      setCustomItemInput('');
      setShowAddCustom(false);
    }
  };

  // Categories & Filtering
  const categories = ['All', 'Dairy & Eggs', 'Produce', 'Spices & Oils', 'Pantry Staples'];
  const filteredPantry = pantryItems.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  const activeAlternative = substituteData.alternatives?.[selectedAlternativeIdx] || substituteData.alternatives?.[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#181818] w-full max-w-4xl max-h-[90vh] h-[800px] rounded-t-[2rem] flex flex-col border border-secondary/15 border-b-0 overflow-hidden relative shadow-[0_-12px_50px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom duration-300">
        
        {/* Header Handle */}
        <div className="w-full flex justify-center pt-4 pb-2 shrink-0 cursor-grab">
          <div className="w-12 h-1.5 bg-on-surface-variant/40 rounded-full" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-28 hide-scrollbar">
          
          {/* Title & Stats */}
          <div className="flex justify-between items-center mb-5 pt-2">
            <div>
              <h1 className="font-headline-md text-xl md:text-2xl text-on-surface font-bold">
                Pantry Manager &amp; AI Substitutions
              </h1>
              <p className="text-xs text-on-surface-variant">
                Smart kitchen swap intelligence &amp; inventory tracking
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container text-primary font-bold text-xs px-3 py-1.5 rounded-full border border-primary/20">
                {pantryItems.length || 12} Items Tracked
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>

          {/* Expiry Alerts Chips */}
          <div className="flex gap-2.5 overflow-x-auto pb-3 hide-scrollbar mb-6 snap-x">
            <div
              onClick={() => handleSelectSwapItem('Heavy Cream')}
              className={`snap-start shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                activeIngredient.toLowerCase().includes('cream')
                  ? 'bg-error-container/40 border-error text-error ring-1 ring-error'
                  : 'bg-error-container/15 border-error/30 text-error hover:bg-error-container/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">warning</span>
              Heavy Cream - Expired Yesterday
            </div>

            <div
              onClick={() => handleSelectSwapItem('Greek Yogurt')}
              className={`snap-start shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                activeIngredient.toLowerCase().includes('yogurt')
                  ? 'bg-primary-container/40 border-primary text-primary ring-1 ring-primary'
                  : 'bg-primary-container/15 border-primary/30 text-primary hover:bg-primary-container/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">error</span>
              Greek Yogurt - 1 Day Left
            </div>

            <div
              onClick={() => handleSelectSwapItem('Fresh Spinach')}
              className={`snap-start shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                activeIngredient.toLowerCase().includes('spinach')
                  ? 'bg-surface-container-highest border-primary text-on-surface'
                  : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">info</span>
              Fresh Spinach - 2 Days Left
            </div>
          </div>

          {/* AI Substitution Card (Bento Style) */}
          <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-primary/30 mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-black shadow-md">
                  <span className="material-symbols-outlined text-xl font-bold">auto_awesome</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-base md:text-lg text-primary font-bold">
                    AI Smart Substitutes
                  </h2>
                  <span className="text-[11px] text-on-surface-variant">
                    Replacing: <strong className="text-white">{activeIngredient}</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => fetchSwap(activeIngredient)}
                disabled={isLoading}
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs font-semibold disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-sm ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
                {isLoading ? 'Searching...' : 'Refresh'}
              </button>
            </div>

            {/* Alternatives Selector */}
            <div className="flex flex-col gap-3 mb-5">
              {substituteData.alternatives?.map((alt, idx) => {
                const isSelected = selectedAlternativeIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedAlternativeIdx(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 border-primary ring-1 ring-primary'
                        : 'bg-[#141414] border-secondary/10 hover:border-secondary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-base">
                          {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                        </span>
                        {alt.name}
                      </span>
                      <span className="text-xs bg-surface-container px-2.5 py-0.5 rounded-full text-primary font-semibold">
                        {alt.ratio}
                      </span>
                    </div>
                    {alt.notes && (
                      <p className="text-xs text-on-surface-variant pl-6 mt-1 leading-relaxed">
                        {alt.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chef Tip */}
            {activeAlternative?.notes && (
              <div className="bg-surface-container/60 p-3.5 rounded-xl border border-secondary/10 mb-5 flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong className="text-white font-semibold">Chef's Advice:</strong> {activeAlternative.notes}
                </p>
              </div>
            )}

            {/* Apply Button */}
            <button
              onClick={handleApply}
              className="w-full bg-primary-container hover:bg-primary-fixed text-black font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_4px_16px_rgba(255,191,0,0.25)] flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Apply {activeAlternative?.name || 'Substitution'}
            </button>
          </div>

          {/* Inventory Breakdown Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-base font-bold text-white">
                Detected Pantry Inventory
              </h3>
              <button
                onClick={() => setShowAddCustom(!showAddCustom)}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Item
              </button>
            </div>

            {/* Add Custom Item Inline Form */}
            {showAddCustom && (
              <form onSubmit={handleAddCustomSubmit} className="flex gap-2 mb-4 bg-surface-container p-3 rounded-xl">
                <input
                  type="text"
                  value={customItemInput}
                  onChange={(e) => setCustomItemInput(e.target.value)}
                  placeholder="Enter item name (e.g., Coconut Milk)..."
                  className="flex-1 bg-black/40 text-white text-xs px-3 py-2 rounded-lg border border-outline/30 focus:border-primary outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!customItemInput.trim()}
                  className="bg-primary-container text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-fixed disabled:opacity-40"
                >
                  Save
                </button>
              </form>
            )}

            {/* Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar border-b border-secondary/10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-primary-container text-black'
                      : 'bg-surface-container text-on-surface-variant hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Item Rows */}
            <div className="mt-4 space-y-2.5">
              {filteredPantry.length === 0 ? (
                <div className="text-center py-6 text-xs text-on-surface-variant">
                  No items in this category.
                </div>
              ) : (
                filteredPantry.map((item, idx) => {
                  const isExpiring = item.freshness === 'expiring_soon' || item.freshness === 'expired';
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-[#1E1E1E] rounded-xl border border-secondary/10 hover:border-secondary/25 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{item.name}</p>
                          <p className="text-xs text-on-surface-variant">{item.quantity || 'In Stock'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isExpiring ? (
                          <span className="text-[11px] bg-error-container/20 text-error px-2.5 py-1 rounded-full font-bold border border-error/30">
                            {item.daysLeft !== undefined && item.daysLeft <= 0 ? 'Expired' : `${item.daysLeft}d left`}
                          </span>
                        ) : (
                          <span className="text-[11px] bg-green-950/40 text-green-400 px-2.5 py-1 rounded-full font-bold border border-green-800/40">
                            Fresh
                          </span>
                        )}

                        <button
                          onClick={() => handleSelectSwapItem(item.name)}
                          className="text-xs text-primary hover:underline font-semibold"
                        >
                          Find Swaps
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

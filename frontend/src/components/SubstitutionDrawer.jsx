import React, { useState } from 'react';
import { api } from '../services/api';

export default function SubstitutionDrawer({ isOpen, onClose, missingIngredient, onApplySwap }) {
  if (!isOpen) return null;

  const [activeIngredient, setActiveIngredient] = useState(missingIngredient || 'Heavy Cream');
  const [substituteData, setSubstituteData] = useState({
    substitute: 'Greek Yogurt + Milk',
    ratio: '1:1 ratio',
    culinaryTip: 'Whisk 3/4 cup Greek yogurt with 1/4 cup milk to match heavy cream viscosity without adding excess fat.',
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchSwap = async (item) => {
    setIsLoading(true);
    try {
      const res = await api.getSubstitute(item);
      if (res && res.substitute) {
        setSubstituteData({
          substitute: res.substitute,
          ratio: res.ratio || '1:1 ratio',
          culinaryTip: res.culinaryTip || 'Smart AI swap maintains rich mouthfeel and texture.',
        });
      }
    } catch {
      // keep default
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl h-[795px] md:h-[751px] rounded-t-[1.5rem] flex flex-col border border-secondary/10 border-b-0 overflow-hidden relative shadow-[0_-8px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300">
        {/* Header Handle */}
        <div className="w-full flex justify-center pt-4 pb-2 shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-on-surface-variant/30 rounded-full" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-gutter md:px-container-padding pb-32 hide-scrollbar">
          {/* Title & Badge */}
          <div className="flex justify-between items-center mb-stack-md pt-2">
            <h1 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-on-surface">
              Pantry Manager &amp; AI Substitutions
            </h1>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container-highest text-primary font-label-sm text-label-sm px-3 py-1 rounded-full border border-secondary/10 shadow-sm">
                14 Items Tracked
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>

          {/* Expiry Alerts Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar mb-stack-md snap-x">
            <div
              onClick={() => { setActiveIngredient('Heavy Cream'); fetchSwap('Heavy Cream'); }}
              className={`snap-start shrink-0 flex items-center gap-2 px-4 py-2 rounded-full shadow-sm cursor-pointer ${activeIngredient === 'Heavy Cream' ? 'bg-error-container/40 border-error' : 'bg-error-container/20 border-error/30'} text-error border`}
            >
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span className="font-label-md text-label-md">Heavy Cream - Expired Yesterday</span>
            </div>

            <div
              onClick={() => { setActiveIngredient('Greek Yogurt'); fetchSwap('Greek Yogurt'); }}
              className={`snap-start shrink-0 flex items-center gap-2 px-4 py-2 rounded-full shadow-sm cursor-pointer ${activeIngredient === 'Greek Yogurt' ? 'bg-primary-container/40 border-primary' : 'bg-primary-container/20 border-primary/30'} text-primary border`}
            >
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span className="font-label-md text-label-md">Greek Yogurt - 1 Day Left</span>
            </div>

            <div
              onClick={() => { setActiveIngredient('Spinach'); fetchSwap('Spinach'); }}
              className="snap-start shrink-0 flex items-center gap-2 bg-surface-container-high border border-outline-variant/30 text-on-surface-variant px-4 py-2 rounded-full shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span className="font-label-md text-label-md">Spinach - 3 Days Left</span>
            </div>
          </div>

          {/* AI Substitution Card (Bento Style) */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-primary/20 mb-stack-lg shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-container rounded-lg text-on-primary-container shadow-sm">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-primary">AI Smart Substitutes</h2>
              </div>
              <button
                onClick={() => fetchSwap(activeIngredient)}
                className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-sm text-label-sm"
              >
                <span className={`material-symbols-outlined text-sm ${isLoading ? 'animate-spin' : ''}`}>refresh</span>
                Regenerate
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-surface rounded-lg border border-secondary/5">
                <span className="material-symbols-outlined text-error mt-0.5">block</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-medium mb-1">
                    Missing {activeIngredient}?
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">arrow_forward</span>
                    Swap with {substituteData.substitute} ({substituteData.ratio})
                  </p>
                </div>
              </div>
            </div>

            <p className="font-body-md text-xs text-on-surface-variant/90 mb-4 bg-surface-container-high/40 p-3 rounded-xl border border-secondary/5">
              💡 <span className="font-semibold text-on-surface">Chef's Tip:</span> {substituteData.culinaryTip}
            </p>

            <button
              onClick={() => {
                onApplySwap(activeIngredient, substituteData.substitute);
                onClose();
              }}
              className="w-full sm:w-auto bg-primary-container hover:bg-primary-fixed text-on-primary-container font-label-md text-label-md font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined">check_circle</span>
              Apply Substitutions
            </button>
          </div>

          {/* Inventory Section */}
          <div className="mb-stack-md">
            <h3 className="font-headline-md text-[20px] leading-[28px] font-semibold text-on-surface mb-4">
              Inventory
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar border-b border-surface-variant">
              <button className="shrink-0 px-4 py-2 border-b-2 border-primary text-primary font-label-md text-label-md">
                All
              </button>
              <button className="shrink-0 px-4 py-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md text-label-md">
                Dairy &amp; Eggs
              </button>
              <button className="shrink-0 px-4 py-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md text-label-md">
                Produce
              </button>
              <button className="shrink-0 px-4 py-2 border-b-2 border-transparent text-on-surface-variant hover:text-on-surface font-label-md text-label-md">
                Spices &amp; Oils
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-secondary/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden border border-outline-variant/30 shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Eggs"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiUQ_3e7KY9HXSHTtykq1vxuA_rUhlo0KozW58mUN2XPPrc9VzXgSBfpcdLV9Plr8SVmSzwirvqiUHREL9fgHUnsttZVCsuPiRwnQ7al0WM-hj3bws5ZoMo2rlfgfWxWPqXjKHy6J57KGgC1k59mlIPJOmwbZ8Dk2BW6lZexP1m-rP9TpXSf6NssXKlU89dUF45XbQeaQW1QoXDlFN4Xi_T-Q3gS_MT7JcjuDZirGQOPmmLGerBbKGy7S7PUoAajn9q2BzwhPVzes"
                    />
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">Large Eggs</p>
                    <p className="font-body-md text-[14px] leading-[20px] text-on-surface-variant">6 items</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-on-surface-variant">Fresh</span>
                    <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-secondary/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface rounded-lg overflow-hidden border border-outline-variant/30 shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      alt="Greek Yogurt"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1CjNX1RtGFAnoL1ka_hdi8XFHGWt-MHyfs-AubMqIdqiCb-wMftVm0YPQBxPg-kbyE_rYqknn7um_ZpRyF2NaSY3MDSPuoJ9Tao8TGGBvkiyXI1dhbrgK-UYNt4TrZKB73JHnE2j0ocTLU4aDW8rgA5IrhEuimU2lGiAfOfJ80HltBgivyRkJddav2WxFXxUE90fryQ1YcmRJl1p1t4bw3H6dJKhRR6sIUhtwG5p4xqXMlH9tE2PuVnfahRTEm38ur7Z09ojmmow"
                    />
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-medium">Greek Yogurt</p>
                    <p className="font-body-md text-[14px] leading-[20px] text-on-surface-variant">1 tub (500g)</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-error font-medium">1 Day Left</span>
                    <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="w-1/4 h-full bg-error rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

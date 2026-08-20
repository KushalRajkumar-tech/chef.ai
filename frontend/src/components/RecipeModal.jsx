import React, { useState, useEffect } from 'react';

export default function RecipeModal({ recipe, onClose, onOpenSubstituteDrawer }) {
  if (!recipe) return null;

  const [servings, setServings] = useState(2);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState(() => {
    const initial = new Set();
    recipe.ingredients?.forEach((ing, idx) => {
      if (ing.available !== false) initial.add(idx);
    });
    return initial;
  });

  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleStep = (index) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleIngredient = (index) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div className="bg-background border border-secondary/15 rounded-none md:rounded-3xl w-full max-w-3xl max-h-[100vh] md:max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative text-on-surface hide-scrollbar">
        {/* Hero Header */}
        <header className="relative w-full h-[320px] md:h-[360px] overflow-hidden shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${recipe.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-dim/60 via-transparent to-surface-dim" />

          {/* Top Controls */}
          <div className="absolute top-0 w-full flex justify-between items-center px-4 py-4 z-20">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors shadow-sm">
              <span className="material-symbols-outlined">bookmark_border</span>
            </button>
          </div>

          {/* Bottom Title Info */}
          <div className="absolute bottom-0 w-full px-gutter pb-gutter z-20 flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3">
              <span className="px-3 py-1 bg-primary-container/20 text-primary-container rounded-full font-label-sm border border-primary-container/30 backdrop-blur-sm">
                {recipe.cuisine || 'Italian'} • {recipe.prepTime || 20} mins
              </span>
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-x-4 mt-1">
              <div className="flex items-center glass-panel rounded-full px-2 py-1">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="font-label-md text-on-surface px-3 text-center">{servings} Servings</span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="px-gutter py-stack-md flex flex-col gap-y-stack-lg max-w-3xl mx-auto w-full">
          {/* Nutrition Bar */}
          <section className="card-panel p-4 flex flex-col gap-y-3">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">Calories per serving</span>
              <span className="font-headline-md text-primary-fixed">{recipe.calories || 520} kcal</span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden flex">
              <div className="bg-primary-container h-full w-[45%]" />
              <div className="bg-secondary-fixed h-full w-[35%]" />
              <div className="bg-tertiary-container h-full w-[20%]" />
            </div>
            <div className="flex justify-between font-label-sm text-on-surface-variant text-xs pt-1">
              <span>Protein {recipe.macros?.protein || '18g'}</span>
              <span>Carbs {recipe.macros?.carbs || '62g'}</span>
              <span>Fats {recipe.macros?.fats || '24g'}</span>
            </div>
          </section>

          {/* Active Timer Pill */}
          <section className="flex justify-center">
            <div className="glass-panel px-6 py-2.5 rounded-full flex items-center gap-4 shadow-lg border-primary-container/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container animate-pulse">timer</span>
                <span className="font-headline-md font-bold text-primary-container">
                  {formatTimer(timerSeconds)}
                </span>
              </div>
              <div className="flex items-center gap-2 border-l border-outline/30 pl-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 rounded-full text-primary hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined">
                    {isTimerRunning ? 'pause' : 'play_arrow'}
                  </span>
                </button>
                <button
                  onClick={() => { setIsTimerRunning(false); setTimerSeconds(60); }}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined">replay</span>
                </button>
              </div>
            </div>
          </section>

          {/* Ingredients Section */}
          <section className="flex flex-col gap-y-4">
            <h2 className="font-headline-md text-on-surface">Ingredients</h2>
            <div className="card-panel p-2 flex flex-col divide-y divide-secondary/5">
              {recipe.ingredients?.map((ing, idx) => {
                const name = typeof ing === 'string' ? ing : ing.name;
                const isChecked = checkedIngredients.has(idx);

                return (
                  <div key={idx} className="flex items-center justify-between p-3 hover:bg-surface-container-high/50 rounded-xl transition-colors">
                    <label className="flex items-center gap-x-4 cursor-pointer select-none flex-1">
                      <div className="relative flex items-center justify-center w-6 h-6 rounded border border-outline group-hover:border-primary-container transition-colors">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIngredient(idx)}
                          className="peer sr-only"
                        />
                        <span className="material-symbols-outlined text-[18px] opacity-0 peer-checked:opacity-100 text-primary-container transition-opacity absolute pointer-events-none">
                          check
                        </span>
                      </div>
                      <span className={`font-body-md ${isChecked ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                        {name}
                      </span>
                    </label>

                    {ing.available === false && (
                      <button
                        onClick={() => onOpenSubstituteDrawer(name)}
                        className="px-3 py-1 rounded-full bg-primary-container/10 text-primary-container border border-primary-container/30 font-label-sm hover:bg-primary-container/20 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">auto_awesome</span> Swap
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Instructions */}
          <section className="flex flex-col gap-y-4 pb-12">
            <h2 className="font-headline-md text-on-surface">Instructions</h2>
            <div className="flex flex-col gap-y-4">
              {recipe.instructions?.map((step, idx) => {
                const isDone = completedSteps.has(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`card-panel p-5 flex gap-x-4 cursor-pointer transition-all ${isDone ? 'opacity-50' : 'hover:border-primary-container/40'}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-headline-md ${isDone ? 'bg-primary-container text-on-primary-container border-primary-container' : 'bg-surface-container-high border-outline/30 text-primary-container'}`}>
                      {isDone ? <span className="material-symbols-outlined text-sm">check</span> : idx + 1}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <h3 className="font-label-md text-primary-container uppercase">Step {idx + 1}</h3>
                      <p className={`font-body-md ${isDone ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

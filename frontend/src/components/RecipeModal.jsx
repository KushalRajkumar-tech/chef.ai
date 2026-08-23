import React, { useState, useEffect } from 'react';

export default function RecipeModal({ recipe, onClose, onOpenSubstituteDrawer }) {
  if (!recipe) return null;

  const defaultServings = recipe.defaultServings || 2;
  const [servings, setServings] = useState(defaultServings);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  
  // Cook-Along Step-by-Step Mode State
  const [isCookAlongActive, setIsCookAlongActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Active Countdown Timer State
  const instructionsList = recipe.instructions || [];
  const currentStep = instructionsList[currentStepIndex] || {};
  const currentStepTimerMin = typeof currentStep === 'object' ? currentStep.timerMinutes || 0 : 0;
  
  const [timerSeconds, setTimerSeconds] = useState((currentStepTimerMin || 5) * 60);
  const [activeTimerLabel, setActiveTimerLabel] = useState(currentStep.title || 'Cooking Timer');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  // When step changes in cook-along mode, update timer if step has one
  useEffect(() => {
    if (isCookAlongActive && instructionsList[currentStepIndex]) {
      const step = instructionsList[currentStepIndex];
      const mins = typeof step === 'object' ? step.timerMinutes || 0 : 0;
      if (mins > 0) {
        setTimerSeconds(mins * 60);
        setActiveTimerLabel(typeof step === 'object' ? step.title : `Step ${currentStepIndex + 1}`);
        setIsTimerRunning(false);
        setTimerFinished(false);
      }
    }
  }, [currentStepIndex, isCookAlongActive]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerFinished(true);
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch {}
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

  const startStepTimer = (minutes, label) => {
    if (!minutes) return;
    setTimerSeconds(minutes * 60);
    setActiveTimerLabel(label || 'Step Timer');
    setIsTimerRunning(true);
    setTimerFinished(false);
  };

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scaleAmount = (amountStr) => {
    if (!amountStr) return '';
    const numeric = parseFloat(amountStr);
    if (isNaN(numeric)) return amountStr;
    const ratio = servings / defaultServings;
    const scaled = numeric * ratio;
    return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(1);
  };

  const totalSteps = instructionsList.length;
  const activeStepObj = instructionsList[currentStepIndex] || {};
  const activeStepTitle = typeof activeStepObj === 'object' ? activeStepObj.title : `Step ${currentStepIndex + 1}`;
  const activeStepDesc = typeof activeStepObj === 'object' ? activeStepObj.description : activeStepObj;
  const isCurrentStepDone = completedSteps.has(currentStepIndex);

  const imgSrc = recipe.imageUrl || recipe.image || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#131313] border border-secondary/15 rounded-none md:rounded-3xl w-full max-w-3xl max-h-[100vh] md:max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative text-on-surface hide-scrollbar">
        
        {/* ========================================================================= */}
        {/* MODE 1: INTERACTIVE STEP-BY-STEP COOK-ALONG MODE                          */}
        {/* ========================================================================= */}
        {isCookAlongActive ? (
          <div className="flex flex-col min-h-[550px] p-6 md:p-8 justify-between">
            {/* Top Bar with Progress */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setIsCookAlongActive(false)}
                  className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-white bg-surface-container px-3 py-1.5 rounded-full border border-outline/20 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Exit Cook-Along
                </button>

                <span className="font-label-md text-xs text-primary font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  Step {currentStepIndex + 1} of {totalSteps}
                </span>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-primary-container transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                />
              </div>

              {/* Step Detail Card */}
              <div className="bg-[#1C1C1C] rounded-2xl p-6 md:p-8 border border-primary/20 shadow-xl relative overflow-hidden mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary-container text-black font-bold flex items-center justify-center text-sm">
                    {currentStepIndex + 1}
                  </span>
                  <h2 className="font-headline-lg-mobile md:font-headline-lg text-lg md:text-xl font-bold text-white">
                    {activeStepTitle}
                  </h2>
                </div>

                <p className="text-base md:text-lg text-on-surface leading-relaxed mb-6 font-normal">
                  {activeStepDesc}
                </p>

                {/* Big Step Timer if available */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-black/40 rounded-xl border border-secondary/10">
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined text-2xl ${isTimerRunning ? 'text-primary animate-spin' : 'text-on-surface-variant'}`}>
                      timer
                    </span>
                    <div>
                      <div className="text-[11px] text-on-surface-variant uppercase font-bold">{activeTimerLabel}</div>
                      <div className="font-headline-lg text-2xl font-bold text-primary font-mono">
                        {formatTimer(timerSeconds)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="bg-primary-container hover:bg-primary-fixed text-black font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">
                        {isTimerRunning ? 'pause' : 'play_arrow'}
                      </span>
                      {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                    </button>
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        const mins = typeof activeStepObj === 'object' ? activeStepObj.timerMinutes || 5 : 5;
                        setTimerSeconds(mins * 60);
                        setTimerFinished(false);
                      }}
                      className="text-on-surface-variant hover:text-white p-2 rounded-lg bg-surface-container"
                      title="Reset Timer"
                    >
                      <span className="material-symbols-outlined text-base">replay</span>
                    </button>
                  </div>
                </div>

                {timerFinished && (
                  <div className="mt-3 p-3 bg-error-container/30 border border-error text-error rounded-xl text-xs font-bold text-center animate-bounce">
                    ⏰ Time is up for {activeStepTitle}!
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-secondary/10">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-xs font-bold disabled:opacity-30 hover:bg-surface-container-high transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Previous Step
              </button>

              <button
                onClick={() => {
                  toggleStep(currentStepIndex);
                  if (currentStepIndex < totalSteps - 1) {
                    setCurrentStepIndex(currentStepIndex + 1);
                  } else {
                    setIsCookAlongActive(false);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-primary-container text-black font-bold text-xs hover:bg-primary-fixed transition-all flex items-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">
                  {currentStepIndex === totalSteps - 1 ? 'celebration' : 'check'}
                </span>
                {currentStepIndex === totalSteps - 1 ? 'Complete Cooking 🎉' : 'Mark Done & Next'}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODE 2: STANDARD OVERVIEW & RECIPE DETAILS                                */
          /* ========================================================================= */
          <>
            {/* Hero Header */}
            <header className="relative w-full h-[320px] md:h-[360px] overflow-hidden shrink-0">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${imgSrc}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-black/60" />

              {/* Top Controls */}
              <div className="absolute top-0 w-full flex justify-between items-center px-4 py-4 z-20">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-black/90 transition-colors shadow-md border border-white/10"
                  title="Close"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>
                
                {/* Hero Cook-Along Button */}
                <button
                  onClick={() => setIsCookAlongActive(true)}
                  className="bg-primary-container hover:bg-primary-fixed text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                >
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    skillet
                  </span>
                  Start Cook-Along
                </button>
              </div>

              {/* Bottom Title Info */}
              <div className="absolute bottom-0 w-full px-6 pb-6 z-20 flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                  <span className="px-3 py-0.5 bg-primary-container/20 text-primary-container rounded-full text-xs font-bold border border-primary-container/30">
                    {recipe.cuisine || 'International'}
                  </span>
                  <span className="px-3 py-0.5 bg-surface-container text-on-surface-variant rounded-full text-xs">
                    {recipe.calories || 520} kcal
                  </span>
                </div>

                <h1 className="font-headline-lg-mobile md:font-headline-lg text-white font-bold leading-tight">
                  {recipe.title}
                </h1>

                {/* Serving Size Stepper */}
                <div className="flex items-center gap-x-4 mt-2">
                  <div className="flex items-center bg-surface-container-high/80 backdrop-blur-md rounded-full px-2 py-1 border border-outline/20">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-primary-container hover:text-black transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-label-md text-white font-bold px-3 text-sm">{servings} Servings</span>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-primary-container hover:text-black transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Body */}
            <div className="px-6 py-6 flex flex-col gap-y-6 max-w-3xl mx-auto w-full">
              {/* Nutrition & Macros Bar */}
              <section className="bg-[#1E1E1E] rounded-2xl p-5 border border-secondary/10 flex flex-col gap-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Estimated Macros (for {servings} serving{servings > 1 ? 's' : ''})</span>
                  <span className="font-bold text-primary">{recipe.calories ? Math.round(recipe.calories * (servings / defaultServings)) : 520} kcal</span>
                </div>
                <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden flex gap-1">
                  <div className="bg-primary-container h-full w-[45%]" title="Protein" />
                  <div className="bg-secondary-fixed h-full w-[35%]" title="Carbs" />
                  <div className="bg-tertiary-container h-full w-[20%]" title="Fats" />
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant font-medium pt-1">
                  <span>🍗 Protein: {recipe.macros?.protein || '24g'}</span>
                  <span>🌾 Carbs: {recipe.macros?.carbs || '65g'}</span>
                  <span>🥑 Fats: {recipe.macros?.fats || '18g'}</span>
                </div>
              </section>

              {/* Cook-Along Hero Banner */}
              <div className="bg-gradient-to-r from-primary/15 via-[#1E1E1E] to-[#1E1E1E] border border-primary/30 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-black flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-xl">skillet</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Ready to Cook?</h3>
                    <p className="text-xs text-on-surface-variant">Step-by-step guidance with timers and voice prompts</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCookAlongActive(true)}
                  className="bg-primary-container text-black font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-primary-fixed transition-all shrink-0"
                >
                  Start Cook-Along
                </button>
              </div>

              {/* Ingredients Section */}
              <section className="flex flex-col gap-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="font-headline-md text-lg font-bold text-on-surface">Ingredients</h2>
                  <span className="text-xs text-on-surface-variant">Check off as you cook</span>
                </div>

                <div className="bg-[#1E1E1E] rounded-2xl p-3 border border-secondary/10 flex flex-col divide-y divide-secondary/5">
                  {recipe.ingredients?.map((ing, idx) => {
                    const name = typeof ing === 'string' ? ing : ing.name;
                    const amount = typeof ing === 'object' && ing.amount ? scaleAmount(ing.amount) : '';
                    const unit = typeof ing === 'object' && ing.unit ? ing.unit : '';
                    const displayLabel = amount ? `${amount} ${unit} ${name}` : name;
                    const isChecked = checkedIngredients.has(idx);
                    const isMissing = ing.inPantry === false || ing.isMissing === true;

                    return (
                      <div key={idx} className="flex items-center justify-between p-3 hover:bg-surface-container/50 rounded-xl transition-colors">
                        <label className="flex items-center gap-x-3 cursor-pointer select-none flex-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleIngredient(idx)}
                            className="w-5 h-5 rounded border-outline text-primary focus:ring-primary bg-surface-container cursor-pointer accent-primary"
                          />
                          <span className={`text-sm ${isChecked ? 'line-through text-on-surface-variant/60' : 'text-on-surface'}`}>
                            {displayLabel}
                          </span>
                        </label>

                        {isMissing && (
                          <button
                            onClick={() => onOpenSubstituteDrawer(name)}
                            className="px-3 py-1 rounded-full bg-primary-container/15 text-primary border border-primary/30 text-xs font-bold hover:bg-primary-container/30 transition-colors flex items-center gap-1 shrink-0 ml-2"
                          >
                            <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Swap
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* AI Substitution Card if provided */}
              {recipe.substitutionTip && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">tips_and_updates</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      AI Pantry Tip: {recipe.substitutionTip.missingItem}
                    </div>
                    <p className="text-xs text-on-surface font-medium mb-1">
                      💡 {recipe.substitutionTip.recommendedSwap}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {recipe.substitutionTip.swapReason}
                    </p>
                  </div>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              <section className="flex flex-col gap-y-3 pb-8">
                <div className="flex justify-between items-center">
                  <h2 className="font-headline-md text-lg font-bold text-on-surface">Step-by-Step Instructions</h2>
                  <button
                    onClick={() => setIsCookAlongActive(true)}
                    className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">play_arrow</span>
                    Full Cook-Along Mode
                  </button>
                </div>
                
                <div className="flex flex-col gap-y-3">
                  {instructionsList.map((stepObj, idx) => {
                    const isObject = typeof stepObj === 'object';
                    const stepNum = isObject ? stepObj.stepNumber || idx + 1 : idx + 1;
                    const title = isObject ? stepObj.title : `Step ${stepNum}`;
                    const description = isObject ? stepObj.description : stepObj;
                    const timerMin = isObject ? stepObj.timerMinutes : 0;
                    const isDone = completedSteps.has(idx);

                    return (
                      <div
                        key={idx}
                        className={`bg-[#1E1E1E] rounded-2xl p-5 border transition-all ${
                          isDone 
                            ? 'opacity-60 border-secondary/5' 
                            : 'border-secondary/10 hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3.5 flex-1">
                            <button
                              onClick={() => toggleStep(idx)}
                              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                                isDone 
                                  ? 'bg-primary-container text-black border-primary-container' 
                                  : 'bg-surface-container border-outline/30 text-primary'
                              }`}
                            >
                              {isDone ? <span className="material-symbols-outlined text-sm">check</span> : stepNum}
                            </button>
                            <div>
                              <h3 className="text-sm font-bold text-primary mb-1">{title}</h3>
                              <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                                {description}
                              </p>
                            </div>
                          </div>

                          {timerMin > 0 && (
                            <button
                              onClick={() => {
                                setCurrentStepIndex(idx);
                                setIsCookAlongActive(true);
                              }}
                              className="shrink-0 flex items-center gap-1 bg-surface-container hover:bg-primary-container hover:text-black text-primary px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary/20 transition-colors"
                              title="Start step timer"
                            >
                              <span className="material-symbols-outlined text-[14px]">timer</span>
                              {timerMin}m
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

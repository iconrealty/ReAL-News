import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CityInfo, NewsCategory, LiveMortgageRates } from '../types';
import { Bookmark, ArrowUp, ArrowDown, Minus, RefreshCw, X, ChevronRight, Calculator } from 'lucide-react';

interface AppleNewsHeaderProps {
  currentCity: CityInfo;
  onOpenCitySelector: () => void;
  onSelectCity?: (city: CityInfo) => void;
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onResetToMain?: () => void;
  liveRates?: LiveMortgageRates | null;
  fredRate?: string;
  rate30Year7DaysAgo?: string;
  rate30YearChange7Days?: number;
  asOfDate?: string;
  onOpenManager?: () => void;
  onOpenNewsManager?: () => void;
  isMonetizationEnabled?: boolean;
  onRefreshRates?: () => void;
  isRefreshingRates?: boolean;
}

export const AppleNewsHeader: React.FC<AppleNewsHeaderProps> = ({
  currentCity,
  onOpenCitySelector,
  activeCategory,
  onSelectCategory,
  savedCount,
  onOpenSavedDrawer,
  onResetToMain,
  liveRates,
  fredRate = '6.89%',
  rate30Year7DaysAgo = '6.81%',
  rate30YearChange7Days,
  asOfDate,
  onOpenManager,
  onOpenNewsManager,
  isMonetizationEnabled = false,
  onRefreshRates,
  isRefreshingRates = false,
}) => {
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);

  // Escape key listener to close modal and prevent body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsRatesModalOpen(false);
      }
    };
    if (isRatesModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isRatesModalOpen]);
  const monthDay = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const categories: { id: NewsCategory; label: string }[] = [
    { id: 'all', label: 'Top Stories' },
    { id: 'market-trends', label: 'Steven Thomas' },
    { id: 'mortgage-calculator', label: 'Mortgage Calculator' },
    { id: 'oc-fast', label: 'OC FastStats' },
    { id: 'real-estate', label: 'Orange County News' },
    { id: 'team-news', label: 'Team News & Events' },
    { id: 'restaurants-bars', label: 'New Restaurants & Bars' },
  ];

  // Calculate 7-day prior comparison strictly from current rate vs 7-day prior rate
  const currentNum = parseFloat((fredRate || '6.89%').replace(/[^0-9.]/g, '')) || 6.89;
  const priorNum = parseFloat((rate30Year7DaysAgo || '6.81%').replace(/[^0-9.]/g, '')) || 6.81;
  const computedDiff = parseFloat((currentNum - priorNum).toFixed(2));

  const isUp = computedDiff > 0;
  const isDown = computedDiff < 0;

  return (
    <header className="sticky top-0 z-30 bg-[#F2F2F7]/95 backdrop-blur-md border-b border-slate-300/80 text-slate-900 shadow-xs pt-safe">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 space-y-2.5 sm:space-y-3">
        
        {/* Top Header Row: Title on Left, Controls on Right */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Title with "ReaL." typography */}
          <button 
            onClick={() => {
              if (onResetToMain) {
                onResetToMain();
              } else {
                const origin = window.location.origin;
                const pathname = window.location.pathname;
                window.location.href = `${origin}${pathname}?refresh=${Date.now()}`;
              }
            }}
            className="text-left space-y-0.5 group cursor-pointer focus:outline-none active:scale-95 transition-transform touch-manipulation select-none shrink-0"
            title="Refresh App & Return to Main Feed"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tighter text-slate-950 group-hover:text-[#FA2D48] transition-colors leading-none flex items-baseline">
              <span>ReaL</span>
              <span className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none pl-0.5">.</span>
            </h1>
            <p className="text-lg sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#8E8E93] font-sans leading-none pt-0.5 sm:pt-1">
              {monthDay}
            </p>
          </button>

          {/* Right Side: Live Mortgage Rate & Bookmarks */}
          <div className="flex items-center space-x-3">
            {/* Live 30-Day Mortgage Rate Display - Click toggles MND 5 Live Rates Modal */}
            <button
              onClick={() => {
                setIsRatesModalOpen((prev) => !prev);
                if (!isRatesModalOpen && onRefreshRates) onRefreshRates();
              }}
              className="flex flex-col items-end text-right group cursor-pointer hover:opacity-80 transition-opacity shrink-0 px-1 select-none touch-manipulation min-h-[44px] justify-center"
              title="Mortgage News Daily Live Rates - Click to view 5 live rates"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FA2D48] leading-none flex items-center gap-1">
                  <span>MND Live 30-Yr</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </span>
                {isRefreshingRates ? (
                  <RefreshCw className="w-2.5 h-2.5 text-[#FA2D48] animate-spin inline" />
                ) : isUp ? (
                  <span className="inline-flex items-center text-[10px] font-black text-emerald-600">
                    <ArrowUp className="w-2.5 h-2.5 stroke-[3] inline mr-0.5" />
                    +{Math.abs(computedDiff).toFixed(2)}%
                  </span>
                ) : isDown ? (
                  <span className="inline-flex items-center text-[10px] font-black text-rose-600">
                    <ArrowDown className="w-2.5 h-2.5 stroke-[3] inline mr-0.5" />
                    -{Math.abs(computedDiff).toFixed(2)}%
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-black text-slate-500">
                    <Minus className="w-2.5 h-2.5 inline mr-0.5" />
                    0.00%
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-0.5">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 font-sans tracking-tight leading-none group-hover:text-[#FA2D48] transition-colors">
                  {fredRate}
                </span>
              </div>

              <div className="flex items-center justify-end gap-1 text-[9px] font-semibold text-slate-500 pt-0.5">
                <span>7d prior:</span>
                <span className="font-bold text-slate-700">{rate30Year7DaysAgo}</span>
              </div>
            </button>

            {/* Saved Bookmarks Button */}
            <button
              onClick={onOpenSavedDrawer}
              className="p-2 sm:p-2.5 rounded-full bg-[#EBEBEF] hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 text-slate-800 relative transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
              title="Saved Bookmarks"
            >
              <Bookmark className="w-4 h-4 text-[#FA2D48]" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FA2D48] text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <div className="flex items-center space-x-2 py-0.5 min-w-max">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'all' && onResetToMain) {
                      onResetToMain();
                    } else {
                      onSelectCategory(cat.id);
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-4 py-2 rounded-full text-[13.5px] sm:text-sm font-bold tracking-tight transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#FA2D48] text-white shadow-xs font-extrabold'
                      : 'bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-950 border border-slate-200/90'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Simple, Minimalistic Mortgage News Daily Rates Modal mounted directly to document.body via Portal */}
      {isRatesModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          id="mnd-header-rates-modal-backdrop"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
          onClick={() => setIsRatesModalOpen(false)}
        >
          <div
            id="mnd-header-rates-modal-card"
            className="bg-white rounded-3xl max-w-md w-full my-auto max-h-[88vh] flex flex-col p-5 sm:p-6 shadow-2xl border border-slate-200 relative text-left overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight font-sans">
                  Daily Rates
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {onRefreshRates && (
                  <button
                    type="button"
                    id="header-modal-sync-rates-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRefreshRates();
                    }}
                    disabled={isRefreshingRates}
                    className="min-h-[38px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer touch-manipulation active:scale-95 disabled:opacity-50 select-none"
                    title="Sync Latest Live Rates"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#FA2D48] ${isRefreshingRates ? 'animate-spin' : ''}`} />
                    <span>{isRefreshingRates ? 'Syncing...' : 'Sync Rates'}</span>
                  </button>
                )}
                <button
                  type="button"
                  id="close-mnd-header-rates-modal-btn"
                  onClick={() => setIsRatesModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5 Live Rates List - Apple / Tesla Minimalist Typography */}
            <div className="divide-y divide-slate-100 overflow-y-auto flex-1 py-1">
              {[
                {
                  id: '30-yr-fixed',
                  label: '30-Yr Fixed',
                  tag: 'MND Daily Index',
                  rate: liveRates?.mortgage30Year || fredRate || '6.89%',
                },
                {
                  id: '15-yr-fixed',
                  label: '15-Yr Fixed',
                  tag: 'MND Daily Index',
                  rate: liveRates?.mortgage15Year || '6.49%',
                },
                {
                  id: '30-yr-jumbo',
                  label: '30-Yr Jumbo',
                  tag: 'MND Daily Index',
                  rate: liveRates?.jumbo30Year || '7.06%',
                },
                {
                  id: '30-yr-fha',
                  label: '30-Yr FHA',
                  tag: 'MND Daily Index',
                  rate: liveRates?.fha30Year || '6.44%',
                },
                {
                  id: '30-yr-va',
                  label: '30-Yr VA',
                  tag: 'MND Daily Index',
                  rate: liveRates?.va30Year || '6.46%',
                },
                {
                  id: 'freddie-mac-pmms',
                  label: 'Freddie Mac (PMMS)',
                  tag: 'Weekly Survey',
                  rate: liveRates?.freddieMac30Year || '6.71%',
                },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  id={`mnd-header-rate-${r.id}`}
                  onClick={() => {
                    setIsRatesModalOpen(false);
                    onSelectCategory('mortgage-calculator');
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('select-rate-program', { detail: r.label }));
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between text-left group"
                >
                  <div className="flex flex-col">
                    <span className="text-[14.5px] font-semibold text-slate-800 group-hover:text-slate-950 tracking-tight font-sans">
                      {r.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {r.tag}
                    </span>
                  </div>

                  <span className="text-base font-bold text-slate-900 group-hover:text-[#FA2D48] tracking-tight tabular-nums font-sans transition-colors">
                    {r.rate}
                  </span>
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                id="open-calculator-from-mnd-modal-btn"
                onClick={() => {
                  setIsRatesModalOpen(false);
                  onSelectCategory('mortgage-calculator');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Calculator className="w-3.5 h-3.5 text-[#FA2D48]" />
                <span>Calculate Payments</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};


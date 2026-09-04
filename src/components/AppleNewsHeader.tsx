import React from 'react';
import { CityInfo, NewsCategory } from '../types';
import { Bookmark, ArrowUp, ArrowDown, Minus, RefreshCw } from 'lucide-react';

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
  fredRate = '6.88%',
  rate30Year7DaysAgo = '6.74%',
  rate30YearChange7Days,
  asOfDate,
  onOpenManager,
  onOpenNewsManager,
  isMonetizationEnabled = false,
  onRefreshRates,
  isRefreshingRates = false,
}) => {
  const monthDay = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const categories: { id: NewsCategory; label: string }[] = [
    { id: 'all', label: 'Top Stories' },
    { id: 'market-trends', label: 'Steven Thomas' },
    { id: 'mortgage-calculator', label: 'Mortgage Calculator' },
    { id: 'real-estate', label: 'Orange County News' },
    { id: 'oc-fast', label: 'OC FastStats' },
    { id: 'team-news', label: 'Team News & Events' },
    { id: 'restaurants-bars', label: 'New Restaurants & Bars' },
  ];

  // Calculate 7-day prior comparison
  const currentNum = parseFloat((fredRate || '6.88%').replace(/[^0-9.]/g, '')) || 6.88;
  const priorNum = parseFloat((rate30Year7DaysAgo || '6.74%').replace(/[^0-9.]/g, '')) || 6.74;
  const computedDiff = typeof rate30YearChange7Days === 'number'
    ? rate30YearChange7Days
    : parseFloat((currentNum - priorNum).toFixed(2));

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
            {/* Live 30-Day Mortgage Rate Display */}
            <button
              onClick={() => {
                if (onRefreshRates) onRefreshRates();
                onSelectCategory('mortgage-calculator');
              }}
              className="flex flex-col items-end text-right group cursor-pointer hover:opacity-80 transition-opacity shrink-0 px-1 select-none"
              title="Mortgage News Daily Live 30-Yr Rate - Click to sync & calculate"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FA2D48] leading-none">
                  MND Live 30-Yr
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#FA2D48] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
};


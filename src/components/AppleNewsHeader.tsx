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
  mortgage15Year?: string;
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
  fredRate = '6.91%',
  mortgage15Year = '6.50%',
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
  const currentNum = parseFloat((fredRate || '6.91%').replace(/[^0-9.]/g, '')) || 6.91;
  const priorNum = parseFloat((rate30Year7DaysAgo || '6.74%').replace(/[^0-9.]/g, '')) || 6.74;
  const computedDiff = typeof rate30YearChange7Days === 'number'
    ? rate30YearChange7Days
    : parseFloat((currentNum - priorNum).toFixed(2));

  const isUp = computedDiff > 0;
  const isDown = computedDiff < 0;

  return (
    <header className="sticky top-0 z-30 bg-[#F2F2F7]/95 backdrop-blur-md border-b border-slate-300/80 text-slate-900 shadow-xs pt-safe">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 space-y-2.5 sm:space-y-3">
        
        {/* Top Header Row: Title & Actions */}
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
              <span className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none pl-0.5 text-[#FA2D48]">.</span>
            </h1>
            <p className="text-lg sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#8E8E93] font-sans leading-none pt-0.5 sm:pt-1">
              {monthDay}
            </p>
          </button>

          {/* Desktop Right Side: Live Mortgage Rate & Bookmarks */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Desktop 30-Day Mortgage Rate Display */}
            <button
              onClick={() => {
                if (onRefreshRates) onRefreshRates();
                onSelectCategory('mortgage-calculator');
              }}
              className="flex flex-col items-end text-right group cursor-pointer hover:opacity-80 transition-opacity shrink-0 px-1 select-none"
              title="Mortgage News Daily Live 30-Yr Rate - Click to sync & calculate"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FA2D48] leading-none">
                  MND Live 30-Yr Rate
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isRefreshingRates ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FA2D48] bg-rose-50 px-1.5 py-0.5 rounded-md">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Syncing...
                  </span>
                ) : isUp ? (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <ArrowUp className="w-3 h-3 stroke-[3]" />
                    +{Math.abs(computedDiff).toFixed(2)}%
                  </span>
                ) : isDown ? (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                    <ArrowDown className="w-3 h-3 stroke-[3]" />
                    -{Math.abs(computedDiff).toFixed(2)}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    <Minus className="w-3 h-3" />
                    0.00%
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-2xl lg:text-3xl font-black text-slate-950 font-sans tracking-tight leading-none group-hover:text-[#FA2D48] transition-colors">
                  {fredRate}
                </span>
                {mortgage15Year && (
                  <span className="text-xs font-bold text-slate-500">
                    15-Yr: <strong className="text-slate-800">{mortgage15Year}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold pt-0.5">
                <span>7-Day Prior: <span className="font-bold text-slate-700">{rate30Year7DaysAgo}</span></span>
                <span className="text-slate-300">•</span>
                <span className="font-medium text-slate-400">{asOfDate || 'Live Market Index'}</span>
              </div>
            </button>

            {/* Desktop Saved Bookmarks Button */}
            <button
              onClick={onOpenSavedDrawer}
              className="p-2.5 rounded-full bg-[#EBEBEF] hover:bg-slate-200 border border-slate-200 text-slate-700 relative transition-all cursor-pointer shrink-0"
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

          {/* Mobile Right Side: Bookmark & Quick Sync */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenSavedDrawer}
              className="p-2 rounded-full bg-[#EBEBEF] active:bg-slate-300 border border-slate-200/80 text-slate-800 relative transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0"
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

        {/* Dedicated Mobile Live Rate Bar - Ultra Clear, Touch-Friendly, Never Clipped */}
        <div className="sm:hidden bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div 
              onClick={() => onSelectCategory('mortgage-calculator')}
              className="flex items-center gap-2 cursor-pointer active:opacity-75 flex-1 min-w-0"
            >
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FA2D48] leading-none">
                    MND Live Rates
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {isUp && (
                    <span className="inline-flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
                      <ArrowUp className="w-2.5 h-2.5 stroke-[3] inline mr-0.5" />
                      +{Math.abs(computedDiff).toFixed(2)}%
                    </span>
                  )}
                  {isDown && (
                    <span className="inline-flex items-center text-[10px] font-black text-rose-600 bg-rose-50 px-1 py-0.2 rounded">
                      <ArrowDown className="w-2.5 h-2.5 stroke-[3] inline mr-0.5" />
                      -{Math.abs(computedDiff).toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 pt-0.5 flex-wrap">
                  <span className="text-xl font-black text-slate-950 font-sans tracking-tight leading-none">
                    {fredRate}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    30-Yr Fixed
                  </span>
                  {mortgage15Year && (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      15-Yr {mortgage15Year}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sync Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRefreshRates) onRefreshRates();
                }}
                disabled={isRefreshingRates}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200"
                title="Sync Live Rates from Mortgage News Daily"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#FA2D48] ${isRefreshingRates ? 'animate-spin' : ''}`} />
                <span className="text-[11px] font-extrabold">{isRefreshingRates ? 'Syncing...' : 'Sync'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mini Pills Horizontal Tabs - Clean design without borders */}
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
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation min-h-[36px] flex items-center shadow-xs tracking-tight ${
                    isActive
                      ? 'bg-[#FA2D48] text-white font-black shadow-md ring-2 ring-[#FA2D48]/30'
                      : 'bg-white text-slate-900 font-extrabold hover:bg-slate-100 hover:text-black active:bg-slate-200'
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


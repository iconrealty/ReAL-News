import React from 'react';
import { CityInfo, NewsCategory } from '../types';
import { Bookmark, Search, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface AppleNewsHeaderProps {
  currentCity: CityInfo;
  onOpenCitySelector: () => void;
  onSelectCity?: (city: CityInfo) => void;
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetToMain?: () => void;
  fredRate?: string;
  sevenDaysAgoRate?: string;
  sevenDaysChange?: number;
  asOfDate?: string;
  onOpenManager?: () => void;
  onOpenNewsManager?: () => void;
  isMonetizationEnabled?: boolean;
}

export const AppleNewsHeader: React.FC<AppleNewsHeaderProps> = ({
  currentCity,
  onOpenCitySelector,
  activeCategory,
  onSelectCategory,
  savedCount,
  onOpenSavedDrawer,
  searchQuery,
  onSearchChange,
  onResetToMain,
  fredRate = '6.81%',
  sevenDaysAgoRate = '6.89%',
  sevenDaysChange = -0.08,
  asOfDate,
  onOpenManager,
  onOpenNewsManager,
  isMonetizationEnabled = false,
}) => {
  const monthDay = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const isUp = (sevenDaysChange || 0) > 0;
  const isDown = (sevenDaysChange || 0) < 0;
  const changeFormatted = sevenDaysChange !== undefined 
    ? `${isUp ? '+' : ''}${sevenDaysChange.toFixed(2)}%`
    : '';

  const categories: { id: NewsCategory; label: string }[] = [
    { id: 'all', label: 'Top Stories' },
    { id: 'mortgage-calculator', label: 'Mortgage Calculator' },
    { id: 'real-estate', label: 'Orange County News' },
    { id: 'market-trends', label: 'Steven Thomas' },
    { id: 'oc-fast', label: 'OC FastStats' },
    { id: 'team-news', label: 'Team News & Events' },
    { id: 'restaurants-bars', label: 'New Restaurants & Bars' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F2F2F7]/95 backdrop-blur-md border-b border-slate-300/80 text-slate-900 shadow-xs pt-safe">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 space-y-2.5 sm:space-y-3">
        
        {/* Top Header Row: Title on Left, Controls on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          
          {/* Logo & Dynamic Apple-Style Date */}
          <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto">
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
              className="text-left space-y-0.5 group cursor-pointer focus:outline-none active:scale-95 transition-transform touch-manipulation select-none"
              title="Refresh App & Return to Main Feed"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tighter text-slate-950 group-hover:text-[#FA2D48] transition-colors leading-none flex items-baseline">
                <span>ReaL</span>
                <span className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none pl-0.5">.</span>
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#8E8E93] font-sans leading-none pt-1">
                {monthDay}
              </p>
            </button>

            {/* Mobile Top Controls (Quick Mortgage Rate Feed & Bookmarks) */}
            <div className="flex items-center gap-2.5 sm:hidden">
              <button
                onClick={() => onSelectCategory('mortgage-calculator')}
                className="text-right group cursor-pointer hover:opacity-80 transition-opacity bg-white/70 px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs"
                title="Mortgage News Daily Live 30-Yr Rate - Click for Mortgage Calculator"
              >
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#FA2D48] leading-none">
                    30-Yr
                  </span>
                  <span className="text-base font-black text-slate-950 font-sans tracking-tight leading-none group-hover:text-[#FA2D48] transition-colors">
                    {fredRate}
                  </span>
                </div>

                {/* 7 Days Ago Rate & Up/Down Arrow Indicator */}
                <div className="flex items-center justify-end gap-1 pt-0.5">
                  <span className="text-[8px] text-slate-500 font-medium">
                    7d: <span className="font-semibold text-slate-700">{sevenDaysAgoRate}</span>
                  </span>
                  <span 
                    className={`inline-flex items-center text-[9px] font-bold ${
                      isUp ? 'text-emerald-600' : isDown ? 'text-rose-600' : 'text-slate-500'
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    ) : isDown ? (
                      <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                    )}
                    <span>{changeFormatted}</span>
                  </span>
                </div>
              </button>

              <button
                onClick={onOpenSavedDrawer}
                className="p-2 rounded-full bg-[#EBEBEF] active:bg-slate-300 border border-slate-200/80 text-slate-800 relative transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
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

          {/* Search & Controls (Tablet / Desktop Row) */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Desktop 30-Day Mortgage Rate Display with 7-Day Comparison and Arrow */}
            <button
              onClick={() => onSelectCategory('mortgage-calculator')}
              className="hidden sm:flex flex-col items-end text-right group cursor-pointer hover:opacity-90 transition-all shrink-0 px-3 py-1.5 rounded-2xl bg-white/70 hover:bg-white border border-slate-200/90 shadow-2xs"
              title="Mortgage News Daily Live 30-Yr Rate - Click for Mortgage Calculator"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FA2D48] leading-none">
                  MND 30-Yr
                </span>
                <span className="text-2xl lg:text-3xl font-black text-slate-950 font-sans tracking-tight leading-none group-hover:text-[#FA2D48] transition-colors">
                  {fredRate}
                </span>
              </div>
              
              {/* 7 Days Ago Comparison Row */}
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] text-slate-500 font-medium">
                  7d ago: <span className="font-semibold text-slate-700">{sevenDaysAgoRate}</span>
                </span>
                <div 
                  className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    isUp 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/80' 
                      : isDown 
                      ? 'bg-rose-50 text-rose-600 border border-rose-200/80' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                  title={`30-Yr rate compared to 7 days ago (${sevenDaysAgoRate}): ${isUp ? 'Higher (Up)' : isDown ? 'Lower (Down)' : 'Unchanged'}`}
                >
                  {isUp ? (
                    <>
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{changeFormatted}</span>
                    </>
                  ) : isDown ? (
                    <>
                      <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{changeFormatted}</span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-3 h-3 stroke-[2.5]" />
                      <span>0.00%</span>
                    </>
                  )}
                </div>
              </div>
            </button>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search news, venues..."
                className="w-full bg-[#EBEBEF] focus:bg-white border border-transparent focus:border-[#FA2D48] focus:ring-1 focus:ring-[#FA2D48] rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 transition-all outline-none min-h-[38px]"
              />
            </div>

            {/* Desktop Saved Bookmarks Button */}
            <button
              onClick={onOpenSavedDrawer}
              className="hidden sm:flex p-2.5 rounded-full bg-[#EBEBEF] hover:bg-slate-200 border border-slate-200 text-slate-700 relative transition-all cursor-pointer shrink-0"
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

        {/* Categories Bar (Scrollable on mobile) */}
        <div className="flex items-center justify-between border-t border-slate-300/80 pt-2.5 overflow-hidden">
          <nav className="flex space-x-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 text-xs font-semibold">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FA2D48] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 active:bg-slate-300 font-medium'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
};

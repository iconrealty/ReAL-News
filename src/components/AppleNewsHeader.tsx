import React from 'react';
import { CityInfo, NewsCategory } from '../types';
import { Bookmark } from 'lucide-react';

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
  onResetToMain,
  fredRate = '6.81%',
  asOfDate,
  onOpenManager,
  onOpenNewsManager,
  isMonetizationEnabled = false,
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

  return (
    <header className="sticky top-0 z-30 bg-[#F2F2F7]/95 backdrop-blur-md border-b border-slate-300/80 text-slate-900 shadow-xs pt-safe">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 space-y-2.5 sm:space-y-3">
        
        {/* Top Header Row: Title on Left, Controls on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          
          {/* Top Left: Logo & Title with "RL." typography */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
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
            <div className="flex items-center gap-3 sm:hidden">
              <button
                onClick={() => onSelectCategory('mortgage-calculator')}
                className="text-right group cursor-pointer hover:opacity-80 transition-opacity"
                title="Mortgage News Daily Live 30-Yr Rate - Click for Mortgage Calculator"
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FA2D48] leading-none block">
                  MND Live 30-Yr
                </span>
                <span className="text-xl font-black text-slate-950 font-sans tracking-tight leading-none group-hover:text-[#FA2D48] transition-colors pt-0.5 block">
                  {fredRate}
                </span>
                <span className="text-[9px] font-bold text-slate-400 block tracking-tight pt-0.5">
                  {asOfDate || 'Live Market'}
                </span>
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

          {/* Controls (Tablet / Desktop Row: Live Mortgage Rate & Bookmarks) */}
          <div className="flex items-center space-x-3">
            {/* Desktop 30-Day Mortgage Rate Display - Large Text Outside Pill */}
            <button
              onClick={() => onSelectCategory('mortgage-calculator')}
              className="hidden sm:flex flex-col items-end text-right group cursor-pointer hover:opacity-80 transition-opacity shrink-0 px-1"
              title="Mortgage News Daily Live 30-Yr Rate - Click for Mortgage Calculator"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-[#FA2D48] leading-none block">
                MND Live 30-Yr Rate
              </span>
              <span className="text-2xl lg:text-3xl font-black text-slate-950 font-sans tracking-tight leading-none group-hover:text-[#FA2D48] transition-colors pt-0.5 block">
                {fredRate}
              </span>
              <span className="text-[10px] font-bold text-slate-400 block tracking-tight pt-0.5">
                {asOfDate || 'Daily Live Market'}
              </span>
            </button>

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

        {/* Mini Pills Horizontal Tabs */}
        <div className="pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          <div className="flex items-center space-x-2 py-0.5 min-w-max">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              const isStevenThomas = cat.id === 'market-trends';
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
                      : isStevenThomas
                      ? 'bg-white text-[#FA2D48] font-black hover:bg-rose-50 hover:text-[#FA2D48] active:bg-rose-100 border-2 border-rose-200 hover:border-[#FA2D48]/40'
                      : 'bg-white text-slate-900 font-extrabold hover:bg-slate-100 hover:text-black active:bg-slate-200 border-2 border-slate-200 hover:border-slate-300'
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


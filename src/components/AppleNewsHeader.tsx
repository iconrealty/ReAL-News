import React from 'react';
import { CityInfo, NewsCategory, LiveMortgageRates } from '../types';
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
  activeCategory,
  onSelectCategory,
  savedCount,
  onOpenSavedDrawer,
  onResetToMain,
}) => {
  const monthDay = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  const categories: { id: NewsCategory; label: string }[] = [
    { id: 'all', label: 'Home' },
    { id: 'buydown-calculator', label: 'Buydown Calculator' },
    { id: 'commission-calculator', label: 'Commission Calculator' },
    { id: 'mortgage-calculator', label: 'Mortgage Calculator' },
    { id: 'market-trends', label: 'Steven Thomas' },
    { id: 'real-estate', label: 'Orange County News' },
    { id: 'oc-fast', label: 'OC FastStats' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F2F2F7]/95 backdrop-blur-md border-b border-slate-300/80 text-slate-900 shadow-xs pt-safe">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 space-y-2.5 sm:space-y-3">
        
        {/* Top Header Row: Title on Left, Saved Bookmarks on Right */}
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

          {/* Right Side: Clean Bookmarks Button (Mobile-friendly, Zero Overflow) */}
          <div className="flex items-center">
            <button
              onClick={onOpenSavedDrawer}
              className="p-2 sm:p-2.5 rounded-full bg-[#EBEBEF] hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 text-slate-800 relative transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 shadow-2xs active:scale-95 touch-manipulation"
              title="Saved Bookmarks"
              aria-label="View Saved Bookmarks"
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
                  className={`px-4 py-2 rounded-full text-[13.5px] sm:text-sm font-bold tracking-tight transition-all whitespace-nowrap cursor-pointer select-none touch-manipulation active:scale-95 ${
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
    </header>
  );
};

import React from 'react';
import { CityInfo, NewsCategory } from '../types';
import { Newspaper, MapPin, Bookmark, Search } from 'lucide-react';

interface MobileBottomNavProps {
  currentCity: CityInfo;
  onOpenCitySelector: () => void;
  activeCategory: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onResetToMain: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentCity,
  onOpenCitySelector,
  activeCategory,
  onSelectCategory,
  savedCount,
  onOpenSavedDrawer,
  onResetToMain,
}) => {
  const handleSearchClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      setTimeout(() => {
        searchInput.focus();
      }, 250);
    }
  };

  return (
    <div className="sm:hidden fixed bottom-4 left-3 right-3 z-50 max-w-md mx-auto pointer-events-auto">
      <nav className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-full shadow-2xl shadow-slate-900/15 py-1.5 px-3 flex items-center justify-around text-slate-900">
        {/* Top Stories Tab */}
        <button
          onClick={() => {
            onResetToMain();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full min-w-[62px] active:scale-95 transition-all ${
            activeCategory === 'all'
              ? 'text-[#FA2D48] font-black'
              : 'text-slate-600 hover:text-slate-900 font-bold'
          }`}
        >
          <Newspaper className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-extrabold tracking-tight">Top Stories</span>
        </button>

        {/* City Switcher Tab */}
        <button
          onClick={onOpenCitySelector}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-full min-w-[62px] text-slate-600 hover:text-slate-900 active:scale-95 transition-all font-bold"
        >
          <MapPin className="w-5 h-5 mb-0.5 text-[#FA2D48]" />
          <span className="text-[10px] font-extrabold tracking-tight truncate max-w-[68px]">
            {currentCity.name}
          </span>
        </button>

        {/* Search Tab */}
        <button
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-full min-w-[62px] text-slate-600 hover:text-slate-900 active:scale-95 transition-all font-bold"
        >
          <Search className="w-5 h-5 mb-0.5 text-slate-800" />
          <span className="text-[10px] font-extrabold tracking-tight">Search</span>
        </button>

        {/* Saved Bookmarks Tab */}
        <button
          onClick={onOpenSavedDrawer}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-full min-w-[62px] text-slate-600 hover:text-slate-900 relative active:scale-95 transition-all font-bold"
        >
          <div className="relative">
            <Bookmark className="w-5 h-5 mb-0.5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#FA2D48] text-white font-black text-[9px] flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-tight">Saved</span>
        </button>
      </nav>
    </div>
  );
};


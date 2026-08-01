import React from 'react';
import { CityInfo, NewsCategory } from '../types';
import { MapPin, Bookmark, Search } from 'lucide-react';

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
    <div className="sm:hidden fixed bottom-5 left-4 right-4 z-50 max-w-sm mx-auto pointer-events-auto">
      <nav className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-full shadow-2xl shadow-slate-900/15 py-2.5 px-4 flex items-center justify-around text-slate-900">
        {/* Top Stories Tab (R. Logo) */}
        <button
          onClick={() => {
            onResetToMain();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Top Stories"
          className="flex items-center justify-center p-2 rounded-full min-w-[44px] min-h-[44px] active:scale-90 transition-transform cursor-pointer"
        >
          <span className="font-black font-sans tracking-tighter text-2xl leading-none text-slate-950 select-none">
            R.
          </span>
        </button>

        {/* City Switcher Tab */}
        <button
          onClick={onOpenCitySelector}
          title={`City: ${currentCity.name}`}
          className="flex items-center justify-center p-2 rounded-full min-w-[44px] min-h-[44px] text-slate-700 active:scale-90 transition-transform cursor-pointer"
        >
          <MapPin className="w-6 h-6 text-[#FA2D48]" />
        </button>

        {/* Search Tab */}
        <button
          onClick={handleSearchClick}
          title="Search"
          className="flex items-center justify-center p-2 rounded-full min-w-[44px] min-h-[44px] text-slate-700 active:scale-90 transition-transform cursor-pointer"
        >
          <Search className="w-6 h-6 text-slate-800" />
        </button>

        {/* Saved Bookmarks Tab */}
        <button
          onClick={onOpenSavedDrawer}
          title="Saved Stories"
          className="flex items-center justify-center p-2 rounded-full min-w-[44px] min-h-[44px] text-slate-700 relative active:scale-90 transition-transform cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <Bookmark className="w-6 h-6 text-slate-800" />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#FA2D48] text-white font-black text-[9px] flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </div>
        </button>
      </nav>
    </div>
  );
};



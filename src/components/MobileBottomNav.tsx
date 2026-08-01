import React from 'react';
import { CityInfo, NewsCategory } from '../types';
import { Newspaper, MapPin, Bookmark, Compass } from 'lucide-react';

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
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1 px-2 pb-safe shadow-lg flex items-center justify-around">
      {/* Home / Feed Tab */}
      <button
        onClick={() => {
          onResetToMain();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] active:scale-95 transition-transform ${
          activeCategory === 'all' ? 'text-[#FA2D48] font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Newspaper className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-sans tracking-tight">Top Stories</span>
      </button>

      {/* City Switcher Tab */}
      <button
        onClick={onOpenCitySelector}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] text-slate-500 hover:text-slate-800 active:scale-95 transition-transform"
      >
        <MapPin className="w-5 h-5 mb-0.5 text-[#FA2D48]" />
        <span className="text-[10px] font-sans tracking-tight truncate max-w-[68px]">{currentCity.name}</span>
      </button>

      {/* Categories / Explore Tab */}
      <button
        onClick={() => {
          onSelectCategory('real-estate');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] active:scale-95 transition-transform ${
          activeCategory !== 'all' ? 'text-[#FA2D48] font-bold' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-sans tracking-tight">Explore</span>
      </button>

      {/* Saved Bookmarks Tab */}
      <button
        onClick={onOpenSavedDrawer}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[64px] min-h-[48px] text-slate-500 hover:text-slate-800 relative active:scale-95 transition-transform"
      >
        <div className="relative">
          <Bookmark className="w-5 h-5 mb-0.5 text-slate-700" />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-[#FA2D48] text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
              {savedCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-sans tracking-tight">Saved</span>
      </button>
    </nav>
  );
};

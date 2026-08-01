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
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t-2 border-slate-300 py-1.5 px-2 pb-safe shadow-xl flex items-center justify-around text-black">
      {/* Home / Feed Tab */}
      <button
        onClick={() => {
          onResetToMain();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[68px] min-h-[52px] active:scale-95 transition-all text-black ${
          activeCategory === 'all' ? 'bg-slate-100 font-black border border-slate-300' : 'font-bold'
        }`}
      >
        <Newspaper className="w-6 h-6 mb-0.5 text-black" />
        <span className="text-xs sm:text-sm font-black tracking-tight text-black">Top Stories</span>
      </button>

      {/* City Switcher Tab */}
      <button
        onClick={onOpenCitySelector}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[68px] min-h-[52px] text-black active:scale-95 transition-all font-bold"
      >
        <MapPin className="w-6 h-6 mb-0.5 text-[#FA2D48]" />
        <span className="text-xs sm:text-sm font-black tracking-tight truncate max-w-[76px] text-black">{currentCity.name}</span>
      </button>

      {/* Categories / Explore Tab */}
      <button
        onClick={() => {
          onSelectCategory('real-estate');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[68px] min-h-[52px] active:scale-95 transition-all text-black ${
          activeCategory !== 'all' ? 'bg-slate-100 font-black border border-slate-300' : 'font-bold'
        }`}
      >
        <Compass className="w-6 h-6 mb-0.5 text-black" />
        <span className="text-xs sm:text-sm font-black tracking-tight text-black">Explore</span>
      </button>

      {/* Saved Bookmarks Tab */}
      <button
        onClick={onOpenSavedDrawer}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl min-w-[68px] min-h-[52px] text-black relative active:scale-95 transition-all font-bold"
      >
        <div className="relative">
          <Bookmark className="w-6 h-6 mb-0.5 text-black" />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-2.5 w-4 h-4 rounded-full bg-[#FA2D48] text-white font-black text-[10px] flex items-center justify-center shadow-xs">
              {savedCount}
            </span>
          )}
        </div>
        <span className="text-xs sm:text-sm font-black tracking-tight text-black">Saved</span>
      </button>
    </nav>
  );
};

import React from 'react';
import { NewsArticle, cleanText } from '../types';
import { Bookmark, X, Trash2 } from 'lucide-react';


interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  onRemoveBookmark: (article: NewsArticle) => void;
  onClearAll: () => void;
}

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col justify-between shadow-2xl text-slate-900">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-[#FA2D48] border border-rose-200">
              <Bookmark className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-black font-serif">Saved Stories</h2>
              <p className="text-sm font-bold text-black font-mono">{savedArticles.length} Bookmarks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-black transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Saved List Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Bookmark className="w-14 h-14 text-slate-300 mx-auto" />
              <h3 className="text-xl font-black text-black font-serif">No Saved Stories Yet</h3>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xs mx-auto">
                Click the bookmark icon inside any article to save it for reading later.
              </p>
            </div>
          ) : (
            savedArticles.map((art) => (
              <div
                key={art.id}
                className="group bg-[#F8F8FC] border border-slate-300 hover:border-slate-400 rounded-2xl p-4 flex items-start space-x-3 transition-all shadow-xs"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-black font-bold">
                    <span className="text-[#FA2D48] font-black">{art.cityName}</span>
                    <span>{art.publishedAt}</span>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="text-base sm:text-lg font-black font-serif text-black hover:text-[#FA2D48] cursor-pointer line-clamp-2 leading-snug"
                  >
                    {cleanText(art.title)}
                  </h4>

                  <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
                    <span className="text-slate-600 font-mono font-bold">{art.readTime}</span>
                    <button
                      onClick={() => onRemoveBookmark(art)}
                      className="text-[#FA2D48] hover:text-rose-700 text-xs sm:text-sm font-black flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedArticles.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-[#F8F8FC] flex justify-between items-center">
            <button
              onClick={onClearAll}
              className="text-sm text-slate-700 hover:text-[#FA2D48] font-mono font-black flex items-center space-x-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
            <span className="text-xs sm:text-sm text-slate-600 font-mono font-bold">Apple News</span>
          </div>
        )}

      </div>
    </div>
  );
};

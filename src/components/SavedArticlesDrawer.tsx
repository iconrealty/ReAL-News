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
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-[#FA2D48] border border-rose-200">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif">Saved Stories</h2>
              <p className="text-xs text-slate-500 font-mono">{savedArticles.length} Bookmarks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-500 font-serif">No Saved Stories Yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the bookmark icon inside any article to save it for reading later.
              </p>
            </div>
          ) : (
            savedArticles.map((art) => (
              <div
                key={art.id}
                className="group bg-[#F8F8FC] border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 flex items-start space-x-3 transition-all"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-[#FA2D48] font-bold">{art.cityName}</span>
                    <span>{art.publishedAt}</span>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="text-xs font-bold font-serif text-slate-900 hover:text-[#FA2D48] cursor-pointer line-clamp-2"
                  >
                    {cleanText(art.title)}
                  </h4>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400 font-mono">{art.readTime}</span>
                    <button
                      onClick={() => onRemoveBookmark(art)}
                      className="text-[#FA2D48] hover:text-rose-700 text-[11px] font-medium flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
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
              className="text-xs text-slate-500 hover:text-[#FA2D48] font-mono flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">Apple News • City Pulse</span>
          </div>
        )}

      </div>
    </div>
  );
};

import React from 'react';
import { NewsArticle, cleanText } from '../types';

interface FeaturedHeroStoryProps {
  article: NewsArticle;
  onSelectArticle: (article: NewsArticle) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (article: NewsArticle) => void;
}

export const FeaturedHeroStory: React.FC<FeaturedHeroStoryProps> = ({
  article,
  onSelectArticle,
}) => {
  return (
    <div
      onClick={() => onSelectArticle(article)}
      className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 relative text-slate-900 cursor-pointer group"
    >
      {/* Single Clean Header Metadata Row */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-600 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-900 font-serif">{cleanText(article.publisher)}</span>
          <span>•</span>
          <span className="text-slate-500 font-sans">{article.cityName}, CA</span>
        </div>
        <span className="font-mono text-slate-400 text-xs">{article.publishedAt}</span>
      </div>

      {/* Main Title */}
      <div className="pt-5 pb-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-slate-950 tracking-tight leading-snug group-hover:text-[#FA2D48] transition-colors">
          {cleanText(article.title)}
        </h2>
      </div>
    </div>
  );
};



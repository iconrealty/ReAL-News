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
      className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 relative text-slate-900 cursor-pointer group p-5 sm:p-6"
    >
      <div className="space-y-2.5">
        {/* Header Metadata Row */}
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-500 font-sans">
          <span className="font-extrabold text-[#FA2D48] uppercase tracking-wider">{article.cityName}</span>
          <span>•</span>
          <span className="text-slate-400 font-semibold">{article.publishedAt}</span>
        </div>

        {/* Main Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-[#FA2D48] transition-colors">
          {cleanText(article.title)}
        </h2>

        {article.subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">
            {cleanText(article.subtitle)}
          </p>
        )}

        <div className="flex items-center space-x-2 pt-1 text-xs font-bold text-[#FA2D48]">
          <span>Read full story →</span>
          {article.readTime && (
            <span className="text-slate-400 font-medium">• {article.readTime}</span>
          )}
        </div>
      </div>
    </div>
  );
};





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
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-300 relative text-slate-900 cursor-pointer group"
    >
      <div className="flex items-center justify-between gap-4 sm:gap-6">
        {/* Left Column: Metadata & Title Only */}
        <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
          {/* Header Metadata Row */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-sans">
            <span className="font-extrabold text-[#FA2D48] text-xs uppercase tracking-wider">{article.cityName}</span>
            <span>•</span>
            <span className="text-slate-400 text-xs font-semibold">{article.publishedAt}</span>
          </div>

          {/* Main Title Only */}
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-[#FA2D48] transition-colors line-clamp-3">
            {cleanText(article.title)}
          </h2>

          <div className="flex items-center space-x-2 pt-1 text-xs font-bold text-[#FA2D48]">
            <span>Read full story →</span>
            {article.readTime && (
              <span className="text-slate-400 font-medium">• {article.readTime}</span>
            )}
          </div>
        </div>

        {/* Right Column: Small Compact Thumbnail Image */}
        {article.heroImage && (
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-inner relative">
            <img
              src={article.heroImage}
              alt={cleanText(article.title)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </div>
  );
};





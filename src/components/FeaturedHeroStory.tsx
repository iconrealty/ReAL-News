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
      className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 relative text-slate-900 cursor-pointer group flex flex-col sm:flex-row items-stretch"
    >
      {/* Left Column: Metadata & Title Only */}
      <div className="flex-1 min-w-0 p-5 sm:p-7 md:p-8 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          {/* Header Metadata Row */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-sans">
            <span className="font-extrabold text-[#FA2D48] text-xs uppercase tracking-wider">{article.cityName}</span>
            <span>•</span>
            <span className="text-slate-400 text-xs font-semibold">{article.publishedAt}</span>
          </div>

          {/* Main Title */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-[#FA2D48] transition-colors line-clamp-3">
            {cleanText(article.title)}
          </h2>

          {article.subtitle && (
            <p className="text-sm sm:text-base text-slate-600 line-clamp-2 leading-relaxed font-normal">
              {cleanText(article.subtitle)}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-2 text-xs sm:text-sm font-bold text-[#FA2D48]">
          <span>Read full story →</span>
          {article.readTime && (
            <span className="text-slate-400 font-medium">• {article.readTime}</span>
          )}
        </div>
      </div>

      {/* Right Column: Big frameless side photo */}
      {article.heroImage && (
        <div className="w-full sm:w-[38%] md:w-[42%] min-h-[220px] sm:min-h-[260px] self-stretch shrink-0 relative overflow-hidden bg-slate-100">
          <img
            src={article.heroImage}
            alt={cleanText(article.title)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </div>
  );
};





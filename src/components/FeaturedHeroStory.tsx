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
      {/* Left Column: Metadata & Title */}
      <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1.5">
          {/* Header Metadata Row */}
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-500 font-sans">
            <span className="font-extrabold text-[#FA2D48] uppercase tracking-wider">{article.cityName}</span>
            <span>•</span>
            <span className="text-slate-400 font-semibold">{article.publishedAt}</span>
          </div>

          {/* Main Title */}
          <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-[#FA2D48] transition-colors line-clamp-3">
            {cleanText(article.title)}
          </h2>
        </div>

        <div className="flex items-center space-x-2 pt-1 text-xs font-bold text-[#FA2D48]">
          <span>Read full story →</span>
          {article.readTime && (
            <span className="text-slate-400 font-medium">• {article.readTime}</span>
          )}
        </div>
      </div>

      {/* Right Column: Frameless side photo (same size as regular cards) */}
      {article.heroImage && (
        <div className="w-32 sm:w-36 md:w-36 lg:w-40 shrink-0 relative overflow-hidden bg-slate-100 self-stretch min-h-[110px]">
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
  );
};





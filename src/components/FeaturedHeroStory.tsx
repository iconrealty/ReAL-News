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
      className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 relative text-slate-900 cursor-pointer group space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
        {/* Left Column: Metadata, Title & Subtitle */}
        <div className="md:col-span-7 space-y-3.5 order-2 md:order-1 flex flex-col justify-between h-full">
          <div>
            {/* Header Metadata Row */}
            <div className="flex items-center justify-between text-xs text-slate-600 pb-2.5 border-b border-slate-100 font-sans">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">{article.cityName}</span>
              <span className="text-slate-400 text-xs font-semibold">{article.publishedAt}</span>
            </div>

            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-[#FA2D48] transition-colors pt-2">
              {cleanText(article.title)}
            </h2>

            {/* Subtitle / Key Hook */}
            {article.subtitle && (
              <p className="text-sm sm:text-base text-slate-600 font-medium line-clamp-2 sm:line-clamp-3 pt-2 leading-relaxed">
                {cleanText(article.subtitle)}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-2 text-xs font-bold text-[#FA2D48]">
            <span>Read full report →</span>
            {article.readTime && (
              <span className="text-slate-400 font-medium">• {article.readTime}</span>
            )}
          </div>
        </div>

        {/* Right Column: Hero Image */}
        {article.heroImage && (
          <div className="md:col-span-5 order-1 md:order-2 overflow-hidden rounded-2xl bg-slate-100 aspect-16/10 md:aspect-4/3 w-full shadow-inner relative">
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
    </div>
  );
};





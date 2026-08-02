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
      className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 relative text-slate-900 cursor-pointer group space-y-4"
    >
      {/* Header Metadata Row */}
      <div className="flex items-center justify-between text-xs text-slate-600 pb-3 border-b border-slate-100 font-sans">
        <span className="font-extrabold text-slate-900 text-sm tracking-tight">{article.cityName}, CA</span>
        <span className="text-slate-400 text-xs font-semibold">{article.publishedAt}</span>
      </div>

      {/* Main Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-snug group-hover:text-[#FA2D48] transition-colors">
          {cleanText(article.title)}
        </h2>
      </div>

    </div>
  );
};




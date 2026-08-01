import React from 'react';
import { NewsArticle, cleanText, getCityRootUrl } from '../types';
import { ArrowRight } from 'lucide-react';

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
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative text-slate-900">
      
      {/* Top Header Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200/80">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="font-semibold text-slate-800 font-serif">{cleanText(article.publisher)}</span>
        </div>
      </div>


      {/* Main Body */}
      <div className="py-6 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-600">
          <span className="font-bold text-slate-900 font-serif">{cleanText(article.publisher)}</span>
          <span>•</span>
          <span className="text-slate-500 font-sans">{article.cityName}, CA</span>
        </div>

        <h2
          onClick={() => onSelectArticle(article)}
          className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-slate-900 tracking-tight leading-snug cursor-pointer hover:text-[#FA2D48] transition-colors"
        >
          {cleanText(article.title)}
        </h2>

        {article.sourceCitation && (
          <div className="text-[11px] text-slate-500 font-mono">
            <strong>Source:</strong>{' '}
            <a
              href={getCityRootUrl(article.cityName, article.sourceUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-[#FA2D48] transition-colors"
            >
              {cleanText(article.sourceCitation)}
            </a>
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono">{article.publishedAt}</span>

        <button
          onClick={() => onSelectArticle(article)}
          className="px-5 py-2.5 rounded-full bg-[#FA2D48] hover:bg-[#E0263E] text-white font-bold text-xs flex items-center space-x-2 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <span>Read Full Story</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};


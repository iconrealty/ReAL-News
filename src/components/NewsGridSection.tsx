import React from 'react';
import { NewsArticle, cleanText } from '../types';

interface NewsGridSectionProps {
  title: string;
  icon?: React.ReactNode;
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  bookmarkedIds?: Set<string>;
  onToggleBookmark?: (article: NewsArticle) => void;
}

export const NewsGridSection: React.FC<NewsGridSectionProps> = ({
  title,
  icon,
  articles,
  onSelectArticle,
}) => {
  if (articles.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-300/80 pb-3">
        <h3 className="text-xl font-bold text-slate-900 font-serif">
          <span>{title}</span>
        </h3>
        <span className="text-xs font-mono text-slate-500 font-medium">{articles.length} Reports</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => {
          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 space-y-4 text-slate-900"
            >

              {/* Header Metadata Row */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5 font-mono text-[11px] truncate pr-2">
                    <span className="font-semibold text-slate-800 truncate font-serif">{cleanText(article.publisher)}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-base font-bold font-serif text-slate-900 group-hover:text-[#FA2D48] transition-colors line-clamp-2 leading-snug">
                  {cleanText(article.title)}
                </h4>

                {/* Subtitle */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                  {cleanText(article.subtitle)}
                </p>


              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{article.publishedAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


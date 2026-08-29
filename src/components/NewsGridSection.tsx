import React from 'react';
import { NewsArticle, cleanText } from '../types';

interface NewsGridSectionProps {
  title: string;
  icon?: React.ReactNode;
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  bookmarkedIds?: Set<string>;
  onToggleBookmark?: (article: NewsArticle) => void;
  adBanner?: React.ReactNode;
}

export const NewsGridSection: React.FC<NewsGridSectionProps> = ({
  title,
  icon,
  articles,
  onSelectArticle,
  adBanner,
}) => {
  if (articles.length === 0) return null;

  return (
    <section className="space-y-4 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-300/80 pb-3">
        <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          {icon && <span>{icon}</span>}
          <span>{title}</span>
        </h3>
        <span className="text-xs font-bold text-slate-500">{articles.length} Reports</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {adBanner && <div className="col-span-1">{adBanner}</div>}
        {articles.map((article) => {
          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 space-y-3.5 text-slate-900 overflow-hidden"
            >
              {/* Card Image */}
              {article.heroImage && (
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                  <img
                    src={article.heroImage}
                    alt={cleanText(article.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {article.cityName}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-2">
                {!article.heroImage && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 text-sm truncate">{article.cityName}</span>
                  </div>
                )}

                {/* Title */}
                <h4 className="text-base sm:text-lg font-bold text-slate-950 group-hover:text-[#FA2D48] transition-colors leading-snug line-clamp-3">
                  {cleanText(article.title)}
                </h4>

                {/* Subtitle preview */}
                {article.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 font-normal line-clamp-2 leading-relaxed">
                    {cleanText(article.subtitle)}
                  </p>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">{article.publishedAt}</span>
                {article.readTime && (
                  <span className="text-[11px] text-slate-400 font-medium">{article.readTime}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};




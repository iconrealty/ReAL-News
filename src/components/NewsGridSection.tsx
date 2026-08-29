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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {adBanner && <div className="col-span-1 md:col-span-2 lg:col-span-3">{adBanner}</div>}
        {articles.map((article) => {
          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3.5 cursor-pointer hover:-translate-y-0.5 text-slate-900 overflow-hidden"
            >
              {/* Content: City tag, Title, Published Time */}
              <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch space-y-2">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500">
                    <span className="text-[#FA2D48] font-black uppercase tracking-wider truncate">
                      {article.cityName}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-medium truncate">{article.publishedAt}</span>
                  </div>

                  {/* Title Only */}
                  <h4 className="text-sm sm:text-base font-bold text-slate-950 group-hover:text-[#FA2D48] transition-colors leading-snug line-clamp-3">
                    {cleanText(article.title)}
                  </h4>
                </div>

                {article.readTime && (
                  <div className="text-[11px] text-slate-400 font-medium pt-1">
                    {article.readTime}
                  </div>
                )}
              </div>

              {/* Small Apple News Style Thumbnail */}
              {article.heroImage && (
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-slate-100 shrink-0 shadow-inner relative">
                  <img
                    src={article.heroImage}
                    alt={cleanText(article.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};




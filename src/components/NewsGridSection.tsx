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
              className="group bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 text-slate-900"
            >
              {/* Content: City tag, Title, Published Time */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500">
                  <span className="text-[#FA2D48] font-black uppercase tracking-wider truncate">
                    {article.cityName}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400 font-medium truncate">{article.publishedAt}</span>
                  {article.readTime && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400 font-medium truncate">{article.readTime}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h4 className="text-sm sm:text-[15px] font-bold text-slate-950 group-hover:text-[#FA2D48] transition-colors leading-snug">
                  {cleanText(article.title)}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};




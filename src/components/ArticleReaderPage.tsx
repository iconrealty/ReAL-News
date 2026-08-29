import React, { useState, useEffect } from 'react';
import { NewsArticle, AdBanner } from '../types';
import { ArrowLeft, Bookmark, MoreHorizontal, Search, ExternalLink, Share2 } from 'lucide-react';
import { AdBannerRenderer } from './AdBannerRenderer';

interface ArticleReaderPageProps {
  article: NewsArticle;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onShowToast: (msg: string) => void;
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
}

type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export const ArticleReaderPage: React.FC<ArticleReaderPageProps> = ({
  article,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onShowToast,
  ads = [],
  monetizationEnabled = false,
}) => {
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [showMenu, setShowMenu] = useState(false);

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [article.id]);

  // Keyboard shortcut (Escape to go back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const cleanText = (text?: string) => {
    if (!text) return '';
    return text.replace(/\s*\([^)]*(\.com|\.gov|\.org|\.net|\.edu|http|www|\.io|\.ca|\.us)[^)]*\)/gi, '').trim();
  };

  const fontSizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
  const fontSizeLabels: Record<FontSize, string> = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'Extra Large',
  };

  const bodyFontSizeClass: Record<FontSize, string> = {
    sm: 'text-sm sm:text-base leading-relaxed',
    md: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-relaxed',
    xl: 'text-xl sm:text-2xl leading-relaxed font-sans text-slate-900',
  };

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex > 0) {
      const nextSize = fontSizes[currentIndex - 1];
      setFontSize(nextSize);
      onShowToast(`Text size: ${fontSizeLabels[nextSize]}`);
    }
  };

  const increaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize);
    if (currentIndex < fontSizes.length - 1) {
      const nextSize = fontSizes[currentIndex + 1];
      setFontSize(nextSize);
      onShowToast(`Text size: ${fontSizeLabels[nextSize]}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanText(article.title),
          text: cleanText(article.subtitle || article.title),
          url: window.location.href,
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${cleanText(article.title)} - ${window.location.href}`);
        onShowToast('Article title copied to clipboard');
      } catch {
        onShowToast('Ready to share');
      }
    }
  };

  return (
    <div className="w-full min-h-screen text-slate-900 font-sans pb-24">
      {/* Top Apple News Sticky Reader Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* Top Left: Apple News Back Arrow Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-900 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0 min-h-[40px]"
            title="Return to Main Feed"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#FA2D48] stroke-[2.5]" />
            <span className="font-extrabold text-[#FA2D48]">Back</span>
          </button>

          {/* Center: Municipal & Source Tag */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 min-w-0 px-1 truncate">
            <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] sm:text-xs truncate">
              {article.cityName}, CA
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500 font-medium hidden sm:inline truncate">
              {article.publisher || 'ReaL. News'}
            </span>
          </div>

          {/* Top Right: Actions (Font Size, Bookmark, Share) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Font Options Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                  showMenu
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
                title="Text Size"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Popup Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40 flex items-center space-x-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-xs font-semibold">
                    <button
                      onClick={decreaseFontSize}
                      disabled={fontSize === 'sm'}
                      className="px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 disabled:opacity-30 transition-all cursor-pointer hover:bg-white active:scale-95"
                      title="Smaller Text (A-)"
                    >
                      A-
                    </button>
                    <span className="text-slate-300 text-[10px] select-none">|</span>
                    <button
                      onClick={increaseFontSize}
                      disabled={fontSize === 'xl'}
                      className="px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 disabled:opacity-30 transition-all cursor-pointer hover:bg-white active:scale-95"
                      title="Larger Text (A+)"
                    >
                      A+
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="Share Story"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Bookmark Toggle */}
            <button
              onClick={() => onToggleBookmark(article)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                isBookmarked
                  ? 'bg-rose-50 text-[#FA2D48] border-rose-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-900'
              }`}
              title="Save Story"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Full-Page Article Reader Body */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Article Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xs space-y-5">
          
          {/* Metadata Row */}
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2 text-xs font-semibold text-slate-500">
            <span className="bg-[#FA2D48] text-white px-3 py-1 rounded-full font-black uppercase tracking-wider text-[11px] shadow-2xs">
              {article.cityName}
            </span>
            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold">
              {article.publishedAt}
            </span>
            {article.publisher && (
              <span className="bg-rose-50 text-[#FA2D48] px-3 py-1 rounded-full font-bold border border-rose-100">
                {article.publisher}
              </span>
            )}
            {article.readTime && (
              <span className="text-slate-400 font-medium pl-1">
                {article.readTime}
              </span>
            )}
          </div>

          {/* Headline Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight sm:leading-tight">
            {cleanText(article.title)}
          </h1>

          {/* Subtitle / Key Takeaways Callout */}
          {article.subtitle && (
            <div className="border-l-4 border-[#FA2D48] bg-slate-50 p-4 sm:p-5 rounded-r-2xl text-slate-800 text-base sm:text-lg font-medium italic leading-relaxed">
              {cleanText(article.subtitle)}
            </div>
          )}

          {/* Hero Image */}
          {article.heroImage && (
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-sm relative">
              <img
                src={article.heroImage}
                alt={cleanText(article.title)}
                className="w-full max-h-[460px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Formatted Article Paragraphs */}
          <div className={`prose max-w-none space-y-4 sm:space-y-5 text-slate-950 font-normal pt-2 ${bodyFontSizeClass[fontSize]}`}>
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Article Sponsor Spotlight Banner */}
          {monetizationEnabled && ads && ads.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <AdBannerRenderer
                ads={ads}
                placement="article-spotlight"
                cityName={article.cityName}
                monetizationEnabled={monetizationEnabled}
              />
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 text-[#FA2D48]" />
              <span>Back to Stories</span>
            </button>

            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${cleanText(article.title)} ${article.cityName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#FA2D48] hover:bg-[#d8223b] text-white text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer w-full sm:w-auto group"
            >
              <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>Search More Info on Google</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80 ml-0.5" />
            </a>
          </div>

        </div>

      </article>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { NewsArticle, AdBanner } from '../types';
import { X, Bookmark, MoreHorizontal, Search, ExternalLink } from 'lucide-react';
import { AdBannerRenderer } from './AdBannerRenderer';

interface ArticleReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onShowToast: (msg: string) => void;
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
}

type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShowToast,
  ads = [],
  monetizationEnabled = false,
}) => {
  const [fontSize, setFontSize] = useState<FontSize>('xl');
  const [showMenu, setShowMenu] = useState(false);

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const cleanText = (text?: string) => {
    if (!text) return '';
    return text.replace(/\s*\([^)]*(\.com|\.gov|\.org|\.net|\.edu|http|www|\.io|\.ca|\.us)[^)]*\)/gi, '').trim();
  };

  const handleClose = () => {
    onClose();
  };

  const fontSizes: FontSize[] = ['sm', 'md', 'lg', 'xl'];
  const fontSizeLabels: Record<FontSize, string> = {
    sm: 'Small',
    md: 'Medium',
    lg: 'Large',
    xl: 'Extra Large (Default)',
  };

  const bodyFontSizeClass: Record<FontSize, string> = {
    sm: 'text-sm sm:text-base leading-relaxed',
    md: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-relaxed',
    xl: 'text-lg sm:text-2xl leading-relaxed font-sans text-slate-900',
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

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto font-sans animate-in fade-in duration-200"
    >
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-0 sm:my-6 flex flex-col h-[90vh] sm:h-auto sm:max-h-[88vh] text-slate-900 relative">
        
        {/* Mobile Pull Indicator Pill */}
        <div className="sm:hidden w-full pt-2 pb-0 bg-white flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-300/80 rounded-full" />
        </div>

        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-3 sm:p-4 px-4 sm:px-6 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500 min-w-0 pr-2">
            <span className="font-extrabold text-slate-900 text-sm truncate">{article.cityName}, CA</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Options Button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
                  showMenu
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Popup Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-30 flex items-center space-x-1 animate-in fade-in zoom-in-95 duration-150">
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

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer active:scale-95 ml-1"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-5 sm:space-y-6 flex-1">
          
          {/* Header Title & Subtitle */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">{article.publishedAt}</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight sm:leading-tight">
              {cleanText(article.title)}
            </h1>

            <p className="text-sm sm:text-lg text-slate-950 leading-relaxed border-l-4 border-[#FA2D48] pl-3.5 py-1 font-bold italic bg-slate-50/50 rounded-r-xl">
              {cleanText(article.subtitle)}
            </p>
          </div>

          {/* Article Paragraph Text with Dynamic Font Size */}
          <div className={`prose max-w-none space-y-3.5 sm:space-y-4 text-slate-950 font-medium ${bodyFontSizeClass[fontSize]}`}>
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Article Sponsor Spotlight Banner */}
          {monetizationEnabled && ads && ads.length > 0 && (
            <AdBannerRenderer
              ads={ads}
              placement="article-spotlight"
              cityName={article.cityName}
              monetizationEnabled={monetizationEnabled}
            />
          )}

          {/* Google Search Link Button for More Info */}
          <div className="pt-5 border-t border-slate-200 mt-6 sm:mt-8 flex justify-center sm:justify-end">
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`${cleanText(article.title)} ${article.cityName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#FA2D48] hover:bg-[#d8223b] text-white text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer w-full sm:w-auto justify-center group"
            >
              <Search className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>More info</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80 ml-0.5" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};


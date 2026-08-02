import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { X, Bookmark, MoreHorizontal } from 'lucide-react';

interface ArticleReaderModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: NewsArticle) => void;
  onShowToast: (msg: string) => void;
}

type FontSize = 'sm' | 'md' | 'lg' | 'xl';

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  article,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShowToast,
}) => {
  const [fontSize, setFontSize] = useState<FontSize>('xl');
  const [showMenu, setShowMenu] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto font-sans">
      <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-0 sm:my-6 flex flex-col h-[92vh] sm:h-auto sm:max-h-[90vh] text-slate-900">
        
        {/* Top Floating Control Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span className="font-extrabold text-slate-900 text-sm">{article.cityName}, CA</span>
            <span className="text-slate-300">•</span>
            <span className="font-medium text-slate-600">{cleanText(article.publisher)}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Three Dots Button for Text Controls */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  showMenu
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200'
                }`}
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Popup menu with A- | A+ */}
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-30 flex items-center space-x-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center bg-slate-100 rounded-xl p-0.5 text-xs font-semibold">
                    <button
                      onClick={decreaseFontSize}
                      disabled={fontSize === 'sm'}
                      className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 disabled:opacity-30 transition-all cursor-pointer hover:bg-white active:scale-95"
                      title="Smaller Text (A-)"
                    >
                      A-
                    </button>
                    <span className="text-slate-300 text-[10px] select-none">|</span>
                    <button
                      onClick={increaseFontSize}
                      disabled={fontSize === 'xl'}
                      className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 disabled:opacity-30 transition-all cursor-pointer hover:bg-white active:scale-95"
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
              className={`p-2 rounded-full border transition-all cursor-pointer ${
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
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Header Title & Subtitle */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">{article.publishedAt}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              {cleanText(article.title)}
            </h1>

            <p className="text-base sm:text-xl text-slate-700 leading-relaxed border-l-4 border-[#FA2D48] pl-4 py-1 font-semibold italic bg-slate-50/50 rounded-r-xl">
              {cleanText(article.subtitle)}
            </p>
          </div>

          {/* Article Full Paragraph Text with Dynamic Font Size */}
          <div className={`prose max-w-none space-y-4 text-slate-800 ${bodyFontSizeClass[fontSize]}`}>
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

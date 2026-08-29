import React, { useState, useEffect } from 'react';
import { NewsArticle, AdBanner, getDirectStoryUrl } from '../types';
import { ArrowLeft, Bookmark, MoreHorizontal, Globe, ExternalLink, Share2, Lock, RefreshCw } from 'lucide-react';
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
  const [inAppSourceView, setInAppSourceView] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const directUrl = getDirectStoryUrl(article);
  const publisherName = article.publisher || `${article.cityName} News Wire`;

  // Scroll to top when article changes or when entering in-app source view
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setInAppSourceView(false);
  }, [article.id]);

  // Keyboard shortcut (Escape to go back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (inAppSourceView) {
          setInAppSourceView(false);
        } else {
          onBack();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, inAppSourceView]);

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
          url: directUrl || window.location.href,
        });
      } catch {
        // Fallback to clipboard
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${cleanText(article.title)} - ${directUrl}`);
        onShowToast('Direct story link copied to clipboard');
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
            onClick={() => {
              if (inAppSourceView) {
                setInAppSourceView(false);
              } else {
                onBack();
              }
            }}
            className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-900 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0 min-h-[40px]"
            title={inAppSourceView ? 'Return to Article Reader' : 'Return to Main Feed'}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#FA2D48] stroke-[2.5]" />
            <span className="font-extrabold text-[#FA2D48]">
              {inAppSourceView ? 'Reader' : 'Back'}
            </span>
          </button>

          {/* Center: Municipal & Source Tag */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 min-w-0 px-1 truncate">
            <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] sm:text-xs truncate">
              {article.cityName}, CA
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500 font-medium hidden sm:inline truncate">
              {publisherName}
            </span>
          </div>

          {/* Top Right: Actions (Font Size, Bookmark, Share) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Font Options Button (hidden when in embedded web view) */}
            {!inAppSourceView && (
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
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="Share Story Link"
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

      {/* Main Article Reading Canvas - Clean, un-boxed, open magazine layout */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {inAppSourceView ? (
          /* In-App Direct Source Page View - Edge-to-Edge Clean Canvas */
          <div className="space-y-4">
            
            {/* Top Browser Control Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2 text-xs text-slate-700 min-w-0 max-w-full truncate">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900 shrink-0">{publisherName}</span>
                <span className="text-slate-300 shrink-0">•</span>
                <span className="text-slate-500 font-mono text-[11px] truncate">{directUrl}</span>
              </div>

              <div className="flex items-center space-x-2 shrink-0 flex-wrap">
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                  title="Reload In-App Page"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload</span>
                </button>

                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[#FA2D48] hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                  title="Open Direct Story in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>

                <button
                  onClick={() => setInAppSourceView(false)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Reader View</span>
                </button>
              </div>
            </div>

            {/* Embedded Source View - Full width without double card encapsulation */}
            <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative min-h-[640px] h-[82vh]">
              <iframe
                key={iframeKey}
                src={directUrl}
                title={`${publisherName} Direct Story`}
                className="w-full h-full border-none bg-white"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                loading="lazy"
              />
            </div>

            {/* In-App Direct Browser Fallback Footer */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <span className="font-medium text-center sm:text-left">
                Viewing official direct source report for <strong className="text-slate-900">{cleanText(article.title)}</strong>.
              </span>
              <button
                onClick={() => setInAppSourceView(false)}
                className="text-[#FA2D48] hover:underline font-bold cursor-pointer"
              >
                ← Back to Clean Article View
              </button>
            </div>

          </div>
        ) : (
          /* Clean, Un-Tabbed, Natural Flow Article Layout */
          <div className="space-y-6 sm:space-y-7">
            
            {/* Clean Minimalist Byline & Source: Only the red font publisher name + timestamp */}
            <div className="flex items-center space-x-2.5 text-xs font-semibold">
              <span className="text-[#FA2D48] font-bold text-xs uppercase tracking-wider">
                {publisherName}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal">
                {article.publishedAt}
              </span>
            </div>

            {/* Headline Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-950 tracking-tight leading-[1.18]">
              {cleanText(article.title)}
            </h1>

            {/* Subtitle / Executive Summary (Clean italic quote without heavy pill card) */}
            {article.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed italic border-l-2 border-[#FA2D48] pl-4 py-0.5">
                {cleanText(article.subtitle)}
              </p>
            )}

            {/* Full Story Body Paragraphs - Natural typography directly on page */}
            <div className={`space-y-5 text-slate-900 tracking-normal ${bodyFontSizeClass[fontSize]}`}>
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
            <div className="pt-8 mt-8 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-slate-600 hover:text-slate-950 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 text-[#FA2D48]" />
                <span>Back to Stories</span>
              </button>

              {/* Direct In-App Link Button */}
              <button
                onClick={() => {
                  setInAppSourceView(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FA2D48] hover:bg-[#d8223b] text-white text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer w-full sm:w-auto group"
              >
                <Globe className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>Read Full Story</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80 ml-0.5" />
              </button>
            </div>

          </div>
        )}

      </article>
    </div>
  );
};


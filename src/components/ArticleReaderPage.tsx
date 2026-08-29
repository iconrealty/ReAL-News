import React, { useState, useEffect } from 'react';
import { NewsArticle, AdBanner, getDirectStoryUrl } from '../types';
import { ArrowLeft, Bookmark, MoreHorizontal, Globe, ExternalLink, Share2, RefreshCw, Layers } from 'lucide-react';
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

  // Scroll to top when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setInAppSourceView(false);
  }, [article.id]);

  // Keyboard shortcut (Escape to go back or exit in-app view)
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
        onShowToast('Story link copied to clipboard');
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
          
          {/* Top Left: Back Arrow Button */}
          <button
            onClick={() => {
              if (inAppSourceView) {
                setInAppSourceView(false);
              } else {
                onBack();
              }
            }}
            className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-900 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0 min-h-[40px]"
            title={inAppSourceView ? 'Back to Clean Article Reader' : 'Return to Main Feed'}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#FA2D48] stroke-[2.5]" />
            <span className="font-extrabold text-[#FA2D48]">
              {inAppSourceView ? 'Article View' : 'Back'}
            </span>
          </button>

          {/* Center: Clean Municipal Tag */}
          {article.cityName && (
            <div className="flex items-center space-x-1.5 text-xs min-w-0 px-1 truncate">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] sm:text-xs truncate">
                {article.cityName}, CA
              </span>
            </div>
          )}

          {/* Top Right: Actions (Font Size, Bookmark, Share) */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* View Mode Toggle Button */}
            <button
              onClick={() => {
                setInAppSourceView(!inAppSourceView);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                inAppSourceView
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'
              }`}
              title={inAppSourceView ? 'Switch to Editorial Article View' : 'Switch to Live In-App Source View'}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{inAppSourceView ? 'Clean View' : 'Live Source'}</span>
            </button>

            {/* Font Options Button (Clean View Only) */}
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

            {/* Bookmark Button */}
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

      {/* Main Article Reading Canvas */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {inAppSourceView ? (
          /* In-App Live Embedded Source View */
          <div className="space-y-4">
            
            {/* Ribbon Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center space-x-2 text-slate-700 min-w-0 max-w-full truncate">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                <span className="font-bold text-slate-900 shrink-0">{publisherName}</span>
                <span className="text-slate-400 shrink-0">•</span>
                <span className="text-slate-600 truncate font-medium">{cleanText(article.title)}</span>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 transition-all cursor-pointer shadow-2xs"
                  title="Reload View"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reload</span>
                </button>

                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#FA2D48] font-bold border border-rose-200 transition-all cursor-pointer shadow-2xs"
                  title="Open directly in a new tab"
                >
                  <span>Open in Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setInAppSourceView(false)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Clean View</span>
                </button>
              </div>
            </div>

            {/* Embedded Live Frame inside the App */}
            <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm relative min-h-[640px] h-[82vh]">
              <iframe
                key={iframeKey}
                src={directUrl}
                title={`${publisherName} Live Source`}
                className="w-full h-full border-none bg-white"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                loading="lazy"
              />
            </div>

            {/* Footer switcher & fallback note */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-1">
              <span>If an external publication limits embedded frames, use <a href={directUrl} target="_blank" rel="noopener noreferrer" className="text-[#FA2D48] font-bold underline">Open in Tab</a> for instant full access.</span>
              <button
                onClick={() => setInAppSourceView(false)}
                className="text-[#FA2D48] hover:underline font-bold cursor-pointer shrink-0"
              >
                ← Back to Clean Article View
              </button>
            </div>

          </div>
        ) : (
          /* Clean, Un-Tabbed, Natural Flow Article Layout */
          <div className="space-y-6 sm:space-y-7 max-w-3xl mx-auto">
            
            {/* Clean Minimalist Byline & Source */}
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

            {/* Subtitle / Executive Summary */}
            {article.subtitle && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed italic border-l-2 border-[#FA2D48] pl-4 py-0.5">
                {cleanText(article.subtitle)}
              </p>
            )}

            {/* Full Story Body Paragraphs */}
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

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {/* Embedded preview toggle */}
                <button
                  onClick={() => {
                    setInAppSourceView(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer flex-1 sm:flex-initial"
                  title="View inside app frame"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-600" />
                  <span>Preview In-App</span>
                </button>

                {/* Direct Live Story Link Button - Opens full targeted search in new tab */}
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FA2D48] hover:bg-[#d8223b] text-white text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex-1 sm:flex-initial group"
                >
                  <Globe className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  <span>Read Full Story</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80 ml-0.5" />
                </a>
              </div>
            </div>

          </div>
        )}

      </article>
    </div>
  );
};



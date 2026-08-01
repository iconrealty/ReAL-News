import React, { useState, useEffect, useMemo } from 'react';
import { CityInfo, NewsCategory, NewsArticle } from './types';
import { CITIES, INITIAL_ARTICLES } from './data/mockNews';
import { AppleNewsHeader } from './components/AppleNewsHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CitySelectorModal } from './components/CitySelectorModal';
import { FeaturedHeroStory } from './components/FeaturedHeroStory';
import { NewsGridSection } from './components/NewsGridSection';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { Sparkles, Building2, Utensils, Flame, Compass, ChevronRight } from 'lucide-react';

export function App() {
  const [currentCity, setCurrentCity] = useState<CityInfo>(CITIES[0]); // Austin default
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Bookmarked articles state
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('city_pulse_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch (e) {
      return new Set<string>();
    }
  });

  // Modal states
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleResetToMain = () => {
    setCurrentCity(CITIES[0]);
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedArticle(null);
    setIsCitySelectorOpen(false);
    setIsSavedDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.location.reload();
  };

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('city_pulse_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.warn("Could not write bookmarks to localStorage", e);
    }
  }, [bookmarkedIds]);

  // Load articles from Firebase Firestore on mount
  useEffect(() => {
    fetch('/api/news/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch(err => {
        console.warn("Could not load articles from Firebase API, using local fallback", err);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3500);
  };

  const toggleBookmark = (article: NewsArticle) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(article.id)) {
        next.delete(article.id);
        showToast(`Removed "${article.title.slice(0, 30)}..." from bookmarks`);
      } else {
        next.add(article.id);
        showToast(`Saved "${article.title.slice(0, 30)}..." to bookmarks`);
      }
      return next;
    });
  };

  // Filter articles based on city, category, and search query
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // City match
      const isOrangeCountyAll = currentCity.id === 'orange-county';
      const matchesCity = isOrangeCountyAll || 
                          art.cityName.toLowerCase().includes(currentCity.name.toLowerCase()) || 
                          currentCity.name.toLowerCase().includes(art.cityName.toLowerCase()) ||
                          art.isLiveAi;

      // Category match
      const matchesCat = activeCategory === 'all' || art.category === activeCategory;

      // Search query match
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        art.title.toLowerCase().includes(q) ||
        art.subtitle.toLowerCase().includes(q) ||
        art.publisher.toLowerCase().includes(q) ||
        (art.venueDetails?.name && art.venueDetails.name.toLowerCase().includes(q)) ||
        (art.realEstateData?.neighborhood && art.realEstateData.neighborhood.toLowerCase().includes(q));

      return matchesCity && matchesCat && matchesQuery;
    });
  }, [articles, currentCity, activeCategory, searchQuery]);

  // Featured Hero Article
  const heroArticle = useMemo(() => {
    return filteredArticles.find(a => a.isFeatured || a.isBreaking) || filteredArticles[0] || INITIAL_ARTICLES[0];
  }, [filteredArticles]);

  // Remaining articles excluding hero
  const remainingArticles = useMemo(() => {
    if (!heroArticle) return filteredArticles;
    return filteredArticles.filter(a => a.id !== heroArticle.id);
  }, [filteredArticles, heroArticle]);

  // Sub-categorized articles for rich layout sections
  const realEstateArticles = useMemo(() => {
    return remainingArticles.filter(a => a.category === 'real-estate' || a.realEstateData);
  }, [remainingArticles]);

  const diningArticles = useMemo(() => {
    return remainingArticles.filter(a => a.category === 'restaurants-bars' || a.venueDetails);
  }, [remainingArticles]);

  const developmentArticles = useMemo(() => {
    return remainingArticles.filter(a => a.category === 'city-developments' || a.category === 'market-trends' || a.category === 'lifestyle');
  }, [remainingArticles]);

  // Saved articles list
  const savedArticlesList = useMemo(() => {
    return articles.filter(a => bookmarkedIds.has(a.id));
  }, [articles, bookmarkedIds]);

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900 font-sans selection:bg-[#FA2D48] selection:text-white flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-slate-900 border border-slate-200 px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-[#FA2D48]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Apple News Navigation Header */}
      <AppleNewsHeader
        currentCity={currentCity}
        onOpenCitySelector={() => setIsCitySelectorOpen(true)}
        onSelectCity={setCurrentCity}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        savedCount={bookmarkedIds.size}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetToMain={handleResetToMain}
      />

      {/* Main Layout Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-10 pb-28 sm:pb-12">
        
        {/* Apple Style City Masthead Hero Banner */}
        <div className="relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 tracking-tight">
              {currentCity.name}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setIsCitySelectorOpen(true)}
              className="px-5 py-3 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer"
            >
              <span>Explore Cities</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Featured Hero Lead Story */}
        {heroArticle && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#FA2D48] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FA2D48]" />
                <span>Featured Lead Story</span>
              </span>
            </div>

            <FeaturedHeroStory
              article={heroArticle}
              onSelectArticle={setSelectedArticle}
              isBookmarked={bookmarkedIds.has(heroArticle.id)}
              onToggleBookmark={toggleBookmark}
            />
          </section>
        )}

        {/* Section 1: Real Estate & Housing Market */}
        <NewsGridSection
          title={`Real Estate & Housing in ${currentCity.name}`}
          icon={<Building2 className="w-5 h-5 text-amber-600" />}
          articles={realEstateArticles.length > 0 ? realEstateArticles : remainingArticles.slice(0, 3)}
          onSelectArticle={setSelectedArticle}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />

        {/* Section 2: Hot New Restaurant & Bar Openings */}
        <NewsGridSection
          title={`New Restaurant & Bar Debuts in ${currentCity.name}`}
          icon={<Utensils className="w-5 h-5 text-emerald-600" />}
          articles={diningArticles.length > 0 ? diningArticles : remainingArticles.slice(3, 6)}
          onSelectArticle={setSelectedArticle}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />

        {/* Section 3: City Developments & Zoning Updates */}
        {developmentArticles.length > 0 && (
          <NewsGridSection
            title={`Urban Developments, Zoning & Lifestyle`}
            icon={<Compass className="w-5 h-5 text-[#FA2D48]" />}
            articles={developmentArticles}
            onSelectArticle={setSelectedArticle}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
          />
        )}

      </main>

      {/* Apple News Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? bookmarkedIds.has(selectedArticle.id) : false}
        onToggleBookmark={toggleBookmark}
        onShowToast={showToast}
      />

      {/* City Switcher Modal */}
      <CitySelectorModal
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        currentCity={currentCity}
        onSelectCity={(city) => {
          setCurrentCity(city);
          showToast(`Switched to ${city.name} edition`);
        }}
      />

      {/* Bookmarked Saved Stories Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedArticles={savedArticlesList}
        onSelectArticle={setSelectedArticle}
        onRemoveBookmark={toggleBookmark}
        onClearAll={() => {
          setBookmarkedIds(new Set());
          showToast('Cleared all saved bookmarks');
        }}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentCity={currentCity}
        onOpenCitySelector={() => setIsCitySelectorOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        savedCount={bookmarkedIds.size}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onResetToMain={handleResetToMain}
      />

      {/* Apple News Light Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleResetToMain} 
              className="group font-black text-slate-900 group-hover:text-[#FA2D48] transition-colors font-sans tracking-tight text-base cursor-pointer inline-flex items-baseline"
              title="Return to Main Top Stories Feed"
            >
              <span>ReaL</span>
              <span className="text-xl font-black leading-none pl-0.5">.</span>
            </button>
            <span className="text-slate-300">|</span>
            <span>Real Estate Developments & Metro Intelligence</span>
          </div>
          <div className="flex items-center space-x-4 font-mono">
            <button onClick={handleResetToMain} className="hover:text-slate-900 cursor-pointer">Main / Top Stories</button>
            <button onClick={() => setIsCitySelectorOpen(true)} className="hover:text-slate-900 cursor-pointer">Cities</button>
            <button onClick={() => setIsSavedDrawerOpen(true)} className="hover:text-slate-900 cursor-pointer">Bookmarks ({bookmarkedIds.size})</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;

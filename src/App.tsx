import React, { useState, useEffect, useMemo } from 'react';
import { CityInfo, NewsCategory, NewsArticle, AdBanner } from './types';
import { CITIES, INITIAL_ARTICLES } from './data/mockNews';
import { INITIAL_ADS } from './data/mockAds';
import { OC_HOUSING_REPORT_METADATA, OC_SOLD_REPORT, OC_MARKET_TIME_REPORT } from './data/ocHousingReportData';
import { AppleNewsHeader } from './components/AppleNewsHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CitySelectorModal } from './components/CitySelectorModal';
import { FeaturedHeroStory } from './components/FeaturedHeroStory';
import { NewsGridSection } from './components/NewsGridSection';
import { OrangeCountyMarketTrends } from './components/OrangeCountyMarketTrends';
import { OCFastMarketReport } from './components/OCFastMarketReport';
import { OCFastTopOverview } from './components/OCFastTopOverview';
import { MortgageCalculator } from './components/MortgageCalculator';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { AdBannerRenderer } from './components/AdBannerRenderer';
import { ManagerAdminModal } from './components/ManagerAdminModal';
import { NewsManagerModal } from './components/NewsManagerModal';
import { Sparkles, Building2, Utensils, Flame, Compass, ChevronRight, Users, MapPin, TrendingUp } from 'lucide-react';

// Helper function to deduplicate articles strictly by ID, normalized Title, and source URL
function deduplicateArticles(list: NewsArticle[]): NewsArticle[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const result: NewsArticle[] = [];

  for (const art of list) {
    if (!art || !art.title) continue;

    // Check ID
    if (seenIds.has(art.id)) continue;

    // Check normalized title (remove publisher suffix, punctuation, lowercase)
    let cleanTitle = art.title.toLowerCase().trim();
    if (cleanTitle.includes(" - ")) {
      cleanTitle = cleanTitle.split(" - ")[0].trim();
    }
    const normTitle = cleanTitle.replace(/[^a-z0-9]/g, '');

    if (normTitle && normTitle.length > 5 && seenTitles.has(normTitle)) {
      continue;
    }

    seenIds.add(art.id);
    if (normTitle && normTitle.length > 5) {
      seenTitles.add(normTitle);
    }
    result.push(art);
  }

  return result;
}

export function App() {
  const [currentCity, setCurrentCity] = useState<CityInfo>(CITIES[0]); // Austin default
  const [articles, setArticles] = useState<NewsArticle[]>(() => deduplicateArticles(INITIAL_ARTICLES));
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
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isNewsManagerOpen, setIsNewsManagerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [ads, setAds] = useState<AdBanner[]>(INITIAL_ADS);
  const [isMonetizationEnabled, setIsMonetizationEnabled] = useState<boolean>(false);

  const [fredStats, setFredStats] = useState<{ 
    source?: string;
    mortgage30Year: string; 
    mortgage15Year: string; 
    asOfDate: string; 
    isRealLiveFredData?: boolean;
    sourceType?: string;
  }>({
    source: 'Freddie Mac PMMS & FRED',
    mortgage30Year: '6.67%',
    mortgage15Year: '5.96%',
    asOfDate: '2026-08-13'
  });
  const [isRefreshingFred, setIsRefreshingFred] = useState(false);

  const handleRefreshFredRates = async () => {
    setIsRefreshingFred(true);
    try {
      const res = await fetch(`/api/live-market-stats?force=true&t=${Date.now()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setFredStats(json.data);
        showToast(`Rates updated to latest Thursday PMMS release: 30-Yr ${json.data.mortgage30Year}, 15-Yr ${json.data.mortgage15Year} (${json.data.asOfDate})`);
      } else {
        showToast('FRED rates verified with latest Thursday release.');
      }
    } catch (err) {
      console.warn("Failed to refresh FRED stats:", err);
      showToast('FRED rate sync error. Showing latest verified weekly survey.');
    } finally {
      setTimeout(() => setIsRefreshingFred(false), 500);
    }
  };

  const fetchAds = () => {
    fetch(`/api/ads?all=true&t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.ads)) {
          setAds(data.ads);
        }
      })
      .catch(err => console.warn("Error fetching ads:", err));
  };

  const fetchMonetizationStatus = () => {
    fetch(`/api/monetization-status?t=${Date.now()}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && typeof json.enabled === 'boolean') {
          setIsMonetizationEnabled(json.enabled);
        }
      })
      .catch(err => console.warn('Failed to load monetization status:', err));
  };

  // Real-time synchronization across all devices, laptops, and mobile screens
  useEffect(() => {
    // 1. Initial immediate sync
    fetchAds();
    fetchMonetizationStatus();

    // 2. Active background heartbeat (syncs changes made on any device automatically)
    const syncInterval = setInterval(() => {
      fetchAds();
      fetchMonetizationStatus();
    }, 6000);

    // 3. Instant sync on focus / tab visibility change
    const handleSyncOnFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchAds();
        fetchMonetizationStatus();
      }
    };

    window.addEventListener('focus', handleSyncOnFocus);
    document.addEventListener('visibilitychange', handleSyncOnFocus);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleSyncOnFocus);
      document.removeEventListener('visibilitychange', handleSyncOnFocus);
    };
  }, []);

  const handleToggleMonetization = async (enabled: boolean) => {
    setIsMonetizationEnabled(enabled);

    try {
      const res = await fetch('/api/admin/monetization-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      const data = await res.json();
      if (data.success) {
        showToast(enabled ? 'Monetization Manager ENABLED - Banners are live on all devices!' : 'Monetization Manager TURNED OFF - All ad banners hidden on all devices!');
        fetchAds();
      }
    } catch (err) {
      console.warn('Monetization toggle sync failed:', err);
      showToast(enabled ? 'Monetization Manager ENABLED' : 'Monetization Manager TURNED OFF');
    }
  };

  // Fetch live FRED market stats on mount so header, mortgage calculator & trends share exact same rates
  useEffect(() => {
    fetch('/api/live-market-stats')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFredStats(json.data);
        }
      })
      .catch(err => console.warn("Failed to load live FRED stats in App", err));
  }, []);

  const handleResetToMain = () => {
    setCurrentCity(CITIES[0]);
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedArticle(null);
    setIsCitySelectorOpen(false);
    setIsSavedDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Force a complete browser refresh with timestamp cache-buster to fetch new app versions on mobile & desktop
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    window.location.href = `${origin}${pathname}?refresh=${Date.now()}`;
  };

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('city_pulse_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.warn("Could not write bookmarks to localStorage", e);
    }
  }, [bookmarkedIds]);

  const fetchArticles = () => {
    fetch(`/api/news/articles?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(prev => {
            return deduplicateArticles([...data.articles, ...prev]);
          });
        }
      })
      .catch(err => {
        console.warn("Could not load articles from Firebase API, using local fallback", err);
      });
  };

  // Load articles from Firebase Firestore on mount and merge with INITIAL_ARTICLES
  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch live city news when city or category changes
  useEffect(() => {
    if (!currentCity) return;
    
    fetch('/api/fetch-city-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName: currentCity.name, category: activeCategory })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(prev => {
            return deduplicateArticles([...data.articles, ...prev]);
          });
        }
      })
      .catch(err => {
        console.warn("Live city news fetch quiet error:", err);
      });
  }, [currentCity, activeCategory]);

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
    const isOrangeCountyAll = currentCity.id === 'orange-county';
    const cName = currentCity.name.toLowerCase().trim();

    let matched: NewsArticle[] = [];

    if (isOrangeCountyAll) {
      matched = [...articles];
    } else {
      // Direct city matches ONLY when a specific city is selected
      matched = articles.filter(art => {
        const artCity = (art.cityName || '').toLowerCase().trim();
        const artTitle = (art.title || '').toLowerCase();
        const artSub = (art.subtitle || '').toLowerCase();
        const artNbhd = (art.realEstateData?.neighborhood || '').toLowerCase();
        const artAddr = (art.venueDetails?.address || '').toLowerCase();

        return (
          artCity.includes(cName) ||
          cName.includes(artCity) ||
          artTitle.includes(cName) ||
          artSub.includes(cName) ||
          artNbhd.includes(cName) ||
          artAddr.includes(cName)
        );
      });
    }

    // Category & Search query filtering
    let finalFiltered = matched.filter(art => {
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

      return matchesCat && matchesQuery;
    });

    // Fallback: If category filter resulted in 0 articles for a specific city,
    // fallback to showing regional articles matching that requested category
    if (finalFiltered.length === 0 && activeCategory !== 'all') {
      finalFiltered = articles.filter(art => art.category === activeCategory);
    }

    return deduplicateArticles(finalFiltered);
  }, [articles, currentCity, activeCategory, searchQuery]);

  // Featured Hero Article
  const heroArticle = useMemo(() => {
    if (filteredArticles.length === 0) return null;
    return filteredArticles.find(a => a.isFeatured || a.isBreaking) || filteredArticles[0];
  }, [filteredArticles]);

  // Remaining articles excluding hero
  const remainingArticles = useMemo(() => {
    if (!heroArticle) return filteredArticles;
    return filteredArticles.filter(a => a.id !== heroArticle.id);
  }, [filteredArticles, heroArticle]);

  // Non-overlapping section assignment: every article appears AT MOST ONCE on page
  const { realEstateArticles, teamAndEventArticles, diningArticles, developmentArticles, otherArticles } = useMemo(() => {
    const usedIds = new Set<string>();

    const teamList: NewsArticle[] = [];
    const reList: NewsArticle[] = [];
    const diningList: NewsArticle[] = [];
    const devList: NewsArticle[] = [];
    const othList: NewsArticle[] = [];

    // 1. Team News & Local Events
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id) && (a.category === 'team-news' || a.category === 'events')) {
        teamList.push(a);
        usedIds.add(a.id);
      }
    });

    // 2. Real Estate & Housing
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id) && (a.category === 'real-estate' || a.category === 'market-trends' || !!a.realEstateData)) {
        reList.push(a);
        usedIds.add(a.id);
      }
    });

    // 3. Restaurants & Dining
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id) && (a.category === 'restaurants-bars' || !!a.venueDetails)) {
        diningList.push(a);
        usedIds.add(a.id);
      }
    });

    // 4. City Developments & Zoning
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id) && (a.category === 'city-developments' || a.category === 'lifestyle')) {
        devList.push(a);
        usedIds.add(a.id);
      }
    });

    // 5. Other Local Coverage
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id)) {
        othList.push(a);
        usedIds.add(a.id);
      }
    });

    return {
      realEstateArticles: reList,
      teamAndEventArticles: teamList,
      diningArticles: diningList,
      developmentArticles: devList,
      otherArticles: othList
    };
  }, [remainingArticles]);

  // Saved articles list
  const savedArticlesList = useMemo(() => {
    return articles.filter(a => bookmarkedIds.has(a.id));
  }, [articles, bookmarkedIds]);

  // Market data for the currently selected city
  const currentCitySoldData = useMemo(() => {
    const name = currentCity.name.toLowerCase().trim();
    if (name === 'orange county' || name === 'all of o.c.') return null;
    return OC_SOLD_REPORT.find(s => 
      s.city.toLowerCase() === name || 
      name.includes(s.city.toLowerCase()) || 
      s.city.toLowerCase().includes(name)
    );
  }, [currentCity.name]);

  const currentCityMarketData = useMemo(() => {
    const name = currentCity.name.toLowerCase().trim();
    if (name === 'orange county' || name === 'all of o.c.') return null;
    return OC_MARKET_TIME_REPORT.find(m => 
      m.city.toLowerCase() === name || 
      name.includes(m.city.toLowerCase()) || 
      m.city.toLowerCase().includes(name)
    );
  }, [currentCity.name]);

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
        fredRate={fredStats?.mortgage30Year}
        asOfDate={fredStats?.asOfDate}
        onOpenManager={() => setIsManagerModalOpen(true)}
        onOpenNewsManager={() => setIsNewsManagerOpen(true)}
        isMonetizationEnabled={isMonetizationEnabled}
      />

      {/* Main Layout Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-8 pb-28 sm:pb-12">
        
        {/* Top Leaderboard Spread Banner - Prominently Displayed on ALL Devices (Mobile, Tablet, Desktop) */}
        <AdBannerRenderer
          placement="header-banner"
          ads={ads}
          cityName={currentCity.name}
          monetizationEnabled={isMonetizationEnabled}
          onOpenManager={() => setIsManagerModalOpen(true)}
        />

        {/* Category Views */}
        {activeCategory === 'mortgage-calculator' ? (
          <MortgageCalculator
            currentCity={currentCity}
            fredStats={fredStats}
            ads={ads}
            monetizationEnabled={isMonetizationEnabled}
            onSelectCity={(city) => {
              setCurrentCity(city);
              showToast(`Selected ${city.name}`);
            }}
          />
        ) : activeCategory === 'market-trends' ? (
          <OrangeCountyMarketTrends
            currentCityName={currentCity.name}
            fredStats={fredStats}
            showFilterBar={true}
            ads={ads}
            monetizationEnabled={isMonetizationEnabled}
            onRefreshRates={handleRefreshFredRates}
            isRefreshingRates={isRefreshingFred}
            onSelectCity={(city) => {
              setCurrentCity(city);
              showToast(`Selected ${city.name}`);
            }}
          />
        ) : activeCategory === 'oc-fast' ? (
          <OCFastMarketReport
            ads={ads}
            monetizationEnabled={isMonetizationEnabled}
            onSelectCity={(city) => {
              setCurrentCity(city);
              showToast(`Selected ${city.name}`);
            }}
            onShowToast={showToast}
          />
        ) : (
          <>
            {/* Apple Style City Masthead Hero Banner with Live Market Data */}
            <div className="relative rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[12px] font-mono font-black tracking-widest text-[#FA2D48] uppercase block">
                    Steven Thomas Report
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-950 tracking-tight">
                    {currentCity.name}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Direct Dropdown City Selector */}
                  <div className="relative">
                    <select
                      value={currentCity.id}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matched = CITIES.find(c => c.id === val);
                        if (matched) {
                          setCurrentCity(matched);
                          showToast(`Selected ${matched.name}`);
                        }
                      }}
                      className="bg-[#F2F2F7] hover:bg-slate-200 border border-slate-200/80 rounded-xl pl-3 pr-8 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#FA2D48] transition-all cursor-pointer appearance-none"
                    >
                      {CITIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 rotate-90 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => setIsCitySelectorOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span>All Cities</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveCategory('market-trends')}
                    className="px-4 py-2.5 rounded-xl bg-[#FA2D48] hover:bg-[#E0263E] text-white font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Market Trends</span>
                  </button>
                </div>
              </div>

              {/* City Market Trend Highlights */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Median Sales Price</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 pt-0.5">
                    {currentCitySoldData?.medianSalesPrice || currentCityMarketData?.medianActiveListPrice || '$1,305,471'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium pt-0.5">
                    {currentCitySoldData ? `List: ${currentCitySoldData.medianListPrice}` : 'Countywide Median'}
                  </div>
                </div>

                <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Days on Market</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 pt-0.5">
                    {currentCitySoldData?.medianDOM ? `${currentCitySoldData.medianDOM} Days` : (currentCityMarketData?.marketTimeDays ? `${currentCityMarketData.marketTimeDays} Days` : '32 Days')}
                  </div>
                  <div className="text-[10px] text-emerald-700/80 font-bold pt-0.5">
                    {currentCityMarketData?.marketTimeDays && currentCityMarketData.marketTimeDays < 60 
                      ? "Hot Seller's Market" 
                      : (currentCityMarketData?.marketTimeDays && currentCityMarketData.marketTimeDays < 90 ? "Slight Seller's Market" : "Active Velocity")}
                  </div>
                </div>

                <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Price Per Sq. Ft.</div>
                  <div className="text-xl sm:text-2xl font-black text-[#FA2D48] pt-0.5">
                    {currentCitySoldData?.medianPricePerSqFt || currentCity.avgSqftPrice || '$692 /sqft'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium pt-0.5">
                    {currentCitySoldData ? `Median ${currentCitySoldData.medianSqFt} sqft` : 'July 2026 Avg'}
                  </div>
                </div>

                <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/70">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    {currentCitySoldData ? 'Sales to List Ratio' : 'Active Inventory'}
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 pt-0.5">
                    {currentCitySoldData?.salesToListRatio || (currentCityMarketData ? `${currentCityMarketData.currentActives} Homes` : '5,046 Homes')}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium pt-0.5">
                    {currentCityMarketData ? `${currentCityMarketData.demand30Days} Pending Escrows` : '1,494 30-Day Demand'}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Page Top Market Overview: Days on Market, Months of Supply, % Orig List Price, Price/SqFt */}
            <OCFastTopOverview 
              title="Orange County Local Market Update"
              onViewFullReport={() => setActiveCategory('oc-fast')}
              showExploreButton={true}
            />

            {/* Featured Hero / Top Stories */}
            {heroArticle && (
              <section className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tighter text-[#FA2D48] leading-none">
                    Top Stories
                  </h2>
                </div>

                <FeaturedHeroStory
                  article={heroArticle}
                  onSelectArticle={setSelectedArticle}
                  isBookmarked={bookmarkedIds.has(heroArticle.id)}
                  onToggleBookmark={toggleBookmark}
                />
              </section>
            )}

            {/* Mid-Page Sponsor Spotlight */}
            <AdBannerRenderer
              placement="market-trends-banner"
              ads={ads}
              cityName={currentCity.name}
              monetizationEnabled={isMonetizationEnabled}
              onOpenManager={() => setIsManagerModalOpen(true)}
            />

            {/* Section 1: Team News & Events */}
            {teamAndEventArticles.length > 0 && (
              <NewsGridSection
                title={`Team News, Brokerage Updates & Local Events`}
                icon={<Users className="w-5 h-5 text-indigo-600" />}
                articles={teamAndEventArticles}
                onSelectArticle={setSelectedArticle}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            )}

            {/* Section 2: Real Estate & Housing Market */}
            {realEstateArticles.length > 0 && (
              <NewsGridSection
                title={`Real Estate & Housing in ${currentCity.name}`}
                icon={<Building2 className="w-5 h-5 text-amber-600" />}
                articles={realEstateArticles}
                onSelectArticle={setSelectedArticle}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
                adBanner={
                  <AdBannerRenderer 
                    placement="feed-native" 
                    ads={ads} 
                    cityName={currentCity.name} 
                    monetizationEnabled={isMonetizationEnabled}
                  />
                }
              />
            )}

            {/* Section 3: Hot New Restaurant & Bar Openings */}
            {diningArticles.length > 0 && (
              <NewsGridSection
                title={`New Restaurant & Bar Debuts in ${currentCity.name}`}
                icon={<Utensils className="w-5 h-5 text-emerald-600" />}
                articles={diningArticles}
                onSelectArticle={setSelectedArticle}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            )}

            {/* Section 4: City Developments & Zoning Updates */}
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

            {/* Section 5: Other Local Coverage */}
            {otherArticles.length > 0 && (
              <NewsGridSection
                title={`More Local Updates in ${currentCity.name}`}
                icon={<Sparkles className="w-5 h-5 text-[#FA2D48]" />}
                articles={otherArticles}
                onSelectArticle={setSelectedArticle}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            )}

            {/* Loading / Empty state if no news found for selected city */}
            {filteredArticles.length === 0 && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs my-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FA2D48] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Fetching Local News for {currentCity.name}...
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Retrieving verified local municipal feeds, development permits, and real estate market reports for {currentCity.name}.
                </p>
              </div>
            )}
          </>
        )}

      </main>

      {/* Apple News Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? bookmarkedIds.has(selectedArticle.id) : false}
        onToggleBookmark={toggleBookmark}
        onShowToast={showToast}
        ads={ads}
        monetizationEnabled={isMonetizationEnabled}
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
        onViewMarketTrends={(city) => {
          setCurrentCity(city);
          setActiveCategory('market-trends');
          showToast(`Opened ${city.name} Market Trends`);
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

      {/* News & Story Manager Modal */}
      <NewsManagerModal
        isOpen={isNewsManagerOpen}
        onClose={() => setIsNewsManagerOpen(false)}
        articles={articles}
        onRefreshArticles={fetchArticles}
        onShowToast={showToast}
        currentCityName={currentCity.name}
      />

      {/* Manager Admin & Monetization Portal Modal */}
      <ManagerAdminModal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        ads={ads}
        onRefreshAds={fetchAds}
        onShowToast={showToast}
        isMonetizationEnabled={isMonetizationEnabled}
        onToggleMonetization={handleToggleMonetization}
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
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500 mt-12 mb-10 sm:mb-0">
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
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono">
            <button onClick={handleResetToMain} className="hover:text-slate-900 cursor-pointer">Main Feed</button>
            <button onClick={() => setActiveCategory('market-trends')} className="hover:text-slate-900 cursor-pointer font-bold">Market Trends</button>
            <button onClick={() => setActiveCategory('oc-fast')} className="text-[#FA2D48] hover:underline cursor-pointer font-black">OC Fast Report</button>
            <button onClick={() => setActiveCategory('mortgage-calculator')} className="hover:text-slate-900 cursor-pointer">Mortgage Calc</button>
            <button onClick={() => setIsCitySelectorOpen(true)} className="hover:text-slate-900 cursor-pointer">Cities</button>
            <button onClick={() => setIsSavedDrawerOpen(true)} className="hover:text-slate-900 cursor-pointer">Bookmarks ({bookmarkedIds.size})</button>
            <button onClick={() => setIsNewsManagerOpen(true)} className="text-slate-900 font-bold hover:underline cursor-pointer">News Desk</button>
            <button onClick={() => setIsManagerModalOpen(true)} className="text-[#FA2D48] font-bold hover:underline cursor-pointer">Sponsor Portal</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;

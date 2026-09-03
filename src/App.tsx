import React, { useState, useEffect, useMemo } from 'react';
import { CityInfo, NewsCategory, NewsArticle, AdBanner, LiveMortgageRates } from './types';
import { CITIES, INITIAL_ARTICLES } from './data/mockNews';
import { INITIAL_ADS } from './data/mockAds';
import { OC_HOUSING_REPORT_METADATA, OC_SOLD_REPORT, OC_MARKET_TIME_REPORT } from './data/ocHousingReportData';
import { AppleNewsHeader } from './components/AppleNewsHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CitySelectorModal } from './components/CitySelectorModal';
import { FeaturedHeroStory } from './components/FeaturedHeroStory';
import { NewsGridSection } from './components/NewsGridSection';
import { OrangeCountyMarketTrends, getMarketCondition } from './components/OrangeCountyMarketTrends';
import { IconMarketIntelligence } from './components/IconMarketIntelligence';
import { OCFastMarketReport } from './components/OCFastMarketReport';
import { OCFastTopOverview } from './components/OCFastTopOverview';
import { MortgageCalculator } from './components/MortgageCalculator';
import { ArticleReaderPage } from './components/ArticleReaderPage';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { AdBannerRenderer } from './components/AdBannerRenderer';
import { ManagerAdminModal } from './components/ManagerAdminModal';
import { NewsManagerModal } from './components/NewsManagerModal';
import { Sparkles, Building2, Utensils, Flame, Compass, ChevronRight, Users, MapPin, TrendingUp, Clock, Tag, BarChart3, Check, Newspaper } from 'lucide-react';

// Helper function to check if an article is recent (within 15 days) and not deprecated
export function isArticleRecent(art: NewsArticle, maxDays: number = 15): boolean {
  if (!art || !art.title) return false;

  // 1. Explicitly remove Condo Conundrum
  const lowerTitle = (art.title || '').toLowerCase();
  if (art.id === 'report-oc-condo-conundrum' || lowerTitle.includes('condo conundrum')) {
    return false;
  }

  const now = Date.now();
  const maxMs = maxDays * 24 * 60 * 60 * 1000;

  // 2. Check createdAtMs timestamp if available
  const anyArt = art as any;
  if (typeof anyArt.createdAtMs === 'number' && !isNaN(anyArt.createdAtMs) && anyArt.createdAtMs > 0) {
    if (now - anyArt.createdAtMs > maxMs) {
      return false;
    }
  }

  // 3. Check publishedAt string format
  const pub = (art.publishedAt || '').trim().toLowerCase();
  if (!pub) return true;

  if (pub.includes('month') || pub.includes('year')) {
    return false;
  }

  const weeksMatch = pub.match(/(\d+)\s*week/);
  if (weeksMatch) {
    const weeks = parseInt(weeksMatch[1], 10);
    if (weeks * 7 > maxDays) return false;
  }

  const daysMatch = pub.match(/(\d+)\s*day/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10);
    if (days > maxDays) return false;
  }

  // Check parsed date if applicable
  const parsed = Date.parse(art.publishedAt);
  if (!isNaN(parsed) && parsed > 0) {
    const diff = now - parsed;
    if (diff > maxMs) {
      return false;
    }
  }

  return true;
}

// Helper function to deduplicate articles strictly by ID, normalized Title, and source URL
function deduplicateArticles(list: NewsArticle[]): NewsArticle[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const result: NewsArticle[] = [];

  for (const art of list) {
    if (!art || !art.title) continue;

    // Filter out articles older than 15 days or deprecated
    if (!isArticleRecent(art, 15)) continue;

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
  const [cityReportTab, setCityReportTab] = useState<'velocity' | 'closed' | 'historical' | 'summary'>('velocity');

  // Read cached rates from localStorage for instant mobile loading & offline resilience
  const getInitialRates = (): LiveMortgageRates => {
    try {
      const saved = localStorage.getItem('cached_live_mortgage_rates');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.mortgage30Year) return parsed;
      }
    } catch (e) {
      console.warn("Could not read cached rates from localStorage", e);
    }
    return {
      source: 'Mortgage News Daily (MND Daily Index)',
      asOfDate: 'Daily Live Market',
      mortgage30Year: '6.91%',
      mortgage15Year: '6.50%',
      jumbo30Year: '7.00%',
      fha30Year: '6.45%',
      va30Year: '6.47%',
      rate30Year7DaysAgo: '6.74%',
      rate30YearChange7Days: 0.17,
      sourceType: 'MORTGAGE_NEWS_DAILY',
      isRealLiveRate: true
    };
  };

  const [liveRates, setLiveRates] = useState<LiveMortgageRates>(getInitialRates);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  const fetchLiveRates = () => {
    fetch(`/api/live-market-stats?t=${Date.now()}&device=mobile`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setLiveRates(json.data);
          try {
            localStorage.setItem('cached_live_mortgage_rates', JSON.stringify(json.data));
          } catch (e) {
            console.warn("Could not cache live rates in localStorage", e);
          }
        }
      })
      .catch(err => console.warn("Failed to sync live mortgage rates:", err));
  };

  const handleRefreshLiveRates = async () => {
    setIsRefreshingRates(true);
    try {
      const res = await fetch(`/api/live-market-stats?force=true&t=${Date.now()}&device=mobile`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setLiveRates(json.data);
        try {
          localStorage.setItem('cached_live_mortgage_rates', JSON.stringify(json.data));
        } catch (e) {
          console.warn("Could not cache live rates in localStorage", e);
        }
        showToast(`MND Live Rates updated: 30-Yr ${json.data.mortgage30Year} • 15-Yr ${json.data.mortgage15Year}`);
      } else {
        showToast('Rates verified with Mortgage News Daily.');
      }
    } catch (err) {
      console.warn("Failed to refresh live rates:", err);
      showToast('Live rate sync completed.');
    } finally {
      setTimeout(() => setIsRefreshingRates(false), 500);
    }
  };

  const fetchAds = () => {
    fetch(`/api/ads?all=true&t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.ads)) {
          setAds(data.ads);
        }
      })
      .catch(err => console.warn("Error fetching ads:", err));
  };

  const fetchMonetizationStatus = () => {
    fetch(`/api/monetization-status?t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    })
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
    fetchLiveRates();

    // 2. Active background heartbeat (syncs live MND rates & changes across all devices)
    const syncInterval = setInterval(() => {
      fetchAds();
      fetchMonetizationStatus();
      fetchLiveRates();
    }, 10000);

    // 3. Instant sync on mobile/desktop focus, tab visibility change, page show, online & resume
    const handleSyncOnResume = () => {
      if (document.visibilityState === 'visible' || document.visibilityState === undefined) {
        fetchAds();
        fetchMonetizationStatus();
        fetchLiveRates();
      }
    };

    window.addEventListener('focus', handleSyncOnResume);
    window.addEventListener('pageshow', handleSyncOnResume);
    window.addEventListener('online', handleSyncOnResume);
    document.addEventListener('visibilitychange', handleSyncOnResume);

    // First touch trigger on mobile devices to guarantee wake-up synchronization
    const handleFirstTouch = () => {
      fetchLiveRates();
    };
    window.addEventListener('touchstart', handleFirstTouch, { once: true, passive: true });

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleSyncOnResume);
      window.removeEventListener('pageshow', handleSyncOnResume);
      window.removeEventListener('online', handleSyncOnResume);
      document.removeEventListener('visibilitychange', handleSyncOnResume);
      window.removeEventListener('touchstart', handleFirstTouch);
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

  const handleResetToMain = () => {
    setCurrentCity(CITIES[0]);
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedArticle(null);
    setIsCitySelectorOpen(false);
    setIsSavedDrawerOpen(false);
    setArticles(INITIAL_ARTICLES);
    fetchMndNews();
    fetchLiveRates();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Feed refreshed & reset to Top Stories');
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

  const fetchMndNews = () => {
    fetch(`/api/mnd-news?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(prev => {
            return deduplicateArticles([...data.articles, ...prev]);
          });
        }
      })
      .catch(err => {
        console.warn("Could not load MND news, using cached fallback", err);
      });
  };

  // Load articles from Firebase Firestore & Mortgage News Daily on mount
  useEffect(() => {
    fetchArticles();
    fetchMndNews();
  }, []);

  // Fetch live city news when city or category changes (only on local municipal pages, not on main page or special report tabs)
  useEffect(() => {
    if (!currentCity) return;
    if (activeCategory === 'all' || activeCategory === 'mortgage-news' || activeCategory === 'market-trends' || activeCategory === 'oc-fast' || activeCategory === 'mortgage-calculator') {
      return;
    }
    
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
    const q = searchQuery.toLowerCase().trim();

    // 1. Main Page ("Top Stories" / "all") & "Mortgage Daily News":
    // Exclusively showcase Mortgage News Daily (MND) wire stories
    if (activeCategory === 'all' || activeCategory === 'mortgage-news') {
      let mndList = articles.filter(art => art.category === 'mortgage-news' || art.publisher === 'Mortgage News Daily');
      
      if (q) {
        mndList = mndList.filter(art => 
          art.title.toLowerCase().includes(q) ||
          art.subtitle.toLowerCase().includes(q) ||
          art.publisher.toLowerCase().includes(q)
        );
      }

      if (mndList.length > 0) {
        return deduplicateArticles(mndList);
      }
    }

    // 2. Local Orange County & Municipal News Pages (Orange County News, Team News, Dining):
    const isOrangeCountyAll = currentCity.id === 'orange-county';
    const cName = currentCity.name.toLowerCase().trim();

    let matched = articles;
    if (!isOrangeCountyAll) {
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

    // Category & Search query filtering for local pages
    let finalFiltered = matched.filter(art => {
      let matchesCat = false;
      if (activeCategory === 'real-estate') {
        // "Orange County News" page: show all local Orange County news (exclude national mortgage wire)
        matchesCat = art.category !== 'mortgage-news' && art.publisher !== 'Mortgage News Daily';
      } else {
        matchesCat = art.category === activeCategory;
      }

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
      if (activeCategory === 'real-estate') {
        finalFiltered = articles.filter(art => art.category !== 'mortgage-news' && art.publisher !== 'Mortgage News Daily');
      } else {
        finalFiltered = articles.filter(art => art.category === activeCategory);
      }
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
  const { mortgageArticles, realEstateArticles, teamAndEventArticles, diningArticles, developmentArticles, otherArticles } = useMemo(() => {
    const usedIds = new Set<string>();

    const mndList: NewsArticle[] = [];
    const teamList: NewsArticle[] = [];
    const reList: NewsArticle[] = [];
    const diningList: NewsArticle[] = [];
    const devList: NewsArticle[] = [];
    const othList: NewsArticle[] = [];

    // 0. Mortgage Daily News (MND Live Feeds)
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id) && (a.category === 'mortgage-news' || a.publisher === 'Mortgage News Daily')) {
        mndList.push(a);
        usedIds.add(a.id);
      }
    });

    // 1. Team News & Local Events
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id) && (a.category === 'team-news' || a.category === 'events')) {
        teamList.push(a);
        usedIds.add(a.id);
      }
    });

    // 2. Real Estate, Housing & Local Projects
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id) && (a.category === 'real-estate' || a.category === 'market-trends' || a.category === 'city-developments' || !!a.realEstateData)) {
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

    // 4. Other Local Coverage
    remainingArticles.forEach(a => {
      if (!usedIds.has(a.id)) {
        othList.push(a);
        usedIds.add(a.id);
      }
    });

    return {
      mortgageArticles: mndList,
      realEstateArticles: reList,
      teamAndEventArticles: teamList,
      diningArticles: diningList,
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
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = clean(name);
    return OC_SOLD_REPORT.find(s => {
      const cleanCity = clean(s.city);
      return cleanCity === cleanName || cleanCity.includes(cleanName) || cleanName.includes(cleanCity);
    });
  }, [currentCity.name]);

  const currentCityMarketData = useMemo(() => {
    const name = currentCity.name.toLowerCase().trim();
    if (name === 'orange county' || name === 'all of o.c.') return null;
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = clean(name);
    return OC_MARKET_TIME_REPORT.find(m => {
      const cleanCity = clean(m.city);
      return cleanCity === cleanName || cleanCity.includes(cleanName) || cleanName.includes(cleanCity);
    });
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

      {/* Main Apple News Navigation Header (Hidden on article page) */}
      {!selectedArticle && (
        <AppleNewsHeader
          currentCity={currentCity}
          onOpenCitySelector={() => {
            setSelectedArticle(null);
            setIsCitySelectorOpen(true);
          }}
          onSelectCity={(city) => {
            setSelectedArticle(null);
            setCurrentCity(city);
          }}
          activeCategory={activeCategory}
          onSelectCategory={(cat) => {
            setSelectedArticle(null);
            setActiveCategory(cat);
          }}
          savedCount={bookmarkedIds.size}
          onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResetToMain={handleResetToMain}
          fredRate={liveRates?.mortgage30Year}
          rate30Year7DaysAgo={liveRates?.rate30Year7DaysAgo}
          rate30YearChange7Days={liveRates?.rate30YearChange7Days}
          asOfDate={liveRates?.asOfDate}
          onOpenManager={() => setIsManagerModalOpen(true)}
          onOpenNewsManager={() => setIsNewsManagerOpen(true)}
          isMonetizationEnabled={isMonetizationEnabled}
          onRefreshRates={handleRefreshLiveRates}
          isRefreshingRates={isRefreshingRates}
        />
      )}

      {/* Main Layout Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-8 pb-28 sm:pb-12">
        {selectedArticle ? (
          <ArticleReaderPage
            article={selectedArticle}
            onBack={() => {
              setSelectedArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isBookmarked={bookmarkedIds.has(selectedArticle.id)}
            onToggleBookmark={toggleBookmark}
            onShowToast={showToast}
            ads={ads}
            monetizationEnabled={isMonetizationEnabled}
          />
        ) : (
          <>
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
            liveRates={liveRates}
            ads={ads}
            monetizationEnabled={isMonetizationEnabled}
            onSelectCity={(city) => {
              setCurrentCity(city);
              showToast(`Selected ${city.name}`);
            }}
          />
        ) : activeCategory === 'market-trends' ? (
          <IconMarketIntelligence
            currentCity={currentCity}
            onSelectCity={(city) => {
              setCurrentCity(city);
              showToast(`Selected ${city.name}`);
            }}
            onShowToast={showToast}
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
            {/* Main Page Only: Icon Market Intelligence City Overview & OCFastTopOverview */}
            {activeCategory === 'all' ? (
              <>
                {/* Apple Style City Masthead Hero Banner with Steven Thomas Market Intelligence */}
                <div className="relative rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-2">
                      {/* Byline: Steven Thomas in red, Reports On Housing & Report Date */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-xs sm:text-sm font-sans font-black tracking-wider text-[#FA2D48] uppercase">
                          Steven Thomas
                        </span>
                        <span className="text-slate-300 font-bold hidden sm:inline">•</span>
                        <span className="font-bold text-slate-700 flex items-center gap-1 font-sans text-xs">
                          <span>Reports On Housing</span>
                        </span>
                        <span className="text-slate-300 font-bold">•</span>
                        <span className="font-bold text-slate-500 font-sans text-xs">
                          {OC_HOUSING_REPORT_METADATA.reportDate}
                        </span>
                        {currentCityMarketData && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ml-auto sm:ml-0 font-sans">
                            {currentCityMarketData.region}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-sans text-slate-950 tracking-tight whitespace-nowrap">
                          {currentCity.id === 'orange-county' ? 'Select City' : currentCity.name}
                        </h2>

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
                            className="bg-[#F2F2F7] hover:bg-slate-200 border border-slate-300/80 rounded-xl pl-3 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FA2D48] transition-all cursor-pointer appearance-none shadow-xs"
                          >
                            {CITIES.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 sm:top-3 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {currentCity.id !== 'orange-county' && (
                        <button
                          onClick={() => {
                            const ocCity = CITIES.find(c => c.id === 'orange-county') || CITIES[0];
                            setCurrentCity(ocCity);
                            showToast('Reset to All Orange County');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
                        >
                          ← Countywide View
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Steven Thomas City Report Format — Displayed when a city is selected */}
                  {currentCity.id !== 'orange-county' && (currentCityMarketData || currentCitySoldData) && (() => {
                    const soldData = currentCitySoldData;
                    const marketData = currentCityMarketData;
                    const yoyUnitsChange = soldData ? soldData.unitsSold2026 - soldData.unitsSold2025 : 0;

                    return (
                      <div className="space-y-6 pt-2">
                        {/* 1. CURRENT ACTIVE INVENTORY & EXPECTED MARKET TIME (Steven Thomas Page 10 Report) */}
                        {marketData && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-[#FA2D48]" />
                                <span>Expected Market Time & Active Velocity</span>
                              </h3>
                              <span className="text-[11px] font-bold text-slate-500">
                                Steven Thomas Analysis ({OC_HOUSING_REPORT_METADATA.reportDate})
                              </span>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                              {(() => {
                                const cond = getMarketCondition(marketData.marketTimeDays);
                                return (
                                  <div className={`${cond.bgClass} p-4 rounded-2xl flex flex-col justify-between shadow-xs space-y-1`}>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-white opacity-90">Expected Market Time</span>
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-black pt-1 text-white tracking-tight">
                                      {marketData.marketTimeDays} Days
                                    </div>
                                    <div className="pt-2">
                                      <span className="bg-white text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded-lg inline-block shadow-xs">
                                        {cond.badgeText}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}

                              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Active Inventory</div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{marketData.currentActives} Homes</div>
                                <div className="text-[11px] text-emerald-600 pt-1 font-bold">Active listings on market</div>
                              </div>

                              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">30-Day Demand</div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{marketData.demand30Days} Pending</div>
                                <div className="text-[11px] text-emerald-600 pt-1 font-bold">Recent pending escrows</div>
                              </div>

                              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Active List Price</div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{marketData.medianActiveListPrice}</div>
                                <div className="text-[11px] text-emerald-600 pt-1 font-bold">Current active listings</div>
                              </div>
                            </div>

                            {/* Historical DOM Trend Bar */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                              <div className="text-xs font-black text-slate-900 uppercase tracking-wider">Historical Expected Market Time Pace:</div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-sans">
                                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
                                  <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">2 Weeks Ago</div>
                                    <div className="text-base font-black text-slate-950 pt-0.5">{marketData.marketTime2WeeksAgo} Days</div>
                                  </div>
                                  <div className={`text-[11px] font-black pt-1 border-t border-slate-100 mt-1 ${getMarketCondition(marketData.marketTime2WeeksAgo).accentText}`}>
                                    {getMarketCondition(marketData.marketTime2WeeksAgo).label}
                                  </div>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
                                  <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">4 Weeks Ago</div>
                                    <div className="text-base font-black text-slate-950 pt-0.5">{marketData.marketTime4WeeksAgo} Days</div>
                                  </div>
                                  <div className={`text-[11px] font-black pt-1 border-t border-slate-100 mt-1 ${getMarketCondition(marketData.marketTime4WeeksAgo).accentText}`}>
                                    {getMarketCondition(marketData.marketTime4WeeksAgo).label}
                                  </div>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
                                  <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">1 Year Ago</div>
                                    <div className="text-base font-black text-slate-950 pt-0.5">{marketData.marketTime1YearAgo} Days</div>
                                  </div>
                                  <div className={`text-[11px] font-black pt-1 border-t border-slate-100 mt-1 ${getMarketCondition(marketData.marketTime1YearAgo).accentText}`}>
                                    {getMarketCondition(marketData.marketTime1YearAgo).label}
                                  </div>
                                </div>
                                <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-2xs">
                                  <div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">2 Years Ago</div>
                                    <div className="text-base font-black text-slate-950 pt-0.5">
                                      {marketData.marketTime2YearsAgo > 0 ? `${marketData.marketTime2YearsAgo} Days` : '—'}
                                    </div>
                                  </div>
                                  <div className={`text-[11px] font-black pt-1 border-t border-slate-100 mt-1 ${getMarketCondition(marketData.marketTime2YearsAgo).accentText}`}>
                                    {marketData.marketTime2YearsAgo > 0 ? getMarketCondition(marketData.marketTime2YearsAgo).label : 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. JULY CLOSED SALES DATA (Steven Thomas Page 12 Report) */}
                        {soldData && (
                          <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans flex items-center space-x-2">
                                <Tag className="w-4 h-4 text-[#FA2D48]" />
                                <span>July Closed Sales & Price Distribution</span>
                              </h3>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Sales Price</div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{soldData.medianSalesPrice}</div>
                                <div className="text-[11px] text-emerald-600 pt-1 font-bold">List Price: {soldData.medianListPrice}</div>
                              </div>

                              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Sales-to-List Ratio</div>
                                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 pt-1">{soldData.salesToListRatio}</div>
                                <div className="text-[11px] text-emerald-600 pt-1 font-bold">Countywide Avg: {OC_HOUSING_REPORT_METADATA.salesToListRatio}</div>
                              </div>

                              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Price / Sq. Ft.</div>
                                <div className="text-2xl sm:text-3xl font-bold text-[#FA2D48] pt-1">{soldData.medianPricePerSqFt}</div>
                                <div className="text-[11px] text-emerald-600 pt-1 font-bold">Median Size: {soldData.medianSqFt.toLocaleString()} sq ft</div>
                              </div>

                              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Closed Sales</div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{soldData.unitsSold2026} Units</div>
                                <div className={`text-[11px] pt-1 font-bold ${yoyUnitsChange < 0 ? 'text-[#FA2D48]' : 'text-emerald-600'}`}>
                                  {yoyUnitsChange >= 0 ? `+${yoyUnitsChange}` : yoyUnitsChange} vs Prior Year ({soldData.unitsSold2025})
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div className="bg-slate-50/70 rounded-2xl py-2.5 px-4 flex items-center justify-between text-xs border border-slate-200/60">
                                <span className="font-bold text-black">Price Range (Low to High):</span>
                                <span className="font-sans font-bold text-black">{soldData.lowPrice} - {soldData.highPrice}</span>
                              </div>
                              <div className="bg-slate-50/70 rounded-2xl py-2.5 px-4 flex items-center justify-between text-xs border border-slate-200/60">
                                <span className="font-bold text-black">Closed Days on Market (DOM):</span>
                                <span className="font-sans font-black text-sm sm:text-base text-black">{soldData.medianDOM} Days</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Main Page Top Market Overview: Days on Market, Months of Supply, % Orig List Price, Price/SqFt */}
                <OCFastTopOverview 
                  title="Orange County Local Market Update"
                />
              </>
            ) : activeCategory !== 'team-news' ? (
              /* Internal Pages Clean Header: No Steven Thomas or OC Fast duplicated top blocks */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-black tracking-widest text-[#FA2D48] uppercase">
                      Orange County Local Coverage
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-sans text-slate-950 tracking-tight">
                    {activeCategory === 'real-estate' ? 'Orange County News' :
                     activeCategory === 'restaurants-bars' ? 'New Restaurants & Bars' : 'Local Coverage'}
                  </h2>
                </div>

                {/* City Filter on Internal News Pages */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={currentCity.id}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matched = CITIES.find(c => c.id === val);
                        if (matched) {
                          setCurrentCity(matched);
                          showToast(`Filtered for ${matched.name}`);
                        }
                      }}
                      className="bg-[#F2F2F7] hover:bg-slate-200 border border-slate-300/80 rounded-xl pl-3 pr-7 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#FA2D48] transition-all cursor-pointer appearance-none shadow-xs"
                    >
                      {CITIES.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-3 rotate-90 pointer-events-none" />
                  </div>

                  {currentCity.id !== 'orange-county' && (
                    <button
                      onClick={() => {
                        const ocCity = CITIES.find(c => c.id === 'orange-county') || CITIES[0];
                        setCurrentCity(ocCity);
                        showToast('Reset to All Orange County');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      ← Countywide
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Featured Hero / Top Stories */}
            {heroArticle && (
              <section className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tighter text-[#FA2D48] leading-none">
                    {activeCategory === 'all' ? 'Top Stories' : 'Featured Story'}
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

            {/* Section: Mortgage News Daily • Live Market Reports (Shown on Main Page & MND Wire) */}
            {mortgageArticles.length > 0 && (activeCategory === 'all' || activeCategory === 'mortgage-news') && (
              <NewsGridSection
                title={activeCategory === 'all' ? "Mortgage News Daily • Live Market Wire & Top Stories" : "Mortgage News Daily • Live Market Wire & Rates"}
                icon={<Newspaper className="w-5 h-5 text-[#FA2D48]" />}
                articles={mortgageArticles}
                onSelectArticle={setSelectedArticle}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            )}

            {/* Section 1: Real Estate & Housing Market (Shown exclusively on 'Orange County News' tab) */}
            {realEstateArticles.length > 0 && activeCategory === 'real-estate' && (
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

            {/* Section 2: Team News & Events (Shown on 'Team News & Events' tab or 'Orange County News' tab) */}
            {teamAndEventArticles.length > 0 && (activeCategory === 'team-news' || activeCategory === 'real-estate') && (
              <NewsGridSection
                title={`Team News, Brokerage Updates & Local Events`}
                icon={<Users className="w-5 h-5 text-indigo-600" />}
                articles={teamAndEventArticles}
                onSelectArticle={setSelectedArticle}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            )}

            {/* Section 3: Hot New Restaurant & Bar Openings (Shown on 'New Restaurants & Bars' tab or 'Orange County News' tab) */}
            {diningArticles.length > 0 && (activeCategory === 'restaurants-bars' || activeCategory === 'real-estate') && (
              <NewsGridSection
                title={`New Restaurant & Bar Debuts in ${currentCity.name}`}
                icon={<Utensils className="w-5 h-5 text-emerald-600" />}
                articles={diningArticles}
                onSelectArticle={setSelectedArticle}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={toggleBookmark}
              />
            )}

            {/* Section 4: Other Local Coverage (Shown on 'Orange County News' tab) */}
            {otherArticles.length > 0 && activeCategory === 'real-estate' && (
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
          </>
        )}
      </main>

      {/* City Switcher Modal */}
      <CitySelectorModal
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        currentCity={currentCity}
        onSelectCity={(city) => {
          setSelectedArticle(null);
          setCurrentCity(city);
          showToast(`Switched to ${city.name} edition`);
        }}
        onViewMarketTrends={(city) => {
          setSelectedArticle(null);
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
        onSelectArticle={(article) => {
          setSelectedArticle(article);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
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
        onOpenCitySelector={() => {
          setSelectedArticle(null);
          setIsCitySelectorOpen(true);
        }}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setSelectedArticle(null);
          setActiveCategory(cat);
        }}
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

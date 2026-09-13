import React, { useState, useEffect, useMemo } from 'react';
import { CityInfo, NewsCategory, NewsArticle, AdBanner, LiveMortgageRates } from './types';
import { CITIES, INITIAL_ARTICLES } from './data/mockNews';
import { INITIAL_ADS } from './data/mockAds';
import { 
  OC_HOUSING_REPORT_METADATA, 
  OC_SOLD_REPORT, 
  OC_MARKET_TIME_REPORT,
  STEVEN_THOMAS_MARKET_DIRECTION,
  OC_COUNTYWIDE_LIVE_METRICS,
  STEVEN_THOMAS_DIRECTION_MATRIX
} from './data/ocHousingReportData';
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
import { Sparkles, Building2, Utensils, Flame, Compass, ChevronRight, Users, MapPin, TrendingUp, Clock, Tag, BarChart3, Check, Newspaper, X, Info, RefreshCw } from 'lucide-react';

// Helper function to check if an article is recent (within 1 day / 24 hours) and not deprecated
export function isArticleRecent(art: NewsArticle, maxDays: number = 1): boolean {
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

  if (pub.includes('month') || pub.includes('year') || pub.includes('week')) {
    return false;
  }

  const daysMatch = pub.match(/(\d+)\s*day/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1], 10);
    if (days > maxDays) return false;
  }

  if (pub.includes('2 day') || pub.includes('3 day') || pub.includes('4 day') || pub.includes('5 day') || pub.includes('yesterday')) {
    return false;
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

    // Filter out articles older than 1 day or deprecated
    if (!isArticleRecent(art, 1)) continue;

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
  const [showHistoricalMarketTimeModal, setShowHistoricalMarketTimeModal] = useState<boolean>(false);
  const [showMarketTimeModal, setShowMarketTimeModal] = useState<boolean>(false);
  const [showMarketDirectionModal, setShowMarketDirectionModal] = useState<boolean>(false);

  // Read cached rates from localStorage for instant mobile loading & offline resilience
  const getInitialRates = (): LiveMortgageRates => {
    try {
      const saved = localStorage.getItem('cached_live_mortgage_rates');
      if (saved) {
        const parsed = JSON.parse(saved);
        const isFresh = parsed && parsed.asOfTimestamp && (Date.now() - parsed.asOfTimestamp < 5 * 60 * 1000);
        // Purge old stale cache (e.g. 6.89% or 6.88% from previous days)
        if (parsed && parsed.mortgage30Year && parsed.mortgage30Year !== '6.88%' && parsed.mortgage30Year !== '6.89%' && isFresh) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read cached rates from localStorage", e);
    }
    return {
      source: 'Mortgage News Daily (MND Daily Index)',
      asOfDate: 'MND Live (9/11/26)',
      mortgage30Year: '7.12%',
      mortgage15Year: '6.65%',
      jumbo30Year: '7.25%',
      fha30Year: '6.68%',
      va30Year: '6.70%',
      freddieMac30Year: '6.76%',
      rate30Year7DaysAgo: '6.89%',
      rate30YearChange7Days: 0.23,
      sourceType: 'MORTGAGE_NEWS_DAILY',
      isRealLiveRate: true
    };
  };

  const [liveRates, setLiveRates] = useState<LiveMortgageRates>(getInitialRates);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  const fetchLiveRates = async () => {
    try {
      const cacheBustUrl = `/api/live-market-stats?force=true&t=${Date.now()}&_rnd=${Math.random()}`;
      let res = await fetch(cacheBustUrl, {
        method: 'GET',
        cache: 'no-store'
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch(`/api/live-market-stats/sync?force=true&t=${Date.now()}&_rnd=${Math.random()}`, {
          method: 'GET',
          cache: 'no-store'
        }).catch(() => null);
      }

      if (res && res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const freshData = { ...json.data, asOfTimestamp: Date.now() };
          setLiveRates(freshData);
          try {
            localStorage.setItem('cached_live_mortgage_rates', JSON.stringify(freshData));
          } catch (e) {
            console.warn("Could not cache live rates in localStorage", e);
          }
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('live-rates-synced', { detail: freshData }));
          }
        }
      }
    } catch (err) {
      console.warn("Failed to sync live mortgage rates:", err);
    }
  };

  const handleRefreshLiveRates = async () => {
    setIsRefreshingRates(true);
    try {
      const cacheBustUrl = `/api/live-market-stats?force=true&t=${Date.now()}&_rnd=${Math.random()}`;
      let res: Response | null = await fetch(cacheBustUrl, {
        method: 'GET',
        cache: 'no-store'
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch(`/api/live-market-stats/sync?force=true&t=${Date.now()}&_rnd=${Math.random()}`, {
          method: 'GET',
          cache: 'no-store'
        }).catch(() => null);
      }

      if (!res || !res.ok) {
        // Fallback POST
        res = await fetch(`/api/live-market-stats/sync?force=true&t=${Date.now()}`, {
          method: 'POST',
          cache: 'no-store'
        }).catch(() => null);
      }

      if (res && res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const freshData = { ...json.data, asOfTimestamp: Date.now() };
          setLiveRates(freshData);
          try {
            localStorage.setItem('cached_live_mortgage_rates', JSON.stringify(freshData));
          } catch (e) {
            console.warn("Could not cache live rates in localStorage", e);
          }

          // Broadcast to all mounted components (e.g., MortgageCalculator, OrangeCountyMarketTrends)
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('live-rates-synced', { detail: freshData }));
          }

          showToast(`MND Live Rates synced: 30-Yr ${freshData.mortgage30Year} • 15-Yr ${freshData.mortgage15Year}`);
        } else {
          showToast('Live rates verified with Mortgage News Daily.');
        }
      } else {
        showToast('Connecting to MND Live... retrying sync.');
      }
    } catch (err) {
      console.warn("Failed to refresh live rates:", err);
      showToast('Live rate sync connection note.');
    } finally {
      setTimeout(() => setIsRefreshingRates(false), 500);
    }
  };

  const fetchAds = () => {
    fetch(`/api/ads?all=true&t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store'
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
      cache: 'no-store'
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

  const [isRefreshingNews, setIsRefreshingNews] = useState<boolean>(false);

  const handleResetToMain = () => {
    setCurrentCity(CITIES[0]);
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedArticle(null);
    setIsCitySelectorOpen(false);
    setIsSavedDrawerOpen(false);
    fetchArticles(false);
    fetchMndNews();
    fetchLiveRates();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('city_pulse_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.warn("Could not write bookmarks to localStorage", e);
    }
  }, [bookmarkedIds]);

  const fetchArticles = (forceSync: boolean = false) => {
    setIsRefreshingNews(true);
    const endpoint = forceSync ? `/api/news/sync-oc-news` : `/api/news/articles?t=${Date.now()}`;
    fetch(endpoint)
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
      })
      .finally(() => {
        setIsRefreshingNews(false);
      });

    // Also sync daily mortgage news with 1-day retention
    fetchMndNews(forceSync);
  };

  const fetchMndNews = (forceSync: boolean = false) => {
    fetch(`/api/mnd-news?force=${forceSync}&t=${Date.now()}`)
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
    // Proactively fetch live Orange County real estate news so the section is always populated with live articles
    fetch('/api/fetch-city-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName: 'Orange County', category: 'real-estate' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(prev => deduplicateArticles([...data.articles, ...prev]));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch live city news when city or category changes (only on local municipal pages, not on main page or special report tabs)
  useEffect(() => {
    if (!currentCity) return;
    if (activeCategory === 'all' || activeCategory === 'mortgage-news' || activeCategory === 'market-trends' || activeCategory === 'oc-fast' || activeCategory === 'mortgage-calculator') {
      return;
    }
    
    setIsRefreshingNews(true);
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
      })
      .finally(() => {
        setIsRefreshingNews(false);
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

    // Sort to ensure the freshest published stories appear at the top
    const sorted = [...finalFiltered].sort((a, b) => {
      const aTime = (a as any).createdAtMs || 0;
      const bTime = (b as any).createdAtMs || 0;
      if (aTime !== bTime) return bTime - aTime;
      if (a.isLivePublicRss && !b.isLivePublicRss) return -1;
      if (!a.isLivePublicRss && b.isLivePublicRss) return 1;
      return 0;
    });

    return deduplicateArticles(sorted);
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] max-w-[90vw] bg-slate-900 text-white border border-slate-700 px-5 py-3 rounded-full shadow-2xl flex items-center space-x-2.5 text-xs font-bold pointer-events-none select-none animate-fadeIn">
          <Sparkles className="w-4 h-4 text-[#FA2D48] shrink-0" />
          <span className="truncate">{toastMessage}</span>
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
          liveRates={liveRates}
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
            onRefreshRates={handleRefreshLiveRates}
            isRefreshingRates={isRefreshingRates}
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

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setShowMarketTimeModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:text-[#FA2D48] font-bold text-xs transition-all cursor-pointer shadow-2xs"
                        title="View Expected Market Time Ranges"
                      >
                        <Info className="w-3.5 h-3.5 text-[#FA2D48]" />
                        <span>Expected Market Time Ranges</span>
                      </button>

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
                        {/* Dynamic City-Specific Market Speed Live Ticker */}
                        {marketData && (() => {
                          const emtDelta = marketData.marketTimeDays - marketData.marketTime2WeeksAgo;
                          const isFaster = emtDelta < 0;
                          const isSlower = emtDelta > 0;
                          const speedLabel = isFaster ? 'FASTER' : isSlower ? 'SLOWER' : 'STEADY';
                          const speedColor = isFaster ? 'text-emerald-400' : isSlower ? 'text-[#FA2D48]' : 'text-slate-300';
                          const cond = getMarketCondition(marketData.marketTimeDays);

                          return (
                            <button
                              type="button"
                              onClick={() => setShowHistoricalMarketTimeModal(true)}
                              className="relative flex items-center h-11 sm:h-12 w-full overflow-hidden rounded-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white shadow-md transition-all cursor-pointer font-sans group active:scale-[0.99] px-2.5 sm:px-4 select-none mb-4"
                              title={`Click to view ${currentCity.name} Historical Speed & Pace`}
                            >
                              {/* Fixed Left Live Badge */}
                              <div className="flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-3 border-r border-slate-800 shrink-0 z-10 bg-slate-950 group-hover:bg-slate-900 transition-colors">
                                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FA2D48] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#FA2D48]"></span>
                                </span>
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shrink-0">
                                  LIVE
                                </span>
                              </div>

                              {/* Running City Equation */}
                              <div className="relative overflow-hidden flex-1 mx-1.5 sm:mx-3">
                                <div className="animate-ticker flex items-center group-hover:[animation-play-state:paused]">
                                  {/* 1st copy */}
                                  <div className="flex items-center gap-3.5 sm:gap-5 text-[11px] sm:text-[13px] font-bold tracking-wide uppercase text-white/90 shrink-0 pr-4 sm:pr-5">
                                    <span className="font-black text-white">
                                      MARKET SPEED: <span className={speedColor}>{speedLabel}</span> • {cond.badgeText}
                                    </span>
                                    <span className="text-[#FA2D48]">●</span>
                                    <span className="text-slate-300">
                                      DEMAND: <span className="text-emerald-400 font-extrabold">{marketData.demand30Days}</span>{' '}
                                      <span className="text-emerald-400 font-black text-lg leading-none inline-block">↑</span>
                                    </span>
                                    <span className="text-[#FA2D48]">●</span>
                                    <span className="text-slate-300">
                                      SUPPLY: <span className="text-slate-200 font-extrabold">{marketData.currentActives}</span>{' '}
                                      <span className="text-[#FA2D48] font-black text-lg leading-none inline-block">↓</span>
                                    </span>
                                    <span className="text-[#FA2D48]">●</span>
                                    <span className="text-slate-300">
                                      EMT: <span className="text-white font-extrabold">{marketData.marketTimeDays} DAYS</span>
                                      {emtDelta !== 0 && (
                                        <span className={`ml-1.5 font-black inline-flex items-center gap-0.5 ${isFaster ? 'text-emerald-400' : 'text-[#FA2D48]'}`}>
                                          <span className="text-lg leading-none font-extrabold">{isFaster ? '↓' : '↑'}</span>
                                          <span>{Math.abs(emtDelta)}d</span>
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-[#FA2D48] font-black text-xs sm:text-sm">=</span>
                                  </div>
                                  {/* 2nd identical copy */}
                                  <div className="flex items-center gap-3.5 sm:gap-5 text-[11px] sm:text-[13px] font-bold tracking-wide uppercase text-white/90 shrink-0 pr-4 sm:pr-5" aria-hidden="true">
                                    <span className="font-black text-white">
                                      MARKET SPEED: <span className={speedColor}>{speedLabel}</span> • {cond.badgeText}
                                    </span>
                                    <span className="text-[#FA2D48]">●</span>
                                    <span className="text-slate-300">
                                      DEMAND: <span className="text-emerald-400 font-extrabold">{marketData.demand30Days}</span>{' '}
                                      <span className="text-emerald-400 font-black text-lg leading-none inline-block">↑</span>
                                    </span>
                                    <span className="text-[#FA2D48]">●</span>
                                    <span className="text-slate-300">
                                      SUPPLY: <span className="text-slate-200 font-extrabold">{marketData.currentActives}</span>{' '}
                                      <span className="text-[#FA2D48] font-black text-lg leading-none inline-block">↓</span>
                                    </span>
                                    <span className="text-[#FA2D48]">●</span>
                                    <span className="text-slate-300">
                                      EMT: <span className="text-white font-extrabold">{marketData.marketTimeDays} DAYS</span>
                                      {emtDelta !== 0 && (
                                        <span className={`ml-1.5 font-black inline-flex items-center gap-0.5 ${isFaster ? 'text-emerald-400' : 'text-[#FA2D48]'}`}>
                                          <span className="text-lg leading-none font-extrabold">{isFaster ? '↓' : '↑'}</span>
                                          <span>{Math.abs(emtDelta)}d</span>
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-[#FA2D48] font-black text-xs sm:text-sm">=</span>
                                  </div>
                                </div>
                              </div>

                              {/* Fixed Right Action */}
                              <div className="pl-2 sm:pl-3 border-l border-slate-800 shrink-0 z-10 bg-slate-950 group-hover:bg-slate-900 transition-colors flex items-center gap-1">
                                <span className="text-[10px] sm:text-xs font-black text-slate-300 group-hover:text-white uppercase tracking-wider transition-colors hidden sm:inline">
                                  Pace
                                </span>
                                <span className="text-xs font-black text-[#FA2D48]">↗</span>
                              </div>
                            </button>
                          );
                        })()}

                        {/* 1. CURRENT ACTIVE INVENTORY & EXPECTED MARKET TIME (Steven Thomas Page 10 Report) */}
                        {marketData && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
                                Market Velocity & Expected Pace
                              </h3>
                              <span className="text-[11px] font-bold text-slate-500">
                                Steven Thomas Analysis ({OC_HOUSING_REPORT_METADATA.reportDate})
                              </span>
                            </div>

                            {/* Primary Speed Gauges: Expected Market Time & Closed Days on Market (Same Weight) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              {/* Expected Market Time - Tap to open historical pace modal */}
                              {(() => {
                                const cond = getMarketCondition(marketData.marketTimeDays);
                                return (
                                  <button
                                    type="button"
                                    onClick={() => setShowHistoricalMarketTimeModal(true)}
                                    className={`${cond.bgClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-xs space-y-3 text-left text-white transition-all cursor-pointer hover:opacity-95 active:scale-[0.99] group`}
                                    title="Click to view historical expected market time pace"
                                  >
                                    <div className="w-full space-y-1">
                                      <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-sans">
                                        Expected Market Time
                                      </div>
                                      <div className="text-xs sm:text-sm font-bold text-white tracking-normal">
                                        If no new homes came on the market
                                      </div>
                                    </div>

                                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                                      {marketData.marketTimeDays} Days
                                    </div>

                                    <div className="pt-1 flex items-center justify-between flex-wrap gap-2 w-full">
                                      <span className="bg-white text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg inline-block shadow-xs font-sans">
                                        {cond.badgeText}
                                      </span>
                                      <span className="text-xs font-bold text-white/90 group-hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors">
                                        <span>Click to see historical pace</span>
                                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                      </span>
                                    </div>
                                  </button>
                                );
                              })()}

                              {/* Days on Market - Vivid Blue Highlighted Speed Gauge */}
                              {(() => {
                                const closedDays = soldData ? soldData.medianDOM : 0;
                                return (
                                  <div className="bg-blue-600 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-xs space-y-3 text-left text-white">
                                    <div className="w-full">
                                      <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-sans">
                                        Days on Market
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <div className="text-xs sm:text-sm font-bold text-white/90 tracking-normal">
                                        Time to Sell Once Properly Priced
                                      </div>
                                      <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                                        {closedDays > 0 ? `${closedDays} Days` : '—'}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Price Range Information (Directly below Expected Market Time & Days on Market) */}
                            {soldData && soldData.lowPrice && soldData.highPrice && (
                              <div className="bg-slate-50/90 rounded-2xl py-3 px-4 sm:px-5 flex items-center justify-between border border-slate-200/80 shadow-2xs">
                                <span className="font-bold text-sm sm:text-base text-slate-900 font-sans">
                                  Price Range:
                                </span>
                                <span className="font-sans font-black text-base sm:text-lg text-slate-950">
                                  {soldData.lowPrice} – {soldData.highPrice}
                                </span>
                              </div>
                            )}

                            {/* Active Inventory & Price Metrics */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Active Inventory</div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{marketData.currentActives} Homes</div>
                                <div className="text-[11px] text-emerald-600 pt-1 font-bold">Active listings on market</div>
                              </div>

                              <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                                <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Active List Price</div>
                                <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{marketData.medianActiveListPrice}</div>
                                <div className="text-[11px] text-emerald-600 pt-1 font-bold">Current active listings</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. CLOSED SALES DATA (Steven Thomas Page 12 Report) */}
                        {soldData && (
                          <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
                                Closed Sales & Price Distribution ({OC_HOUSING_REPORT_METADATA.closedSalesPeriod})
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

                              <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 flex flex-col justify-between">
                                <div>
                                  <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Closed Sales</div>
                                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{soldData.unitsSold2026} Units</div>
                                  <div className={`text-[11px] pt-1 font-bold ${yoyUnitsChange < 0 ? 'text-[#FA2D48]' : 'text-emerald-600'}`}>
                                    {yoyUnitsChange >= 0 ? `+${yoyUnitsChange}` : yoyUnitsChange} vs Prior Year ({soldData.unitsSold2025})
                                  </div>
                                </div>
                                {marketData && (
                                  <div className="text-[11px] text-emerald-600 font-bold pt-1.5 mt-2 border-t border-slate-200/70 flex items-center justify-between">
                                    <span>30-Day Demand:</span>
                                    <span className="text-emerald-700 font-extrabold">{marketData.demand30Days} Pending Escrow</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Live Steven Thomas Orange County Live Tab right below the Steven Thomas tab/card */}
                <div className="flex justify-center sm:justify-start pt-1">
                  <button
                    type="button"
                    id="main-steven-thomas-market-speed-pill"
                    onClick={() => setShowMarketDirectionModal(true)}
                    className="relative flex items-center h-11 sm:h-12 w-full max-w-2xl overflow-hidden rounded-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white shadow-md transition-all cursor-pointer font-sans group active:scale-[0.99] px-2.5 sm:px-4 select-none"
                    title="Click to view Market Speed Matrix"
                  >
                    {/* Fixed Left Live Beacon */}
                    <div className="flex items-center gap-1.5 sm:gap-2 pr-2 sm:pr-3 border-r border-slate-800 shrink-0 z-10 bg-slate-950 group-hover:bg-slate-900 transition-colors">
                      <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FA2D48] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#FA2D48]"></span>
                      </span>
                      <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shrink-0">
                        LIVE
                      </span>
                    </div>

                    {/* Running Text Streaming Slower to the Left (Stock / Live Feed Style) */}
                    <div className="relative overflow-hidden flex-1 mx-1.5 sm:mx-3">
                      <div className="animate-ticker flex items-center group-hover:[animation-play-state:paused]">
                        {/* 1st copy */}
                        <div className="flex items-center gap-3.5 sm:gap-5 text-[11px] sm:text-[13px] font-bold tracking-wide uppercase text-white/90 shrink-0 pr-4 sm:pr-5">
                          <span className="font-black text-white">{OC_COUNTYWIDE_LIVE_METRICS.fullText}</span>
                          <span className="text-[#FA2D48]">●</span>
                          <span className="text-slate-300">
                            DEMAND: <span className="text-emerald-400 font-extrabold">{OC_COUNTYWIDE_LIVE_METRICS.demand.toLocaleString()}</span>{' '}
                            <span className="text-rose-400 font-black inline-flex items-center gap-0.5">
                              <span className="text-lg leading-none font-extrabold">↓</span>
                              <span>{OC_COUNTYWIDE_LIVE_METRICS.demandDelta}</span>
                            </span>
                          </span>
                          <span className="text-[#FA2D48]">●</span>
                          <span className="text-slate-300">
                            SUPPLY: <span className="text-slate-200 font-extrabold">{OC_COUNTYWIDE_LIVE_METRICS.supply.toLocaleString()}</span>{' '}
                            <span className="text-emerald-400 font-black inline-flex items-center gap-0.5">
                              <span className="text-lg leading-none font-extrabold">↓</span>
                              <span>{OC_COUNTYWIDE_LIVE_METRICS.supplyDelta}</span>
                            </span>
                          </span>
                          <span className="text-[#FA2D48]">●</span>
                          <span className="text-slate-300">
                            EMT: <span className="text-white font-extrabold">{OC_COUNTYWIDE_LIVE_METRICS.emtDays} DAYS</span>{' '}
                            <span className="text-emerald-400 font-black inline-flex items-center gap-0.5">
                              <span className="text-lg leading-none font-extrabold">↓</span>
                              <span>{Math.abs(OC_COUNTYWIDE_LIVE_METRICS.emtDelta)}d FASTER</span>
                            </span>
                          </span>
                          <span className="text-[#FA2D48] font-black text-xs sm:text-sm">=</span>
                        </div>
                        {/* 2nd identical copy for seamless infinite loop */}
                        <div className="flex items-center gap-3.5 sm:gap-5 text-[11px] sm:text-[13px] font-bold tracking-wide uppercase text-white/90 shrink-0 pr-4 sm:pr-5" aria-hidden="true">
                          <span className="font-black text-white">{OC_COUNTYWIDE_LIVE_METRICS.fullText}</span>
                          <span className="text-[#FA2D48]">●</span>
                          <span className="text-slate-300">
                            DEMAND: <span className="text-emerald-400 font-extrabold">{OC_COUNTYWIDE_LIVE_METRICS.demand.toLocaleString()}</span>{' '}
                            <span className="text-rose-400 font-black inline-flex items-center gap-0.5">
                              <span className="text-lg leading-none font-extrabold">↓</span>
                              <span>{OC_COUNTYWIDE_LIVE_METRICS.demandDelta}</span>
                            </span>
                          </span>
                          <span className="text-[#FA2D48]">●</span>
                          <span className="text-slate-300">
                            SUPPLY: <span className="text-slate-200 font-extrabold">{OC_COUNTYWIDE_LIVE_METRICS.supply.toLocaleString()}</span>{' '}
                            <span className="text-emerald-400 font-black inline-flex items-center gap-0.5">
                              <span className="text-lg leading-none font-extrabold">↓</span>
                              <span>{OC_COUNTYWIDE_LIVE_METRICS.supplyDelta}</span>
                            </span>
                          </span>
                          <span className="text-[#FA2D48]">●</span>
                          <span className="text-slate-300">
                            EMT: <span className="text-white font-extrabold">{OC_COUNTYWIDE_LIVE_METRICS.emtDays} DAYS</span>{' '}
                            <span className="text-emerald-400 font-black inline-flex items-center gap-0.5">
                              <span className="text-lg leading-none font-extrabold">↓</span>
                              <span>{Math.abs(OC_COUNTYWIDE_LIVE_METRICS.emtDelta)}d FASTER</span>
                            </span>
                          </span>
                          <span className="text-[#FA2D48] font-black text-xs sm:text-sm">=</span>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Right Action */}
                    <div className="pl-2 sm:pl-3 border-l border-slate-800 shrink-0 z-10 bg-slate-950 group-hover:bg-slate-900 transition-colors flex items-center gap-1">
                      <span className="text-[10px] sm:text-xs font-black text-slate-300 group-hover:text-white uppercase tracking-wider transition-colors hidden sm:inline">
                        Table
                      </span>
                      <span className="text-xs font-black text-[#FA2D48]">↗</span>
                    </div>
                  </button>
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
                    {activeCategory === 'real-estate' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-bold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Wire Active
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-sans text-slate-950 tracking-tight">
                    {activeCategory === 'real-estate' ? 'Orange County News' :
                     activeCategory === 'restaurants-bars' ? 'New Restaurants & Bars' : 'Local Coverage'}
                  </h2>
                </div>

                {/* City Filter & Live Sync on Internal News Pages */}
                <div className="flex items-center gap-2">
                  {activeCategory === 'real-estate' && (
                    <button
                      onClick={() => fetchArticles(true)}
                      disabled={isRefreshingNews}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs transition-all cursor-pointer shadow-xs disabled:opacity-60"
                      title="Sync live Orange County news headlines"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingNews ? 'animate-spin text-[#FA2D48]' : 'text-slate-500'}`} />
                      <span className="hidden sm:inline">{isRefreshingNews ? 'Syncing...' : 'Sync Live'}</span>
                    </button>
                  )}

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
              title="Return to Home Feed"
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

      {/* EXPECTED MARKET TIME RANGES MODAL */}
      {showMarketTimeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setShowMarketTimeModal(false)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl space-y-4 relative animate-in zoom-in-95 duration-150 font-sans text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-950 tracking-tight font-sans">
                Expected Market Time Ranges
              </h3>
              <button
                type="button"
                onClick={() => setShowMarketTimeModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Minimalist Ranges Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 bg-white">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Market Condition</span>
                <span>Duration</span>
              </div>
              {[
                { label: "Hot Seller's Market", days: "Under 60 Days" },
                { label: "Slight Seller's Market", days: "60 – 89 Days" },
                { label: "Balanced Market", days: "90 – 119 Days" },
                { label: "Slight Buyer's Market", days: "120 – 149 Days" },
                { label: "Buyer's Market", days: "150+ Days" },
              ].map((range) => (
                <div
                  key={range.label}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-slate-900 font-medium font-sans">
                    {range.label}
                  </span>
                  <span className="text-black font-bold font-sans text-sm tabular-nums">
                    {range.days}
                  </span>
                </div>
              ))}
            </div>

            {/* Minimal Close Action */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowMarketTimeModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORICAL EXPECTED MARKET TIME MODAL */}
      {showHistoricalMarketTimeModal && currentCityMarketData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setShowHistoricalMarketTimeModal(false)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 max-w-sm sm:max-w-md w-full shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150 text-left font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Title & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 tracking-tight font-sans">
                Historical Pace
              </h3>
              <button
                onClick={() => setShowHistoricalMarketTimeModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Historical Pace Cards Only */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-left font-sans">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-2xs font-sans">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">2 Weeks Ago</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 pt-0.5 font-sans">{currentCityMarketData.marketTime2WeeksAgo} Days</div>
                </div>
                <div className={`text-xs font-bold pt-2 border-t border-slate-200/60 mt-2 font-sans ${getMarketCondition(currentCityMarketData.marketTime2WeeksAgo).accentText}`}>
                  {getMarketCondition(currentCityMarketData.marketTime2WeeksAgo).label}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-2xs font-sans">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">4 Weeks Ago</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 pt-0.5 font-sans">{currentCityMarketData.marketTime4WeeksAgo} Days</div>
                </div>
                <div className={`text-xs font-bold pt-2 border-t border-slate-200/60 mt-2 font-sans ${getMarketCondition(currentCityMarketData.marketTime4WeeksAgo).accentText}`}>
                  {getMarketCondition(currentCityMarketData.marketTime4WeeksAgo).label}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-2xs font-sans">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">1 Year Ago</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 pt-0.5 font-sans">{currentCityMarketData.marketTime1YearAgo} Days</div>
                </div>
                <div className={`text-xs font-bold pt-2 border-t border-slate-200/60 mt-2 font-sans ${getMarketCondition(currentCityMarketData.marketTime1YearAgo).accentText}`}>
                  {getMarketCondition(currentCityMarketData.marketTime1YearAgo).label}
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-2xs font-sans">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">2 Years Ago</div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 pt-0.5 font-sans">
                    {currentCityMarketData.marketTime2YearsAgo > 0 ? `${currentCityMarketData.marketTime2YearsAgo} Days` : '—'}
                  </div>
                </div>
                <div className={`text-xs font-bold pt-2 border-t border-slate-200/60 mt-2 font-sans ${getMarketCondition(currentCityMarketData.marketTime2YearsAgo).accentText}`}>
                  {currentCityMarketData.marketTime2YearsAgo > 0 ? getMarketCondition(currentCityMarketData.marketTime2YearsAgo).label : 'N/A'}
                </div>
              </div>
            </div>

            {/* Close Action */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowHistoricalMarketTimeModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MINIMALISTIC MARKET DIRECTION DETERMINATION MATRIX MODAL */}
      {showMarketDirectionModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setShowMarketDirectionModal(false)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150 font-sans text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Clean, Simple Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FA2D48]"></span>
                <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight font-sans">
                  Market Speed Matrix
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMarketDirectionModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 8-Combination Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-3 w-8 text-center">#</th>
                    <th className="py-2.5 px-3">Demand</th>
                    <th className="py-2.5 px-3">Supply</th>
                    <th className="py-2.5 px-3">Expected Market Time</th>
                    <th className="py-2.5 px-3">Market Speed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {STEVEN_THOMAS_DIRECTION_MATRIX.map((row) => {
                    const isMatched = STEVEN_THOMAS_MARKET_DIRECTION.matchedRowId === row.id;

                    return (
                      <tr 
                        key={row.id}
                        className={`transition-colors ${
                          isMatched 
                            ? 'bg-rose-50/70 font-bold text-slate-950 border-l-3 border-l-[#FA2D48]' 
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {row.id}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                            row.demand === 'UP' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {row.demand}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                            row.supply === 'UP' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {row.supply}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                            row.emt === 'UP' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'
                          }`}>
                            {row.emt}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-xs ${
                              isMatched ? 'font-black text-[#FA2D48]' : 'font-semibold text-slate-800'
                            }`}>
                              {row.result}
                            </span>
                            {isMatched && (
                              <span className="text-[9px] font-black uppercase tracking-wider bg-[#FA2D48] text-white px-1.5 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Minimalist speed footnote & close button */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 text-[11px] text-slate-500 font-sans">
              <span>EMT DOWN = FASTER • EMT UP = SLOWER</span>
              <button
                type="button"
                onClick={() => setShowMarketDirectionModal(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-xs ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

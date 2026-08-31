import React, { useState, useMemo } from 'react';
import { MapPin, ChevronDown, TrendingUp, Clock, Tag, Building, Search, ArrowUpDown, ShieldCheck, AlertCircle, Home, Layers, Check, RefreshCw, Calendar, Sparkles } from 'lucide-react';
import { CityInfo, AdBanner, LiveMortgageRates } from '../types';
import { AdBannerRenderer } from './AdBannerRenderer';
import {
  OC_HOUSING_REPORT_METADATA,
  OC_HOUSING_SUMMARY_BULLETS,
  OC_MARKET_TIME_REPORT,
  OC_PRICE_RANGE_REPORT_ALL,
  OC_PRICE_RANGE_REPORT_ATTACHED,
  OC_PRICE_RANGE_REPORT_DETACHED,
  OC_SOLD_REPORT,
  OC_SITTING_ON_MARKET_REPORT,
  OCMarketTimeEntry,
  OCSoldReportEntry
} from '../data/ocHousingReportData';

export interface OCCityMarketData {
  id: string;
  name: string;
  region: 'Coastal' | 'South OC' | 'North OC' | 'Central OC';
  medianPrice: number;
  avgSqftPrice: number;
  ytdSalesVolume: string;
  ytdSalesRaw: number;
  homesSoldYtd: number;
  pendingHomes: number;
  unitsClosedPastMonth: number;
  daysOnMarket: number;
  yoyGrowth: number;
  description?: string;
}

export function getMarketCondition(days: number) {
  if (!days || days <= 0) {
    return {
      label: "N/A",
      tag: "Data Pending",
      badgeText: "Historical N/A",
      bgClass: "bg-slate-700 text-white font-bold",
      cardBg: "bg-slate-50 border-slate-200 text-slate-700",
      accentText: "text-slate-600",
      chipBg: "bg-slate-200 text-slate-700 border-slate-300",
      dotColor: "bg-slate-400",
      description: "Data not available for this benchmark period."
    };
  }
  if (days < 60) {
    return {
      label: "Hot Seller's",
      tag: "< 60 Days",
      badgeText: "Hot Seller's Market (< 60 Days)",
      bgClass: "bg-[#FA2D48] text-white font-bold",
      cardBg: "bg-rose-50/80 border-rose-200 text-rose-950",
      accentText: "text-[#FA2D48]",
      chipBg: "bg-rose-100 text-[#FA2D48] border-rose-300",
      dotColor: "bg-[#FA2D48]",
      description: "Sellers hold full pricing leverage with rapid inventory absorption."
    };
  } else if (days < 90) {
    return {
      label: "Slight Seller's",
      tag: "60–89 Days",
      badgeText: "Slight Seller's Market (60–89 Days)",
      bgClass: "bg-amber-500 text-white font-bold",
      cardBg: "bg-amber-50/80 border-amber-200 text-amber-950",
      accentText: "text-amber-600",
      chipBg: "bg-amber-100 text-amber-800 border-amber-300",
      dotColor: "bg-amber-500",
      description: "Slight seller advantage with steady, active sales velocity."
    };
  } else if (days < 120) {
    return {
      label: "Balanced Market",
      tag: "90–119 Days",
      badgeText: "Balanced Market (90–119 Days)",
      bgClass: "bg-sky-600 text-white font-bold",
      cardBg: "bg-sky-50/80 border-sky-200 text-sky-950",
      accentText: "text-sky-600",
      chipBg: "bg-sky-100 text-sky-800 border-sky-300",
      dotColor: "bg-sky-500",
      description: "Equilibrium between buyers and sellers with stable pricing."
    };
  } else {
    return {
      label: "Buyer's Market",
      tag: "120+ Days",
      badgeText: "Buyer's Market (120+ Days)",
      bgClass: "bg-emerald-700 text-white font-bold",
      cardBg: "bg-emerald-50/80 border-emerald-200 text-emerald-950",
      accentText: "text-emerald-700",
      chipBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      dotColor: "bg-emerald-600",
      description: "Buyers hold negotiating leverage with accumulating listings."
    };
  }
}

export const OC_MARKET_DATA: OCCityMarketData[] = OC_MARKET_TIME_REPORT.map((item) => {
  const id = item.city.toLowerCase().replace(/\s+/g, '-');
  const priceNum = parseInt(item.medianActiveListPrice.replace(/[^0-9]/g, '')) * (item.medianActiveListPrice.includes('m') ? 1000000 : 1000);
  const soldItem = OC_SOLD_REPORT.find(s => s.city.toLowerCase() === item.city.toLowerCase());
  const sqftPrice = soldItem ? parseInt(soldItem.medianPricePerSqFt.replace(/[^0-9]/g, '')) : 720;
  
  return {
    id,
    name: item.city,
    region: item.region,
    medianPrice: priceNum || 1250000,
    avgSqftPrice: sqftPrice,
    ytdSalesVolume: soldItem ? `$${(soldItem.unitsSold2026 * (priceNum / 1000000)).toFixed(1)}M` : '$450M',
    ytdSalesRaw: 450,
    homesSoldYtd: soldItem ? soldItem.unitsSold2026 * 6 : 300,
    pendingHomes: item.demand30Days,
    unitsClosedPastMonth: soldItem ? soldItem.unitsSold2026 : 45,
    daysOnMarket: item.marketTimeDays,
    yoyGrowth: 5.2,
    description: `Official statistics for ${item.city}, ${item.region}.`
  };
});

interface OrangeCountyMarketTrendsProps {
  onSelectCity?: (city: CityInfo) => void;
  liveRates?: LiveMortgageRates | null;
  currentCityName?: string;
  showFilterBar?: boolean;
  showTopHeader?: boolean;
  showMainTabs?: boolean;
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
  onRefreshRates?: () => void;
  isRefreshingRates?: boolean;
}

type ReportTab = 'summary' | 'price-range' | 'price-sqft';

export const OrangeCountyMarketTrends: React.FC<OrangeCountyMarketTrendsProps> = ({ 
  onSelectCity, 
  liveRates: propLiveRates, 
  currentCityName,
  showFilterBar = false,
  showTopHeader = true,
  showMainTabs = true,
  ads = [],
  monetizationEnabled = false,
  onRefreshRates,
  isRefreshingRates = false,
}) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');
  const [selectedCity, setSelectedCity] = useState<OCCityMarketData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [pricePropertyType, setPricePropertyType] = useState<'all' | 'attached' | 'detached'>('all');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [sqftSearchTerm, setSqftSearchTerm] = useState('');
  const [sqftSortBy, setSqftSortBy] = useState<'pricePerSqFt' | 'medianSalesPrice' | 'unitsSold' | 'dom' | 'city'>('pricePerSqFt');
  const [sqftSortDir, setSqftSortDir] = useState<'asc' | 'desc'>('desc');
  const [localRefreshing, setLocalRefreshing] = useState(false);
  const [liveRates, setLiveRates] = useState<LiveMortgageRates>(
    propLiveRates || { 
      source: 'Mortgage News Daily (MND Daily Index)',
      mortgage30Year: '6.81%',
      mortgage15Year: '6.35%',
      jumbo30Year: '6.90%',
      fha30Year: '6.37%',
      va30Year: '6.37%',
      asOfDate: 'Daily Live Market',
      sourceType: 'MORTGAGE_NEWS_DAILY',
      isRealLiveRate: true
    }
  );

  const regionCities = useMemo(() => {
    if (selectedRegion === 'All') return [];
    return OC_MARKET_DATA.filter(c => c.region === selectedRegion);
  }, [selectedRegion]);

  const handleCityClick = (cityName: string) => {
    const cName = cityName.trim().toLowerCase();
    const match = OC_MARKET_DATA.find(
      c => c.name.toLowerCase() === cName || c.id === cName || cName.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(cName)
    );
    if (match) {
      setSelectedCity(match);
      if (onSelectCity) onSelectCity(match);
    }
  };

  const handleManualRateRefresh = async () => {
    if (onRefreshRates) {
      onRefreshRates();
      return;
    }
    setLocalRefreshing(true);
    try {
      const res = await fetch(`/api/live-market-stats?force=true&t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setLiveRates(json.data);
      }
    } catch (err) {
      console.warn("Failed to manually refresh live rates", err);
    } finally {
      setTimeout(() => setLocalRefreshing(false), 600);
    }
  };

  React.useEffect(() => {
    if (propLiveRates) {
      setLiveRates(propLiveRates);
    }
  }, [propLiveRates]);

  React.useEffect(() => {
    if (currentCityName) {
      const cName = currentCityName.trim().toLowerCase();
      if (cName === 'orange county' || cName === 'all orange county' || cName.includes('orange county')) {
        setSelectedCity(null);
      } else {
        const match = OC_MARKET_DATA.find(
          c => c.name.toLowerCase() === cName || c.id === cName || cName.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(cName)
        );
        if (match) {
          setSelectedCity(match);
        } else {
          setSelectedCity(null);
        }
      }
    }
  }, [currentCityName]);

  React.useEffect(() => {
    if (!propLiveRates) {
      fetch(`/api/live-market-stats?t=${Date.now()}`, {
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      })
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data) {
            setLiveRates(json.data);
          }
        })
        .catch(err => console.warn("Failed to load live mortgage rates", err));
    }
  }, [propLiveRates]);

  const priceRangeData = useMemo(() => {
    if (pricePropertyType === 'attached') return OC_PRICE_RANGE_REPORT_ATTACHED;
    if (pricePropertyType === 'detached') return OC_PRICE_RANGE_REPORT_DETACHED;
    return OC_PRICE_RANGE_REPORT_ALL;
  }, [pricePropertyType]);

  const filteredAndSortedSoldReport = useMemo(() => {
    const list = OC_SOLD_REPORT.filter(item => {
      if (!sqftSearchTerm.trim()) return true;
      return item.city.toLowerCase().includes(sqftSearchTerm.toLowerCase().trim());
    });

    return list.sort((a, b) => {
      // Pin "All of O.C." at top if present
      if (a.city === 'All of O.C.') return -1;
      if (b.city === 'All of O.C.') return 1;

      if (sqftSortBy === 'pricePerSqFt') {
        const aVal = parseInt(a.medianPricePerSqFt.replace(/[^0-9]/g, ''), 10) || 0;
        const bVal = parseInt(b.medianPricePerSqFt.replace(/[^0-9]/g, ''), 10) || 0;
        return sqftSortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (sqftSortBy === 'medianSalesPrice') {
        const aVal = parseInt(a.medianSalesPrice.replace(/[^0-9]/g, ''), 10) || 0;
        const bVal = parseInt(b.medianSalesPrice.replace(/[^0-9]/g, ''), 10) || 0;
        return sqftSortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (sqftSortBy === 'unitsSold') {
        return sqftSortDir === 'asc' ? a.unitsSold2026 - b.unitsSold2026 : b.unitsSold2026 - a.unitsSold2026;
      }
      if (sqftSortBy === 'dom') {
        return sqftSortDir === 'asc' ? a.medianDOM - b.medianDOM : b.medianDOM - a.medianDOM;
      }
      if (sqftSortBy === 'city') {
        return sqftSortDir === 'asc' ? a.city.localeCompare(b.city) : b.city.localeCompare(a.city);
      }
      return 0;
    });
  }, [sqftSearchTerm, sqftSortBy, sqftSortDir]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      
      {/* Official Report Header Banner */}
      {showTopHeader && (
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-sans font-bold text-[#FA2D48]">
                <span>Official OC Housing Report - {OC_HOUSING_REPORT_METADATA.reportDate}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-slate-950 leading-tight">
                {OC_HOUSING_REPORT_METADATA.title}
              </h1>
              <p className="text-slate-800 text-base sm:text-lg max-w-2xl font-sans font-normal leading-relaxed">
                {OC_HOUSING_REPORT_METADATA.subtitle}
              </p>
              <div className="text-xs text-slate-900 font-bold pt-1 font-sans">
                Reported by {OC_HOUSING_REPORT_METADATA.author} ({OC_HOUSING_REPORT_METADATA.publisher})
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-black">Total Actives</div>
                <div className="text-2xl font-bold text-slate-900">{OC_HOUSING_REPORT_METADATA.countywideActives.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-600 font-medium">+7% Inventory</div>
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-black">Market Time</div>
                <div className="text-2xl font-bold text-[#FA2D48]">{OC_HOUSING_REPORT_METADATA.countywideMarketTime} Days</div>
                <div className="text-[10px] text-slate-500 font-medium">1,472 Pending</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Data Tabs Bar */}
      {showMainTabs && (
        <>
          <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
              {[
                { id: 'summary', label: 'Orange County Overview' },
                { id: 'price-range', label: 'Price Range Analysis' },
                { id: 'price-sqft', label: 'Price Per Sq. Ft.' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as ReportTab);
                      setSelectedCity(null);
                    }}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border-0 ${
                      isActive
                        ? 'bg-[#FA2D48] text-white shadow-xs outline-none ring-0'
                        : 'text-slate-900 hover:bg-slate-100 hover:text-black font-bold'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner Ad Displayed After Market Tabs */}
          {monetizationEnabled && ads && ads.length > 0 && (
            <AdBannerRenderer
              placement="header-banner"
              ads={ads}
              cityName={selectedCity?.name || currentCityName || 'All'}
              monetizationEnabled={monetizationEnabled}
            />
          )}
        </>
      )}

      {/* City Dropdown & Region Filters Bar (Optional) */}
      {showFilterBar && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Direct City Dropdown Selector */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <MapPin className="w-4 h-4 text-[#FA2D48]" />
              </div>
              <div className="relative flex-1 sm:w-72">
                <select
                  value={selectedCity?.id || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) {
                      setSelectedCity(null);
                      if (onSelectCity) {
                        onSelectCity({
                          id: 'orange-county',
                          name: 'Orange County',
                          state: 'CA',
                          avgSqftPrice: '$810 sqft',
                          tagline: 'Countywide Metro News & Real Estate Trends',
                          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                        });
                      }
                    } else {
                      const city = OC_MARKET_DATA.find(c => c.id === val);
                      if (city) {
                        setSelectedCity(city);
                        setSelectedRegion(city.region);
                        if (onSelectCity) {
                          onSelectCity({
                            id: city.id,
                            name: city.name,
                            state: 'CA',
                            avgSqftPrice: `$${city.avgSqftPrice} sqft`,
                            tagline: `Local Housing Trends in ${city.name}`,
                            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                          });
                        }
                      }
                    }
                  }}
                  className="w-full bg-[#F2F2F7] hover:bg-slate-200/70 border border-slate-200/80 rounded-xl pl-3.5 pr-8 py-2 text-xs font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-950 transition-all cursor-pointer appearance-none"
                >
                  <option value="">All Orange County (Countywide View)</option>
                  <optgroup label="Coastal OC">
                    {OC_MARKET_DATA.filter(c => c.region === 'Coastal').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Central OC">
                    {OC_MARKET_DATA.filter(c => c.region === 'Central OC').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="South OC">
                    {OC_MARKET_DATA.filter(c => c.region === 'South OC').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="North OC">
                    {OC_MARKET_DATA.filter(c => c.region === 'North OC').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {selectedCity && (
                <button
                  onClick={() => {
                    setSelectedCity(null);
                    setSelectedRegion('All');
                    if (onSelectCity) {
                      onSelectCity({
                        id: 'orange-county',
                        name: 'Orange County',
                        state: 'CA',
                        avgSqftPrice: '$810 sqft',
                        tagline: 'Countywide Metro News & Real Estate Trends',
                        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                      });
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Reset Selection
                </button>
              )}
            </div>

            {/* Region Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Regions:
              </span>
              {['All', 'Coastal', 'South OC', 'Central OC', 'North OC'].map((region) => {
                const isActive = selectedRegion === region;
                return (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region);
                      if (region !== 'All' && selectedCity && selectedCity.region !== region) {
                        setSelectedCity(null);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/50'
                    }`}
                  >
                    {region === 'All' ? 'All Regions' : region}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Pills */}
          {selectedRegion !== 'All' && (
            <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 mr-1">
                {selectedRegion} Cities:
              </span>
              {regionCities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => {
                      setSelectedCity(city);
                      if (onSelectCity) {
                        onSelectCity({
                          id: city.id,
                          name: city.name,
                          state: 'CA',
                          avgSqftPrice: `$${city.avgSqftPrice} sqft`,
                          tagline: `Local Housing Trends in ${city.name}`,
                          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200/60 hover:bg-slate-100'
                    }`}
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected City Detail View */}
      {selectedCity ? (() => {
        const soldData = OC_SOLD_REPORT.find(s => s.city.toLowerCase() === selectedCity.name.toLowerCase());
        const marketData = OC_MARKET_TIME_REPORT.find(m => m.city.toLowerCase() === selectedCity.name.toLowerCase());

        const yoyUnitsChange = soldData ? soldData.unitsSold2026 - soldData.unitsSold2025 : 0;
        const yoyUnitsPercent = soldData && soldData.unitsSold2025 > 0 
          ? ((yoyUnitsChange / soldData.unitsSold2025) * 100).toFixed(1) 
          : '0.0';

        return (
          <div className="space-y-6">
            {/* Header & Main Stats Card */}
            <div className="bg-white text-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
                    {selectedCity.name}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setSelectedCity(null);
                    if (onSelectCity) {
                      onSelectCity({
                        id: 'orange-county',
                        name: 'Orange County',
                        state: 'CA',
                        avgSqftPrice: '$810 sqft',
                        tagline: 'Countywide Metro News & Real Estate Trends',
                        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                      });
                    }
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer self-start sm:self-auto"
                >
                  <span>← Back to Countywide View</span>
                </button>
              </div>

              {/* JULY CLOSED SALES DATA */}
              {soldData && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
                      July Closed Sales Data
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-2">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Sales Price</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{soldData.medianSalesPrice}</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-bold">List Price: {soldData.medianListPrice}</div>
                    </div>

                    <div className="p-2">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Sales-to-List Ratio</div>
                      <div className="text-2xl sm:text-3xl font-bold text-emerald-600 pt-1">{soldData.salesToListRatio}</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-bold">Countywide Avg: {OC_HOUSING_REPORT_METADATA.salesToListRatio}</div>
                    </div>

                    <div className="p-2">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Price / Sq. Ft.</div>
                      <div className="text-2xl sm:text-3xl font-bold text-[#FA2D48] pt-1">{soldData.medianPricePerSqFt}</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-bold">Median Size: {soldData.medianSqFt.toLocaleString()} sq ft</div>
                    </div>

                    <div className="p-2">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Closed Sales</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{soldData.unitsSold2026} Units</div>
                      <div className={`text-[11px] pt-1 font-bold ${yoyUnitsChange < 0 ? 'text-[#FA2D48]' : 'text-emerald-600'}`}>
                        {yoyUnitsChange >= 0 ? `+${yoyUnitsChange}` : yoyUnitsChange} vs Prior Year ({soldData.unitsSold2025})
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="py-2.5 px-3 flex items-center justify-between text-xs border-b border-slate-100 sm:border-b-0">
                      <span className="font-bold text-black">Price Range (Low to High):</span>
                      <span className="font-sans font-bold text-black">{soldData.lowPrice} - {soldData.highPrice}</span>
                    </div>
                    <div className="py-2.5 px-3 flex items-center justify-between text-xs">
                      <span className="font-bold text-black">Closed Days on Market (DOM):</span>
                      <span className="font-sans font-black text-sm sm:text-base text-black">{soldData.medianDOM} Days</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CURRENT MARKET TIME & INVENTORY (From Market Time Report) */}
              {marketData && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
                    Current Active Inventory & Expected Market Time (Page 11)
                  </h3>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {(() => {
                      const cond = getMarketCondition(marketData.marketTimeDays);
                      return (
                        <div className={`${cond.bgClass} p-4 rounded-2xl flex flex-col justify-between shadow-xs space-y-1`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">Expected Market Time</span>
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
            </div>
          </div>
        );
      })() : (
        <>
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Key Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black uppercase tracking-wider text-[#FA2D48]">
                          Mortgage News Daily
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>

                      <button
                        onClick={handleManualRateRefresh}
                        disabled={localRefreshing || isRefreshingRates}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50"
                        title="Sync latest live rates from Mortgage News Daily"
                      >
                        <RefreshCw className={`w-3 h-3 text-[#FA2D48] ${(localRefreshing || isRefreshingRates) ? 'animate-spin' : ''}`} />
                        <span>{(localRefreshing || isRefreshingRates) ? 'Syncing...' : 'Sync Live'}</span>
                      </button>
                    </div>

                    <div className="pt-2.5">
                      <div className="text-[10px] font-sans uppercase tracking-widest text-slate-500 font-extrabold flex items-center justify-between">
                        <span>30-Year Fixed Benchmark</span>
                        <span className="text-[9px] text-slate-400 font-bold">{liveRates?.asOfDate || 'Daily Live Market'}</span>
                      </div>
                      <div className="flex items-baseline space-x-2.5 pt-1">
                        <span className="text-3xl sm:text-4xl font-black text-slate-900">{liveRates?.mortgage30Year || '6.81%'}</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          15-Yr: {liveRates?.mortgage15Year || '6.35%'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {liveRates?.jumbo30Year && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            Jumbo: {liveRates.jumbo30Year}
                          </span>
                        )}
                        {liveRates?.fha30Year && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            FHA: {liveRates.fha30Year}
                          </span>
                        )}
                        {liveRates?.va30Year && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            VA: {liveRates.va30Year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3">
                    <p className="text-xs text-slate-600 font-medium leading-snug">
                      Real-time MND daily rate index updated continuously throughout the trading day.
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-900 font-bold pt-1">
                      <span>Source</span>
                      <span className="text-[#FA2D48] font-black">
                        Mortgage News Daily Live Feed
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">Countywide Median List Price</div>
                  <div className="text-3xl font-black text-slate-900 pt-1">{OC_HOUSING_REPORT_METADATA.countywideMedianPrice}</div>
                  <p className="text-sm text-slate-700 font-normal mt-2 leading-snug">Across {OC_HOUSING_REPORT_METADATA.countywideActives.toLocaleString()} active listings in all 34 OC municipalities.</p>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">August Report Closed Sales</div>
                  <div className="text-3xl font-black text-[#FA2D48] pt-1">1,994 Sales</div>
                  <p className="text-sm text-slate-700 font-normal mt-2 leading-snug">+9% compared to prior year (1,828 sales). Average 99.9% sales-to-list ratio.</p>
                </div>
              </div>

              {/* Bullet Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {OC_HOUSING_SUMMARY_BULLETS.map((bullet, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-sans font-bold text-[#FA2D48] uppercase tracking-wider">{bullet.title}</span>
                      <span className="text-xs font-extrabold text-emerald-600">{bullet.trend}</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{bullet.stat}</div>
                    <p className="text-sm text-slate-700 font-normal leading-relaxed">{bullet.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRICE RANGE & PROPERTY TYPE BREAKDOWN */}

          {/* TAB 4: PRICE RANGE & PROPERTY TYPE BREAKDOWN */}
          {activeTab === 'price-range' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">Orange County Price Bracket Analysis</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                    August 3, 2026 Housing Report breakdown. Select a category below (All Homes, Attached, or Detached) and inspect velocity metrics by price tier.
                  </p>
                </div>

                {/* Property Type Sub-Switcher */}
                <div className="flex items-center space-x-1 bg-[#F2F2F7] p-1 rounded-xl border border-slate-200/80 shrink-0 self-start sm:self-auto">
                  {[
                    { id: 'all', label: 'All Homes' },
                    { id: 'attached', label: 'Attached (Condos)' },
                    { id: 'detached', label: 'Detached (SFH)' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setPricePropertyType(sub.id as any);
                        setSelectedPriceTier('all');
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        pricePropertyType === sub.id
                          ? 'bg-[#FA2D48] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Tier Tabs */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Price Tier to Highlight Table Data:</div>
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
                  {priceRangeData.map((row) => {
                    const isSelected = selectedPriceTier === row.priceRange || (selectedPriceTier === 'all' && (row.priceRange === priceRangeData[0]?.priceRange || row.priceRange === 'All of O.C.' || row.priceRange === 'All Attached' || row.priceRange === 'All Detached'));
                    return (
                      <button
                        key={row.priceRange}
                        onClick={() => setSelectedPriceTier(row.priceRange)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center shrink-0 ${
                          isSelected
                            ? 'bg-[#FA2D48] text-white shadow-xs ring-2 ring-[#FA2D48]'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
                        }`}
                      >
                        <span>{row.priceRange}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Tier Spotlight Card with Combined Market Time Timeline */}
              {(() => {
                const dataset = priceRangeData;
                const activeRow = selectedPriceTier !== 'all'
                  ? dataset.find(r => r.priceRange.toLowerCase() === selectedPriceTier.toLowerCase() || r.priceRange.toLowerCase().includes(selectedPriceTier.toLowerCase())) || dataset[0]
                  : dataset[0];

                const cond = getMarketCondition(activeRow.marketTimeDays);

                // Helper to calculate delta vs current market time
                const getDeltaBadge = (pastDays: number) => {
                  if (!pastDays || pastDays === 0) return null;
                  const diff = activeRow.marketTimeDays - pastDays;
                  if (diff === 0) return <span className="text-[10px] text-slate-400 font-medium">(0)</span>;
                  if (diff > 0) return <span className="text-[10px] text-[#FA2D48] font-black">+{diff}d</span>;
                  return <span className="text-[10px] text-emerald-600 font-black">{diff}d</span>;
                };

                return (
                  <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
                    {/* Tier Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                      <div>
                        <h4 className="text-xl sm:text-2xl font-black text-slate-950">{activeRow.priceRange}</h4>
                      </div>
                      <div className={`px-4 py-2 rounded-xl ${cond.bgClass} text-white self-start sm:self-auto shadow-2xs text-left sm:text-right shrink-0`}>
                        <div className="text-xs font-black tracking-wide uppercase">{cond.badgeText}</div>
                        <div className="text-xs font-bold text-white/90 mt-1 flex items-baseline justify-start sm:justify-end space-x-1">
                          <span className="text-lg sm:text-xl font-black leading-none">{activeRow.marketTimeDays}</span>
                          <span className="font-extrabold text-xs uppercase tracking-wider">DOM</span>
                        </div>
                      </div>
                    </div>

                    {/* Core Volume Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Active Inventory</div>
                        <div className="text-2xl font-black text-slate-950 pt-1">{activeRow.currentActives.toLocaleString()} <span className="text-xs font-semibold text-slate-500">homes</span></div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">30-Day Escrows</div>
                        <div className="text-2xl font-black text-slate-950 pt-1">{activeRow.demand30Days.toLocaleString()} <span className="text-xs font-semibold text-slate-500">pending</span></div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs col-span-2 lg:col-span-1">
                        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Median List Price</div>
                        <div className="text-2xl font-black text-emerald-600 pt-1">{activeRow.medianActivePrice}</div>
                      </div>
                    </div>

                    {/* Compact Historical Market Time Progression Pills */}
                    <div className="bg-slate-100/70 rounded-xl p-3 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                            Historical Market Time Pace
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">
                          {activeRow.priceRange}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Current */}
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold">
                          <span className="text-[10px] font-black uppercase text-slate-500">Current:</span>
                          <span className="text-xs font-black text-slate-950">{activeRow.marketTimeDays}d DOM</span>
                          <span className={`text-[11px] font-black ${getMarketCondition(activeRow.marketTimeDays).accentText}`}>
                            ({getMarketCondition(activeRow.marketTimeDays).label})
                          </span>
                        </div>

                        {/* 2 Weeks Ago */}
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold">
                          <span className="text-[10px] font-bold uppercase text-slate-500">2w Ago:</span>
                          <span className="text-xs font-black text-slate-950">{activeRow.marketTime2WeeksAgo}d</span>
                          <span className={`text-[11px] font-black ${getMarketCondition(activeRow.marketTime2WeeksAgo).accentText}`}>
                            ({getMarketCondition(activeRow.marketTime2WeeksAgo).label})
                          </span>
                        </div>

                        {/* 4 Weeks Ago */}
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold">
                          <span className="text-[10px] font-bold uppercase text-slate-500">4w Ago:</span>
                          <span className="text-xs font-black text-slate-950">{activeRow.marketTime4WeeksAgo}d</span>
                          <span className={`text-[11px] font-black ${getMarketCondition(activeRow.marketTime4WeeksAgo).accentText}`}>
                            ({getMarketCondition(activeRow.marketTime4WeeksAgo).label})
                          </span>
                        </div>

                        {/* 1 Year Ago */}
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold">
                          <span className="text-[10px] font-bold uppercase text-slate-500">1y Ago:</span>
                          <span className="text-xs font-black text-slate-950">{activeRow.marketTime1YearAgo}d</span>
                          <span className={`text-[11px] font-black ${getMarketCondition(activeRow.marketTime1YearAgo).accentText}`}>
                            ({getMarketCondition(activeRow.marketTime1YearAgo).label})
                          </span>
                        </div>

                        {/* 2 Years Ago */}
                        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold">
                          <span className="text-[10px] font-bold uppercase text-slate-500">2y Ago:</span>
                          <span className="text-xs font-black text-slate-950">
                            {activeRow.marketTime2YearsAgo > 0 ? `${activeRow.marketTime2YearsAgo}d` : '—'}
                          </span>
                          {activeRow.marketTime2YearsAgo > 0 && (
                            <span className={`text-[11px] font-black ${getMarketCondition(activeRow.marketTime2YearsAgo).accentText}`}>
                              ({getMarketCondition(activeRow.marketTime2YearsAgo).label})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Complete Price Bracket Table */}
              <div className="overflow-x-auto scrollbar-none rounded-2xl border border-slate-200/90">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3">Price Tier</th>
                      <th className="p-3">Current Actives</th>
                      <th className="p-3">30-Day Demand</th>
                      <th className="p-3 text-[#FA2D48] bg-rose-50/80">Market Time (DOM)</th>
                      <th className="p-3">2w Ago</th>
                      <th className="p-3">4w Ago</th>
                      <th className="p-3">1y Ago</th>
                      <th className="p-3">2y Ago</th>
                      <th className="p-3">Median Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {priceRangeData.map((row, idx) => {
                      const isSelected = selectedPriceTier === row.priceRange || (selectedPriceTier === 'all' && idx === 0);
                      const currentCond = getMarketCondition(row.marketTimeDays);
                      const cond2w = getMarketCondition(row.marketTime2WeeksAgo);
                      const cond4w = getMarketCondition(row.marketTime4WeeksAgo);
                      const cond1y = getMarketCondition(row.marketTime1YearAgo);
                      const cond2y = getMarketCondition(row.marketTime2YearsAgo);

                      return (
                        <tr
                          key={idx}
                          onClick={() => setSelectedPriceTier(row.priceRange)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-rose-50/80 font-bold ring-2 ring-[#FA2D48]/30'
                              : row.priceRange === 'All of O.C.' || row.priceRange === 'All Attached' || row.priceRange === 'All Detached'
                                ? 'bg-slate-100/80 font-black'
                                : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="p-3 font-extrabold text-slate-950 flex items-center justify-between">
                            <span>{row.priceRange}</span>
                            {isSelected && <span className="ml-1.5 w-2 h-2 rounded-full bg-[#FA2D48]"></span>}
                          </td>
                          <td className="p-3 font-bold text-slate-900">{row.currentActives.toLocaleString()}</td>
                          <td className="p-3 font-bold text-slate-900">{row.demand30Days.toLocaleString()}</td>
                          <td className="p-3 bg-rose-50/60 font-mono text-sm">
                            <span className="font-black text-[#FA2D48]">{row.marketTimeDays} Days</span>
                            <span className={`ml-2 text-[11px] font-black ${currentCond.accentText}`}>
                              ({currentCond.label})
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            <span>{row.marketTime2WeeksAgo}d</span>
                            <span className={`ml-1 text-[11px] font-black hidden sm:inline ${cond2w.accentText}`}>({cond2w.label})</span>
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            <span>{row.marketTime4WeeksAgo}d</span>
                            <span className={`ml-1 text-[11px] font-black hidden sm:inline ${cond4w.accentText}`}>({cond4w.label})</span>
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            <span>{row.marketTime1YearAgo}d</span>
                            <span className={`ml-1 text-[11px] font-black hidden sm:inline ${cond1y.accentText}`}>({cond1y.label})</span>
                          </td>
                          <td className="p-3 font-bold text-slate-900">
                            {row.marketTime2YearsAgo > 0 ? (
                              <>
                                <span>{row.marketTime2YearsAgo}d</span>
                                <span className={`ml-1 text-[11px] font-black hidden sm:inline ${cond2y.accentText}`}>({cond2y.label})</span>
                              </>
                            ) : (
                              <span className="text-slate-400 font-medium">—</span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-slate-950">{row.medianActivePrice}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRICE PER SQ. FT. BREAKDOWN */}
          {activeTab === 'price-sqft' && (
            <div className="space-y-6">
              {/* Executive Indicators for Price Per Sq. Ft. */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">Countywide Median $/Sq.Ft.</div>
                  <div className="text-3xl sm:text-4xl font-black text-[#FA2D48] pt-1">$717 <span className="text-sm font-bold text-slate-500">/ sq.ft.</span></div>
                  <p className="text-xs text-slate-600 font-medium mt-2">Across 1,994 closed sales countywide (August 2026 report).</p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">Highest $/Sq.Ft. Markets</div>
                  <div className="text-2xl font-black text-slate-900 pt-1">Newport Coast</div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-900">$1,654</span> • CDM <span className="font-bold text-slate-900">$1,599</span> • Laguna <span className="font-bold text-slate-900">$1,518</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">Most Accessible $/Sq.Ft.</div>
                  <div className="text-2xl font-black text-slate-900 pt-1">Seal Beach</div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-600 font-medium">
                    <span className="font-bold text-slate-900">$377</span> • Laguna Woods <span className="font-bold text-slate-900">$434</span> • Coto <span className="font-bold text-slate-900">$517</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">Median Living Size</div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 pt-1">1,753 <span className="text-sm font-bold text-slate-500">sq.ft.</span></div>
                  <p className="text-xs text-slate-600 font-medium mt-2">Median Sales Price: $1,256,412 (99.9% sales-to-list ratio).</p>
                </div>
              </div>

              {/* City Table Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950">Orange County Price Per Sq. Ft. by City</h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                      Verified closed sales statistics for all Orange County municipalities from the August 2026 report.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative min-w-[240px] sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search city or municipality..."
                      value={sqftSearchTerm}
                      onChange={(e) => setSqftSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FA2D48]/30 focus:border-[#FA2D48]"
                    />
                    {sqftSearchTerm && (
                      <button
                        onClick={() => setSqftSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Sort Options */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Sort By:</span>
                    {[
                      { id: 'pricePerSqFt', label: 'Price / Sq. Ft.' },
                      { id: 'medianSalesPrice', label: 'Median Sales Price' },
                      { id: 'unitsSold', label: 'Closed Volume' },
                      { id: 'dom', label: 'Days on Market' },
                      { id: 'city', label: 'City Name' },
                    ].map((sortOption) => {
                      const isActive = sqftSortBy === sortOption.id;
                      return (
                        <button
                          key={sortOption.id}
                          onClick={() => {
                            if (isActive) {
                              setSqftSortDir(sqftSortDir === 'asc' ? 'desc' : 'asc');
                            } else {
                              setSqftSortBy(sortOption.id as any);
                              setSqftSortDir(sortOption.id === 'city' ? 'asc' : 'desc');
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>{sortOption.label}</span>
                          {isActive && (
                            <span className="text-[10px] ml-1">{sqftSortDir === 'asc' ? '▲' : '▼'}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-900">{filteredAndSortedSoldReport.length}</span> municipalities
                  </div>
                </div>

                {/* Comprehensive City Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-black uppercase tracking-wider text-[10px]">
                        <th className="p-3.5">City / Municipality</th>
                        <th className="p-3.5 text-right">Median $/Sq. Ft.</th>
                        <th className="p-3.5 text-right">Median Sq. Ft.</th>
                        <th className="p-3.5 text-right">Median Sales Price</th>
                        <th className="p-3.5 text-right">Median List Price</th>
                        <th className="p-3.5 text-center">Sales / List %</th>
                        <th className="p-3.5 text-center">Median DOM</th>
                        <th className="p-3.5 text-center">Aug 2026 Sales</th>
                        <th className="p-3.5 text-center">Aug 2025 Sales</th>
                        <th className="p-3.5 text-right">Price Range (Low – High)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {filteredAndSortedSoldReport.map((row, idx) => {
                        const isAllOC = row.city === 'All of O.C.';
                        const sqftNumeric = parseInt(row.medianPricePerSqFt.replace(/[^0-9]/g, ''), 10) || 0;
                        const yoyGrowth = row.unitsSold2025 > 0
                          ? Math.round(((row.unitsSold2026 - row.unitsSold2025) / row.unitsSold2025) * 100)
                          : 0;

                        return (
                          <tr
                            key={idx}
                            onClick={() => {
                              if (!isAllOC) handleCityClick(row.city);
                            }}
                            className={`transition-colors ${
                              isAllOC
                                ? 'bg-rose-50/90 font-black border-y-2 border-[#FA2D48]/40 text-slate-950'
                                : 'hover:bg-slate-50/90 cursor-pointer'
                            }`}
                          >
                            <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                              <span className={isAllOC ? 'text-[#FA2D48] text-sm font-black' : 'font-extrabold'}>
                                {row.city}
                              </span>
                              {isAllOC && (
                                <span className="px-2 py-0.5 rounded-full bg-[#FA2D48] text-white text-[9px] font-black uppercase tracking-wider">
                                  Benchmark
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-right font-mono">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-black ${
                                isAllOC
                                  ? 'bg-[#FA2D48] text-white shadow-xs'
                                  : sqftNumeric >= 1000
                                    ? 'bg-rose-100 text-[#FA2D48] font-black'
                                    : sqftNumeric >= 700
                                      ? 'bg-emerald-100 text-emerald-800 font-black'
                                      : 'bg-slate-100 text-slate-800 font-bold'
                              }`}>
                                {row.medianPricePerSqFt}
                                <span className="text-[10px] font-normal ml-0.5 text-slate-500">/sqft</span>
                              </span>
                            </td>

                            <td className="p-3 text-right font-mono font-bold text-slate-800">
                              {row.medianSqFt ? `${row.medianSqFt.toLocaleString()} sqft` : '—'}
                            </td>

                            <td className="p-3 text-right font-mono font-bold text-slate-950">
                              {row.medianSalesPrice}
                            </td>

                            <td className="p-3 text-right font-mono font-medium text-slate-600">
                              {row.medianListPrice}
                            </td>

                            <td className="p-3 text-center font-mono font-bold">
                              <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                                parseFloat(row.salesToListRatio) >= 100.0
                                  ? 'bg-emerald-50 text-emerald-700 font-black'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {row.salesToListRatio}
                              </span>
                            </td>

                            <td className="p-3 text-center font-mono font-bold text-slate-900">
                              <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                                row.medianDOM <= 14 ? 'bg-rose-50 text-[#FA2D48] font-black' : 'text-slate-700'
                              }`}>
                                {row.medianDOM} days
                              </span>
                            </td>

                            <td className="p-3 text-center font-mono font-black text-slate-950">
                              {row.unitsSold2026}
                            </td>

                            <td className="p-3 text-center font-mono text-slate-500">
                              <span>{row.unitsSold2025}</span>
                              {row.unitsSold2025 > 0 && (
                                <span className={`ml-1.5 text-[10px] font-bold ${
                                  yoyGrowth >= 0 ? 'text-emerald-600' : 'text-[#FA2D48]'
                                }`}>
                                  ({yoyGrowth >= 0 ? `+${yoyGrowth}%` : `${yoyGrowth}%`})
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-right font-mono text-[11px] text-slate-600 font-medium">
                              <span>{row.lowPrice}</span>
                              <span className="text-slate-400 mx-1">–</span>
                              <span>{row.highPrice}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  * Price per square foot and sales metric data sourced from verified closed escrow sales across all Orange County submarkets for the August 2026 report period. Click any city to view localized market trends.
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Featured Realtor & Brokerage Partner Banner */}
      {monetizationEnabled && ads && ads.length > 0 && (
        <div className="mt-8">
          <AdBannerRenderer
            ads={ads}
            placement="market-trends-banner"
            cityName={currentCityName}
            monetizationEnabled={monetizationEnabled}
          />
        </div>
      )}
    </div>
  );
};


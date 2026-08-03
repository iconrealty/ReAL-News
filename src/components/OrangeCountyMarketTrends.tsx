import React, { useState, useMemo } from 'react';
import { MapPin, ChevronDown, TrendingUp, Clock, Tag, Building, Search, ArrowUpDown, ShieldCheck, AlertCircle } from 'lucide-react';
import { CityInfo } from '../types';
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
  if (days < 60) {
    return {
      label: "Hot Market",
      bgClass: "bg-[#FA2D48] text-white font-bold",
      badgeText: "Hot Seller's Market (< 60 Days)",
      description: "Sellers hold full pricing leverage with rapid inventory absorption."
    };
  } else if (days < 90) {
    return {
      label: "Slight Seller's",
      bgClass: "bg-amber-500 text-white font-bold",
      badgeText: "Slight Seller's Market (60–89 Days)",
      description: "Slight seller advantage with steady sales pace."
    };
  } else if (days < 120) {
    return {
      label: "Balanced Market",
      bgClass: "bg-blue-600 text-white font-bold",
      badgeText: "Balanced Market (90–119 Days)",
      description: "Equilibrium between buyers and sellers with stable pricing."
    };
  } else {
    return {
      label: "Buyer's Market",
      bgClass: "bg-emerald-800 text-white font-bold",
      badgeText: "Buyer's Market (120+ Days)",
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
    ytdSalesVolume: soldItem ? `$${(soldItem.unitsSoldJune2026 * (priceNum / 1000000)).toFixed(1)}M` : '$450M',
    ytdSalesRaw: 450,
    homesSoldYtd: soldItem ? soldItem.unitsSoldJune2026 * 6 : 300,
    pendingHomes: item.demand30Days,
    unitsClosedPastMonth: soldItem ? soldItem.unitsSoldJune2026 : 45,
    daysOnMarket: item.marketTimeDays,
    yoyGrowth: 5.2,
    description: `Official statistics for ${item.city}, ${item.region}.`
  };
});

interface OrangeCountyMarketTrendsProps {
  onSelectCity?: (city: CityInfo) => void;
  fredStats?: { mortgage30Year: string; mortgage15Year: string; asOfDate: string } | null;
}

type ReportTab = 'summary' | 'market-time' | 'price-range' | 'sold-report' | 'sitting-market';

export const OrangeCountyMarketTrends: React.FC<OrangeCountyMarketTrendsProps> = ({ onSelectCity, fredStats: propFredStats }) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('summary');
  const [selectedCity, setSelectedCity] = useState<OCCityMarketData | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [pricePropertyType, setPricePropertyType] = useState<'all' | 'attached' | 'detached'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('city');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [fredStats, setFredStats] = useState<{ mortgage30Year: string; mortgage15Year: string; asOfDate: string } | null>(propFredStats || null);

  React.useEffect(() => {
    if (propFredStats) {
      setFredStats(propFredStats);
      return;
    }
    fetch('/api/live-market-stats')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFredStats(json.data);
        }
      })
      .catch(err => console.warn("Failed to load live FRED stats", err));
  }, [propFredStats]);

  const regionCities = useMemo(() => {
    if (selectedRegion === 'All') return [];
    return OC_MARKET_DATA.filter(c => c.region === selectedRegion);
  }, [selectedRegion]);

  // Filtered Market Time Report
  const filteredMarketTimeReport = useMemo(() => {
    let list = OC_MARKET_TIME_REPORT.filter(r => r.city !== 'ALL OF O.C.');
    
    if (selectedRegion !== 'All') {
      list = list.filter(r => r.region === selectedRegion);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.city.toLowerCase().includes(q));
    }

    return list.sort((a, b) => {
      let valA: any = a[sortField as keyof OCMarketTimeEntry];
      let valB: any = b[sortField as keyof OCMarketTimeEntry];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [selectedRegion, searchQuery, sortField, sortAsc]);

  // Filtered Sold Report
  const filteredSoldReport = useMemo(() => {
    let list = OC_SOLD_REPORT.filter(r => r.city !== 'All of O.C.');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(r => r.city.toLowerCase().includes(q));
    }

    return list.sort((a, b) => {
      let valA: any = a[sortField as keyof OCSoldReportEntry] || 0;
      let valB: any = b[sortField as keyof OCSoldReportEntry] || 0;

      if (typeof valA === 'string') valA = valA.replace(/[^0-9.]/g, '');
      if (typeof valB === 'string') valB = valB.replace(/[^0-9.]/g, '');

      const numA = parseFloat(valA) || 0;
      const numB = parseFloat(valB) || 0;

      if (numA < numB) return sortAsc ? -1 : 1;
      if (numA > numB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [searchQuery, sortField, sortAsc]);

  const priceRangeData = useMemo(() => {
    if (pricePropertyType === 'attached') return OC_PRICE_RANGE_REPORT_ATTACHED;
    if (pricePropertyType === 'detached') return OC_PRICE_RANGE_REPORT_DETACHED;
    return OC_PRICE_RANGE_REPORT_ALL;
  }, [pricePropertyType]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      
      {/* Official Report Header Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-sans font-bold text-[#FA2D48]">
              <span>Official OC Housing Report • {OC_HOUSING_REPORT_METADATA.reportDate}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-slate-950 leading-tight">
              {OC_HOUSING_REPORT_METADATA.title}
            </h1>
            <p className="text-slate-600 text-sm max-w-2xl font-sans leading-relaxed">
              {OC_HOUSING_REPORT_METADATA.subtitle}
            </p>
            <div className="text-xs text-slate-500 pt-1 font-sans">
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

      {/* Main Data Tabs Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'summary', label: 'Executive Summary' },
            { id: 'market-time', label: 'City Market Time (DOM)' },
            { id: 'sold-report', label: 'June Closed Sales Data' },
            { id: 'price-range', label: 'Price Bracket Breakdown' },
            { id: 'sitting-market', label: 'Sitting on Market (30d+)' },
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
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* City Dropdown & Region Filters Bar */}
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
                  } else {
                    const city = OC_MARKET_DATA.find(c => c.id === val);
                    if (city) {
                      setSelectedCity(city);
                      setSelectedRegion(city.region);
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
                  onClick={() => setSelectedCity(city)}
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

      {/* Selected City Detail View */}
      {selectedCity ? (() => {
        const soldData = OC_SOLD_REPORT.find(s => s.city.toLowerCase() === selectedCity.name.toLowerCase());
        const marketData = OC_MARKET_TIME_REPORT.find(m => m.city.toLowerCase() === selectedCity.name.toLowerCase());

        const yoyUnitsChange = soldData ? soldData.unitsSoldJune2026 - soldData.unitsSoldJune2025 : 0;
        const yoyUnitsPercent = soldData && soldData.unitsSoldJune2025 > 0 
          ? ((yoyUnitsChange / soldData.unitsSoldJune2025) * 100).toFixed(1) 
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
                  onClick={() => setSelectedCity(null)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer self-start sm:self-auto"
                >
                  <span>← Back to Countywide View</span>
                </button>
              </div>

              {/* JUNE CLOSED SALES DATA (From Last Page of Report) */}
              {soldData && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
                      June 2026
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-2">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Sales Price</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{soldData.medianSalesPrice}</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-medium">List Price: {soldData.medianListPrice}</div>
                    </div>

                    <div className="p-2">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Sales-to-List Ratio</div>
                      <div className="text-2xl sm:text-3xl font-bold text-emerald-600 pt-1">{soldData.salesToListRatio}</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-medium">Countywide Avg: {OC_HOUSING_REPORT_METADATA.salesToListRatio}</div>
                    </div>

                    <div className="p-2">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Price / Sq. Ft.</div>
                      <div className="text-2xl sm:text-3xl font-bold text-[#FA2D48] pt-1">{soldData.medianPricePerSqFt}</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-medium">Median Size: {soldData.medianSqFt.toLocaleString()} sq ft</div>
                    </div>

                    <div className="p-2">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">June</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{soldData.unitsSoldJune2026} Units</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-medium">
                        {yoyUnitsChange >= 0 ? `+${yoyUnitsChange}` : yoyUnitsChange} vs June '25 ({soldData.unitsSoldJune2025})
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="py-2.5 px-3 flex items-center justify-between text-xs border-b border-slate-100 sm:border-b-0">
                      <span className="font-medium text-slate-600">June Price Range (Low to High):</span>
                      <span className="font-sans font-bold text-slate-900">{soldData.lowPrice} — {soldData.highPrice}</span>
                    </div>
                    <div className="py-2.5 px-3 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">Closed Days on Market (DOM):</span>
                      <span className="font-sans font-bold text-slate-900">{soldData.medianDOM} Days</span>
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
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                              {cond.label}
                            </span>
                          </div>
                          <div className="text-2xl sm:text-3xl font-bold pt-1 text-white">{marketData.marketTimeDays} Days</div>
                          <div className="text-[11px] font-medium opacity-95 pt-0.5">{cond.badgeText}</div>
                        </div>
                      );
                    })()}

                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Active Inventory</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{marketData.currentActives} Homes</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-medium">Active listings on market</div>
                    </div>

                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">30-Day Demand</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{marketData.demand30Days} Pending</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-medium">Recent pending escrows</div>
                    </div>

                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70">
                      <div className="text-[11px] font-extrabold text-black uppercase tracking-wider">Median Active List Price</div>
                      <div className="text-2xl sm:text-3xl font-bold text-slate-900 pt-1">{marketData.medianActiveListPrice}</div>
                      <div className="text-[11px] text-emerald-600 pt-1 font-medium">Current active listings</div>
                    </div>
                  </div>

                  {/* Historical DOM Trend Bar */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="text-xs font-bold text-slate-700">Historical Expected Market Time Pace:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-sans">
                      <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-sans font-bold">2 Weeks Ago</div>
                          <div className="font-bold text-slate-900">{marketData.marketTime2WeeksAgo} Days</div>
                        </div>
                        <div className="text-[10px] font-sans font-semibold text-slate-600 pt-1 border-t border-slate-100 mt-1">
                          {getMarketCondition(marketData.marketTime2WeeksAgo).label}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-sans font-bold">4 Weeks Ago</div>
                          <div className="font-bold text-slate-900">{marketData.marketTime4WeeksAgo} Days</div>
                        </div>
                        <div className="text-[10px] font-sans font-semibold text-slate-600 pt-1 border-t border-slate-100 mt-1">
                          {getMarketCondition(marketData.marketTime4WeeksAgo).label}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-sans font-bold">1 Year Ago</div>
                          <div className="font-bold text-slate-900">{marketData.marketTime1YearAgo} Days</div>
                        </div>
                        <div className="text-[10px] font-sans font-semibold text-slate-600 pt-1 border-t border-slate-100 mt-1">
                          {getMarketCondition(marketData.marketTime1YearAgo).label}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 font-sans font-bold">2 Years Ago</div>
                          <div className="font-bold text-slate-900">{marketData.marketTime2YearsAgo} Days</div>
                        </div>
                        <div className="text-[10px] font-sans font-semibold text-slate-600 pt-1 border-t border-slate-100 mt-1">
                          {getMarketCondition(marketData.marketTime2YearsAgo).label}
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
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">FRED 30-Year Mortgage Rate</div>
                  <div className="text-3xl font-black text-slate-900 pt-1">{fredStats?.mortgage30Year || '6.66%'}</div>
                  <p className="text-xs text-slate-500 mt-2">
                    Freddie Mac Primary Market Survey {fredStats?.asOfDate ? `(As of ${fredStats.asOfDate})` : ''}. Live Federal Reserve FRED benchmark.
                  </p>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">Countywide Median List Price</div>
                  <div className="text-3xl font-black text-slate-900 pt-1">{OC_HOUSING_REPORT_METADATA.countywideMedianPrice}</div>
                  <p className="text-xs text-slate-500 mt-2">Across 5,020 active listings in all 34 OC municipalities.</p>
                </div>
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
                  <div className="text-xs font-sans uppercase tracking-widest text-black font-extrabold">June Closed Resales</div>
                  <div className="text-3xl font-black text-[#FA2D48] pt-1">1,994 Sales</div>
                  <p className="text-xs text-slate-500 mt-2">+9% compared to June 2025 (1,828 sales). Average 99.9% sales-to-list ratio.</p>
                </div>
              </div>

              {/* Bullet Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {OC_HOUSING_SUMMARY_BULLETS.map((bullet, idx) => (
                  <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-sans font-bold text-[#FA2D48] uppercase tracking-wider">{bullet.title}</span>
                      <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700">{bullet.trend}</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{bullet.stat}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{bullet.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CITY MARKET TIME REPORT */}
          {activeTab === 'market-time' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Orange County City Market Time Report</h3>
                  <p className="text-xs text-slate-500">Official Steven Thomas Market Time Report (July 20, 2026). Expected Market Time in days to sell all listings.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F2F2F7] border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('city')}>
                        <div className="flex items-center space-x-1">
                          <span>City / Community</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-3">Region</th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('currentActives')}>
                        <div className="flex items-center space-x-1">
                          <span>Actives</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('demand30Days')}>
                        <div className="flex items-center space-x-1">
                          <span>30-Day Pending</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('marketTimeDays')}>
                        <div className="flex items-center space-x-1 text-[#FA2D48]">
                          <span>Market Time (DOM)</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="p-3">2w Ago</th>
                      <th className="p-3">4w Ago</th>
                      <th className="p-3">1y Ago</th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('medianActiveListPrice')}>
                        <div className="flex items-center space-x-1">
                          <span>Median Price</span>
                          <ArrowUpDown className="w-3 h-3" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMarketTimeReport.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{row.city}</td>
                        <td className="p-3 text-slate-500 font-medium">{row.region}</td>
                        <td className="p-3 font-semibold text-slate-800">{row.currentActives}</td>
                        <td className="p-3 font-semibold text-slate-800">{row.demand30Days}</td>
                        <td className="p-3 font-black text-[#FA2D48] bg-rose-50/50 rounded-lg">{row.marketTimeDays} Days</td>
                        <td className="p-3 text-slate-600">{row.marketTime2WeeksAgo}d</td>
                        <td className="p-3 text-slate-600">{row.marketTime4WeeksAgo}d</td>
                        <td className="p-3 text-slate-600">{row.marketTime1YearAgo}d</td>
                        <td className="p-3 font-bold text-slate-900">{row.medianActiveListPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: JUNE CLOSED SALES REPORT */}
          {activeTab === 'sold-report' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">June 2026 Closed Resales Report</h3>
                  <p className="text-xs text-slate-500">Official CRMLS closed sales records for Orange County municipalities.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F2F2F7] border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('city')}>City</th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('unitsSoldJune2026')}>Units Sold</th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('medianSalesPrice')}>Median Sales Price</th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('salesToListRatio')}>Sales/List %</th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('medianPricePerSqFt')}>$/Sq. Ft.</th>
                      <th className="p-3 cursor-pointer" onClick={() => toggleSort('medianDOM')}>Median DOM</th>
                      <th className="p-3">Low / High Price Range</th>
                      <th className="p-3">June 2025 Units</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSoldReport.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{row.city}</td>
                        <td className="p-3 font-bold text-slate-950">{row.unitsSoldJune2026}</td>
                        <td className="p-3 font-black text-[#FA2D48]">{row.medianSalesPrice}</td>
                        <td className="p-3 font-bold text-emerald-600">{row.salesToListRatio}</td>
                        <td className="p-3 font-bold text-slate-800">{row.medianPricePerSqFt}</td>
                        <td className="p-3 font-bold text-slate-700">{row.medianDOM} Days</td>
                        <td className="p-3 text-slate-500 text-[11px] font-sans">{row.lowPrice} - {row.highPrice}</td>
                        <td className="p-3 text-slate-600">{row.unitsSoldJune2025}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PRICE RANGE BREAKDOWN */}
          {activeTab === 'price-range' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Price Range & Property Type Analysis</h3>
                  <p className="text-xs text-slate-500">Market speed and listing inventory grouped by price tiers.</p>
                </div>

                {/* Sub Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: 'all', label: 'All Homes' },
                    { id: 'attached', label: 'Attached (Condos)' },
                    { id: 'detached', label: 'Detached (SFH)' },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setPricePropertyType(sub.id as any)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        pricePropertyType === sub.id
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3">Price Tier</th>
                      <th className="p-3">Current Actives</th>
                      <th className="p-3">30-Day Demand</th>
                      <th className="p-3 text-[#FA2D48]">Market Time (DOM)</th>
                      <th className="p-3">2w Ago</th>
                      <th className="p-3">4w Ago</th>
                      <th className="p-3">1y Ago</th>
                      <th className="p-3">Median Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {priceRangeData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-black text-slate-900">{row.priceRange}</td>
                        <td className="p-3 font-semibold text-slate-800">{row.currentActives}</td>
                        <td className="p-3 font-semibold text-slate-800">{row.demand30Days}</td>
                        <td className="p-3 font-black text-[#FA2D48] bg-rose-50/50 rounded-lg">{row.marketTimeDays} Days</td>
                        <td className="p-3 text-slate-600">{row.marketTime2WeeksAgo}d</td>
                        <td className="p-3 text-slate-600">{row.marketTime4WeeksAgo}d</td>
                        <td className="p-3 text-slate-600">{row.marketTime1YearAgo}d</td>
                        <td className="p-3 font-bold text-slate-900">{row.medianActivePrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SITTING ON MARKET ANALYSIS */}
          {activeTab === 'sitting-market' && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Sitting on the Market Breakdown</h3>
                <p className="text-xs text-slate-500">64% of all active homes have been listed for at least 1 month, and 41% surpassed 2 months.</p>
              </div>

              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3">Price Bracket</th>
                      <th className="p-3">Current Actives</th>
                      <th className="p-3">30+ Days Listed</th>
                      <th className="p-3 text-rose-600">% 30+ Days</th>
                      <th className="p-3">60+ Days Listed</th>
                      <th className="p-3 text-amber-600">% 60+ Days</th>
                      <th className="p-3">Expected Market Time</th>
                      <th className="p-3">Off-Market (Jan–June)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {OC_SITTING_ON_MARKET_REPORT.map((row, idx) => (
                      <tr key={idx} className={`hover:bg-slate-50/80 transition-colors ${row.priceRange === 'All of O.C.' ? 'bg-slate-100/70 font-black' : ''}`}>
                        <td className="p-3 font-bold text-slate-900">{row.priceRange}</td>
                        <td className="p-3 text-slate-800">{row.currentActives}</td>
                        <td className="p-3 text-slate-800">{row.actives30PlusDays}</td>
                        <td className="p-3 font-bold text-rose-600">{row.percent30PlusDays}</td>
                        <td className="p-3 text-slate-800">{row.actives60PlusDays}</td>
                        <td className="p-3 font-bold text-amber-600">{row.percent60PlusDays}</td>
                        <td className="p-3 font-bold text-slate-900">{row.marketTimeDays} Days</td>
                        <td className="p-3 text-slate-700">{row.offMarketJanJun} homes</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};


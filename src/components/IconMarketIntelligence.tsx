import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Info, 
  X, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Layers,
  Home,
  CheckCircle2,
  DollarSign,
  Activity,
  Copy,
  Check,
  Building2,
  SlidersHorizontal,
  Compass,
  Calendar
} from 'lucide-react';
import {
  OC_HOUSING_REPORT_METADATA,
  OC_PAGE_8_MARKET_BREAKDOWN,
  OC_PAGE_8_LUXURY_NOTE,
  OC_PAGE_9_HOUSING_SUMMARY,
  OC_SOLD_REPORT,
  OC_MARKET_TIME_REPORT,
  OC_PRICE_RANGE_REPORT_ALL,
  OC_PRICE_RANGE_REPORT_ATTACHED,
  OC_PRICE_RANGE_REPORT_DETACHED,
  OC_COUNTYWIDE_LIVE_METRICS,
  OCPage8BreakdownRow
} from '../data/ocHousingReportData';
import { CITIES } from '../data/mockNews';
import { CityInfo } from '../types';
import { getMarketCondition } from './OrangeCountyMarketTrends';
import { MarketSpeedStatusModal } from './MarketSpeedStatusModal';
import { HousingSummarySection } from './HousingSummarySection';

interface IconMarketIntelligenceProps {
  currentCity?: CityInfo;
  onSelectCity?: (city: CityInfo) => void;
  onShowToast?: (msg: string) => void;
}

export const IconMarketIntelligence: React.FC<IconMarketIntelligenceProps> = ({
  currentCity = CITIES[0],
  onSelectCity,
  onShowToast
}) => {
  const [showMarketTimeModal, setShowMarketTimeModal] = useState<boolean>(false);
  const [showHistoricalMarketTimeModal, setShowHistoricalMarketTimeModal] = useState<boolean>(false);
  const [showMarketDirectionModal, setShowMarketDirectionModal] = useState<boolean>(false);
  const [activeBreakdownView, setActiveBreakdownView] = useState<'page8' | 'attached' | 'detached'>('page8');
  const [selectedTierPrice, setSelectedTierPrice] = useState<string>('$1.25M - $1.5M');
  const [hasCopiedSummary, setHasCopiedSummary] = useState<boolean>(false);

  const meta = OC_HOUSING_REPORT_METADATA;
  const page9 = OC_PAGE_9_HOUSING_SUMMARY;
  const page8 = OC_PAGE_8_MARKET_BREAKDOWN;
  const luxuryNote = OC_PAGE_8_LUXURY_NOTE;

  // Selected Page 8 Tier for Interactive Explorer
  const selectedTier = useMemo(() => {
    return page8.find(r => r.priceRange === selectedTierPrice) || page8[3];
  }, [page8, selectedTierPrice]);

  // Selected city data
  const isCountywide = currentCity.id === 'orange-county';

  const currentCitySoldData = useMemo(() => {
    const name = currentCity?.name?.toLowerCase().trim() || '';
    if (name === 'orange county' || name === 'all of o.c.' || currentCity?.id === 'orange-county') {
      return OC_SOLD_REPORT.find(s => s.city === 'All of O.C.') || null;
    }
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = clean(name);
    return OC_SOLD_REPORT.find(s => {
      const cleanCity = clean(s.city);
      return cleanCity === cleanName || cleanCity.includes(cleanName) || cleanName.includes(cleanCity);
    });
  }, [currentCity?.name, currentCity?.id]);

  const currentCityMarketData = useMemo(() => {
    const name = currentCity?.name?.toLowerCase().trim() || '';
    if (name === 'orange county' || name === 'all of o.c.' || currentCity?.id === 'orange-county') {
      return {
        city: "All of Orange County",
        region: "Coastal" as const,
        currentActives: meta.countywideActives,
        demand30Days: meta.countywideDemand,
        marketTimeDays: meta.countywideMarketTime,
        marketTime2WeeksAgo: meta.countywideMarketTime2WksAgo,
        marketTime4WeeksAgo: 101,
        marketTime1YearAgo: meta.countywideMarketTimeLastYear,
        marketTime2YearsAgo: 69,
        medianActiveListPrice: "$1.2m",
      };
    }
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = clean(name);
    return OC_MARKET_TIME_REPORT.find(m => {
      const cleanCity = clean(m.city);
      return cleanCity === cleanName || cleanCity.includes(cleanName) || cleanName.includes(cleanCity);
    });
  }, [currentCity?.name, currentCity?.id, meta]);

  const handleCopySummary = () => {
    const text = [
      `ORANGE COUNTY HOUSING SUMMARY — STEVEN THOMAS (${page9.reportDate})`,
      `"${page9.title.toUpperCase()}: ${page9.subtitle}"`,
      ``,
      `KEY METRICS:`,
      `• Active Inventory: 4,924 homes (-28 in 2 wks, -0.6% | 4,478 last year)`,
      `• Buyer Demand: 1,249 pending sales (-100 in 2 wks, -7.4% | Lowest Oct since 2007)`,
      `• Expected Market Time (EMT): 118 Days (+8d in 2 wks | Slowest since April 2020)`,
      `• Detached Single-Family: 105 Days | Attached Condos: 139 Days`,
      `• Luxury Market ($2.5M+): 183 Days (952 actives, 156 demand | April 2027 pace)`,
      `• Distressed Properties: 17 total (6 foreclosures, 11 short sales | 0.3% supply)`,
      `• Closed Sales: 1,755 resales (Aug 2026 | 99.5% sale-to-list | 99.72% equity sellers)`,
      ``,
      `PAGE 8 MARKET BREAKDOWN (SWEET SPOT & VELOCITY):`,
      `• Under $750k: 126 Days (22% Inventory / 21% Demand)`,
      `• $750k - $1M: 117 Days (17% Inventory / 17% Demand)`,
      `• $1M - $1.25M: 102 Days (12% Inventory / 14% Demand)`,
      `• $1.25M - $1.5M: 86 Days [Sweet Spot] (11% Inventory / 16% Demand)`,
      `• $1.5M - $2M: 103 Days (13% Inventory / 15% Demand)`,
      `• $2M - $2.5M: 120 Days (5% Inventory / 5% Demand)`,
      `• $2.5M - $4M: 125 Days (9% Inventory / 8% Demand)`,
      `• $4M - $6M: 224 Days (5% Inventory / 2% Demand)`,
      `• $6M+: 379 Days (6% Inventory / 2% Demand)`,
      ``,
      `Source: Reports On Housing • Steven Thomas`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setHasCopiedSummary(true);
    if (onShowToast) onShowToast('October Report Summary copied to clipboard!');
    setTimeout(() => setHasCopiedSummary(false), 3000);
  };

  const getTierSpeedBadge = (speed: string) => {
    switch (speed) {
      case "Hot Seller's":
        return { bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", barColor: "bg-rose-500" };
      case "Slight Seller's":
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", barColor: "bg-amber-500" };
      case "Balanced Market":
        return { bg: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500", barColor: "bg-sky-500" };
      case "Slight Buyer's":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", barColor: "bg-emerald-500" };
      case "Buyer's Market":
      default:
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", barColor: "bg-blue-600" };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 font-sans text-slate-900 antialiased selection:bg-rose-100 selection:text-rose-900">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          APPLE / TESLA TOP MASTHEAD & LIVE TELEMETRY
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        
        {/* Top Byline & Utility Actions (Identical to Main Page Top Bar) */}
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
              <span className="text-slate-300 font-bold hidden sm:inline">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/90 text-slate-800 font-bold text-xs font-sans shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#FA2D48]" />
                <span>Report Date: {OC_HOUSING_REPORT_METADATA.reportDate}</span>
              </span>
            </div>

            <div className="space-y-2 pt-0.5">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans text-slate-950 tracking-tight">
                {isCountywide ? 'Orange County Housing Summary' : currentCity.name}
              </h2>

              {/* City Selection Under Title */}
              {onSelectCity && (
                <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-slate-600 font-sans">
                    Select your City:
                  </span>
                  <div className="relative">
                    <select
                      id="steven-thomas-page-city-select"
                      value={currentCity.id}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matched = CITIES.find(c => c.id === val);
                        if (matched) {
                          onSelectCity(matched);
                          if (onShowToast) onShowToast(`Selected ${matched.name}`);
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
              )}
            </div>
          </div>

          {/* Masthead Quick Actions */}
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

            {!isCountywide && onSelectCity && (
              <button
                onClick={() => {
                  const ocCity = CITIES.find(c => c.id === 'orange-county') || CITIES[0];
                  onSelectCity(ocCity);
                  if (onShowToast) onShowToast('Reset to All Orange County');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                ← Countywide View
              </button>
            )}
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────────────────────
            SPECIFIC CITY REPORT FORMAT (RESTORED TO ORIGINAL STRUCTURE AS BEFORE)
        ────────────────────────────────────────────────────────────────────────── */}
        {/* ──────────────────────────────────────────────────────────────────────────
            UNIFIED SPECIFIC CITY REPORT FORMAT (MATCHES MAIN PAGE EXACTLY)
        ────────────────────────────────────────────────────────────────────────── */}
        {!isCountywide && (currentCityMarketData || currentCitySoldData) && (() => {
          const soldData = currentCitySoldData;
          const marketData = currentCityMarketData;
          const yoyUnitsChange = soldData ? soldData.unitsSold2026 - soldData.unitsSold2025 : 0;

          return (
            <div className="space-y-6 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
              {/* Dynamic City-Specific Market Speed Live Ticker */}
              {marketData && (() => {
                const emtDelta = marketData.marketTimeDays - marketData.marketTime2WeeksAgo;
                const isFaster = emtDelta < 0;
                const isSlower = emtDelta > 0;
                const speedLabel = isFaster ? 'FASTER' : isSlower ? 'SLOWER' : 'STEADY';
                const speedColor = isFaster ? 'text-emerald-600' : isSlower ? 'text-[#FA2D48]' : 'text-slate-600';
                const cond = getMarketCondition(marketData.marketTimeDays);

                return (
                  <button
                    type="button"
                    onClick={() => setShowHistoricalMarketTimeModal(true)}
                    className="relative flex items-center h-12 w-full overflow-hidden bg-transparent text-slate-800 transition-opacity hover:opacity-85 cursor-pointer font-sans group select-none mb-4"
                    title={`Click to view ${currentCity.name} Historical Speed & Pace`}
                  >
                    {/* Running City Equation */}
                    <div className="relative overflow-hidden w-full">
                      <div className="animate-ticker flex items-center group-hover:[animation-play-state:paused]">
                        {/* 1st copy */}
                        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-[15px] font-bold tracking-tight uppercase text-slate-700 shrink-0 pr-6 sm:pr-8">
                          <span className={`font-black uppercase tracking-wider px-2.5 sm:px-3.5 py-1 rounded-full border shadow-2xs text-xs sm:text-sm ${cond.tickerBadgeClass}`}>
                            {cond.capitalLabel}
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm md:text-[15px]">
                            MARKET SPEED: <span className={`${speedColor} font-black underline decoration-2 decoration-current underline-offset-2`}>{speedLabel}</span>
                          </span>
                          <span className="text-slate-600 font-bold">
                            DEMAND: <span className="text-emerald-600 font-black text-sm sm:text-base md:text-lg">{marketData.demand30Days}</span>{' '}
                            <span className="text-emerald-600 font-black text-xl leading-none inline-block">↑</span>
                          </span>
                          <span className="text-slate-600 font-bold">
                            SUPPLY: <span className="text-slate-900 font-black text-sm sm:text-base md:text-lg">{marketData.currentActives}</span>{' '}
                            <span className="text-[#FA2D48] font-black text-xl leading-none inline-block">↓</span>
                          </span>
                          <span className="text-slate-600 font-bold">
                            EMT: <span className="text-slate-950 font-black text-sm sm:text-base md:text-lg">{marketData.marketTimeDays} DAYS</span>
                            {emtDelta !== 0 && (
                              <span className={`ml-1.5 font-black inline-flex items-center gap-0.5 text-xs sm:text-sm ${isFaster ? 'text-emerald-600' : 'text-[#FA2D48]'}`}>
                                <span className="text-xl leading-none font-black">{isFaster ? '↓' : '↑'}</span>
                                <span>{Math.abs(emtDelta)}d {isFaster ? 'FASTER' : 'SLOWER'}</span>
                              </span>
                            )}
                          </span>
                          <span className="text-slate-300 font-light text-sm sm:text-base select-none">/</span>
                        </div>
                        {/* 2nd identical copy */}
                        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-[15px] font-bold tracking-tight uppercase text-slate-700 shrink-0 pr-6 sm:pr-8" aria-hidden="true">
                          <span className={`font-black uppercase tracking-wider px-2.5 sm:px-3.5 py-1 rounded-full border shadow-2xs text-xs sm:text-sm ${cond.tickerBadgeClass}`}>
                            {cond.capitalLabel}
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs sm:text-sm md:text-[15px]">
                            MARKET SPEED: <span className={`${speedColor} font-black underline decoration-2 decoration-current underline-offset-2`}>{speedLabel}</span>
                          </span>
                          <span className="text-slate-600 font-bold">
                            DEMAND: <span className="text-emerald-600 font-black text-sm sm:text-base md:text-lg">{marketData.demand30Days}</span>{' '}
                            <span className="text-emerald-600 font-black text-xl leading-none inline-block">↑</span>
                          </span>
                          <span className="text-slate-600 font-bold">
                            SUPPLY: <span className="text-slate-900 font-black text-sm sm:text-base md:text-lg">{marketData.currentActives}</span>{' '}
                            <span className="text-[#FA2D48] font-black text-xl leading-none inline-block">↓</span>
                          </span>
                          <span className="text-slate-600 font-bold">
                            EMT: <span className="text-slate-950 font-black text-sm sm:text-base md:text-lg">{marketData.marketTimeDays} DAYS</span>
                            {emtDelta !== 0 && (
                              <span className={`ml-1.5 font-black inline-flex items-center gap-0.5 text-xs sm:text-sm ${isFaster ? 'text-emerald-600' : 'text-[#FA2D48]'}`}>
                                <span className="text-xl leading-none font-black">{isFaster ? '↓' : '↑'}</span>
                                <span>{Math.abs(emtDelta)}d {isFaster ? 'FASTER' : 'SLOWER'}</span>
                              </span>
                            )}
                          </span>
                          <span className="text-slate-300 font-light text-sm sm:text-base select-none">/</span>
                        </div>
                      </div>
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

                  {/* Primary Speed Gauges: Expected Market Time & Closed Days on Market */}
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

                  {/* Price Range Information */}
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

      {/* RENDER COUNTYWIDE SECTION 1 & SECTION 2 ONLY WHEN isCountywide IS TRUE */}
      {isCountywide && (
        <>
          {/* Live Steven Thomas Orange County Live Tab (Countywide Only - Matches Main Page Slider Tab Exactly) */}
          {(() => {
            const countywideCond = getMarketCondition(OC_COUNTYWIDE_LIVE_METRICS.emtDays);
            const countywideEmtDelta = OC_COUNTYWIDE_LIVE_METRICS.emtDelta;
            const isCountyFaster = countywideEmtDelta < 0;
            const isCountySlower = countywideEmtDelta > 0;
            const countySpeedLabel = isCountyFaster ? 'FASTER' : isCountySlower ? 'SLOWER' : 'STEADY';
            const countySpeedColor = isCountyFaster ? 'text-emerald-600' : isCountySlower ? 'text-[#FA2D48]' : 'text-slate-600';

            return (
              <div className="w-full pt-1 pb-2">
                <button
                  type="button"
                  id="steven-thomas-page-market-speed-pill"
                  onClick={() => setShowMarketDirectionModal(true)}
                  className="relative flex items-center h-12 w-full overflow-hidden bg-transparent text-slate-800 transition-opacity hover:opacity-85 cursor-pointer font-sans group select-none"
                  title="Click to view Market Speed & Status"
                >
                  {/* Running Text Streaming Slower to the Left (Stock / Live Feed Style) */}
                  <div className="relative overflow-hidden w-full">
                    <div className="animate-ticker flex items-center group-hover:[animation-play-state:paused]">
                      {/* 1st copy */}
                      <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-[15px] font-bold tracking-tight uppercase text-slate-700 shrink-0 pr-6 sm:pr-8">
                        <span className={`font-black uppercase tracking-wider px-2.5 sm:px-3.5 py-1 rounded-full border shadow-2xs text-xs sm:text-sm ${countywideCond.tickerBadgeClass}`}>
                          {countywideCond.capitalLabel}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm md:text-[15px]">
                          MARKET SPEED: <span className={`${countySpeedColor} font-black underline decoration-2 decoration-current underline-offset-2`}>{countySpeedLabel}</span>
                        </span>
                        <span className="text-slate-600 font-bold">
                          DEMAND: <span className="text-emerald-600 font-black text-sm sm:text-base md:text-lg">{OC_COUNTYWIDE_LIVE_METRICS.demand.toLocaleString()}</span>{' '}
                          <span className="text-rose-500 font-black inline-flex items-center gap-0.5 text-xs sm:text-sm">
                            <span className="text-xl leading-none font-black">↓</span>
                            <span>{OC_COUNTYWIDE_LIVE_METRICS.demandDelta}</span>
                          </span>
                        </span>
                        <span className="text-slate-600 font-bold">
                          SUPPLY: <span className="text-slate-900 font-black text-sm sm:text-base md:text-lg">{OC_COUNTYWIDE_LIVE_METRICS.supply.toLocaleString()}</span>{' '}
                          <span className="text-emerald-600 font-black inline-flex items-center gap-0.5 text-xs sm:text-sm">
                            <span className="text-xl leading-none font-black">↓</span>
                            <span>{OC_COUNTYWIDE_LIVE_METRICS.supplyDelta}</span>
                          </span>
                        </span>
                        <span className="text-slate-600 font-bold">
                          EMT: <span className="text-slate-950 font-black text-sm sm:text-base md:text-lg">{OC_COUNTYWIDE_LIVE_METRICS.emtDays} DAYS</span>{' '}
                          <span className="text-emerald-600 font-black inline-flex items-center gap-0.5 text-xs sm:text-sm">
                            <span className="text-xl leading-none font-black">↓</span>
                            <span>{Math.abs(OC_COUNTYWIDE_LIVE_METRICS.emtDelta)}d FASTER</span>
                          </span>
                        </span>
                        <span className="text-slate-300 font-light text-sm sm:text-base select-none">/</span>
                      </div>
                      {/* 2nd identical copy for seamless infinite loop */}
                      <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-[15px] font-bold tracking-tight uppercase text-slate-700 shrink-0 pr-6 sm:pr-8" aria-hidden="true">
                        <span className={`font-black uppercase tracking-wider px-2.5 sm:px-3.5 py-1 rounded-full border shadow-2xs text-xs sm:text-sm ${countywideCond.tickerBadgeClass}`}>
                          {countywideCond.capitalLabel}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm md:text-[15px]">
                          MARKET SPEED: <span className={`${countySpeedColor} font-black underline decoration-2 decoration-current underline-offset-2`}>{countySpeedLabel}</span>
                        </span>
                        <span className="text-slate-600 font-bold">
                          DEMAND: <span className="text-emerald-600 font-black text-sm sm:text-base md:text-lg">{OC_COUNTYWIDE_LIVE_METRICS.demand.toLocaleString()}</span>{' '}
                          <span className="text-rose-500 font-black inline-flex items-center gap-0.5 text-xs sm:text-sm">
                            <span className="text-xl leading-none font-black">↓</span>
                            <span>{OC_COUNTYWIDE_LIVE_METRICS.demandDelta}</span>
                          </span>
                        </span>
                        <span className="text-slate-600 font-bold">
                          SUPPLY: <span className="text-slate-900 font-black text-sm sm:text-base md:text-lg">{OC_COUNTYWIDE_LIVE_METRICS.supply.toLocaleString()}</span>{' '}
                          <span className="text-emerald-600 font-black inline-flex items-center gap-0.5 text-xs sm:text-sm">
                            <span className="text-xl leading-none font-black">↓</span>
                            <span>{OC_COUNTYWIDE_LIVE_METRICS.supplyDelta}</span>
                          </span>
                        </span>
                        <span className="text-slate-600 font-bold">
                          EMT: <span className="text-slate-950 font-black text-sm sm:text-base md:text-lg">{OC_COUNTYWIDE_LIVE_METRICS.emtDays} DAYS</span>{' '}
                          <span className="text-emerald-600 font-black inline-flex items-center gap-0.5 text-xs sm:text-sm">
                            <span className="text-xl leading-none font-black">↓</span>
                            <span>{Math.abs(OC_COUNTYWIDE_LIVE_METRICS.emtDelta)}d FASTER</span>
                          </span>
                        </span>
                        <span className="text-slate-300 font-light text-sm sm:text-base select-none">/</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })()}

          {/* ──────────────────────────────────────────────────────────────────────────
              SECTION 1: PAGE 9 — ORANGE COUNTY HOUSING SUMMARY
              (Minimalist Apple / Tesla Telemetry Grid: Pure Numbers & Metrics, Zero Explanations)
          ────────────────────────────────────────────────────────────────────────── */}
          <HousingSummarySection showHeader={true} />

      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 2: PAGE 8 — ORANGE COUNTY MARKET BREAKDOWN
          (Minimalistic Apple / Tesla UI Table & Luxury Telemetry)
      ────────────────────────────────────────────────────────────────────────── */}
      {/* ──────────────────────────────────────────────────────────────────────────
          SECTION 2: PAGE 8 — ORANGE COUNTY MARKET BREAKDOWN
          (Minimalist Apple / Tesla UI: 3 Macro Zones + Interactive Tier Explorer + Visual Velocity Spectrum)
      ────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-6 pt-6 border-t border-slate-200 font-sans">
        
        {/* Section Header */}
        <div className="px-1">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-slate-950">
            Market Breakdown
          </h2>
        </div>

        {/* 1. THREE MACRO MARKET ZONES (Instant Scannability) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Zone 1: Sweet Spot */}
          <div 
            onClick={() => setSelectedTierPrice('$1.25M - $1.5M')}
            className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
              selectedTier.priceRange === '$1.25M - $1.5M' || selectedTier.priceRange === '$1M - $1.25M'
                ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/30 shadow-xs'
                : 'bg-white hover:bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Fastest Velocity
                </span>
                <span className="text-xs font-black text-amber-700">86–102 Days</span>
              </div>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                The Sweet Spot
              </h3>
              <div className="text-sm font-bold text-slate-700">
                $1.0M – $1.5M Price Range
              </div>
            </div>

            <div className="pt-3 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Buyer Demand</div>
                <div className="text-base font-black text-slate-950 tabular-nums">30% of OC</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Market State</div>
                <div className="text-base font-black text-amber-700">Slight Seller's</div>
              </div>
            </div>
          </div>

          {/* Zone 2: Balanced Core */}
          <div 
            onClick={() => setSelectedTierPrice('$750k - $1M')}
            className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
              ['$0 - $750k', '$750k - $1M', '$1.5M - $2M', '$2M - $2.5M'].includes(selectedTier.priceRange)
                ? 'bg-sky-50/60 border-sky-300 ring-2 ring-sky-400/30 shadow-xs'
                : 'bg-white hover:bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                  Core Volume
                </span>
                <span className="text-xs font-black text-sky-700">103–126 Days</span>
              </div>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Balanced Core
              </h3>
              <div className="text-sm font-bold text-slate-700">
                $0–$1M & $1.5M–$2.5M
              </div>
            </div>

            <div className="pt-3 border-t border-sky-200/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Buyer Demand</div>
                <div className="text-base font-black text-slate-950 tabular-nums">58% of OC</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Market State</div>
                <div className="text-base font-black text-sky-700">Balanced</div>
              </div>
            </div>
          </div>

          {/* Zone 3: Luxury End */}
          <div 
            onClick={() => setSelectedTierPrice('$4M - $6M')}
            className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
              ['$2.5M - $4M', '$4M - $6M', '$6M+'].includes(selectedTier.priceRange)
                ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-400/30 shadow-xs'
                : 'bg-white hover:bg-slate-50 border-slate-200/90'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  High Inventory
                </span>
                <span className="text-xs font-black text-blue-700">183–379 Days</span>
              </div>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">
                Luxury Segment
              </h3>
              <div className="text-sm font-bold text-slate-700">
                $2.5M and Above
              </div>
            </div>

            <div className="pt-3 border-t border-blue-200/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Buyer Demand</div>
                <div className="text-base font-black text-slate-950 tabular-nums">12% of OC</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Market State</div>
                <div className="text-base font-black text-blue-700">Buyer's Market</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE PRICE TIER SPOTLIGHT (Tesla HUD Telemetry) */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-6">
          
          {/* Price Tier Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {page8.map((tier) => {
              const isSelected = tier.priceRange === selectedTier.priceRange;
              const isSweetSpot = tier.priceRange === '$1.25M - $1.5M';

              return (
                <button
                  key={tier.priceRange}
                  type="button"
                  onClick={() => setSelectedTierPrice(tier.priceRange)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-950 text-white shadow-sm ring-2 ring-slate-950/20'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <span>{tier.priceRange}</span>
                  {isSweetSpot && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-200 text-amber-900'
                    }`}>
                      ★ Sweet Spot
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tier Telemetry Card */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  {selectedTier.priceRange}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getTierSpeedBadge(selectedTier.speedCategory).bg}`}>
                  {selectedTier.speedCategory}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto">
                Last Year: <span className="font-black text-slate-950">{selectedTier.lastYearDays} Days</span>
                <span className="text-slate-400 ml-1">({selectedTier.deltaDays > 0 ? `+${selectedTier.deltaDays}d slower` : `${selectedTier.deltaDays}d faster`})</span>
              </div>
            </div>

            {/* 3 Large Telemetry Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Days to Sell (EMT)</div>
                <div className="text-3xl sm:text-4xl font-black text-slate-950 tabular-nums">
                  {selectedTier.marketTimeDays} <span className="text-lg font-bold text-slate-400">Days</span>
                </div>
                <div className="text-xs font-bold text-slate-500">
                  {selectedTier.marketTimeDays < 90 ? 'High Speed (~2.8 months)' : selectedTier.marketTimeDays < 120 ? 'Moderate Speed (~3.8 months)' : 'Slow Speed (5+ months)'}
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Share of All OC Buyers</div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-600 tabular-nums">
                  {selectedTier.pctCurrentDemand}%
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Of total 1,249 pending sales
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Share of Total Listings</div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tabular-nums">
                  {selectedTier.pctCurrentInventory}%
                </div>
                <div className="text-xs font-bold text-slate-500">
                  Of total 4,924 active listings
                </div>
              </div>
            </div>

            {/* Demand vs Supply Visual Balance Indicator */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 font-black">Market Dynamics</span>
                <span className={`text-[11px] font-extrabold ${
                  selectedTier.pctCurrentDemand > selectedTier.pctCurrentInventory
                    ? 'text-amber-700'
                    : selectedTier.pctCurrentDemand < selectedTier.pctCurrentInventory
                      ? 'text-blue-700'
                      : 'text-sky-700'
                }`}>
                  {selectedTier.pctCurrentDemand > selectedTier.pctCurrentInventory
                    ? 'Demand exceeds supply · Advantage Seller'
                    : selectedTier.pctCurrentDemand < selectedTier.pctCurrentInventory
                      ? 'Supply exceeds demand · Advantage Buyer'
                      : 'Supply and demand in parity'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Buyer Demand</span>
                    <span className="font-black text-emerald-600">{selectedTier.pctCurrentDemand}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, selectedTier.pctCurrentDemand * 5)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Available Supply</span>
                    <span className="font-black text-slate-900">{selectedTier.pctCurrentInventory}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-900 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, selectedTier.pctCurrentInventory * 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. VISUAL VELOCITY SPECTRUM (Ranking from Fastest to Slowest — NOT A TABLE) */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-950 tracking-tight font-sans">
              Velocity Spectrum (Fastest to Slowest)
            </h3>
          </div>

          <div className="space-y-2 pt-1">
            {[...page8].sort((a, b) => a.marketTimeDays - b.marketTimeDays).map((tier) => {
              const isSelected = tier.priceRange === selectedTier.priceRange;
              const isSweetSpot = tier.priceRange === '$1.25M - $1.5M';
              const badge = getTierSpeedBadge(tier.speedCategory);
              const barWidth = Math.max(14, Math.min(100, (tier.marketTimeDays / 380) * 100));

              return (
                <button
                  key={tier.priceRange}
                  type="button"
                  onClick={() => setSelectedTierPrice(tier.priceRange)}
                  className={`w-full p-3 sm:p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 sm:gap-4 cursor-pointer group ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-slate-900/30' 
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  {/* Price Tier Label */}
                  <div className="flex items-center gap-2 w-36 sm:w-48 shrink-0">
                    <span className={`text-xs sm:text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {tier.priceRange}
                    </span>
                    {isSweetSpot && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        Sweet Spot
                      </span>
                    )}
                  </div>

                  {/* Relative Velocity Bar */}
                  <div className="flex-1 hidden sm:block">
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isSelected ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isSelected ? 'bg-amber-400' : badge.barColor}`}
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Days & Speed Status */}
                  <div className="flex items-center gap-2.5 shrink-0 text-right">
                    <span className={`text-xs sm:text-sm font-bold tabular-nums ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {tier.marketTimeDays} Days
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      isSelected ? 'bg-slate-800 text-slate-200 border-slate-700' : badge.bg
                    }`}>
                      {tier.speedCategory}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. LUXURY END SNAPSHOT (Page 8 Telemetry) */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-5 sm:p-7 shadow-md border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FA2D48]">
                {luxuryNote.title}
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
                {luxuryNote.subtitle}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                Projected Pending Pace: ~ {luxuryNote.pendingPaceMonth}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Luxury Actives ($2.5M+)</div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{luxuryNote.actives} Homes</div>
              <div className="text-[11px] font-bold text-emerald-400">{luxuryNote.activesDelta} (-3% in 2 wks)</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Luxury Demand ($2.5M+)</div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">{luxuryNote.demand} Escrows</div>
              <div className="text-[11px] font-bold text-rose-400">{luxuryNote.demandDelta} (-3% in 2 wks)</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Expected Market Time</div>
              <div className="text-xl sm:text-2xl font-black text-rose-400 tabular-nums">{luxuryNote.emt} Days</div>
              <div className="text-[11px] font-bold text-slate-400">184d 2 wks ago • 194d last year</div>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Ultra-Luxury ($6M+)</div>
              <div className="text-xl sm:text-2xl font-black text-white tabular-nums">379 Days</div>
              <div className="text-[11px] font-bold text-emerald-400">-75d (from 454d 2 wks ago)</div>
            </div>
          </div>
        </div>

      </div>
        </>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          MINIMALIST MODALS & QUICK REFERENCES
      ────────────────────────────────────────────────────────────────────────── */}

      {/* EXPECTED MARKET TIME RANGES MODAL */}
      {showMarketTimeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setShowMarketTimeModal(false)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150 font-sans text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FA2D48]">Reference Guide</span>
                <h3 className="text-lg font-black text-slate-950 tracking-tight font-sans">
                  Expected Market Time Ranges
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMarketTimeModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 bg-white">
              {[
                { label: "Hot Seller's Market", days: "Under 60 Days", color: "bg-rose-500", desc: "Prices surge, multiple offers common" },
                { label: "Slight Seller's Market", days: "60 – 89 Days", color: "bg-amber-500", desc: "Sellers retain moderate negotiating leverage" },
                { label: "Balanced Market", days: "90 – 119 Days", color: "bg-sky-500", desc: "Equal negotiating power, realistic pricing wins" },
                { label: "Slight Buyer's Market", days: "120 – 149 Days", color: "bg-emerald-500", desc: "Buyers have leverage, price reductions frequent" },
                { label: "Buyer's Market", days: "150+ Days", color: "bg-blue-600", desc: "Significant buyer market, inventory lingers" },
              ].map((range) => (
                <div key={range.label} className="p-3.5 hover:bg-slate-50 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-slate-950 text-sm">
                      <span className={`w-2 h-2 rounded-full ${range.color}`}></span>
                      {range.label}
                    </span>
                    <span className="font-black text-slate-900 text-sm tabular-nums">{range.days}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-4">{range.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowMarketTimeModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORICAL PACE MODAL */}
      {showHistoricalMarketTimeModal && currentCityMarketData && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setShowHistoricalMarketTimeModal(false)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 max-w-sm sm:max-w-md w-full shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150 text-left font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FA2D48]">Historical Velocity</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight font-sans">
                  {currentCity.name} Historical Pace
                </h3>
              </div>
              <button
                onClick={() => setShowHistoricalMarketTimeModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-left font-sans">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">2 Weeks Ago</div>
                <div className="text-2xl font-black text-slate-950">{currentCityMarketData.marketTime2WeeksAgo} Days</div>
                <div className="text-xs font-bold text-slate-600">{getMarketCondition(currentCityMarketData.marketTime2WeeksAgo).label}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">4 Weeks Ago</div>
                <div className="text-2xl font-black text-slate-950">{currentCityMarketData.marketTime4WeeksAgo} Days</div>
                <div className="text-xs font-bold text-slate-600">{getMarketCondition(currentCityMarketData.marketTime4WeeksAgo).label}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">1 Year Ago</div>
                <div className="text-2xl font-black text-slate-950">{currentCityMarketData.marketTime1YearAgo} Days</div>
                <div className="text-xs font-bold text-slate-600">{getMarketCondition(currentCityMarketData.marketTime1YearAgo).label}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">2 Years Ago</div>
                <div className="text-2xl font-black text-slate-950">
                  {currentCityMarketData.marketTime2YearsAgo > 0 ? `${currentCityMarketData.marketTime2YearsAgo} Days` : '—'}
                </div>
                <div className="text-xs font-bold text-slate-600">
                  {currentCityMarketData.marketTime2YearsAgo > 0 ? getMarketCondition(currentCityMarketData.marketTime2YearsAgo).label : 'N/A'}
                </div>
              </div>
            </div>

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

      {/* MARKET DIRECTION MATRIX MODAL */}
      <MarketSpeedStatusModal
        isOpen={showMarketDirectionModal}
        onClose={() => setShowMarketDirectionModal(false)}
        locationName="Orange County"
        emtDays={OC_COUNTYWIDE_LIVE_METRICS.emtDays}
        demand={OC_COUNTYWIDE_LIVE_METRICS.demand}
        supply={OC_COUNTYWIDE_LIVE_METRICS.supply}
        demandDelta={OC_COUNTYWIDE_LIVE_METRICS.demandDelta}
        supplyDelta={OC_COUNTYWIDE_LIVE_METRICS.supplyDelta}
        emtDelta={OC_COUNTYWIDE_LIVE_METRICS.emtDelta}
      />

    </div>
  );
};

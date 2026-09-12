import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Info, 
  X, 
  ChevronRight,
  Clock,
  Tag
} from 'lucide-react';
import {
  OC_HOUSING_REPORT_METADATA,
  OC_HOUSING_SUMMARY_CARDS,
  OC_SOLD_REPORT,
  OC_MARKET_TIME_REPORT
} from '../data/ocHousingReportData';
import { CITIES } from '../data/mockNews';
import { CityInfo } from '../types';

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
  const [activeDirectionTab, setActiveDirectionTab] = useState<string>('speed');
  const [selectedTakeawayCard, setSelectedTakeawayCard] = useState<typeof OC_HOUSING_SUMMARY_CARDS[0] | null>(null);

  const meta = OC_HOUSING_REPORT_METADATA;

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
        marketTime2YearsAgo: 73,
        medianActiveListPrice: "$1.3m",
      };
    }
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = clean(name);
    return OC_MARKET_TIME_REPORT.find(m => {
      const cleanCity = clean(m.city);
      return cleanCity === cleanName || cleanCity.includes(cleanName) || cleanName.includes(cleanCity);
    });
  }, [currentCity?.name, currentCity?.id, meta]);

  const speedDays = currentCity.id !== 'orange-county' && currentCityMarketData
    ? currentCityMarketData.marketTimeDays
    : meta.countywideMarketTime;

  const getMarketCondition = (days: number) => {
    if (days < 60) return { label: "Hot Seller's Market", bgClass: 'bg-[#FA2D48]', textClass: 'text-[#FA2D48]', badgeText: "Hot Seller's Market (< 60 Days)", accentText: 'text-[#FA2D48]' };
    if (days <= 90) return { label: "Slight Seller's Market", bgClass: 'bg-amber-500', textClass: 'text-amber-600', badgeText: "Slight Seller's Market (60 - 90 Days)", accentText: 'text-amber-600' };
    if (days <= 120) return { label: "Balanced Market", bgClass: 'bg-sky-600', textClass: 'text-sky-600', badgeText: "Balanced Market (90 - 120 Days)", accentText: 'text-sky-600' };
    if (days <= 150) return { label: "Slight Buyer's Market", bgClass: 'bg-emerald-600', textClass: 'text-emerald-600', badgeText: "Slight Buyer's Market (120 - 150 Days)", accentText: 'text-emerald-600' };
    return { label: "Buyer's Market", bgClass: 'bg-emerald-700', textClass: 'text-emerald-700', badgeText: "Buyer's Market (150+ Days)", accentText: 'text-emerald-700' };
  };

  const getMarketSpeedBadge = (days: number) => {
    if (days < 60) return { label: "Hot Seller's", color: "bg-[#FA2D48] text-white border-transparent", buttonBg: "bg-[#FA2D48] hover:bg-[#d9233b]" };
    if (days <= 90) return { label: "Slight Seller's", color: "bg-amber-500 text-white border-transparent", buttonBg: "bg-amber-500 hover:bg-amber-600" };
    if (days <= 120) return { label: "Balanced Market", color: "bg-sky-600 text-white border-transparent", buttonBg: "bg-sky-600 hover:bg-sky-700" };
    if (days <= 150) return { label: "Slight Buyer's", color: "bg-emerald-600 text-white border-transparent", buttonBg: "bg-emerald-600 hover:bg-emerald-700" };
    return { label: "Buyer's Market", color: "bg-emerald-700 text-white border-transparent", buttonBg: "bg-emerald-700 hover:bg-emerald-800" };
  };

  const countySpeed = getMarketSpeedBadge(meta.countywideMarketTime);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 font-sans text-slate-900 antialiased">
      
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
              {onSelectCity && (
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
              )}
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

            {currentCity.id !== 'orange-county' && onSelectCity && (
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

        {/* Dynamic Steven Thomas City Report Format — Displayed when a city is selected */}
        {currentCity.id !== 'orange-county' && (currentCityMarketData || currentCitySoldData) && (() => {
          const soldData = currentCitySoldData;
          const marketData = currentCityMarketData;
          const yoyUnitsChange = soldData ? soldData.unitsSold2026 - soldData.unitsSold2025 : 0;

          return (
            <div className="space-y-6 pt-2">
              {/* 1. CURRENT ACTIVE INVENTORY & EXPECTED MARKET TIME */}
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

              {/* 2. CLOSED SALES DATA */}
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

      {/* 2. MARKET DIRECTION TABS / CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-[#FA2D48] rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-black text-black tracking-tight">
              Market Direction
            </h2>
          </div>
        </div>

        {/* 4 Tabs / Cards: 1st Expected Market Time, 2nd Buyer Demand, 3rd Active Inventory, 4th Closed Sales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {OC_HOUSING_SUMMARY_CARDS.map((card) => {
            const isSpeed = card.id === 'speed';
            const isSelected = activeDirectionTab === card.id;

            const speedDays = currentCity.id !== 'orange-county' && currentCityMarketData
              ? currentCityMarketData.marketTimeDays
              : meta.countywideMarketTime;
            const speedCondition = getMarketCondition(speedDays);

            const trendLabel = card.trend2Weeks.split(' in ')[0];
            const isNegative = trendLabel.trim().startsWith('-');

            if (isSpeed) {
              return (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => {
                    setActiveDirectionTab(card.id);
                    setSelectedTakeawayCard(card);
                  }}
                  className={`w-full text-left ${speedCondition.bgClass} text-white rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 relative transition-all cursor-pointer hover:opacity-95 active:scale-[0.99] ${
                    isSelected ? 'ring-3 ring-white/60 shadow-md scale-[1.01]' : 'opacity-95'
                  }`}
                  title="Click to view Expected Market Time takeaways"
                >
                  {/* Card Top Label */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white tracking-tight font-sans flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      {card.title}
                    </span>
                  </div>

                  {/* Card Main Stat */}
                  <div className="space-y-1 my-1">
                    <div className="text-xs font-bold text-white/90 font-sans tracking-wide">
                      {trendLabel}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black font-sans text-white tracking-tight">
                      {speedDays} Days
                    </div>
                    <div className="pt-0.5">
                      <span className="bg-white text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md inline-block shadow-2xs font-sans">
                        {speedCondition.badgeText}
                      </span>
                    </div>
                  </div>

                  {/* Comparison: Last Year */}
                  <div className="pt-3 border-t border-white/25 space-y-1 text-xs font-sans text-white/95">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white/80">
                        Last Year Comp:
                      </span>
                      <span className="font-bold text-white">
                        {card.compLastYear}
                      </span>
                    </div>
                  </div>
                </button>
              );
            }

            return (
              <button
                type="button"
                key={card.id}
                onClick={() => {
                  setActiveDirectionTab(card.id);
                  setSelectedTakeawayCard(card);
                }}
                className={`w-full text-left bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between space-y-3 relative transition-all cursor-pointer hover:border-slate-300 active:scale-[0.99] ${
                  isSelected
                    ? 'border-[#FA2D48]/60 ring-2 ring-[#FA2D48]/30 shadow-xs'
                    : 'border-slate-200/90'
                }`}
                title={`Click to view ${card.title} takeaways`}
              >
                {/* Card Top Label & 2-Week Trend */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#FA2D48] tracking-tight font-sans flex items-center gap-1.5">
                    {card.title}
                  </span>

                  <span className="inline-flex items-center text-[11px] font-bold font-sans">
                    {isNegative ? (
                      <ArrowDownRight className="w-3.5 h-3.5 inline mr-0.5 text-[#FA2D48]" />
                    ) : (
                      <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5 text-emerald-600" />
                    )}
                    <span className={isNegative ? 'text-[#FA2D48]' : 'text-emerald-600'}>
                      {trendLabel}
                    </span>
                  </span>
                </div>

                {/* Card Main Stat */}
                <div className="space-y-0.5 my-1">
                  <div className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-950 tracking-tight">
                    {card.currentStat}
                  </div>
                  <div className="text-xs font-bold font-sans text-emerald-600">
                    {card.unit}
                  </div>
                </div>

                {/* Comparison: Last Year */}
                <div className="pt-3 border-t border-slate-100 space-y-1 text-xs font-sans">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-500">
                      Last Year Comp:
                    </span>
                    <span className="font-bold text-slate-900">
                      {card.compLastYear}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MINIMALISTIC TAKEAWAYS MODAL */}
      {selectedTakeawayCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setSelectedTakeawayCard(null)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150 font-sans text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FA2D48]"></span>
                <h3 className="text-base sm:text-lg font-black text-slate-950 tracking-tight">
                  {selectedTakeawayCard.id === 'closed' ? `${selectedTakeawayCard.title} Closed Sales` : selectedTakeawayCard.title} Takeaways
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTakeawayCard(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Takeaways Only */}
            <div className="space-y-3 py-1">
              {selectedTakeawayCard.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FA2D48] mt-2 shrink-0"></span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>

            {/* Minimal Close Button */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTakeawayCard(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARKET TIME RANGES QUICK REFERENCE MODAL */}
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

    </div>
  );
};

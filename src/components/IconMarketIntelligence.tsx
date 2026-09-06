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

  const meta = OC_HOUSING_REPORT_METADATA;

  const currentCitySoldData = useMemo(() => {
    const name = currentCity?.name?.toLowerCase().trim() || '';
    if (name === 'orange county' || name === 'all of o.c.') return null;
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = clean(name);
    return OC_SOLD_REPORT.find(s => {
      const cleanCity = clean(s.city);
      return cleanCity === cleanName || cleanCity.includes(cleanName) || cleanName.includes(cleanCity);
    });
  }, [currentCity?.name]);

  const currentCityMarketData = useMemo(() => {
    const name = currentCity?.name?.toLowerCase().trim() || '';
    if (name === 'orange county' || name === 'all of o.c.') return null;
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanName = clean(name);
    return OC_MARKET_TIME_REPORT.find(m => {
      const cleanCity = clean(m.city);
      return cleanCity === cleanName || cleanCity.includes(cleanName) || cleanName.includes(cleanCity);
    });
  }, [currentCity?.name]);

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
            {currentCity.id === 'orange-county' && (
              <button
                onClick={() => setShowMarketTimeModal(true)}
                className={`group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black ${countySpeed.buttonBg} text-white shadow-xs tracking-wide transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`}
                title="Click to view Expected Market Time ranges table"
              >
                <span>{meta.countywideMarketTime} Days • {countySpeed.label}</span>
                <Info className="w-3.5 h-3.5 text-white/90 group-hover:text-white transition-colors" />
              </button>
            )}

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
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-sans flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-[#FA2D48]" />
                      <span>Market Velocity & Expected Pace</span>
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
                          <div className="w-full space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white font-sans">
                                Days on Market
                              </span>
                              <span className="text-xs font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs shrink-0">
                                July Closed
                              </span>
                            </div>
                            <div className="text-xs sm:text-sm font-bold text-white tracking-normal">
                              Time to Sell Once Properly Priced
                            </div>
                          </div>

                          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                            {closedDays > 0 ? `${closedDays} Days` : '—'}
                          </div>

                          <div className="pt-1">
                            <span className="bg-white text-blue-950 font-black text-xs px-2.5 py-1 rounded-lg inline-block shadow-xs font-sans">
                              Closed Escrows
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

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

              {/* 2. JULY CLOSED SALES DATA */}
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

                  <div className="pt-1">
                    <div className="bg-slate-50/70 rounded-2xl py-2.5 px-4 flex items-center justify-between text-xs border border-slate-200/60">
                      <span className="font-bold text-black">Price Range (Low to High):</span>
                      <span className="font-sans font-bold text-black">{soldData.lowPrice} - {soldData.highPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* 2. HOUSING VITAL SIGNS CARDS WITH LAST YEAR COMPARISONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg sm:text-xl font-black text-black tracking-tight">
            Countywide Housing Vital Signs
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Orange County Benchmark Data
          </span>
        </div>

        {/* 6 Grid Cards with Comp from Last Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {OC_HOUSING_SUMMARY_CARDS.map((card) => {
            const trendLabel = card.trend2Weeks.split(' in ')[0];
            const isNegative = trendLabel.trim().startsWith('-');

            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-3 relative transition-all"
              >
                {/* Card Top Label & 2-Week Trend */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#FA2D48] tracking-tight font-sans">
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
                    {card.id === 'closed' ? `${card.unit} • 99.5% Sale-to-List Ratio` : card.unit}
                  </div>
                </div>

                {/* Comparison: Last Year */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-sans">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-500">
                      Last Year Comp:
                    </span>
                    <span className="font-bold text-slate-900">
                      {card.compLastYear}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MARKET TIME RANGES QUICK REFERENCE MODAL */}
      {showMarketTimeModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setShowMarketTimeModal(false)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-150 font-sans text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <h3 className="text-xl sm:text-2xl font-black font-sans text-slate-950 tracking-tight">
                Expected Market Time Ranges
              </h3>
              <button
                onClick={() => setShowMarketTimeModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ranges Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-600 font-sans font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-sans">Speed (Days)</th>
                    <th className="py-3 px-4 font-sans">Market Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-extrabold text-sm text-slate-900">&lt; 60 Days</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans bg-[#FA2D48] text-white shadow-xs">
                        Hot Seller's Market
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-extrabold text-sm text-slate-900">60 – 89 Days</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans bg-amber-500 text-white shadow-xs">
                        Slight Seller's Market
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-sky-50/70 hover:bg-sky-50/90 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-black text-sm text-sky-950 flex items-center gap-2">
                      <span>90 – 119 Days</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FA2D48] text-white text-[10px] font-sans font-black shadow-2xs">
                        Current OC (99d)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans bg-sky-600 text-white shadow-xs">
                        Balanced Market
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-extrabold text-sm text-slate-900">120 – 149 Days</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans bg-emerald-600 text-white shadow-xs">
                        Slight Buyer's Market
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-sans font-extrabold text-sm text-slate-900">150+ Days</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans bg-emerald-700 text-white shadow-xs">
                        Buyer's Market
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Close action */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowMarketTimeModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-sans transition-all cursor-pointer shadow-xs"
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

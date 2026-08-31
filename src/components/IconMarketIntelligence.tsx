import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Info,
  X,
  ChevronRight
} from 'lucide-react';
import {
  OC_HOUSING_REPORT_METADATA,
  OC_HOUSING_SUMMARY_CARDS
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

  const meta = OC_HOUSING_REPORT_METADATA;

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
      
      {/* 1. REPORT HEADER BANNER */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600">
                <Calendar className="w-3 h-3 text-slate-500" />
                Steven Thomas Report • {meta.reportDate}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight text-slate-950 leading-tight">
                Select City
              </h1>

              {/* Direct Dropdown City Selector */}
              {onSelectCity && (
                <div className="relative">
                  <select
                    value={currentCity?.id || 'orange-county'}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = CITIES.find(c => c.id === val);
                      if (matched) {
                        onSelectCity(matched);
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

          <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0">
            <button
              onClick={() => setShowMarketTimeModal(true)}
              className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-black ${countySpeed.buttonBg} text-white shadow-xs tracking-wide transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`}
              title="Click to view Expected Market Time ranges table"
            >
              <span>{meta.countywideMarketTime} Days • {countySpeed.label}</span>
              <Info className="w-3.5 h-3.5 text-white/90 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. HOUSING VITAL SIGNS CARDS WITH LAST YEAR COMPARISONS */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <h2 className="text-lg sm:text-xl font-black text-black tracking-tight">
            Housing Vital Signs
          </h2>
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
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-950 tracking-tight">
                  Expected Market Time Ranges
                </h3>
              </div>
              <button
                onClick={() => setShowMarketTimeModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ranges Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-mono font-black uppercase tracking-wider">
                    <th className="py-3 px-4">Market Time (Days)</th>
                    <th className="py-3 px-4">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">&lt; 60 Days</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-[#FA2D48] text-white shadow-xs">
                        Hot Seller's Market
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">60 – 89 Days</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
                        Slight Seller's Market
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-sky-50/60 hover:bg-sky-50/90 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-sky-950 flex items-center gap-2">
                      <span>90 – 119 Days</span>
                      <span className="px-1.5 py-0.5 rounded-sm bg-[#FA2D48] text-white text-[9px] font-mono font-black">
                        Current OC (99d)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-sky-600 text-white shadow-xs">
                        Balanced Market
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">120 – 149 Days</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                        Slight Buyer's Market
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">150+ Days</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-700 text-white shadow-xs">
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
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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

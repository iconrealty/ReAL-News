import React, { useState } from 'react';
import { 
  Calendar, 
  X, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Tag, 
  Building, 
  ShieldCheck, 
  Sparkles, 
  LayoutGrid, 
  List,
  CheckCircle2
} from 'lucide-react';
import { 
  OC_HOUSING_REPORT_METADATA, 
  OC_PAGE_9_HOUSING_SUMMARY 
} from '../data/ocHousingReportData';

interface HousingSummarySectionProps {
  className?: string;
  showHeader?: boolean;
}

export const HousingSummarySection: React.FC<HousingSummarySectionProps> = ({
  className = '',
  showHeader = true,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<typeof OC_PAGE_9_HOUSING_SUMMARY.pillars[0] | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const meta = OC_HOUSING_REPORT_METADATA;
  const page9 = OC_PAGE_9_HOUSING_SUMMARY;

  const getPillarTheme = (id: string) => {
    switch (id) {
      case 'inventory':
        return {
          titleColor: 'text-sky-700',
          statColor: 'text-slate-950',
          accentBg: 'bg-sky-50',
          accentBorder: 'border-sky-200',
          icon: Building,
          badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
        };
      case 'demand':
        return {
          titleColor: 'text-emerald-700',
          statColor: 'text-emerald-600',
          accentBg: 'bg-emerald-50',
          accentBorder: 'border-emerald-200',
          icon: TrendingDown,
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'market-time':
        return {
          titleColor: 'text-amber-700',
          statColor: 'text-amber-600',
          accentBg: 'bg-amber-50',
          accentBorder: 'border-amber-200',
          icon: Clock,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'luxury':
        return {
          titleColor: 'text-blue-700',
          statColor: 'text-blue-700',
          accentBg: 'bg-blue-50',
          accentBorder: 'border-blue-200',
          icon: Sparkles,
          badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'distressed':
        return {
          titleColor: 'text-rose-700',
          statColor: 'text-rose-600',
          accentBg: 'bg-rose-50',
          accentBorder: 'border-rose-200',
          icon: ShieldCheck,
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'closed-sales':
        return {
          titleColor: 'text-teal-700',
          statColor: 'text-teal-600',
          accentBg: 'bg-teal-50',
          accentBorder: 'border-teal-200',
          icon: Home,
          badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
        };
      case 'median-list-price':
        return {
          titleColor: 'text-indigo-700',
          statColor: 'text-indigo-600',
          accentBg: 'bg-indigo-50',
          accentBorder: 'border-indigo-200',
          icon: Tag,
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        };
      case 'median-dom':
        return {
          titleColor: 'text-violet-700',
          statColor: 'text-violet-600',
          accentBg: 'bg-violet-50',
          accentBorder: 'border-violet-200',
          icon: Clock,
          badgeColor: 'bg-violet-50 text-violet-800 border-violet-200',
        };
      case 'median-price-sqft':
        return {
          titleColor: 'text-[#FA2D48]',
          statColor: 'text-[#FA2D48]',
          accentBg: 'bg-rose-50',
          accentBorder: 'border-rose-200',
          icon: TrendingUp,
          badgeColor: 'bg-rose-50 text-[#FA2D48] border-rose-200',
        };
      default:
        return {
          titleColor: 'text-slate-800',
          statColor: 'text-slate-950',
          accentBg: 'bg-slate-50',
          accentBorder: 'border-slate-200',
          icon: Home,
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {/* Section Header with View Mode Switch */}
      {showHeader && (
        <div className="px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-slate-950">
                Housing Market Summary
              </h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs font-sans shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#FA2D48]" />
                <span>Report Date: {meta.reportDate}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Official Steven Thomas bi-weekly market intelligence across Orange County.
            </p>
          </div>

          {/* Clean View Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
              title="Overview Cards view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
              title="Clear Minimalist List view"
            >
              <List className="w-3.5 h-3.5" />
              <span>Clear List</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: CLEAN INFORMATIVE DASHBOARD CARDS (All facts visible at a glance, not empty tabs) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {page9.pillars.map((pillar) => {
            const theme = getPillarTheme(pillar.id);
            const IconComponent = theme.icon;

            return (
              <div
                key={pillar.id}
                onClick={() => setSelectedPillar(pillar)}
                className="w-full text-left rounded-3xl bg-white border border-slate-200/90 p-5 hover:border-slate-400 hover:shadow-xs transition-all font-sans cursor-pointer flex flex-col justify-between space-y-4 group relative"
                title={`Click for full ${pillar.title} breakdown`}
              >
                {/* Card Top Header: Category & Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg ${theme.accentBg} flex items-center justify-center shrink-0`}>
                      <IconComponent className={`w-3.5 h-3.5 ${theme.titleColor}`} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-wider ${theme.titleColor}`}>
                      {pillar.title}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${theme.badgeColor}`}>
                    {pillar.badge}
                  </span>
                </div>

                {/* Primary Number & Unit */}
                <div className="space-y-0.5">
                  <div className={`text-3xl sm:text-4xl font-black tracking-tight tabular-nums ${theme.statColor}`}>
                    {pillar.stat}
                  </div>
                  <div className="text-xs font-bold text-slate-600">
                    {pillar.unit}
                  </div>
                </div>

                {/* Key Context & Comparisons (Immediately visible without clicking!) */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">2-Wk Delta</div>
                    <div className="font-extrabold text-slate-900 tabular-nums truncate pt-0.5">{pillar.delta2Wks}</div>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Year (YoY)</div>
                    <div className="font-extrabold text-slate-900 tabular-nums truncate pt-0.5">{pillar.deltaYoY}</div>
                  </div>
                </div>

                {/* Key Takeaway Footnote */}
                <div className="text-[11px] text-slate-600 font-semibold flex items-center justify-between pt-0.5">
                  <span className="truncate">
                    <span className="text-slate-500 font-normal">{pillar.metricLabel1}:</span> {pillar.metricValue1}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-900 shrink-0 pl-1.5 transition-colors">
                    Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: SLEEK CONTINUOUS MINIMALIST LIST (Bloomberg / Apple Stocks style, zero tab-switching) */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-slate-50/50">
            <div>
              <h3 className="text-base font-black text-slate-950">Executive Market Telemetry</h3>
              <p className="text-xs text-slate-500 font-medium">All 9 vital benchmarks in a single scannable list</p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
              9 Verified Indicators
            </span>
          </div>

          <div className="divide-y divide-slate-100 font-sans">
            {page9.pillars.map((pillar) => {
              const theme = getPillarTheme(pillar.id);

              return (
                <div
                  key={pillar.id}
                  onClick={() => setSelectedPillar(pillar)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer group"
                >
                  {/* Left: Metric Title & Unit */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className={`w-2.5 h-2.5 rounded-full ${theme.accentBg} ${theme.accentBorder} border shrink-0`} />
                    <div>
                      <div className={`text-xs font-black uppercase tracking-wider ${theme.titleColor}`}>
                        {pillar.title}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {pillar.unit}
                      </div>
                    </div>
                  </div>

                  {/* Center: Big Value & Badge */}
                  <div className="flex items-center gap-3 md:justify-center">
                    <span className={`text-2xl sm:text-3xl font-black tabular-nums ${theme.statColor}`}>
                      {pillar.stat}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${theme.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Right: Inline Velocity & YoY Deltas */}
                  <div className="flex items-center justify-between md:justify-end gap-4 text-xs font-sans">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">2-Week Pace</div>
                      <div className="font-extrabold text-slate-900 tabular-nums">{pillar.delta2Wks}</div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">YoY Comparison</div>
                      <div className="font-extrabold text-slate-900 tabular-nums">{pillar.deltaYoY}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HOUSING SUMMARY PILLAR BREAKDOWN MODAL (Minimalistic List) */}
      {selectedPillar && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setSelectedPillar(null)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150 text-left font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                {selectedPillar.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPillar(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Primary Stat Highlight */}
            <div className="flex items-baseline justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-sans tabular-nums">
                  {selectedPillar.stat}
                </span>
                <span className="text-sm font-semibold text-slate-500 font-sans">
                  {selectedPillar.unit}
                </span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase font-sans border ${
                selectedPillar.badgeType === 'negative'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : selectedPillar.badgeType === 'warning'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : selectedPillar.badgeType === 'positive'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {selectedPillar.badge}
              </span>
            </div>

            {/* Clear Minimalistic List */}
            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">2-Week Velocity</span>
                <span className={`font-bold tabular-nums text-right ${
                  selectedPillar.badgeType === 'negative' ? 'text-rose-600' : selectedPillar.badgeType === 'warning' ? 'text-amber-700' : selectedPillar.badgeType === 'positive' ? 'text-emerald-700' : 'text-slate-900'
                }`}>
                  {selectedPillar.delta2Wks}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Year (YoY)</span>
                <span className="font-bold text-slate-900 tabular-nums text-right">{selectedPillar.deltaYoY}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{selectedPillar.metricLabel1}</span>
                <span className="font-bold text-slate-900 tabular-nums text-right">{selectedPillar.metricValue1}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{selectedPillar.metricLabel2}</span>
                <span className="font-bold text-slate-900 tabular-nums text-right">{selectedPillar.metricValue2}</span>
              </div>

              {selectedPillar.compPreCovid && (
                <div className="py-2.5 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pre-COVID Benchmark</span>
                  <span className="font-bold text-slate-900 tabular-nums text-right">{selectedPillar.compPreCovid}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPillar(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer shadow-xs"
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

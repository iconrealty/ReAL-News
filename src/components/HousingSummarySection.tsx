import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
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

  const meta = OC_HOUSING_REPORT_METADATA;
  const page9 = OC_PAGE_9_HOUSING_SUMMARY;

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {/* Section Header */}
      {showHeader && (
        <div className="px-1 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight text-slate-900">
            Housing Summary
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/90 text-slate-700 font-bold text-xs font-sans shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#FA2D48]" />
            <span>Report Date: {meta.reportDate}</span>
          </span>
        </div>
      )}

      {/* 6 Minimalist Metric Pillar Cards — Dynamic Color Identity per Metric */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {page9.pillars.map((pillar) => {
          const theme = (() => {
            switch (pillar.id) {
              case 'inventory':
                return {
                  titleColor: 'text-sky-700',
                  statColor: 'text-slate-950',
                  unitColor: 'text-slate-700',
                };
              case 'demand':
                return {
                  titleColor: 'text-emerald-600',
                  statColor: 'text-emerald-600',
                  unitColor: 'text-slate-700',
                };
              case 'market-time':
                return {
                  titleColor: 'text-amber-600',
                  statColor: 'text-amber-600',
                  unitColor: 'text-slate-700',
                };
              case 'luxury':
                return {
                  titleColor: 'text-blue-700',
                  statColor: 'text-blue-700',
                  unitColor: 'text-slate-700',
                };
              case 'distressed':
                return {
                  titleColor: 'text-rose-600',
                  statColor: 'text-rose-600',
                  unitColor: 'text-slate-700',
                };
              case 'closed-sales':
                return {
                  titleColor: 'text-teal-600',
                  statColor: 'text-teal-600',
                  unitColor: 'text-slate-700',
                };
              default:
                return {
                  titleColor: 'text-slate-800',
                  statColor: 'text-slate-950',
                  unitColor: 'text-slate-700',
                };
            }
          })();

          return (
            <button
              type="button"
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar)}
              className="w-full text-left rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 hover:border-slate-400 hover:shadow-xs transition-all font-sans group cursor-pointer active:scale-[0.99] flex flex-col justify-between space-y-2.5"
              title={`Click to view ${pillar.title} breakdown`}
            >
              {/* Colored Title */}
              <div className={`text-xs font-black uppercase tracking-wider ${theme.titleColor}`}>
                {pillar.title}
              </div>

              {/* Number & Highly Readable Colored Description */}
              <div className="space-y-0.5">
                <div className={`text-2xl sm:text-3xl font-black tracking-tight tabular-nums ${theme.statColor}`}>
                  {pillar.stat}
                </div>
                <div className={`text-xs sm:text-sm font-bold ${theme.unitColor}`}>
                  {pillar.unit}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* HOUSING SUMMARY PILLAR BREAKDOWN MODAL */}
      {selectedPillar && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setSelectedPillar(null)}
        >
          <div 
            className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative animate-in zoom-in-95 duration-150 text-left font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
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

            {/* Primary Stat Highlight Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans tabular-nums">
                  {selectedPillar.stat}
                </div>
                <div className="text-xs font-medium text-slate-500 font-sans">
                  {selectedPillar.unit}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase font-sans border ${
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

            {/* 4 Clear Sub-Metrics */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. 2-Week Velocity */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">
                    2-Week Velocity
                  </div>
                  <div className={`text-base sm:text-lg font-bold tabular-nums font-sans ${
                    selectedPillar.badgeType === 'negative' ? 'text-rose-600' : selectedPillar.badgeType === 'warning' ? 'text-amber-700' : selectedPillar.badgeType === 'positive' ? 'text-emerald-700' : 'text-slate-800'
                  }`}>
                    {selectedPillar.delta2Wks}
                  </div>
                </div>

                {/* 2. Last Year Comparison */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">
                    Last Year (YoY)
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 tabular-nums font-sans">
                    {selectedPillar.deltaYoY}
                  </div>
                </div>

                {/* 3. Metric 1 */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">
                    {selectedPillar.metricLabel1}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 tabular-nums font-sans">
                    {selectedPillar.metricValue1}
                  </div>
                </div>

                {/* 4. Metric 2 */}
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 font-sans">
                    {selectedPillar.metricLabel2}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 tabular-nums font-sans">
                    {selectedPillar.metricValue2}
                  </div>
                </div>
              </div>

              {/* Pre-COVID Benchmark if available */}
              {selectedPillar.compPreCovid && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-600 uppercase text-[11px] tracking-wide">Pre-COVID Benchmark:</span>
                  <span className="font-bold text-slate-800">{selectedPillar.compPreCovid}</span>
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
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp } from 'lucide-react';
import {
  OC_FAST_METADATA,
  OC_FAST_ATTACHED_METRICS,
  OC_FAST_DETACHED_METRICS,
} from '../data/ocFastReportData';

interface OCFastTopOverviewProps {
  onViewFullReport?: () => void;
  title?: string;
  showExploreButton?: boolean;
}

export const OCFastTopOverview: React.FC<OCFastTopOverviewProps> = ({
  onViewFullReport,
  title = "Orange County Local Market Update",
  showExploreButton = true,
}) => {
  const [propertyType, setPropertyType] = useState<'detached' | 'attached'>('detached');

  const attachedData = OC_FAST_ATTACHED_METRICS;
  const detachedData = OC_FAST_DETACHED_METRICS;

  const domMetric = propertyType === 'detached' 
    ? detachedData.find(m => m.key === 'dom')! 
    : attachedData.find(m => m.key === 'dom')!;

  const supplyMetric = propertyType === 'detached'
    ? detachedData.find(m => m.key === 'months_supply')!
    : attachedData.find(m => m.key === 'months_supply')!;

  const origPriceMetric = propertyType === 'detached'
    ? detachedData.find(m => m.key === 'pct_orig_price')!
    : attachedData.find(m => m.key === 'pct_orig_price')!;

  const sqftMetric = propertyType === 'detached'
    ? detachedData.find(m => m.key === 'price_sqft')!
    : attachedData.find(m => m.key === 'price_sqft')!;

  // Helper for change badge / mini-pill styling
  const renderChangeBadge = (changeStr: string, numericVal?: number, invertGoodBad = false) => {
    if (!changeStr || changeStr === '—') return <span className="text-slate-400 font-mono text-xs">—</span>;
    
    const isPositive = changeStr.startsWith('+') || (numericVal !== undefined && numericVal > 0);
    const isZero = changeStr === '0.0%' || changeStr === '0%' || numericVal === 0;
    
    let bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
    let textIcon = <ArrowUpRight className="w-3 h-3 text-emerald-600 inline mr-0.5" />;

    if (isZero) {
      bgClass = "bg-slate-100 text-slate-700 border-slate-200";
      textIcon = null;
    } else if (invertGoodBad ? isPositive : !isPositive) {
      bgClass = "bg-rose-50 text-[#FA2D48] border-rose-200";
      textIcon = <ArrowDownRight className="w-3 h-3 text-[#FA2D48] inline mr-0.5" />;
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black border font-mono shrink-0 ${bgClass}`}>
        {textIcon}
        {changeStr}
      </span>
    );
  };

  return (
    <section className="space-y-4 font-sans">
      {/* Orange County Local Market Update Header Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 border border-rose-200/80 rounded-full text-xs font-sans font-bold text-[#FA2D48]">
                <Activity className="w-3.5 h-3.5" />
                <span>{OC_FAST_METADATA.reportName} • {OC_FAST_METADATA.reportSubtitle}</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600">
                Current as of {OC_FAST_METADATA.currentAsOf}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight text-slate-950 leading-tight">
              {title}
            </h2>
            
            <p className="text-slate-700 text-xs sm:text-sm max-w-2xl font-sans font-medium leading-relaxed">
              Provided by Orange County REALTORS • Benchmark Key Performance Indicators
            </p>
          </div>

          {/* Right side controls: Red Detached / Attached Switcher + Full OC Report Button */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
              <button
                onClick={() => setPropertyType('detached')}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  propertyType === 'detached'
                    ? 'bg-[#FA2D48] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Detached Homes
              </button>
              <button
                onClick={() => setPropertyType('attached')}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  propertyType === 'attached'
                    ? 'bg-[#FA2D48] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Attached Condos
              </button>
            </div>

            {/* Full OC Report button directly next to switcher */}
            {showExploreButton && onViewFullReport && (
              <button
                onClick={onViewFullReport}
                className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-[#FA2D48] text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer shrink-0 border border-slate-800"
              >
                <span>Full OC Report</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Metric Cards for Top Market Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Days on Market */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans uppercase tracking-widest text-slate-500 font-extrabold">Days on Market</span>
              {renderChangeBadge(domMetric.monthlyChange, domMetric.monthlyChangeNumeric, true)}
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-950 font-sans">
              {domMetric.july2026}{' '}
              <span className="text-sm font-bold text-slate-500">days</span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <span className="text-slate-500 font-medium">July 2025:</span>
              <span className="font-bold text-slate-900 font-mono">{domMetric.july2025} days</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-[11px] font-medium">
                {propertyType === 'detached' ? 'Detached SFH' : 'Attached Condos'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>YTD Velocity:</span>
            <span className="font-bold text-slate-900 font-mono">
              {domMetric.ytd2026} days ({domMetric.ytdChange} YoY)
            </span>
          </div>
        </div>

        {/* Card 2: Months Supply of Inventory */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans uppercase tracking-widest text-slate-500 font-extrabold">Months of Supply</span>
              {renderChangeBadge(supplyMetric.monthlyChange, supplyMetric.monthlyChangeNumeric, true)}
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-950 font-sans">
              {supplyMetric.july2026}{' '}
              <span className="text-sm font-bold text-slate-500">mos</span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <span className="text-slate-500 font-medium">July 2025:</span>
              <span className="font-bold text-slate-900 font-mono">{supplyMetric.july2025} mos</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-[11px] font-medium">
                {propertyType === 'detached' ? 'Detached SFH' : 'Attached Condos'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Market Condition:</span>
            {propertyType === 'detached' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-[#FA2D48] border border-rose-200">
                Hot Seller's Market (&lt; 3.0 mos)
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                Slight Seller's Market (3.4 mos)
              </span>
            )}
          </div>
        </div>

        {/* Card 3: % of Original List Price Received */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans uppercase tracking-widest text-slate-500 font-extrabold">% Orig. List Price</span>
              {renderChangeBadge(origPriceMetric.monthlyChange, origPriceMetric.monthlyChangeNumeric)}
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-950 font-sans">
              {origPriceMetric.july2026}
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <span className="text-slate-500 font-medium">July 2025:</span>
              <span className="font-bold text-slate-900 font-mono">{origPriceMetric.july2025}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-[11px] font-medium">
                {propertyType === 'detached' ? 'Detached SFH' : 'Attached Condos'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>YTD Realization:</span>
            <span className="font-bold text-slate-900 font-mono">
              {origPriceMetric.ytd2026} ({origPriceMetric.ytdChange} YoY)
            </span>
          </div>
        </div>

        {/* Card 4: Price Per Square Foot */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans uppercase tracking-widest text-slate-500 font-extrabold">Price Per Sq. Ft.</span>
              {sqftMetric && renderChangeBadge(sqftMetric.monthlyChange, sqftMetric.monthlyChangeNumeric)}
            </div>

            <div className="text-3xl sm:text-4xl font-black text-slate-950 font-sans">
              {sqftMetric?.july2026 || '$734.97'}{' '}
              <span className="text-sm font-bold text-slate-500">/sqft</span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-600">
              <span className="text-slate-500 font-medium">July 2025:</span>
              <span className="font-bold text-slate-900 font-mono">{sqftMetric?.july2025 || '$715.00'}/sqft</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-[11px] font-medium">
                {propertyType === 'detached' ? 'Detached SFH' : 'Attached Condos'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>YTD Average:</span>
            <span className="font-bold text-slate-900 font-mono">
              {sqftMetric?.ytd2026 || '$733.86'} ({sqftMetric?.ytdChange || '+1.5%'} YoY)
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

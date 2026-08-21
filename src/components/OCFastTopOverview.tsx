import React, { useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, ChevronRight, TrendingUp, Home, Building2, Layers } from 'lucide-react';
import {
  OC_FAST_METADATA,
  OC_FAST_PAGE_1_DATA,
  OC_FAST_ATTACHED_METRICS,
  OC_FAST_DETACHED_METRICS,
  OC_FAST_ALL_PROPERTIES_METRICS,
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
  const [propertyType, setPropertyType] = useState<'all' | 'detached' | 'attached'>('all');

  const attachedData = OC_FAST_ATTACHED_METRICS;
  const detachedData = OC_FAST_DETACHED_METRICS;
  const allData = OC_FAST_ALL_PROPERTIES_METRICS;

  const currentDataset = propertyType === 'all'
    ? allData
    : propertyType === 'detached'
      ? detachedData
      : attachedData;

  const domMetric = currentDataset.find(m => m.key === 'dom')!;
  const supplyMetric = currentDataset.find(m => m.key === 'months_supply')!;
  const origPriceMetric = currentDataset.find(m => m.key === 'pct_orig_price')!;
  const sqftMetric = currentDataset.find(m => m.key === 'price_sqft')!;

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
              Provided by Orange County REALTORS
            </p>
          </div>

          {/* Right side controls: Clean Red All Properties / Detached / Attached Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => setPropertyType('all')}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                propertyType === 'all'
                  ? 'bg-[#FA2D48] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Properties</span>
            </button>
            <button
              onClick={() => setPropertyType('detached')}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                propertyType === 'detached'
                  ? 'bg-[#FA2D48] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Detached Homes</span>
            </button>
            <button
              onClick={() => setPropertyType('attached')}
              className={`px-3.5 py-2 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                propertyType === 'attached'
                  ? 'bg-[#FA2D48] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Attached Condos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Page 1 Monthly Indicators Snapshot Tabs (Side by Side 3 Tabs matching Report Page 1) */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 px-1">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tighter text-[#FA2D48] leading-none">
            Monthly Snapshot
          </h2>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 hidden sm:inline">
            Click a tab to switch property filter
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {OC_FAST_PAGE_1_DATA.snapshot.map((snap) => {
            const isSelected = propertyType === snap.propertyCategory;
            const isPositive = snap.type === 'positive';
            return (
              <button
                key={snap.id}
                type="button"
                onClick={() => setPropertyType(snap.propertyCategory)}
                className={`text-left p-3 sm:p-4 md:p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs relative flex flex-col justify-between space-y-2.5 sm:space-y-3 ${
                  isSelected
                    ? 'bg-white border-[#FA2D48] shadow-md scale-[1.01]'
                    : 'bg-white border-slate-200/90 hover:bg-slate-50/60 hover:border-black hover:shadow-xs'
                }`}
              >
                {/* Top: Property Type Badge & Label */}
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[9px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border truncate ${
                    isSelected
                      ? 'bg-[#FA2D48] text-white border-[#FA2D48]'
                      : 'bg-slate-100 text-slate-800 border-slate-200/90'
                  }`}>
                    {snap.propertyType}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate hidden sm:inline">
                    YoY Change
                  </span>
                </div>

                {/* Middle: BIG Hero Percentage */}
                <div className="flex items-center space-x-1 sm:space-x-1.5 my-0.5">
                  {isPositive ? (
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-600 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-rose-600 shrink-0" />
                  )}
                  <span className={`text-xl sm:text-3xl md:text-4xl font-black font-sans tracking-tight leading-none ${
                    isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {snap.change}
                  </span>
                </div>

                {/* Bottom Row: Median Sales Price & Value */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-baseline justify-between gap-0.5 sm:gap-2">
                  <div className="min-w-0">
                    <span className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 block truncate">
                      Median Price
                    </span>
                    <span className="text-xs sm:text-base md:text-lg font-black text-slate-950 font-sans tracking-tight block">
                      {snap.value}
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-medium text-slate-400 font-mono shrink-0">
                    {snap.subtext.replace('July 2025: ', 'Prior: ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Combined Tab: All Properties OC Key Velocity & Pricing Indicators */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            <span className="text-sm font-black uppercase tracking-wider text-black font-sans">
              {propertyType === 'all'
                ? 'Combined Market Indicators • All Properties OC'
                : propertyType === 'detached'
                  ? 'Detached Single-Family Market Indicators'
                  : 'Attached Condominiums Market Indicators'}
            </span>
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#FA2D48] text-white shadow-xs">
              {propertyType === 'all' ? 'Combined (All Properties)' : propertyType === 'detached' ? 'Detached SFH' : 'Attached Condos'}
            </span>
          </div>

          {/* Quick tab switcher inside the container */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
            <button
              onClick={() => setPropertyType('all')}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer border ${
                propertyType === 'all'
                  ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs'
                  : 'bg-transparent text-slate-700 border-transparent hover:text-black hover:border-black hover:bg-white'
              }`}
            >
              Combined (All)
            </button>
            <button
              onClick={() => setPropertyType('detached')}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer border ${
                propertyType === 'detached'
                  ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs'
                  : 'bg-transparent text-slate-700 border-transparent hover:text-black hover:border-black hover:bg-white'
              }`}
            >
              Detached
            </button>
            <button
              onClick={() => setPropertyType('attached')}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer border ${
                propertyType === 'attached'
                  ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs'
                  : 'bg-transparent text-slate-700 border-transparent hover:text-black hover:border-black hover:bg-white'
              }`}
            >
              Attached
            </button>
          </div>
        </div>

        {/* 4 Metric Cards inside the Combined Tab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Days on Market */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-widest text-black font-black">Days on Market</span>
                {renderChangeBadge(domMetric.monthlyChange, domMetric.monthlyChangeNumeric, true)}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-sans">
                {domMetric.july2026}{' '}
                <span className="text-sm font-bold text-emerald-700/80">days</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <span className="text-slate-500 font-medium">July 2025:</span>
                <span className="font-bold text-slate-900 font-mono">{domMetric.july2025} days</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="text-black font-bold">YTD Velocity:</span>
              <span className="font-bold text-slate-900 font-mono">
                {domMetric.ytd2026} days ({domMetric.ytdChange} YoY)
              </span>
            </div>
          </div>

          {/* Card 2: Months Supply of Inventory */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-widest text-black font-black">Months of Supply</span>
                {renderChangeBadge(supplyMetric.monthlyChange, supplyMetric.monthlyChangeNumeric, true)}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-slate-950 font-sans">
                {supplyMetric.july2026}{' '}
                <span className="text-sm font-bold text-slate-500">mos</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <span className="text-slate-500 font-medium">July 2025:</span>
                <span className="font-bold text-slate-900 font-mono">{supplyMetric.july2025} mos</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <span className="text-black font-black text-[11px] uppercase tracking-wider">Market Condition:</span>
              {propertyType === 'detached' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-[#FA2D48] text-white shadow-xs tracking-wide">
                  Seller's Market (3.3 mos)
                </span>
              ) : propertyType === 'attached' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-amber-600 text-white shadow-xs tracking-wide">
                  Seller's Market (4.2 mos)
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-black bg-[#FA2D48] text-white shadow-xs tracking-wide">
                  Seller's Market (3.6 mos)
                </span>
              )}
            </div>
          </div>

          {/* Card 3: % of Original List Price Received */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-widest text-black font-black">% Orig. List Price</span>
                {renderChangeBadge(origPriceMetric.monthlyChange, origPriceMetric.monthlyChangeNumeric)}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-slate-950 font-sans">
                {origPriceMetric.july2026}
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <span className="text-slate-500 font-medium">July 2025:</span>
                <span className="font-bold text-slate-900 font-mono">{origPriceMetric.july2025}</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="text-black font-bold">YTD Realization:</span>
              <span className="font-bold text-slate-900 font-mono">
                {origPriceMetric.ytd2026} ({origPriceMetric.ytdChange} YoY)
              </span>
            </div>
          </div>

          {/* Card 4: Price Per Square Foot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-widest text-black font-black">Price Per Sq. Ft.</span>
                {sqftMetric && renderChangeBadge(sqftMetric.monthlyChange, sqftMetric.monthlyChangeNumeric)}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-[#FA2D48] font-sans">
                {sqftMetric?.july2026 || '$692.15'}{' '}
                <span className="text-sm font-bold text-slate-500">/sqft</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <span className="text-slate-500 font-medium">July 2025:</span>
                <span className="font-bold text-slate-900 font-mono">{sqftMetric?.july2025 || '$678.50'}/sqft</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="text-black font-bold">YTD Average:</span>
              <span className="font-bold text-slate-900 font-mono">
                {sqftMetric?.ytd2026 || '$689.90'} ({sqftMetric?.ytdChange || '+1.9%'} YoY)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Full OC Report Button after the 4 tabs/cards (no title or extra text) */}
      {showExploreButton && onViewFullReport && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onViewFullReport}
            className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-[#FA2D48] text-white font-black text-xs flex items-center space-x-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>Full OC Report</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};


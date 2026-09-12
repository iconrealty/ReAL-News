import React from 'react';
import { 
  OC_FAST_PAGE_1_DATA, 
  OC_FAST_ATTACHED_METRICS, 
  OC_FAST_DETACHED_METRICS, 
  OC_FAST_ALL_PROPERTIES_METRICS,
} from '../data/ocFastReportData';

interface OCFastMonthlySnapshotSectionProps {
  propertyType: 'all' | 'detached' | 'attached';
  onPropertyTypeChange: (type: 'all' | 'detached' | 'attached') => void;
  title?: string;
  showTabsSubtitle?: boolean;
}

export const OCFastMonthlySnapshotSection: React.FC<OCFastMonthlySnapshotSectionProps> = ({
  propertyType,
  onPropertyTypeChange,
  title = "Monthly Snapshot",
  showTabsSubtitle = true,
}) => {
  const attachedData = OC_FAST_ATTACHED_METRICS;
  const detachedData = OC_FAST_DETACHED_METRICS;
  const allPropertiesData = OC_FAST_ALL_PROPERTIES_METRICS;

  const currentDataset = propertyType === 'all'
    ? allPropertiesData
    : propertyType === 'detached'
      ? detachedData
      : attachedData;

  // Retrieve key metrics
  const domMetric = currentDataset.find(m => m.key === 'dom') || currentDataset[3];
  const supplyMetric = currentDataset.find(m => m.key === 'months_supply') || currentDataset[currentDataset.length - 1];
  const origPriceMetric = currentDataset.find(m => m.key === 'pct_orig_price') || currentDataset[5];
  const sqftMetric = currentDataset.find(m => m.key === 'price_sqft');

  // Top right metric change indicator - clean bold colored font without background badge
  const renderChangeBadge = (changeStr: string, numericVal?: number, invertGoodBad = false) => {
    if (!changeStr || changeStr === '—') return <span className="text-slate-400 font-mono text-xs">—</span>;
    
    const isPositive = changeStr.startsWith('+') || (numericVal !== undefined && numericVal > 0);
    const isZero = changeStr === '0.0%' || changeStr === '0%' || numericVal === 0;
    
    let textColor = "text-emerald-600";
    if (isZero) {
      textColor = "text-slate-500";
    } else if (invertGoodBad ? isPositive : !isPositive) {
      textColor = "text-[#FA2D48]";
    }

    return (
      <span className={`font-bold text-xs sm:text-sm font-sans tracking-tight shrink-0 ${textColor}`}>
        {changeStr}
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-7 font-sans">
      {/* Page 1 Monthly Indicators Snapshot Tabs (Side by Side 3 Tabs matching Report Page 1) */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 px-1">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tighter text-[#FA2D48] leading-none">
            {title}
          </h2>
          {showTabsSubtitle && (
            <span className="text-xs sm:text-sm font-semibold text-slate-500 hidden sm:inline">
              Click a tab to switch property filter
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {OC_FAST_PAGE_1_DATA.snapshot.map((snap) => {
            const isSelected = propertyType === snap.propertyCategory;

            return (
              <button
                key={snap.id}
                type="button"
                onClick={() => onPropertyTypeChange(snap.propertyCategory)}
                className={`text-left p-3 sm:p-4 md:p-5 rounded-2xl border transition-all cursor-pointer shadow-2xs relative flex flex-col justify-between space-y-2.5 sm:space-y-3 ${
                  isSelected
                    ? 'bg-white border-[#FA2D48] shadow-md scale-[1.01] ring-2 ring-[#FA2D48]/20'
                    : 'bg-white border-slate-200/90 hover:bg-slate-50/60 hover:border-slate-400 hover:shadow-xs'
                }`}
              >
                {/* Top: Property Type Label */}
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    isSelected ? 'text-[#FA2D48]' : 'text-slate-800'
                  }`}>
                    {snap.propertyType}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate hidden sm:inline">
                    YoY Change
                  </span>
                </div>

                {/* Middle: BIG Hero Percentage in bold with colored font */}
                <div className="my-0.5">
                  <span className={`text-xl sm:text-3xl md:text-4xl font-black font-sans tracking-tight leading-none ${
                    snap.type === 'positive' ? 'text-emerald-600' : 'text-[#FA2D48]'
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
                  <div className="text-[9px] sm:text-[11px] font-mono shrink-0 flex items-center space-x-1 text-emerald-600 font-semibold">
                    <span className="text-emerald-700 font-medium">Prior:</span>
                    <span className="font-bold text-emerald-700">
                      {snap.subtext.replace(/^.*:\s*/, '')}
                    </span>
                  </div>
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
            <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#FA2D48] text-white shadow-xs">
              {propertyType === 'all' ? 'Combined (All Properties)' : propertyType === 'detached' ? 'Detached SFH' : 'Attached Condos'}
            </span>
          </div>

          {/* Quick tab switcher inside the container */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
            <button
              onClick={() => onPropertyTypeChange('all')}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer border ${
                propertyType === 'all'
                  ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs'
                  : 'bg-transparent text-slate-700 border-transparent hover:text-black hover:border-black hover:bg-white'
              }`}
            >
              Combined (All)
            </button>
            <button
              onClick={() => onPropertyTypeChange('detached')}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer border ${
                propertyType === 'detached'
                  ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs'
                  : 'bg-transparent text-slate-700 border-transparent hover:text-black hover:border-black hover:bg-white'
              }`}
            >
              Detached
            </button>
            <button
              onClick={() => onPropertyTypeChange('attached')}
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
                <span className="text-xs font-sans uppercase tracking-widest text-[#FA2D48] font-black">Days on Market</span>
                {renderChangeBadge(domMetric.monthlyChange, domMetric.monthlyChangeNumeric, true)}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-sans">
                {domMetric.july2026}{' '}
                <span className="text-sm font-bold text-emerald-700/80">days</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
                <span>July 2025:</span>
                <span className="font-bold font-mono">{domMetric.july2025} days</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="text-black font-bold">Velocity:</span>
              <span className="font-bold text-slate-900 font-mono">
                {domMetric.rolling2026 || domMetric.ytd2026} days ({domMetric.rollingChange || domMetric.ytdChange} 12-Mo)
              </span>
            </div>
          </div>

          {/* Card 2: Months Supply of Inventory - Steven Thomas Market Speed Background Restored */}
          {(() => {
            const mosVal = parseFloat(supplyMetric.july2026) || (propertyType === 'detached' ? 3.3 : propertyType === 'attached' ? 4.2 : 3.6);
            
            // Steven Thomas Market Speed Colors & Classifications:
            // < 3.0 mos: Hot Seller's Market -> bg-[#FA2D48] (Red)
            // 3.0 - 3.9 mos: Slight Seller's Market -> bg-amber-500 (Amber)
            // 4.0 - 6.0 mos: Balanced Market -> bg-sky-600 (Sky Blue)
            // > 6.0 mos: Buyer's Market -> bg-emerald-700 (Emerald Green)
            let bgClass = "bg-amber-500 text-white";
            let conditionName = "Slight Seller's Market";

            if (mosVal < 3.0) {
              bgClass = "bg-[#FA2D48] text-white";
              conditionName = "Hot Seller's Market";
            } else if (mosVal < 4.0) {
              bgClass = "bg-amber-500 text-white";
              conditionName = "Slight Seller's Market";
            } else if (mosVal <= 6.0) {
              bgClass = "bg-sky-600 text-white";
              conditionName = "Balanced Market";
            } else {
              bgClass = "bg-emerald-700 text-white";
              conditionName = "Buyer's Market";
            }

            return (
              <div className={`${bgClass} rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5`}>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans uppercase tracking-widest text-white font-black">
                      Months of Supply
                    </span>
                    <span className="font-bold text-xs sm:text-sm font-sans tracking-tight text-white shrink-0">
                      {supplyMetric.monthlyChange}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
                    {supplyMetric.july2026}{' '}
                    <span className="text-sm font-bold text-white/90">mos</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs text-white/90">
                    <span className="text-white/80 font-medium">July 2025:</span>
                    <span className="font-bold text-white font-mono">{supplyMetric.july2025} mos</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/20 flex items-center justify-between">
                  <span className="bg-white text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg inline-block shadow-xs font-sans">
                    {conditionName}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Card 3: % of Original List Price Received */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-widest text-[#FA2D48] font-black">% Orig. List Price</span>
                {renderChangeBadge(origPriceMetric.monthlyChange, origPriceMetric.monthlyChangeNumeric)}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-slate-950 font-sans">
                {origPriceMetric.july2026}
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
                <span>July 2025:</span>
                <span className="font-bold font-mono">{origPriceMetric.july2025}</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="text-black font-bold">Realization:</span>
              <span className="font-bold text-slate-900 font-mono">
                {origPriceMetric.rolling2026 || origPriceMetric.ytd2026} ({origPriceMetric.rollingChange || origPriceMetric.ytdChange} 12-Mo)
              </span>
            </div>
          </div>

          {/* Card 4: Price Per Square Foot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-black hover:shadow-md transition-all flex flex-col justify-between space-y-3.5">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-widest text-[#FA2D48] font-black">Price Per Sq. Ft.</span>
                {sqftMetric && renderChangeBadge(sqftMetric.monthlyChange, sqftMetric.monthlyChangeNumeric)}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-[#FA2D48] font-sans">
                {sqftMetric?.july2026 || '$692.15'}{' '}
                <span className="text-sm font-bold text-slate-500">/sqft</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
                <span>July 2025:</span>
                <span className="font-bold font-mono">{sqftMetric?.july2025 || '$678.50'}/sqft</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span className="text-black font-bold">Average:</span>
              <span className="font-bold text-slate-900 font-mono">
                {sqftMetric?.rolling2026 || sqftMetric?.ytd2026 || '$689.90'} ({sqftMetric?.rollingChange || sqftMetric?.ytdChange || '+1.9%'} 12-Mo)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

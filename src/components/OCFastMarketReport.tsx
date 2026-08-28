import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info, 
  BarChart3, 
  Activity,
  Percent,
  Package,
  FileSpreadsheet,
  BookOpen,
  FileText,
  Compass,
  Scale
} from 'lucide-react';
import { AdBanner, CityInfo } from '../types';
import { AdBannerRenderer } from './AdBannerRenderer';
import {
  OC_FAST_METADATA,
  OC_FAST_PAGE_1_DATA,
  OC_FAST_SUMMARY_POINTS,
  OC_FAST_ATTACHED_METRICS,
  OC_FAST_DETACHED_METRICS,
  OC_FAST_ALL_PROPERTIES_METRICS,
  OC_FAST_HISTORICAL_TIMELINE,
  OCFastMetricItem
} from '../data/ocFastReportData';

interface OCFastMarketReportProps {
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
  onSelectCity?: (city: CityInfo) => void;
  onShowToast?: (msg: string) => void;
}

type OCFastTab = 'indicators' | 'all-properties' | 'detached' | 'attached' | 'comparison' | 'history' | 'takeaways';

export const OCFastMarketReport: React.FC<OCFastMarketReportProps> = ({
  ads = [],
  monetizationEnabled = false,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<OCFastTab>('indicators');
  const [propertyType, setPropertyType] = useState<'all' | 'detached' | 'attached'>('all');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const attachedData = OC_FAST_ATTACHED_METRICS;
  const detachedData = OC_FAST_DETACHED_METRICS;
  const allPropertiesData = OC_FAST_ALL_PROPERTIES_METRICS;

  const currentDataset = propertyType === 'all'
    ? allPropertiesData
    : propertyType === 'detached'
      ? detachedData
      : attachedData;

  const handlePropertyTypeChange = (type: 'all' | 'detached' | 'attached') => {
    setPropertyType(type);
    if (activeTab === 'detached' || activeTab === 'attached' || activeTab === 'all-properties') {
      if (type === 'all') setActiveTab('all-properties');
      else if (type === 'detached') setActiveTab('detached');
      else if (type === 'attached') setActiveTab('attached');
    }
  };

  // Top 4 Metric Lookups from canonical dataset to ensure 100% data congruence
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

  // Render individual metric card with JULY as the principal number, mini-pills for 2025 and % change, and YTD / Rolling 12-Month footer
  const renderMetricCard = (metric: OCFastMetricItem, pType: 'detached' | 'attached' | 'all') => {
    const isDOM = metric.key === 'dom';
    const isPositive = metric.monthlyChangeNumeric > 0;
    const isZero = metric.monthlyChangeNumeric === 0;

    return (
      <div 
        key={metric.key} 
        className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
      >
        <div>
          {/* Card Top: Metric Title & % Change Mini-Pill */}
          <div className="flex items-start justify-between gap-2">
            <div className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider leading-snug">
              {metric.label}
            </div>
            {renderChangeBadge(metric.monthlyChange, metric.monthlyChangeNumeric, isDOM)}
          </div>

          {/* Principal Highlighted JULY 2026 Number */}
          <div className="text-2xl sm:text-3xl font-black text-slate-950 pt-2 tracking-tight">
            {metric.july2026}
          </div>

          {/* Subtitle: 2025 Prior Year Comparison */}
          <div className="flex items-center space-x-1.5 pt-1.5 text-xs font-bold text-slate-600">
            <span className="text-slate-500 font-medium">July 2025:</span>
            <span className="text-slate-900 font-bold">{metric.july2025}</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className={isZero ? 'text-slate-600' : (isDOM ? !isPositive : isPositive) ? 'text-emerald-600' : 'text-[#FA2D48]'}>
              {metric.monthlyChange} YoY
            </span>
          </div>
        </div>

        {/* Bottom Bar: Rolling 12-Month & YTD Performance */}
        {metric.rolling2026 && metric.rolling2026 !== '—' ? (
          <div className="pt-2.5 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-600 font-medium">
            <span className="text-slate-500">12-Mo. Rolling:</span>
            <div className="flex items-center space-x-1.5 font-bold">
              <span className="text-slate-950 font-black">{metric.rolling2026}</span>
              {metric.rollingChange && metric.rollingChange !== '—' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  metric.rollingChangeNumeric && metric.rollingChangeNumeric > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-[#FA2D48] bg-rose-50'
                }`}>
                  {metric.rollingChange}
                </span>
              )}
            </div>
          </div>
        ) : metric.ytd2026 && metric.ytd2026 !== '—' ? (
          <div className="pt-2.5 border-t border-slate-100 text-[11px] flex items-center justify-between text-slate-600 font-medium">
            <span className="text-slate-500">YTD Thru 7-2026:</span>
            <div className="flex items-center space-x-1.5 font-bold">
              <span className="text-slate-950 font-black">{metric.ytd2026}</span>
              {metric.ytdChange && metric.ytdChange !== '—' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  metric.ytdChangeNumeric && metric.ytdChangeNumeric > 0 ? 'text-emerald-700 bg-emerald-50' : 'text-[#FA2D48] bg-rose-50'
                }`}>
                  {metric.ytdChange}
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  // Group metrics by category
  const renderMetricGroup = (title: string, metrics: OCFastMetricItem[], pType: 'detached' | 'attached' | 'all') => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 font-sans flex items-center space-x-1.5">
            <span>{title}</span>
            <span className="text-slate-400 font-normal">({metrics.length} metrics)</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map(m => renderMetricCard(m, pType))}
        </div>
      </div>
    );
  };

  // SVG Calculations for 14-Year Timeline Chart
  const chartWidth = 760;
  const chartHeight = 280;
  const padLeft = 70;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 40;

  const minPrice = 200000;
  const maxPrice = 1600000;

  const getX = (index: number) => {
    const total = OC_FAST_HISTORICAL_TIMELINE.length - 1;
    return padLeft + (index / total) * (chartWidth - padLeft - padRight);
  };

  const getY = (val: number) => {
    const clamped = Math.max(minPrice, Math.min(maxPrice, val));
    const ratio = (clamped - minPrice) / (maxPrice - minPrice);
    return chartHeight - padBottom - ratio * (chartHeight - padTop - padBottom);
  };

  const detachedPoints = OC_FAST_HISTORICAL_TIMELINE.map((pt, i) => `${getX(i)},${getY(pt.detachedMedian)}`).join(' ');
  const attachedPoints = OC_FAST_HISTORICAL_TIMELINE.map((pt, i) => `${getX(i)},${getY(pt.attachedMedian)}`).join(' ');

  const detachedAreaPath = `M ${getX(0)},${getY(minPrice)} ` +
    OC_FAST_HISTORICAL_TIMELINE.map((pt, i) => `L ${getX(i)},${getY(pt.detachedMedian)}`).join(' ') +
    ` L ${getX(OC_FAST_HISTORICAL_TIMELINE.length - 1)},${getY(minPrice)} Z`;

  const attachedAreaPath = `M ${getX(0)},${getY(minPrice)} ` +
    OC_FAST_HISTORICAL_TIMELINE.map((pt, i) => `L ${getX(i)},${getY(pt.attachedMedian)}`).join(' ') +
    ` L ${getX(OC_FAST_HISTORICAL_TIMELINE.length - 1)},${getY(minPrice)} Z`;

  const currentHoveredPoint = hoveredPointIndex !== null 
    ? OC_FAST_HISTORICAL_TIMELINE[hoveredPointIndex] 
    : OC_FAST_HISTORICAL_TIMELINE[OC_FAST_HISTORICAL_TIMELINE.length - 1];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      
      {/* Official OC Fast Header Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-mono font-black tracking-wider text-[#FA2D48] uppercase">
                OC FastStats
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600">
                Current as of {OC_FAST_METADATA.currentAsOf}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-slate-950 leading-tight">
              Orange County Local Market Update
            </h1>
          </div>

          {/* Clean Property Type Switcher with All Properties Support as separate minipills with horizontal scrolling */}
          <div className="w-full md:w-auto overflow-x-auto pb-1 -mb-1 scrollbar-none">
            <div className="flex items-center space-x-2 py-0.5 min-w-max">
              <button
                type="button"
                onClick={() => handlePropertyTypeChange('all')}
                className={`px-4 py-2 text-xs font-black rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
                  propertyType === 'all'
                    ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Properties</span>
              </button>
              <button
                type="button"
                onClick={() => handlePropertyTypeChange('detached')}
                className={`px-4 py-2 text-xs font-black rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
                  propertyType === 'detached'
                    ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Detached</span>
              </button>
              <button
                type="button"
                onClick={() => handlePropertyTypeChange('attached')}
                className={`px-4 py-2 text-xs font-black rounded-full border transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
                  propertyType === 'attached'
                    ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:text-slate-950 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Attached</span>
              </button>
            </div>
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
                onClick={() => handlePropertyTypeChange(snap.propertyCategory)}
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
                  <div className="text-[9px] sm:text-[11px] font-mono shrink-0 flex items-center space-x-1">
                    <span className="font-black text-black">Prior:</span>
                    <span className={`font-black ${isPositive ? 'text-[#FA2D48]' : 'text-emerald-600'}`}>
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
              onClick={() => handlePropertyTypeChange('all')}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer border ${
                propertyType === 'all'
                  ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs'
                  : 'bg-transparent text-slate-700 border-transparent hover:text-black hover:border-black hover:bg-white'
              }`}
            >
              Combined (All)
            </button>
            <button
              onClick={() => handlePropertyTypeChange('detached')}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer border ${
                propertyType === 'detached'
                  ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs'
                  : 'bg-transparent text-slate-700 border-transparent hover:text-black hover:border-black hover:bg-white'
              }`}
            >
              Detached
            </button>
            <button
              onClick={() => handlePropertyTypeChange('attached')}
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
              <span className="text-black font-bold">Velocity:</span>
              <span className="font-bold text-slate-900 font-mono">
                {domMetric.rolling2026 || domMetric.ytd2026} days ({domMetric.rollingChange || domMetric.ytdChange} 12-Mo)
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
              <span className="text-black font-bold">Average:</span>
              <span className="font-bold text-slate-900 font-mono">
                {sqftMetric?.rolling2026 || sqftMetric?.ytd2026 || '$689.90'} ({sqftMetric?.rollingChange || sqftMetric?.ytdChange || '+1.9%'} 12-Mo)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Report Tabs Bar - Market Analysis, All Properties, Detached, Attached, etc. */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'indicators', label: 'Market Analysis', icon: null },
            { id: 'all-properties', label: 'All Properties', icon: <Layers className="w-4 h-4 mr-1.5" /> },
            { id: 'detached', label: 'Detached', icon: <Home className="w-4 h-4 mr-1.5" /> },
            { id: 'attached', label: 'Attached', icon: <Building2 className="w-4 h-4 mr-1.5" /> },
            { id: 'comparison', label: 'Side-by-Side Table', icon: <FileSpreadsheet className="w-4 h-4 mr-1.5" /> },
            { id: 'history', label: '14-Year Price History', icon: <BarChart3 className="w-4 h-4 mr-1.5" /> },
            { id: 'takeaways', label: 'Summary', icon: null },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as OCFastTab);
                  if (tab.id === 'detached') setPropertyType('detached');
                  if (tab.id === 'attached') setPropertyType('attached');
                  if (tab.id === 'all-properties') setPropertyType('all');
                }}
                className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border-0 flex items-center ${
                  isActive
                    ? 'bg-[#FA2D48] text-white shadow-xs outline-none ring-0'
                    : 'text-black hover:bg-slate-100 hover:text-black font-bold'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner Ad Displayed After Tabs */}
      {monetizationEnabled && ads && ads.length > 0 && (
        <AdBannerRenderer
          placement="header-banner"
          ads={ads}
          cityName="Orange County"
          monetizationEnabled={monetizationEnabled}
        />
      )}

      {/* TAB 1: MARKET ANALYSIS */}
      {activeTab === 'indicators' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          
          {/* Market Analysis Header */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black tracking-tight">
                Market Analysis
              </h2>
            </div>

            <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-2xl shrink-0">
              <span className="text-[10px] text-black uppercase font-bold block">Current Benchmark</span>
              <span className="font-black text-black text-sm">{OC_FAST_METADATA.period}</span>
            </div>
          </div>

          {/* Narrative Commentary Sections with black typography */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                Market Analysis
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {OC_FAST_PAGE_1_DATA.narrativeParagraphs.map((para, pIdx) => (
                <div key={pIdx} className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 space-y-2.5">
                  <h4 className="text-sm font-black uppercase tracking-wider text-black flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FA2D48]"></span>
                    <span>{para.heading}</span>
                  </h4>
                  <p className="text-sm text-black leading-relaxed font-medium">
                    {para.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Page Jump Navigation Matrix */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-[#FA2D48]" />
              <span>Explore Full Report Modules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => { setActiveTab('all-properties'); setPropertyType('all'); }}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all text-left group cursor-pointer"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-black group-hover:text-[#FA2D48]">Page 4 / 15</span>
                <div className="text-sm font-black text-black mt-1">All Properties Combined</div>
                <p className="text-[11px] text-black font-medium mt-1">11 Core Metrics across countywide market</p>
              </button>

              <button
                onClick={() => { setActiveTab('detached'); setPropertyType('detached'); }}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all text-left group cursor-pointer"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-black group-hover:text-[#FA2D48]">Page 2 / 15</span>
                <div className="text-sm font-black text-black mt-1">Detached Single-Family</div>
                <p className="text-[11px] text-black font-medium mt-1">$1,460,000 Median / 32 Days DOM</p>
              </button>

              <button
                onClick={() => { setActiveTab('attached'); setPropertyType('attached'); }}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all text-left group cursor-pointer"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-black group-hover:text-[#FA2D48]">Page 3 / 15</span>
                <div className="text-sm font-black text-black mt-1">Attached Condominiums</div>
                <p className="text-[11px] text-black font-medium mt-1">$767,500 Median / 4.2 Mos Supply</p>
              </button>

              <button
                onClick={() => setActiveTab('comparison')}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all text-left group cursor-pointer"
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-black group-hover:text-[#FA2D48]">Comprehensive</span>
                <div className="text-sm font-black text-black mt-1">Side-by-Side Comparison</div>
                <p className="text-[11px] text-black font-medium mt-1">Full cross-tabulation table with YTD</p>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ALL PROPERTIES COMBINED (PAGE 4) */}
      {activeTab === 'all-properties' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          
          {/* Executive Section Header */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                  Page 4: All Properties Combined
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  1,926 Closed Sales in July (-0.3%)
                </span>
                <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  20,814 Rolling 12-Mo (+1.3%)
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight pt-1.5">
                All Residential Properties (Single-Family & Condos)
              </h2>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs shrink-0">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Primary Month</span>
                <span className="font-black text-slate-900">July 2026 Report</span>
              </div>
              <span className="text-slate-300">|</span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">12-Mo Rolling</span>
                <span className="font-bold text-slate-700">28,112 Listings</span>
              </div>
            </div>
          </div>

          {/* Pricing & Valuation Metrics */}
          {renderMetricGroup(
            "Pricing & Valuation Metrics (July 2026 Principal)",
            allPropertiesData.filter(m => m.category === 'pricing'),
            'all'
          )}

          {/* Sales Volume & Market Activity */}
          {renderMetricGroup(
            "Sales Volume & Market Activity",
            allPropertiesData.filter(m => m.category === 'volume'),
            'all'
          )}

          {/* Inventory, Supply & Affordability */}
          {renderMetricGroup(
            "Inventory, Supply Dynamics & Housing Affordability",
            allPropertiesData.filter(m => m.category === 'inventory' || m.category === 'affordability'),
            'all'
          )}

          {/* Market Velocity & Days on Market */}
          {renderMetricGroup(
            "Market Velocity & Days on Market",
            allPropertiesData.filter(m => m.category === 'velocity'),
            'all'
          )}

        </div>
      )}

      {/* TAB 3: DETACHED SINGLE FAMILY HOMES (PAGE 2) */}
      {activeTab === 'detached' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          
          {/* Executive Section Header */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                  Page 2: Single Family Residential
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  1,198 Closed Sales in July (+1.1%)
                </span>
                <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  12,823 Rolling 12-Mo (+3.9%)
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight pt-1.5">
                Detached Single-Family Market
              </h2>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs shrink-0">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Primary Month</span>
                <span className="font-black text-slate-900">July 2026 Report</span>
              </div>
              <span className="text-slate-300">|</span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Comparison Base</span>
                <span className="font-bold text-slate-700">July 2025 & 12-Mo</span>
              </div>
            </div>
          </div>

          {/* Pricing & Valuation Metrics */}
          {renderMetricGroup(
            "Pricing & Valuation Metrics (July 2026 Principal)",
            detachedData.filter(m => m.category === 'pricing'),
            'detached'
          )}

          {/* Sales Volume & Market Activity */}
          {renderMetricGroup(
            "Sales Volume & Market Activity",
            detachedData.filter(m => m.category === 'volume'),
            'detached'
          )}

          {/* Inventory, Supply & Affordability */}
          {renderMetricGroup(
            "Inventory, Supply Dynamics & Housing Affordability",
            detachedData.filter(m => m.category === 'inventory' || m.category === 'affordability'),
            'detached'
          )}

          {/* Market Velocity & Days on Market */}
          {renderMetricGroup(
            "Market Velocity & Days on Market",
            detachedData.filter(m => m.category === 'velocity'),
            'detached'
          )}

        </div>
      )}

      {/* TAB 4: ATTACHED CONDOS & TOWNHOMES (PAGE 3) */}
      {activeTab === 'attached' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          
          {/* Executive Section Header */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider">
                  Page 3: Condos & Townhomes
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  727 Closed Sales in July (-0.5%)
                </span>
                <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  7,980 Rolling 12-Mo (+1.0%)
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight pt-1.5">
                Attached Condominiums & Townhomes
              </h2>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-xs shrink-0">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Primary Month</span>
                <span className="font-black text-slate-900">July 2026 Report</span>
              </div>
              <span className="text-slate-300">|</span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Comparison Base</span>
                <span className="font-bold text-slate-700">July 2025 & 12-Mo</span>
              </div>
            </div>
          </div>

          {/* Pricing & Valuation Metrics */}
          {renderMetricGroup(
            "Pricing & Valuation Metrics (July 2026 Principal)",
            attachedData.filter(m => m.category === 'pricing'),
            'attached'
          )}

          {/* Sales Volume & Market Activity */}
          {renderMetricGroup(
            "Sales Volume & Market Activity",
            attachedData.filter(m => m.category === 'volume'),
            'attached'
          )}

          {/* Inventory, Supply & Affordability */}
          {renderMetricGroup(
            "Inventory, Supply Dynamics & Housing Affordability",
            attachedData.filter(m => m.category === 'inventory' || m.category === 'affordability'),
            'attached'
          )}

          {/* Market Velocity & Days on Market */}
          {renderMetricGroup(
            "Market Velocity & Days on Market",
            attachedData.filter(m => m.category === 'velocity'),
            'attached'
          )}

        </div>
      )}

      {/* TAB 5: SIDE-BY-SIDE COMPARISON TABLE */}
      {activeTab === 'comparison' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Comprehensive Property Comparison Table
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Detailed side-by-side performance of All Properties, Detached Single-Family, and Attached Condominiums for July 2026 and 12-Month Rolling Activity.
                </p>
              </div>
            </div>

            {/* ALL PROPERTIES COMBINED TABLE (PAGE 4) */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h3 className="text-base font-black text-slate-900">All Properties Combined (Page 4)</h3>
              </div>
              <div className="overflow-x-auto scrollbar-none rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3.5 min-w-[200px]">Key Metrics</th>
                      <th className="p-3.5 text-center bg-slate-200/60 font-black text-slate-800" colSpan={3}>
                        July (Monthly)
                      </th>
                      <th className="p-3.5 text-center bg-purple-50 font-black text-purple-900 border-l border-slate-200" colSpan={3}>
                        12-Month Rolling / YTD
                      </th>
                    </tr>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <th className="p-2.5 pl-3.5">Metric Name</th>
                      <th className="p-2.5 text-right font-bold">2025</th>
                      <th className="p-2.5 text-right font-bold text-slate-900">2026 (Principal)</th>
                      <th className="p-2.5 text-center font-bold text-slate-900">% Change</th>
                      <th className="p-2.5 text-right font-bold border-l border-slate-200">Prior 12-Mo</th>
                      <th className="p-2.5 text-right font-bold text-slate-900">12-Mo Rolling</th>
                      <th className="p-2.5 text-center font-bold text-slate-900">% Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allPropertiesData.map((row) => (
                      <tr key={row.key} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{row.label}</td>
                        <td className="p-3.5 text-right font-mono text-slate-600">{row.july2025}</td>
                        <td className="p-3.5 text-right font-mono text-slate-950 font-black text-sm">{row.july2026}</td>
                        <td className="p-3.5 text-center">
                          {renderChangeBadge(row.monthlyChange, row.monthlyChangeNumeric, row.key === 'dom')}
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-600 border-l border-slate-100">{row.rolling2025 || row.ytd2025 || '—'}</td>
                        <td className="p-3.5 text-right font-mono text-slate-950 font-black text-sm">{row.rolling2026 || row.ytd2026 || '—'}</td>
                        <td className="p-3.5 text-center">
                          {row.rollingChange ? renderChangeBadge(row.rollingChange, row.rollingChangeNumeric, row.key === 'dom') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DETACHED TABLE (PAGE 2) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">Detached Single-Family Homes (Page 2)</h3>
              </div>
              <div className="overflow-x-auto scrollbar-none rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3.5 min-w-[200px]">Key Metrics</th>
                      <th className="p-3.5 text-center bg-slate-200/60 font-black text-slate-800" colSpan={3}>
                        July (Monthly)
                      </th>
                      <th className="p-3.5 text-center bg-amber-50 font-black text-amber-900 border-l border-slate-200" colSpan={3}>
                        12-Month Rolling / YTD
                      </th>
                    </tr>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <th className="p-2.5 pl-3.5">Metric Name</th>
                      <th className="p-2.5 text-right font-bold">2025</th>
                      <th className="p-2.5 text-right font-bold text-slate-900">2026 (Principal)</th>
                      <th className="p-2.5 text-center font-bold text-slate-900">% Change</th>
                      <th className="p-2.5 text-right font-bold border-l border-slate-200">Prior 12-Mo</th>
                      <th className="p-2.5 text-right font-bold text-slate-900">12-Mo Rolling</th>
                      <th className="p-2.5 text-center font-bold text-slate-900">% Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {detachedData.map((row) => (
                      <tr key={row.key} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{row.label}</td>
                        <td className="p-3.5 text-right font-mono text-slate-600">{row.july2025}</td>
                        <td className="p-3.5 text-right font-mono text-slate-950 font-black text-sm">{row.july2026}</td>
                        <td className="p-3.5 text-center">
                          {renderChangeBadge(row.monthlyChange, row.monthlyChangeNumeric, row.key === 'dom')}
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-600 border-l border-slate-100">{row.rolling2025 || row.ytd2025 || '—'}</td>
                        <td className="p-3.5 text-right font-mono text-slate-950 font-black text-sm">{row.rolling2026 || row.ytd2026 || '—'}</td>
                        <td className="p-3.5 text-center">
                          {row.rollingChange ? renderChangeBadge(row.rollingChange, row.rollingChangeNumeric, row.key === 'dom') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ATTACHED TABLE (PAGE 3) */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-black text-slate-900">Attached Condominiums & Townhomes (Page 3)</h3>
              </div>
              <div className="overflow-x-auto scrollbar-none rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                      <th className="p-3.5 min-w-[200px]">Key Metrics</th>
                      <th className="p-3.5 text-center bg-slate-200/60 font-black text-slate-800" colSpan={3}>
                        July (Monthly)
                      </th>
                      <th className="p-3.5 text-center bg-sky-50 font-black text-sky-900 border-l border-slate-200" colSpan={3}>
                        12-Month Rolling / YTD
                      </th>
                    </tr>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <th className="p-2.5 pl-3.5">Metric Name</th>
                      <th className="p-2.5 text-right font-bold">2025</th>
                      <th className="p-2.5 text-right font-bold text-slate-900">2026 (Principal)</th>
                      <th className="p-2.5 text-center font-bold text-slate-900">% Change</th>
                      <th className="p-2.5 text-right font-bold border-l border-slate-200">Prior 12-Mo</th>
                      <th className="p-2.5 text-right font-bold text-slate-900">12-Mo Rolling</th>
                      <th className="p-2.5 text-center font-bold text-slate-900">% Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attachedData.map((row) => (
                      <tr key={row.key} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{row.label}</td>
                        <td className="p-3.5 text-right font-mono text-slate-600">{row.july2025}</td>
                        <td className="p-3.5 text-right font-mono text-slate-950 font-black text-sm">{row.july2026}</td>
                        <td className="p-3.5 text-center">
                          {renderChangeBadge(row.monthlyChange, row.monthlyChangeNumeric, row.key === 'dom')}
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-600 border-l border-slate-100">{row.rolling2025 || row.ytd2025 || '—'}</td>
                        <td className="p-3.5 text-right font-mono text-slate-950 font-black text-sm">{row.rolling2026 || row.ytd2026 || '—'}</td>
                        <td className="p-3.5 text-center">
                          {row.rollingChange ? renderChangeBadge(row.rollingChange, row.rollingChangeNumeric, row.key === 'dom') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: 14-YEAR PRICE HISTORY (2012–2026) */}
      {activeTab === 'history' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#FA2D48]" />
                <span>Rolling 12-Month Calculation</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Median Sales Price – 14 Year Historical Evolution
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Orange County Single-Family vs Condos Historical Trend (Feb 2012 through July 2026)
              </p>
            </div>

            {/* Interactive Legend */}
            <div className="flex items-center space-x-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 text-xs font-bold">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-slate-800">Detached (SFH)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FA2D48]"></span>
                <span className="text-slate-800">Attached (Condos)</span>
              </div>
            </div>
          </div>

          {/* Current Hovered / Scrubbed Point Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Selected Benchmark:</span>
                <span className="text-sm font-black text-slate-900">{currentHoveredPoint.label}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Detached SFH Median:</span>
              <span className="text-base sm:text-lg font-black text-slate-950">
                ${currentHoveredPoint.detachedMedian.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold ml-1.5">
                (+{(((currentHoveredPoint.detachedMedian - 535000) / 535000) * 100).toFixed(0)}% since '12)
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#FA2D48] block">Attached Condo Median:</span>
              <span className="text-base sm:text-lg font-black text-slate-950">
                ${currentHoveredPoint.attachedMedian.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold ml-1.5">
                (+{(((currentHoveredPoint.attachedMedian - 270000) / 270000) * 100).toFixed(0)}% since '12)
              </span>
            </div>
          </div>

          {/* SVG Responsive Chart */}
          <div className="relative overflow-x-auto scrollbar-none pt-2 pb-1">
            <div className="min-w-[650px] w-full">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  <linearGradient id="detachedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="attachedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FA2D48" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#FA2D48" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                {[300000, 600000, 900000, 1200000, 1500000].map((level) => {
                  const y = getY(level);
                  return (
                    <g key={level}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartWidth - padRight}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray="4,4"
                      />
                      <text
                        x={padLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#64748B"
                      >
                        ${(level / 1000).toFixed(0)}k
                      </text>
                    </g>
                  );
                })}

                {/* Area Fills */}
                <path d={detachedAreaPath} fill="url(#detachedGradient)" />
                <path d={attachedAreaPath} fill="url(#attachedGradient)" />

                {/* Connecting Lines */}
                <polyline
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={detachedPoints}
                />
                <polyline
                  fill="none"
                  stroke="#FA2D48"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={attachedPoints}
                />

                {/* Data Points and Interactivity */}
                {OC_FAST_HISTORICAL_TIMELINE.map((pt, i) => {
                  const cx = getX(i);
                  const cyDetached = getY(pt.detachedMedian);
                  const cyAttached = getY(pt.attachedMedian);
                  const isHovered = hoveredPointIndex === i;

                  return (
                    <g 
                      key={pt.date} 
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredPointIndex(i)}
                    >
                      {isHovered && (
                        <line
                          x1={cx}
                          y1={padTop}
                          x2={cx}
                          y2={chartHeight - padBottom}
                          stroke="#0F172A"
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                        />
                      )}

                      <circle
                        cx={cx}
                        cy={cyDetached}
                        r={isHovered ? 6 : 4}
                        fill="#d97706"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all"
                      />

                      <circle
                        cx={cx}
                        cy={cyAttached}
                        r={isHovered ? 6 : 4}
                        fill="#FA2D48"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all"
                      />

                      {(i % 2 === 0 || i === OC_FAST_HISTORICAL_TIMELINE.length - 1) && (
                        <text
                          x={cx}
                          y={chartHeight - padBottom + 18}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight={isHovered ? "bold" : "normal"}
                          fill={isHovered ? "#0F172A" : "#64748B"}
                        >
                          {pt.date}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Hover or tap any date point on the chart to inspect rolling 12-month median sales price evolution for both Detached single family and Attached condo homes from 2012 to 2026.
          </p>
        </div>
      )}

      {/* TAB 7: SUMMARY */}
      {activeTab === 'takeaways' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OC_FAST_SUMMARY_POINTS.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black text-[#FA2D48] uppercase tracking-wider">{item.title}</span>
                  <span className="text-xs font-extrabold text-emerald-600">{item.trend}</span>
                </div>
                <div className="text-xl font-black text-slate-900">{item.stat}</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer & Citation Footer */}
      <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">
              {OC_FAST_METADATA.disclaimer}
            </p>
            <p className="text-[11px] text-slate-500">
              {OC_FAST_METADATA.copyright} Report provided by {OC_FAST_METADATA.providedBy}.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Ad Banner if Monetization Enabled */}
      {monetizationEnabled && ads && ads.length > 0 && (
        <div className="pt-2">
          <AdBannerRenderer
            ads={ads}
            placement="market-trends-banner"
            cityName="Orange County"
            monetizationEnabled={monetizationEnabled}
          />
        </div>
      )}

    </div>
  );
};

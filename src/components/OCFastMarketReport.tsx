import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity,
  Percent,
  Package,
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
  OCFastMetricItem
} from '../data/ocFastReportData';
import { OCFastMonthlySnapshotSection } from './OCFastMonthlySnapshotSection';

interface OCFastMarketReportProps {
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
  onSelectCity?: (city: CityInfo) => void;
  onShowToast?: (msg: string) => void;
}

type OCFastTab = 'indicators' | 'all-properties' | 'detached' | 'attached' | 'takeaways';

export const OCFastMarketReport: React.FC<OCFastMarketReportProps> = ({
  ads = [],
  monetizationEnabled = false,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<OCFastTab>('indicators');
  const [propertyType, setPropertyType] = useState<'all' | 'detached' | 'attached'>('all');

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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      
      {/* Official OC Fast Header Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs sm:text-sm font-sans font-black tracking-wider text-[#FA2D48] uppercase">
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
        </div>
      </div>

      {/* Page 1 Monthly Indicators Snapshot Tabs & Core Velocity Indicators */}
      <OCFastMonthlySnapshotSection
        propertyType={propertyType}
        onPropertyTypeChange={handlePropertyTypeChange}
        title="Monthly Snapshot"
        showTabsSubtitle={true}
      />

      {/* Main Report Tabs Bar - Market Analysis, All Properties, Detached, Attached, Summary */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
          {[
            { id: 'indicators', label: 'Market Analysis', icon: null },
            { id: 'all-properties', label: 'All Properties', icon: <Layers className="w-4 h-4 mr-1.5" /> },
            { id: 'detached', label: 'Detached', icon: <Home className="w-4 h-4 mr-1.5" /> },
            { id: 'attached', label: 'Attached', icon: <Building2 className="w-4 h-4 mr-1.5" /> },
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
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
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
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
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
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

      {/* TAB 5: SUMMARY */}
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

import React, { useState, useMemo } from 'react';
import { CityInfo, AdBanner, NewsCategory } from '../types';
import { AdBannerRenderer } from './AdBannerRenderer';

interface CommissionCalculatorProps {
  currentCity?: CityInfo;
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
  onNavigateCategory?: (category: NewsCategory) => void;
  onShowToast?: (msg: string) => void;
}

export type LeadSource = 'self' | 'team' | 'zillow' | 'other';

const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  self: 'Self',
  team: 'Team Lead',
  zillow: 'Zillow Flex',
  other: 'Other Referral',
};

const PRICE_PRESETS = [
  { label: '$600k', value: 600000 },
  { label: '$700k', value: 700000 },
  { label: '$800k', value: 800000 },
  { label: '$1.0M', value: 1000000 },
  { label: '$1.25M', value: 1250000 },
  { label: '$1.5M', value: 1500000 },
];

const COMMISSION_RATE_PRESETS = [2.0, 2.5, 3.0];

const SPLIT_PRESETS = [
  { label: '70 / 30', agentPct: 70 },
  { label: '50 / 50', agentPct: 50 },
  { label: '80 / 20', agentPct: 80 },
];

// Zillow Pricing Chart Group 3 tiered fee structure
export function getZillowFeePct(price: number): number {
  if (price >= 500000) return 40;
  if (price >= 375000) return 35;
  if (price >= 250000) return 30;
  if (price >= 125000) return 25;
  return 15;
}

export const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({
  currentCity,
  ads = [],
  monetizationEnabled = false,
  onShowToast,
}) => {
  // 1. Broker Cap Status
  const [isCapped, setIsCapped] = useState<boolean>(true);

  // 2. Lead Source Selection (Directly under Broker Cap Status)
  const [selectedLeadSource, setSelectedLeadSource] = useState<LeadSource>('self');

  // 3. Deal Numbers
  const [salePrice, setSalePrice] = useState<number | ''>(1000000);
  const numericSalePrice = typeof salePrice === 'number' ? salePrice : 0;
  const [commissionRate, setCommissionRate] = useState<number>(2.0);
  const [agentSplitPct, setAgentSplitPct] = useState<number>(70);

  // 4. Broker and Other Deductions
  const [includeDeductions, setIncludeDeductions] = useState<boolean>(true);
  const [otherDeduction, setOtherDeduction] = useState<number>(0);
  const [brokerDeduction, setBrokerDeduction] = useState<number>(200);

  // Bottom expandable calculation audit
  const [showCalculationAudit, setShowCalculationAudit] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute deal finances for any lead source
  const calcSource = (src: LeadSource) => {
    const gci = numericSalePrice * (commissionRate / 100);
    const totalFlatDeductions = includeDeductions ? otherDeduction + brokerDeduction : 0;

    let refPct = 0;
    let splitPct = 50;

    if (src === 'self') {
      refPct = 0;
      splitPct = agentSplitPct;
    } else if (src === 'team') {
      refPct = 0;
      splitPct = 50; // Team lead is strictly 50/50 split
    } else if (src === 'zillow') {
      refPct = getZillowFeePct(numericSalePrice);
      splitPct = 50;
    } else {
      refPct = 25;
      splitPct = 50;
    }

    const refFee = gci * (refPct / 100);
    const distributable = Math.max(0, gci - refFee);
    const agentGrossShare = distributable * (splitPct / 100);
    const teamShare = distributable * ((100 - splitPct) / 100);

    // If Capped -> 0% broker fee. If Not Capped -> 20% broker fee
    const brokerFee = isCapped ? 0 : agentGrossShare * 0.20;
    const afterBroker = Math.max(0, agentGrossShare - brokerFee);
    const net = Math.max(0, afterBroker - totalFlatDeductions);

    const effectivePctGci = gci > 0 ? (net / gci) * 100 : 0;
    const effectivePctPrice = numericSalePrice > 0 ? (net / numericSalePrice) * 100 : 0;

    return {
      gci,
      refPct,
      refFee,
      distributable,
      splitPct,
      agentGrossShare,
      teamShare,
      brokerFee,
      totalFlatDeductions,
      net,
      effectivePctGci,
      effectivePctPrice,
    };
  };

  // Financial results
  const results = useMemo(() => {
    const zillowFeePct = getZillowFeePct(numericSalePrice);
    const all = {
      self: calcSource('self'),
      team: calcSource('team'),
      zillow: calcSource('zillow'),
      other: calcSource('other'),
    };

    return {
      zillowFeePct,
      all,
      active: all[selectedLeadSource],
    };
  }, [
    numericSalePrice,
    commissionRate,
    agentSplitPct,
    isCapped,
    selectedLeadSource,
    includeDeductions,
    otherDeduction,
    brokerDeduction,
  ]);

  const handleCopy = () => {
    const lines = [
      'COMMISSION RESULTS',
      `Sale Price: ${numericSalePrice ? `$${numericSalePrice.toLocaleString()}` : '$0'}`,
      `Commission Rate: ${commissionRate}%`,
      `Lead Source: ${LEAD_SOURCE_LABELS[selectedLeadSource]}`,
      `Gross Commission (GCI): $${Math.round(results.active.gci).toLocaleString()}`,
      `Team Cut: -$${Math.round(results.active.teamShare).toLocaleString()} (${100 - results.active.splitPct}% Split)`,
      `Referral Cut: ${
        results.active.refFee > 0
          ? `-$${Math.round(results.active.refFee).toLocaleString()} (${results.active.refPct}%)`
          : '$0'
      }`,
      `Broker Cap Status: ${isCapped ? 'CAPPED (0% Broker Fee)' : `NOT CAPPED (-$${Math.round(results.active.brokerFee).toLocaleString()} Broker Fee)`}`,
      ...(includeDeductions && results.active.totalFlatDeductions > 0
        ? [`Other Deductions: -$${Math.round(results.active.totalFlatDeductions).toLocaleString()}`]
        : []),
      `NET COMMISSION: $${Math.round(results.active.net).toLocaleString()} (${results.active.effectivePctGci.toFixed(1)}% of GCI)`,
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    if (onShowToast) onShowToast('Results copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const otherSources = (['self', 'team', 'zillow', 'other'] as LeadSource[]).filter(
    (s) => s !== selectedLeadSource
  );

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-6 font-sans text-slate-900 animate-fade-in">
      
      {/* Top Banner */}
      <AdBannerRenderer
        placement="calculator-sidebar"
        ads={ads}
        cityName={currentCity?.name}
        monetizationEnabled={monetizationEnabled}
      />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tighter text-[#FA2D48] leading-none">
          Commission Calculator
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-bold text-slate-800 hover:text-slate-950 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 active:scale-95 cursor-pointer"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-xs font-bold text-slate-800 hover:text-slate-950 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 active:scale-95 cursor-pointer"
          >
            Print
          </button>
        </div>
      </div>

      {/* 2-COLUMN MAIN WORKBENCH: Deal Numbers on Left, Red Tab Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: The Numbers on the Deal */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
          
          {/* 1. Broker Cap Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              Broker Cap Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCapped(true)}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isCapped
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                CAP
              </button>
              <button
                type="button"
                onClick={() => setIsCapped(false)}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  !isCapped
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Not capped
              </button>
            </div>
          </div>

          {/* 2. Type of Lead (Directly under Broker Cap Status) */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 font-sans">
                Type of Lead
              </label>
              <span className="font-bold text-slate-500 font-sans">
                {selectedLeadSource === 'zillow' ? `Zillow (${results.zillowFeePct}%)` : LEAD_SOURCE_LABELS[selectedLeadSource]}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(['self', 'team', 'zillow', 'other'] as LeadSource[]).map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelectedLeadSource(src)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer text-center font-sans ${
                    selectedLeadSource === src
                      ? 'bg-[#FA2D48] text-white shadow-xs ring-1 ring-[#FA2D48]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {LEAD_SOURCE_LABELS[src]}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Sale Price */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="price-input" className="font-bold text-slate-800 font-sans">
                Sale Price
              </label>
              <span className="font-bold text-slate-500 font-sans tabular-nums">
                ${numericSalePrice.toLocaleString()}
              </span>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-bold text-sm pointer-events-none font-sans">
                $
              </span>
              <input
                id="price-input"
                type="text"
                inputMode="numeric"
                value={salePrice !== '' && salePrice > 0 ? salePrice.toLocaleString('en-US') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setSalePrice(raw === '' ? '' : Number(raw));
                }}
                className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-sans tabular-nums"
                placeholder="1,000,000"
              />
            </div>

            {/* Quick price presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {PRICE_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setSalePrice(p.value)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer font-sans ${
                    numericSalePrice === p.value
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Commission Rate & Prominent GCI */}
          <div className="p-3 sm:p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/90 flex items-center justify-between gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 font-sans block">
                Commission Rate
              </label>
              <div className="flex items-center gap-2">
                {COMMISSION_RATE_PRESETS.map((cr) => (
                  <button
                    key={cr}
                    type="button"
                    onClick={() => setCommissionRate(cr)}
                    className={`py-2 px-3.5 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer font-sans select-none active:scale-95 ${
                      commissionRate === cr
                        ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                        : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200/90'
                    }`}
                  >
                    {cr}%
                  </button>
                ))}
              </div>
            </div>

            <div className="text-right pl-3.5 sm:pl-4 border-l border-slate-200/90 shrink-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-sans block">
                Gross GCI
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-sans tracking-tight tabular-nums">
                ${Math.round(results.active.gci).toLocaleString()}
              </div>
            </div>
          </div>

          {/* 5. Agent / Team Split Presets */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800 font-sans">
                Agent / Team Split Preset
              </label>
              <span className="font-bold text-slate-600 font-sans">
                {selectedLeadSource === 'team'
                  ? '50 / 50 (Team Lead)'
                  : selectedLeadSource === 'self'
                  ? `${agentSplitPct} / ${100 - agentSplitPct}`
                  : '50 / 50 (Referral)'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SPLIT_PRESETS.map((sp) => {
                const isSelected =
                  selectedLeadSource === 'self'
                    ? agentSplitPct === sp.agentPct
                    : sp.agentPct === 50;
                return (
                  <button
                    key={sp.label}
                    type="button"
                    onClick={() => {
                      if (selectedLeadSource === 'self') {
                        setAgentSplitPct(sp.agentPct);
                      }
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl transition-all text-center font-sans ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : selectedLeadSource !== 'self'
                        ? 'bg-slate-100 text-slate-400 opacity-60 cursor-default'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
                    }`}
                  >
                    {sp.label}
                  </button>
                );
              })}
            </div>
            {selectedLeadSource === 'team' && (
              <p className="text-[11px] text-slate-500 font-medium font-sans">
                Team leads are calculated at 50/50 split (50% Agent / 50% Team).
              </p>
            )}
          </div>

          {/* 6. Broker and Other Deductions */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">
                Broker and Other deductions
              </span>
              <button
                type="button"
                onClick={() => setIncludeDeductions(!includeDeductions)}
                className="text-xs font-bold text-[#FA2D48] hover:underline cursor-pointer"
              >
                {includeDeductions ? 'On' : 'Off'}
              </button>
            </div>

            {includeDeductions && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-bold block mb-1">
                    Others
                  </span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={otherDeduction}
                      onChange={(e) => setOtherDeduction(parseFloat(e.target.value) || 0)}
                      className="w-full pl-5 pr-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-bold block mb-1">
                    Broker deduction
                  </span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={brokerDeduction}
                      onChange={(e) => setBrokerDeduction(parseFloat(e.target.value) || 0)}
                      className="w-full pl-5 pr-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Red Tab Result & Other Sources Net */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* THE RED TAB RESULT CARD (MAIN CHARACTER: NET AMOUNT, MINOR: GCI) */}
          <div className="rounded-3xl bg-[#FA2D48] text-white p-5 sm:p-6 shadow-lg shadow-rose-500/20 space-y-3 font-sans">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-extrabold text-rose-100 font-sans">
                {LEAD_SOURCE_LABELS[selectedLeadSource]} Result
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold border border-white/30 backdrop-blur-xs font-sans">
                {isCapped ? 'Capped' : '20% Broker Pre-Cap'}
              </span>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-rose-100 block font-sans">
                Net Commission
              </span>
              {/* MAIN CHARACTER: NET AMOUNT */}
              <div className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-white mt-1 tabular-nums">
                ${Math.round(results.active.net).toLocaleString()}
              </div>
            </div>

            {/* DEDUCTIONS TAKEN FROM GCI (TEAM & REFERRAL) */}
            <div className="pt-2 border-t border-white/20 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/15 rounded-xl p-2.5 backdrop-blur-xs">
                <span className="text-[10px] uppercase font-bold text-rose-100 block font-sans">
                  Team Cut
                </span>
                <span className="text-base font-black text-white font-sans tabular-nums block mt-0.5">
                  -${Math.round(results.active.teamShare).toLocaleString()}
                </span>
                <span className="text-[10px] text-rose-200 block opacity-90 font-sans">
                  {100 - results.active.splitPct}% Split
                </span>
              </div>

              <div className="bg-black/15 rounded-xl p-2.5 backdrop-blur-xs">
                <span className="text-[10px] uppercase font-bold text-rose-100 block font-sans">
                  Referral Cut
                </span>
                <span className="text-base font-black text-white font-sans tabular-nums block mt-0.5">
                  {results.active.refFee > 0
                    ? `-$${Math.round(results.active.refFee).toLocaleString()}`
                    : '$0'}
                </span>
                <span className="text-[10px] text-rose-200 block opacity-90 font-sans">
                  {results.active.refPct > 0 ? `${results.active.refPct}% Off GCI` : '0% Direct'}
                </span>
              </div>
            </div>

            {/* MINOR WAY: GCI AND EFFECTIVE METRICS */}
            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-rose-100 font-medium font-sans">
              <span>
                Gross GCI: <strong className="text-white font-bold tabular-nums">${Math.round(results.active.gci).toLocaleString()}</strong>
              </span>
              <span className="tabular-nums">
                {results.active.effectivePctGci.toFixed(1)}% of GCI
              </span>
            </div>
          </div>

          {/* SECONDARY TAB: NET WITH OTHER LEAD SOURCES */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2.5 font-sans">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
                Net Commission with Other Sources
              </span>
              <span className="text-[11px] text-slate-400 font-medium font-sans">
                Tap to switch
              </span>
            </div>

            <div className="space-y-2">
              {otherSources.map((src) => {
                const item = results.all[src];
                return (
                  <div
                    key={src}
                    onClick={() => setSelectedLeadSource(src)}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between font-sans"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-800 block font-sans">
                        {LEAD_SOURCE_LABELS[src]}
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans font-medium">
                        {src === 'zillow' ? `${results.zillowFeePct}% Zillow Flex` : src === 'other' ? '25% Referral' : '0% Referral'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-slate-950 font-sans tabular-nums block">
                        ${Math.round(item.net).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        Net Commission
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM COLLAPSIBLE: STEP-BY-STEP CALCULATIONS AUDIT FOR SELECTED SOURCE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden font-sans">
        <button
          type="button"
          onClick={() => setShowCalculationAudit(!showCalculationAudit)}
          className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer font-sans"
        >
          <span className="font-bold text-xs sm:text-sm text-slate-900 font-sans">
            Calculation Breakdown for {LEAD_SOURCE_LABELS[selectedLeadSource]}
          </span>
          <span className="text-xs font-bold text-slate-500 font-sans">
            {showCalculationAudit ? 'Hide Details' : 'Show Details'}
          </span>
        </button>

        {showCalculationAudit && (
          <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-slate-100 space-y-2 font-sans text-xs text-slate-700 bg-slate-50/50">
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 font-sans">
              <div className="flex justify-between">
                <span>1. Gross Commission (GCI):</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ${numericSalePrice.toLocaleString()} × {commissionRate}% = ${Math.round(results.active.gci).toLocaleString()}
                </span>
              </div>

              {results.active.refFee > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>2. Off-The-Top Referral Fee ({results.active.refPct}%):</span>
                  <span className="font-bold tabular-nums">
                    -${Math.round(results.active.refFee).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>3. Distributable GCI:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ${Math.round(results.active.distributable).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>4. Agent Split ({results.active.splitPct}%):</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  ${Math.round(results.active.agentGrossShare).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>5. Team Split ({100 - results.active.splitPct}%):</span>
                <span className="tabular-nums">
                  ${Math.round(results.active.teamShare).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>6. Broker Cap Status:</span>
                {isCapped ? (
                  <span className="font-bold text-emerald-700">
                    $0 (Capped - 0% Broker Fee)
                  </span>
                ) : (
                  <span className="font-bold text-purple-700 tabular-nums">
                    -${Math.round(results.active.brokerFee).toLocaleString()} (20% Broker Commission)
                  </span>
                )}
              </div>

              {includeDeductions && results.active.totalFlatDeductions > 0 && (
                <div className="flex justify-between text-rose-700">
                  <span>7. Deductions:</span>
                  <span className="font-bold tabular-nums">
                    -${Math.round(results.active.totalFlatDeductions).toLocaleString()} (Others ${otherDeduction} + Broker ${brokerDeduction})
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-slate-200 font-sans text-sm font-black text-slate-950">
                <span>FINAL AGENT NET COMMISSION:</span>
                <span className="text-[#FA2D48] tabular-nums">
                  ${Math.round(results.active.net).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Printer, 
  ChevronDown, 
  ArrowDownRight
} from 'lucide-react';
import { CityInfo, AdBanner, LiveMortgageRates, NewsCategory } from '../types';
import { AdBannerRenderer } from './AdBannerRenderer';

interface BuydownCalculatorProps {
  currentCity?: CityInfo;
  onSelectCity?: (city: CityInfo) => void;
  liveRates?: LiveMortgageRates | null;
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
  onRefreshRates?: () => void;
  isRefreshingRates?: boolean;
  onNavigateCategory?: (category: NewsCategory) => void;
}

export type BuydownType = 
  | '6-mo-1'      // 6-Month 1% buydown (Months 1-6 at Note Rate - 1.00%)
  | '12-mo-0.5'   // 12-Month 0.5% buydown (Months 1-12 at Note Rate - 0.50%)
  | '2-1'         // 2-1 Buydown (Year 1: -2%, Year 2: -1%)
  | '1-0'         // 1-0 Buydown (Year 1: -1%)
  | '3-2-1'       // 3-2-1 Buydown (Year 1: -3%, Year 2: -2%, Year 3: -1%)
  | '3-1';        // 3-1 Buydown (Year 1: -3%, Year 2: -1%)

interface BuydownPeriod {
  periodIndex: number;
  label: string;
  monthsRange: string;
  durationMonths: number;
  rateDiscountPct: number;
  rateDiscountBps: number;
  effectiveRate: number;
  monthlyPayment: number;
  monthlySavings: number;
  periodSavings: number;
  remainingEscrow: number;
  isPermanent: boolean;
}

const LOAN_AMOUNT_PRESETS = [
  { label: '$400k', value: 400000 },
  { label: '$600k', value: 600000 },
  { label: '$800k', value: 800000 },
  { label: '$1.0M', value: 1000000 },
  { label: '$1.2M', value: 1200000 },
];

export const BuydownCalculator: React.FC<BuydownCalculatorProps> = ({
  currentCity,
  liveRates: propLiveRates,
  ads = [],
  monetizationEnabled = false,
  onRefreshRates,
  isRefreshingRates = false,
  onNavigateCategory,
}) => {
  // Extract live rate or default to 6.875
  const initialLiveRate = useMemo(() => {
    if (!propLiveRates?.mortgage30Year) return 6.875;
    const val = parseFloat(propLiveRates.mortgage30Year.replace('%', ''));
    return isNaN(val) ? 6.875 : val;
  }, [propLiveRates?.mortgage30Year]);

  // Core Inputs - Clean & Simple
  const [loanAmount, setLoanAmount] = useState<number | ''>(600000);
  const numericLoanAmount = typeof loanAmount === 'number' ? loanAmount : 0;
  const [noteRate, setNoteRate] = useState<number>(() => initialLiveRate);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [buydownType, setBuydownType] = useState<BuydownType>('2-1');
  
  // Compact BPS step field (default 100 bps = 1.00%)
  const [bpsStep, setBpsStep] = useState<number>(100);

  // UI state
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [showFaq, setShowFaq] = useState<boolean>(false);

  // Calculate monthly P&I payment
  const calcPayment = (principal: number, annualRatePct: number, termYears: number): number => {
    if (principal <= 0 || termYears <= 0) return 0;
    if (annualRatePct <= 0) return principal / (termYears * 12);
    const r = annualRatePct / 100 / 12;
    const n = termYears * 12;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  // Full monthly payment at standard Note Rate
  const fullMonthlyPayment = useMemo(() => {
    return calcPayment(numericLoanAmount, noteRate, loanTermYears);
  }, [numericLoanAmount, noteRate, loanTermYears]);

  // Handle buydown structure definition
  const periodsDefinition = useMemo(() => {
    const stepPct = bpsStep / 100;

    switch (buydownType) {
      case '6-mo-1':
        // Lender scenario: 6 Month 1% buydown
        return [
          {
            label: 'Months 1–6 (First 6 Months)',
            monthsRange: 'Months 1–6',
            durationMonths: 6,
            rateDiscountPct: stepPct * 1, // 1.00% if bpsStep=100
            rateDiscountBps: bpsStep * 1,
          },
        ];

      case '12-mo-0.5':
        // Lender scenario: 12 Month 0.5% buydown
        return [
          {
            label: 'Months 1–12 (Full First Year)',
            monthsRange: 'Months 1–12',
            durationMonths: 12,
            rateDiscountPct: (bpsStep / 100) * 0.5, // 0.50% if bpsStep=100
            rateDiscountBps: Math.round(bpsStep * 0.5),
          },
        ];

      case '1-0':
        return [
          {
            label: 'Year 1 (Months 1–12)',
            monthsRange: 'Months 1–12',
            durationMonths: 12,
            rateDiscountPct: stepPct * 1,
            rateDiscountBps: bpsStep * 1,
          },
        ];

      case '2-1':
        return [
          {
            label: 'Year 1 (Months 1–12)',
            monthsRange: 'Months 1–12',
            durationMonths: 12,
            rateDiscountPct: stepPct * 2,
            rateDiscountBps: bpsStep * 2,
          },
          {
            label: 'Year 2 (Months 13–24)',
            monthsRange: 'Months 13–24',
            durationMonths: 12,
            rateDiscountPct: stepPct * 1,
            rateDiscountBps: bpsStep * 1,
          },
        ];

      case '3-2-1':
        return [
          {
            label: 'Year 1 (Months 1–12)',
            monthsRange: 'Months 1–12',
            durationMonths: 12,
            rateDiscountPct: stepPct * 3,
            rateDiscountBps: bpsStep * 3,
          },
          {
            label: 'Year 2 (Months 13–24)',
            monthsRange: 'Months 13–24',
            durationMonths: 12,
            rateDiscountPct: stepPct * 2,
            rateDiscountBps: bpsStep * 2,
          },
          {
            label: 'Year 3 (Months 25–36)',
            monthsRange: 'Months 25–36',
            durationMonths: 12,
            rateDiscountPct: stepPct * 1,
            rateDiscountBps: bpsStep * 1,
          },
        ];

      case '3-1':
        return [
          {
            label: 'Year 1 (Months 1–12)',
            monthsRange: 'Months 1–12',
            durationMonths: 12,
            rateDiscountPct: stepPct * 3,
            rateDiscountBps: bpsStep * 3,
          },
          {
            label: 'Year 2 (Months 13–24)',
            monthsRange: 'Months 13–24',
            durationMonths: 12,
            rateDiscountPct: stepPct * 1,
            rateDiscountBps: bpsStep * 1,
          },
        ];

      default:
        return [];
    }
  }, [buydownType, bpsStep]);

  // Calculate schedule, monthly savings, and total escrow
  const { schedule, totalBuydownCost, initialMonthlySavings, initialMonthlyPayment, totalBuydownMonths } = useMemo(() => {
    let runningTotalCost = 0;
    const periodCalculations: Array<{
      reducedRate: number;
      reducedPayment: number;
      mSavings: number;
      totSavings: number;
    }> = [];

    // First pass: compute savings per period
    periodsDefinition.forEach((p) => {
      const reducedRate = Math.max(0.1, noteRate - p.rateDiscountPct);
      const reducedPayment = calcPayment(numericLoanAmount, reducedRate, loanTermYears);
      const mSavings = Math.max(0, fullMonthlyPayment - reducedPayment);
      const totSavings = mSavings * p.durationMonths;
      periodCalculations.push({
        reducedRate,
        reducedPayment,
        mSavings,
        totSavings,
      });
      runningTotalCost += totSavings;
    });

    const totalEscrow = runningTotalCost;
    let currentRemainingEscrow = totalEscrow;
    const finalSchedule: BuydownPeriod[] = [];
    let cumulativeMonths = 0;

    periodsDefinition.forEach((p, idx) => {
      const calc = periodCalculations[idx];
      currentRemainingEscrow -= calc.totSavings;
      cumulativeMonths += p.durationMonths;

      finalSchedule.push({
        periodIndex: idx + 1,
        label: p.label,
        monthsRange: p.monthsRange,
        durationMonths: p.durationMonths,
        rateDiscountPct: p.rateDiscountPct,
        rateDiscountBps: p.rateDiscountBps,
        effectiveRate: calc.reducedRate,
        monthlyPayment: calc.reducedPayment,
        monthlySavings: calc.mSavings,
        periodSavings: calc.totSavings,
        remainingEscrow: Math.max(0, currentRemainingEscrow),
        isPermanent: false,
      });
    });

    // Add permanent period
    const startPermanentMonth = cumulativeMonths + 1;
    const totalLoanMonths = loanTermYears * 12;
    const permanentLabel = cumulativeMonths < 12 
      ? `Month ${startPermanentMonth}+ (Permanent)` 
      : `Year ${Math.floor(cumulativeMonths / 12) + 1}+ (Permanent)`;

    finalSchedule.push({
      periodIndex: finalSchedule.length + 1,
      label: permanentLabel,
      monthsRange: `Months ${startPermanentMonth}–${totalLoanMonths}`,
      durationMonths: Math.max(0, totalLoanMonths - cumulativeMonths),
      rateDiscountPct: 0,
      rateDiscountBps: 0,
      effectiveRate: noteRate,
      monthlyPayment: fullMonthlyPayment,
      monthlySavings: 0,
      periodSavings: 0,
      remainingEscrow: 0,
      isPermanent: true,
    });

    const initSavings = finalSchedule.length > 0 ? finalSchedule[0].monthlySavings : 0;
    const initPayment = finalSchedule.length > 0 ? finalSchedule[0].monthlyPayment : fullMonthlyPayment;

    return {
      schedule: finalSchedule,
      totalBuydownCost: totalEscrow,
      initialMonthlySavings: initSavings,
      initialMonthlyPayment: initPayment,
      totalBuydownMonths: cumulativeMonths,
    };
  }, [periodsDefinition, numericLoanAmount, noteRate, loanTermYears, fullMonthlyPayment]);

  const costAsPercentOfLoan = numericLoanAmount > 0 ? (totalBuydownCost / numericLoanAmount) * 100 : 0;
  const costInBps = numericLoanAmount > 0 ? Math.round((totalBuydownCost / numericLoanAmount) * 10000) : 0;

  // Dynamic label for the initial payment metric depending on program
  const initialPaymentTitle = useMemo(() => {
    switch (buydownType) {
      case '6-mo-1':
        return '6-Month Payment';
      case '12-mo-0.5':
        return '12-Month Payment';
      case '1-0':
      case '2-1':
      case '3-2-1':
      case '3-1':
        return 'Year 1 Payment';
      default:
        return 'Initial Payment';
    }
  }, [buydownType]);

  // Copy Executive Summary
  const handleCopySummary = () => {
    const programName = 
      buydownType === '6-mo-1' ? '6-Month 1% Buydown' :
      buydownType === '12-mo-0.5' ? '12-Month 0.5% Buydown' :
      buydownType === '2-1' ? '2-1 Buydown' :
      buydownType === '1-0' ? '1-0 Buydown' :
      buydownType === '3-2-1' ? '3-2-1 Buydown' : '3-1 Buydown';

    const lines = [
      `TEMPORARY ${programName.toUpperCase()} SUMMARY`,
      `Loan Amount: $${numericLoanAmount.toLocaleString()}`,
      `Note Rate: ${noteRate.toFixed(3)}% (${loanTermYears}-Year Term)`,
      `Total Buydown Escrow Cost: $${Math.round(totalBuydownCost).toLocaleString()} (${costAsPercentOfLoan.toFixed(2)}% / ${costInBps} BPS of loan)`,
      `Initial Monthly Savings: $${Math.round(initialMonthlySavings).toLocaleString()}/month`,
      '',
      'PAYMENT SCHEDULE:',
      ...schedule.map((s) => {
        if (!s.isPermanent) {
          return `• ${s.label}: Rate ${s.effectiveRate.toFixed(3)}% (-${s.rateDiscountPct.toFixed(2)}%) | Payment: $${Math.round(s.monthlyPayment).toLocaleString()}/mo | Saves: $${Math.round(s.monthlySavings).toLocaleString()}/mo ($${Math.round(s.periodSavings).toLocaleString()} total)`;
        }
        return `• ${s.label}: Note Rate ${s.effectiveRate.toFixed(3)}% | Permanent Payment: $${Math.round(s.monthlyPayment).toLocaleString()}/mo`;
      }),
      '',
      `Total Borrower Subsidy Savings: $${Math.round(totalBuydownCost).toLocaleString()} over ${totalBuydownMonths} months.`,
      'Calculated via ReaL. Market Hub'
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 font-sans animate-fade-in text-slate-900">
      
      {/* Top Banner / Ad Placement */}
      <AdBannerRenderer
        placement="calculator-sidebar"
        ads={ads}
        cityName={currentCity?.name}
        monetizationEnabled={monetizationEnabled}
      />

      {/* Header Title & Actions */}
      <div className="border-b border-slate-200/80 pb-4 sm:pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tighter text-[#FA2D48] leading-none">
            Temporary Buydown Calculator
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Copy summary to clipboard"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-900" />
                  <span className="text-slate-900 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              title="Print breakdown"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Key Financial Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Configuration Form (Clean & Minimalist) */}
        <div className="lg:col-span-6 space-y-5 bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-7 shadow-xs">
          
          {/* 1. Direct Loan Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="loan-amount-input" className="text-sm font-bold text-slate-800">
                Loan Amount
              </label>
              <span className="text-xs font-semibold text-slate-500">
                ${numericLoanAmount.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-base">
                $
              </span>
              <input
                id="loan-amount-input"
                type="text"
                inputMode="numeric"
                value={loanAmount !== '' && loanAmount > 0 ? loanAmount.toLocaleString('en-US') : ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  setLoanAmount(raw === '' ? '' : Number(raw));
                }}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 text-slate-950 font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#FA2D48]/20 focus:border-[#FA2D48] transition-all"
                placeholder="600,000"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto scrollbar-none">
              {LOAN_AMOUNT_PRESETS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setLoanAmount(p.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    loanAmount === p.value
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Note Rate Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="note-rate-input" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>Note Rate</span>
                <span className="text-[11px] font-normal text-slate-500">(Permanent Loan Rate)</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  id="note-rate-input"
                  type="number"
                  min="1"
                  max="20"
                  step="0.025"
                  value={noteRate || ''}
                  onChange={(e) => setNoteRate(parseFloat(e.target.value) || 0)}
                  className="w-full pl-4 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 text-slate-950 font-bold text-base focus:outline-none focus:ring-2 focus:ring-[#FA2D48]/20 focus:border-[#FA2D48] transition-all"
                  placeholder="6.875"
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
                  %
                </span>
              </div>

              {/* Step Buttons (+ / - 0.125%) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setNoteRate((prev) => Math.max(0.25, Math.round((prev - 0.125) * 1000) / 1000))}
                  className="w-9 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-all active:scale-95 border border-slate-200"
                  title="Minus 0.125%"
                >
                  -⅛
                </button>
                <button
                  type="button"
                  onClick={() => setNoteRate((prev) => Math.round((prev + 0.125) * 1000) / 1000)}
                  className="w-9 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center transition-all active:scale-95 border border-slate-200"
                  title="Plus 0.125%"
                >
                  +⅛
                </button>
              </div>
            </div>

            {/* Quick Rate Options */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-0.5">
              {[6.5, 6.75, 6.875, 7.0, 7.25, 7.5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setNoteRate(r)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all ${
                    Math.abs(noteRate - r) < 0.001
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Loan Term Selection */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-800">
              Loan Term
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '30 yr', val: 30 },
                { label: '20 yr', val: 20 },
                { label: '15 yr', val: 15 },
              ].map((term) => (
                <button
                  key={term.val}
                  type="button"
                  onClick={() => setLoanTermYears(term.val)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                    loanTermYears === term.val
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {term.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Buydown Structure Selection (Including Lender 6-Month 1% & 12-Month 0.5%) */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                Buydown Scenario / Program
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Select Option
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { 
                  id: '6-mo-1', 
                  label: '6-Month 1% Buydown', 
                  badge: 'Lender Offer',
                  desc: 'Months 1–6: -1.00% rate reduction' 
                },
                { 
                  id: '12-mo-0.5', 
                  label: '12-Month 0.5% Buydown', 
                  badge: 'Lender Offer',
                  desc: 'Months 1–12: -0.50% rate reduction' 
                },
                { 
                  id: '2-1', 
                  label: '2-1 Buydown', 
                  badge: 'Popular',
                  desc: 'Yr 1: -2.00%, Yr 2: -1.00%' 
                },
                { 
                  id: '1-0', 
                  label: '1-0 Buydown', 
                  badge: '1 Year',
                  desc: 'Yr 1: -1.00% rate reduction' 
                },
                { 
                  id: '3-2-1', 
                  label: '3-2-1 Buydown', 
                  badge: '3 Years',
                  desc: 'Yr 1: -3%, Yr 2: -2%, Yr 3: -1%' 
                },
                { 
                  id: '3-1', 
                  label: '3-1 Buydown', 
                  badge: '2 Years',
                  desc: 'Yr 1: -3.00%, Yr 2: -1.00%' 
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBuydownType(item.id as BuydownType)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    buydownType === item.id
                      ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm">{item.label}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                      buydownType === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1 ${buydownType === item.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. BPS / Points Reduction - SMALL COMPACT FIELD (USER REQUESTED) */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
            <div>
              <label htmlFor="bps-step-input" className="text-xs font-bold text-slate-800 block">
                BPS / Points Step
              </label>
              <span className="text-[11px] text-slate-500">
                100 BPS = 1.00% rate discount
              </span>
            </div>

            {/* Small compact field just for the points */}
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                id="bps-step-input"
                type="number"
                min="10"
                max="500"
                step="10"
                value={bpsStep || ''}
                onChange={(e) => setBpsStep(Math.max(1, parseInt(e.target.value) || 100))}
                className="w-20 text-center py-1.5 px-2 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-lg border border-slate-300 text-slate-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                placeholder="100"
              />
              <span className="text-xs font-semibold text-slate-500">
                BPS
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Executive Financial Summary & Monthly Progression */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Main Total Escrow / Subsidy Cost Card */}
          <div className="rounded-3xl bg-[#FA2D48] text-white p-4 sm:p-7 shadow-lg shadow-rose-500/20 relative overflow-hidden space-y-3.5 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-4">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-extrabold text-rose-100 block">
                  Total Buydown Cost
                </span>
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-0.5">
                  ${Math.round(totalBuydownCost).toLocaleString()}
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 bg-black/10 sm:bg-transparent -mx-1 sm:mx-0 p-2 sm:p-0 rounded-xl sm:rounded-none">
                <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] sm:text-xs font-extrabold border border-white/30 backdrop-blur-xs">
                  {costAsPercentOfLoan.toFixed(2)}% ({costInBps} BPS)
                </span>
                <div className="text-[11px] text-rose-100 font-medium">
                  {totalBuydownMonths} Months Discount
                </div>
              </div>
            </div>

            {/* Metric Highlights - Fluid Responsive Stack on Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-white/15 rounded-2xl p-3 sm:p-3.5 border border-white/25 backdrop-blur-xs flex sm:flex-col items-center sm:items-start justify-between">
                <div>
                  <div className="text-[10px] text-rose-100 uppercase font-bold tracking-wider">{initialPaymentTitle}</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    ${Math.round(initialMonthlyPayment).toLocaleString()}<span className="text-xs font-normal text-rose-100">/mo</span>
                  </div>
                </div>
                <div className="text-right sm:text-left mt-0 sm:mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/20 text-white text-[11px] font-bold border border-white/30">
                    <ArrowDownRight className="w-3.5 h-3.5 text-white" />
                    Save ${Math.round(initialMonthlySavings).toLocaleString()}/mo
                  </span>
                </div>
              </div>

              <div className="bg-white/15 rounded-2xl p-3 sm:p-3.5 border border-white/25 backdrop-blur-xs flex sm:flex-col items-center sm:items-start justify-between">
                <div>
                  <div className="text-[10px] text-rose-100 uppercase font-bold tracking-wider">Permanent Note Payment</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    ${Math.round(fullMonthlyPayment).toLocaleString()}<span className="text-xs font-normal text-rose-100">/mo</span>
                  </div>
                </div>
                <div className="text-right sm:text-left text-[11px] text-rose-100 font-medium mt-0 sm:mt-1.5">
                  at {noteRate.toFixed(3)}% note rate
                </div>
              </div>
            </div>
          </div>

          {/* MONTHLY PROGRESSION - Clean & Crisp on Mobile & Desktop */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Monthly Payment Progression
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Exact interest rates, monthly payments, and savings for each period.
              </p>
            </div>

            <div className="space-y-3">
              {schedule.map((item) => {
                const isPermanent = item.isPermanent;

                return (
                  <div 
                    key={item.label}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      isPermanent 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: Label, Discount Badge, and Payment */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-extrabold text-sm text-slate-900">
                            {item.label}
                          </span>
                          {!isPermanent && (
                            <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200/80">
                              -{item.rateDiscountPct.toFixed(2)}% Rate
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                          <span>Rate: <strong className="text-slate-800">{item.effectiveRate.toFixed(3)}%</strong></span>
                          <span>•</span>
                          <span>{item.monthsRange}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base sm:text-lg font-black text-slate-950">
                          ${Math.round(item.monthlyPayment).toLocaleString()}
                          <span className="text-xs font-normal text-slate-400">/mo</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row / Callout: Savings or Permanent Note */}
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 text-xs">
                      {!isPermanent ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-700 font-semibold bg-emerald-50/70 sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none border border-emerald-100 sm:border-0">
                          <span className="text-emerald-700 flex items-center gap-1">
                            <ArrowDownRight className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                            <span>Save <strong className="font-black text-emerald-800">${Math.round(item.monthlySavings).toLocaleString()}</strong>/month</span>
                          </span>
                          <span className="text-emerald-800/80 text-[11px] font-medium sm:font-semibold">
                            ${Math.round(item.periodSavings).toLocaleString()} saved over {item.durationMonths} mos
                          </span>
                        </div>
                      ) : (
                        <div className="text-slate-500 font-medium text-[11px] sm:text-xs">
                          Standard permanent payment for remaining {item.durationMonths} months
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* DETAILED SCHEDULE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-950 tracking-tight">
              Detailed Period & Subsidy Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Full breakdown of interest rate, payment, monthly discount, and period totals.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Total Escrow Needed: <strong className="text-slate-950">${Math.round(totalBuydownCost).toLocaleString()}</strong>
            <span className="text-slate-500 font-medium ml-1.5">({costInBps} BPS / {costAsPercentOfLoan.toFixed(2)}%)</span>
          </div>
        </div>

        {/* Mobile View: High-Clarity Card Stack for Small Screens (No horizontal overflow) */}
        <div className="sm:hidden space-y-3">
          {schedule.map((row) => (
            <div
              key={row.label}
              className={`p-3.5 rounded-2xl border ${
                row.isPermanent
                  ? 'bg-slate-50/70 border-slate-200'
                  : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div>
                  <div className="font-extrabold text-sm text-slate-950">{row.label}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{row.monthsRange}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900 text-white text-xs font-bold">
                    {row.effectiveRate.toFixed(3)}%
                  </span>
                  {row.rateDiscountPct > 0 && (
                    <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                      -{row.rateDiscountPct.toFixed(2)}% rate
                    </span>
                  )}
                </div>
              </div>

              {/* 2x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2.5 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Monthly Payment
                  </span>
                  <span className="text-sm font-black text-slate-950 mt-0.5 block">
                    ${Math.round(row.monthlyPayment).toLocaleString()}
                    <span className="text-[10px] font-normal text-slate-500">/mo</span>
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Monthly Savings
                  </span>
                  <span className={`text-sm font-black mt-0.5 block ${row.monthlySavings > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {row.monthlySavings > 0 ? `+$${Math.round(row.monthlySavings).toLocaleString()}` : '—'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Period Total
                  </span>
                  <span className={`text-sm font-black mt-0.5 block ${row.periodSavings > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                    {row.periodSavings > 0 ? `$${Math.round(row.periodSavings).toLocaleString()}` : '—'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Remaining Escrow
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-700 mt-0.5 block">
                    ${Math.round(row.remainingEscrow).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Footer Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1.5 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Total Buydown Escrow Fund</span>
              <span className="font-black text-white text-sm">
                ${Math.round(totalBuydownCost).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800">
              <span>Rate Sheet Cost</span>
              <span className="font-bold text-rose-300">{costInBps} BPS ({costAsPercentOfLoan.toFixed(2)}% of loan)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Remaining After Program</span>
              <span className="font-mono font-bold text-emerald-400">$0.00 (Fully utilized)</span>
            </div>
          </div>
        </div>

        {/* Desktop View: Full Data Table (Shown on sm: and up) */}
        <div className="hidden sm:block overflow-x-auto scrollbar-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                <th className="py-2.5 px-3 rounded-l-xl">Period</th>
                <th className="py-2.5 px-3">Effective Rate</th>
                <th className="py-2.5 px-3">Monthly Payment</th>
                <th className="py-2.5 px-3">Monthly Savings</th>
                <th className="py-2.5 px-3">Total Period Savings</th>
                <th className="py-2.5 px-3 rounded-r-xl">Remaining Escrow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {schedule.map((row) => (
                <tr
                  key={row.label}
                  className={`transition-colors ${
                    row.isPermanent ? 'bg-slate-50/50 font-medium' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-950">{row.label}</div>
                    <div className="text-[10px] text-slate-400">{row.monthsRange}</div>
                  </td>

                  <td className="py-3 px-3 font-bold text-slate-900">
                    {row.effectiveRate.toFixed(3)}%
                    {row.rateDiscountPct > 0 && (
                      <span className="text-[10px] font-normal text-slate-500 block">
                        (-{row.rateDiscountPct.toFixed(2)}%)
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-extrabold text-slate-950">
                    ${Math.round(row.monthlyPayment).toLocaleString()}
                  </td>

                  <td className="py-3 px-3 font-bold text-slate-900">
                    {row.monthlySavings > 0 ? (
                      `+$${Math.round(row.monthlySavings).toLocaleString()}/mo`
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-bold text-slate-900">
                    {row.periodSavings > 0 ? (
                      `$${Math.round(row.periodSavings).toLocaleString()}`
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600">
                    ${Math.round(row.remainingEscrow).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50/90 font-bold text-xs text-slate-900">
                <td className="py-3 px-3" colSpan={3}>
                  <div className="text-slate-950 font-extrabold">Total Buydown Escrow Fund:</div>
                </td>
                <td className="py-3 px-3 font-extrabold text-slate-950" colSpan={2}>
                  ${Math.round(totalBuydownCost).toLocaleString()} Total Savings ({costInBps} BPS)
                </td>
                <td className="py-3 px-3 font-mono font-bold text-slate-950">
                  $0.00
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Concise How It Works Section */}
      <div className="rounded-3xl bg-slate-50 border border-slate-200/90 p-5 sm:p-6 space-y-3">
        <button
          type="button"
          onClick={() => setShowFaq(!showFaq)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <h4 className="text-sm font-bold text-slate-950 tracking-tight">
            How Temporary Mortgage Buydowns Work
          </h4>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showFaq ? 'rotate-180' : ''}`} />
        </button>

        {showFaq && (
          <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                Dollar Value vs. BPS on Lender Sheets
              </div>
              <p>
                <strong>BPS (Basis Points)</strong> is the buydown cost as a percentage of the loan amount (100 BPS = 1.00% of loan = $1,000 per $100k). Lenders publish BPS on rate sheets so the cost scales to any loan balance. The <strong>Dollar Value</strong> is the actual escrow check required at closing (Loan Amount × BPS / 10,000). Both are shown directly in the calculator.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                6-Month & 12-Month Buydowns
              </div>
              <p>
                Short-term buydowns like the 6-Month 1% or 12-Month 0.5% lower your payment immediately upon moving in, giving you financial breathing room during the first critical months of homeownership.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                2-1, 3-1 & 3-2-1 Buydowns
              </div>
              <p>
                Multi-year buydowns step up predictably: in a 2-1 buydown, your rate is 2% lower in Year 1 and 1% in Year 2. In a 3-1 buydown, your rate is 3% lower in Year 1 and 1% in Year 2. In a 3-2-1 buydown, rates step down 3%, 2%, and 1% across three years before returning to the full note rate.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">
                Escrow Subsidy Account
              </div>
              <p>
                The total cost of the buydown is funded upfront into an escrow account. Each month, the loan servicer uses these funds to cover the difference between your reduced payment and the full note rate payment.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default BuydownCalculator;

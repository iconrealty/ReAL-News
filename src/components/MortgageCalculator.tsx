import React, { useState, useMemo } from 'react';
import { CityInfo } from '../types';

interface MortgageCalculatorProps {
  currentCity?: CityInfo;
  onSelectCity?: (city: CityInfo) => void;
  fredStats?: {
    mortgage30Year?: string;
    mortgage15Year?: string;
    asOfDate?: string;
    source?: string;
  } | null;
}

const PRICE_PRESETS = [750000, 1150000, 1500000, 2000000, 3000000];
const DOWN_PERCENT_PRESETS = [3.5, 5, 10, 15, 20, 25, 30];

interface AppleToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  id?: string;
}

const AppleToggle: React.FC<AppleToggleProps> = ({ enabled, onChange, label, id }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    id={id}
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-1 ${
      enabled ? 'bg-emerald-500' : 'bg-slate-300'
    }`}
  >
    <span className="sr-only">{label || 'Toggle option'}</span>
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  currentCity,
  fredStats,
}) => {
  // Parse numeric rates from FRED stats if available (e.g. "6.78%" -> 6.78)
  const fred30Num = useMemo(() => {
    if (!fredStats?.mortgage30Year) return 6.78;
    const val = parseFloat(fredStats.mortgage30Year.replace('%', ''));
    return isNaN(val) ? 6.78 : val;
  }, [fredStats?.mortgage30Year]);

  const fred15Num = useMemo(() => {
    if (!fredStats?.mortgage15Year) return 5.98;
    const val = parseFloat(fredStats.mortgage15Year.replace('%', ''));
    return isNaN(val) ? 5.98 : val;
  }, [fredStats?.mortgage15Year]);

  const liveRates = useMemo(() => [
    { label: '30-Yr Fixed (FRED)', rate: fred30Num, term: 30, tag: 'Official FRED' },
    { label: '15-Yr Fixed (FRED)', rate: fred15Num, term: 15, tag: 'Official FRED' },
    { label: 'FHA 30-Yr', rate: parseFloat((fred30Num - 0.43).toFixed(2)), term: 30, tag: 'Low Down' },
    { label: 'VA 30-Yr', rate: parseFloat((fred30Num - 0.53).toFixed(2)), term: 30, tag: 'Veterans' },
    { label: '5/1 ARM', rate: parseFloat((fred30Num - 0.33).toFixed(2)), term: 30, tag: 'Adjustable' },
  ], [fred30Num, fred15Num]);

  // Core Loan Inputs
  const [homePrice, setHomePrice] = useState<number | ''>(1150000); // Default Orange County home price
  const [downPaymentMode, setDownPaymentMode] = useState<'percent' | 'dollar'>('percent');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number | ''>(20);
  const [downPaymentDollar, setDownPaymentDollar] = useState<number | ''>(230000);
  const [interestRate, setInterestRate] = useState<number | ''>(fred30Num);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);

  // Sync interestRate when FRED stats load
  React.useEffect(() => {
    if (fred30Num) {
      setInterestRate(fred30Num);
    }
  }, [fred30Num]);

  // Optional Extra Costs Toggles (iPhone/Apple style green/grey toggle, set by default to inactive false)
  const [includeTaxes, setIncludeTaxes] = useState<boolean>(false);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(false);
  const [includeHoa, setIncludeHoa] = useState<boolean>(false);

  // Optional Extra Costs Inputs
  const [yearlyTaxesMode, setYearlyTaxesMode] = useState<'percent' | 'dollar'>('percent');
  const [yearlyTaxesPercent, setYearlyTaxesPercent] = useState<number | ''>(1.1); // ~1.1% OC property tax
  const [yearlyTaxesDollar, setYearlyTaxesDollar] = useState<number | ''>(12650);
  const [yearlyInsurance, setYearlyInsurance] = useState<number | ''>(1800); // $150/mo
  const [monthlyHoa, setMonthlyHoa] = useState<number | ''>(350); // $350/mo
  const [includePmi, setIncludePmi] = useState<boolean>(true);

  // View state for Amortization vs Breakdown
  const [activeTab, setActiveTab] = useState<'breakdown' | 'schedule'>('breakdown');
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Synchronize Down Payment when Home Price or Mode changes
  const handleHomePriceChange = (newPrice: number | '') => {
    if (newPrice === '') {
      setHomePrice('');
      setDownPaymentDollar('');
      setYearlyTaxesDollar('');
      return;
    }
    const val = Math.max(0, newPrice);
    setHomePrice(val);
    const currentPct = downPaymentPercent === '' ? 0 : downPaymentPercent;
    const currentTaxPct = yearlyTaxesPercent === '' ? 0 : yearlyTaxesPercent;
    if (downPaymentMode === 'percent') {
      setDownPaymentDollar(Math.round((val * currentPct) / 100));
    } else {
      const currentDollar = downPaymentDollar === '' ? 0 : downPaymentDollar;
      const pct = val > 0 ? (currentDollar / val) * 100 : 0;
      setDownPaymentPercent(parseFloat(pct.toFixed(2)));
    }
    // Also sync tax dollar if in percent mode
    if (yearlyTaxesMode === 'percent') {
      setYearlyTaxesDollar(Math.round((val * currentTaxPct) / 100));
    }
  };

  const handleDownPercentChange = (pct: number | '') => {
    if (pct === '') {
      setDownPaymentPercent('');
      setDownPaymentDollar('');
      return;
    }
    const cleanPct = Math.min(100, Math.max(0, pct));
    setDownPaymentPercent(cleanPct);
    const hp = homePrice === '' ? 0 : homePrice;
    setDownPaymentDollar(Math.round((hp * cleanPct) / 100));
  };

  const handleDownDollarChange = (dlr: number | '') => {
    if (dlr === '') {
      setDownPaymentDollar('');
      setDownPaymentPercent('');
      return;
    }
    const cleanDlr = Math.max(0, dlr);
    setDownPaymentDollar(cleanDlr);
    const hp = homePrice === '' ? 0 : homePrice;
    const pct = hp > 0 ? (cleanDlr / hp) * 100 : 0;
    setDownPaymentPercent(parseFloat(pct.toFixed(2)));
  };

  const toggleDownPaymentMode = (mode: 'percent' | 'dollar') => {
    setDownPaymentMode(mode);
    const hp = homePrice === '' ? 0 : homePrice;
    const currentPct = downPaymentPercent === '' ? 0 : downPaymentPercent;
    const currentDollar = downPaymentDollar === '' ? 0 : downPaymentDollar;
    if (mode === 'percent') {
      setDownPaymentDollar(Math.round((hp * currentPct) / 100));
    } else {
      const pct = hp > 0 ? (currentDollar / hp) * 100 : 0;
      setDownPaymentPercent(parseFloat(pct.toFixed(2)));
    }
  };

  const handleTaxPercentChange = (pct: number | '') => {
    if (pct === '') {
      setYearlyTaxesPercent('');
      setYearlyTaxesDollar('');
      return;
    }
    setYearlyTaxesPercent(pct);
    const hp = homePrice === '' ? 0 : homePrice;
    setYearlyTaxesDollar(Math.round((hp * pct) / 100));
  };

  const handleTaxDollarChange = (dlr: number | '') => {
    if (dlr === '') {
      setYearlyTaxesDollar('');
      setYearlyTaxesPercent('');
      return;
    }
    setYearlyTaxesDollar(dlr);
    const hp = homePrice === '' ? 0 : homePrice;
    const pct = hp > 0 ? (dlr / hp) * 100 : 0;
    setYearlyTaxesPercent(parseFloat(pct.toFixed(2)));
  };

  const toggleTaxMode = (mode: 'percent' | 'dollar') => {
    setYearlyTaxesMode(mode);
    const hp = homePrice === '' ? 0 : homePrice;
    const currentPct = yearlyTaxesPercent === '' ? 0 : yearlyTaxesPercent;
    const currentTaxDollar = yearlyTaxesDollar === '' ? 0 : yearlyTaxesDollar;
    if (mode === 'percent') {
      setYearlyTaxesDollar(Math.round((hp * currentPct) / 100));
    } else {
      const pct = hp > 0 ? (currentTaxDollar / hp) * 100 : 0;
      setYearlyTaxesPercent(parseFloat(pct.toFixed(2)));
    }
  };

  // Safe numeric values for calculations
  const numericHomePrice = useMemo(() => (homePrice === '' ? 0 : homePrice), [homePrice]);
  const numericInterestRate = useMemo(() => (interestRate === '' ? 0 : interestRate), [interestRate]);
  const numericYearlyInsurance = useMemo(() => (yearlyInsurance === '' ? 0 : yearlyInsurance), [yearlyInsurance]);
  const numericMonthlyHoa = useMemo(() => (monthlyHoa === '' ? 0 : monthlyHoa), [monthlyHoa]);

  // Calculations
  const calculatedDownPayment = useMemo(() => {
    if (downPaymentMode === 'percent') {
      const pct = downPaymentPercent === '' ? 0 : downPaymentPercent;
      return Math.round((numericHomePrice * pct) / 100);
    }
    return downPaymentDollar === '' ? 0 : downPaymentDollar;
  }, [numericHomePrice, downPaymentMode, downPaymentPercent, downPaymentDollar]);

  const downPaymentActualPct = useMemo(() => {
    return numericHomePrice > 0 ? (calculatedDownPayment / numericHomePrice) * 100 : 0;
  }, [numericHomePrice, calculatedDownPayment]);

  const loanAmount = useMemo(() => {
    return Math.max(0, numericHomePrice - calculatedDownPayment);
  }, [numericHomePrice, calculatedDownPayment]);

  // Monthly Principal & Interest
  const monthlyPrincipalInterest = useMemo(() => {
    if (loanAmount <= 0) return 0;
    const r = numericInterestRate / 100 / 12;
    const n = loanTermYears * 12;
    if (r === 0) return loanAmount / n;
    const monthly = loanAmount * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    return isNaN(monthly) ? 0 : monthly;
  }, [loanAmount, numericInterestRate, loanTermYears]);

  // Monthly Taxes (Raw & Active)
  const rawMonthlyTaxes = useMemo(() => {
    if (yearlyTaxesMode === 'percent') {
      const pct = yearlyTaxesPercent === '' ? 0 : yearlyTaxesPercent;
      return (numericHomePrice * (pct / 100)) / 12;
    }
    const dlr = yearlyTaxesDollar === '' ? 0 : yearlyTaxesDollar;
    return dlr / 12;
  }, [numericHomePrice, yearlyTaxesMode, yearlyTaxesPercent, yearlyTaxesDollar]);

  const monthlyTaxes = useMemo(() => {
    return includeTaxes ? rawMonthlyTaxes : 0;
  }, [includeTaxes, rawMonthlyTaxes]);

  // Monthly Insurance (Raw & Active)
  const rawMonthlyInsurance = useMemo(() => {
    return numericYearlyInsurance / 12;
  }, [numericYearlyInsurance]);

  const monthlyInsurance = useMemo(() => {
    return includeInsurance ? rawMonthlyInsurance : 0;
  }, [includeInsurance, rawMonthlyInsurance]);

  // Monthly HOA (Raw & Active)
  const rawMonthlyHoa = useMemo(() => {
    return numericMonthlyHoa;
  }, [numericMonthlyHoa]);

  const effectiveMonthlyHoa = useMemo(() => {
    return includeHoa ? rawMonthlyHoa : 0;
  }, [includeHoa, rawMonthlyHoa]);

  // Monthly PMI (Private Mortgage Insurance if down payment < 20%)
  const monthlyPmi = useMemo(() => {
    if (!includePmi || downPaymentActualPct >= 20 || loanAmount <= 0) return 0;
    // Standard average PMI is ~0.6% annually of total loan amount
    return (loanAmount * 0.006) / 12;
  }, [includePmi, downPaymentActualPct, loanAmount]);

  // Total Monthly Payment
  const totalMonthlyPayment = useMemo(() => {
    return monthlyPrincipalInterest + monthlyTaxes + monthlyInsurance + effectiveMonthlyHoa + monthlyPmi;
  }, [monthlyPrincipalInterest, monthlyTaxes, monthlyInsurance, effectiveMonthlyHoa, monthlyPmi]);

  // Lifetime Loan Metrics
  const totalInterestPaid = useMemo(() => {
    const totalPayments = monthlyPrincipalInterest * (loanTermYears * 12);
    return Math.max(0, totalPayments - loanAmount);
  }, [monthlyPrincipalInterest, loanTermYears, loanAmount]);

  const totalLoanRepayment = useMemo(() => {
    return loanAmount + totalInterestPaid;
  }, [loanAmount, totalInterestPaid]);

  const estimatedPayoffYear = useMemo(() => {
    const currentYr = new Date().getFullYear();
    return currentYr + loanTermYears;
  }, [loanTermYears]);

  // Est. Required Income for 28% Front-end Debt-to-Income
  const estRequiredIncomeMonthly = useMemo(() => {
    return totalMonthlyPayment / 0.28;
  }, [totalMonthlyPayment]);

  // Amortization Schedule Data (Yearly aggregated)
  const amortizationSchedule = useMemo(() => {
    const schedule: { year: number; principalPaid: number; interestPaid: number; balance: number }[] = [];
    let balance = loanAmount;
    const r = interestRate / 100 / 12;
    const monthlyP_I = monthlyPrincipalInterest;
    
    let totalPForYear = 0;
    let totalIForYear = 0;

    for (let month = 1; month <= loanTermYears * 12; month++) {
      const interestForMonth = balance * r;
      const principalForMonth = monthlyP_I - interestForMonth;
      balance = Math.max(0, balance - principalForMonth);

      totalPForYear += principalForMonth;
      totalIForYear += interestForMonth;

      if (month % 12 === 0 || month === loanTermYears * 12) {
        schedule.push({
          year: Math.ceil(month / 12),
          principalPaid: Math.round(totalPForYear),
          interestPaid: Math.round(totalIForYear),
          balance: Math.round(balance),
        });
        totalPForYear = 0;
        totalIForYear = 0;
      }
    }
    return schedule;
  }, [loanAmount, interestRate, loanTermYears, monthlyPrincipalInterest]);

  // Share / Copy Link
  const handleShare = () => {
    const text = `Mortgage Estimate for $${homePrice.toLocaleString()}: $${Math.round(totalMonthlyPayment).toLocaleString()}/mo (${interestRate}% interest, ${loanTermYears}yr term, $${calculatedDownPayment.toLocaleString()} down)`;
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  // Percentages for payment visual bar
  const p_i_pct = totalMonthlyPayment > 0 ? (monthlyPrincipalInterest / totalMonthlyPayment) * 100 : 0;
  const tax_pct = totalMonthlyPayment > 0 ? (monthlyTaxes / totalMonthlyPayment) * 100 : 0;
  const ins_pct = totalMonthlyPayment > 0 ? (monthlyInsurance / totalMonthlyPayment) * 100 : 0;
  const hoa_pct = totalMonthlyPayment > 0 ? (effectiveMonthlyHoa / totalMonthlyPayment) * 100 : 0;
  const pmi_pct = totalMonthlyPayment > 0 ? (monthlyPmi / totalMonthlyPayment) * 100 : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FA2D48]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-sans">
              Mortgage Calculator
            </h2>
          </div>

          {/* Quick Rate Indicator Pills */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>Live Avg Rate Presets</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {liveRates.map((r) => (
                <button
                  key={r.label}
                  onClick={() => {
                    setInterestRate(r.rate);
                    setLoanTermYears(r.term);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    interestRate === r.rate && loanTermYears === r.term
                      ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className="font-extrabold">{r.rate}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Calculator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900">
              Loan Parameters
            </h3>
            <button
              onClick={() => {
                setHomePrice(1150000);
                setDownPaymentMode('percent');
                setDownPaymentPercent(20);
                setDownPaymentDollar(230000);
                setInterestRate(fred30Num);
                setLoanTermYears(30);
                setIncludeTaxes(false);
                setIncludeInsurance(false);
                setIncludeHoa(false);
                setYearlyTaxesPercent(1.1);
                setYearlyTaxesDollar(12650);
                setYearlyInsurance(1800);
                setMonthlyHoa(350);
              }}
              className="text-xs font-bold text-slate-400 hover:text-[#FA2D48] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* 1. Home Price */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="home-price-input" className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Home Price
              </label>
              <span className="text-xs font-bold text-slate-500">
                ${homePrice.toLocaleString()}
              </span>
            </div>
            
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 font-bold text-base">$</span>
              <input
                id="home-price-input"
                type="number"
                value={homePrice}
                onChange={(e) => {
                  const val = e.target.value;
                  handleHomePriceChange(val === '' ? '' : Number(val));
                }}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#FA2D48] focus:bg-white focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-slate-900 text-lg outline-none transition-all"
                placeholder="1,150,000"
                step="10000"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Price:</span>
              {PRICE_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleHomePriceChange(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    homePrice === p
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  ${(p / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* 2. Down Payment with $ or % Icon Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="down-payment-input" className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Down Payment
              </label>
              
              {/* Down Payment Mode Selector Buttons ($ / %) */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => toggleDownPaymentMode('percent')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                    downPaymentMode === 'percent'
                      ? 'bg-[#FA2D48] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch to Percentage"
                >
                  <span>%</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleDownPaymentMode('dollar')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                    downPaymentMode === 'dollar'
                      ? 'bg-[#FA2D48] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Switch to Dollar Amount"
                >
                  <span>$</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative flex items-center">
                {downPaymentMode === 'dollar' ? (
                  <span className="absolute left-4 text-slate-400 font-bold text-base">$</span>
                ) : null}
                <input
                  id="down-payment-input"
                  type="number"
                  value={downPaymentMode === 'percent' ? downPaymentPercent : downPaymentDollar}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const val = raw === '' ? '' : Number(raw);
                    if (downPaymentMode === 'percent') {
                      handleDownPercentChange(val);
                    } else {
                      handleDownDollarChange(val);
                    }
                  }}
                  className={`w-full py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#FA2D48] focus:bg-white focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-slate-900 text-lg outline-none transition-all ${
                    downPaymentMode === 'dollar' ? 'pl-9 pr-4' : 'pl-4 pr-9'
                  }`}
                  step={downPaymentMode === 'percent' ? '0.1' : '5000'}
                />
                {downPaymentMode === 'percent' ? (
                  <span className="absolute right-4 text-slate-400 font-bold text-base">%</span>
                ) : null}
              </div>

              {/* Equated Value display box */}
              <div className="sm:col-span-4 bg-slate-100/90 rounded-2xl border border-slate-200 p-3 flex flex-col justify-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold">
                  {downPaymentMode === 'percent' ? 'Equates To' : 'Percentage'}
                </span>
                <span className="text-sm font-black text-slate-900">
                  {downPaymentMode === 'percent' 
                    ? `$${calculatedDownPayment.toLocaleString()}`
                    : `${downPaymentActualPct.toFixed(1)}%`
                  }
                </span>
              </div>
            </div>

            {/* Quick Percent Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Down %:</span>
              {DOWN_PERCENT_PRESETS.map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleDownPercentChange(pct)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    downPaymentPercent === pct
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Interest Rate & Loan Term (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Interest Rate */}
            <div className="space-y-2">
              <label htmlFor="interest-rate-input" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                Interest Rate (%)
              </label>
              <div className="relative flex items-center">
                <input
                  id="interest-rate-input"
                  type="number"
                  value={interestRate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setInterestRate(val === '' ? '' : Number(val));
                  }}
                  className="w-full pl-4 pr-9 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#FA2D48] focus:bg-white focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-slate-900 text-lg outline-none transition-all"
                  step="0.05"
                  min="0"
                  max="25"
                />
                <span className="absolute right-4 text-slate-400 font-bold text-base">%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                Loan Term
              </label>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                {[10, 15, 20, 30].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setLoanTermYears(term)}
                    className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      loanTermYears === term
                        ? 'bg-[#FA2D48] text-white shadow-2xs'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {term} yr
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 4. Optional Extra Expenses Section (Property Taxes, Insurance, HOA, PMI) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-sm font-black text-slate-900">
                Taxes, Insurance & HOA
              </h4>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl divide-y divide-slate-200/60 overflow-hidden">
              
              {/* Row 1: Property Taxes */}
              <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${includeTaxes ? 'bg-white' : ''}`}>
                <div className="flex items-center space-x-3 shrink-0">
                  <AppleToggle
                    enabled={includeTaxes}
                    onChange={setIncludeTaxes}
                    label="Include Property Taxes"
                    id="taxes-toggle"
                  />
                  <label htmlFor="taxes-toggle" className="text-sm font-black text-slate-900 cursor-pointer block">
                    Property Taxes
                  </label>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => toggleTaxMode('percent')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${yearlyTaxesMode === 'percent' ? 'bg-[#FA2D48] text-white shadow-2xs' : 'text-slate-600'}`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTaxMode('dollar')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${yearlyTaxesMode === 'dollar' ? 'bg-[#FA2D48] text-white shadow-2xs' : 'text-slate-600'}`}
                      >
                        $
                      </button>
                    </div>

                    <div className={`relative flex items-center transition-opacity w-28 ${includeTaxes ? 'opacity-100' : 'opacity-50'}`}>
                      {yearlyTaxesMode === 'dollar' && (
                        <span className="absolute left-2.5 text-slate-400 font-bold text-xs">$</span>
                      )}
                      <input
                        id="yearly-taxes-input"
                        type="number"
                        value={yearlyTaxesMode === 'percent' ? yearlyTaxesPercent : yearlyTaxesDollar}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const val = raw === '' ? '' : Number(raw);
                          if (yearlyTaxesMode === 'percent') {
                            handleTaxPercentChange(val);
                          } else {
                            handleTaxDollarChange(val);
                          }
                        }}
                        className={`w-full py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 focus:border-[#FA2D48] font-bold text-slate-900 text-xs outline-none ${
                          yearlyTaxesMode === 'dollar' ? 'pl-6 pr-2' : 'pl-2.5 pr-6'
                        }`}
                        step={yearlyTaxesMode === 'percent' ? '0.1' : '500'}
                      />
                      {yearlyTaxesMode === 'percent' && (
                        <span className="absolute right-2.5 text-slate-400 font-bold text-xs">%</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right w-20 shrink-0">
                    <span className={`text-xs font-bold ${includeTaxes ? 'text-slate-900' : 'text-slate-400'}`}>
                      {includeTaxes ? `$${Math.round(rawMonthlyTaxes).toLocaleString()}` : '$0'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/mo</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Homeowners Insurance */}
              <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${includeInsurance ? 'bg-white' : ''}`}>
                <div className="flex items-center space-x-3 shrink-0">
                  <AppleToggle
                    enabled={includeInsurance}
                    onChange={setIncludeInsurance}
                    label="Include Home Insurance"
                    id="insurance-toggle"
                  />
                  <label htmlFor="insurance-toggle" className="text-sm font-black text-slate-900 cursor-pointer block">
                    Homeowners Insurance
                  </label>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className={`relative flex items-center transition-opacity w-32 ${includeInsurance ? 'opacity-100' : 'opacity-50'}`}>
                    <span className="absolute left-2.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      id="yearly-insurance-input"
                      type="number"
                      value={yearlyInsurance}
                      onChange={(e) => {
                        const val = e.target.value;
                        setYearlyInsurance(val === '' ? '' : Number(val));
                      }}
                      className="w-full pl-6 pr-2.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 focus:border-[#FA2D48] font-bold text-slate-900 text-xs outline-none"
                      step="100"
                    />
                  </div>

                  <div className="text-right w-20 shrink-0">
                    <span className={`text-xs font-bold ${includeInsurance ? 'text-slate-900' : 'text-slate-400'}`}>
                      {includeInsurance ? `$${Math.round(rawMonthlyInsurance).toLocaleString()}` : '$0'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/mo</span>
                  </div>
                </div>
              </div>

              {/* Row 3: HOA Dues */}
              <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${includeHoa ? 'bg-white' : ''}`}>
                <div className="flex items-center space-x-3 shrink-0">
                  <AppleToggle
                    enabled={includeHoa}
                    onChange={setIncludeHoa}
                    label="Include HOA Dues"
                    id="hoa-toggle"
                  />
                  <label htmlFor="hoa-toggle" className="text-sm font-black text-slate-900 cursor-pointer block">
                    HOA Dues
                  </label>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className={`relative flex items-center transition-opacity w-32 ${includeHoa ? 'opacity-100' : 'opacity-50'}`}>
                    <span className="absolute left-2.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      id="monthly-hoa-input"
                      type="number"
                      value={monthlyHoa}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMonthlyHoa(val === '' ? '' : Number(val));
                      }}
                      className="w-full pl-6 pr-2.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200 focus:border-[#FA2D48] font-bold text-slate-900 text-xs outline-none"
                      step="25"
                    />
                  </div>

                  <div className="text-right w-20 shrink-0">
                    <span className={`text-xs font-bold ${includeHoa ? 'text-slate-900' : 'text-slate-400'}`}>
                      {includeHoa ? `$${Math.round(rawMonthlyHoa).toLocaleString()}` : '$0'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/mo</span>
                  </div>
                </div>
              </div>

              {/* Row 4: PMI (when down payment < 20%) */}
              {downPaymentActualPct < 20 && (
                <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${includePmi ? 'bg-white' : ''}`}>
                  <div className="flex items-center space-x-3 shrink-0">
                    <AppleToggle
                      enabled={includePmi}
                      onChange={setIncludePmi}
                      label="Include PMI"
                      id="pmi-toggle"
                    />
                    <label htmlFor="pmi-toggle" className="text-sm font-black text-slate-900 cursor-pointer block">
                      PMI (Private Mortgage Insurance)
                    </label>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="text-right w-20 shrink-0 ml-auto">
                      <span className={`text-xs font-bold ${includePmi ? 'text-slate-900' : 'text-slate-400'}`}>
                        {includePmi ? `$${Math.round(monthlyPmi).toLocaleString()}` : '$0'}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">/mo</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right Column: Payment Results & Analytics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Monthly Payment Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FA2D48]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Actions */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-black uppercase tracking-widest text-[#FA2D48] bg-[#FA2D48]/10 px-3 py-1 rounded-full border border-[#FA2D48]/30">
                Estimated Monthly Payment
              </span>
              <button
                onClick={handleShare}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded-full hover:bg-slate-800 border border-slate-800"
                title="Share or Copy Summary"
              >
                {copiedSuccess ? <span className="text-emerald-400">Copied!</span> : <span>Share</span>}
              </button>
            </div>

            {/* Big Price Display */}
            <div className="space-y-1 relative z-10">
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-white">
                  ${Math.round(totalMonthlyPayment).toLocaleString()}
                </span>
                <span className="text-slate-400 text-lg font-bold">/ mo</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Based on ${homePrice.toLocaleString()} home price & {interestRate}% interest
              </p>
            </div>

            {/* Visual Color Breakdown Bar */}
            <div className="space-y-2 relative z-10">
              <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${p_i_pct}%` }} className="bg-blue-500 h-full transition-all duration-300" title="Principal & Interest" />
                <div style={{ width: `${tax_pct}%` }} className="bg-[#FA2D48] h-full transition-all duration-300" title="Property Taxes" />
                <div style={{ width: `${ins_pct}%` }} className="bg-amber-400 h-full transition-all duration-300" title="Home Insurance" />
                <div style={{ width: `${hoa_pct}%` }} className="bg-emerald-400 h-full transition-all duration-300" title="HOA Dues" />
                {monthlyPmi > 0 && (
                  <div style={{ width: `${pmi_pct}%` }} className="bg-purple-400 h-full transition-all duration-300" title="PMI" />
                )}
              </div>

              {/* Itemized Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-slate-300 font-medium">Principal & Interest</span>
                  </div>
                  <span className="font-bold text-white">${Math.round(monthlyPrincipalInterest).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FA2D48]" />
                    <span className="text-slate-300 font-medium">Property Taxes</span>
                  </div>
                  <span className="font-bold text-white">${Math.round(monthlyTaxes).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-slate-300 font-medium">Home Insurance</span>
                  </div>
                  <span className="font-bold text-white">${Math.round(monthlyInsurance).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-300 font-medium">HOA Dues</span>
                  </div>
                  <span className="font-bold text-white">${Math.round(monthlyHoa).toLocaleString()}</span>
                </div>

                {monthlyPmi > 0 && (
                  <div className="col-span-2 flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <span className="text-slate-300 font-medium">Private Mortgage Insurance (PMI)</span>
                    </div>
                    <span className="font-bold text-white">${Math.round(monthlyPmi).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Income qualification helper */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">
                Est. Qualifying Income (28% DTI):
              </span>
              <span className="font-bold text-white">
                ~${Math.round(estRequiredIncomeMonthly * 12).toLocaleString()} / yr
              </span>
            </div>

          </div>



        </div>

      </div>

      {/* Bottom Amortization Schedule & Insights Drawer/Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Yearly Amortization Schedule
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              See how your loan balance decreases and principal balance accumulates over {loanTermYears} years.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'breakdown'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual Summary
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              First 5 Years
            </button>
          </div>
        </div>

        {/* Amortization Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-extrabold text-[11px] bg-slate-50">
                <th className="py-3 px-4 rounded-l-xl">Year</th>
                <th className="py-3 px-4">Principal Paid</th>
                <th className="py-3 px-4">Interest Paid</th>
                <th className="py-3 px-4 rounded-r-xl">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(activeTab === 'schedule' ? amortizationSchedule.slice(0, 5) : amortizationSchedule).map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Year {row.year}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600">${row.principalPaid.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#FA2D48]">${row.interestPaid.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">${row.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

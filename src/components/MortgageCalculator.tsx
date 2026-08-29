import React, { useState, useMemo } from 'react';
import { CityInfo, AdBanner, LiveMortgageRates } from '../types';
import { AdBannerRenderer } from './AdBannerRenderer';

interface MortgageCalculatorProps {
  currentCity?: CityInfo;
  onSelectCity?: (city: CityInfo) => void;
  liveRates?: LiveMortgageRates | null;
  ads?: AdBanner[];
  monetizationEnabled?: boolean;
}

const PRICE_PRESETS = [
  { value: 500000, label: '$500k' },
  { value: 750000, label: '$750k' },
  { value: 1000000, label: '$1M' },
];

const DOWN_PERCENT_PRESETS = [3.5, 5, 10, 15, 20];

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
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 ${
      enabled ? 'bg-emerald-500' : 'bg-slate-300'
    }`}
  >
    <span className="sr-only">{label || 'Toggle option'}</span>
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  currentCity,
  liveRates: propLiveRates,
  ads = [],
  monetizationEnabled = false,
}) => {
  // MND Daily rates
  const mnd30Num = useMemo(() => {
    if (!propLiveRates?.mortgage30Year) return 6.81;
    const val = parseFloat(propLiveRates.mortgage30Year.replace('%', ''));
    return isNaN(val) ? 6.81 : val;
  }, [propLiveRates?.mortgage30Year]);

  const mnd15Num = useMemo(() => {
    if (!propLiveRates?.mortgage15Year) return 6.35;
    const val = parseFloat(propLiveRates.mortgage15Year.replace('%', ''));
    return isNaN(val) ? 6.35 : val;
  }, [propLiveRates?.mortgage15Year]);

  const mndJumboNum = useMemo(() => {
    if (!propLiveRates?.jumbo30Year) return 6.90;
    const val = parseFloat(propLiveRates.jumbo30Year.replace('%', ''));
    return isNaN(val) ? 6.90 : val;
  }, [propLiveRates?.jumbo30Year]);

  const mndFhaNum = useMemo(() => {
    if (!propLiveRates?.fha30Year) return 6.37;
    const val = parseFloat(propLiveRates.fha30Year.replace('%', ''));
    return isNaN(val) ? 6.37 : val;
  }, [propLiveRates?.fha30Year]);

  const mndVaNum = useMemo(() => {
    if (!propLiveRates?.va30Year) return 6.37;
    const val = parseFloat(propLiveRates.va30Year.replace('%', ''));
    return isNaN(val) ? 6.37 : val;
  }, [propLiveRates?.va30Year]);

  const rateOptions = useMemo(() => [
    { label: '30-Yr Fixed', rate: mnd30Num, term: 30 },
    { label: '15-Yr Fixed', rate: mnd15Num, term: 15 },
    { label: '30-Yr Jumbo', rate: mndJumboNum, term: 30 },
    { label: '30-Yr FHA', rate: mndFhaNum, term: 30 },
    { label: '30-Yr VA', rate: mndVaNum, term: 30 },
  ], [mnd30Num, mnd15Num, mndJumboNum, mndFhaNum, mndVaNum]);

  // Core Loan Inputs
  const [calcMode, setCalcMode] = useState<'standard' | 'reverse'>('standard');
  const [maxMonthlyBudget, setMaxMonthlyBudget] = useState<number | ''>(''); // No preset initial value
  const [homePrice, setHomePrice] = useState<number | ''>(''); // No preset initial value
  const [downPaymentMode, setDownPaymentMode] = useState<'percent' | 'dollar'>('dollar');
  const [downPaymentPercent, setDownPaymentPercent] = useState<number | ''>('');
  const [downPaymentDollar, setDownPaymentDollar] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>(mnd30Num); // Preset default to 30-year rate
  const [loanTermYears, setLoanTermYears] = useState<number>(30);

  // Sync interest rate with live 30-year rate when propLiveRates updates initially
  const hasUserEditedRate = React.useRef(false);
  React.useEffect(() => {
    if (!hasUserEditedRate.current && mnd30Num > 0) {
      setInterestRate(mnd30Num);
    }
  }, [mnd30Num]);

  // Optional Extra Costs Toggles (iPhone/Apple style green/grey toggle, set by default to inactive false)
  const [includeTaxes, setIncludeTaxes] = useState<boolean>(false);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(false);
  const [includeHoa, setIncludeHoa] = useState<boolean>(false);

  // Optional Extra Costs Inputs
  const [yearlyTaxesMode, setYearlyTaxesMode] = useState<'percent' | 'dollar'>('percent');
  const [yearlyTaxesPercent, setYearlyTaxesPercent] = useState<number | ''>(1.1); // ~1.1% OC property tax
  const [yearlyTaxesDollar, setYearlyTaxesDollar] = useState<number | ''>(11000);
  const [yearlyInsurance, setYearlyInsurance] = useState<number | ''>(1400); // ~$116.67/mo
  const [monthlyHoa, setMonthlyHoa] = useState<number | ''>(350); // $350/mo
  const [includePmi, setIncludePmi] = useState<boolean>(false);

  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Synchronize Down Payment when Home Price or Mode changes
  const handleHomePriceChange = (newPrice: number | '') => {
    if (newPrice === '') {
      setHomePrice('');
      if (downPaymentMode === 'percent') {
        setDownPaymentDollar('');
      }
      setYearlyTaxesDollar('');
      return;
    }
    const val = Math.max(0, newPrice);
    setHomePrice(val);
    const currentPct = downPaymentPercent === '' ? 20 : downPaymentPercent;
    const currentTaxPct = yearlyTaxesPercent === '' ? 1.1 : yearlyTaxesPercent;
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
    if (hp > 0) {
      setDownPaymentDollar(Math.round((hp * cleanPct) / 100));
    }
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
    const currentPct = downPaymentPercent === '' ? 20 : downPaymentPercent;
    const currentDollar = downPaymentDollar === '' ? (hp > 0 ? Math.round((hp * currentPct) / 100) : '') : downPaymentDollar;
    if (mode === 'percent') {
      if (hp > 0 && typeof currentDollar === 'number') {
        const pct = (currentDollar / hp) * 100;
        setDownPaymentPercent(parseFloat(pct.toFixed(2)));
      }
    } else {
      if (hp > 0) {
        setDownPaymentDollar(Math.round((hp * currentPct) / 100));
      }
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

  // Reverse Calculation: Estimate Max Home Price based on Target Monthly Budget
  const calculatedMaxHomePrice = useMemo(() => {
    const targetBudget = maxMonthlyBudget === '' ? 0 : maxMonthlyBudget;
    if (targetBudget <= 0) return 0;

    const insMonthly = includeInsurance ? numericYearlyInsurance / 12 : 0;
    const hoaMonthly = includeHoa ? numericMonthlyHoa : 0;
    const taxMonthlyFixed = (includeTaxes && yearlyTaxesMode === 'dollar')
      ? (yearlyTaxesDollar === '' ? 0 : yearlyTaxesDollar) / 12
      : 0;

    const remainingBudget = targetBudget - insMonthly - hoaMonthly - taxMonthlyFixed;
    if (remainingBudget <= 0) return 0;

    const r = numericInterestRate / 100 / 12;
    const n = loanTermYears * 12;
    const k_PI = r > 0 ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 1 / n;

    const taxRateMonthly = (includeTaxes && yearlyTaxesMode === 'percent')
      ? (yearlyTaxesPercent === '' ? 0 : yearlyTaxesPercent) / 100 / 12
      : 0;

    if (downPaymentMode === 'percent') {
      const dPct = (downPaymentPercent === '' ? 0 : downPaymentPercent) / 100;
      const loanFraction = 1 - dPct;
      const pmiRateMonthly = (includePmi && dPct < 0.20) ? loanFraction * 0.0005 : 0;
      const totalMultiplier = loanFraction * k_PI + taxRateMonthly + pmiRateMonthly;
      if (totalMultiplier <= 0) return 0;
      return Math.round(remainingBudget / totalMultiplier);
    } else {
      const dDollar = downPaymentDollar === '' ? 0 : downPaymentDollar;
      const baseMultiplier = k_PI + taxRateMonthly;
      if (baseMultiplier <= 0) return 0;
      const estP_no_pmi = (remainingBudget + dDollar * k_PI) / baseMultiplier;
      const estDownPct = estP_no_pmi > 0 ? (dDollar / estP_no_pmi) : 1;

      if (includePmi && estDownPct < 0.20) {
        const pmiMultiplier = k_PI + taxRateMonthly + 0.0005;
        const estP_with_pmi = (remainingBudget + dDollar * (k_PI + 0.0005)) / pmiMultiplier;
        return Math.round(Math.max(0, estP_with_pmi));
      } else {
        return Math.round(Math.max(0, estP_no_pmi));
      }
    }
  }, [
    maxMonthlyBudget,
    numericInterestRate,
    loanTermYears,
    downPaymentMode,
    downPaymentPercent,
    downPaymentDollar,
    includeInsurance,
    numericYearlyInsurance,
    includeHoa,
    numericMonthlyHoa,
    includeTaxes,
    yearlyTaxesMode,
    yearlyTaxesPercent,
    yearlyTaxesDollar,
    includePmi,
  ]);

  // Synchronize homePrice and downPayment when in reverse mode
  React.useEffect(() => {
    if (calcMode === 'reverse' && calculatedMaxHomePrice > 0) {
      setHomePrice(calculatedMaxHomePrice);
      if (downPaymentMode === 'percent') {
        const pct = downPaymentPercent === '' ? 0 : downPaymentPercent;
        setDownPaymentDollar(Math.round((calculatedMaxHomePrice * pct) / 100));
      } else {
        const dlr = downPaymentDollar === '' ? 0 : downPaymentDollar;
        const pct = calculatedMaxHomePrice > 0 ? (dlr / calculatedMaxHomePrice) * 100 : 0;
        setDownPaymentPercent(parseFloat(pct.toFixed(2)));
      }
      if (yearlyTaxesMode === 'percent') {
        const taxPct = yearlyTaxesPercent === '' ? 0 : yearlyTaxesPercent;
        setYearlyTaxesDollar(Math.round((calculatedMaxHomePrice * taxPct) / 100));
      }
    }
  }, [
    calcMode,
    calculatedMaxHomePrice,
    downPaymentMode,
    downPaymentPercent,
    downPaymentDollar,
    yearlyTaxesMode,
    yearlyTaxesPercent,
  ]);

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

  // Share / Copy Text Breakdown
  const handleShare = async () => {
    const formattedDownPct = Number(downPaymentActualPct.toFixed(1));
    const lines = [
      `MORTGAGE PAYMENT ESTIMATE`,
      `• Home Price: $${homePrice ? homePrice.toLocaleString() : '0'}`,
      `• Down Payment: $${Math.round(calculatedDownPayment).toLocaleString()} (${formattedDownPct}%)`,
      `• Loan Amount: $${Math.round(loanAmount).toLocaleString()}`,
      `• Interest Rate: ${interestRate}%`,
      `• Loan Term: ${loanTermYears} Years`,
      ``,
      `ESTIMATED MONTHLY PAYMENT: $${Math.round(totalMonthlyPayment).toLocaleString()}/mo`,
      `• Principal & Interest: $${Math.round(monthlyPrincipalInterest).toLocaleString()}`,
    ];

    if (includeTaxes) {
      lines.push(`• Property Taxes: $${Math.round(monthlyTaxes).toLocaleString()}`);
    }
    if (includeInsurance) {
      lines.push(`• Homeowners Insurance: $${Math.round(monthlyInsurance).toLocaleString()}`);
    }
    if (includeHoa && effectiveMonthlyHoa > 0) {
      lines.push(`• HOA Dues: $${Math.round(effectiveMonthlyHoa).toLocaleString()}`);
    }
    if (downPaymentActualPct < 20 && includePmi && monthlyPmi > 0) {
      lines.push(`• PMI: $${Math.round(monthlyPmi).toLocaleString()}`);
    }

    const shareText = lines.join('\n');

    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `Mortgage Estimate - $${homePrice.toLocaleString()}`,
          text: shareText,
        });
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 2500);
        return;
      } catch (err) {
        // User cancelled share dialog or unsupported, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (e) {
      console.error('Failed to copy text', e);
    }
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
      <div className="rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FA2D48]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 relative z-10">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
              Select Your Interest Rate
            </h2>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-xs font-bold text-slate-500">Live Rates (Mortgage News Daily)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          {/* Rate Selector Pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 shrink-0 items-center">
            {rateOptions.map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => {
                  setInterestRate(r.rate);
                  setLoanTermYears(r.term);
                }}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 border whitespace-nowrap ${
                  interestRate === r.rate && loanTermYears === r.term
                    ? 'bg-[#FA2D48] text-white border-[#FA2D48] shadow-xs'
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

      {/* Main 2-Column Calculator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Form Controls (7 cols) with strong background in Reverse mode */}
        <div className={`lg:col-span-7 rounded-3xl p-5 sm:p-7 space-y-6 transition-all duration-300 ${
          calcMode === 'reverse'
            ? 'bg-slate-900 border border-slate-800 shadow-xl text-white'
            : 'bg-white border border-slate-200/90 shadow-xs text-slate-900'
        }`}>

          {/* Calculator Mode Toggle Switch */}
          <div className="space-y-2 pb-2">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-extrabold uppercase tracking-wider block ${
                calcMode === 'reverse' ? 'text-slate-200' : 'text-slate-700'
              }`}>
                Calculator Mode
              </span>
              {calcMode === 'reverse' && (
                <span className="text-[10px] uppercase font-black tracking-widest text-[#FA2D48] bg-rose-950/70 px-2 py-0.5 rounded-md border border-rose-800/80 animate-pulse">
                  Reverse Budget Mode Active
                </span>
              )}
            </div>
            <div className={`grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl border transition-all duration-300 ${
              calcMode === 'reverse'
                ? 'bg-slate-800/90 border-slate-700'
                : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setCalcMode('standard')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  calcMode === 'standard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>Standard (Set Home Price)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalcMode('reverse');
                  if (totalMonthlyPayment > 0) {
                    setMaxMonthlyBudget(Math.round(totalMonthlyPayment));
                  }
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  calcMode === 'reverse'
                    ? 'bg-[#FA2D48] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Max Monthly Budget</span>
              </button>
            </div>
          </div>

          {/* Mode-Specific Input Ordering */}
          {calcMode === 'standard' ? (
            <>
              {/* 1. Home Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="home-price-input" className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Home Price
                  </label>
                  <span className="text-xs font-bold text-slate-500">
                    {homePrice !== '' && homePrice > 0 ? `$${homePrice.toLocaleString()}` : ''}
                  </span>
                </div>
                
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 font-bold text-base">$</span>
                  <input
                    id="home-price-input"
                    type="text"
                    inputMode="numeric"
                    value={homePrice !== '' ? homePrice.toLocaleString('en-US') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      handleHomePriceChange(raw === '' ? '' : Number(raw));
                    }}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#FA2D48] focus:bg-white focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-slate-900 text-lg outline-none transition-all"
                    placeholder="1,000,000"
                  />
                </div>

                {/* Quick Price Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Quick Price:</span>
                  {PRICE_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handleHomePriceChange(preset.value)}
                      className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                        homePrice === preset.value
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {preset.label}
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
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
                    <button
                      type="button"
                      onClick={() => toggleDownPaymentMode('percent')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all cursor-pointer flex items-center justify-center min-w-[38px] ${
                        downPaymentMode === 'percent'
                          ? 'bg-[#FA2D48] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                      title="Switch to Percentage"
                    >
                      <span>%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDownPaymentMode('dollar')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all cursor-pointer flex items-center justify-center min-w-[38px] ${
                        downPaymentMode === 'dollar'
                          ? 'bg-[#FA2D48] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                      title="Switch to Dollar Amount"
                    >
                      <span>$</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                  <div className="col-span-7 sm:col-span-8 relative flex items-center">
                    {downPaymentMode === 'dollar' ? (
                      <span className="absolute left-3 sm:left-4 text-slate-400 font-bold text-sm sm:text-base">$</span>
                    ) : null}
                    <input
                      id="down-payment-input"
                      type={downPaymentMode === 'dollar' ? 'text' : 'number'}
                      inputMode={downPaymentMode === 'dollar' ? 'numeric' : 'decimal'}
                      value={
                        downPaymentMode === 'percent'
                          ? downPaymentPercent
                          : downPaymentDollar !== ''
                          ? downPaymentDollar.toLocaleString('en-US')
                          : ''
                      }
                      onChange={(e) => {
                        if (downPaymentMode === 'percent') {
                          const raw = e.target.value;
                          handleDownPercentChange(raw === '' ? '' : Number(raw));
                        } else {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          handleDownDollarChange(raw === '' ? '' : Number(raw));
                        }
                      }}
                      className={`w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#FA2D48] focus:bg-white focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-slate-900 text-base sm:text-lg outline-none transition-all ${
                        downPaymentMode === 'dollar' ? 'pl-7 sm:pl-9 pr-3 sm:pr-4' : 'pl-3.5 sm:pl-4 pr-7 sm:pr-9'
                      }`}
                      step={downPaymentMode === 'percent' ? '0.1' : undefined}
                    />
                    {downPaymentMode === 'percent' ? (
                      <span className="absolute right-3 sm:right-4 text-slate-400 font-bold text-sm sm:text-base">%</span>
                    ) : null}
                  </div>

                  {/* Equated Value text display on the SAME line */}
                  <div className="col-span-5 sm:col-span-4 px-1 py-1 flex flex-col justify-center text-right sm:text-left">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold whitespace-nowrap">
                      {downPaymentMode === 'percent' ? 'Equates To' : 'Percentage'}
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight whitespace-nowrap">
                      {downPaymentMode === 'percent' 
                        ? `$${calculatedDownPayment.toLocaleString()}`
                        : `${downPaymentActualPct.toFixed(1)}%`
                      }
                    </span>
                  </div>
                </div>

                {/* Quick Down % Presets */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mr-1">Quick Down %:</span>
                  {DOWN_PERCENT_PRESETS.map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleDownPercentChange(pct)}
                      className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
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

              {/* 3. Interest Rate & Loan Term */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="interest-rate-input" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    Interest Rate (%)
                  </label>
                </div>

                <div className="relative flex items-center">
                  <input
                    id="interest-rate-input"
                    type="number"
                    value={interestRate}
                    onChange={(e) => {
                      hasUserEditedRate.current = true;
                      const val = e.target.value;
                      setInterestRate(val === '' ? '' : Number(val));
                    }}
                    className="w-full pl-3.5 sm:pl-4 pr-8 sm:pr-9 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#FA2D48] focus:bg-white focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-slate-900 text-base sm:text-lg outline-none transition-all"
                    step="0.05"
                    min="0"
                    max="25"
                  />
                  <span className="absolute right-3 sm:right-4 text-slate-400 font-bold text-sm sm:text-base">%</span>
                </div>

                {/* Loan Term Quick Presets directly under Interest Rate */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mr-1">Loan Term:</span>
                  {[15, 20, 30].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setLoanTermYears(term)}
                      className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                        loanTermYears === term
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {term} yr
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Max Monthly Budget Mode Ordering: */}
              {/* 1. Down Payment with $ or % Icon Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="down-payment-input-rev" className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                    Down Payment
                  </label>
                  
                  {/* Down Payment Mode Selector Buttons ($ / %) */}
                  <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 gap-1">
                    <button
                      type="button"
                      onClick={() => toggleDownPaymentMode('percent')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all cursor-pointer flex items-center justify-center min-w-[38px] ${
                        downPaymentMode === 'percent'
                          ? 'bg-[#FA2D48] text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                      }`}
                      title="Switch to Percentage"
                    >
                      <span>%</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDownPaymentMode('dollar')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all cursor-pointer flex items-center justify-center min-w-[38px] ${
                        downPaymentMode === 'dollar'
                          ? 'bg-[#FA2D48] text-white shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                      }`}
                      title="Switch to Dollar Amount"
                    >
                      <span>$</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                  <div className="col-span-7 sm:col-span-8 relative flex items-center">
                    {downPaymentMode === 'dollar' ? (
                      <span className="absolute left-3 sm:left-4 text-slate-400 font-bold text-sm sm:text-base">$</span>
                    ) : null}
                    <input
                      id="down-payment-input-rev"
                      type={downPaymentMode === 'dollar' ? 'text' : 'number'}
                      inputMode={downPaymentMode === 'dollar' ? 'numeric' : 'decimal'}
                      value={
                        downPaymentMode === 'percent'
                          ? downPaymentPercent
                          : downPaymentDollar !== ''
                          ? downPaymentDollar.toLocaleString('en-US')
                          : ''
                      }
                      onChange={(e) => {
                        if (downPaymentMode === 'percent') {
                          const raw = e.target.value;
                          handleDownPercentChange(raw === '' ? '' : Number(raw));
                        } else {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          handleDownDollarChange(raw === '' ? '' : Number(raw));
                        }
                      }}
                      className={`w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-800/90 border border-slate-700 focus:border-[#FA2D48] focus:bg-slate-800 focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-white text-base sm:text-lg outline-none transition-all ${
                        downPaymentMode === 'dollar' ? 'pl-7 sm:pl-9 pr-3 sm:pr-4' : 'pl-3.5 sm:pl-4 pr-7 sm:pr-9'
                      }`}
                      step={downPaymentMode === 'percent' ? '0.1' : undefined}
                      placeholder={downPaymentMode === 'dollar' ? '0' : '0'}
                    />
                    {downPaymentMode === 'percent' ? (
                      <span className="absolute right-3 sm:right-4 text-slate-400 font-bold text-sm sm:text-base">%</span>
                    ) : null}
                  </div>

                  {/* Equated Value text display on the SAME line */}
                  <div className="col-span-5 sm:col-span-4 px-1 py-1 flex flex-col justify-center text-right sm:text-left">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400 font-bold whitespace-nowrap">
                      {downPaymentMode === 'percent' ? 'Equates To' : 'Percentage'}
                    </span>
                    <span className="text-sm sm:text-base font-black text-white tracking-tight whitespace-nowrap">
                      {downPaymentMode === 'percent' 
                        ? `$${calculatedDownPayment.toLocaleString()}`
                        : `${downPaymentActualPct.toFixed(1)}%`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Target Max Monthly Payment */}
              <div className="space-y-3 p-4 sm:p-5 bg-rose-950/40 rounded-2xl border border-rose-800/60 animate-fadeIn">
                <div>
                  <label htmlFor="max-monthly-budget-input" className="text-xs font-extrabold uppercase tracking-wider text-rose-200 block">
                    Target Max Monthly Payment
                  </label>
                </div>

                <div className="relative flex items-center">
                  <span className="absolute left-4 text-rose-400 font-bold text-base">$</span>
                  <input
                    id="max-monthly-budget-input"
                    type="text"
                    inputMode="numeric"
                    value={maxMonthlyBudget !== '' ? maxMonthlyBudget.toLocaleString('en-US') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, '');
                      setMaxMonthlyBudget(raw === '' ? '' : Number(raw));
                    }}
                    className="w-full pl-9 pr-14 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 focus:border-[#FA2D48] focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-white text-lg outline-none transition-all placeholder:text-slate-500"
                    placeholder="5,000"
                  />
                  <span className="absolute right-4 text-slate-400 font-bold text-xs font-mono">/mo</span>
                </div>
              </div>

              {/* 3. Estimated Home Price (Calculated) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                    Estimated Home Price (Calculated)
                  </label>
                </div>
                
                <div className="relative flex items-center">
                  <span className="absolute left-0 text-slate-400 font-bold text-xl sm:text-2xl">$</span>
                  <input
                    type="text"
                    readOnly
                    value={homePrice !== '' && homePrice > 0 ? homePrice.toLocaleString('en-US') : ''}
                    className="w-full pl-5 sm:pl-6 pr-4 py-1.5 bg-transparent border-0 font-black text-white text-xl sm:text-2xl tracking-tight outline-none cursor-default"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* 4. Interest Rate & Loan Term */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="interest-rate-input-rev" className="text-xs font-extrabold uppercase tracking-wider text-slate-200 block">
                    Interest Rate (%)
                  </label>
                </div>

                <div className="relative flex items-center">
                  <input
                    id="interest-rate-input-rev"
                    type="number"
                    value={interestRate}
                    onChange={(e) => {
                      hasUserEditedRate.current = true;
                      const val = e.target.value;
                      setInterestRate(val === '' ? '' : Number(val));
                    }}
                    className="w-full pl-3.5 sm:pl-4 pr-8 sm:pr-9 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-800/90 border border-slate-700 focus:border-[#FA2D48] focus:bg-slate-800 focus:ring-2 focus:ring-[#FA2D48]/20 font-bold text-white text-base sm:text-lg outline-none transition-all"
                    step="0.05"
                    min="0"
                    max="25"
                  />
                  <span className="absolute right-3 sm:right-4 text-slate-400 font-bold text-sm sm:text-base">%</span>
                </div>

                {/* Loan Term Quick Presets */}
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 mr-1">Loan Term:</span>
                  {[15, 20, 30].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setLoanTermYears(term)}
                      className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                        loanTermYears === term
                          ? 'bg-white text-slate-900 font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {term} yr
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 4. Optional Extra Expenses Section (Property Taxes, Insurance, HOA, PMI) */}
          <div className={`pt-4 border-t space-y-3 transition-colors ${
            calcMode === 'reverse' ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <div className="flex items-center justify-between px-1">
              <h4 className={`text-sm font-black ${
                calcMode === 'reverse' ? 'text-white' : 'text-slate-900'
              }`}>
                Taxes, Insurance & HOA
              </h4>
            </div>

            <div className={`rounded-2xl border overflow-hidden transition-colors ${
              calcMode === 'reverse'
                ? 'bg-slate-800/50 border-slate-700/80 divide-y divide-slate-700/60'
                : 'bg-slate-50/70 border-slate-200/80 divide-y divide-slate-200/60'
            }`}>
              
              {/* Row 1: Property Taxes */}
              <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                calcMode === 'reverse'
                  ? includeTaxes ? 'bg-slate-800/80' : ''
                  : includeTaxes ? 'bg-white' : ''
              }`}>
                <div className="flex items-center space-x-3 shrink-0">
                  <AppleToggle
                    enabled={includeTaxes}
                    onChange={setIncludeTaxes}
                    label="Include Property Taxes"
                    id="taxes-toggle"
                  />
                  <label htmlFor="taxes-toggle" className={`text-xs font-extrabold uppercase tracking-wider cursor-pointer block ${
                    calcMode === 'reverse' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Property Taxes
                  </label>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center p-1 rounded-xl border gap-1 ${
                      calcMode === 'reverse'
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-slate-100 border-slate-200'
                    }`}>
                      <button
                        type="button"
                        onClick={() => toggleTaxMode('percent')}
                        className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center min-w-[32px] sm:min-w-[38px] ${
                          yearlyTaxesMode === 'percent'
                            ? 'bg-[#FA2D48] text-white shadow-xs'
                            : calcMode === 'reverse'
                            ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                        title="Switch to Percentage"
                      >
                        <span>%</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTaxMode('dollar')}
                        className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center min-w-[32px] sm:min-w-[38px] ${
                          yearlyTaxesMode === 'dollar'
                            ? 'bg-[#FA2D48] text-white shadow-xs'
                            : calcMode === 'reverse'
                            ? 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                        title="Switch to Dollar Amount"
                      >
                        <span>$</span>
                      </button>
                    </div>

                    <div className={`relative flex items-center transition-opacity w-28 ${includeTaxes ? 'opacity-100' : 'opacity-50'}`}>
                      {yearlyTaxesMode === 'dollar' && (
                        <span className="absolute left-2.5 text-slate-400 font-bold text-xs">$</span>
                      )}
                      <input
                        id="yearly-taxes-input"
                        type={yearlyTaxesMode === 'dollar' ? 'text' : 'number'}
                        inputMode={yearlyTaxesMode === 'dollar' ? 'numeric' : 'decimal'}
                        value={
                          yearlyTaxesMode === 'percent'
                            ? yearlyTaxesPercent
                            : yearlyTaxesDollar !== ''
                            ? yearlyTaxesDollar.toLocaleString('en-US')
                            : ''
                        }
                        onChange={(e) => {
                          if (yearlyTaxesMode === 'percent') {
                            const raw = e.target.value;
                            handleTaxPercentChange(raw === '' ? '' : Number(raw));
                          } else {
                            const raw = e.target.value.replace(/[^0-9]/g, '');
                            handleTaxDollarChange(raw === '' ? '' : Number(raw));
                          }
                        }}
                        className={`w-full py-1.5 rounded-xl border focus:border-[#FA2D48] font-bold text-xs outline-none ${
                          calcMode === 'reverse'
                            ? 'bg-slate-800 border-slate-700 text-white'
                            : 'bg-slate-100/80 border-slate-200 text-slate-900'
                        } ${
                          yearlyTaxesMode === 'dollar' ? 'pl-6 pr-2' : 'pl-2.5 pr-6'
                        }`}
                        step={yearlyTaxesMode === 'percent' ? '0.1' : undefined}
                      />
                      {yearlyTaxesMode === 'percent' && (
                        <span className="absolute right-2.5 text-slate-400 font-bold text-xs">%</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right w-20 shrink-0">
                    <span className={`text-xs font-bold ${
                      includeTaxes
                        ? calcMode === 'reverse' ? 'text-white' : 'text-slate-900'
                        : 'text-slate-500'
                    }`}>
                      {includeTaxes ? `$${Math.round(rawMonthlyTaxes).toLocaleString()}` : '$0'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/mo</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Homeowners Insurance */}
              <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                calcMode === 'reverse'
                  ? includeInsurance ? 'bg-slate-800/80' : ''
                  : includeInsurance ? 'bg-white' : ''
              }`}>
                <div className="flex items-center space-x-3 shrink-0">
                  <AppleToggle
                    enabled={includeInsurance}
                    onChange={setIncludeInsurance}
                    label="Include Home Insurance"
                    id="insurance-toggle"
                  />
                  <label htmlFor="insurance-toggle" className={`text-xs font-extrabold uppercase tracking-wider cursor-pointer block ${
                    calcMode === 'reverse' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    Homeowners Insurance
                  </label>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className={`relative flex items-center transition-opacity w-32 ${includeInsurance ? 'opacity-100' : 'opacity-50'}`}>
                    <span className="absolute left-2.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      id="yearly-insurance-input"
                      type="text"
                      inputMode="numeric"
                      value={yearlyInsurance !== '' ? yearlyInsurance.toLocaleString('en-US') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setYearlyInsurance(raw === '' ? '' : Number(raw));
                      }}
                      className={`w-full pl-6 pr-2.5 py-1.5 rounded-xl border focus:border-[#FA2D48] font-bold text-xs outline-none ${
                        calcMode === 'reverse'
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-slate-100/80 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="text-right w-20 shrink-0">
                    <span className={`text-xs font-bold ${
                      includeInsurance
                        ? calcMode === 'reverse' ? 'text-white' : 'text-slate-900'
                        : 'text-slate-500'
                    }`}>
                      {includeInsurance ? `$${Math.round(rawMonthlyInsurance).toLocaleString()}` : '$0'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/mo</span>
                  </div>
                </div>
              </div>

              {/* Row 3: HOA Dues */}
              <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                calcMode === 'reverse'
                  ? includeHoa ? 'bg-slate-800/80' : ''
                  : includeHoa ? 'bg-white' : ''
              }`}>
                <div className="flex items-center space-x-3 shrink-0">
                  <AppleToggle
                    enabled={includeHoa}
                    onChange={setIncludeHoa}
                    label="Include HOA Dues"
                    id="hoa-toggle"
                  />
                  <label htmlFor="hoa-toggle" className={`text-xs font-extrabold uppercase tracking-wider cursor-pointer block ${
                    calcMode === 'reverse' ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    HOA Dues
                  </label>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className={`relative flex items-center transition-opacity w-32 ${includeHoa ? 'opacity-100' : 'opacity-50'}`}>
                    <span className="absolute left-2.5 text-slate-400 font-bold text-xs">$</span>
                    <input
                      id="monthly-hoa-input"
                      type="text"
                      inputMode="numeric"
                      value={monthlyHoa !== '' ? monthlyHoa.toLocaleString('en-US') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setMonthlyHoa(raw === '' ? '' : Number(raw));
                      }}
                      className={`w-full pl-6 pr-2.5 py-1.5 rounded-xl border focus:border-[#FA2D48] font-bold text-xs outline-none ${
                        calcMode === 'reverse'
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'bg-slate-100/80 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="text-right w-20 shrink-0">
                    <span className={`text-xs font-bold ${
                      includeHoa
                        ? calcMode === 'reverse' ? 'text-white' : 'text-slate-900'
                        : 'text-slate-500'
                    }`}>
                      {includeHoa ? `$${Math.round(rawMonthlyHoa).toLocaleString()}` : '$0'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/mo</span>
                  </div>
                </div>
              </div>

              {/* Row 4: PMI */}
              <div className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                calcMode === 'reverse'
                  ? includePmi ? 'bg-slate-800/80' : ''
                  : includePmi ? 'bg-white' : ''
              }`}>
                <div className="flex items-center space-x-3 shrink-0">
                  <AppleToggle
                    enabled={includePmi}
                    onChange={setIncludePmi}
                    label="Include PMI"
                    id="pmi-toggle"
                  />
                  <div>
                    <label htmlFor="pmi-toggle" className={`text-xs font-extrabold uppercase tracking-wider cursor-pointer block ${
                      calcMode === 'reverse' ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      PMI (Private Mortgage Insurance)
                    </label>
                    {downPaymentActualPct >= 20 && (
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        No PMI required (Down payment ≥ 20%)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="text-right w-24 shrink-0 ml-auto">
                    <span className={`text-xs font-bold ${
                      includePmi && downPaymentActualPct < 20
                        ? calcMode === 'reverse' ? 'text-white' : 'text-slate-900'
                        : 'text-slate-500'
                    }`}>
                      {includePmi && downPaymentActualPct < 20 ? `$${Math.round(monthlyPmi).toLocaleString()}` : '$0'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-normal">/mo</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Payment Results & Analytics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Monthly Payment Card */}
          <div className="bg-[#FA2D48] text-white rounded-3xl border border-[#FA2D48] p-6 sm:p-7 shadow-md space-y-6">

            {/* Header / Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Estimated Monthly Payment
              </span>
              <button
                onClick={handleShare}
                className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 transition-colors cursor-pointer px-3 py-1 rounded-full"
                title="Share or Copy Summary"
              >
                {copiedSuccess ? <span className="text-white font-extrabold">Copied!</span> : <span>Share</span>}
              </button>
            </div>

            {/* Big Price Display */}
            <div className="space-y-1">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-white">
                  ${Math.round(totalMonthlyPayment).toLocaleString()}
                </span>
                <span className="text-white/90 text-lg font-bold">/ mo</span>
              </div>
              <p className="text-xs text-white/90 font-medium">
                Based on <span className="font-black text-white">${homePrice ? homePrice.toLocaleString() : '0'}</span> home price &amp; <span className="font-black text-white">{interestRate || 0}%</span> interest rate
              </p>
            </div>

            {/* Itemized Payment Breakdown List */}
            <div className="space-y-2 pt-4 border-t border-white/20">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Payment Breakdown
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/10 border border-white/15">
                  <span className="text-white font-semibold">Principal &amp; Interest</span>
                  <span className="font-extrabold text-white">${Math.round(monthlyPrincipalInterest).toLocaleString()}</span>
                </div>

                {includeTaxes && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/10 border border-white/15">
                    <span className="text-white font-semibold">Property Taxes</span>
                    <span className="font-extrabold text-white">${Math.round(monthlyTaxes).toLocaleString()}</span>
                  </div>
                )}

                {includeInsurance && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/10 border border-white/15">
                    <span className="text-white font-semibold">Homeowners Insurance</span>
                    <span className="font-extrabold text-white">${Math.round(monthlyInsurance).toLocaleString()}</span>
                  </div>
                )}

                {includeHoa && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/10 border border-white/15">
                    <span className="text-white font-semibold">HOA Dues</span>
                    <span className="font-extrabold text-white">${Math.round(effectiveMonthlyHoa).toLocaleString()}</span>
                  </div>
                )}

                {downPaymentActualPct < 20 && includePmi && monthlyPmi > 0 && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/10 border border-white/15">
                    <span className="text-white font-semibold">PMI</span>
                    <span className="font-extrabold text-white">${Math.round(monthlyPmi).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Featured Lender & Escrow Partner Banner (Under the Calculator) */}
      {monetizationEnabled && ads && ads.length > 0 && (
        <div className="pt-2">
          <AdBannerRenderer
            ads={ads}
            placement="calculator-sidebar"
            cityName={currentCity?.name}
            monetizationEnabled={monetizationEnabled}
          />
        </div>
      )}

    </div>
  );
};

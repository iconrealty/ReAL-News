// =============================================================================
// ORANGE COUNTY HOUSING REPORT DATA — STEVEN THOMAS (Reports On Housing)
// Single Source of Truth for Bi-Weekly Market Intelligence
// =============================================================================
//
// 📌 HOW TO UPDATE EVERY 2 WEEKS:
// 1. Update the `BI_WEEKLY_REPORT_CONFIG` below with the newest report numbers.
//    - All executive summary cards, deltas, percentages, bullet highlights, and
//      countywide badges across the entire app will automatically update.
// 2. (Page 10) Update `OC_MARKET_TIME_REPORT` with new city market times.
// 3. (Page 11) Update `OC_PRICE_RANGE_REPORT_ALL`, `_ATTACHED`, `_DETACHED`.
// 4. (Page 12) Update `RAW_SOLD_REPORT` using `unitsSoldCurrent` & `unitsSoldPriorYear`.
//
// =============================================================================

export interface OCMarketTimeEntry {
  city: string;
  region: 'Coastal' | 'South OC' | 'Central OC' | 'North OC';
  currentActives: number;
  demand30Days: number;
  marketTimeDays: number;
  marketTime2WeeksAgo: number;
  marketTime4WeeksAgo: number;
  marketTime1YearAgo: number;
  marketTime2YearsAgo: number;
  medianActiveListPrice: string;
}

export interface OCPriceRangeEntry {
  priceRange: string;
  currentActives: number;
  demand30Days: number;
  marketTimeDays: number;
  marketTime2WeeksAgo: number;
  marketTime4WeeksAgo: number;
  marketTime1YearAgo: number;
  marketTime2YearsAgo?: number;
  medianActivePrice: string;
}

export interface OCSoldReportEntry {
  city: string;
  unitsSoldCurrent: number;
  unitsSoldPriorYear: number;
  unitsSold2026: number;
  unitsSold2025: number;
  unitsSoldAugust2026?: number;
  unitsSoldJuly2026?: number;
  unitsSoldAugust2025?: number;
  unitsSoldJuly2025?: number;
  medianSalesPrice: string;
  medianListPrice: string;
  salesToListRatio: string;
  lowPrice: string;
  highPrice: string;
  medianSqFt: number;
  medianPricePerSqFt: string;
  medianDOM: number;
}

export interface OCSummaryCardData {
  id: string;
  title: string;
  shortTitle: string;
  currentStat: string;
  currentValue: number | string;
  unit: string;
  trend2Weeks: string;
  isTrendPositive: boolean;
  compLastYear: string;
  summary: string;
  keyTakeaways: string[];
  category: 'supply' | 'demand' | 'speed' | 'luxury' | 'sales' | 'distressed' | 'pricing';
}

export interface OCHousingSummaryBullet {
  title: string;
  stat: string;
  trend: string;
  description: string;
}

// =============================================================================
// 1. BI-WEEKLY REPORT CONFIGURATION — SEPTEMBER 28, 2026 (THEN AND NOW: 2008 VS. TODAY)
// =============================================================================
export const BI_WEEKLY_REPORT_CONFIG = {
  // Report Identity
  reportDate: "September 28, 2026",
  coverDate: "September 29, 2026",
  priorReportDate: "September 14, 2026",
  priorYearReportDate: "September 2025",
  title: "Then and Now: 2008 vs. Today",
  subtitle: "Many think that the slow housing market and rising rates will cause a crash like the Great Recession, but the data does not back this up.",
  author: "Steven Thomas",
  publisher: "Reports On Housing",

  // Page 5 & 9: Active Inventory
  actives: 4952,
  activesTwoWeeksAgo: 4939,
  activesLastYear: 4576,
  preCovidActivesAverage: 6400,
  ytdNewListings: 21374,

  // Page 6 & 9: 30-Day Buyer Demand (Pending Escrows)
  demand: 1349,
  demandTwoWeeksAgo: 1468,
  demandLastYear: 1609,
  springPeakDemand: 1678,
  preCovidDemandAverage: 2262,

  // Page 7 & 9: Expected Market Time (Velocity in Days)
  marketTime: 110,
  marketTimeTwoWeeksAgo: 101,
  marketTimeLastYear: 85,
  preCovidMarketTimeAverage: 86,

  // Page 7, 10 & 11: Property Type Breakdowns
  detached: {
    marketTime: 99,
    marketTimeTwoWeeksAgo: 92,
    marketTimeLastYear: 84,
    actives: 2721,
    demand: 827,
  },
  attached: {
    marketTime: 128,
    marketTimeTwoWeeksAgo: 115,
    marketTimeLastYear: 87,
    actives: 2231,
    demand: 522,
  },

  // Page 8: Luxury End ($2.5M+)
  luxury: {
    marketTime: 184,
    marketTimeTwoWeeksAgo: 157,
    marketTimeLastYear: 187,
    actives: 981,
    activesTwoWeeksAgo: 979,
    demand: 160,
    demandTwoWeeksAgo: 187,
  },

  // Page 3 & 12: Closed vs Last List Price Breakdown
  listPriceBreakdown: {
    belowAskingPct: "53%",
    belowAskingMedianShaved: "$35,000",
    belowAskingMedianDOM: 36,
    atAskingPct: "18%",
    atAskingMedianDOM: 10,
    aboveAskingPct: "29%",
    aboveAskingMedianPremium: "$20,000",
    aboveAskingMedianDOM: 10,
  },

  // Page 12: Closed Resale Report (August 2026 Resales)
  closedSales: {
    period: "August 2026",
    priorYearPeriod: "August 2025",
    unitsSold: 1755,
    unitsSoldPriorYear: 1875,
    medianSalesPrice: "$1,215,000",
    medianListPrice: "$1,200,000",
    salesToListRatio: "99.5%",
    medianPricePerSqFt: "$715",
    medianSqFt: 1700,
    medianDOM: 19,
    equitySalesPercentage: "99.72%",
  },

  // Page 9: Distressed Properties
  distressed: {
    actives: 13,
    activesTwoWeeksAgo: 12,
    lastYearActives: 12,
    foreclosures: 6,
    shortSales: 7,
    listingsPct: "0.3%",
    demandPct: "0.5%",
  },
};

// =============================================================================
// 2. AUTOMATIC DELTA CALCULATIONS & METADATA DERIVATION
// =============================================================================
const cfg = BI_WEEKLY_REPORT_CONFIG;

const inventoryDelta2Wks = cfg.actives - cfg.activesTwoWeeksAgo; // -43
const inventoryPct2Wks = Math.round((inventoryDelta2Wks / cfg.activesTwoWeeksAgo) * 100); // -1%
const inventoryDeltaYoY = cfg.actives - cfg.activesLastYear; // +181
const inventoryPctYoY = Math.round((inventoryDeltaYoY / cfg.activesLastYear) * 100); // +4%

const demandDelta2Wks = cfg.demand - cfg.demandTwoWeeksAgo; // -60
const demandPct2Wks = ((demandDelta2Wks / cfg.demandTwoWeeksAgo) * 100).toFixed(1); // -3.9%
const demandDeltaYoY = cfg.demand - cfg.demandLastYear; // -123
const demandPctYoY = Math.round((demandDeltaYoY / cfg.demandLastYear) * 100); // -8%

const marketTimeDelta2Wks = cfg.marketTime - cfg.marketTimeTwoWeeksAgo; // +3
const marketTimeDeltaYoY = cfg.marketTime - cfg.marketTimeLastYear; // +11

const luxuryMarketTimeDelta2Wks = cfg.luxury.marketTime - cfg.luxury.marketTimeTwoWeeksAgo; // +13
const luxuryDemandDelta2Wks = cfg.luxury.demand - cfg.luxury.demandTwoWeeksAgo; // -21
const luxuryDemandPct2Wks = Math.round((luxuryDemandDelta2Wks / cfg.luxury.demandTwoWeeksAgo) * 100); // -10%

const closedSalesDeltaYoY = cfg.closedSales.unitsSold - cfg.closedSales.unitsSoldPriorYear; // -120
const closedSalesPctYoY = Math.round((closedSalesDeltaYoY / cfg.closedSales.unitsSoldPriorYear) * 100); // -6%

export const OC_HOUSING_REPORT_METADATA = {
  // Identity
  reportDate: cfg.reportDate,
  coverDate: cfg.coverDate,
  priorReportDate: cfg.priorReportDate,
  priorYearReportDate: cfg.priorYearReportDate,
  author: cfg.author,
  publisher: cfg.publisher,
  title: cfg.title,
  subtitle: cfg.subtitle,

  // Unified Clean Resale Properties
  closedSalesPeriod: cfg.closedSales.period,
  closedSalesPriorYearPeriod: cfg.closedSales.priorYearPeriod,
  closedSalesUnits: cfg.closedSales.unitsSold,
  closedSalesPriorYearUnits: cfg.closedSales.unitsSoldPriorYear,
  closedSalesYoYChange: closedSalesDeltaYoY,
  closedSalesYoYNote: `${closedSalesDeltaYoY < 0 ? `${closedSalesDeltaYoY}` : `+${closedSalesDeltaYoY}`} sales (-6%) vs ${cfg.closedSales.priorYearPeriod} (${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales). Average ${cfg.closedSales.salesToListRatio} sales-to-list ratio.`,

  // Core Summary Totals (Backwards Compatible)
  countywideActives: cfg.actives,
  countywideActivesLastYear: cfg.activesLastYear,
  countywideDemand: cfg.demand,
  countywideDemandLastYear: cfg.demandLastYear,
  countywideMarketTime: cfg.marketTime,
  countywideMarketTime2WksAgo: cfg.marketTimeTwoWeeksAgo,
  countywideMarketTimeLastYear: cfg.marketTimeLastYear,

  detachedMarketTime: cfg.detached.marketTime,
  detachedMarketTime2WksAgo: cfg.detached.marketTimeTwoWeeksAgo,
  detachedMarketTimeLastYear: cfg.detached.marketTimeLastYear,
  detachedActives: cfg.detached.actives,
  detachedDemand: cfg.detached.demand,

  attachedMarketTime: cfg.attached.marketTime,
  attachedMarketTime2WksAgo: cfg.attached.marketTimeTwoWeeksAgo,
  attachedMarketTimeLastYear: cfg.attached.marketTimeLastYear,
  attachedActives: cfg.attached.actives,
  attachedDemand: cfg.attached.demand,

  luxuryMarketTime: cfg.luxury.marketTime,
  luxuryMarketTime2WksAgo: cfg.luxury.marketTimeTwoWeeksAgo,
  luxuryMarketTimeLastYear: cfg.luxury.marketTimeLastYear,
  luxuryActives: cfg.luxury.actives,
  luxuryDemand: cfg.luxury.demand,

  // Closed Resales Totals (Backwards Compatible)
  closedSalesAugust2026: cfg.closedSales.unitsSold,
  closedSalesResales: cfg.closedSales.unitsSold,
  closedSalesAugust2025: cfg.closedSales.unitsSoldPriorYear,
  medianSalesPriceAugust2026: cfg.closedSales.medianSalesPrice,
  closedSalesJuly2026: 1930,
  closedSalesJuly2025: 1934,
  medianSalesPriceJuly2026: "$1,220,000",
  countywideMedianPrice: cfg.closedSales.medianSalesPrice,
  medianListPriceAugust2026: cfg.closedSales.medianListPrice,
  medianSalesPrice: cfg.closedSales.medianSalesPrice,
  medianListPrice: cfg.closedSales.medianListPrice,
  salesToListRatioAugust2026: cfg.closedSales.salesToListRatio,
  salesToListRatio: cfg.closedSales.salesToListRatio,
  equitySalesPercentage: cfg.closedSales.equitySalesPercentage,
  medianPricePerSqFt: cfg.closedSales.medianPricePerSqFt,
  medianSqFt: cfg.closedSales.medianSqFt,
  medianDOM: cfg.closedSales.medianDOM,

  // Distressed Properties
  distressedActiveHomes: cfg.distressed.actives,
  distressedForeclosures: cfg.distressed.foreclosures,
  distressedShortSales: cfg.distressed.shortSales,
  distressedListingsPct: cfg.distressed.listingsPct,
  distressedDemandPct: cfg.distressed.demandPct,
  distressedLastYear: cfg.distressed.lastYearActives,
};

// =============================================================================
// STEVEN THOMAS MARKET SPEED EVALUATION (8-COMBINATION MATRIX)
// Evaluates Demand, Supply (Active Inventory), and Expected Market Time (EMT)
// comparing current reporting period against previous reporting period.
// =============================================================================
export interface StevenThomasMatrixRow {
  id: number;
  demand: 'UP' | 'DOWN';
  supply: 'UP' | 'DOWN';
  emt: 'UP' | 'DOWN';
  direction: 'STRONG' | 'IMPROVING' | 'WEAKENING' | 'WEAK';
  speed: 'FASTER' | 'SLOWER';
  result: string;
}

export const STEVEN_THOMAS_DIRECTION_MATRIX: StevenThomasMatrixRow[] = [
  { id: 1, demand: 'DOWN', supply: 'DOWN', emt: 'DOWN', direction: 'IMPROVING', speed: 'FASTER', result: 'IMPROVING / FASTER' },
  { id: 2, demand: 'UP', supply: 'UP', emt: 'UP', direction: 'WEAKENING', speed: 'SLOWER', result: 'WEAKENING / SLOWER' },
  { id: 3, demand: 'UP', supply: 'DOWN', emt: 'UP', direction: 'WEAKENING', speed: 'SLOWER', result: 'WEAKENING / SLOWER' },
  { id: 4, demand: 'DOWN', supply: 'UP', emt: 'DOWN', direction: 'IMPROVING', speed: 'FASTER', result: 'IMPROVING / FASTER' },
  { id: 5, demand: 'UP', supply: 'DOWN', emt: 'DOWN', direction: 'STRONG', speed: 'FASTER', result: 'STRONG / FASTER' },
  { id: 6, demand: 'DOWN', supply: 'UP', emt: 'UP', direction: 'WEAK', speed: 'SLOWER', result: 'WEAK / SLOWER' },
  { id: 7, demand: 'UP', supply: 'UP', emt: 'DOWN', direction: 'IMPROVING', speed: 'FASTER', result: 'IMPROVING / FASTER' },
  { id: 8, demand: 'DOWN', supply: 'DOWN', emt: 'UP', direction: 'WEAKENING', speed: 'SLOWER', result: 'WEAKENING / SLOWER' },
];

export function evaluateStevenThomasMarketDirection(
  demandCurrent: number,
  demandPrevious: number,
  supplyCurrent: number,
  supplyPrevious: number,
  emtCurrent: number,
  emtPrevious: number
) {
  const demandTrend = demandCurrent > demandPrevious ? 'UP' : demandCurrent < demandPrevious ? 'DOWN' : 'EQUAL';
  const supplyTrend = supplyCurrent > supplyPrevious ? 'UP' : supplyCurrent < supplyPrevious ? 'DOWN' : 'EQUAL';
  const emtTrend = emtCurrent > emtPrevious ? 'UP' : emtCurrent < emtPrevious ? 'DOWN' : 'EQUAL';

  // If any indicator is EQUAL/unchanged, direction is not clearly established by the 8 combinations:
  if (demandTrend === 'EQUAL' || supplyTrend === 'EQUAL' || emtTrend === 'EQUAL') {
    return {
      direction: 'BALANCED' as const,
      speed: null,
      fullText: 'MARKET SPEED: BALANCED',
      demandTrend,
      supplyTrend,
      emtTrend,
      matchedRowId: null
    };
  }

  // 1: DOWN, DOWN, DOWN -> IMPROVING / FASTER
  if (demandTrend === 'DOWN' && supplyTrend === 'DOWN' && emtTrend === 'DOWN') {
    return { direction: 'IMPROVING' as const, speed: 'FASTER' as const, fullText: 'MARKET SPEED: IMPROVING • FASTER', demandTrend, supplyTrend, emtTrend, matchedRowId: 1 };
  }
  // 2: UP, UP, UP -> WEAKENING / SLOWER
  if (demandTrend === 'UP' && supplyTrend === 'UP' && emtTrend === 'UP') {
    return { direction: 'WEAKENING' as const, speed: 'SLOWER' as const, fullText: 'MARKET SPEED: WEAKENING • SLOWER', demandTrend, supplyTrend, emtTrend, matchedRowId: 2 };
  }
  // 3: UP, DOWN, UP -> WEAKENING / SLOWER
  if (demandTrend === 'UP' && supplyTrend === 'DOWN' && emtTrend === 'UP') {
    return { direction: 'WEAKENING' as const, speed: 'SLOWER' as const, fullText: 'MARKET SPEED: WEAKENING • SLOWER', demandTrend, supplyTrend, emtTrend, matchedRowId: 3 };
  }
  // 4: DOWN, UP, DOWN -> IMPROVING / FASTER
  if (demandTrend === 'DOWN' && supplyTrend === 'UP' && emtTrend === 'DOWN') {
    return { direction: 'IMPROVING' as const, speed: 'FASTER' as const, fullText: 'MARKET SPEED: IMPROVING • FASTER', demandTrend, supplyTrend, emtTrend, matchedRowId: 4 };
  }
  // 5: UP, DOWN, DOWN -> STRONG / FASTER
  if (demandTrend === 'UP' && supplyTrend === 'DOWN' && emtTrend === 'DOWN') {
    return { direction: 'STRONG' as const, speed: 'FASTER' as const, fullText: 'MARKET SPEED: STRONG • FASTER', demandTrend, supplyTrend, emtTrend, matchedRowId: 5 };
  }
  // 6: DOWN, UP, UP -> WEAK / SLOWER (September 28, 2026 Match)
  if (demandTrend === 'DOWN' && supplyTrend === 'UP' && emtTrend === 'UP') {
    return { direction: 'WEAK' as const, speed: 'SLOWER' as const, fullText: 'MARKET SPEED: WEAK • SLOWER', demandTrend, supplyTrend, emtTrend, matchedRowId: 6 };
  }
  // 7: UP, UP, DOWN -> IMPROVING / FASTER
  if (demandTrend === 'UP' && supplyTrend === 'UP' && emtTrend === 'DOWN') {
    return { direction: 'IMPROVING' as const, speed: 'FASTER' as const, fullText: 'MARKET SPEED: IMPROVING • FASTER', demandTrend, supplyTrend, emtTrend, matchedRowId: 7 };
  }
  // 8: DOWN, DOWN, UP -> WEAKENING / SLOWER
  if (demandTrend === 'DOWN' && supplyTrend === 'DOWN' && emtTrend === 'UP') {
    return { direction: 'WEAKENING' as const, speed: 'SLOWER' as const, fullText: 'MARKET SPEED: WEAKENING • SLOWER', demandTrend, supplyTrend, emtTrend, matchedRowId: 8 };
  }

  return {
    direction: 'BALANCED' as const,
    speed: null,
    fullText: 'MARKET SPEED: BALANCED',
    demandTrend,
    supplyTrend,
    emtTrend,
    matchedRowId: null
  };
}

export const STEVEN_THOMAS_MARKET_DIRECTION = evaluateStevenThomasMarketDirection(
  cfg.demand,
  cfg.demandTwoWeeksAgo,
  cfg.actives,
  cfg.activesTwoWeeksAgo,
  cfg.marketTime,
  cfg.marketTimeTwoWeeksAgo
);

export const OC_COUNTYWIDE_LIVE_METRICS = {
  demand: cfg.demand, // 1349
  demandPrior: cfg.demandTwoWeeksAgo, // 1468
  demandDelta: cfg.demand - cfg.demandTwoWeeksAgo, // -119
  demandTrend: 'DOWN' as const,
  
  supply: cfg.actives, // 4952
  supplyPrior: cfg.activesTwoWeeksAgo, // 4939
  supplyDelta: cfg.actives - cfg.activesTwoWeeksAgo, // +13
  supplyTrend: 'UP' as const,
  
  emtDays: cfg.marketTime, // 110
  emtDaysPrior: cfg.marketTimeTwoWeeksAgo, // 101
  emtDelta: cfg.marketTime - cfg.marketTimeTwoWeeksAgo, // +9
  speed: 'SLOWER' as const,
  direction: 'WEAK' as const,
  fullText: 'MARKET SPEED: WEAK • SLOWER',
  matchedRowId: 6
};

// =============================================================================
// 3. EXECUTIVE SUMMARY CARDS (Derived from September 28, 2026 Report)
// =============================================================================
export const OC_HOUSING_SUMMARY_CARDS: OCSummaryCardData[] = [
  {
    id: "speed",
    title: "Expected Market Time",
    shortTitle: "Market Speed",
    currentStat: `${cfg.marketTime} Days`,
    currentValue: cfg.marketTime,
    unit: "Days to Sell",
    trend2Weeks: `+${marketTimeDelta2Wks} days (from ${cfg.marketTimeTwoWeeksAgo}d)`,
    isTrendPositive: false,
    compLastYear: `${cfg.marketTimeLastYear} days (${marketTimeDeltaYoY}d slower)`,
    summary: `Expected Market Time slowed by 9 days over the past two weeks to ${cfg.marketTime} days as buyer demand fell faster while active listings edged higher. At 110 days, the countywide housing market sits in balanced territory leaning towards buyers, marking the highest Expected Market Time recorded since April 2020.`,
    keyTakeaways: [
      `Countywide Expected Market Time jumped to ${cfg.marketTime} days (up 9 days from ${cfg.marketTimeTwoWeeksAgo}d two weeks ago).`,
      `Attached Condominiums & Townhomes: ${cfg.attached.marketTime} days (up from ${cfg.attached.marketTimeTwoWeeksAgo}d two weeks ago; ${cfg.attached.marketTimeLastYear}d last year).`,
      `Detached Single-Family: ${cfg.detached.marketTime} days (up from ${cfg.detached.marketTimeTwoWeeksAgo}d two weeks ago; ${cfg.detached.marketTimeLastYear}d last year).`,
      `Detached single-family homes (99 days) continue to outpace attached condominiums (128 days).`
    ],
    category: "speed"
  },
  {
    id: "demand",
    title: "Buyer Demand",
    shortTitle: "Demand",
    currentStat: `${cfg.demand.toLocaleString()} Escrows`,
    currentValue: cfg.demand,
    unit: "30-Day Pending Sales",
    trend2Weeks: `${demandDelta2Wks} escrows (${demandPct2Wks}%) in 2 wks`,
    isTrendPositive: false,
    compLastYear: `${cfg.demandLastYear.toLocaleString()} escrows (${demandPctYoY}% YoY / ${Math.abs(demandDeltaYoY)} fewer)`,
    summary: `Demand, the snapshot of new pending sales over the prior month, dropped by 119 pending sales (-8.1%) to ${cfg.demand.toLocaleString()} pending escrows due to mortgage rates around 7.5%. This marks the lowest September demand level since 2007.`,
    keyTakeaways: [
      `Buyer demand stands at ${cfg.demand.toLocaleString()} pending sales (down 119 escrows or -8.1% in 2 weeks).`,
      `Lowest September buyer demand recorded across Orange County since 2007.`,
      `Spring peak demand was ${cfg.springPeakDemand.toLocaleString()} pending sales.`,
      `Last year's pace: ${cfg.demandLastYear.toLocaleString()} pending sales (${demandPctYoY}% YoY).`,
      `Pre-COVID 3-year average was ${cfg.preCovidDemandAverage.toLocaleString()} pending sales (75% higher than today).`
    ],
    category: "demand"
  },
  {
    id: "inventory",
    title: "Active Inventory",
    shortTitle: "Inventory",
    currentStat: `${cfg.actives.toLocaleString()} Homes`,
    currentValue: cfg.actives,
    unit: "Active Listings",
    trend2Weeks: `+${inventoryDelta2Wks} homes (+${inventoryPct2Wks}%) in 2 wks`,
    isTrendPositive: false,
    compLastYear: `${cfg.activesLastYear.toLocaleString()} homes (+${inventoryPctYoY}% YoY / ${inventoryDeltaYoY} more)`,
    summary: `The active listing inventory inched up by 13 homes (+0.3%) over the past two weeks to ${cfg.actives.toLocaleString()} listings. 43% of all active listings in Orange County have reduced their price to find buyers.`,
    keyTakeaways: [
      `Active inventory sits at ${cfg.actives.toLocaleString()} homes (up 13 homes in 2 weeks).`,
      `43% of active listings have undergone price reductions.`,
      `Compared to last year's ${cfg.activesLastYear.toLocaleString()} homes (+${inventoryPctYoY}% YoY).`,
      `Pre-COVID 3-year average was ${cfg.preCovidActivesAverage.toLocaleString()} homes (32% higher).`,
      `${cfg.ytdNewListings.toLocaleString()} homes placed on the market YTD.`
    ],
    category: "supply"
  },
  {
    id: "pricing",
    title: "Closed vs. Last List Price",
    shortTitle: "Pricing Trends",
    currentStat: "53% Below Ask",
    currentValue: 53,
    unit: "Resale Closings",
    trend2Weeks: "29% Sold Above Asking",
    isTrendPositive: false,
    compLastYear: "18% Sold at Full Asking",
    summary: `With the market leaning into buyers' territory, 53% of all closed sales sold below asking price (median $35,000 shaved off after 36 days on market). 47% sold at or above asking price, confirming turnkey homes priced sharp still sell quickly.`,
    keyTakeaways: [
      `53% of closed sales sold below last asking price (median discount of $35,000 after 36 days DOM).`,
      `18% sold at the exact list price (median of 10 days on market).`,
      `29% sold above the last list price (median of $20,000 over asking and 10 days on market).`,
      `Turnkey, realistically priced homes in excellent condition continue to attract solid interest, while overpriced listings linger.`
    ],
    category: "pricing"
  },
  {
    id: "closed",
    title: `${cfg.closedSales.period} Closed Sales`,
    shortTitle: "Closed Resales",
    currentStat: `${cfg.closedSales.unitsSold.toLocaleString()} Sales`,
    currentValue: cfg.closedSales.unitsSold,
    unit: `${cfg.closedSales.salesToListRatio} Sale-to-List Ratio`,
    trend2Weeks: `-6% YoY vs ${cfg.closedSales.priorYearPeriod}`,
    isTrendPositive: false,
    compLastYear: `${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales in ${cfg.closedSales.priorYearPeriod} (${closedSalesDeltaYoY} sales)`,
    summary: `There were ${cfg.closedSales.unitsSold.toLocaleString()} closed residential resales in ${cfg.closedSales.period}, down 6% from ${cfg.closedSales.priorYearPeriod}'s ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales. The countywide median sales price was ${cfg.closedSales.medianSalesPrice} with an average sales-to-list ratio of ${cfg.closedSales.salesToListRatio}.`,
    keyTakeaways: [
      `${cfg.closedSales.unitsSold.toLocaleString()} residential sales closed in ${cfg.closedSales.period} (down 6% vs ${cfg.closedSales.priorYearPeriod}'s ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()}).`,
      `Countywide median sales price: ${cfg.closedSales.medianSalesPrice} ($715/sq ft).`,
      `Sales-to-list price ratio captured: ${cfg.closedSales.salesToListRatio}.`,
      `99.72% of all sales were traditional sellers with equity; foreclosures/short sales totaled just 0.28%.`,
      `Median Days on Market: ${cfg.closedSales.medianDOM} days.`
    ],
    category: "sales"
  }
];

// Backwards-compatible summary bullets for overview cards
export const OC_HOUSING_SUMMARY_BULLETS: OCHousingSummaryBullet[] = [
  {
    title: "Active Listings",
    stat: `${cfg.actives.toLocaleString()} Homes`,
    trend: `+${inventoryDelta2Wks} in 2 wks (+${inventoryPct2Wks}%)`,
    description: `Active inventory inched up to ${cfg.actives.toLocaleString()} listings (+13 homes in 2 wks), with 43% of listings seeing price cuts.`
  },
  {
    title: "Buyer Demand",
    stat: `${cfg.demand.toLocaleString()} Escrows`,
    trend: `${demandDelta2Wks} in 2 wks (${demandPct2Wks}%)`,
    description: `30-day pending sales dropped by 8.1% to ${cfg.demand.toLocaleString()} escrows with rates near 7.5%—the lowest September demand since 2007.`
  },
  {
    title: "Expected Market Time",
    stat: `${cfg.marketTime} Days`,
    trend: `+${marketTimeDelta2Wks} days vs 2 wks ago`,
    description: `Market speed slowed by 9 days to ${cfg.marketTime} days (slowest since April 2020). Detached homes are at 99 days while attached condominiums are at 128 days.`
  },
  {
    title: "Luxury End ($2.5M+)",
    stat: `${cfg.luxury.marketTime} Days`,
    trend: `+${luxuryMarketTimeDelta2Wks} days vs 2 wks ago`,
    description: `Luxury market time stands at ${cfg.luxury.marketTime} days with ${cfg.luxury.actives} active luxury listings and ${cfg.luxury.demand} pending escrows.`
  },
  {
    title: `${cfg.closedSales.period} Closed Sales`,
    stat: `${cfg.closedSales.unitsSold.toLocaleString()} Units`,
    trend: `-6% vs ${cfg.closedSales.priorYearPeriod}`,
    description: `${cfg.closedSales.unitsSold.toLocaleString()} resales closed in ${cfg.closedSales.period} (median ${cfg.closedSales.medianSalesPrice}, ${cfg.closedSales.salesToListRatio} ratio) compared to ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} in ${cfg.closedSales.priorYearPeriod}.`
  },
  {
    title: "Distressed Properties",
    stat: `${cfg.distressed.actives} Homes (${cfg.distressed.listingsPct})`,
    trend: "Historical Low",
    description: `Only ${cfg.distressed.foreclosures} foreclosures and ${cfg.distressed.shortSales} short sales countywide, accounting for just ${cfg.distressed.listingsPct} of active supply and ${cfg.distressed.demandPct} of demand.`
  }
];

// =============================================================================
// 4. PAGE 10: CITY MARKET TIME REPORT (September 28, 2026 — Then and Now: 2008 vs. Today)
// Tabulated from CRLMS as of 9/24/2026
// =============================================================================
export const OC_MARKET_TIME_REPORT: OCMarketTimeEntry[] = [
  { city: "Aliso Viejo", region: "South OC", currentActives: 72, demand30Days: 27, marketTimeDays: 80, marketTime2WeeksAgo: 74, marketTime4WeeksAgo: 86, marketTime1YearAgo: 50, marketTime2YearsAgo: 72, medianActiveListPrice: "$894k" },
  { city: "Anaheim", region: "North OC", currentActives: 266, demand30Days: 72, marketTimeDays: 111, marketTime2WeeksAgo: 89, marketTime4WeeksAgo: 93, marketTime1YearAgo: 70, marketTime2YearsAgo: 63, medianActiveListPrice: "$913k" },
  { city: "Anaheim Hills", region: "North OC", currentActives: 47, demand30Days: 11, marketTimeDays: 128, marketTime2WeeksAgo: 81, marketTime4WeeksAgo: 65, marketTime1YearAgo: 57, marketTime2YearsAgo: 63, medianActiveListPrice: "$1.3m" },
  { city: "Brea", region: "North OC", currentActives: 47, demand30Days: 20, marketTimeDays: 71, marketTime2WeeksAgo: 77, marketTime4WeeksAgo: 55, marketTime1YearAgo: 76, marketTime2YearsAgo: 50, medianActiveListPrice: "$1.0m" },
  { city: "Buena Park", region: "North OC", currentActives: 68, demand30Days: 20, marketTimeDays: 102, marketTime2WeeksAgo: 72, marketTime4WeeksAgo: 70, marketTime1YearAgo: 63, marketTime2YearsAgo: 58, medianActiveListPrice: "$900k" },
  { city: "Corona Del Mar", region: "Coastal", currentActives: 73, demand30Days: 12, marketTimeDays: 183, marketTime2WeeksAgo: 183, marketTime4WeeksAgo: 78, marketTime1YearAgo: 170, marketTime2YearsAgo: 199, medianActiveListPrice: "$6.4m" },
  { city: "Costa Mesa", region: "Coastal", currentActives: 117, demand30Days: 42, marketTimeDays: 84, marketTime2WeeksAgo: 74, marketTime4WeeksAgo: 84, marketTime1YearAgo: 67, marketTime2YearsAgo: 64, medianActiveListPrice: "$1.5m" },
  { city: "Coto De Caza", region: "South OC", currentActives: 55, demand30Days: 16, marketTimeDays: 103, marketTime2WeeksAgo: 132, marketTime4WeeksAgo: 177, marketTime1YearAgo: 145, marketTime2YearsAgo: 120, medianActiveListPrice: "$2.4m" },
  { city: "Cypress", region: "North OC", currentActives: 61, demand30Days: 18, marketTimeDays: 102, marketTime2WeeksAgo: 95, marketTime4WeeksAgo: 90, marketTime1YearAgo: 46, marketTime2YearsAgo: 31, medianActiveListPrice: "$940k" },
  { city: "Dana Point", region: "Coastal", currentActives: 104, demand30Days: 18, marketTimeDays: 173, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 95, marketTime1YearAgo: 114, marketTime2YearsAgo: 128, medianActiveListPrice: "$2.4m" },
  { city: "Dove Canyon", region: "South OC", currentActives: 4, demand30Days: 0, marketTimeDays: 0, marketTime2WeeksAgo: 40, marketTime4WeeksAgo: 30, marketTime1YearAgo: 150, marketTime2YearsAgo: 24, medianActiveListPrice: "$1.9m" },
  { city: "Foothill Ranch", region: "South OC", currentActives: 15, demand30Days: 4, marketTimeDays: 113, marketTime2WeeksAgo: 128, marketTime4WeeksAgo: 190, marketTime1YearAgo: 60, marketTime2YearsAgo: 105, medianActiveListPrice: "$625k" },
  { city: "Fountain Valley", region: "Central OC", currentActives: 41, demand30Days: 31, marketTimeDays: 40, marketTime2WeeksAgo: 44, marketTime4WeeksAgo: 52, marketTime1YearAgo: 64, marketTime2YearsAgo: 44, medianActiveListPrice: "$1.5m" },
  { city: "Fullerton", region: "North OC", currentActives: 131, demand30Days: 60, marketTimeDays: 66, marketTime2WeeksAgo: 65, marketTime4WeeksAgo: 71, marketTime1YearAgo: 61, marketTime2YearsAgo: 68, medianActiveListPrice: "$940k" },
  { city: "Garden Grove", region: "Central OC", currentActives: 108, demand30Days: 38, marketTimeDays: 85, marketTime2WeeksAgo: 74, marketTime4WeeksAgo: 79, marketTime1YearAgo: 51, marketTime2YearsAgo: 52, medianActiveListPrice: "$990k" },
  { city: "Huntington Beach", region: "Coastal", currentActives: 280, demand30Days: 103, marketTimeDays: 82, marketTime2WeeksAgo: 79, marketTime4WeeksAgo: 81, marketTime1YearAgo: 71, marketTime2YearsAgo: 59, medianActiveListPrice: "$1.5m" },
  { city: "Irvine", region: "South OC", currentActives: 736, demand30Days: 152, marketTimeDays: 145, marketTime2WeeksAgo: 156, marketTime4WeeksAgo: 177, marketTime1YearAgo: 138, marketTime2YearsAgo: 114, medianActiveListPrice: "$1.6m" },
  { city: "La Habra", region: "North OC", currentActives: 64, demand30Days: 32, marketTimeDays: 60, marketTime2WeeksAgo: 104, marketTime4WeeksAgo: 69, marketTime1YearAgo: 84, marketTime2YearsAgo: 50, medianActiveListPrice: "$797k" },
  { city: "La Palma", region: "North OC", currentActives: 13, demand30Days: 3, marketTimeDays: 130, marketTime2WeeksAgo: 72, marketTime4WeeksAgo: 98, marketTime1YearAgo: 50, marketTime2YearsAgo: 70, medianActiveListPrice: "$1.2m" },
  { city: "Ladera Ranch", region: "South OC", currentActives: 57, demand30Days: 13, marketTimeDays: 132, marketTime2WeeksAgo: 134, marketTime4WeeksAgo: 180, marketTime1YearAgo: 165, marketTime2YearsAgo: 95, medianActiveListPrice: "$1.3m" },
  { city: "Laguna Beach", region: "Coastal", currentActives: 149, demand30Days: 21, marketTimeDays: 213, marketTime2WeeksAgo: 216, marketTime4WeeksAgo: 214, marketTime1YearAgo: 297, marketTime2YearsAgo: 231, medianActiveListPrice: "$5.0m" },
  { city: "Laguna Hills", region: "South OC", currentActives: 59, demand30Days: 14, marketTimeDays: 126, marketTime2WeeksAgo: 116, marketTime4WeeksAgo: 155, marketTime1YearAgo: 59, marketTime2YearsAgo: 44, medianActiveListPrice: "$1.1m" },
  { city: "Laguna Niguel", region: "South OC", currentActives: 147, demand30Days: 45, marketTimeDays: 98, marketTime2WeeksAgo: 86, marketTime4WeeksAgo: 113, marketTime1YearAgo: 100, marketTime2YearsAgo: 82, medianActiveListPrice: "$1.5m" },
  { city: "Laguna Woods", region: "South OC", currentActives: 208, demand30Days: 55, marketTimeDays: 113, marketTime2WeeksAgo: 96, marketTime4WeeksAgo: 88, marketTime1YearAgo: 66, marketTime2YearsAgo: 37, medianActiveListPrice: "$443k" },
  { city: "Lake Forest", region: "South OC", currentActives: 207, demand30Days: 41, marketTimeDays: 151, marketTime2WeeksAgo: 151, marketTime4WeeksAgo: 151, marketTime1YearAgo: 96, marketTime2YearsAgo: 63, medianActiveListPrice: "$1.2m" },
  { city: "Los Alamitos", region: "North OC", currentActives: 14, demand30Days: 9, marketTimeDays: 47, marketTime2WeeksAgo: 40, marketTime4WeeksAgo: 47, marketTime1YearAgo: 33, marketTime2YearsAgo: 60, medianActiveListPrice: "$1.5m" },
  { city: "Mission Viejo", region: "South OC", currentActives: 168, demand30Days: 55, marketTimeDays: 92, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 73, marketTime1YearAgo: 98, marketTime2YearsAgo: 65, medianActiveListPrice: "$1.2m" },
  { city: "Newport Beach", region: "Coastal", currentActives: 236, demand30Days: 36, marketTimeDays: 197, marketTime2WeeksAgo: 156, marketTime4WeeksAgo: 131, marketTime1YearAgo: 143, marketTime2YearsAgo: 147, medianActiveListPrice: "$4.8m" },
  { city: "Newport Coast", region: "Coastal", currentActives: 52, demand30Days: 7, marketTimeDays: 223, marketTime2WeeksAgo: 201, marketTime4WeeksAgo: 180, marketTime1YearAgo: 180, marketTime2YearsAgo: 150, medianActiveListPrice: "$11.5m" },
  { city: "North Tustin", region: "Central OC", currentActives: 32, demand30Days: 10, marketTimeDays: 96, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 174, marketTime1YearAgo: 88, marketTime2YearsAgo: 100, medianActiveListPrice: "$2.5m" },
  { city: "Orange", region: "Central OC", currentActives: 178, demand30Days: 49, marketTimeDays: 109, marketTime2WeeksAgo: 115, marketTime4WeeksAgo: 99, marketTime1YearAgo: 57, marketTime2YearsAgo: 47, medianActiveListPrice: "$1.2m" },
  { city: "Placentia", region: "North OC", currentActives: 76, demand30Days: 19, marketTimeDays: 120, marketTime2WeeksAgo: 129, marketTime4WeeksAgo: 133, marketTime1YearAgo: 53, marketTime2YearsAgo: 38, medianActiveListPrice: "$889k" },
  { city: "Portola Hills", region: "South OC", currentActives: 29, demand30Days: 4, marketTimeDays: 218, marketTime2WeeksAgo: 129, marketTime4WeeksAgo: 120, marketTime1YearAgo: 180, marketTime2YearsAgo: 42, medianActiveListPrice: "$1.5m" },
  { city: "Rancho Mission Viejo", region: "South OC", currentActives: 110, demand30Days: 11, marketTimeDays: 300, marketTime2WeeksAgo: 112, marketTime4WeeksAgo: 86, marketTime1YearAgo: 98, marketTime2YearsAgo: 53, medianActiveListPrice: "$1.1m" },
  { city: "Rancho Santa Margarita", region: "South OC", currentActives: 78, demand30Days: 16, marketTimeDays: 146, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 116, marketTime1YearAgo: 73, marketTime2YearsAgo: 47, medianActiveListPrice: "$799k" },
  { city: "Rossmoor", region: "North OC", currentActives: 1, demand30Days: 2, marketTimeDays: 15, marketTime2WeeksAgo: 20, marketTime4WeeksAgo: 50, marketTime1YearAgo: 68, marketTime2YearsAgo: 42, medianActiveListPrice: "$2.2m" },
  { city: "San Clemente", region: "Coastal", currentActives: 120, demand30Days: 43, marketTimeDays: 84, marketTime2WeeksAgo: 83, marketTime4WeeksAgo: 72, marketTime1YearAgo: 109, marketTime2YearsAgo: 69, medianActiveListPrice: "$2.2m" },
  { city: "San Juan Capistrano", region: "South OC", currentActives: 74, demand30Days: 19, marketTimeDays: 117, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 81, marketTime1YearAgo: 80, marketTime2YearsAgo: 107, medianActiveListPrice: "$1.9m" },
  { city: "Santa Ana", region: "Central OC", currentActives: 222, demand30Days: 62, marketTimeDays: 107, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 81, marketTime1YearAgo: 78, marketTime2YearsAgo: 54, medianActiveListPrice: "$847k" },
  { city: "Seal Beach", region: "Coastal", currentActives: 85, demand30Days: 36, marketTimeDays: 71, marketTime2WeeksAgo: 67, marketTime4WeeksAgo: 54, marketTime1YearAgo: 39, marketTime2YearsAgo: 54, medianActiveListPrice: "$400k" },
  { city: "Stanton", region: "Central OC", currentActives: 22, demand30Days: 6, marketTimeDays: 110, marketTime2WeeksAgo: 83, marketTime4WeeksAgo: 90, marketTime1YearAgo: 60, marketTime2YearsAgo: 38, medianActiveListPrice: "$650k" },
  { city: "Talega", region: "Coastal", currentActives: 25, demand30Days: 8, marketTimeDays: 94, marketTime2WeeksAgo: 68, marketTime4WeeksAgo: 51, marketTime1YearAgo: 107, marketTime2YearsAgo: 56, medianActiveListPrice: "$1.9m" },
  { city: "Tustin", region: "Central OC", currentActives: 112, demand30Days: 24, marketTimeDays: 140, marketTime2WeeksAgo: 130, marketTime4WeeksAgo: 87, marketTime1YearAgo: 64, marketTime2YearsAgo: 30, medianActiveListPrice: "$1.0m" },
  { city: "Villa Park", region: "Central OC", currentActives: 13, demand30Days: 4, marketTimeDays: 98, marketTime2WeeksAgo: 160, marketTime4WeeksAgo: 70, marketTime1YearAgo: 64, marketTime2YearsAgo: 132, medianActiveListPrice: "$3.2m" },
  { city: "Westminster", region: "Central OC", currentActives: 42, demand30Days: 19, marketTimeDays: 66, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 85, marketTime1YearAgo: 36, marketTime2YearsAgo: 28, medianActiveListPrice: "$1.2m" },
  { city: "Yorba Linda", region: "North OC", currentActives: 137, demand30Days: 45, marketTimeDays: 91, marketTime2WeeksAgo: 85, marketTime4WeeksAgo: 64, marketTime1YearAgo: 72, marketTime2YearsAgo: 61, medianActiveListPrice: "$1.5m" },
];

// =============================================================================
// 5. PAGE 11: PRICE RANGE REPORT (September 28, 2026 — Then and Now: 2008 vs. Today)
// =============================================================================
export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "All of O.C.", currentActives: 4952, demand30Days: 1349, marketTimeDays: 110, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 98, marketTime1YearAgo: 85, marketTime2YearsAgo: 71, medianActivePrice: "$1.3m" },
  { priceRange: "$0-$500k", currentActives: 417, demand30Days: 114, marketTimeDays: 110, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 87, marketTime1YearAgo: 64, marketTime2YearsAgo: 44, medianActivePrice: "$405k" },
  { priceRange: "$500k-$750k", currentActives: 698, demand30Days: 159, marketTimeDays: 132, marketTime2WeeksAgo: 114, marketTime4WeeksAgo: 110, marketTime1YearAgo: 72, marketTime2YearsAgo: 53, medianActivePrice: "$639k" },
  { priceRange: "$750k-$1m", currentActives: 780, demand30Days: 250, marketTimeDays: 94, marketTime2WeeksAgo: 84, marketTime4WeeksAgo: 79, marketTime1YearAgo: 62, marketTime2YearsAgo: 47, medianActivePrice: "$895k" },
  { priceRange: "$1m-$1.25m", currentActives: 574, demand30Days: 196, marketTimeDays: 88, marketTime2WeeksAgo: 87, marketTime4WeeksAgo: 84, marketTime1YearAgo: 67, marketTime2YearsAgo: 50, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 544, demand30Days: 198, marketTimeDays: 82, marketTime2WeeksAgo: 91, marketTime4WeeksAgo: 87, marketTime1YearAgo: 62, marketTime2YearsAgo: 66, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 679, demand30Days: 188, marketTimeDays: 108, marketTime2WeeksAgo: 93, marketTime4WeeksAgo: 99, marketTime1YearAgo: 87, marketTime2YearsAgo: 84, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 279, demand30Days: 84, marketTimeDays: 100, marketTime2WeeksAgo: 91, marketTime4WeeksAgo: 96, marketTime1YearAgo: 146, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 431, demand30Days: 107, marketTimeDays: 121, marketTime2WeeksAgo: 106, marketTime4WeeksAgo: 95, marketTime1YearAgo: 148, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 232, demand30Days: 32, marketTimeDays: 218, marketTime2WeeksAgo: 195, marketTime4WeeksAgo: 185, marketTime1YearAgo: 188, marketTime2YearsAgo: 199, medianActivePrice: "$4.9m" },
  { priceRange: "$6m+", currentActives: 318, demand30Days: 21, marketTimeDays: 454, marketTime2WeeksAgo: 345, marketTime4WeeksAgo: 352, marketTime1YearAgo: 334, marketTime2YearsAgo: 391, medianActivePrice: "$10.1m" },
];

export const OC_PRICE_RANGE_REPORT_ATTACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Attached", currentActives: 2231, demand30Days: 522, marketTimeDays: 128, marketTime2WeeksAgo: 115, marketTime4WeeksAgo: 109, marketTime1YearAgo: 87, marketTime2YearsAgo: 61, medianActivePrice: "$775k" },
  { priceRange: "$0-$500k", currentActives: 409, demand30Days: 113, marketTimeDays: 109, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 86, marketTime1YearAgo: 62, marketTime2YearsAgo: 42, medianActivePrice: "$405k" },
  { priceRange: "$500k-$750k", currentActives: 669, demand30Days: 151, marketTimeDays: 133, marketTime2WeeksAgo: 118, marketTime4WeeksAgo: 114, marketTime1YearAgo: 73, marketTime2YearsAgo: 55, medianActivePrice: "$637k" },
  { priceRange: "$750k-$1m", currentActives: 534, demand30Days: 132, marketTimeDays: 121, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 98, marketTime1YearAgo: 74, marketTime2YearsAgo: 52, medianActivePrice: "$869k" },
  { priceRange: "$1m-$2m", currentActives: 486, demand30Days: 109, marketTimeDays: 134, marketTime2WeeksAgo: 153, marketTime4WeeksAgo: 153, marketTime1YearAgo: 136, marketTime2YearsAgo: 90, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 133, demand30Days: 17, marketTimeDays: 235, marketTime2WeeksAgo: 140, marketTime4WeeksAgo: 102, marketTime1YearAgo: 236, marketTime2YearsAgo: 137, medianActivePrice: "$3.4m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: 2721, demand30Days: 827, marketTimeDays: 99, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 90, marketTime1YearAgo: 84, marketTime2YearsAgo: 77, medianActivePrice: "$1.8m" },
  { priceRange: "$0-$750k", currentActives: 37, demand30Days: 9, marketTimeDays: 123, marketTime2WeeksAgo: 71, marketTime4WeeksAgo: 75, marketTime1YearAgo: 78, marketTime2YearsAgo: 48, medianActivePrice: "$639k" },
  { priceRange: "$750k-$1m", currentActives: 246, demand30Days: 118, marketTimeDays: 63, marketTime2WeeksAgo: 63, marketTime4WeeksAgo: 55, marketTime1YearAgo: 48, marketTime2YearsAgo: 43, medianActivePrice: "$913k" },
  { priceRange: "$1m-$1.25m", currentActives: 347, demand30Days: 143, marketTimeDays: 73, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 69, marketTime1YearAgo: 48, marketTime2YearsAgo: 42, medianActivePrice: "$1.2m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 387, demand30Days: 164, marketTimeDays: 71, marketTime2WeeksAgo: 76, marketTime4WeeksAgo: 70, marketTime1YearAgo: 50, marketTime2YearsAgo: 59, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 577, demand30Days: 166, marketTimeDays: 104, marketTime2WeeksAgo: 85, marketTime4WeeksAgo: 90, marketTime1YearAgo: 78, marketTime2YearsAgo: 80, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 246, demand30Days: 74, marketTimeDays: 100, marketTime2WeeksAgo: 88, marketTime4WeeksAgo: 93, marketTime1YearAgo: 147, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 377, demand30Days: 102, marketTimeDays: 111, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 98, marketTime1YearAgo: 136, medianActivePrice: "$3.0m" },
  { priceRange: "$4m-$6m", currentActives: 203, demand30Days: 31, marketTimeDays: 196, marketTime2WeeksAgo: 221, marketTime4WeeksAgo: 211, marketTime1YearAgo: 182, marketTime2YearsAgo: 216, medianActivePrice: "$4.9m" },
  { priceRange: "$6m+", currentActives: 301, demand30Days: 20, marketTimeDays: 452, marketTime2WeeksAgo: 341, marketTime4WeeksAgo: 347, marketTime1YearAgo: 328, marketTime2YearsAgo: 434, medianActivePrice: "$10.3m" },
];

// =============================================================================
// 6. PAGE 12: CLOSED RESALE REPORT (August 2026 Closings by Municipality)
// =============================================================================
type RawSoldItem = {
  city: string;
  unitsSoldCurrent?: number;
  unitsSoldPriorYear?: number;
  unitsSoldAugust2026?: number;
  unitsSoldAugust2025?: number;
  unitsSoldJuly2026?: number;
  unitsSoldJuly2025?: number;
  medianSalesPrice: string;
  medianListPrice: string;
  salesToListRatio: string;
  lowPrice: string;
  highPrice: string;
  medianSqFt: number;
  medianPricePerSqFt: string;
  medianDOM: number;
};

const RAW_SOLD_REPORT: RawSoldItem[] = [
  { city: "Aliso Viejo", unitsSoldCurrent: 37, unitsSoldPriorYear: 25, medianSalesPrice: "$940,000", medianListPrice: "$959,000", salesToListRatio: "98.3%", lowPrice: "$550,000", highPrice: "$2,550,000", medianSqFt: 1524, medianPricePerSqFt: "$617", medianDOM: 26 },
  { city: "Anaheim", unitsSoldCurrent: 96, unitsSoldPriorYear: 107, medianSalesPrice: "$932,745", medianListPrice: "$939,939", salesToListRatio: "100.0%", lowPrice: "$304,600", highPrice: "$1,820,000", medianSqFt: 1518, medianPricePerSqFt: "$615", medianDOM: 16 },
  { city: "Anaheim Hills", unitsSoldCurrent: 25, unitsSoldPriorYear: 32, medianSalesPrice: "$1,115,000", medianListPrice: "$1,149,900", salesToListRatio: "100.0%", lowPrice: "$538,000", highPrice: "$2,649,888", medianSqFt: 1698, medianPricePerSqFt: "$657", medianDOM: 13 },
  { city: "Brea", unitsSoldCurrent: 32, unitsSoldPriorYear: 20, medianSalesPrice: "$1,132,350", medianListPrice: "$1,100,000", salesToListRatio: "100.0%", lowPrice: "$610,000", highPrice: "$1,875,000", medianSqFt: 1831, medianPricePerSqFt: "$618", medianDOM: 16 },
  { city: "Buena Park", unitsSoldCurrent: 25, unitsSoldPriorYear: 38, medianSalesPrice: "$905,000", medianListPrice: "$915,000", salesToListRatio: "99.6%", lowPrice: "$709,000", highPrice: "$1,895,565", medianSqFt: 1493, medianPricePerSqFt: "$606", medianDOM: 34 },
  { city: "Corona Del Mar", unitsSoldCurrent: 18, unitsSoldPriorYear: 18, medianSalesPrice: "$4,835,000", medianListPrice: "$4,899,000", salesToListRatio: "99.1%", lowPrice: "$2,025,000", highPrice: "$19,000,000", medianSqFt: 2416, medianPricePerSqFt: "$2,002", medianDOM: 27 },
  { city: "Costa Mesa", unitsSoldCurrent: 54, unitsSoldPriorYear: 47, medianSalesPrice: "$1,513,500", medianListPrice: "$1,498,500", salesToListRatio: "100.0%", lowPrice: "$420,000", highPrice: "$4,175,000", medianSqFt: 1745, medianPricePerSqFt: "$867", medianDOM: 18 },
  { city: "Coto De Caza", unitsSoldCurrent: 12, unitsSoldPriorYear: 12, medianSalesPrice: "$1,714,500", medianListPrice: "$1,749,000", salesToListRatio: "97.6%", lowPrice: "$945,000", highPrice: "$4,840,000", medianSqFt: 2994, medianPricePerSqFt: "$573", medianDOM: 33 },
  { city: "Cypress", unitsSoldCurrent: 29, unitsSoldPriorYear: 29, medianSalesPrice: "$995,000", medianListPrice: "$985,000", salesToListRatio: "100.0%", lowPrice: "$465,000", highPrice: "$1,950,000", medianSqFt: 1709, medianPricePerSqFt: "$582", medianDOM: 24 },
  { city: "Dana Point", unitsSoldCurrent: 31, unitsSoldPriorYear: 34, medianSalesPrice: "$1,950,000", medianListPrice: "$1,950,000", salesToListRatio: "100.0%", lowPrice: "$600,000", highPrice: "$12,195,000", medianSqFt: 1878, medianPricePerSqFt: "$1,038", medianDOM: 9 },
  { city: "Dove Canyon", unitsSoldCurrent: 5, unitsSoldPriorYear: 6, medianSalesPrice: "$1,800,000", medianListPrice: "$1,795,000", salesToListRatio: "97.8%", lowPrice: "$1,580,000", highPrice: "$1,835,000", medianSqFt: 2606, medianPricePerSqFt: "$691", medianDOM: 29 },
  { city: "Foothill Ranch", unitsSoldCurrent: 6, unitsSoldPriorYear: 5, medianSalesPrice: "$1,475,000", medianListPrice: "$1,495,000", salesToListRatio: "98.6%", lowPrice: "$725,000", highPrice: "$1,795,850", medianSqFt: 2295, medianPricePerSqFt: "$643", medianDOM: 29 },
  { city: "Fountain Valley", unitsSoldCurrent: 32, unitsSoldPriorYear: 35, medianSalesPrice: "$1,364,000", medianListPrice: "$1,383,500", salesToListRatio: "100.3%", lowPrice: "$760,000", highPrice: "$2,300,000", medianSqFt: 1822, medianPricePerSqFt: "$749", medianDOM: 9 },
  { city: "Fullerton", unitsSoldCurrent: 75, unitsSoldPriorYear: 67, medianSalesPrice: "$999,990", medianListPrice: "$995,000", salesToListRatio: "100.0%", lowPrice: "$360,000", highPrice: "$2,065,000", medianSqFt: 1617, medianPricePerSqFt: "$618", medianDOM: 26 },
  { city: "Garden Grove", unitsSoldCurrent: 42, unitsSoldPriorYear: 62, medianSalesPrice: "$1,027,500", medianListPrice: "$1,039,000", salesToListRatio: "100.0%", lowPrice: "$360,000", highPrice: "$1,560,000", medianSqFt: 1393, medianPricePerSqFt: "$738", medianDOM: 11 },
  { city: "Huntington Beach", unitsSoldCurrent: 118, unitsSoldPriorYear: 132, medianSalesPrice: "$1,430,000", medianListPrice: "$1,425,000", salesToListRatio: "99.2%", lowPrice: "$122,500", highPrice: "$5,300,000", medianSqFt: 1706, medianPricePerSqFt: "$838", medianDOM: 14 },
  { city: "Irvine", unitsSoldCurrent: 174, unitsSoldPriorYear: 186, medianSalesPrice: "$1,520,000", medianListPrice: "$1,550,000", salesToListRatio: "98.1%", lowPrice: "$470,000", highPrice: "$17,650,000", medianSqFt: 2029, medianPricePerSqFt: "$749", medianDOM: 26 },
  { city: "La Habra", unitsSoldCurrent: 30, unitsSoldPriorYear: 27, medianSalesPrice: "$807,500", medianListPrice: "$794,500", salesToListRatio: "100.0%", lowPrice: "$330,000", highPrice: "$1,450,000", medianSqFt: 1294, medianPricePerSqFt: "$624", medianDOM: 14 },
  { city: "La Palma", unitsSoldCurrent: 10, unitsSoldPriorYear: 6, medianSalesPrice: "$1,175,000", medianListPrice: "$1,182,500", salesToListRatio: "99.2%", lowPrice: "$655,000", highPrice: "$1,443,500", medianSqFt: 2162, medianPricePerSqFt: "$543", medianDOM: 12 },
  { city: "Ladera Ranch", unitsSoldCurrent: 16, unitsSoldPriorYear: 16, medianSalesPrice: "$1,407,000", medianListPrice: "$1,437,499", salesToListRatio: "99.4%", lowPrice: "$740,000", highPrice: "$3,150,000", medianSqFt: 2028, medianPricePerSqFt: "$694", medianDOM: 10 },
  { city: "Laguna Beach", unitsSoldCurrent: 32, unitsSoldPriorYear: 26, medianSalesPrice: "$3,412,500", medianListPrice: "$3,800,000", salesToListRatio: "97.1%", lowPrice: "$500,000", highPrice: "$29,000,000", medianSqFt: 2198, medianPricePerSqFt: "$1,553", medianDOM: 38 },
  { city: "Laguna Hills", unitsSoldCurrent: 23, unitsSoldPriorYear: 22, medianSalesPrice: "$1,180,000", medianListPrice: "$1,150,000", salesToListRatio: "98.4%", lowPrice: "$540,000", highPrice: "$3,850,000", medianSqFt: 1325, medianPricePerSqFt: "$891", medianDOM: 29 },
  { city: "Laguna Niguel", unitsSoldCurrent: 42, unitsSoldPriorYear: 58, medianSalesPrice: "$1,249,500", medianListPrice: "$1,269,500", salesToListRatio: "99.2%", lowPrice: "$480,000", highPrice: "$6,500,000", medianSqFt: 1550, medianPricePerSqFt: "$806", medianDOM: 27 },
  { city: "Laguna Woods", unitsSoldCurrent: 52, unitsSoldPriorYear: 62, medianSalesPrice: "$442,250", medianListPrice: "$459,450", salesToListRatio: "99.8%", lowPrice: "$150,000", highPrice: "$2,000,000", medianSqFt: 1077, medianPricePerSqFt: "$411", medianDOM: 25 },
  { city: "Lake Forest", unitsSoldCurrent: 51, unitsSoldPriorYear: 40, medianSalesPrice: "$1,230,000", medianListPrice: "$1,248,800", salesToListRatio: "99.4%", lowPrice: "$440,000", highPrice: "$3,250,000", medianSqFt: 2022, medianPricePerSqFt: "$608", medianDOM: 18 },
  { city: "Los Alamitos", unitsSoldCurrent: 6, unitsSoldPriorYear: 8, medianSalesPrice: "$1,687,500", medianListPrice: "$1,724,500", salesToListRatio: "99.8%", lowPrice: "$1,162,500", highPrice: "$23,600,000", medianSqFt: 2054, medianPricePerSqFt: "$822", medianDOM: 48 },
  { city: "Mission Viejo", unitsSoldCurrent: 94, unitsSoldPriorYear: 88, medianSalesPrice: "$1,270,000", medianListPrice: "$1,255,000", salesToListRatio: "99.7%", lowPrice: "$490,000", highPrice: "$2,700,000", medianSqFt: 1785, medianPricePerSqFt: "$712", medianDOM: 20 },
  { city: "Newport Beach", unitsSoldCurrent: 48, unitsSoldPriorYear: 60, medianSalesPrice: "$3,190,000", medianListPrice: "$3,397,000", salesToListRatio: "96.5%", lowPrice: "$525,000", highPrice: "$26,800,000", medianSqFt: 2117, medianPricePerSqFt: "$1,507", medianDOM: 26 },
  { city: "Newport Coast", unitsSoldCurrent: 9, unitsSoldPriorYear: 8, medianSalesPrice: "$4,450,000", medianListPrice: "$4,550,000", salesToListRatio: "97.8%", lowPrice: "$1,505,000", highPrice: "$38,900,000", medianSqFt: 2735, medianPricePerSqFt: "$1,627", medianDOM: 36 },
  { city: "North Tustin", unitsSoldCurrent: 15, unitsSoldPriorYear: 10, medianSalesPrice: "$2,100,000", medianListPrice: "$2,100,000", salesToListRatio: "99.6%", lowPrice: "$1,295,000", highPrice: "$4,275,000", medianSqFt: 2831, medianPricePerSqFt: "$742", medianDOM: 14 },
  { city: "Orange", unitsSoldCurrent: 76, unitsSoldPriorYear: 78, medianSalesPrice: "$1,100,000", medianListPrice: "$1,100,000", salesToListRatio: "100.0%", lowPrice: "$460,000", highPrice: "$3,927,500", medianSqFt: 1656, medianPricePerSqFt: "$664", medianDOM: 11 },
  { city: "Placentia", unitsSoldCurrent: 27, unitsSoldPriorYear: 31, medianSalesPrice: "$1,100,000", medianListPrice: "$1,000,000", salesToListRatio: "99.6%", lowPrice: "$490,000", highPrice: "$1,850,000", medianSqFt: 1601, medianPricePerSqFt: "$687", medianDOM: 13 },
  { city: "Portola Hills", unitsSoldCurrent: 3, unitsSoldPriorYear: 9, medianSalesPrice: "$975,000", medianListPrice: "$969,900", salesToListRatio: "100.5%", lowPrice: "$780,425", highPrice: "$1,660,000", medianSqFt: 1488, medianPricePerSqFt: "$655", medianDOM: 9 },
  { city: "Rancho Mission Viejo", unitsSoldCurrent: 22, unitsSoldPriorYear: 31, medianSalesPrice: "$1,175,000", medianListPrice: "$1,162,500", salesToListRatio: "100.0%", lowPrice: "$580,000", highPrice: "$2,422,000", medianSqFt: 1705, medianPricePerSqFt: "$689", medianDOM: 26 },
  { city: "Rancho Santa Margarita", unitsSoldCurrent: 32, unitsSoldPriorYear: 33, medianSalesPrice: "$807,000", medianListPrice: "$804,000", salesToListRatio: "100.0%", lowPrice: "$474,000", highPrice: "$1,559,900", medianSqFt: 1280, medianPricePerSqFt: "$630", medianDOM: 26 },
  { city: "Rossmoor", unitsSoldCurrent: 6, unitsSoldPriorYear: 6, medianSalesPrice: "$1,812,500", medianListPrice: "$1,810,000", salesToListRatio: "99.5%", lowPrice: "$1,580,000", highPrice: "$2,889,000", medianSqFt: 2133, medianPricePerSqFt: "$850", medianDOM: 6 },
  { city: "San Clemente", unitsSoldCurrent: 61, unitsSoldPriorYear: 51, medianSalesPrice: "$1,740,000", medianListPrice: "$1,740,000", salesToListRatio: "97.7%", lowPrice: "$500,000", highPrice: "$5,650,000", medianSqFt: 1948, medianPricePerSqFt: "$893", medianDOM: 17 },
  { city: "San Juan Capistrano", unitsSoldCurrent: 31, unitsSoldPriorYear: 29, medianSalesPrice: "$1,155,000", medianListPrice: "$1,200,000", salesToListRatio: "98.8%", lowPrice: "$485,000", highPrice: "$4,600,000", medianSqFt: 1484, medianPricePerSqFt: "$778", medianDOM: 21 },
  { city: "Santa Ana", unitsSoldCurrent: 67, unitsSoldPriorYear: 78, medianSalesPrice: "$822,500", medianListPrice: "$797,000", salesToListRatio: "100.0%", lowPrice: "$260,000", highPrice: "$2,250,000", medianSqFt: 1192, medianPricePerSqFt: "$690", medianDOM: 28 },
  { city: "Seal Beach", unitsSoldCurrent: 39, unitsSoldPriorYear: 41, medianSalesPrice: "$379,000", medianListPrice: "$379,000", salesToListRatio: "100.0%", lowPrice: "$220,000", highPrice: "$4,100,000", medianSqFt: 1080, medianPricePerSqFt: "$351", medianDOM: 22 },
  { city: "Stanton", unitsSoldCurrent: 14, unitsSoldPriorYear: 14, medianSalesPrice: "$744,000", medianListPrice: "$753,500", salesToListRatio: "99.8%", lowPrice: "$440,000", highPrice: "$930,000", medianSqFt: 1201, medianPricePerSqFt: "$620", medianDOM: 21 },
  { city: "Talega", unitsSoldCurrent: 16, unitsSoldPriorYear: 6, medianSalesPrice: "$1,712,500", medianListPrice: "$1,769,400", salesToListRatio: "97.3%", lowPrice: "$875,000", highPrice: "$3,050,000", medianSqFt: 2497, medianPricePerSqFt: "$686", medianDOM: 12 },
  { city: "Tustin", unitsSoldCurrent: 34, unitsSoldPriorYear: 45, medianSalesPrice: "$1,192,500", medianListPrice: "$1,193,500", salesToListRatio: "98.7%", lowPrice: "$540,000", highPrice: "$2,820,000", medianSqFt: 1760, medianPricePerSqFt: "$678", medianDOM: 30 },
  { city: "Villa Park", unitsSoldCurrent: 5, unitsSoldPriorYear: 5, medianSalesPrice: "$2,698,000", medianListPrice: "$2,698,000", salesToListRatio: "100.0%", lowPrice: "$1,800,000", highPrice: "$4,890,000", medianSqFt: 4341, medianPricePerSqFt: "$622", medianDOM: 12 },
  { city: "Westminster", unitsSoldCurrent: 23, unitsSoldPriorYear: 25, medianSalesPrice: "$1,250,000", medianListPrice: "$1,250,000", salesToListRatio: "100.0%", lowPrice: "$650,000", highPrice: "$1,588,000", medianSqFt: 1498, medianPricePerSqFt: "$834", medianDOM: 12 },
  { city: "Yorba Linda", unitsSoldCurrent: 64, unitsSoldPriorYear: 71, medianSalesPrice: "$1,386,500", medianListPrice: "$1,355,000", salesToListRatio: "100.0%", lowPrice: "$520,000", highPrice: "$4,785,000", medianSqFt: 2214, medianPricePerSqFt: "$626", medianDOM: 19 },
  { city: "All of O.C.", unitsSoldCurrent: cfg.closedSales.unitsSold, unitsSoldPriorYear: cfg.closedSales.unitsSoldPriorYear, medianSalesPrice: cfg.closedSales.medianSalesPrice, medianListPrice: cfg.closedSales.medianListPrice, salesToListRatio: cfg.closedSales.salesToListRatio, lowPrice: "$122,500", highPrice: "$38,900,000", medianSqFt: cfg.closedSales.medianSqFt, medianPricePerSqFt: cfg.closedSales.medianPricePerSqFt, medianDOM: cfg.closedSales.medianDOM }
];

export const OC_SOLD_REPORT: OCSoldReportEntry[] = RAW_SOLD_REPORT.map(item => {
  const current = item.unitsSoldCurrent ?? item.unitsSoldAugust2026 ?? (item as any).unitsSold2026 ?? 0;
  const prior = item.unitsSoldPriorYear ?? item.unitsSoldAugust2025 ?? (item as any).unitsSold2025 ?? 0;
  return {
    ...item,
    unitsSoldCurrent: current,
    unitsSoldPriorYear: prior,
    unitsSold2026: current,
    unitsSold2025: prior,
    unitsSoldAugust2026: current,
    unitsSoldAugust2025: prior,
    unitsSoldJuly2026: current,
    unitsSoldJuly2025: prior,
  };
});

export const OC_SITTING_ON_MARKET_REPORT = OC_MARKET_TIME_REPORT;

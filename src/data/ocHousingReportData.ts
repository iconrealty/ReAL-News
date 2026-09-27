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
// 1. BI-WEEKLY REPORT CONFIGURATION — SEPTEMBER 14, 2026 (THE BUYER'S PLAYBOOK)
// =============================================================================
export const BI_WEEKLY_REPORT_CONFIG = {
  // Report Identity
  reportDate: "September 14, 2026",
  coverDate: "September 14, 2026",
  priorReportDate: "August 31, 2026",
  priorYearReportDate: "August 2025",
  title: "The Buyer's Playbook",
  subtitle: "Buyers equipped with the newest housing trends will possess a strategic playbook to excel in the real estate market.",
  author: "Steven Thomas",
  publisher: "Reports On Housing",

  // Page 9: Active Inventory
  actives: 4939,
  activesTwoWeeksAgo: 4982,
  activesLastYear: 4758,
  preCovidActivesAverage: 6520,
  ytdNewListings: 21374,

  // Page 9: 30-Day Buyer Demand (Pending Escrows)
  demand: 1468,
  demandTwoWeeksAgo: 1528,
  demandLastYear: 1591,
  springPeakDemand: 1678,
  preCovidDemandAverage: 2363,

  // Page 9: Expected Market Time (Velocity in Days)
  marketTime: 101,
  marketTimeTwoWeeksAgo: 98,
  marketTimeLastYear: 90,
  preCovidMarketTimeAverage: 84,

  // Property Type Breakdowns
  detached: {
    marketTime: 92,
    marketTimeTwoWeeksAgo: 90,
    marketTimeLastYear: 88,
    actives: 2700,
    demand: 882,
  },
  attached: {
    marketTime: 115,
    marketTimeTwoWeeksAgo: 109,
    marketTimeLastYear: 93,
    actives: 2239,
    demand: 586,
  },

  // Luxury End ($2.5M+)
  luxury: {
    marketTime: 157,
    marketTimeTwoWeeksAgo: 144,
    marketTimeLastYear: 215,
    actives: 979,
    activesTwoWeeksAgo: 995,
    demand: 187,
    demandTwoWeeksAgo: 208,
  },

  // Page 3: Closed vs Last List Price Breakdown
  listPriceBreakdown: {
    belowAskingPct: "52%",
    belowAskingMedianShaved: "$32,500",
    belowAskingMedianDOM: 34,
    atAskingPct: "18%",
    atAskingMedianDOM: 9,
    aboveAskingPct: "30%",
    aboveAskingMedianPremium: "$21,000",
    aboveAskingMedianDOM: 9,
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

  // Distressed Properties
  distressed: {
    actives: 12,
    activesTwoWeeksAgo: 11,
    lastYearActives: 12,
    foreclosures: 4,
    shortSales: 8,
    listingsPct: "0.2%",
    demandPct: "0.4%",
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
  // 6: DOWN, UP, UP -> WEAK / SLOWER
  if (demandTrend === 'DOWN' && supplyTrend === 'UP' && emtTrend === 'UP') {
    return { direction: 'WEAK' as const, speed: 'SLOWER' as const, fullText: 'MARKET SPEED: WEAK • SLOWER', demandTrend, supplyTrend, emtTrend, matchedRowId: 6 };
  }
  // 7: UP, UP, DOWN -> IMPROVING / FASTER
  if (demandTrend === 'UP' && supplyTrend === 'UP' && emtTrend === 'DOWN') {
    return { direction: 'IMPROVING' as const, speed: 'FASTER' as const, fullText: 'MARKET SPEED: IMPROVING • FASTER', demandTrend, supplyTrend, emtTrend, matchedRowId: 7 };
  }
  // 8: DOWN, DOWN, UP -> WEAKENING / SLOWER (September 14, 2026 Match)
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
  demand: cfg.demand, // 1468
  demandPrior: cfg.demandTwoWeeksAgo, // 1528
  demandDelta: cfg.demand - cfg.demandTwoWeeksAgo, // -60
  demandTrend: 'DOWN' as const,
  
  supply: cfg.actives, // 4939
  supplyPrior: cfg.activesTwoWeeksAgo, // 4982
  supplyDelta: cfg.actives - cfg.activesTwoWeeksAgo, // -43
  supplyTrend: 'DOWN' as const,
  
  emtDays: cfg.marketTime, // 101
  emtDaysPrior: cfg.marketTimeTwoWeeksAgo, // 98
  emtDelta: cfg.marketTime - cfg.marketTimeTwoWeeksAgo, // +3
  speed: 'SLOWER' as const,
  direction: 'WEAKENING' as const,
  fullText: 'MARKET SPEED: WEAKENING • SLOWER',
  matchedRowId: 8
};

// =============================================================================
// 3. EXECUTIVE SUMMARY CARDS (Derived from September 14, 2026 Report)
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
    summary: `Expected Market Time slowed by 3 days over the past two weeks to ${cfg.marketTime} days as demand fell faster than supply. The market is now in balanced territory, leaning towards a slight buyer's market, its slowest September level since 2011.`,
    keyTakeaways: [
      `Countywide Expected Market Time is at ${cfg.marketTime} days (up 3 days from ${cfg.marketTimeTwoWeeksAgo}d two weeks ago).`,
      `Attached Condominiums & Townhomes: ${cfg.attached.marketTime} days (up from ${cfg.attached.marketTimeTwoWeeksAgo}d two weeks ago; ${cfg.attached.marketTimeLastYear}d last year).`,
      `Detached Single-Family: ${cfg.detached.marketTime} days (up from ${cfg.detached.marketTimeTwoWeeksAgo}d two weeks ago; ${cfg.detached.marketTimeLastYear}d last year).`,
      `Detached single-family homes continue to sell considerably faster (92 days) than attached condominiums (115 days).`
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
    summary: `Demand, the snapshot of new pending sales over the prior month, dropped by 60 pending sales (-4%) to ${cfg.demand.toLocaleString()} pending escrows due to mortgage rates hovering above 7.17%. Last year, demand was ${cfg.demandLastYear.toLocaleString()} pending sales.`,
    keyTakeaways: [
      `Buyer demand stands at ${cfg.demand.toLocaleString()} pending sales (down 60 escrows or -4% in 2 weeks).`,
      `Spring peak demand was ${cfg.springPeakDemand.toLocaleString()} pending sales.`,
      `Last year's pace: ${cfg.demandLastYear.toLocaleString()} pending sales (-8% YoY).`,
      `Pre-COVID 3-year average was ${cfg.preCovidDemandAverage.toLocaleString()} pending sales (61% higher than today).`
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
    trend2Weeks: `${inventoryDelta2Wks} homes (${inventoryPct2Wks}%) in 2 wks`,
    isTrendPositive: true,
    compLastYear: `${cfg.activesLastYear.toLocaleString()} homes (+${inventoryPctYoY}% YoY / ${inventoryDeltaYoY} more)`,
    summary: `The active listing inventory decreased by 43 homes (-1%) over the past two weeks to ${cfg.actives.toLocaleString()} listings as the autumn seasonal slowdown begins. Inventory appears to have peaked a month ago at 5,054 homes.`,
    keyTakeaways: [
      `Active inventory is at ${cfg.actives.toLocaleString()} homes (down 43 homes or -1% in 2 weeks).`,
      `Peaked a month ago at 5,054 homes.`,
      `Compared to last year's ${cfg.activesLastYear.toLocaleString()} homes (+4% YoY).`,
      `Pre-COVID 3-year average was ${cfg.preCovidActivesAverage.toLocaleString()} homes (32% higher).`,
      `${cfg.ytdNewListings.toLocaleString()} homes placed on the market YTD through August.`
    ],
    category: "supply"
  },
  {
    id: "pricing",
    title: "Closed vs. Last List Price",
    shortTitle: "Pricing Trends",
    currentStat: "52% Below Ask",
    currentValue: 52,
    unit: "August Closings",
    trend2Weeks: "30% Sold Above Asking",
    isTrendPositive: false,
    compLastYear: "18% Sold at Full Asking",
    summary: `Even though the housing market is leaning toward buyers, only 52% of all closed sales in August sold below asking price (median $32,500 shaved off after 34 days on market). 48% sold at or above asking price, proving turnkey homes still sell rapidly.`,
    keyTakeaways: [
      `52% of August closed sales sold below last asking price (median discount of $32,500 after 34 days DOM).`,
      `18% sold at the exact list price (median of 9 days on market).`,
      `30% sold above the last list price (median of $21,000 over asking and only 9 days on market).`,
      `Turnkey, realistically priced homes in excellent condition continue to attract intense buyer attention and fast offers.`
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
    summary: `There were ${cfg.closedSales.unitsSold.toLocaleString()} closed residential resales in ${cfg.closedSales.period}, down 6% from ${cfg.closedSales.priorYearPeriod}'s ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales and down 9% from July 2026. The countywide median sales price was ${cfg.closedSales.medianSalesPrice} with an average sales-to-list ratio of ${cfg.closedSales.salesToListRatio}.`,
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
    trend: `${inventoryDelta2Wks} in 2 wks (${inventoryPct2Wks}%)`,
    description: `Active inventory decreased by 43 homes to ${cfg.actives.toLocaleString()} listings, up 4% compared to last year (${cfg.activesLastYear.toLocaleString()} homes).`
  },
  {
    title: "Buyer Demand",
    stat: `${cfg.demand.toLocaleString()} Escrows`,
    trend: `${demandDelta2Wks} in 2 wks (${demandPct2Wks}%)`,
    description: `30-day pending sales dropped by 4% to ${cfg.demand.toLocaleString()} escrows due to mortgage rates around 7.17%. Demand is down 8% vs last year (${cfg.demandLastYear.toLocaleString()} escrows).`
  },
  {
    title: "Expected Market Time",
    stat: `${cfg.marketTime} Days`,
    trend: `+${marketTimeDelta2Wks} days vs 2 wks ago`,
    description: `Market speed slowed by 3 days to ${cfg.marketTime} days in balanced territory. Detached homes are at 92 days while attached condominiums are at 115 days.`
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
// 4. PAGE 10: CITY MARKET TIME REPORT (September 14, 2026 — The Buyer's Playbook)
// Tabulated from CRLMS as of 9/10/2026
// =============================================================================
export const OC_MARKET_TIME_REPORT: OCMarketTimeEntry[] = [
  { city: "Aliso Viejo", region: "South OC", currentActives: 69, demand30Days: 28, marketTimeDays: 74, marketTime2WeeksAgo: 86, marketTime4WeeksAgo: 60, marketTime1YearAgo: 53, marketTime2YearsAgo: 55, medianActiveListPrice: "$860k" },
  { city: "Anaheim", region: "North OC", currentActives: 267, demand30Days: 90, marketTimeDays: 89, marketTime2WeeksAgo: 93, marketTime4WeeksAgo: 95, marketTime1YearAgo: 89, marketTime2YearsAgo: 54, medianActiveListPrice: "$900k" },
  { city: "Anaheim Hills", region: "North OC", currentActives: 46, demand30Days: 17, marketTimeDays: 81, marketTime2WeeksAgo: 65, marketTime4WeeksAgo: 67, marketTime1YearAgo: 61, marketTime2YearsAgo: 87, medianActiveListPrice: "$1.3m" },
  { city: "Brea", region: "North OC", currentActives: 46, demand30Days: 18, marketTimeDays: 77, marketTime2WeeksAgo: 55, marketTime4WeeksAgo: 52, marketTime1YearAgo: 120, marketTime2YearsAgo: 43, medianActiveListPrice: "$1.1m" },
  { city: "Buena Park", region: "North OC", currentActives: 65, demand30Days: 27, marketTimeDays: 72, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 63, marketTime1YearAgo: 68, marketTime2YearsAgo: 86, medianActiveListPrice: "$900k" },
  { city: "Corona Del Mar", region: "Coastal", currentActives: 67, demand30Days: 11, marketTimeDays: 183, marketTime2WeeksAgo: 78, marketTime4WeeksAgo: 90, marketTime1YearAgo: 254, marketTime2YearsAgo: 210, medianActiveListPrice: "$6.6m" },
  { city: "Costa Mesa", region: "Coastal", currentActives: 109, demand30Days: 44, marketTimeDays: 74, marketTime2WeeksAgo: 84, marketTime4WeeksAgo: 70, marketTime1YearAgo: 77, marketTime2YearsAgo: 92, medianActiveListPrice: "$1.5m" },
  { city: "Coto De Caza", region: "South OC", currentActives: 57, demand30Days: 13, marketTimeDays: 132, marketTime2WeeksAgo: 177, marketTime4WeeksAgo: 177, marketTime1YearAgo: 148, marketTime2YearsAgo: 98, medianActiveListPrice: "$2.7m" },
  { city: "Cypress", region: "North OC", currentActives: 60, demand30Days: 19, marketTimeDays: 95, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 66, marketTime1YearAgo: 68, marketTime2YearsAgo: 105, medianActiveListPrice: "$1.0m" },
  { city: "Dana Point", region: "Coastal", currentActives: 92, demand30Days: 28, marketTimeDays: 99, marketTime2WeeksAgo: 95, marketTime4WeeksAgo: 129, marketTime1YearAgo: 91, marketTime2YearsAgo: 109, medianActiveListPrice: "$2.3m" },
  { city: "Dove Canyon", region: "South OC", currentActives: 4, demand30Days: 3, marketTimeDays: 40, marketTime2WeeksAgo: 30, marketTime4WeeksAgo: 70, marketTime1YearAgo: 105, marketTime2YearsAgo: 90, medianActiveListPrice: "$1.7m" },
  { city: "Foothill Ranch", region: "South OC", currentActives: 17, demand30Days: 4, marketTimeDays: 128, marketTime2WeeksAgo: 190, marketTime4WeeksAgo: 105, marketTime1YearAgo: 65, marketTime2YearsAgo: 70, medianActiveListPrice: "$850k" },
  { city: "Fountain Valley", region: "Central OC", currentActives: 44, demand30Days: 30, marketTimeDays: 44, marketTime2WeeksAgo: 52, marketTime4WeeksAgo: 61, marketTime1YearAgo: 48, marketTime2YearsAgo: 37, medianActiveListPrice: "$1.6m" },
  { city: "Fullerton", region: "North OC", currentActives: 135, demand30Days: 62, marketTimeDays: 65, marketTime2WeeksAgo: 71, marketTime4WeeksAgo: 71, marketTime1YearAgo: 55, marketTime2YearsAgo: 69, medianActiveListPrice: "$945k" },
  { city: "Garden Grove", region: "Central OC", currentActives: 109, demand30Days: 44, marketTimeDays: 74, marketTime2WeeksAgo: 79, marketTime4WeeksAgo: 76, marketTime1YearAgo: 60, marketTime2YearsAgo: 64, medianActiveListPrice: "$975k" },
  { city: "Huntington Beach", region: "Coastal", currentActives: 294, demand30Days: 112, marketTimeDays: 79, marketTime2WeeksAgo: 81, marketTime4WeeksAgo: 96, marketTime1YearAgo: 68, marketTime2YearsAgo: 80, medianActiveListPrice: "$1.4m" },
  { city: "Irvine", region: "South OC", currentActives: 748, demand30Days: 144, marketTimeDays: 156, marketTime2WeeksAgo: 177, marketTime4WeeksAgo: 163, marketTime1YearAgo: 143, marketTime2YearsAgo: 112, medianActiveListPrice: "$1.6m" },
  { city: "La Habra", region: "North OC", currentActives: 80, demand30Days: 23, marketTimeDays: 104, marketTime2WeeksAgo: 69, marketTime4WeeksAgo: 94, marketTime1YearAgo: 83, marketTime2YearsAgo: 30, medianActiveListPrice: "$850k" },
  { city: "La Palma", region: "North OC", currentActives: 12, demand30Days: 5, marketTimeDays: 72, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 47, marketTime1YearAgo: 15, marketTime2YearsAgo: 53, medianActiveListPrice: "$1.2m" },
  { city: "Ladera Ranch", region: "South OC", currentActives: 58, demand30Days: 13, marketTimeDays: 134, marketTime2WeeksAgo: 180, marketTime4WeeksAgo: 165, marketTime1YearAgo: 87, marketTime2YearsAgo: 79, medianActiveListPrice: "$1.2m" },
  { city: "Laguna Beach", region: "Coastal", currentActives: 151, demand30Days: 21, marketTimeDays: 216, marketTime2WeeksAgo: 214, marketTime4WeeksAgo: 261, marketTime1YearAgo: 253, marketTime2YearsAgo: 257, medianActiveListPrice: "$4.7m" },
  { city: "Laguna Hills", region: "South OC", currentActives: 62, demand30Days: 16, marketTimeDays: 116, marketTime2WeeksAgo: 155, marketTime4WeeksAgo: 103, marketTime1YearAgo: 113, marketTime2YearsAgo: 60, medianActiveListPrice: "$1.1m" },
  { city: "Laguna Niguel", region: "South OC", currentActives: 149, demand30Days: 52, marketTimeDays: 86, marketTime2WeeksAgo: 113, marketTime4WeeksAgo: 99, marketTime1YearAgo: 106, marketTime2YearsAgo: 94, medianActiveListPrice: "$1.5m" },
  { city: "Laguna Woods", region: "South OC", currentActives: 202, demand30Days: 63, marketTimeDays: 96, marketTime2WeeksAgo: 88, marketTime4WeeksAgo: 92, marketTime1YearAgo: 88, marketTime2YearsAgo: 43, medianActiveListPrice: "$437k" },
  { city: "Lake Forest", region: "South OC", currentActives: 206, demand30Days: 41, marketTimeDays: 151, marketTime2WeeksAgo: 151, marketTime4WeeksAgo: 169, marketTime1YearAgo: 69, marketTime2YearsAgo: 52, medianActiveListPrice: "$1.2m" },
  { city: "Los Alamitos", region: "North OC", currentActives: 12, demand30Days: 9, marketTimeDays: 40, marketTime2WeeksAgo: 47, marketTime4WeeksAgo: 60, marketTime1YearAgo: 56, marketTime2YearsAgo: 40, medianActiveListPrice: "$1.8m" },
  { city: "Mission Viejo", region: "South OC", currentActives: 151, demand30Days: 65, marketTimeDays: 70, marketTime2WeeksAgo: 73, marketTime4WeeksAgo: 66, marketTime1YearAgo: 108, marketTime2YearsAgo: 81, medianActiveListPrice: "$1.1m" },
  { city: "Newport Beach", region: "Coastal", currentActives: 239, demand30Days: 46, marketTimeDays: 156, marketTime2WeeksAgo: 131, marketTime4WeeksAgo: 152, marketTime1YearAgo: 164, marketTime2YearsAgo: 202, medianActiveListPrice: "$4.9m" },
  { city: "Newport Coast", region: "Coastal", currentActives: 47, demand30Days: 7, marketTimeDays: 201, marketTime2WeeksAgo: 180, marketTime4WeeksAgo: 169, marketTime1YearAgo: 275, marketTime2YearsAgo: 132, medianActiveListPrice: "$13.0m" },
  { city: "North Tustin", region: "Central OC", currentActives: 27, demand30Days: 8, marketTimeDays: 101, marketTime2WeeksAgo: 174, marketTime4WeeksAgo: 69, marketTime1YearAgo: 62, marketTime2YearsAgo: 155, medianActiveListPrice: "$2.5m" },
  { city: "Orange", region: "Central OC", currentActives: 173, demand30Days: 45, marketTimeDays: 115, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 82, marketTime1YearAgo: 62, marketTime2YearsAgo: 67, medianActiveListPrice: "$1.2m" },
  { city: "Placentia", region: "North OC", currentActives: 73, demand30Days: 17, marketTimeDays: 129, marketTime2WeeksAgo: 133, marketTime4WeeksAgo: 70, marketTime1YearAgo: 46, marketTime2YearsAgo: 49, medianActiveListPrice: "$900k" },
  { city: "Portola Hills", region: "South OC", currentActives: 30, demand30Days: 7, marketTimeDays: 129, marketTime2WeeksAgo: 120, marketTime4WeeksAgo: 140, marketTime1YearAgo: 108, marketTime2YearsAgo: 25, medianActiveListPrice: "$1.5m" },
  { city: "Rancho Mission Viejo", region: "South OC", currentActives: 101, demand30Days: 27, marketTimeDays: 112, marketTime2WeeksAgo: 86, marketTime4WeeksAgo: 165, marketTime1YearAgo: 150, marketTime2YearsAgo: 87, medianActiveListPrice: "$1.1m" },
  { city: "Rancho Santa Margarita", region: "South OC", currentActives: 71, demand30Days: 21, marketTimeDays: 101, marketTime2WeeksAgo: 116, marketTime4WeeksAgo: 104, marketTime1YearAgo: 82, marketTime2YearsAgo: 79, medianActiveListPrice: "$839k" },
  { city: "Rossmoor", region: "North OC", currentActives: 2, demand30Days: 3, marketTimeDays: 20, marketTime2WeeksAgo: 50, marketTime4WeeksAgo: 36, marketTime1YearAgo: 70, marketTime2YearsAgo: 135, medianActiveListPrice: "$2.0m" },
  { city: "San Clemente", region: "Coastal", currentActives: 125, demand30Days: 45, marketTimeDays: 83, marketTime2WeeksAgo: 72, marketTime4WeeksAgo: 73, marketTime1YearAgo: 102, marketTime2YearsAgo: 84, medianActiveListPrice: "$2.2m" },
  { city: "San Juan Capistrano", region: "South OC", currentActives: 74, demand30Days: 27, marketTimeDays: 82, marketTime2WeeksAgo: 81, marketTime4WeeksAgo: 70, marketTime1YearAgo: 90, marketTime2YearsAgo: 81, medianActiveListPrice: "$1.7m" },
  { city: "Santa Ana", region: "Central OC", currentActives: 219, demand30Days: 65, marketTimeDays: 101, marketTime2WeeksAgo: 81, marketTime4WeeksAgo: 103, marketTime1YearAgo: 74, marketTime2YearsAgo: 73, medianActiveListPrice: "$850k" },
  { city: "Seal Beach", region: "Coastal", currentActives: 94, demand30Days: 42, marketTimeDays: 67, marketTime2WeeksAgo: 54, marketTime4WeeksAgo: 57, marketTime1YearAgo: 50, marketTime2YearsAgo: 53, medianActiveListPrice: "$394k" },
  { city: "Stanton", region: "Central OC", currentActives: 25, demand30Days: 9, marketTimeDays: 83, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 168, marketTime1YearAgo: 40, marketTime2YearsAgo: 46, medianActiveListPrice: "$680k" },
  { city: "Talega", region: "Coastal", currentActives: 25, demand30Days: 11, marketTimeDays: 68, marketTime2WeeksAgo: 51, marketTime4WeeksAgo: 58, marketTime1YearAgo: 340, marketTime2YearsAgo: 62, medianActiveListPrice: "$2.0m" },
  { city: "Tustin", region: "Central OC", currentActives: 104, demand30Days: 24, marketTimeDays: 130, marketTime2WeeksAgo: 87, marketTime4WeeksAgo: 101, marketTime1YearAgo: 73, marketTime2YearsAgo: 40, medianActiveListPrice: "$1.1m" },
  { city: "Villa Park", region: "Central OC", currentActives: 16, demand30Days: 3, marketTimeDays: 160, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 90, marketTime1YearAgo: 70, marketTime2YearsAgo: 158, medianActiveListPrice: "$2.9m" },
  { city: "Westminster", region: "Central OC", currentActives: 46, demand30Days: 15, marketTimeDays: 92, marketTime2WeeksAgo: 85, marketTime4WeeksAgo: 74, marketTime1YearAgo: 52, marketTime2YearsAgo: 60, medianActiveListPrice: "$1.2m" },
  { city: "Yorba Linda", region: "North OC", currentActives: 141, demand30Days: 50, marketTimeDays: 85, marketTime2WeeksAgo: 64, marketTime4WeeksAgo: 69, marketTime1YearAgo: 63, marketTime2YearsAgo: 47, medianActiveListPrice: "$1.5m" },
];

// =============================================================================
// 5. PAGE 11: PRICE RANGE REPORT (September 14, 2026 — The Buyer's Playbook)
// =============================================================================
export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "All of O.C.", currentActives: 4939, demand30Days: 1468, marketTimeDays: 101, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 99, marketTime1YearAgo: 90, marketTime2YearsAgo: 78, medianActivePrice: "$1.3m" },
  { priceRange: "$0-$500k", currentActives: 408, demand30Days: 133, marketTimeDays: 92, marketTime2WeeksAgo: 87, marketTime4WeeksAgo: 100, marketTime1YearAgo: 70, marketTime2YearsAgo: 55, medianActivePrice: "$410k" },
  { priceRange: "$500k-$750k", currentActives: 682, demand30Days: 179, marketTimeDays: 114, marketTime2WeeksAgo: 110, marketTime4WeeksAgo: 98, marketTime1YearAgo: 81, marketTime2YearsAgo: 48, medianActivePrice: "$635k" },
  { priceRange: "$750k-$1m", currentActives: 777, demand30Days: 276, marketTimeDays: 84, marketTime2WeeksAgo: 79, marketTime4WeeksAgo: 83, marketTime1YearAgo: 65, marketTime2YearsAgo: 54, medianActivePrice: "$899k" },
  { priceRange: "$1m-$1.25m", currentActives: 596, demand30Days: 205, marketTimeDays: 87, marketTime2WeeksAgo: 84, marketTime4WeeksAgo: 85, marketTime1YearAgo: 66, marketTime2YearsAgo: 62, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 574, demand30Days: 189, marketTimeDays: 91, marketTime2WeeksAgo: 87, marketTime4WeeksAgo: 82, marketTime1YearAgo: 67, marketTime2YearsAgo: 75, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 643, demand30Days: 207, marketTimeDays: 93, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 96, marketTime1YearAgo: 87, marketTime2YearsAgo: 103, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 280, demand30Days: 92, marketTimeDays: 91, marketTime2WeeksAgo: 96, marketTime4WeeksAgo: 103, marketTime1YearAgo: 137, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 439, demand30Days: 124, marketTimeDays: 106, marketTime2WeeksAgo: 95, marketTime4WeeksAgo: 111, marketTime1YearAgo: 163, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 241, demand30Days: 37, marketTimeDays: 195, marketTime2WeeksAgo: 185, marketTime4WeeksAgo: 168, marketTime1YearAgo: 224, marketTime2YearsAgo: 257, medianActivePrice: "$4.9m" },
  { priceRange: "$6m+", currentActives: 299, demand30Days: 26, marketTimeDays: 345, marketTime2WeeksAgo: 352, marketTime4WeeksAgo: 370, marketTime1YearAgo: 447, marketTime2YearsAgo: 295, medianActivePrice: "$10.0m" },
];

export const OC_PRICE_RANGE_REPORT_ATTACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Attached", currentActives: 2239, demand30Days: 586, marketTimeDays: 115, marketTime2WeeksAgo: 109, marketTime4WeeksAgo: 118, marketTime1YearAgo: 93, marketTime2YearsAgo: 70, medianActivePrice: "$788k" },
  { priceRange: "$0-$500k", currentActives: 401, demand30Days: 131, marketTimeDays: 92, marketTime2WeeksAgo: 86, marketTime4WeeksAgo: 98, marketTime1YearAgo: 66, marketTime2YearsAgo: 53, medianActivePrice: "$410k" },
  { priceRange: "$500k-$750k", currentActives: 656, demand30Days: 167, marketTimeDays: 118, marketTime2WeeksAgo: 114, marketTime4WeeksAgo: 106, marketTime1YearAgo: 81, marketTime2YearsAgo: 51, medianActivePrice: "$635k" },
  { priceRange: "$750k-$1m", currentActives: 527, demand30Days: 157, marketTimeDays: 101, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 109, marketTime1YearAgo: 81, marketTime2YearsAgo: 68, medianActivePrice: "$875k" },
  { priceRange: "$1m-$2m", currentActives: 520, demand30Days: 102, marketTimeDays: 153, marketTime2WeeksAgo: 153, marketTime4WeeksAgo: 168, marketTime1YearAgo: 129, marketTime2YearsAgo: 99, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 135, demand30Days: 29, marketTimeDays: 140, marketTime2WeeksAgo: 102, marketTime4WeeksAgo: 147, marketTime1YearAgo: 211, marketTime2YearsAgo: 207, medianActivePrice: "$3.2m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: 2700, demand30Days: 882, marketTimeDays: 92, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 87, marketTime1YearAgo: 88, marketTime2YearsAgo: 84, medianActivePrice: "$1.8m" },
  { priceRange: "$0-$750k", currentActives: 33, demand30Days: 14, marketTimeDays: 71, marketTime2WeeksAgo: 75, marketTime4WeeksAgo: 46, marketTime1YearAgo: 105, marketTime2YearsAgo: 39, medianActivePrice: "$625k" },
  { priceRange: "$750k-$1m", currentActives: 250, demand30Days: 119, marketTimeDays: 63, marketTime2WeeksAgo: 55, marketTime4WeeksAgo: 53, marketTime1YearAgo: 49, marketTime2YearsAgo: 44, medianActivePrice: "$924k" },
  { priceRange: "$1m-$1.25m", currentActives: 350, demand30Days: 149, marketTimeDays: 70, marketTime2WeeksAgo: 69, marketTime4WeeksAgo: 62, marketTime1YearAgo: 52, marketTime2YearsAgo: 50, medianActivePrice: "$1.2m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 406, demand30Days: 161, marketTimeDays: 76, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 67, marketTime1YearAgo: 54, marketTime2YearsAgo: 71, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 537, demand30Days: 189, marketTimeDays: 85, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 89, marketTime1YearAgo: 78, marketTime2YearsAgo: 103, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 241, demand30Days: 82, marketTimeDays: 88, marketTime2WeeksAgo: 93, marketTime4WeeksAgo: 98, marketTime1YearAgo: 139, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 385, demand30Days: 114, marketTimeDays: 101, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 111, marketTime1YearAgo: 151, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 214, demand30Days: 29, marketTimeDays: 221, marketTime2WeeksAgo: 211, marketTime4WeeksAgo: 173, marketTime1YearAgo: 226, marketTime2YearsAgo: 269, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 284, demand30Days: 25, marketTimeDays: 341, marketTime2WeeksAgo: 347, marketTime4WeeksAgo: 353, marketTime1YearAgo: 444, marketTime2YearsAgo: 282, medianActivePrice: "$10.4m" },
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
  { city: "Placentia", unitsSoldCurrent: 27, unitsSoldPriorYear: 31, medianSalesPrice: "$1,100,000", medianListPrice: "$1,099,000", salesToListRatio: "99.6%", lowPrice: "$490,000", highPrice: "$1,850,000", medianSqFt: 1601, medianPricePerSqFt: "$687", medianDOM: 13 },
  { city: "Portola Hills", unitsSoldCurrent: 3, unitsSoldPriorYear: 9, medianSalesPrice: "$975,000", medianListPrice: "$969,900", salesToListRatio: "100.5%", lowPrice: "$780,425", highPrice: "$1,660,000", medianSqFt: 1488, medianPricePerSqFt: "$655", medianDOM: 5 },
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
  { city: "Yorba Linda", unitsSoldCurrent: 64, unitsSoldPriorYear: 71, medianSalesPrice: "$1,386,000", medianListPrice: "$1,355,000", salesToListRatio: "100.0%", lowPrice: "$520,000", highPrice: "$4,785,000", medianSqFt: 2214, medianPricePerSqFt: "$626", medianDOM: 19 },
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

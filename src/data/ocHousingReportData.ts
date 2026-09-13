// =============================================================================
// ORANGE COUNTY HOUSING REPORT DATA — STEVEN THOMAS (Reports On Housing)
// Single Source of Truth for Bi-Weekly Market Intelligence
// =============================================================================
//
// 📌 HOW TO UPDATE EVERY 2 WEEKS:
// 1. Update the `BI_WEEKLY_REPORT_CONFIG` below with the newest report numbers.
//    - All executive summary cards, deltas, percentages, bullet highlights, and
//      countywide badges across the entire app will automatically update.
// 2. (Optional/Page 10) Update `OC_MARKET_TIME_REPORT` with new city market times.
// 3. (Optional/Page 11) Update `OC_PRICE_RANGE_REPORT_ALL`, `_ATTACHED`, `_DETACHED`.
// 4. (Monthly/Page 12) Update `RAW_SOLD_REPORT` using `unitsSoldCurrent` & `unitsSoldPriorYear`.
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
  category: 'supply' | 'demand' | 'speed' | 'luxury' | 'sales' | 'distressed';
}

export interface OCHousingSummaryBullet {
  title: string;
  stat: string;
  trend: string;
  description: string;
}

// =============================================================================
// 1. BI-WEEKLY REPORT CONFIGURATION (Update this section every 2 weeks)
// =============================================================================
export const BI_WEEKLY_REPORT_CONFIG = {
  // Report Identity
  reportDate: "August 31, 2026",
  coverDate: "August 31, 2026",
  priorReportDate: "August 17, 2026",
  priorYearReportDate: "August 2025",
  title: "Falling Into Autumn",
  subtitle: "Housing's seasonal shift is underway, as the autumn market ushers in a distinctly different pace from the rest of the year.",
  author: "Steven Thomas",
  publisher: "Reports On Housing",

  // Page 9: Active Inventory
  actives: 4982,
  activesTwoWeeksAgo: 5054,
  activesLastYear: 4869,
  preCovidActivesAverage: 6569,
  ytdNewListings: 18948,

  // Page 9: 30-Day Buyer Demand (Pending Escrows)
  demand: 1528,
  demandTwoWeeksAgo: 1535,
  demandLastYear: 1559,
  springPeakDemand: 1678,
  preCovidDemandAverage: 2438,

  // Page 9: Expected Market Time (Velocity in Days)
  marketTime: 98,
  marketTimeTwoWeeksAgo: 99,
  marketTimeLastYear: 94,

  // Property Type Breakdowns
  detached: {
    marketTime: 90,
    marketTimeTwoWeeksAgo: 87,
    marketTimeLastYear: 95,
    actives: 2750,
    demand: 916,
  },
  attached: {
    marketTime: 109,
    marketTimeTwoWeeksAgo: 118,
    marketTimeLastYear: 91,
    actives: 2232,
    demand: 612,
  },

  // Luxury End ($2.5M+)
  luxury: {
    marketTime: 144,
    marketTimeTwoWeeksAgo: 155,
    marketTimeLastYear: 248,
    actives: 995,
    activesTwoWeeksAgo: 1019,
    demand: 208,
    demandTwoWeeksAgo: 197,
  },

  // Page 12: Closed Resale Report
  closedSales: {
    period: "July 2026",
    priorYearPeriod: "July 2025",
    unitsSold: 1930,
    unitsSoldPriorYear: 1934,
    medianSalesPrice: "$1,220,000",
    medianListPrice: "$1,211,900",
    salesToListRatio: "99.5%",
    medianPricePerSqFt: "$717",
    medianSqFt: 1701,
    medianDOM: 19,
    equitySalesPercentage: "99.5%",
  },

  // Distressed Properties
  distressed: {
    actives: 11,
    activesTwoWeeksAgo: 9,
    lastYearActives: 7,
    foreclosures: 4,
    shortSales: 7,
    listingsPct: "0.2%",
    demandPct: "0.5%",
  },
};

// =============================================================================
// 2. AUTOMATIC DELTA CALCULATIONS & METADATA DERIVATION
// =============================================================================
const cfg = BI_WEEKLY_REPORT_CONFIG;

const inventoryDelta2Wks = cfg.actives - cfg.activesTwoWeeksAgo;
const inventoryPct2Wks = Math.round((inventoryDelta2Wks / cfg.activesTwoWeeksAgo) * 100);
const inventoryDeltaYoY = cfg.actives - cfg.activesLastYear;
const inventoryPctYoY = Math.round((inventoryDeltaYoY / cfg.activesLastYear) * 100);

const demandDelta2Wks = cfg.demand - cfg.demandTwoWeeksAgo;
const demandPct2Wks = ((demandDelta2Wks / cfg.demandTwoWeeksAgo) * 100).toFixed(1);
const demandDeltaYoY = cfg.demand - cfg.demandLastYear;
const demandPctYoY = Math.round((demandDeltaYoY / cfg.demandLastYear) * 100);

const marketTimeDelta2Wks = cfg.marketTime - cfg.marketTimeTwoWeeksAgo;
const marketTimeDeltaYoY = cfg.marketTime - cfg.marketTimeLastYear;

const luxuryMarketTimeDelta2Wks = cfg.luxury.marketTime - cfg.luxury.marketTimeTwoWeeksAgo;
const luxuryDemandDelta2Wks = cfg.luxury.demand - cfg.luxury.demandTwoWeeksAgo;
const luxuryDemandPct2Wks = Math.round((luxuryDemandDelta2Wks / cfg.luxury.demandTwoWeeksAgo) * 100);

const closedSalesDeltaYoY = cfg.closedSales.unitsSold - cfg.closedSales.unitsSoldPriorYear;
const closedSalesPctYoY = Math.round((closedSalesDeltaYoY / cfg.closedSales.unitsSoldPriorYear) * 100);

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
  closedSalesYoYNote: closedSalesDeltaYoY === 0 
    ? `Level with ${cfg.closedSales.priorYearPeriod} (${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales). Average ${cfg.closedSales.salesToListRatio} sales-to-list ratio.`
    : `${closedSalesDeltaYoY > 0 ? `+${closedSalesDeltaYoY}` : closedSalesDeltaYoY} sales vs ${cfg.closedSales.priorYearPeriod} (${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales). Average ${cfg.closedSales.salesToListRatio} sales-to-list ratio.`,

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
  closedSalesJuly2026: cfg.closedSales.unitsSold,
  closedSalesJuly2025: cfg.closedSales.unitsSoldPriorYear,
  medianSalesPriceJuly2026: cfg.closedSales.medianSalesPrice,
  countywideMedianPrice: cfg.closedSales.medianSalesPrice,
  medianListPriceJuly2026: cfg.closedSales.medianListPrice,
  medianSalesPrice: cfg.closedSales.medianSalesPrice,
  medianListPrice: cfg.closedSales.medianListPrice,
  salesToListRatioJuly2026: cfg.closedSales.salesToListRatio,
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
  demand: cfg.demand, // 1528
  demandPrior: cfg.demandTwoWeeksAgo, // 1535
  demandDelta: cfg.demand - cfg.demandTwoWeeksAgo, // -7
  demandTrend: 'DOWN' as const,
  
  supply: cfg.actives, // 4982
  supplyPrior: cfg.activesTwoWeeksAgo, // 5054
  supplyDelta: cfg.actives - cfg.activesTwoWeeksAgo, // -72
  supplyTrend: 'DOWN' as const,
  
  emtDays: cfg.marketTime, // 98
  emtDaysPrior: cfg.marketTimeTwoWeeksAgo, // 99
  emtDelta: cfg.marketTime - cfg.marketTimeTwoWeeksAgo, // -1
  speed: 'FASTER' as const,
  direction: 'IMPROVING' as const,
  fullText: 'MARKET SPEED: IMPROVING • FASTER',
  matchedRowId: 1
};

// =============================================================================
// 3. EXECUTIVE SUMMARY CARDS (Automatically Derived from Config)
// =============================================================================
export const OC_HOUSING_SUMMARY_CARDS: OCSummaryCardData[] = [
  {
    id: "speed",
    title: "Expected Market Time",
    shortTitle: "Market Speed",
    currentStat: `${cfg.marketTime} Days`,
    currentValue: cfg.marketTime,
    unit: "Days to Sell",
    trend2Weeks: `${marketTimeDelta2Wks > 0 ? '+' : ''}${marketTimeDelta2Wks} day${Math.abs(marketTimeDelta2Wks) === 1 ? '' : 's'} (from ${cfg.marketTimeTwoWeeksAgo}d)`,
    isTrendPositive: marketTimeDelta2Wks <= 0,
    compLastYear: `${cfg.marketTimeLastYear} days (${marketTimeDeltaYoY === 0 ? 'identical pace' : marketTimeDeltaYoY < 0 ? `${Math.abs(marketTimeDeltaYoY)}d faster` : `${marketTimeDeltaYoY}d slower`})`,
    summary: `Expected Market Time stands at ${cfg.marketTime} days (${marketTimeDelta2Wks < 0 ? `${Math.abs(marketTimeDelta2Wks)} day improvement` : marketTimeDelta2Wks > 0 ? `${marketTimeDelta2Wks} day increase` : 'unchanged'} from ${cfg.marketTimeTwoWeeksAgo} days two weeks ago). The market remains in balanced/slight seller territory.`,
    keyTakeaways: [
      `Countywide market speed is at ${cfg.marketTime} days (from ${cfg.marketTimeTwoWeeksAgo}d 2 weeks ago).`,
      `Attached Condos/Townhomes: ${cfg.attached.marketTime} days (vs ${cfg.attached.marketTimeTwoWeeksAgo}d 2 wks ago; ${cfg.attached.marketTimeLastYear}d last year).`,
      `Detached Single-Family: ${cfg.detached.marketTime} days (vs ${cfg.detached.marketTimeTwoWeeksAgo}d 2 wks ago; ${cfg.detached.marketTimeLastYear}d last year).`,
      `Detached single-family homes continue to trade faster than attached properties.`
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
    trend2Weeks: `${demandDelta2Wks > 0 ? '+' : ''}${demandDelta2Wks} escrows (${demandPct2Wks}%) in 2 wks`,
    isTrendPositive: demandDelta2Wks >= 0,
    compLastYear: `${cfg.demandLastYear.toLocaleString()} escrows (${demandPctYoY > 0 ? '+' : ''}${demandPctYoY}% YoY / ${Math.abs(demandDeltaYoY)} ${demandDeltaYoY >= 0 ? 'more' : 'fewer'})`,
    summary: `Demand, the snapshot of new pending sales over the prior month, is at ${cfg.demand.toLocaleString()} pending escrows (${demandDelta2Wks > 0 ? '+' : ''}${demandDelta2Wks} in two weeks). Last year, demand was ${cfg.demandLastYear.toLocaleString()} pending sales.`,
    keyTakeaways: [
      `Buyer demand stands at ${cfg.demand.toLocaleString()} pending sales (${demandDelta2Wks > 0 ? '+' : ''}${demandDelta2Wks} in 2 weeks).`,
      `Spring peak was ${cfg.springPeakDemand.toLocaleString()} pending sales.`,
      `Last year's pace: ${cfg.demandLastYear.toLocaleString()} pending sales (${demandPctYoY > 0 ? '+' : ''}${demandPctYoY}% YoY).`,
      `Pre-COVID 3-year average was ${cfg.preCovidDemandAverage.toLocaleString()} pending sales.`
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
    trend2Weeks: `${inventoryDelta2Wks > 0 ? '+' : ''}${inventoryDelta2Wks.toLocaleString()} homes (${inventoryPct2Wks > 0 ? '+' : ''}${inventoryPct2Wks}%) in 2 wks`,
    isTrendPositive: inventoryDelta2Wks <= 0,
    compLastYear: `${cfg.activesLastYear.toLocaleString()} homes (${inventoryPctYoY > 0 ? '+' : ''}${inventoryPctYoY}% YoY / ${Math.abs(inventoryDeltaYoY)} ${inventoryDeltaYoY >= 0 ? 'more' : 'fewer'})`,
    summary: `The active listing inventory stood at ${cfg.actives.toLocaleString()} homes (${inventoryDelta2Wks > 0 ? '+' : ''}${inventoryDelta2Wks} homes in the past two weeks). Last year, inventory stood at ${cfg.activesLastYear.toLocaleString()} listings (${inventoryPctYoY > 0 ? '+' : ''}${inventoryPctYoY}% YoY).`,
    keyTakeaways: [
      `Active inventory is at ${cfg.actives.toLocaleString()} homes (${inventoryDelta2Wks > 0 ? '+' : ''}${inventoryDelta2Wks} in 2 weeks).`,
      `Compared to last year's ${cfg.activesLastYear.toLocaleString()} homes (${inventoryPctYoY > 0 ? '+' : ''}${inventoryPctYoY}% YoY).`,
      `Pre-COVID 3-year average was ${cfg.preCovidActivesAverage.toLocaleString()} homes.`,
      `${cfg.ytdNewListings.toLocaleString()} homes placed on the market YTD.`
    ],
    category: "supply"
  },
  {
    id: "closed",
    title: cfg.closedSales.period,
    shortTitle: "Closed Sales",
    currentStat: `${cfg.closedSales.unitsSold.toLocaleString()} Sales`,
    currentValue: cfg.closedSales.unitsSold,
    unit: `${cfg.closedSales.salesToListRatio} Sale-to-List Ratio`,
    trend2Weeks: closedSalesDeltaYoY === 0 ? `Level vs ${cfg.closedSales.priorYearPeriod}` : `${closedSalesDeltaYoY > 0 ? `+${closedSalesPctYoY}%` : `${closedSalesPctYoY}%`} vs ${cfg.closedSales.priorYearPeriod}`,
    isTrendPositive: closedSalesDeltaYoY >= 0,
    compLastYear: `${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales in ${cfg.closedSales.priorYearPeriod} (${closedSalesDeltaYoY >= 0 ? `+${closedSalesDeltaYoY}` : closedSalesDeltaYoY} sales)`,
    summary: `There were ${cfg.closedSales.unitsSold.toLocaleString()} closed residential sales in ${cfg.closedSales.period} reported countywide in Steven Thomas's Page 12 report (compared to ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} in ${cfg.closedSales.priorYearPeriod}). The sales-to-list price ratio stood at ${cfg.closedSales.salesToListRatio} with a countywide median sales price of ${cfg.closedSales.medianSalesPrice}.`,
    keyTakeaways: [
      `${cfg.closedSales.unitsSold.toLocaleString()} residential sales closed in ${cfg.closedSales.period} (${closedSalesDeltaYoY === 0 ? 'level with' : `${closedSalesDeltaYoY > 0 ? '+' : ''}${closedSalesDeltaYoY} vs`} ${cfg.closedSales.priorYearPeriod}'s ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()}).`,
      `Countywide median sales price: ${cfg.closedSales.medianSalesPrice} (${cfg.closedSales.medianPricePerSqFt}/sq ft).`,
      `Sales-to-list price ratio captured: ${cfg.closedSales.salesToListRatio}.`,
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
    trend: `${inventoryDelta2Wks > 0 ? '+' : ''}${inventoryDelta2Wks} in 2 wks (${inventoryPct2Wks > 0 ? '+' : ''}${inventoryPct2Wks}%)`,
    description: `Active inventory stands at ${cfg.actives.toLocaleString()} listings, ${inventoryPctYoY > 0 ? `+${inventoryPctYoY}%` : `${inventoryPctYoY}%`} compared to last year (${cfg.activesLastYear.toLocaleString()} homes).`
  },
  {
    title: "Buyer Demand",
    stat: `${cfg.demand.toLocaleString()} Escrows`,
    trend: `${demandDelta2Wks > 0 ? '+' : ''}${demandDelta2Wks} in 2 wks (${demandPct2Wks}%)`,
    description: `30-day pending sales stand at ${cfg.demand.toLocaleString()} escrows. Demand is ${demandPctYoY > 0 ? `+${demandPctYoY}%` : `${demandPctYoY}%`} vs last year (${cfg.demandLastYear.toLocaleString()} escrows).`
  },
  {
    title: "Expected Market Time",
    stat: `${cfg.marketTime} Days`,
    trend: `${marketTimeDelta2Wks > 0 ? '+' : ''}${marketTimeDelta2Wks} day vs 2 wks ago`,
    description: `Market speed is at ${cfg.marketTime} days in balanced territory. Detached is at ${cfg.detached.marketTime} days while attached is at ${cfg.attached.marketTime} days.`
  },
  {
    title: "Luxury End ($2.5M+)",
    stat: `${cfg.luxury.marketTime} Days`,
    trend: `${luxuryMarketTimeDelta2Wks > 0 ? '+' : ''}${luxuryMarketTimeDelta2Wks} days vs 2 wks ago`,
    description: `Luxury market time stands at ${cfg.luxury.marketTime} days with ${cfg.luxury.actives} active luxury listings and ${cfg.luxury.demand} pending escrows.`
  },
  {
    title: `${cfg.closedSales.period} Closed Sales`,
    stat: `${cfg.closedSales.unitsSold.toLocaleString()} Units`,
    trend: closedSalesDeltaYoY === 0 ? `Level vs ${cfg.closedSales.priorYearPeriod}` : `${closedSalesDeltaYoY > 0 ? `+${closedSalesPctYoY}%` : `${closedSalesPctYoY}%`} vs ${cfg.closedSales.priorYearPeriod}`,
    description: `${cfg.closedSales.unitsSold.toLocaleString()} sales closed in ${cfg.closedSales.period} compared to ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} in ${cfg.closedSales.priorYearPeriod}. Median price is ${cfg.closedSales.medianSalesPrice} with ${cfg.closedSales.salesToListRatio} sales-to-list ratio.`
  },
  {
    title: "Distressed Properties",
    stat: `${cfg.distressed.actives} Homes (${cfg.distressed.listingsPct})`,
    trend: "Historical Low",
    description: `Only ${cfg.distressed.foreclosures} foreclosures and ${cfg.distressed.shortSales} short sales countywide, accounting for just ${cfg.distressed.listingsPct} of active supply and ${cfg.distressed.demandPct} of demand.`
  }
];

// =============================================================================
// 4. PAGE 10: CITY MARKET TIME REPORT (Expected Market Time by City)
// =============================================================================
export const OC_MARKET_TIME_REPORT: OCMarketTimeEntry[] = [
  { city: "Aliso Viejo", region: "South OC", currentActives: 77, demand30Days: 27, marketTimeDays: 86, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 77, marketTime1YearAgo: 60, marketTime2YearsAgo: 46, medianActiveListPrice: "$899k" },
  { city: "Anaheim", region: "North OC", currentActives: 266, demand30Days: 86, marketTimeDays: 93, marketTime2WeeksAgo: 95, marketTime4WeeksAgo: 98, marketTime1YearAgo: 81, marketTime2YearsAgo: 48, medianActiveListPrice: "$900k" },
  { city: "Anaheim Hills", region: "North OC", currentActives: 37, demand30Days: 17, marketTimeDays: 65, marketTime2WeeksAgo: 67, marketTime4WeeksAgo: 73, marketTime1YearAgo: 107, marketTime2YearsAgo: 54, medianActiveListPrice: "$1.5m" },
  { city: "Brea", region: "North OC", currentActives: 46, demand30Days: 25, marketTimeDays: 55, marketTime2WeeksAgo: 52, marketTime4WeeksAgo: 60, marketTime1YearAgo: 76, marketTime2YearsAgo: 47, medianActiveListPrice: "$1.1m" },
  { city: "Buena Park", region: "North OC", currentActives: 70, demand30Days: 30, marketTimeDays: 70, marketTime2WeeksAgo: 63, marketTime4WeeksAgo: 80, marketTime1YearAgo: 58, marketTime2YearsAgo: 49, medianActiveListPrice: "$928k" },
  { city: "Corona Del Mar", region: "Coastal", currentActives: 57, demand30Days: 22, marketTimeDays: 78, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 202, marketTime1YearAgo: 196, marketTime2YearsAgo: 210, medianActiveListPrice: "$6.4m" },
  { city: "Costa Mesa", region: "Coastal", currentActives: 112, demand30Days: 40, marketTimeDays: 84, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 114, marketTime1YearAgo: 76, marketTime2YearsAgo: 76, medianActiveListPrice: "$1.6m" },
  { city: "Coto De Caza", region: "South OC", currentActives: 59, demand30Days: 10, marketTimeDays: 177, marketTime2WeeksAgo: 177, marketTime4WeeksAgo: 396, marketTime1YearAgo: 133, marketTime2YearsAgo: 93, medianActiveListPrice: "$2.8m" },
  { city: "Cypress", region: "North OC", currentActives: 60, demand30Days: 20, marketTimeDays: 90, marketTime2WeeksAgo: 66, marketTime4WeeksAgo: 60, marketTime1YearAgo: 94, marketTime2YearsAgo: 66, medianActiveListPrice: "$944k" },
  { city: "Dana Point", region: "Coastal", currentActives: 101, demand30Days: 32, marketTimeDays: 95, marketTime2WeeksAgo: 129, marketTime4WeeksAgo: 140, marketTime1YearAgo: 140, marketTime2YearsAgo: 132, medianActiveListPrice: "$2.3m" },
  { city: "Dove Canyon", region: "South OC", currentActives: 4, demand30Days: 4, marketTimeDays: 30, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 60, marketTime1YearAgo: 75, marketTime2YearsAgo: 40, medianActiveListPrice: "$1.7m" },
  { city: "Foothill Ranch", region: "South OC", currentActives: 19, demand30Days: 3, marketTimeDays: 190, marketTime2WeeksAgo: 105, marketTime4WeeksAgo: 90, marketTime1YearAgo: 135, marketTime2YearsAgo: 40, medianActiveListPrice: "$875k" },
  { city: "Fountain Valley", region: "Central OC", currentActives: 50, demand30Days: 29, marketTimeDays: 52, marketTime2WeeksAgo: 61, marketTime4WeeksAgo: 74, marketTime1YearAgo: 51, marketTime2YearsAgo: 43, medianActiveListPrice: "$1.6m" },
  { city: "Fullerton", region: "North OC", currentActives: 133, demand30Days: 56, marketTimeDays: 71, marketTime2WeeksAgo: 71, marketTime4WeeksAgo: 78, marketTime1YearAgo: 71, marketTime2YearsAgo: 53, medianActiveListPrice: "$979k" },
  { city: "Garden Grove", region: "Central OC", currentActives: 108, demand30Days: 41, marketTimeDays: 79, marketTime2WeeksAgo: 76, marketTime4WeeksAgo: 82, marketTime1YearAgo: 50, marketTime2YearsAgo: 62, medianActiveListPrice: "$999k" },
  { city: "Huntington Beach", region: "Coastal", currentActives: 300, demand30Days: 111, marketTimeDays: 81, marketTime2WeeksAgo: 96, marketTime4WeeksAgo: 79, marketTime1YearAgo: 80, marketTime2YearsAgo: 73, medianActiveListPrice: "$1.5m" },
  { city: "Irvine", region: "South OC", currentActives: 801, demand30Days: 136, marketTimeDays: 177, marketTime2WeeksAgo: 163, marketTime4WeeksAgo: 158, marketTime1YearAgo: 156, marketTime2YearsAgo: 114, medianActiveListPrice: "$1.6m" },
  { city: "La Habra", region: "North OC", currentActives: 69, demand30Days: 30, marketTimeDays: 69, marketTime2WeeksAgo: 94, marketTime4WeeksAgo: 87, marketTime1YearAgo: 62, marketTime2YearsAgo: 34, medianActiveListPrice: "$850k" },
  { city: "La Palma", region: "North OC", currentActives: 13, demand30Days: 4, marketTimeDays: 98, marketTime2WeeksAgo: 47, marketTime4WeeksAgo: 56, marketTime1YearAgo: 36, marketTime2YearsAgo: 68, medianActiveListPrice: "$1.3m" },
  { city: "Ladera Ranch", region: "South OC", currentActives: 60, demand30Days: 10, marketTimeDays: 180, marketTime2WeeksAgo: 165, marketTime4WeeksAgo: 111, marketTime1YearAgo: 104, marketTime2YearsAgo: 65, medianActiveListPrice: "$1.3m" },
  { city: "Laguna Beach", region: "Coastal", currentActives: 164, demand30Days: 23, marketTimeDays: 214, marketTime2WeeksAgo: 261, marketTime4WeeksAgo: 235, marketTime1YearAgo: 259, marketTime2YearsAgo: 251, medianActiveListPrice: "$4.9m" },
  { city: "Laguna Hills", region: "South OC", currentActives: 62, demand30Days: 12, marketTimeDays: 155, marketTime2WeeksAgo: 103, marketTime4WeeksAgo: 82, marketTime1YearAgo: 130, marketTime2YearsAgo: 51, medianActiveListPrice: "$1.1m" },
  { city: "Laguna Niguel", region: "South OC", currentActives: 165, demand30Days: 44, marketTimeDays: 113, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 129, marketTime1YearAgo: 116, marketTime2YearsAgo: 98, medianActiveListPrice: "$1.5m" },
  { city: "Laguna Woods", region: "South OC", currentActives: 205, demand30Days: 70, marketTimeDays: 88, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 101, marketTime1YearAgo: 70, marketTime2YearsAgo: 39, medianActiveListPrice: "$450k" },
  { city: "Lake Forest", region: "South OC", currentActives: 211, demand30Days: 42, marketTimeDays: 151, marketTime2WeeksAgo: 169, marketTime4WeeksAgo: 158, marketTime1YearAgo: 89, marketTime2YearsAgo: 53, medianActiveListPrice: "$1.3m" },
  { city: "Los Alamitos", region: "North OC", currentActives: 14, demand30Days: 9, marketTimeDays: 47, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 90, marketTime1YearAgo: 38, marketTime2YearsAgo: 50, medianActiveListPrice: "$1.6m" },
  { city: "Mission Viejo", region: "South OC", currentActives: 154, demand30Days: 63, marketTimeDays: 73, marketTime2WeeksAgo: 66, marketTime4WeeksAgo: 56, marketTime1YearAgo: 94, marketTime2YearsAgo: 66, medianActiveListPrice: "$1.1m" },
  { city: "Newport Beach", region: "Coastal", currentActives: 240, demand30Days: 55, marketTimeDays: 131, marketTime2WeeksAgo: 152, marketTime4WeeksAgo: 163, marketTime1YearAgo: 139, marketTime2YearsAgo: 203, medianActiveListPrice: "$5.0m" },
  { city: "Newport Coast", region: "Coastal", currentActives: 42, demand30Days: 7, marketTimeDays: 180, marketTime2WeeksAgo: 169, marketTime4WeeksAgo: 201, marketTime1YearAgo: 330, marketTime2YearsAgo: 125, medianActiveListPrice: "$10.7m" },
  { city: "North Tustin", region: "Central OC", currentActives: 29, demand30Days: 5, marketTimeDays: 174, marketTime2WeeksAgo: 69, marketTime4WeeksAgo: 45, marketTime1YearAgo: 85, marketTime2YearsAgo: 72, medianActiveListPrice: "$2.5m" },
  { city: "Orange", region: "Central OC", currentActives: 159, demand30Days: 48, marketTimeDays: 99, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 72, marketTime1YearAgo: 61, marketTime2YearsAgo: 70, medianActiveListPrice: "$1.2m" },
  { city: "Placentia", region: "North OC", currentActives: 71, demand30Days: 16, marketTimeDays: 133, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 68, marketTime1YearAgo: 49, marketTime2YearsAgo: 58, medianActiveListPrice: "$900k" },
  { city: "Portola Hills", region: "South OC", currentActives: 28, demand30Days: 7, marketTimeDays: 120, marketTime2WeeksAgo: 140, marketTime4WeeksAgo: 145, marketTime1YearAgo: 100, marketTime2YearsAgo: 48, medianActiveListPrice: "$1.7m" },
  { city: "Rancho Mission Viejo", region: "South OC", currentActives: 89, demand30Days: 31, marketTimeDays: 86, marketTime2WeeksAgo: 165, marketTime4WeeksAgo: 233, marketTime1YearAgo: 90, marketTime2YearsAgo: 71, medianActiveListPrice: "$1.1m" },
  { city: "Rancho Santa Margarita", region: "South OC", currentActives: 77, demand30Days: 20, marketTimeDays: 116, marketTime2WeeksAgo: 104, marketTime4WeeksAgo: 79, marketTime1YearAgo: 82, marketTime2YearsAgo: 59, medianActiveListPrice: "$850k" },
  { city: "Rossmoor", region: "North OC", currentActives: 5, demand30Days: 3, marketTimeDays: 50, marketTime2WeeksAgo: 36, marketTime4WeeksAgo: 68, marketTime1YearAgo: 240, marketTime2YearsAgo: 30, medianActiveListPrice: "$1.8m" },
  { city: "San Clemente", region: "Coastal", currentActives: 117, demand30Days: 49, marketTimeDays: 72, marketTime2WeeksAgo: 73, marketTime4WeeksAgo: 66, marketTime1YearAgo: 89, marketTime2YearsAgo: 93, medianActiveListPrice: "$2.0m" },
  { city: "San Juan Capistrano", region: "South OC", currentActives: 76, demand30Days: 28, marketTimeDays: 81, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 102, marketTime1YearAgo: 139, marketTime2YearsAgo: 78, medianActiveListPrice: "$1.8m" },
  { city: "Santa Ana", region: "Central OC", currentActives: 214, demand30Days: 79, marketTimeDays: 81, marketTime2WeeksAgo: 103, marketTime4WeeksAgo: 113, marketTime1YearAgo: 65, marketTime2YearsAgo: 55, medianActiveListPrice: "$839k" },
  { city: "Seal Beach", region: "Coastal", currentActives: 85, demand30Days: 47, marketTimeDays: 54, marketTime2WeeksAgo: 57, marketTime4WeeksAgo: 53, marketTime1YearAgo: 52, marketTime2YearsAgo: 68, medianActiveListPrice: "$469k" },
  { city: "Stanton", region: "Central OC", currentActives: 24, demand30Days: 8, marketTimeDays: 90, marketTime2WeeksAgo: 168, marketTime4WeeksAgo: 55, marketTime1YearAgo: 90, marketTime2YearsAgo: 32, medianActiveListPrice: "$640k" },
  { city: "Talega", region: "Coastal", currentActives: 22, demand30Days: 13, marketTimeDays: 51, marketTime2WeeksAgo: 58, marketTime4WeeksAgo: 60, marketTime1YearAgo: 129, marketTime2YearsAgo: 98, medianActiveListPrice: "$2.1m" },
  { city: "Tustin", region: "Central OC", currentActives: 99, demand30Days: 34, marketTimeDays: 87, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 105, marketTime1YearAgo: 90, marketTime2YearsAgo: 47, medianActiveListPrice: "$1.1m" },
  { city: "Villa Park", region: "Central OC", currentActives: 14, demand30Days: 6, marketTimeDays: 70, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 150, marketTime1YearAgo: 85, marketTime2YearsAgo: 120, medianActiveListPrice: "$3.2m" },
  { city: "Westminster", region: "Central OC", currentActives: 48, demand30Days: 17, marketTimeDays: 85, marketTime2WeeksAgo: 74, marketTime4WeeksAgo: 69, marketTime1YearAgo: 84, marketTime2YearsAgo: 73, medianActiveListPrice: "$1.2m" },
  { city: "Yorba Linda", region: "North OC", currentActives: 131, demand30Days: 61, marketTimeDays: 64, marketTime2WeeksAgo: 69, marketTime4WeeksAgo: 86, marketTime1YearAgo: 77, marketTime2YearsAgo: 53, medianActiveListPrice: "$1.5m" },
];

// =============================================================================
// 5. PAGE 11: PRICE RANGE REPORT
// =============================================================================
export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "All of O.C.", currentActives: cfg.actives, demand30Days: cfg.demand, marketTimeDays: cfg.marketTime, marketTime2WeeksAgo: cfg.marketTimeTwoWeeksAgo, marketTime4WeeksAgo: 101, marketTime1YearAgo: cfg.marketTimeLastYear, marketTime2YearsAgo: 73, medianActivePrice: "$1.3m" },
  { priceRange: "$0-$500k", currentActives: 401, demand30Days: 139, marketTimeDays: 87, marketTime2WeeksAgo: 100, marketTime4WeeksAgo: 126, marketTime1YearAgo: 60, marketTime2YearsAgo: 50, medianActivePrice: "$415k" },
  { priceRange: "$500k-$750k", currentActives: 685, demand30Days: 186, marketTimeDays: 110, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 83, marketTime1YearAgo: 79, marketTime2YearsAgo: 47, medianActivePrice: "$630k" },
  { priceRange: "$750k-$1m", currentActives: 734, demand30Days: 278, marketTimeDays: 79, marketTime2WeeksAgo: 83, marketTime4WeeksAgo: 82, marketTime1YearAgo: 72, marketTime2YearsAgo: 45, medianActivePrice: "$890k" },
  { priceRange: "$1m-$1.25m", currentActives: 610, demand30Days: 219, marketTimeDays: 84, marketTime2WeeksAgo: 85, marketTime4WeeksAgo: 83, marketTime1YearAgo: 64, marketTime2YearsAgo: 62, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 577, demand30Days: 198, marketTimeDays: 87, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 79, marketTime1YearAgo: 75, marketTime2YearsAgo: 66, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 675, demand30Days: 205, marketTimeDays: 99, marketTime2WeeksAgo: 96, marketTime4WeeksAgo: 99, marketTime1YearAgo: 98, marketTime2YearsAgo: 87, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 305, demand30Days: 95, marketTimeDays: 96, marketTime2WeeksAgo: 103, marketTime4WeeksAgo: 132, marketTime1YearAgo: 120, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 456, demand30Days: 144, marketTimeDays: 95, marketTime2WeeksAgo: 111, marketTime4WeeksAgo: 148, marketTime1YearAgo: 196, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 234, demand30Days: 38, marketTimeDays: 185, marketTime2WeeksAgo: 168, marketTime4WeeksAgo: 188, marketTime1YearAgo: 221, marketTime2YearsAgo: 351, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 305, demand30Days: 26, marketTimeDays: 352, marketTime2WeeksAgo: 370, marketTime4WeeksAgo: 276, marketTime1YearAgo: 540, marketTime2YearsAgo: 329, medianActivePrice: "$10.0m" },
];

export const OC_PRICE_RANGE_REPORT_ATTACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Attached", currentActives: cfg.attached.actives, demand30Days: cfg.attached.demand, marketTimeDays: cfg.attached.marketTime, marketTime2WeeksAgo: cfg.attached.marketTimeTwoWeeksAgo, marketTime4WeeksAgo: 114, marketTime1YearAgo: cfg.attached.marketTimeLastYear, marketTime2YearsAgo: 62, medianActivePrice: "$790k" },
  { priceRange: "$0-$500k", currentActives: 392, demand30Days: 137, marketTimeDays: 86, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 126, marketTime1YearAgo: 60, marketTime2YearsAgo: 48, medianActivePrice: "$415k" },
  { priceRange: "$500k-$750k", currentActives: 659, demand30Days: 174, marketTimeDays: 114, marketTime2WeeksAgo: 106, marketTime4WeeksAgo: 86, marketTime1YearAgo: 81, marketTime2YearsAgo: 48, medianActivePrice: "$629k" },
  { priceRange: "$750k-$1m", currentActives: 510, demand30Days: 156, marketTimeDays: 98, marketTime2WeeksAgo: 109, marketTime4WeeksAgo: 110, marketTime1YearAgo: 97, marketTime2YearsAgo: 51, medianActivePrice: "$879k" },
  { priceRange: "$1m-$2m", currentActives: 539, demand30Days: 106, marketTimeDays: 153, marketTime2WeeksAgo: 168, marketTime4WeeksAgo: 149, marketTime1YearAgo: 117, marketTime2YearsAgo: 99, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 132, demand30Days: 39, marketTimeDays: 102, marketTime2WeeksAgo: 147, marketTime4WeeksAgo: 176, marketTime1YearAgo: 177, marketTime2YearsAgo: 151, medianActivePrice: "$3.1m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: cfg.detached.actives, demand30Days: cfg.detached.demand, marketTimeDays: cfg.detached.marketTime, marketTime2WeeksAgo: cfg.detached.marketTimeTwoWeeksAgo, marketTime4WeeksAgo: 93, marketTime1YearAgo: cfg.detached.marketTimeLastYear, marketTime2YearsAgo: 81, medianActivePrice: "$1.8m" },
  { priceRange: "$0-$750k", currentActives: 35, demand30Days: 14, marketTimeDays: 75, marketTime2WeeksAgo: 46, marketTime4WeeksAgo: 62, marketTime1YearAgo: 62, marketTime2YearsAgo: 47, medianActivePrice: "$619k" },
  { priceRange: "$750k-$1m", currentActives: 224, demand30Days: 122, marketTimeDays: 55, marketTime2WeeksAgo: 53, marketTime4WeeksAgo: 51, marketTime1YearAgo: 50, marketTime2YearsAgo: 39, medianActivePrice: "$910k" },
  { priceRange: "$1m-$1.25m", currentActives: 356, demand30Days: 155, marketTimeDays: 69, marketTime2WeeksAgo: 62, marketTime4WeeksAgo: 61, marketTime1YearAgo: 55, marketTime2YearsAgo: 54, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 409, demand30Days: 176, marketTimeDays: 70, marketTime2WeeksAgo: 67, marketTime4WeeksAgo: 68, marketTime1YearAgo: 61, marketTime2YearsAgo: 61, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 558, demand30Days: 185, marketTimeDays: 90, marketTime2WeeksAgo: 89, marketTime4WeeksAgo: 90, marketTime1YearAgo: 92, marketTime2YearsAgo: 78, medianActivePrice: "$1.8m" },
  { priceRange: "$2m-$2.5m", currentActives: 264, demand30Days: 85, marketTimeDays: 93, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 125, marketTime1YearAgo: 117, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 404, demand30Days: 124, marketTimeDays: 98, marketTime2WeeksAgo: 111, marketTime4WeeksAgo: 143, marketTime1YearAgo: 201, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 211, demand30Days: 30, marketTimeDays: 211, marketTime2WeeksAgo: 173, marketTime4WeeksAgo: 212, marketTime1YearAgo: 233, marketTime2YearsAgo: 358, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 289, demand30Days: 25, marketTimeDays: 347, marketTime2WeeksAgo: 353, marketTime4WeeksAgo: 272, marketTime1YearAgo: 510, marketTime2YearsAgo: 317, medianActivePrice: "$10.1m" },
];

// =============================================================================
// 6. PAGE 12: CLOSED RESALE REPORT (Raw City Resale Records)
// =============================================================================
type RawSoldItem = {
  city: string;
  unitsSoldCurrent?: number;
  unitsSoldPriorYear?: number;
  unitsSoldJuly2026?: number;
  unitsSoldAugust2026?: number;
  unitsSoldJuly2025?: number;
  unitsSoldAugust2025?: number;
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
  { city: "Aliso Viejo", unitsSoldCurrent: 31, unitsSoldPriorYear: 28, medianSalesPrice: "$940,000", medianListPrice: "$949,900", salesToListRatio: "100.0%", lowPrice: "$490,000", highPrice: "$2,140,000", medianSqFt: 1500, medianPricePerSqFt: "$627", medianDOM: 13 },
  { city: "Anaheim", unitsSoldCurrent: 85, unitsSoldPriorYear: 91, medianSalesPrice: "$932,000", medianListPrice: "$935,000", salesToListRatio: "100.0%", lowPrice: "$205,000", highPrice: "$1,480,000", medianSqFt: 1482, medianPricePerSqFt: "$629", medianDOM: 13 },
  { city: "Anaheim Hills", unitsSoldCurrent: 18, unitsSoldPriorYear: 20, medianSalesPrice: "$1,405,000", medianListPrice: "$1,378,500", salesToListRatio: "100.0%", lowPrice: "$810,000", highPrice: "$3,250,000", medianSqFt: 2367, medianPricePerSqFt: "$594", medianDOM: 21 },
  { city: "Brea", unitsSoldCurrent: 31, unitsSoldPriorYear: 35, medianSalesPrice: "$1,265,000", medianListPrice: "$1,289,000", salesToListRatio: "100.0%", lowPrice: "$560,000", highPrice: "$2,688,000", medianSqFt: 2159, medianPricePerSqFt: "$586", medianDOM: 11 },
  { city: "Buena Park", unitsSoldCurrent: 33, unitsSoldPriorYear: 36, medianSalesPrice: "$905,000", medianListPrice: "$915,000", salesToListRatio: "98.8%", lowPrice: "$635,000", highPrice: "$1,700,000", medianSqFt: 1497, medianPricePerSqFt: "$605", medianDOM: 13 },
  { city: "Corona Del Mar", unitsSoldCurrent: 24, unitsSoldPriorYear: 14, medianSalesPrice: "$3,637,500", medianListPrice: "$3,550,000", salesToListRatio: "98.1%", lowPrice: "$1,895,000", highPrice: "$48,500,000", medianSqFt: 2056, medianPricePerSqFt: "$1,770", medianDOM: 39 },
  { city: "Costa Mesa", unitsSoldCurrent: 51, unitsSoldPriorYear: 67, medianSalesPrice: "$1,595,000", medianListPrice: "$1,600,000", salesToListRatio: "98.9%", lowPrice: "$631,250", highPrice: "$4,000,000", medianSqFt: 1647, medianPricePerSqFt: "$968", medianDOM: 13 },
  { city: "Coto De Caza", unitsSoldCurrent: 19, unitsSoldPriorYear: 16, medianSalesPrice: "$2,375,000", medianListPrice: "$2,490,000", salesToListRatio: "97.9%", lowPrice: "$1,350,000", highPrice: "$5,875,000", medianSqFt: 3736, medianPricePerSqFt: "$636", medianDOM: 43 },
  { city: "Cypress", unitsSoldCurrent: 28, unitsSoldPriorYear: 31, medianSalesPrice: "$1,050,000", medianListPrice: "$1,049,944", salesToListRatio: "100.0%", lowPrice: "$508,000", highPrice: "$2,025,000", medianSqFt: 1587, medianPricePerSqFt: "$662", medianDOM: 12 },
  { city: "Dana Point", unitsSoldCurrent: 44, unitsSoldPriorYear: 34, medianSalesPrice: "$1,810,000", medianListPrice: "$1,797,500", salesToListRatio: "99.5%", lowPrice: "$530,000", highPrice: "$13,250,000", medianSqFt: 1558, medianPricePerSqFt: "$1,162", medianDOM: 28 },
  { city: "Dove Canyon", unitsSoldCurrent: 7, unitsSoldPriorYear: 3, medianSalesPrice: "$1,705,000", medianListPrice: "$1,749,000", salesToListRatio: "99.2%", lowPrice: "$1,375,000", highPrice: "$1,935,000", medianSqFt: 3137, medianPricePerSqFt: "$544", medianDOM: 42 },
  { city: "Foothill Ranch", unitsSoldCurrent: 9, unitsSoldPriorYear: 8, medianSalesPrice: "$1,229,000", medianListPrice: "$1,229,000", salesToListRatio: "100.1%", lowPrice: "$665,000", highPrice: "$1,665,000", medianSqFt: 1689, medianPricePerSqFt: "$728", medianDOM: 11 },
  { city: "Fountain Valley", unitsSoldCurrent: 32, unitsSoldPriorYear: 25, medianSalesPrice: "$1,454,500", medianListPrice: "$1,437,000", salesToListRatio: "100.0%", lowPrice: "$410,000", highPrice: "$2,500,000", medianSqFt: 1908, medianPricePerSqFt: "$763", medianDOM: 9 },
  { city: "Fullerton", unitsSoldCurrent: 76, unitsSoldPriorYear: 64, medianSalesPrice: "$1,105,000", medianListPrice: "$1,039,500", salesToListRatio: "100.4%", lowPrice: "$226,000", highPrice: "$2,995,000", medianSqFt: 1689, medianPricePerSqFt: "$654", medianDOM: 14 },
  { city: "Garden Grove", unitsSoldCurrent: 60, unitsSoldPriorYear: 53, medianSalesPrice: "$1,000,000", medianListPrice: "$999,999", salesToListRatio: "100.0%", lowPrice: "$480,000", highPrice: "$1,900,000", medianSqFt: 1434, medianPricePerSqFt: "$697", medianDOM: 11 },
  { city: "Huntington Beach", unitsSoldCurrent: 138, unitsSoldPriorYear: 147, medianSalesPrice: "$1,294,000", medianListPrice: "$1,292,000", salesToListRatio: "100.0%", lowPrice: "$405,000", highPrice: "$7,200,000", medianSqFt: 1550, medianPricePerSqFt: "$835", medianDOM: 21 },
  { city: "Irvine", unitsSoldCurrent: 197, unitsSoldPriorYear: 164, medianSalesPrice: "$1,380,000", medianListPrice: "$1,450,000", salesToListRatio: "97.7%", lowPrice: "$390,000", highPrice: "$11,250,000", medianSqFt: 1878, medianPricePerSqFt: "$735", medianDOM: 34 },
  { city: "La Habra", unitsSoldCurrent: 40, unitsSoldPriorYear: 34, medianSalesPrice: "$850,000", medianListPrice: "$828,475", salesToListRatio: "100.0%", lowPrice: "$435,000", highPrice: "$2,000,000", medianSqFt: 1437, medianPricePerSqFt: "$592", medianDOM: 22 },
  { city: "La Palma", unitsSoldCurrent: 6, unitsSoldPriorYear: 7, medianSalesPrice: "$1,258,000", medianListPrice: "$1,237,500", salesToListRatio: "101.7%", lowPrice: "$670,000", highPrice: "$1,350,000", medianSqFt: 2161, medianPricePerSqFt: "$582", medianDOM: 8 },
  { city: "Ladera Ranch", unitsSoldCurrent: 22, unitsSoldPriorYear: 21, medianSalesPrice: "$1,413,750", medianListPrice: "$1,399,900", salesToListRatio: "100.0%", lowPrice: "$750,000", highPrice: "$4,525,000", medianSqFt: 2062, medianPricePerSqFt: "$686", medianDOM: 19 },
  { city: "Laguna Beach", unitsSoldCurrent: 31, unitsSoldPriorYear: 28, medianSalesPrice: "$3,350,000", medianListPrice: "$3,350,000", salesToListRatio: "95.7%", lowPrice: "$1,295,000", highPrice: "$15,000,000", medianSqFt: 1988, medianPricePerSqFt: "$1,685", medianDOM: 30 },
  { city: "Laguna Hills", unitsSoldCurrent: 27, unitsSoldPriorYear: 26, medianSalesPrice: "$1,550,000", medianListPrice: "$1,499,900", salesToListRatio: "98.9%", lowPrice: "$562,500", highPrice: "$8,550,000", medianSqFt: 2865, medianPricePerSqFt: "$541", medianDOM: 18 },
  { city: "Laguna Niguel", unitsSoldCurrent: 72, unitsSoldPriorYear: 65, medianSalesPrice: "$1,387,500", medianListPrice: "$1,450,000", salesToListRatio: "100.0%", lowPrice: "$455,000", highPrice: "$3,025,000", medianSqFt: 1849, medianPricePerSqFt: "$751", medianDOM: 17 },
  { city: "Laguna Woods", unitsSoldCurrent: 50, unitsSoldPriorYear: 63, medianSalesPrice: "$450,000", medianListPrice: "$459,500", salesToListRatio: "97.9%", lowPrice: "$190,000", highPrice: "$1,750,000", medianSqFt: 1035, medianPricePerSqFt: "$435", medianDOM: 27 },
  { city: "Lake Forest", unitsSoldCurrent: 59, unitsSoldPriorYear: 45, medianSalesPrice: "$1,229,000", medianListPrice: "$1,229,000", salesToListRatio: "99.7%", lowPrice: "$440,000", highPrice: "$3,260,000", medianSqFt: 1715, medianPricePerSqFt: "$717", medianDOM: 12 },
  { city: "Los Alamitos", unitsSoldCurrent: 9, unitsSoldPriorYear: 12, medianSalesPrice: "$1,245,000", medianListPrice: "$1,300,000", salesToListRatio: "98.4%", lowPrice: "$610,000", highPrice: "$2,200,000", medianSqFt: 1921, medianPricePerSqFt: "$648", medianDOM: 13 },
  { city: "Mission Viejo", unitsSoldCurrent: 89, unitsSoldPriorYear: 102, medianSalesPrice: "$1,230,025", medianListPrice: "$1,229,999", salesToListRatio: "100.0%", lowPrice: "$325,000", highPrice: "$2,220,000", medianSqFt: 1640, medianPricePerSqFt: "$750", medianDOM: 17 },
  { city: "Newport Beach", unitsSoldCurrent: 62, unitsSoldPriorYear: 61, medianSalesPrice: "$3,948,150", medianListPrice: "$4,060,000", salesToListRatio: "97.2%", lowPrice: "$845,000", highPrice: "$15,500,000", medianSqFt: 2556, medianPricePerSqFt: "$1,545", medianDOM: 40 },
  { city: "Newport Coast", unitsSoldCurrent: 10, unitsSoldPriorYear: 9, medianSalesPrice: "$9,750,000", medianListPrice: "$9,945,000", salesToListRatio: "94.9%", lowPrice: "$3,700,000", highPrice: "$30,100,000", medianSqFt: 4489, medianPricePerSqFt: "$2,172", medianDOM: 22 },
  { city: "North Tustin", unitsSoldCurrent: 20, unitsSoldPriorYear: 17, medianSalesPrice: "$2,299,500", medianListPrice: "$2,282,000", salesToListRatio: "99.7%", lowPrice: "$1,372,000", highPrice: "$3,900,000", medianSqFt: 3054, medianPricePerSqFt: "$753", medianDOM: 21 },
  { city: "Orange", unitsSoldCurrent: 79, unitsSoldPriorYear: 78, medianSalesPrice: "$1,180,000", medianListPrice: "$1,160,000", salesToListRatio: "99.4%", lowPrice: "$210,000", highPrice: "$3,450,000", medianSqFt: 1789, medianPricePerSqFt: "$660", medianDOM: 17 },
  { city: "Placentia", unitsSoldCurrent: 25, unitsSoldPriorYear: 34, medianSalesPrice: "$1,100,000", medianListPrice: "$1,099,000", salesToListRatio: "100.0%", lowPrice: "$444,500", highPrice: "$1,900,000", medianSqFt: 1750, medianPricePerSqFt: "$629", medianDOM: 13 },
  { city: "Portola Hills", unitsSoldCurrent: 4, unitsSoldPriorYear: 8, medianSalesPrice: "$1,350,000", medianListPrice: "$1,384,450", salesToListRatio: "99.5%", lowPrice: "$780,000", highPrice: "$2,498,600", medianSqFt: 2638, medianPricePerSqFt: "$512", medianDOM: 8 },
  { city: "Rancho Mission Viejo", unitsSoldCurrent: 26, unitsSoldPriorYear: 26, medianSalesPrice: "$1,114,000", medianListPrice: "$1,139,000", salesToListRatio: "99.2%", lowPrice: "$545,000", highPrice: "$2,050,000", medianSqFt: 1796, medianPricePerSqFt: "$620", medianDOM: 28 },
  { city: "Rancho Santa Margarita", unitsSoldCurrent: 39, unitsSoldPriorYear: 34, medianSalesPrice: "$715,000", medianListPrice: "$719,800", salesToListRatio: "99.2%", lowPrice: "$390,000", highPrice: "$1,950,000", medianSqFt: 1170, medianPricePerSqFt: "$611", medianDOM: 12 },
  { city: "Rossmoor", unitsSoldCurrent: 4, unitsSoldPriorYear: 7, medianSalesPrice: "$1,742,500", medianListPrice: "$1,747,000", salesToListRatio: "97.5%", lowPrice: "$1,600,000", highPrice: "$2,000,000", medianSqFt: 2201, medianPricePerSqFt: "$792", medianDOM: 15 },
  { city: "San Clemente", unitsSoldCurrent: 70, unitsSoldPriorYear: 55, medianSalesPrice: "$1,702,500", medianListPrice: "$1,697,000", salesToListRatio: "99.3%", lowPrice: "$515,000", highPrice: "$5,175,000", medianSqFt: 1978, medianPricePerSqFt: "$861", medianDOM: 10 },
  { city: "San Juan Capistrano", unitsSoldCurrent: 28, unitsSoldPriorYear: 35, medianSalesPrice: "$1,412,500", medianListPrice: "$1,424,500", salesToListRatio: "98.4%", lowPrice: "$417,500", highPrice: "$8,900,000", medianSqFt: 1870, medianPricePerSqFt: "$755", medianDOM: 25 },
  { city: "Santa Ana", unitsSoldCurrent: 74, unitsSoldPriorYear: 89, medianSalesPrice: "$870,000", medianListPrice: "$866,900", salesToListRatio: "100.0%", lowPrice: "$215,000", highPrice: "$3,129,000", medianSqFt: 1361, medianPricePerSqFt: "$639", medianDOM: 13 },
  { city: "Seal Beach", unitsSoldCurrent: 44, unitsSoldPriorYear: 55, medianSalesPrice: "$417,500", medianListPrice: "$427,000", salesToListRatio: "98.3%", lowPrice: "$215,000", highPrice: "$3,050,000", medianSqFt: 976, medianPricePerSqFt: "$428", medianDOM: 36 },
  { city: "Stanton", unitsSoldCurrent: 11, unitsSoldPriorYear: 10, medianSalesPrice: "$821,000", medianListPrice: "$798,888", salesToListRatio: "101.6%", lowPrice: "$387,500", highPrice: "$1,052,000", medianSqFt: 1203, medianPricePerSqFt: "$682", medianDOM: 57 },
  { city: "Talega", unitsSoldCurrent: 16, unitsSoldPriorYear: 7, medianSalesPrice: "$1,745,000", medianListPrice: "$1,749,000", salesToListRatio: "100.0%", lowPrice: "$1,075,000", highPrice: "$5,175,000", medianSqFt: 2252, medianPricePerSqFt: "$775", medianDOM: 10 },
  { city: "Tustin", unitsSoldCurrent: 45, unitsSoldPriorYear: 41, medianSalesPrice: "$1,138,000", medianListPrice: "$1,149,000", salesToListRatio: "99.4%", lowPrice: "$509,000", highPrice: "$2,075,000", medianSqFt: 1501, medianPricePerSqFt: "$758", medianDOM: 20 },
  { city: "Villa Park", unitsSoldCurrent: 5, unitsSoldPriorYear: 5, medianSalesPrice: "$2,850,000", medianListPrice: "$2,850,000", salesToListRatio: "97.8%", lowPrice: "$2,400,000", highPrice: "$3,050,000", medianSqFt: 3414, medianPricePerSqFt: "$835", medianDOM: 19 },
  { city: "Westminster", unitsSoldCurrent: 19, unitsSoldPriorYear: 33, medianSalesPrice: "$1,157,000", medianListPrice: "$1,099,000", salesToListRatio: "101.0%", lowPrice: "$730,000", highPrice: "$1,425,000", medianSqFt: 1481, medianPricePerSqFt: "$781", medianDOM: 12 },
  { city: "Yorba Linda", unitsSoldCurrent: 61, unitsSoldPriorYear: 61, medianSalesPrice: "$1,307,500", medianListPrice: "$1,300,000", salesToListRatio: "100.0%", lowPrice: "$340,000", highPrice: "$3,750,000", medianSqFt: 2176, medianPricePerSqFt: "$601", medianDOM: 18 },
  { city: "All of O.C.", unitsSoldCurrent: cfg.closedSales.unitsSold, unitsSoldPriorYear: cfg.closedSales.unitsSoldPriorYear, medianSalesPrice: cfg.closedSales.medianSalesPrice, medianListPrice: cfg.closedSales.medianListPrice, salesToListRatio: cfg.closedSales.salesToListRatio, lowPrice: "$190,000", highPrice: "$48,500,000", medianSqFt: cfg.closedSales.medianSqFt, medianPricePerSqFt: cfg.closedSales.medianPricePerSqFt, medianDOM: cfg.closedSales.medianDOM }
];

export const OC_SOLD_REPORT: OCSoldReportEntry[] = RAW_SOLD_REPORT.map(item => {
  const current = item.unitsSoldCurrent ?? item.unitsSoldJuly2026 ?? item.unitsSoldAugust2026 ?? (item as any).unitsSold2026 ?? 0;
  const prior = item.unitsSoldPriorYear ?? item.unitsSoldJuly2025 ?? item.unitsSoldAugust2025 ?? (item as any).unitsSold2025 ?? 0;
  return {
    ...item,
    unitsSoldCurrent: current,
    unitsSoldPriorYear: prior,
    unitsSold2026: current,
    unitsSold2025: prior,
    unitsSoldJuly2026: current,
    unitsSoldJuly2025: prior,
    unitsSoldAugust2026: current,
    unitsSoldAugust2025: prior,
  };
});

export const OC_SITTING_ON_MARKET_REPORT = OC_MARKET_TIME_REPORT;

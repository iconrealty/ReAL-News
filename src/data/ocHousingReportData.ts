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
// 1. BI-WEEKLY REPORT CONFIGURATION — NOVEMBER 9, 2026 (HOLIDAY SLUMBER)
// =============================================================================
export const BI_WEEKLY_REPORT_CONFIG = {
  // Report Identity
  reportDate: "November 9, 2026",
  coverDate: "November 9, 2026",
  priorReportDate: "October 26, 2026",
  priorYearReportDate: "November 2025",
  title: "Holiday Slumber",
  subtitle: "The slowest season for housing, the Holiday Market, will be even slower this year due to the recent jump in mortgage rates.",
  author: "Steven Thomas",
  publisher: "Reports On Housing",

  // Page 5 & 9: Active Inventory
  actives: 4845,
  activesTwoWeeksAgo: 4948,
  activesLastYear: 4103,
  preCovidActivesAverage: 5822,
  ytdNewListings: 25926,

  // Page 6 & 9: 30-Day Buyer Demand (Pending Escrows)
  demand: 1099,
  demandTwoWeeksAgo: 1219,
  demandLastYear: 1487,
  springPeakDemand: 1678,
  preCovidDemandAverage: 2139,

  // Page 7 & 9: Expected Market Time (Velocity in Days)
  marketTime: 132,
  marketTimeTwoWeeksAgo: 122,
  marketTimeFourWeeksAgo: 118,
  marketTimeLastYear: 83,
  marketTimeTwoYearsAgo: 72,
  preCovidMarketTimeAverage: 85,

  // Page 6, 10 & 11: Property Type Breakdowns
  detached: {
    marketTime: 123,
    marketTimeTwoWeeksAgo: 115,
    marketTimeLastYear: 77,
    actives: 2681,
    demand: 655,
  },
  attached: {
    marketTime: 146,
    marketTimeTwoWeeksAgo: 131,
    marketTimeLastYear: 92,
    actives: 2164,
    demand: 444,
  },

  // Page 8: Luxury End ($2.5M+)
  luxury: {
    marketTime: 230,
    marketTimeTwoWeeksAgo: 192,
    marketTimeLastYear: 169,
    actives: 943,
    activesTwoWeeksAgo: 958,
    demand: 123,
    demandTwoWeeksAgo: 150,
  },

  // Page 3 & 4: Holiday Market Year-End Benchmark
  holidayMarket: {
    priorYearInventoryDropPct: "-34%",
    priorYearDemandDropPct: "-36%",
    priorYearDelistedHomes: 1617,
    mortgageRate: "7.18%",
  },

  // Page 12: Closed Resale Report (September 2026 Resales)
  closedSales: {
    period: "September 2026",
    priorYearPeriod: "September 2025",
    unitsSold: 1729,
    unitsSoldPriorYear: 1805,
    medianSalesPrice: "$1,209,000",
    medianListPrice: "$1,199,999",
    salesToListRatio: "99.1%",
    medianPricePerSqFt: "$696",
    medianSqFt: 1737,
    medianDOM: 21,
    equitySalesPercentage: "99.83%",
  },

  // Page 9: Distressed Properties
  distressed: {
    actives: 21,
    activesTwoWeeksAgo: 18,
    lastYearActives: 6,
    foreclosures: 9,
    shortSales: 12,
    listingsPct: "0.4%",
    demandPct: "0.6%",
  },
};

// =============================================================================
// 2. AUTOMATIC DELTA CALCULATIONS & METADATA DERIVATION
// =============================================================================
const cfg = BI_WEEKLY_REPORT_CONFIG;

const inventoryDelta2Wks = cfg.actives - cfg.activesTwoWeeksAgo; // -103
const inventoryPct2Wks = Math.round((inventoryDelta2Wks / cfg.activesTwoWeeksAgo) * 100); // -2%
const inventoryDeltaYoY = cfg.actives - cfg.activesLastYear; // +742
const inventoryPctYoY = Math.round((inventoryDeltaYoY / cfg.activesLastYear) * 100); // +18%

const demandDelta2Wks = cfg.demand - cfg.demandTwoWeeksAgo; // -120
const demandPct2Wks = ((demandDelta2Wks / cfg.demandTwoWeeksAgo) * 100).toFixed(1); // -9.8%
const demandDeltaYoY = cfg.demand - cfg.demandLastYear; // -388
const demandPctYoY = Math.round((demandDeltaYoY / cfg.demandLastYear) * 100); // -26%

const marketTimeDelta2Wks = cfg.marketTime - cfg.marketTimeTwoWeeksAgo; // +10
const marketTimeDeltaYoY = cfg.marketTime - cfg.marketTimeLastYear; // +49

const luxuryMarketTimeDelta2Wks = cfg.luxury.marketTime - cfg.luxury.marketTimeTwoWeeksAgo; // +38
const luxuryDemandDelta2Wks = cfg.luxury.demand - cfg.luxury.demandTwoWeeksAgo; // -27
const luxuryDemandPct2Wks = Math.round((luxuryDemandDelta2Wks / cfg.luxury.demandTwoWeeksAgo) * 100); // -18%

const closedSalesDeltaYoY = cfg.closedSales.unitsSold - cfg.closedSales.unitsSoldPriorYear; // -76
const closedSalesPctYoY = Math.round((closedSalesDeltaYoY / cfg.closedSales.unitsSoldPriorYear) * 100); // -4%

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
  closedSalesYoYNote: `${closedSalesDeltaYoY < 0 ? `${closedSalesDeltaYoY}` : `+${closedSalesDeltaYoY}`} sales (${closedSalesPctYoY}%) vs ${cfg.closedSales.priorYearPeriod} (${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales). Average ${cfg.closedSales.salesToListRatio} sales-to-list ratio.`,

  // Core Summary Totals (Backwards Compatible)
  countywideActives: cfg.actives,
  countywideActivesLastYear: cfg.activesLastYear,
  countywideDemand: cfg.demand,
  countywideDemandLastYear: cfg.demandLastYear,
  countywideMarketTime: cfg.marketTime,
  countywideMarketTime2WksAgo: cfg.marketTimeTwoWeeksAgo,
  countywideMarketTime4WksAgo: cfg.marketTimeFourWeeksAgo,
  countywideMarketTimeLastYear: cfg.marketTimeLastYear,
  countywideMarketTime2YrsAgo: cfg.marketTimeTwoYearsAgo,

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
  closedSalesJuly2026: 1755,
  closedSalesJuly2025: 1875,
  medianSalesPriceJuly2026: "$1,215,000",
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
  // 8: DOWN, DOWN, UP -> WEAKENING / SLOWER (November 9, 2026 Match)
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
  demand: cfg.demand, // 1099
  demandPrior: cfg.demandTwoWeeksAgo, // 1219
  demandDelta: cfg.demand - cfg.demandTwoWeeksAgo, // -120
  demandTrend: STEVEN_THOMAS_MARKET_DIRECTION.demandTrend,
  
  supply: cfg.actives, // 4845
  supplyPrior: cfg.activesTwoWeeksAgo, // 4948
  supplyDelta: cfg.actives - cfg.activesTwoWeeksAgo, // -103
  supplyTrend: STEVEN_THOMAS_MARKET_DIRECTION.supplyTrend,
  
  emtDays: cfg.marketTime, // 132
  emtDaysPrior: cfg.marketTimeTwoWeeksAgo, // 122
  emtDelta: cfg.marketTime - cfg.marketTimeTwoWeeksAgo, // +10
  speed: STEVEN_THOMAS_MARKET_DIRECTION.speed ?? ('SLOWER' as const),
  direction: STEVEN_THOMAS_MARKET_DIRECTION.direction,
  fullText: STEVEN_THOMAS_MARKET_DIRECTION.fullText,
  matchedRowId: STEVEN_THOMAS_MARKET_DIRECTION.matchedRowId
};

// =============================================================================
// PAGE 8: ORANGE COUNTY MARKET BREAKDOWN (NOVEMBER 9, 2026)
// Price Ranges, Market Speed & Velocity
// =============================================================================
export interface OCPage8BreakdownRow {
  priceRange: string;
  speedCategory: "Hot Seller's" | "Slight Seller's" | "Balanced Market" | "Slight Buyer's" | "Buyer's Market";
  marketTimeDays: number;
  pctCurrentInventory: number;
  pctCurrentDemand: number;
  inventoryCount: number;
  demandCount: number;
  lastYearDays: number;
  deltaDays: number; // vs last year
  signalBars: number; // 1 to 5
}

export const OC_PAGE_8_MARKET_BREAKDOWN: OCPage8BreakdownRow[] = [
  { priceRange: "$0 - $750k", speedCategory: "Slight Buyer's", marketTimeDays: 129, pctCurrentInventory: 22, inventoryCount: 1081, pctCurrentDemand: 23, demandCount: 252, lastYearDays: 85, deltaDays: 44, signalBars: 2 },
  { priceRange: "$750k - $1M", speedCategory: "Balanced Market", marketTimeDays: 102, pctCurrentInventory: 17, inventoryCount: 798, pctCurrentDemand: 21, demandCount: 234, lastYearDays: 55, deltaDays: 47, signalBars: 3 },
  { priceRange: "$1M - $1.25M", speedCategory: "Balanced Market", marketTimeDays: 105, pctCurrentInventory: 12, inventoryCount: 575, pctCurrentDemand: 15, demandCount: 164, lastYearDays: 56, deltaDays: 49, signalBars: 3 },
  { priceRange: "$1.25M - $1.5M", speedCategory: "Balanced Market", marketTimeDays: 111, pctCurrentInventory: 11, inventoryCount: 532, pctCurrentDemand: 13, demandCount: 144, lastYearDays: 70, deltaDays: 41, signalBars: 3 },
  { priceRange: "$1.5M - $2M", speedCategory: "Buyer's Market", marketTimeDays: 160, pctCurrentInventory: 14, inventoryCount: 678, pctCurrentDemand: 12, demandCount: 127, lastYearDays: 88, deltaDays: 72, signalBars: 1 },
  { priceRange: "$2M - $2.5M", speedCategory: "Slight Buyer's", marketTimeDays: 130, pctCurrentInventory: 5, inventoryCount: 238, pctCurrentDemand: 5, demandCount: 55, lastYearDays: 99, deltaDays: 31, signalBars: 2 },
  { priceRange: "$2.5M - $4M", speedCategory: "Buyer's Market", marketTimeDays: 189, pctCurrentInventory: 9, inventoryCount: 435, pctCurrentDemand: 6, demandCount: 69, lastYearDays: 143, deltaDays: 46, signalBars: 1 },
  { priceRange: "$4M - $6M", speedCategory: "Buyer's Market", marketTimeDays: 238, pctCurrentInventory: 4, inventoryCount: 214, pctCurrentDemand: 3, demandCount: 27, lastYearDays: 147, deltaDays: 91, signalBars: 1 },
  { priceRange: "$6M+", speedCategory: "Buyer's Market", marketTimeDays: 327, pctCurrentInventory: 6, inventoryCount: 294, pctCurrentDemand: 2, demandCount: 27, lastYearDays: 282, deltaDays: 45, signalBars: 1 },
];

export const OC_PAGE_8_LUXURY_NOTE = {
  title: "LUXURY END",
  subtitle: "THE LUXURY MARKET SLOWED OVER THE PAST COUPLE OF WEEKS.",
  content: "Over the past couple of weeks, the luxury inventory for homes priced above $2.5 million (the top 10% of the Orange County housing market) decreased from 958 to 943, down 15 (-2%). Luxury demand decreased from 150 to 123 pending sales, down 27 (-18%). With demand plunging faster than supply, the Expected Market Time for luxury homes priced above $2.5 million increased from 192 to 230 days, its highest level since August 2025.\n\nYear over year, the active luxury inventory is down by 30 homes (-3%), and luxury demand is down by 50 pending sales (-29%). Last year's Expected Market Time was 169 days, much faster than today.\n\nOver the past two weeks, the Expected Market Time for homes priced between $2.5 million and $4 million rose from 145 to 189 days. For homes priced between $4 million and $6 million, the Expected Market Time decreased from 260 to 238 days. For homes priced above $6 million, the Expected Market Time increased from 253 to 327 days. Luxury is at 230 days overall. At this pace, a seller would likely become a pending sale around June 2027.",
  actives: 943,
  activesDelta: -15,
  demand: 123,
  demandDelta: -27,
  emt: 230,
  emtDelta: 38,
  priorYearEMT: 169,
  pendingPaceMonth: "June 2027"
};

// =============================================================================
// PAGE 9: ORANGE COUNTY HOUSING SUMMARY (NOVEMBER 9, 2026)
// Holiday Slumber — Telemetry & Metrics
// =============================================================================
export interface OCPage9Pillar {
  id: string;
  title: string;
  stat: string;
  unit: string;
  badge: string;
  badgeType: 'positive' | 'negative' | 'warning' | 'neutral';
  delta2Wks: string;
  deltaYoY: string;
  compPreCovid: string;
  metricLabel1: string;
  metricValue1: string;
  metricLabel2: string;
  metricValue2: string;
}

export const OC_PAGE_9_HOUSING_SUMMARY = {
  reportDate: "November 9, 2026",
  coverDate: "November 9, 2026",
  title: "Holiday Slumber",
  subtitle: "Buyer demand plunged to 1,099 pending sales (lowest November since tracking began in 2004) while inventory dipped to 4,845 homes.",
  pillars: [
    {
      id: "inventory",
      title: "ACTIVE INVENTORY",
      stat: "4,845",
      unit: "Homes on Market",
      badge: "-2% in 2 wks",
      badgeType: "neutral" as const,
      delta2Wks: "-103 Homes (-2% / Largest Drop of Year)",
      deltaYoY: "+742 (+18% vs 4,103 in 2025)",
      compPreCovid: "-17% (-977 vs 5,822 avg)",
      metricLabel1: "YTD vs Pre-COVID",
      metricValue1: "-27% (-9,490 listings Jan–Oct)",
      metricLabel2: "Multi-Year Context",
      metricValue2: "+1,818 vs 2024 · +5,305 vs 2023"
    },
    {
      id: "demand",
      title: "BUYER DEMAND",
      stat: "1,099",
      unit: "30-Day Pending Sales",
      badge: "Lowest Nov Since 2004",
      badgeType: "negative" as const,
      delta2Wks: "-120 (-10% in 2 wks / Largest Drop)",
      deltaYoY: "-388 (-26% vs 1,487 in 2025)",
      compPreCovid: "-49% (-1,040 vs 2,139 avg)",
      metricLabel1: "Historical Record",
      metricValue1: "Lowest November Since 2004",
      metricLabel2: "Pre-COVID 3-Yr Avg",
      metricValue2: "2,139 (95% higher)"
    },
    {
      id: "market-time",
      title: "MARKET TIME (EMT)",
      stat: "132 Days",
      unit: "Days to Sell Inventory",
      badge: "+10d Slower (Slight Buyer's)",
      badgeType: "warning" as const,
      delta2Wks: "+10 Days (from 122d)",
      deltaYoY: "+49 Days (from 83d)",
      compPreCovid: "+47 Days (from 85d avg)",
      metricLabel1: "Slowest Pace Since",
      metricValue1: "Jan 2019 (Slowest Nov Since 2008)",
      metricLabel2: "Speed Category",
      metricValue2: "Slight Buyer's (120–149 Days)"
    },
    {
      id: "luxury",
      title: "LUXURY ($2.5M+)",
      stat: "230 Days",
      unit: "Expected Market Time",
      badge: "June 2027 Pace",
      badgeType: "warning" as const,
      delta2Wks: "+38 Days (from 192d)",
      deltaYoY: "+61 Days (from 169d)",
      compPreCovid: "Highest Since August 2025",
      metricLabel1: "Luxury Active Supply",
      metricValue1: "943 homes (-15 / -2% in 2 wks)",
      metricLabel2: "Luxury 30-Day Demand",
      metricValue2: "123 pending (-27 / -18% in 2 wks)"
    },
    {
      id: "distressed",
      title: "DISTRESSED HOMES",
      stat: "21",
      unit: "Foreclosures & Short Sales",
      badge: "0.4% of Supply",
      badgeType: "positive" as const,
      delta2Wks: "+3 Homes (from 18)",
      deltaYoY: "+15 Homes (vs 6 in 2025)",
      compPreCovid: "Historical Lows",
      metricLabel1: "Foreclosures / Short Sales",
      metricValue1: "9 Active / 12 Active",
      metricLabel2: "Share of Demand",
      metricValue2: "0.6% of Pending Demand"
    },
    {
      id: "closed-sales",
      title: "CLOSED SALES (SEPT)",
      stat: "1,729",
      unit: "September Closed Escrows",
      badge: "99.1% Sale-to-List",
      badgeType: "positive" as const,
      delta2Wks: "-1% MoM (vs August)",
      deltaYoY: "-4% YoY (1,805 in 2025)",
      compPreCovid: "Median $1,209,000",
      metricLabel1: "Equity Sellers",
      metricValue1: "99.83% (0.12% Foreclosure · 0.06% Short)",
      metricLabel2: "Median DOM / Price/SqFt",
      metricValue2: "21 Days / $696/sqft"
    },
    {
      id: "median-list-price",
      title: "MEDIAN LIST PRICE",
      stat: "$1,199,999",
      unit: "Page 12 Sold Report",
      badge: "99.1% Sale-to-List",
      badgeType: "positive" as const,
      delta2Wks: "$1,209,000 Closed Median",
      deltaYoY: "Sept 2026 Closed Resales",
      compPreCovid: "1,737 Median Sq. Ft.",
      metricLabel1: "Closed vs. List Ratio",
      metricValue1: "99.1% (Countywide Average)",
      metricLabel2: "Price Range Spread",
      metricValue2: "$18,100 – $22,700,000"
    },
    {
      id: "median-dom",
      title: "MEDIAN DAYS ON MARKET",
      stat: "21 Days",
      unit: "Closed Resale Velocity (Page 12)",
      badge: "3 Weeks to Pending",
      badgeType: "positive" as const,
      delta2Wks: "Sept 2026 Closed Median",
      deltaYoY: "Faster in North/Central OC",
      compPreCovid: "La Palma 5d · Villa Park 10d",
      metricLabel1: "Fastest City DOM",
      metricValue1: "La Palma (5d) · Los Alamitos (8d)",
      metricLabel2: "Countywide Closed Volume",
      metricValue2: "1,729 Resales in Sept 2026"
    },
    {
      id: "median-price-sqft",
      title: "MEDIAN PRICE / SQ. FT.",
      stat: "$696",
      unit: "Closed Sales (Page 12)",
      badge: "Sept 2026 Closed Sales",
      badgeType: "positive" as const,
      delta2Wks: "1,737 Median Sq Ft",
      deltaYoY: "Countywide Resale Benchmark",
      compPreCovid: "Seal Beach $429 · Laguna Woods $427",
      metricLabel1: "Top Coastal Cities",
      metricValue1: "Newport Coast ($2,185) · CDM ($1,777)",
      metricLabel2: "Median Resale Size",
      metricValue2: "1,737 Sq. Ft. Countywide"
    }
  ]
};

// =============================================================================
// 3. EXECUTIVE SUMMARY CARDS (NOVEMBER 9, 2026 REPORT)
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
    compLastYear: `${cfg.marketTimeLastYear} days (+${marketTimeDeltaYoY}d slower)`,
    summary: `Expected Market Time jumped 10 days over the past two weeks from ${cfg.marketTimeTwoWeeksAgo} to ${cfg.marketTime} days as buyer demand plunged faster than supply. This marks the highest reading since January 2019 and the highest November reading since 2008.`,
    keyTakeaways: [
      `Countywide Expected Market Time rose to ${cfg.marketTime} days (up 10 days from ${cfg.marketTimeTwoWeeksAgo}d two weeks ago).`,
      `Attached Condominiums & Townhomes: ${cfg.attached.marketTime} days (up from ${cfg.attached.marketTimeTwoWeeksAgo}d two weeks ago; ${cfg.attached.marketTimeLastYear}d last year).`,
      `Detached Single-Family: ${cfg.detached.marketTime} days (up from ${cfg.detached.marketTimeTwoWeeksAgo}d two weeks ago; ${cfg.detached.marketTimeLastYear}d last year).`,
      `Detached homes (${cfg.detached.marketTime} days) continue to outpace attached condos (${cfg.attached.marketTime} days).`
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
    summary: `Buyer demand, the 30-day snapshot of pending escrows, plunged by 120 sales (-10%) to ${cfg.demand.toLocaleString()} escrows—its largest drop of the year and lowest November reading since tracking began in 2004.`,
    keyTakeaways: [
      `Buyer demand stands at ${cfg.demand.toLocaleString()} pending sales (down 120 escrows or -10% in 2 weeks).`,
      `Lowest November buyer demand recorded in Orange County since tracking began in 2004.`,
      `Last year's pace: ${cfg.demandLastYear.toLocaleString()} pending sales (up 388 or +35% vs today).`,
      `Pre-COVID 3-year average was ${cfg.preCovidDemandAverage.toLocaleString()} pending sales (95% higher than today).`
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
    summary: `Active listing inventory fell by 103 homes (-2%) over the past two weeks to ${cfg.actives.toLocaleString()} listings—the largest drop of the year—though still the highest November inventory since 2019 (5,534).`,
    keyTakeaways: [
      `Active inventory sits at ${cfg.actives.toLocaleString()} homes (down 103 homes / -2% in 2 weeks).`,
      `Last year's supply was ${cfg.activesLastYear.toLocaleString()} homes (742 fewer, -15% vs today).`,
      `Pre-COVID 3-year average was ${cfg.preCovidActivesAverage.toLocaleString()} homes (20% higher than today).`,
      `Jan–Oct new listings totaled ${cfg.ytdNewListings.toLocaleString()}, 9,490 fewer (-27%) than pre-COVID averages.`
    ],
    category: "supply"
  },
  {
    id: "luxury",
    title: "Luxury End ($2.5M+)",
    shortTitle: "Luxury ($2.5M+)",
    currentStat: `${cfg.luxury.marketTime} Days`,
    currentValue: cfg.luxury.marketTime,
    unit: "Expected Market Time",
    trend2Weeks: `+${luxuryMarketTimeDelta2Wks} days (from ${cfg.luxury.marketTimeTwoWeeksAgo}d)`,
    isTrendPositive: false,
    compLastYear: `${cfg.luxury.marketTimeLastYear} days last year (+${cfg.luxury.marketTime - cfg.luxury.marketTimeLastYear}d slower)`,
    summary: `Luxury inventory ($2.5M+) dipped 2% to ${cfg.luxury.actives} homes while luxury demand plunged 18% to ${cfg.luxury.demand} pending sales, pushing luxury Expected Market Time from 192 to ${cfg.luxury.marketTime} days (June 2027 pace).`,
    keyTakeaways: [
      `$2.5M–$4M tier slowed from 145 to 189 days EMT (435 actives, 69 pending).`,
      `$4M–$6M tier improved from 260 to 238 days EMT (214 actives, 27 pending).`,
      `$6M+ ultra-luxury slowed from 253 to 327 days EMT (294 actives, 27 pending).`,
      `Overall $2.5M+ pace reached ${cfg.luxury.marketTime} days, its highest level since August 2025.`
    ],
    category: "luxury"
  },
  {
    id: "closed",
    title: `${cfg.closedSales.period} Closed Sales`,
    shortTitle: "Closed Sales",
    currentStat: `${cfg.closedSales.unitsSold.toLocaleString()} Sales`,
    currentValue: cfg.closedSales.unitsSold,
    unit: `${cfg.closedSales.salesToListRatio} Sale-to-List Ratio`,
    trend2Weeks: `${closedSalesPctYoY}% YoY vs ${cfg.closedSales.priorYearPeriod}`,
    isTrendPositive: false,
    compLastYear: `${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales in ${cfg.closedSales.priorYearPeriod} (${closedSalesDeltaYoY} sales)`,
    summary: `There were ${cfg.closedSales.unitsSold.toLocaleString()} closed residential resales in ${cfg.closedSales.period}, down 4% from ${cfg.closedSales.priorYearPeriod}'s ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()} sales and down 1% from August 2026. The countywide median sales price was ${cfg.closedSales.medianSalesPrice} with a ${cfg.closedSales.salesToListRatio} sales-to-list ratio.`,
    keyTakeaways: [
      `${cfg.closedSales.unitsSold.toLocaleString()} residential sales closed in ${cfg.closedSales.period} (down 4% vs ${cfg.closedSales.priorYearPeriod}'s ${cfg.closedSales.unitsSoldPriorYear.toLocaleString()}).`,
      `Countywide median sales price: ${cfg.closedSales.medianSalesPrice} (${cfg.closedSales.medianPricePerSqFt}/sq ft).`,
      `Sales-to-list price ratio captured: ${cfg.closedSales.salesToListRatio}.`,
      `99.83% of all sales were traditional equity sellers (0.12% foreclosures, 0.06% short sales).`,
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
    description: `Active inventory dropped by 103 homes to ${cfg.actives.toLocaleString()} listings—the largest decline of the year, yet still the highest November inventory since 2019.`
  },
  {
    title: "Buyer Demand",
    stat: `${cfg.demand.toLocaleString()} Escrows`,
    trend: `${demandDelta2Wks} in 2 wks (${demandPct2Wks}%)`,
    description: `30-day pending sales plunged 10% to ${cfg.demand.toLocaleString()} escrows with mortgage rates near ${cfg.holidayMarket.mortgageRate}—the lowest November demand since tracking began in 2004.`
  },
  {
    title: "Expected Market Time",
    stat: `${cfg.marketTime} Days`,
    trend: `+${marketTimeDelta2Wks} days vs 2 wks ago`,
    description: `Market speed slowed by 10 days to ${cfg.marketTime} days (highest since January 2019; highest November since 2008). Detached homes are at 123 days while attached condominiums are at 146 days.`
  },
  {
    title: "Holiday Market Outlook",
    stat: `${cfg.holidayMarket.mortgageRate} Rates`,
    trend: `${cfg.holidayMarket.priorYearDelistedHomes.toLocaleString()} Delisted in '25`,
    description: `Entering the Holiday Slumber, supply and demand typically drop over 30% through New Year's while Expected Market Time remains elevated near ${cfg.marketTime} days.`
  },
  {
    title: `${cfg.closedSales.period} Closed Sales`,
    stat: `${cfg.closedSales.unitsSold.toLocaleString()} Units`,
    trend: `${closedSalesPctYoY}% vs ${cfg.closedSales.priorYearPeriod}`,
    description: `${cfg.closedSales.unitsSold.toLocaleString()} resales closed in ${cfg.closedSales.period} (median ${cfg.closedSales.medianSalesPrice}, ${cfg.closedSales.salesToListRatio} ratio) with 99.83% equity sellers.`
  },
  {
    title: "Distressed Properties",
    stat: `${cfg.distressed.actives} Homes (${cfg.distressed.listingsPct})`,
    trend: "Historical Low",
    description: `Only ${cfg.distressed.foreclosures} foreclosures and ${cfg.distressed.shortSales} short sales countywide, accounting for just ${cfg.distressed.listingsPct} of active supply and ${cfg.distressed.demandPct} of demand.`
  }
];

// =============================================================================
// 4. PAGE 10: CITY MARKET TIME REPORT (November 9, 2026 — Holiday Slumber)
// Tabulated from CRMLS as of 11/5/2026
// =============================================================================
export const OC_MARKET_TIME_REPORT: OCMarketTimeEntry[] = [
  { city: "Aliso Viejo", region: "South OC", currentActives: 74, demand30Days: 16, marketTimeDays: 139, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 113, marketTime1YearAgo: 53, marketTime2YearsAgo: 25, medianActiveListPrice: "$936k" },
  { city: "Anaheim", region: "North OC", currentActives: 279, demand30Days: 70, marketTimeDays: 120, marketTime2WeeksAgo: 105, marketTime4WeeksAgo: 121, marketTime1YearAgo: 72, marketTime2YearsAgo: 57, medianActiveListPrice: "$940k" },
  { city: "Anaheim Hills", region: "North OC", currentActives: 45, demand30Days: 10, marketTimeDays: 135, marketTime2WeeksAgo: 153, marketTime4WeeksAgo: 168, marketTime1YearAgo: 62, marketTime2YearsAgo: 67, medianActiveListPrice: "$1.2m" },
  { city: "Brea", region: "North OC", currentActives: 45, demand30Days: 16, marketTimeDays: 84, marketTime2WeeksAgo: 63, marketTime4WeeksAgo: 68, marketTime1YearAgo: 45, marketTime2YearsAgo: 36, medianActiveListPrice: "$1.1m" },
  { city: "Buena Park", region: "North OC", currentActives: 73, demand30Days: 26, marketTimeDays: 84, marketTime2WeeksAgo: 104, marketTime4WeeksAgo: 154, marketTime1YearAgo: 48, marketTime2YearsAgo: 61, medianActiveListPrice: "$900k" },
  { city: "Corona Del Mar", region: "Coastal", currentActives: 61, demand30Days: 8, marketTimeDays: 229, marketTime2WeeksAgo: 146, marketTime4WeeksAgo: 188, marketTime1YearAgo: 195, marketTime2YearsAgo: 203, medianActiveListPrice: "$6.8m" },
  { city: "Costa Mesa", region: "Coastal", currentActives: 133, demand30Days: 26, marketTimeDays: 153, marketTime2WeeksAgo: 129, marketTime4WeeksAgo: 101, marketTime1YearAgo: 58, marketTime2YearsAgo: 62, medianActiveListPrice: "$1.5m" },
  { city: "Coto De Caza", region: "South OC", currentActives: 58, demand30Days: 13, marketTimeDays: 134, marketTime2WeeksAgo: 129, marketTime4WeeksAgo: 108, marketTime1YearAgo: 109, marketTime2YearsAgo: 53, medianActiveListPrice: "$2.0m" },
  { city: "Cypress", region: "North OC", currentActives: 51, demand30Days: 20, marketTimeDays: 77, marketTime2WeeksAgo: 81, marketTime4WeeksAgo: 79, marketTime1YearAgo: 81, marketTime2YearsAgo: 43, medianActiveListPrice: "$985k" },
  { city: "Dana Point", region: "Coastal", currentActives: 99, demand30Days: 17, marketTimeDays: 175, marketTime2WeeksAgo: 115, marketTime4WeeksAgo: 182, marketTime1YearAgo: 106, marketTime2YearsAgo: 112, medianActiveListPrice: "$2.6m" },
  { city: "Dove Canyon", region: "South OC", currentActives: 8, demand30Days: 1, marketTimeDays: 240, marketTime2WeeksAgo: 0, marketTime4WeeksAgo: 0, marketTime1YearAgo: 75, marketTime2YearsAgo: 15, medianActiveListPrice: "$1.7m" },
  { city: "Foothill Ranch", region: "South OC", currentActives: 16, demand30Days: 0, marketTimeDays: 0, marketTime2WeeksAgo: 450, marketTime4WeeksAgo: 210, marketTime1YearAgo: 50, marketTime2YearsAgo: 90, medianActiveListPrice: "$637k" },
  { city: "Fountain Valley", region: "Central OC", currentActives: 40, demand30Days: 17, marketTimeDays: 71, marketTime2WeeksAgo: 69, marketTime4WeeksAgo: 49, marketTime1YearAgo: 37, marketTime2YearsAgo: 57, medianActiveListPrice: "$1.3m" },
  { city: "Fullerton", region: "North OC", currentActives: 111, demand30Days: 45, marketTimeDays: 74, marketTime2WeeksAgo: 100, marketTime4WeeksAgo: 100, marketTime1YearAgo: 58, marketTime2YearsAgo: 59, medianActiveListPrice: "$945k" },
  { city: "Garden Grove", region: "Central OC", currentActives: 109, demand30Days: 35, marketTimeDays: 93, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 83, marketTime1YearAgo: 59, marketTime2YearsAgo: 49, medianActiveListPrice: "$995k" },
  { city: "Huntington Beach", region: "Coastal", currentActives: 322, demand30Days: 71, marketTimeDays: 136, marketTime2WeeksAgo: 110, marketTime4WeeksAgo: 96, marketTime1YearAgo: 62, marketTime2YearsAgo: 78, medianActiveListPrice: "$1.4m" },
  { city: "Irvine", region: "South OC", currentActives: 679, demand30Days: 105, marketTimeDays: 194, marketTime2WeeksAgo: 180, marketTime4WeeksAgo: 156, marketTime1YearAgo: 142, marketTime2YearsAgo: 87, medianActiveListPrice: "$1.6m" },
  { city: "La Habra", region: "North OC", currentActives: 71, demand30Days: 19, marketTimeDays: 112, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 80, marketTime1YearAgo: 53, marketTime2YearsAgo: 61, medianActiveListPrice: "$850k" },
  { city: "La Palma", region: "North OC", currentActives: 13, demand30Days: 1, marketTimeDays: 390, marketTime2WeeksAgo: 135, marketTime4WeeksAgo: 68, marketTime1YearAgo: 60, marketTime2YearsAgo: 53, medianActiveListPrice: "$1.2m" },
  { city: "Ladera Ranch", region: "South OC", currentActives: 53, demand30Days: 7, marketTimeDays: 227, marketTime2WeeksAgo: 257, marketTime4WeeksAgo: 165, marketTime1YearAgo: 79, marketTime2YearsAgo: 88, medianActiveListPrice: "$1.5m" },
  { city: "Laguna Beach", region: "Coastal", currentActives: 148, demand30Days: 23, marketTimeDays: 193, marketTime2WeeksAgo: 173, marketTime4WeeksAgo: 203, marketTime1YearAgo: 179, marketTime2YearsAgo: 276, medianActiveListPrice: "$5.0m" },
  { city: "Laguna Hills", region: "South OC", currentActives: 51, demand30Days: 19, marketTimeDays: 81, marketTime2WeeksAgo: 84, marketTime4WeeksAgo: 88, marketTime1YearAgo: 104, marketTime2YearsAgo: 49, medianActiveListPrice: "$1.2m" },
  { city: "Laguna Niguel", region: "South OC", currentActives: 133, demand30Days: 28, marketTimeDays: 143, marketTime2WeeksAgo: 140, marketTime4WeeksAgo: 91, marketTime1YearAgo: 91, marketTime2YearsAgo: 82, medianActiveListPrice: "$1.3m" },
  { city: "Laguna Woods", region: "South OC", currentActives: 203, demand30Days: 49, marketTimeDays: 124, marketTime2WeeksAgo: 121, marketTime4WeeksAgo: 124, marketTime1YearAgo: 80, marketTime2YearsAgo: 56, medianActiveListPrice: "$435k" },
  { city: "Lake Forest", region: "South OC", currentActives: 195, demand30Days: 39, marketTimeDays: 150, marketTime2WeeksAgo: 158, marketTime4WeeksAgo: 207, marketTime1YearAgo: 94, marketTime2YearsAgo: 79, medianActiveListPrice: "$1.2m" },
  { city: "Los Alamitos", region: "North OC", currentActives: 16, demand30Days: 4, marketTimeDays: 120, marketTime2WeeksAgo: 78, marketTime4WeeksAgo: 41, marketTime1YearAgo: 120, marketTime2YearsAgo: 43, medianActiveListPrice: "$1.6m" },
  { city: "Mission Viejo", region: "South OC", currentActives: 170, demand30Days: 37, marketTimeDays: 138, marketTime2WeeksAgo: 110, marketTime4WeeksAgo: 85, marketTime1YearAgo: 70, marketTime2YearsAgo: 63, medianActiveListPrice: "$1.1m" },
  { city: "Newport Beach", region: "Coastal", currentActives: 230, demand30Days: 30, marketTimeDays: 230, marketTime2WeeksAgo: 195, marketTime4WeeksAgo: 218, marketTime1YearAgo: 133, marketTime2YearsAgo: 127, medianActiveListPrice: "$4.8m" },
  { city: "Newport Coast", region: "Coastal", currentActives: 46, demand30Days: 3, marketTimeDays: 460, marketTime2WeeksAgo: 153, marketTime4WeeksAgo: 230, marketTime1YearAgo: 136, marketTime2YearsAgo: 206, medianActiveListPrice: "$10.6m" },
  { city: "North Tustin", region: "Central OC", currentActives: 28, demand30Days: 10, marketTimeDays: 84, marketTime2WeeksAgo: 45, marketTime4WeeksAgo: 62, marketTime1YearAgo: 103, marketTime2YearsAgo: 69, medianActiveListPrice: "$1.9m" },
  { city: "Orange", region: "Central OC", currentActives: 169, demand30Days: 45, marketTimeDays: 113, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 111, marketTime1YearAgo: 59, marketTime2YearsAgo: 56, medianActiveListPrice: "$1.2m" },
  { city: "Placentia", region: "North OC", currentActives: 64, demand30Days: 19, marketTimeDays: 101, marketTime2WeeksAgo: 91, marketTime4WeeksAgo: 103, marketTime1YearAgo: 98, marketTime2YearsAgo: 42, medianActiveListPrice: "$844k" },
  { city: "Portola Hills", region: "South OC", currentActives: 25, demand30Days: 6, marketTimeDays: 125, marketTime2WeeksAgo: 103, marketTime4WeeksAgo: 156, marketTime1YearAgo: 220, marketTime2YearsAgo: 40, medianActiveListPrice: "$1.1m" },
  { city: "Rancho Mission Viejo", region: "South OC", currentActives: 116, demand30Days: 16, marketTimeDays: 218, marketTime2WeeksAgo: 305, marketTime4WeeksAgo: 240, marketTime1YearAgo: 86, marketTime2YearsAgo: 130, medianActiveListPrice: "$1.1m" },
  { city: "Rancho Santa Margarita", region: "South OC", currentActives: 66, demand30Days: 23, marketTimeDays: 86, marketTime2WeeksAgo: 122, marketTime4WeeksAgo: 154, marketTime1YearAgo: 69, marketTime2YearsAgo: 97, medianActiveListPrice: "$832k" },
  { city: "Rossmoor", region: "North OC", currentActives: 2, demand30Days: 2, marketTimeDays: 30, marketTime2WeeksAgo: 15, marketTime4WeeksAgo: 10, marketTime1YearAgo: 60, marketTime2YearsAgo: 90, medianActiveListPrice: "$2.0m" },
  { city: "San Clemente", region: "Coastal", currentActives: 119, demand30Days: 31, marketTimeDays: 115, marketTime2WeeksAgo: 123, marketTime4WeeksAgo: 106, marketTime1YearAgo: 95, marketTime2YearsAgo: 80, medianActiveListPrice: "$2.2m" },
  { city: "San Juan Capistrano", region: "South OC", currentActives: 69, demand30Days: 17, marketTimeDays: 122, marketTime2WeeksAgo: 130, marketTime4WeeksAgo: 85, marketTime1YearAgo: 60, marketTime2YearsAgo: 54, medianActiveListPrice: "$1.7m" },
  { city: "Santa Ana", region: "Central OC", currentActives: 227, demand30Days: 40, marketTimeDays: 170, marketTime2WeeksAgo: 135, marketTime4WeeksAgo: 137, marketTime1YearAgo: 76, marketTime2YearsAgo: 63, medianActiveListPrice: "$825k" },
  { city: "Seal Beach", region: "Coastal", currentActives: 92, demand30Days: 33, marketTimeDays: 84, marketTime2WeeksAgo: 61, marketTime4WeeksAgo: 74, marketTime1YearAgo: 52, marketTime2YearsAgo: 46, medianActiveListPrice: "$387k" },
  { city: "Stanton", region: "Central OC", currentActives: 34, demand30Days: 6, marketTimeDays: 170, marketTime2WeeksAgo: 97, marketTime4WeeksAgo: 162, marketTime1YearAgo: 94, marketTime2YearsAgo: 27, medianActiveListPrice: "$729k" },
  { city: "Talega", region: "Coastal", currentActives: 23, demand30Days: 7, marketTimeDays: 99, marketTime2WeeksAgo: 125, marketTime4WeeksAgo: 162, marketTime1YearAgo: 68, marketTime2YearsAgo: 83, medianActiveListPrice: "$1.9m" },
  { city: "Tustin", region: "Central OC", currentActives: 95, demand30Days: 29, marketTimeDays: 98, marketTime2WeeksAgo: 79, marketTime4WeeksAgo: 77, marketTime1YearAgo: 78, marketTime2YearsAgo: 55, medianActiveListPrice: "$1.1m" },
  { city: "Villa Park", region: "Central OC", currentActives: 11, demand30Days: 4, marketTimeDays: 83, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 105, marketTime1YearAgo: 96, marketTime2YearsAgo: 240, medianActiveListPrice: "$2.7m" },
  { city: "Westminster", region: "Central OC", currentActives: 47, demand30Days: 18, marketTimeDays: 78, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 66, marketTime1YearAgo: 38, marketTime2YearsAgo: 51, medianActiveListPrice: "$1.2m" },
  { city: "Yorba Linda", region: "North OC", currentActives: 133, demand30Days: 37, marketTimeDays: 108, marketTime2WeeksAgo: 134, marketTime4WeeksAgo: 110, marketTime1YearAgo: 88, marketTime2YearsAgo: 56, medianActiveListPrice: "$1.5m" },
];

// =============================================================================
// 5. PAGE 11: PRICE RANGE REPORT (November 9, 2026 — Holiday Slumber)
// Tabulated from CRMLS as of 11/5/2026
// =============================================================================
export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "All of O.C.", currentActives: 4845, demand30Days: 1099, marketTimeDays: 132, marketTime2WeeksAgo: 122, marketTime4WeeksAgo: 118, marketTime1YearAgo: 83, marketTime2YearsAgo: 72, medianActivePrice: "$1.2m" },
  { priceRange: "$0-$500k", currentActives: 428, demand30Days: 109, marketTimeDays: 118, marketTime2WeeksAgo: 111, marketTime4WeeksAgo: 134, marketTime1YearAgo: 95, marketTime2YearsAgo: 57, medianActivePrice: "$400k" },
  { priceRange: "$500k-$750k", currentActives: 653, demand30Days: 143, marketTimeDays: 137, marketTime2WeeksAgo: 127, marketTime4WeeksAgo: 121, marketTime1YearAgo: 81, marketTime2YearsAgo: 52, medianActivePrice: "$649k" },
  { priceRange: "$750k-$1m", currentActives: 798, demand30Days: 234, marketTimeDays: 102, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 117, marketTime1YearAgo: 55, marketTime2YearsAgo: 53, medianActivePrice: "$898k" },
  { priceRange: "$1m-$1.25m", currentActives: 575, demand30Days: 164, marketTimeDays: 105, marketTime2WeeksAgo: 109, marketTime4WeeksAgo: 102, marketTime1YearAgo: 56, marketTime2YearsAgo: 50, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 532, demand30Days: 144, marketTimeDays: 111, marketTime2WeeksAgo: 100, marketTime4WeeksAgo: 86, marketTime1YearAgo: 70, marketTime2YearsAgo: 62, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 678, demand30Days: 127, marketTimeDays: 160, marketTime2WeeksAgo: 119, marketTime4WeeksAgo: 103, marketTime1YearAgo: 88, marketTime2YearsAgo: 73, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 238, demand30Days: 55, marketTimeDays: 130, marketTime2WeeksAgo: 154, marketTime4WeeksAgo: 120, marketTime1YearAgo: 99, marketTime2YearsAgo: 0, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 435, demand30Days: 69, marketTimeDays: 189, marketTime2WeeksAgo: 145, marketTime4WeeksAgo: 125, marketTime1YearAgo: 143, marketTime2YearsAgo: 0, medianActivePrice: "$3.2m" },
  { priceRange: "$4m-$6m", currentActives: 214, demand30Days: 27, marketTimeDays: 238, marketTime2WeeksAgo: 260, marketTime4WeeksAgo: 224, marketTime1YearAgo: 147, marketTime2YearsAgo: 217, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 294, demand30Days: 27, marketTimeDays: 327, marketTime2WeeksAgo: 252, marketTime4WeeksAgo: 379, marketTime1YearAgo: 282, marketTime2YearsAgo: 322, medianActivePrice: "$10.1m" },
];

export const OC_PRICE_RANGE_REPORT_ATTACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Attached", currentActives: 2164, demand30Days: 444, marketTimeDays: 146, marketTime2WeeksAgo: 131, marketTime4WeeksAgo: 139, marketTime1YearAgo: 92, marketTime2YearsAgo: 69, medianActivePrice: "$775k" },
  { priceRange: "$0-$500k", currentActives: 419, demand30Days: 106, marketTimeDays: 119, marketTime2WeeksAgo: 112, marketTime4WeeksAgo: 135, marketTime1YearAgo: 92, marketTime2YearsAgo: 54, medianActivePrice: "$400k" },
  { priceRange: "$500k-$750k", currentActives: 626, demand30Days: 128, marketTimeDays: 147, marketTime2WeeksAgo: 134, marketTime4WeeksAgo: 122, marketTime1YearAgo: 83, marketTime2YearsAgo: 54, medianActivePrice: "$642k" },
  { priceRange: "$750k-$1m", currentActives: 530, demand30Days: 117, marketTimeDays: 136, marketTime2WeeksAgo: 131, marketTime4WeeksAgo: 150, marketTime1YearAgo: 77, marketTime2YearsAgo: 68, medianActivePrice: "$875k" },
  { priceRange: "$1m-$2m", currentActives: 454, demand30Days: 75, marketTimeDays: 182, marketTime2WeeksAgo: 135, marketTime4WeeksAgo: 148, marketTime1YearAgo: 98, marketTime2YearsAgo: 97, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 135, demand30Days: 18, marketTimeDays: 225, marketTime2WeeksAgo: 187, marketTime4WeeksAgo: 187, marketTime1YearAgo: 234, marketTime2YearsAgo: 128, medianActivePrice: "$3.3m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: 2681, demand30Days: 655, marketTimeDays: 123, marketTime2WeeksAgo: 115, marketTime4WeeksAgo: 105, marketTime1YearAgo: 77, marketTime2YearsAgo: 75, medianActivePrice: "$1.7m" },
  { priceRange: "$0-$750k", currentActives: 36, demand30Days: 18, marketTimeDays: 60, marketTime2WeeksAgo: 63, marketTime4WeeksAgo: 106, marketTime1YearAgo: 71, marketTime2YearsAgo: 55, medianActivePrice: "$672k" },
  { priceRange: "$750k-$1m", currentActives: 268, demand30Days: 117, marketTimeDays: 69, marketTime2WeeksAgo: 66, marketTime4WeeksAgo: 81, marketTime1YearAgo: 37, marketTime2YearsAgo: 41, medianActivePrice: "$920k" },
  { priceRange: "$1m-$1.25m", currentActives: 361, demand30Days: 123, marketTimeDays: 88, marketTime2WeeksAgo: 93, marketTime4WeeksAgo: 82, marketTime1YearAgo: 44, marketTime2YearsAgo: 41, medianActivePrice: "$1.2m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 401, demand30Days: 121, marketTimeDays: 99, marketTime2WeeksAgo: 94, marketTime4WeeksAgo: 77, marketTime1YearAgo: 61, marketTime2YearsAgo: 55, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 569, demand30Days: 116, marketTimeDays: 147, marketTime2WeeksAgo: 119, marketTime4WeeksAgo: 97, marketTime1YearAgo: 82, marketTime2YearsAgo: 64, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 210, demand30Days: 49, marketTimeDays: 129, marketTime2WeeksAgo: 149, marketTime4WeeksAgo: 118, marketTime1YearAgo: 87, marketTime2YearsAgo: 0, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 368, demand30Days: 62, marketTimeDays: 178, marketTime2WeeksAgo: 143, marketTime4WeeksAgo: 115, marketTime1YearAgo: 140, marketTime2YearsAgo: 0, medianActivePrice: "$3.2m" },
  { priceRange: "$4m-$6m", currentActives: 193, demand30Days: 22, marketTimeDays: 263, marketTime2WeeksAgo: 300, marketTime4WeeksAgo: 252, marketTime1YearAgo: 135, marketTime2YearsAgo: 220, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 275, demand30Days: 27, marketTimeDays: 306, marketTime2WeeksAgo: 235, marketTime4WeeksAgo: 372, marketTime1YearAgo: 272, marketTime2YearsAgo: 338, medianActivePrice: "$10.8m" },
];

// =============================================================================
// 6. PAGE 12: CLOSED RESALE REPORT (September 2026 Closings by Municipality)
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
  { city: "Aliso Viejo", unitsSoldCurrent: 29, unitsSoldPriorYear: 33, medianSalesPrice: "$900,000", medianListPrice: "$900,000", salesToListRatio: "98.8%", lowPrice: "$505,000", highPrice: "$2,050,000", medianSqFt: 1476, medianPricePerSqFt: "$610", medianDOM: 21 },
  { city: "Anaheim", unitsSoldCurrent: 101, unitsSoldPriorYear: 91, medianSalesPrice: "$940,000", medianListPrice: "$949,000", salesToListRatio: "100.0%", lowPrice: "$200,000", highPrice: "$1,667,500", medianSqFt: 1595, medianPricePerSqFt: "$589", medianDOM: 20 },
  { city: "Anaheim Hills", unitsSoldCurrent: 17, unitsSoldPriorYear: 20, medianSalesPrice: "$1,155,000", medianListPrice: "$1,122,950", salesToListRatio: "100.0%", lowPrice: "$694,050", highPrice: "$2,200,000", medianSqFt: 2131, medianPricePerSqFt: "$542", medianDOM: 12 },
  { city: "Brea", unitsSoldCurrent: 25, unitsSoldPriorYear: 21, medianSalesPrice: "$1,175,000", medianListPrice: "$1,190,000", salesToListRatio: "102.0%", lowPrice: "$751,000", highPrice: "$2,808,000", medianSqFt: 1970, medianPricePerSqFt: "$596", medianDOM: 18 },
  { city: "Buena Park", unitsSoldCurrent: 34, unitsSoldPriorYear: 36, medianSalesPrice: "$902,500", medianListPrice: "$899,000", salesToListRatio: "99.6%", lowPrice: "$685,000", highPrice: "$2,580,000", medianSqFt: 1331, medianPricePerSqFt: "$678", medianDOM: 13 },
  { city: "Corona Del Mar", unitsSoldCurrent: 22, unitsSoldPriorYear: 17, medianSalesPrice: "$4,312,500", medianListPrice: "$4,429,500", salesToListRatio: "98.1%", lowPrice: "$1,744,000", highPrice: "$7,550,000", medianSqFt: 2427, medianPricePerSqFt: "$1,777", medianDOM: 31 },
  { city: "Costa Mesa", unitsSoldCurrent: 50, unitsSoldPriorYear: 45, medianSalesPrice: "$1,400,000", medianListPrice: "$1,457,500", salesToListRatio: "99.8%", lowPrice: "$755,000", highPrice: "$3,400,000", medianSqFt: 1711, medianPricePerSqFt: "$818", medianDOM: 18 },
  { city: "Coto De Caza", unitsSoldCurrent: 9, unitsSoldPriorYear: 14, medianSalesPrice: "$2,600,000", medianListPrice: "$2,694,000", salesToListRatio: "95.7%", lowPrice: "$1,592,000", highPrice: "$5,178,000", medianSqFt: 3900, medianPricePerSqFt: "$667", medianDOM: 25 },
  { city: "Cypress", unitsSoldCurrent: 24, unitsSoldPriorYear: 18, medianSalesPrice: "$930,937", medianListPrice: "$938,495", salesToListRatio: "100.0%", lowPrice: "$440,000", highPrice: "$1,725,000", medianSqFt: 1562, medianPricePerSqFt: "$596", medianDOM: 28 },
  { city: "Dana Point", unitsSoldCurrent: 31, unitsSoldPriorYear: 35, medianSalesPrice: "$2,430,000", medianListPrice: "$2,699,000", salesToListRatio: "99.2%", lowPrice: "$1,187,500", highPrice: "$12,400,000", medianSqFt: 2215, medianPricePerSqFt: "$1,097", medianDOM: 32 },
  { city: "Dove Canyon", unitsSoldCurrent: 2, unitsSoldPriorYear: 5, medianSalesPrice: "$1,640,000", medianListPrice: "$1,694,500", salesToListRatio: "96.9%", lowPrice: "$1,640,000", highPrice: "$1,640,000", medianSqFt: 3171, medianPricePerSqFt: "$517", medianDOM: 68 },
  { city: "Foothill Ranch", unitsSoldCurrent: 5, unitsSoldPriorYear: 6, medianSalesPrice: "$1,270,000", medianListPrice: "$1,280,000", salesToListRatio: "99.2%", lowPrice: "$938,000", highPrice: "$1,450,000", medianSqFt: 1977, medianPricePerSqFt: "$642", medianDOM: 61 },
  { city: "Fountain Valley", unitsSoldCurrent: 33, unitsSoldPriorYear: 32, medianSalesPrice: "$1,410,000", medianListPrice: "$1,398,000", salesToListRatio: "100.0%", lowPrice: "$415,000", highPrice: "$2,500,000", medianSqFt: 1749, medianPricePerSqFt: "$806", medianDOM: 12 },
  { city: "Fullerton", unitsSoldCurrent: 65, unitsSoldPriorYear: 60, medianSalesPrice: "$962,000", medianListPrice: "$965,000", salesToListRatio: "100.0%", lowPrice: "$290,000", highPrice: "$5,070,000", medianSqFt: 1705, medianPricePerSqFt: "$564", medianDOM: 18 },
  { city: "Garden Grove", unitsSoldCurrent: 59, unitsSoldPriorYear: 66, medianSalesPrice: "$1,010,000", medianListPrice: "$999,000", salesToListRatio: "100.0%", lowPrice: "$425,000", highPrice: "$1,855,000", medianSqFt: 1595, medianPricePerSqFt: "$633", medianDOM: 12 },
  { city: "Huntington Beach", unitsSoldCurrent: 146, unitsSoldPriorYear: 131, medianSalesPrice: "$1,403,000", medianListPrice: "$1,392,250", salesToListRatio: "99.4%", lowPrice: "$345,000", highPrice: "$4,875,750", medianSqFt: 1832, medianPricePerSqFt: "$766", medianDOM: 25 },
  { city: "Irvine", unitsSoldCurrent: 176, unitsSoldPriorYear: 181, medianSalesPrice: "$1,444,000", medianListPrice: "$1,498,000", salesToListRatio: "97.4%", lowPrice: "$430,000", highPrice: "$10,200,000", medianSqFt: 1975, medianPricePerSqFt: "$731", medianDOM: 38 },
  { city: "La Habra", unitsSoldCurrent: 26, unitsSoldPriorYear: 31, medianSalesPrice: "$847,500", medianListPrice: "$850,000", salesToListRatio: "100.0%", lowPrice: "$460,000", highPrice: "$1,850,000", medianSqFt: 1360, medianPricePerSqFt: "$623", medianDOM: 13 },
  { city: "La Palma", unitsSoldCurrent: 7, unitsSoldPriorYear: 7, medianSalesPrice: "$1,231,000", medianListPrice: "$1,199,000", salesToListRatio: "101.9%", lowPrice: "$918,000", highPrice: "$1,460,000", medianSqFt: 1934, medianPricePerSqFt: "$637", medianDOM: 5 },
  { city: "Ladera Ranch", unitsSoldCurrent: 12, unitsSoldPriorYear: 20, medianSalesPrice: "$1,845,000", medianListPrice: "$1,864,500", salesToListRatio: "100.0%", lowPrice: "$698,000", highPrice: "$6,100,000", medianSqFt: 2928, medianPricePerSqFt: "$630", medianDOM: 26 },
  { city: "Laguna Beach", unitsSoldCurrent: 26, unitsSoldPriorYear: 30, medianSalesPrice: "$3,087,500", medianListPrice: "$3,375,000", salesToListRatio: "95.7%", lowPrice: "$685,000", highPrice: "$12,700,000", medianSqFt: 2058, medianPricePerSqFt: "$1,500", medianDOM: 59 },
  { city: "Laguna Hills", unitsSoldCurrent: 21, unitsSoldPriorYear: 19, medianSalesPrice: "$1,280,000", medianListPrice: "$1,299,000", salesToListRatio: "98.2%", lowPrice: "$490,000", highPrice: "$3,826,000", medianSqFt: 1780, medianPricePerSqFt: "$719", medianDOM: 15 },
  { city: "Laguna Niguel", unitsSoldCurrent: 62, unitsSoldPriorYear: 54, medianSalesPrice: "$1,390,000", medianListPrice: "$1,389,450", salesToListRatio: "98.8%", lowPrice: "$495,000", highPrice: "$5,995,000", medianSqFt: 1676, medianPricePerSqFt: "$829", medianDOM: 22 },
  { city: "Laguna Woods", unitsSoldCurrent: 49, unitsSoldPriorYear: 53, medianSalesPrice: "$470,000", medianListPrice: "$479,000", salesToListRatio: "98.9%", lowPrice: "$18,100", highPrice: "$1,550,000", medianSqFt: 1100, medianPricePerSqFt: "$427", medianDOM: 32 },
  { city: "Lake Forest", unitsSoldCurrent: 48, unitsSoldPriorYear: 49, medianSalesPrice: "$1,112,500", medianListPrice: "$1,137,499", salesToListRatio: "98.8%", lowPrice: "$318,000", highPrice: "$2,785,000", medianSqFt: 1704, medianPricePerSqFt: "$653", medianDOM: 33 },
  { city: "Los Alamitos", unitsSoldCurrent: 12, unitsSoldPriorYear: 13, medianSalesPrice: "$1,637,500", medianListPrice: "$1,574,000", salesToListRatio: "99.7%", lowPrice: "$820,000", highPrice: "$2,960,000", medianSqFt: 1963, medianPricePerSqFt: "$834", medianDOM: 8 },
  { city: "Mission Viejo", unitsSoldCurrent: 79, unitsSoldPriorYear: 61, medianSalesPrice: "$1,160,000", medianListPrice: "$1,189,000", salesToListRatio: "98.6%", lowPrice: "$505,000", highPrice: "$5,850,000", medianSqFt: 1803, medianPricePerSqFt: "$643", medianDOM: 15 },
  { city: "Newport Beach", unitsSoldCurrent: 76, unitsSoldPriorYear: 62, medianSalesPrice: "$3,742,105", medianListPrice: "$3,872,500", salesToListRatio: "97.7%", lowPrice: "$530,000", highPrice: "$13,650,000", medianSqFt: 2229, medianPricePerSqFt: "$1,679", medianDOM: 42 },
  { city: "Newport Coast", unitsSoldCurrent: 7, unitsSoldPriorYear: 11, medianSalesPrice: "$6,475,000", medianListPrice: "$6,995,000", salesToListRatio: "96.6%", lowPrice: "$1,387,500", highPrice: "$22,700,000", medianSqFt: 2964, medianPricePerSqFt: "$2,185", medianDOM: 16 },
  { city: "North Tustin", unitsSoldCurrent: 7, unitsSoldPriorYear: 17, medianSalesPrice: "$2,150,000", medianListPrice: "$1,899,000", salesToListRatio: "100.0%", lowPrice: "$1,400,000", highPrice: "$3,320,000", medianSqFt: 2272, medianPricePerSqFt: "$946", medianDOM: 18 },
  { city: "Orange", unitsSoldCurrent: 39, unitsSoldPriorYear: 90, medianSalesPrice: "$1,089,115", medianListPrice: "$1,065,000", salesToListRatio: "100.0%", lowPrice: "$464,999", highPrice: "$3,380,000", medianSqFt: 1555, medianPricePerSqFt: "$700", medianDOM: 21 },
  { city: "Placentia", unitsSoldCurrent: 24, unitsSoldPriorYear: 34, medianSalesPrice: "$1,125,000", medianListPrice: "$1,097,000", salesToListRatio: "99.7%", lowPrice: "$492,000", highPrice: "$1,750,000", medianSqFt: 1741, medianPricePerSqFt: "$646", medianDOM: 29 },
  { city: "Portola Hills", unitsSoldCurrent: 5, unitsSoldPriorYear: 6, medianSalesPrice: "$850,000", medianListPrice: "$850,000", salesToListRatio: "98.8%", lowPrice: "$545,000", highPrice: "$2,785,000", medianSqFt: 1761, medianPricePerSqFt: "$483", medianDOM: 84 },
  { city: "Rancho Mission Viejo", unitsSoldCurrent: 27, unitsSoldPriorYear: 27, medianSalesPrice: "$1,199,990", medianListPrice: "$1,199,990", salesToListRatio: "99.4%", lowPrice: "$660,000", highPrice: "$2,250,000", medianSqFt: 2063, medianPricePerSqFt: "$582", medianDOM: 31 },
  { city: "Rancho Santa Margarita", unitsSoldCurrent: 25, unitsSoldPriorYear: 26, medianSalesPrice: "$1,062,000", medianListPrice: "$1,059,000", salesToListRatio: "99.5%", lowPrice: "$448,000", highPrice: "$1,625,000", medianSqFt: 1460, medianPricePerSqFt: "$727", medianDOM: 20 },
  { city: "Rossmoor", unitsSoldCurrent: 5, unitsSoldPriorYear: 4, medianSalesPrice: "$2,560,000", medianListPrice: "$2,498,000", salesToListRatio: "100.5%", lowPrice: "$1,658,000", highPrice: "$3,750,000", medianSqFt: 3000, medianPricePerSqFt: "$853", medianDOM: 36 },
  { city: "San Clemente", unitsSoldCurrent: 55, unitsSoldPriorYear: 58, medianSalesPrice: "$2,200,000", medianListPrice: "$2,220,000", salesToListRatio: "100.0%", lowPrice: "$475,000", highPrice: "$4,076,000", medianSqFt: 2309, medianPricePerSqFt: "$953", medianDOM: 13 },
  { city: "San Juan Capistrano", unitsSoldCurrent: 32, unitsSoldPriorYear: 21, medianSalesPrice: "$1,825,000", medianListPrice: "$1,820,000", salesToListRatio: "98.9%", lowPrice: "$395,000", highPrice: "$4,700,000", medianSqFt: 2781, medianPricePerSqFt: "$656", medianDOM: 14 },
  { city: "Santa Ana", unitsSoldCurrent: 72, unitsSoldPriorYear: 81, medianSalesPrice: "$862,500", medianListPrice: "$877,000", salesToListRatio: "100.0%", lowPrice: "$180,000", highPrice: "$2,700,000", medianSqFt: 1315, medianPricePerSqFt: "$656", medianDOM: 22 },
  { city: "Seal Beach", unitsSoldCurrent: 46, unitsSoldPriorYear: 49, medianSalesPrice: "$472,000", medianListPrice: "$469,000", salesToListRatio: "98.8%", lowPrice: "$190,000", highPrice: "$2,690,000", medianSqFt: 1100, medianPricePerSqFt: "$429", medianDOM: 21 },
  { city: "Stanton", unitsSoldCurrent: 11, unitsSoldPriorYear: 14, medianSalesPrice: "$615,000", medianListPrice: "$605,000", salesToListRatio: "101.2%", lowPrice: "$490,000", highPrice: "$1,010,000", medianSqFt: 1163, medianPricePerSqFt: "$529", medianDOM: 20 },
  { city: "Talega", unitsSoldCurrent: 13, unitsSoldPriorYear: 8, medianSalesPrice: "$2,200,000", medianListPrice: "$2,295,000", salesToListRatio: "98.0%", lowPrice: "$807,500", highPrice: "$3,530,000", medianSqFt: 3112, medianPricePerSqFt: "$707", medianDOM: 34 },
  { city: "Tustin", unitsSoldCurrent: 31, unitsSoldPriorYear: 37, medianSalesPrice: "$1,075,000", medianListPrice: "$1,100,000", salesToListRatio: "98.4%", lowPrice: "$463,500", highPrice: "$2,400,000", medianSqFt: 1574, medianPricePerSqFt: "$683", medianDOM: 29 },
  { city: "Villa Park", unitsSoldCurrent: 7, unitsSoldPriorYear: 4, medianSalesPrice: "$2,475,000", medianListPrice: "$2,499,888", salesToListRatio: "98.5%", lowPrice: "$2,225,000", highPrice: "$3,200,000", medianSqFt: 3790, medianPricePerSqFt: "$653", medianDOM: 10 },
  { city: "Westminster", unitsSoldCurrent: 18, unitsSoldPriorYear: 28, medianSalesPrice: "$1,142,500", medianListPrice: "$1,149,500", salesToListRatio: "99.0%", lowPrice: "$520,000", highPrice: "$1,700,000", medianSqFt: 1451, medianPricePerSqFt: "$788", medianDOM: 24 },
  { city: "Yorba Linda", unitsSoldCurrent: 65, unitsSoldPriorYear: 59, medianSalesPrice: "$1,680,000", medianListPrice: "$1,695,000", salesToListRatio: "99.0%", lowPrice: "$400,000", highPrice: "$5,500,000", medianSqFt: 2740, medianPricePerSqFt: "$613", medianDOM: 24 },
  { city: "All of O.C.", unitsSoldCurrent: cfg.closedSales.unitsSold, unitsSoldPriorYear: cfg.closedSales.unitsSoldPriorYear, medianSalesPrice: cfg.closedSales.medianSalesPrice, medianListPrice: cfg.closedSales.medianListPrice, salesToListRatio: cfg.closedSales.salesToListRatio, lowPrice: "$18,100", highPrice: "$22,700,000", medianSqFt: cfg.closedSales.medianSqFt, medianPricePerSqFt: cfg.closedSales.medianPricePerSqFt, medianDOM: cfg.closedSales.medianDOM }
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

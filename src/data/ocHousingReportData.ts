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
// 1. BI-WEEKLY REPORT CONFIGURATION — OCTOBER 12, 2026 (RATES RISE, HOUSING STALLS)
// =============================================================================
export const BI_WEEKLY_REPORT_CONFIG = {
  // Report Identity
  reportDate: "October 12, 2026",
  coverDate: "October 13, 2026",
  priorReportDate: "September 28, 2026",
  priorYearReportDate: "October 2025",
  title: "Rates Rise, Housing Stalls",
  subtitle: "Buyer demand plunged in the past two weeks, reaching its lowest October reading since 2007 as mortgage rates moved higher.",
  author: "Steven Thomas",
  publisher: "Reports On Housing",

  // Page 5 & 9: Active Inventory
  actives: 4924,
  activesTwoWeeksAgo: 4952,
  activesLastYear: 4478,
  preCovidActivesAverage: 6306,
  ytdNewListings: 21038,

  // Page 6 & 9: 30-Day Buyer Demand (Pending Escrows)
  demand: 1249,
  demandTwoWeeksAgo: 1349,
  demandLastYear: 1582,
  springPeakDemand: 1678,
  preCovidDemandAverage: 2206,

  // Page 7 & 9: Expected Market Time (Velocity in Days)
  marketTime: 118,
  marketTimeTwoWeeksAgo: 110,
  marketTimeLastYear: 85,
  preCovidMarketTimeAverage: 87,

  // Page 7, 10 & 11: Property Type Breakdowns
  detached: {
    marketTime: 105,
    marketTimeTwoWeeksAgo: 99,
    marketTimeLastYear: 86,
    actives: 2710,
    demand: 771,
  },
  attached: {
    marketTime: 139,
    marketTimeTwoWeeksAgo: 128,
    marketTimeLastYear: 83,
    actives: 2214,
    demand: 478,
  },

  // Page 8: Luxury End ($2.5M+)
  luxury: {
    marketTime: 183,
    marketTimeTwoWeeksAgo: 184,
    marketTimeLastYear: 194,
    actives: 952,
    activesTwoWeeksAgo: 981,
    demand: 156,
    demandTwoWeeksAgo: 160,
  },

  // Page 3 & 12: Closed vs Last List Price Breakdown
  listPriceBreakdown: {
    belowAskingPct: "54%",
    belowAskingMedianShaved: "$35,000",
    belowAskingMedianDOM: 38,
    atAskingPct: "18%",
    atAskingMedianDOM: 11,
    aboveAskingPct: "28%",
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
    actives: 17,
    activesTwoWeeksAgo: 13,
    lastYearActives: 10,
    foreclosures: 6,
    shortSales: 11,
    listingsPct: "0.3%",
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
  demand: cfg.demand, // 1249
  demandPrior: cfg.demandTwoWeeksAgo, // 1349
  demandDelta: cfg.demand - cfg.demandTwoWeeksAgo, // -100
  demandTrend: 'DOWN' as const,
  
  supply: cfg.actives, // 4924
  supplyPrior: cfg.activesTwoWeeksAgo, // 4952
  supplyDelta: cfg.actives - cfg.activesTwoWeeksAgo, // -28
  supplyTrend: 'DOWN' as const,
  
  emtDays: cfg.marketTime, // 118
  emtDaysPrior: cfg.marketTimeTwoWeeksAgo, // 110
  emtDelta: cfg.marketTime - cfg.marketTimeTwoWeeksAgo, // +8
  speed: 'SLOWER' as const,
  direction: 'WEAK' as const,
  fullText: 'MARKET SPEED: WEAK • SLOWER',
  matchedRowId: 5
};

// =============================================================================
// PAGE 8: ORANGE COUNTY MARKET BREAKDOWN (OCTOBER 12, 2026)
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
  { priceRange: "$0 - $750k", speedCategory: "Slight Buyer's", marketTimeDays: 126, pctCurrentInventory: 22, inventoryCount: 1092, pctCurrentDemand: 21, demandCount: 261, lastYearDays: 64, deltaDays: 62, signalBars: 2 },
  { priceRange: "$750k - $1M", speedCategory: "Balanced Market", marketTimeDays: 117, pctCurrentInventory: 17, inventoryCount: 833, pctCurrentDemand: 17, demandCount: 213, lastYearDays: 62, deltaDays: 55, signalBars: 3 },
  { priceRange: "$1M - $1.25M", speedCategory: "Balanced Market", marketTimeDays: 102, pctCurrentInventory: 12, inventoryCount: 593, pctCurrentDemand: 14, demandCount: 175, lastYearDays: 71, deltaDays: 31, signalBars: 3 },
  { priceRange: "$1.25M - $1.5M", speedCategory: "Slight Seller's", marketTimeDays: 86, pctCurrentInventory: 11, inventoryCount: 532, pctCurrentDemand: 16, demandCount: 186, lastYearDays: 64, deltaDays: 22, signalBars: 4 },
  { priceRange: "$1.5M - $2M", speedCategory: "Balanced Market", marketTimeDays: 103, pctCurrentInventory: 13, inventoryCount: 662, pctCurrentDemand: 15, demandCount: 193, lastYearDays: 87, deltaDays: 16, signalBars: 3 },
  { priceRange: "$2M - $2.5M", speedCategory: "Slight Buyer's", marketTimeDays: 120, pctCurrentInventory: 5, inventoryCount: 260, pctCurrentDemand: 5, demandCount: 65, lastYearDays: 159, deltaDays: -39, signalBars: 2 },
  { priceRange: "$2.5M - $4M", speedCategory: "Slight Buyer's", marketTimeDays: 125, pctCurrentInventory: 9, inventoryCount: 425, pctCurrentDemand: 8, demandCount: 102, lastYearDays: 151, deltaDays: -26, signalBars: 2 },
  { priceRange: "$4M - $6M", speedCategory: "Buyer's Market", marketTimeDays: 224, pctCurrentInventory: 5, inventoryCount: 224, pctCurrentDemand: 2, demandCount: 30, lastYearDays: 183, deltaDays: 41, signalBars: 1 },
  { priceRange: "$6M+", speedCategory: "Buyer's Market", marketTimeDays: 379, pctCurrentInventory: 6, inventoryCount: 303, pctCurrentDemand: 2, demandCount: 24, lastYearDays: 431, deltaDays: -52, signalBars: 1 },
];

export const OC_PAGE_8_LUXURY_NOTE = {
  title: "LUXURY END",
  subtitle: "THE LUXURY MARKET HASN'T CHANGED MUCH OVER THE PAST COUPLE OF WEEKS.",
  content: "Over the past couple of weeks, the luxury inventory for homes priced above $2.5 million (the top 10% of the Orange County housing market) decreased from 981 to 952, down 29 (-3%). Luxury demand decreased from 160 to 156 pending sales, down 4 (-3%). With supply and demand dropping at a similar pace, the Expected Market Time for luxury homes priced above $2.5 million decreased slightly from 184 to 183 days.\n\nYear over year, the active luxury inventory is down by 127 homes (-12%), and luxury demand is down by 11 pending sales (-7%). Last year's Expected Market Time was 194 days, similar to today.\n\nOver the past two weeks, the Expected Market Time for homes priced between $2.5 million and $4 million rose from 121 to 125 days. For homes priced between $4 million and $6 million, the Expected Market Time increased from 218 to 224 days. For homes priced above $6 million, the Expected Market Time decreased from 454 to 379 days. Luxury is at 183 days overall. At this pace, a seller would likely become a pending sale around April 2027.",
  actives: 952,
  activesDelta: -29,
  demand: 156,
  demandDelta: -4,
  emt: 183,
  emtDelta: -1,
  priorYearEMT: 194,
  pendingPaceMonth: "April 2027"
};

// =============================================================================
// PAGE 9: ORANGE COUNTY HOUSING SUMMARY (OCTOBER 12, 2026)
// Rates Rise, Housing Stalls — Telemetry & Metrics (Minimalist Apple/Tesla UI)
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
  reportDate: "October 12, 2026",
  coverDate: "October 13, 2026",
  title: "Rates Rise, Housing Stalls",
  subtitle: "Buyer demand plunged to 1,249 pending sales (lowest October since 2007) while inventory held at 4,924 homes.",
  pillars: [
    {
      id: "inventory",
      title: "ACTIVE INVENTORY",
      stat: "4,924",
      unit: "Homes on Market",
      badge: "-0.6% in 2 wks",
      badgeType: "neutral" as const,
      delta2Wks: "-28 Homes (-0.6%)",
      deltaYoY: "+446 (+9% vs 4,478)",
      compPreCovid: "-22% (-1,382 vs 6,306 avg)",
      metricLabel1: "YTD vs Pre-COVID",
      metricValue1: "-27% (-8,605 listings)",
      metricLabel2: "2-Yr Comparison",
      metricValue2: "+1,963 homes vs 2024"
    },
    {
      id: "demand",
      title: "BUYER DEMAND",
      stat: "1,249",
      unit: "30-Day Pending Sales",
      badge: "Lowest Oct Since 2007",
      badgeType: "negative" as const,
      delta2Wks: "-100 (-7.4% in 2 wks)",
      deltaYoY: "-333 (-21% vs 1,582)",
      compPreCovid: "-43% (-957 vs 2,206 avg)",
      metricLabel1: "Historical Record",
      metricValue1: "Lowest October in 19 Yrs",
      metricLabel2: "Pre-COVID 3-Yr Avg",
      metricValue2: "2,206 (77% higher)"
    },
    {
      id: "market-time",
      title: "MARKET TIME (EMT)",
      stat: "118 Days",
      unit: "Days to Sell Inventory",
      badge: "+8d Slower (Balanced)",
      badgeType: "warning" as const,
      delta2Wks: "+8 Days (from 110d)",
      deltaYoY: "+33 Days (from 85d)",
      compPreCovid: "+31 Days (from 87d avg)",
      metricLabel1: "Slowest Pace Since",
      metricValue1: "April 2020 (COVID)",
      metricLabel2: "Speed Category",
      metricValue2: "Balanced (90–120 Days)"
    },
    {
      id: "luxury",
      title: "LUXURY ($2.5M+)",
      stat: "183 Days",
      unit: "Expected Market Time",
      badge: "April 2027 Pace",
      badgeType: "neutral" as const,
      delta2Wks: "-1 Day (from 184d)",
      deltaYoY: "-11 Days (from 194d)",
      compPreCovid: "Top 10% Market Share",
      metricLabel1: "Luxury Active Supply",
      metricValue1: "952 homes (-29 in 2 wks)",
      metricLabel2: "Luxury 30-Day Demand",
      metricValue2: "156 pending (-4 in 2 wks)"
    },
    {
      id: "distressed",
      title: "DISTRESSED HOMES",
      stat: "17",
      unit: "Foreclosures & Short Sales",
      badge: "0.3% of Supply",
      badgeType: "positive" as const,
      delta2Wks: "+4 Homes (from 13)",
      deltaYoY: "+7 Homes (vs 10 in 2025)",
      compPreCovid: "1.5% Pre-COVID Average",
      metricLabel1: "Foreclosures / Short Sales",
      metricValue1: "6 Active / 11 Active",
      metricLabel2: "Share of Demand",
      metricValue2: "0.4% (5 of 1,249)"
    },
    {
      id: "closed-sales",
      title: "CLOSED SALES (AUG)",
      stat: "1,755",
      unit: "August Closed Escrows",
      badge: "99.5% Sale-to-List",
      badgeType: "positive" as const,
      delta2Wks: "-9% MoM (vs July)",
      deltaYoY: "-6% YoY (1,875 in 2025)",
      compPreCovid: "Median $1,215,000 (+4.5%)",
      metricLabel1: "Equity Sellers",
      metricValue1: "99.72% (Only 5 Distress)",
      metricLabel2: "Avg DOM / Price/SqFt",
      metricValue2: "28 Days / $715/sqft"
    },
    {
      id: "median-list-price",
      title: "MEDIAN LIST PRICE",
      stat: "$1,200,000",
      unit: "Page 12 Sold Report",
      badge: "99.5% Sale-to-List",
      badgeType: "positive" as const,
      delta2Wks: "$1,215,000 Closed Median",
      deltaYoY: "+4.3% vs Prior Year",
      compPreCovid: "+45% vs Pre-COVID ($825k)",
      metricLabel1: "Closed vs. List Ratio",
      metricValue1: "99.5% (Very Close to Ask)",
      metricLabel2: "Price Range Spread",
      metricValue2: "$122,500 – $38,900,000"
    },
    {
      id: "median-dom",
      title: "MEDIAN DAYS ON MARKET",
      stat: "19 Days",
      unit: "Closed Resale Velocity (Page 12)",
      badge: "Under 3 Weeks to Close",
      badgeType: "positive" as const,
      delta2Wks: "11 Days (At List Price)",
      deltaYoY: "10 Days (Above List Price)",
      compPreCovid: "38 Days (Below List Price)",
      metricLabel1: "At Asking Price Pace",
      metricValue1: "11 Days (18% of sales)",
      metricLabel2: "Above Asking Price Pace",
      metricValue2: "10 Days (28% of sales)"
    },
    {
      id: "median-price-sqft",
      title: "MEDIAN PRICE / SQ. FT.",
      stat: "$715",
      unit: "Closed Sales (Page 12)",
      badge: "+4.5% YoY Growth",
      badgeType: "positive" as const,
      delta2Wks: "1,700 Median Sq Ft",
      deltaYoY: "$684/sqft in 2025 (+4.5%)",
      compPreCovid: "+47% vs Pre-COVID ($485)",
      metricLabel1: "Top Coastal Cities",
      metricValue1: "Corona Del Mar ($2,002) · Newport ($1,507)",
      metricLabel2: "Median Resale Size",
      metricValue2: "1,700 Sq. Ft. Countywide"
    }
  ]
};

// =============================================================================
// 3. EXECUTIVE SUMMARY CARDS (OCTOBER 12, 2026 REPORT)
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
    summary: `Expected Market Time lengthened by 8 days over the past two weeks to ${cfg.marketTime} days as buyer demand plunged while active listings remained steady. At 118 days, countywide speed represents the slowest pace recorded since the April 2020 COVID lockdowns.`,
    keyTakeaways: [
      `Countywide Expected Market Time rose to ${cfg.marketTime} days (up 8 days from ${cfg.marketTimeTwoWeeksAgo}d two weeks ago).`,
      `Attached Condominiums & Townhomes: ${cfg.attached.marketTime} days (up from ${cfg.attached.marketTimeTwoWeeksAgo}d two weeks ago; ${cfg.attached.marketTimeLastYear}d last year).`,
      `Detached Single-Family: ${cfg.detached.marketTime} days (up from ${cfg.detached.marketTimeTwoWeeksAgo}d two weeks ago; ${cfg.detached.marketTimeLastYear}d last year).`,
      `Detached single-family homes (105 days) continue to sell significantly faster than attached condos (139 days).`
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
    summary: `Buyer demand, the 30-day snapshot of new pending escrows, plunged by 100 sales (-7.4%) to ${cfg.demand.toLocaleString()} escrows as mortgage rates climbed back upward. This is the lowest October demand level in Orange County since 2007.`,
    keyTakeaways: [
      `Buyer demand stands at ${cfg.demand.toLocaleString()} pending sales (down 100 escrows or -7.4% in 2 weeks).`,
      `Lowest October buyer demand recorded across Orange County since 2007.`,
      `Spring peak demand was ${cfg.springPeakDemand.toLocaleString()} pending sales.`,
      `Last year's pace: ${cfg.demandLastYear.toLocaleString()} pending sales (${demandPctYoY}% YoY).`,
      `Pre-COVID 3-year average was ${cfg.preCovidDemandAverage.toLocaleString()} pending sales (77% higher than today).`
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
    summary: `Active listing inventory decreased by 28 homes (-0.6%) over the past two weeks to ${cfg.actives.toLocaleString()} listings. 54% of closed sales closed below asking price, while well-priced inventory continues to move.`,
    keyTakeaways: [
      `Active inventory sits at ${cfg.actives.toLocaleString()} homes (down 28 homes in 2 weeks).`,
      `Compared to last year's ${cfg.activesLastYear.toLocaleString()} homes (+${inventoryPctYoY}% YoY / 446 more).`,
      `Pre-COVID 3-year average was ${cfg.preCovidActivesAverage.toLocaleString()} homes (28% higher than today).`,
      `From Jan through Sept, 27% fewer homes came on the market than pre-COVID (8,605 fewer).`,
      `${cfg.ytdNewListings.toLocaleString()} homes placed on the market YTD.`
    ],
    category: "supply"
  },
  {
    id: "pricing",
    title: "Closed vs. Last List Price",
    shortTitle: "Pricing Trends",
    currentStat: "54% Below Ask",
    currentValue: 54,
    unit: "Resale Closings",
    trend2Weeks: "28% Sold Above Asking",
    isTrendPositive: false,
    compLastYear: "18% Sold at Full Asking",
    summary: `54% of all August closed sales sold below asking price (median $35,000 shaved off after 38 days on market). 46% sold at or above asking price, verifying that realistic pricing remains essential.`,
    keyTakeaways: [
      `54% of closed sales sold below last asking price (median discount of $35,000 after 38 days DOM).`,
      `18% sold at the exact list price (median of 11 days on market).`,
      `28% sold above the last list price (median premium of $20,000 and 10 days on market).`,
      `Turnkey, realistically priced homes in prime condition continue to capture quick contracts.`
    ],
    category: "pricing"
  },
  {
    id: "closed",
    title: `${cfg.closedSales.period} Closed Sales`,
    shortTitle: "Closed Sales",
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
    trend: `${inventoryDelta2Wks} in 2 wks (${inventoryPct2Wks}%)`,
    description: `Active inventory dipped by 28 homes to ${cfg.actives.toLocaleString()} listings, down 22% compared to pre-COVID averages.`
  },
  {
    title: "Buyer Demand",
    stat: `${cfg.demand.toLocaleString()} Escrows`,
    trend: `${demandDelta2Wks} in 2 wks (${demandPct2Wks}%)`,
    description: `30-day pending sales dropped by 7.4% to ${cfg.demand.toLocaleString()} escrows with rates rising—the lowest October demand since 2007.`
  },
  {
    title: "Expected Market Time",
    stat: `${cfg.marketTime} Days`,
    trend: `+${marketTimeDelta2Wks} days vs 2 wks ago`,
    description: `Market speed slowed by 8 days to ${cfg.marketTime} days (slowest since April 2020 lockdowns). Detached homes are at 105 days while attached condominiums are at 139 days.`
  },
  {
    title: "Luxury End ($2.5M+)",
    stat: `${cfg.luxury.marketTime} Days`,
    trend: `${luxuryMarketTimeDelta2Wks} days vs 2 wks ago`,
    description: `Luxury market time stands at ${cfg.luxury.marketTime} days with ${cfg.luxury.actives} active luxury listings and ${cfg.luxury.demand} pending escrows (April 2027 pace).`
  },
  {
    title: `${cfg.closedSales.period} Closed Sales`,
    stat: `${cfg.closedSales.unitsSold.toLocaleString()} Units`,
    trend: `-6% vs ${cfg.closedSales.priorYearPeriod}`,
    description: `${cfg.closedSales.unitsSold.toLocaleString()} resales closed in ${cfg.closedSales.period} (median ${cfg.closedSales.medianSalesPrice}, ${cfg.closedSales.salesToListRatio} ratio) with 99.72% equity sellers.`
  },
  {
    title: "Distressed Properties",
    stat: `${cfg.distressed.actives} Homes (${cfg.distressed.listingsPct})`,
    trend: "Historical Low",
    description: `Only ${cfg.distressed.foreclosures} foreclosures and ${cfg.distressed.shortSales} short sales countywide, accounting for just ${cfg.distressed.listingsPct} of active supply and ${cfg.distressed.demandPct} of demand.`
  }
];

// =============================================================================
// 4. PAGE 10: CITY MARKET TIME REPORT (October 12, 2026 — Rates Rise, Housing Stalls)
// Tabulated from CRMLS as of 10/8/2026
// =============================================================================
export const OC_MARKET_TIME_REPORT: OCMarketTimeEntry[] = [
  { city: "Aliso Viejo", region: "South OC", currentActives: 75, demand30Days: 20, marketTimeDays: 113, marketTime2WeeksAgo: 80, marketTime4WeeksAgo: 74, marketTime1YearAgo: 59, marketTime2YearsAgo: 68, medianActiveListPrice: "$900k" },
  { city: "Anaheim", region: "North OC", currentActives: 287, demand30Days: 71, marketTimeDays: 121, marketTime2WeeksAgo: 111, marketTime4WeeksAgo: 89, marketTime1YearAgo: 62, marketTime2YearsAgo: 67, medianActiveListPrice: "$925k" },
  { city: "Anaheim Hills", region: "North OC", currentActives: 56, demand30Days: 10, marketTimeDays: 168, marketTime2WeeksAgo: 128, marketTime4WeeksAgo: 81, marketTime1YearAgo: 55, marketTime2YearsAgo: 81, medianActiveListPrice: "$1.3m" },
  { city: "Brea", region: "North OC", currentActives: 41, demand30Days: 18, marketTimeDays: 68, marketTime2WeeksAgo: 71, marketTime4WeeksAgo: 77, marketTime1YearAgo: 60, marketTime2YearsAgo: 41, medianActiveListPrice: "$999k" },
  { city: "Buena Park", region: "North OC", currentActives: 82, demand30Days: 16, marketTimeDays: 154, marketTime2WeeksAgo: 102, marketTime4WeeksAgo: 72, marketTime1YearAgo: 71, marketTime2YearsAgo: 41, medianActiveListPrice: "$900k" },
  { city: "Corona Del Mar", region: "Coastal", currentActives: 69, demand30Days: 11, marketTimeDays: 188, marketTime2WeeksAgo: 183, marketTime4WeeksAgo: 183, marketTime1YearAgo: 353, marketTime2YearsAgo: 162, medianActiveListPrice: "$6.4m" },
  { city: "Costa Mesa", region: "Coastal", currentActives: 121, demand30Days: 36, marketTimeDays: 101, marketTime2WeeksAgo: 84, marketTime4WeeksAgo: 74, marketTime1YearAgo: 84, marketTime2YearsAgo: 48, medianActiveListPrice: "$1.5m" },
  { city: "Coto De Caza", region: "South OC", currentActives: 54, demand30Days: 15, marketTimeDays: 108, marketTime2WeeksAgo: 103, marketTime4WeeksAgo: 132, marketTime1YearAgo: 114, marketTime2YearsAgo: 77, medianActiveListPrice: "$2.2m" },
  { city: "Cypress", region: "North OC", currentActives: 58, demand30Days: 22, marketTimeDays: 79, marketTime2WeeksAgo: 102, marketTime4WeeksAgo: 95, marketTime1YearAgo: 49, marketTime2YearsAgo: 39, medianActiveListPrice: "$965k" },
  { city: "Dana Point", region: "Coastal", currentActives: 103, demand30Days: 17, marketTimeDays: 182, marketTime2WeeksAgo: 173, marketTime4WeeksAgo: 99, marketTime1YearAgo: 126, marketTime2YearsAgo: 134, medianActiveListPrice: "$2.4m" },
  { city: "Dove Canyon", region: "South OC", currentActives: 4, demand30Days: 0, marketTimeDays: 0, marketTime2WeeksAgo: 0, marketTime4WeeksAgo: 40, marketTime1YearAgo: 65, marketTime2YearsAgo: 20, medianActiveListPrice: "$1.9m" },
  { city: "Foothill Ranch", region: "South OC", currentActives: 14, demand30Days: 2, marketTimeDays: 210, marketTime2WeeksAgo: 113, marketTime4WeeksAgo: 128, marketTime1YearAgo: 49, marketTime2YearsAgo: 56, medianActiveListPrice: "$670k" },
  { city: "Fountain Valley", region: "Central OC", currentActives: 39, demand30Days: 24, marketTimeDays: 49, marketTime2WeeksAgo: 40, marketTime4WeeksAgo: 44, marketTime1YearAgo: 53, marketTime2YearsAgo: 51, medianActiveListPrice: "$1.4m" },
  { city: "Fullerton", region: "North OC", currentActives: 123, demand30Days: 37, marketTimeDays: 100, marketTime2WeeksAgo: 66, marketTime4WeeksAgo: 65, marketTime1YearAgo: 53, marketTime2YearsAgo: 57, medianActiveListPrice: "$900k" },
  { city: "Garden Grove", region: "Central OC", currentActives: 114, demand30Days: 41, marketTimeDays: 83, marketTime2WeeksAgo: 85, marketTime4WeeksAgo: 74, marketTime1YearAgo: 71, marketTime2YearsAgo: 42, medianActiveListPrice: "$995k" },
  { city: "Huntington Beach", region: "Coastal", currentActives: 297, demand30Days: 93, marketTimeDays: 96, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 79, marketTime1YearAgo: 75, marketTime2YearsAgo: 61, medianActiveListPrice: "$1.4m" },
  { city: "Irvine", region: "South OC", currentActives: 706, demand30Days: 136, marketTimeDays: 156, marketTime2WeeksAgo: 145, marketTime4WeeksAgo: 156, marketTime1YearAgo: 139, marketTime2YearsAgo: 90, medianActiveListPrice: "$1.6m" },
  { city: "La Habra", region: "North OC", currentActives: 67, demand30Days: 25, marketTimeDays: 80, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 104, marketTime1YearAgo: 70, marketTime2YearsAgo: 48, medianActiveListPrice: "$850k" },
  { city: "La Palma", region: "North OC", currentActives: 9, demand30Days: 4, marketTimeDays: 68, marketTime2WeeksAgo: 130, marketTime4WeeksAgo: 72, marketTime1YearAgo: 270, marketTime2YearsAgo: 60, medianActiveListPrice: "$1.2m" },
  { city: "Ladera Ranch", region: "South OC", currentActives: 55, demand30Days: 10, marketTimeDays: 165, marketTime2WeeksAgo: 132, marketTime4WeeksAgo: 134, marketTime1YearAgo: 146, marketTime2YearsAgo: 109, medianActiveListPrice: "$1.2m" },
  { city: "Laguna Beach", region: "Coastal", currentActives: 149, demand30Days: 22, marketTimeDays: 203, marketTime2WeeksAgo: 213, marketTime4WeeksAgo: 216, marketTime1YearAgo: 194, marketTime2YearsAgo: 304, medianActiveListPrice: "$5.0m" },
  { city: "Laguna Hills", region: "South OC", currentActives: 53, demand30Days: 18, marketTimeDays: 88, marketTime2WeeksAgo: 126, marketTime4WeeksAgo: 116, marketTime1YearAgo: 76, marketTime2YearsAgo: 52, medianActiveListPrice: "$1.1m" },
  { city: "Laguna Niguel", region: "South OC", currentActives: 142, demand30Days: 47, marketTimeDays: 91, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 86, marketTime1YearAgo: 90, marketTime2YearsAgo: 96, medianActiveListPrice: "$1.3m" },
  { city: "Laguna Woods", region: "South OC", currentActives: 198, demand30Days: 48, marketTimeDays: 124, marketTime2WeeksAgo: 113, marketTime4WeeksAgo: 96, marketTime1YearAgo: 64, marketTime2YearsAgo: 49, medianActiveListPrice: "$449k" },
  { city: "Lake Forest", region: "South OC", currentActives: 207, demand30Days: 30, marketTimeDays: 207, marketTime2WeeksAgo: 151, marketTime4WeeksAgo: 151, marketTime1YearAgo: 113, marketTime2YearsAgo: 75, medianActiveListPrice: "$1.2m" },
  { city: "Los Alamitos", region: "North OC", currentActives: 11, demand30Days: 8, marketTimeDays: 41, marketTime2WeeksAgo: 47, marketTime4WeeksAgo: 40, marketTime1YearAgo: 33, marketTime2YearsAgo: 43, medianActiveListPrice: "$1.6m" },
  { city: "Mission Viejo", region: "South OC", currentActives: 155, demand30Days: 55, marketTimeDays: 85, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 70, marketTime1YearAgo: 78, marketTime2YearsAgo: 60, medianActiveListPrice: "$1.1m" },
  { city: "Newport Beach", region: "Coastal", currentActives: 233, demand30Days: 32, marketTimeDays: 218, marketTime2WeeksAgo: 197, marketTime4WeeksAgo: 156, marketTime1YearAgo: 170, marketTime2YearsAgo: 175, medianActiveListPrice: "$4.7m" },
  { city: "Newport Coast", region: "Coastal", currentActives: 46, demand30Days: 6, marketTimeDays: 230, marketTime2WeeksAgo: 223, marketTime4WeeksAgo: 201, marketTime1YearAgo: 156, marketTime2YearsAgo: 144, medianActiveListPrice: "$13.3m" },
  { city: "North Tustin", region: "Central OC", currentActives: 29, demand30Days: 14, marketTimeDays: 62, marketTime2WeeksAgo: 96, marketTime4WeeksAgo: 101, marketTime1YearAgo: 85, marketTime2YearsAgo: 64, medianActiveListPrice: "$1.9m" },
  { city: "Orange", region: "Central OC", currentActives: 178, demand30Days: 48, marketTimeDays: 111, marketTime2WeeksAgo: 109, marketTime4WeeksAgo: 115, marketTime1YearAgo: 60, marketTime2YearsAgo: 45, medianActiveListPrice: "$1.2m" },
  { city: "Placentia", region: "North OC", currentActives: 72, demand30Days: 21, marketTimeDays: 103, marketTime2WeeksAgo: 120, marketTime4WeeksAgo: 129, marketTime1YearAgo: 52, marketTime2YearsAgo: 45, medianActiveListPrice: "$847k" },
  { city: "Portola Hills", region: "South OC", currentActives: 26, demand30Days: 5, marketTimeDays: 156, marketTime2WeeksAgo: 218, marketTime4WeeksAgo: 129, marketTime1YearAgo: 150, marketTime2YearsAgo: 105, medianActiveListPrice: "$1.3m" },
  { city: "Rancho Mission Viejo", region: "South OC", currentActives: 112, demand30Days: 14, marketTimeDays: 240, marketTime2WeeksAgo: 300, marketTime4WeeksAgo: 112, marketTime1YearAgo: 81, marketTime2YearsAgo: 47, medianActiveListPrice: "$1.0m" },
  { city: "Rancho Santa Margarita", region: "South OC", currentActives: 82, demand30Days: 16, marketTimeDays: 154, marketTime2WeeksAgo: 146, marketTime4WeeksAgo: 101, marketTime1YearAgo: 65, marketTime2YearsAgo: 65, medianActiveListPrice: "$775k" },
  { city: "Rossmoor", region: "North OC", currentActives: 1, demand30Days: 3, marketTimeDays: 10, marketTime2WeeksAgo: 15, marketTime4WeeksAgo: 20, marketTime1YearAgo: 150, marketTime2YearsAgo: 34, medianActiveListPrice: "$2.2m" },
  { city: "San Clemente", region: "Coastal", currentActives: 124, demand30Days: 35, marketTimeDays: 106, marketTime2WeeksAgo: 84, marketTime4WeeksAgo: 83, marketTime1YearAgo: 124, marketTime2YearsAgo: 80, medianActiveListPrice: "$2.2m" },
  { city: "San Juan Capistrano", region: "South OC", currentActives: 68, demand30Days: 24, marketTimeDays: 85, marketTime2WeeksAgo: 117, marketTime4WeeksAgo: 82, marketTime1YearAgo: 73, marketTime2YearsAgo: 93, medianActiveListPrice: "$1.9m" },
  { city: "Santa Ana", region: "Central OC", currentActives: 224, demand30Days: 49, marketTimeDays: 137, marketTime2WeeksAgo: 107, marketTime4WeeksAgo: 101, marketTime1YearAgo: 72, marketTime2YearsAgo: 44, medianActiveListPrice: "$828k" },
  { city: "Seal Beach", region: "Coastal", currentActives: 86, demand30Days: 35, marketTimeDays: 74, marketTime2WeeksAgo: 71, marketTime4WeeksAgo: 67, marketTime1YearAgo: 35, marketTime2YearsAgo: 57, medianActiveListPrice: "$382k" },
  { city: "Stanton", region: "Central OC", currentActives: 27, demand30Days: 5, marketTimeDays: 162, marketTime2WeeksAgo: 110, marketTime4WeeksAgo: 83, marketTime1YearAgo: 45, marketTime2YearsAgo: 26, medianActiveListPrice: "$660k" },
  { city: "Talega", region: "Coastal", currentActives: 27, demand30Days: 5, marketTimeDays: 162, marketTime2WeeksAgo: 94, marketTime4WeeksAgo: 68, marketTime1YearAgo: 98, marketTime2YearsAgo: 82, medianActiveListPrice: "$1.9m" },
  { city: "Tustin", region: "Central OC", currentActives: 95, demand30Days: 37, marketTimeDays: 77, marketTime2WeeksAgo: 140, marketTime4WeeksAgo: 130, marketTime1YearAgo: 66, marketTime2YearsAgo: 46, medianActiveListPrice: "$1.0m" },
  { city: "Villa Park", region: "Central OC", currentActives: 14, demand30Days: 4, marketTimeDays: 105, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 160, marketTime1YearAgo: 113, marketTime2YearsAgo: 71, medianActiveListPrice: "$3.0m" },
  { city: "Westminster", region: "Central OC", currentActives: 44, demand30Days: 20, marketTimeDays: 66, marketTime2WeeksAgo: 66, marketTime4WeeksAgo: 92, marketTime1YearAgo: 44, marketTime2YearsAgo: 35, medianActiveListPrice: "$1.2m" },
  { city: "Yorba Linda", region: "North OC", currentActives: 147, demand30Days: 40, marketTimeDays: 110, marketTime2WeeksAgo: 91, marketTime4WeeksAgo: 85, marketTime1YearAgo: 74, marketTime2YearsAgo: 58, medianActiveListPrice: "$1.5m" },
];

// =============================================================================
// 5. PAGE 11: PRICE RANGE REPORT (October 12, 2026 — Rates Rise, Housing Stalls)
// Tabulated from CRMLS as of 10/8/2026
// =============================================================================
export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "All of O.C.", currentActives: 4924, demand30Days: 1249, marketTimeDays: 118, marketTime2WeeksAgo: 110, marketTime4WeeksAgo: 101, marketTime1YearAgo: 85, marketTime2YearsAgo: 69, medianActivePrice: "$1.2m" },
  { priceRange: "$0-$500k", currentActives: 421, demand30Days: 94, marketTimeDays: 134, marketTime2WeeksAgo: 110, marketTime4WeeksAgo: 92, marketTime1YearAgo: 63, marketTime2YearsAgo: 50, medianActivePrice: "$400k" },
  { priceRange: "$500k-$750k", currentActives: 671, demand30Days: 167, marketTimeDays: 121, marketTime2WeeksAgo: 132, marketTime4WeeksAgo: 114, marketTime1YearAgo: 64, marketTime2YearsAgo: 56, medianActivePrice: "$645k" },
  { priceRange: "$750k-$1m", currentActives: 833, demand30Days: 213, marketTimeDays: 117, marketTime2WeeksAgo: 94, marketTime4WeeksAgo: 84, marketTime1YearAgo: 62, marketTime2YearsAgo: 46, medianActivePrice: "$889k" },
  { priceRange: "$1m-$1.25m", currentActives: 593, demand30Days: 175, marketTimeDays: 102, marketTime2WeeksAgo: 88, marketTime4WeeksAgo: 87, marketTime1YearAgo: 71, marketTime2YearsAgo: 48, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 532, demand30Days: 186, marketTimeDays: 86, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 91, marketTime1YearAgo: 64, marketTime2YearsAgo: 56, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 662, demand30Days: 193, marketTimeDays: 103, marketTime2WeeksAgo: 108, marketTime4WeeksAgo: 93, marketTime1YearAgo: 87, marketTime2YearsAgo: 86, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 260, demand30Days: 65, marketTimeDays: 120, marketTime2WeeksAgo: 100, marketTime4WeeksAgo: 91, marketTime1YearAgo: 159, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 425, demand30Days: 102, marketTimeDays: 125, marketTime2WeeksAgo: 121, marketTime4WeeksAgo: 106, marketTime1YearAgo: 151, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 224, demand30Days: 30, marketTimeDays: 224, marketTime2WeeksAgo: 218, marketTime4WeeksAgo: 195, marketTime1YearAgo: 183, marketTime2YearsAgo: 194, medianActivePrice: "$4.8m" },
  { priceRange: "$6m+", currentActives: 303, demand30Days: 24, marketTimeDays: 379, marketTime2WeeksAgo: 454, marketTime4WeeksAgo: 345, marketTime1YearAgo: 431, marketTime2YearsAgo: 444, medianActivePrice: "$10.5m" },
];

export const OC_PRICE_RANGE_REPORT_ATTACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Attached", currentActives: 2214, demand30Days: 478, marketTimeDays: 139, marketTime2WeeksAgo: 128, marketTime4WeeksAgo: 115, marketTime1YearAgo: 83, marketTime2YearsAgo: 64, medianActivePrice: "$779k" },
  { priceRange: "$0-$500k", currentActives: 413, demand30Days: 92, marketTimeDays: 135, marketTime2WeeksAgo: 109, marketTime4WeeksAgo: 92, marketTime1YearAgo: 64, marketTime2YearsAgo: 48, medianActivePrice: "$400k" },
  { priceRange: "$500k-$750k", currentActives: 640, demand30Days: 158, marketTimeDays: 122, marketTime2WeeksAgo: 133, marketTime4WeeksAgo: 118, marketTime1YearAgo: 65, marketTime2YearsAgo: 58, medianActivePrice: "$639k" },
  { priceRange: "$750k-$1m", currentActives: 556, demand30Days: 111, marketTimeDays: 150, marketTime2WeeksAgo: 121, marketTime4WeeksAgo: 101, marketTime1YearAgo: 70, marketTime2YearsAgo: 56, medianActivePrice: "$869k" },
  { priceRange: "$1m-$2m", currentActives: 474, demand30Days: 96, marketTimeDays: 148, marketTime2WeeksAgo: 134, marketTime4WeeksAgo: 153, marketTime1YearAgo: 127, marketTime2YearsAgo: 85, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 131, demand30Days: 21, marketTimeDays: 187, marketTime2WeeksAgo: 235, marketTime4WeeksAgo: 140, marketTime1YearAgo: 254, marketTime2YearsAgo: 148, medianActivePrice: "$3.2m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: 2710, demand30Days: 771, marketTimeDays: 105, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 92, marketTime1YearAgo: 86, marketTime2YearsAgo: 72, medianActivePrice: "$1.7m" },
  { priceRange: "$0-$750k", currentActives: 39, demand30Days: 11, marketTimeDays: 106, marketTime2WeeksAgo: 123, marketTime4WeeksAgo: 71, marketTime1YearAgo: 50, marketTime2YearsAgo: 50, medianActivePrice: "$650k" },
  { priceRange: "$750k-$1m", currentActives: 277, demand30Days: 102, marketTimeDays: 81, marketTime2WeeksAgo: 63, marketTime4WeeksAgo: 63, marketTime1YearAgo: 52, marketTime2YearsAgo: 37, medianActivePrice: "$900k" },
  { priceRange: "$1m-$1.25m", currentActives: 362, demand30Days: 133, marketTimeDays: 82, marketTime2WeeksAgo: 73, marketTime4WeeksAgo: 70, marketTime1YearAgo: 52, marketTime2YearsAgo: 44, medianActivePrice: "$1.2m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 389, demand30Days: 152, marketTimeDays: 77, marketTime2WeeksAgo: 71, marketTime4WeeksAgo: 76, marketTime1YearAgo: 55, marketTime2YearsAgo: 50, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 562, demand30Days: 173, marketTimeDays: 97, marketTime2WeeksAgo: 104, marketTime4WeeksAgo: 85, marketTime1YearAgo: 77, marketTime2YearsAgo: 76, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 229, demand30Days: 58, marketTimeDays: 118, marketTime2WeeksAgo: 100, marketTime4WeeksAgo: 88, marketTime1YearAgo: 152, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 365, demand30Days: 95, marketTimeDays: 115, marketTime2WeeksAgo: 111, marketTime4WeeksAgo: 101, marketTime1YearAgo: 141, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 202, demand30Days: 24, marketTimeDays: 252, marketTime2WeeksAgo: 196, marketTime4WeeksAgo: 221, marketTime1YearAgo: 173, marketTime2YearsAgo: 204, medianActivePrice: "$4.9m" },
  { priceRange: "$6m+", currentActives: 285, demand30Days: 23, marketTimeDays: 372, marketTime2WeeksAgo: 452, marketTime4WeeksAgo: 341, marketTime1YearAgo: 450, marketTime2YearsAgo: 475, medianActivePrice: "$10.5m" },
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

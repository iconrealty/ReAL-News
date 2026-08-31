// Orange County Housing Report Data - Steven Thomas (Reports On Housing)
// August 17/19, 2026 - "AI Pricing Inaccuracies"
// To update for future reports, update the values in this single source-of-truth file.

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
  unitsSoldJuly2026: number;
  unitsSold2026: number;
  medianSalesPrice: string;
  medianListPrice: string;
  salesToListRatio: string;
  lowPrice: string;
  highPrice: string;
  medianSqFt: number;
  medianPricePerSqFt: string;
  medianDOM: number;
  unitsSoldJuly2025: number;
  unitsSold2025: number;
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

// -----------------------------------------------------------------------------
// CORE METADATA (Easy to update each report cycle)
// -----------------------------------------------------------------------------
export const OC_HOUSING_REPORT_METADATA = {
  reportDate: "August 17, 2026",
  coverDate: "August 19, 2026",
  author: "Steven Thomas",
  publisher: "Reports On Housing",
  title: "AI Pricing Inaccuracies",
  subtitle: "AI is not an accurate gauge for determining a home's price and should only be used as a starting point in a conversation with a real estate professional.",
  
  // Page 9 Core Summary Totals
  countywideActives: 5054,
  countywideActivesLastYear: 5011,

  countywideDemand: 1535,
  countywideDemandLastYear: 1652,

  countywideMarketTime: 99,
  countywideMarketTime2WksAgo: 101,
  countywideMarketTimeLastYear: 91,

  detachedMarketTime: 87,
  detachedMarketTime2WksAgo: 93,
  detachedMarketTimeLastYear: 95,
  detachedActives: 2784,
  detachedDemand: 957,

  attachedMarketTime: 118,
  attachedMarketTime2WksAgo: 114,
  attachedMarketTimeLastYear: 85,
  attachedActives: 2270,
  attachedDemand: 578,

  luxuryMarketTime: 155,
  luxuryMarketTime2WksAgo: 181,
  luxuryMarketTimeLastYear: 211,
  luxuryActives: 1019,
  luxuryDemand: 197,

  closedSalesJuly2026: 1930,
  closedSalesResales: 1930,
  closedSalesJuly2025: 1934,
  medianSalesPriceJuly2026: "$1,220,000",
  countywideMedianPrice: "$1,220,000",
  medianListPriceJuly2026: "$1,211,900",
  salesToListRatioJuly2026: "99.5%",
  salesToListRatio: "99.5%",
  equitySalesPercentage: "99.9%",

  distressedActiveHomes: 9,
  distressedForeclosures: 4,
  distressedShortSales: 5,
  distressedListingsPct: "0.2%",
  distressedDemandPct: "0.7%",
  distressedLastYear: 7,
};

// -----------------------------------------------------------------------------
// PAGE 9: 6 SUMMARY TABS WITH LAST YEAR COMPARISONS
// -----------------------------------------------------------------------------
export const OC_HOUSING_SUMMARY_CARDS: OCSummaryCardData[] = [
  {
    id: "inventory",
    title: "Active Inventory",
    shortTitle: "Inventory",
    currentStat: "5,054 Homes",
    currentValue: 5054,
    unit: "Active Listings",
    trend2Weeks: "+8 homes (+0.2%) in 2 weeks",
    isTrendPositive: true,
    compLastYear: "5,011 homes (+1% YoY / 43 more)",
    summary: "The active listing inventory increased by 8 homes over the past two weeks, nearly unchanged at 5,054. It appears inventory has reached a plateau as summer transitions into the Autumn Market in September.",
    keyTakeaways: [
      "Nearly unchanged at 5,054 homes (+8 in 2 weeks; up 34 in 4 weeks).",
      "Virtually level with 2025 (5,011 homes, only 43 more).",
      "Supply plateauing as late summer transitions to Autumn.",
      "18,948 total new listings have entered the Orange County market in 2026."
    ],
    category: "supply"
  },
  {
    id: "demand",
    title: "Buyer Demand",
    shortTitle: "Demand",
    currentStat: "1,535 Escrows",
    currentValue: 1535,
    unit: "30-Day Pending Sales",
    trend2Weeks: "+41 escrows (+3%) in 2 weeks",
    isTrendPositive: true,
    compLastYear: "1,652 escrows (-7% YoY / 117 fewer)",
    summary: "Snapshot of new pending sales over the prior month increased from 1,494 to 1,535 (+3%), its largest rise since early May. Demand is expected to slowly decline from week to week with the approaching Autumn Market.",
    keyTakeaways: [
      "Demand rose +3% (+41 pending sales) to 1,535 in 2 weeks.",
      "Largest bi-weekly pending sales increase recorded since early May.",
      "7% lower than last year (1,652 pending sales, -117).",
      "Expected to remain in a balanced holding pattern through September."
    ],
    category: "demand"
  },
  {
    id: "speed",
    title: "Expected Market Time",
    shortTitle: "Market Speed",
    currentStat: "99 Days",
    currentValue: 99,
    unit: "Days to Sell",
    trend2Weeks: "-2 days (down from 101d)",
    isTrendPositive: true,
    compLastYear: "91 days (slightly faster)",
    summary: "With inventory nearly unchanged and demand rising by 3%, Expected Market Time decreased from 101 to 99 days. The market remains in balanced territory (90–120 days), with single-family moving faster than condos.",
    keyTakeaways: [
      "Countywide market speed improved by 2 days from 101 to 99 days.",
      "Detached Single-Family: 87 days (down from 93d; 95d last year).",
      "Attached Condominiums: 118 days (up from 114d; 85d last year).",
      "Detached homes are moving 31 days faster than attached condominiums."
    ],
    category: "speed"
  },
  {
    id: "luxury",
    title: "Luxury Market ($2.5M+)",
    shortTitle: "Luxury ($2.5M+)",
    currentStat: "155 Days",
    currentValue: 155,
    unit: "Days to Sell",
    trend2Weeks: "-26 days (improved from 181d)",
    isTrendPositive: true,
    compLastYear: "211 days (substantially slower)",
    summary: "Luxury inventory above $2.5M fell from 1,055 to 1,019 (-3%), while luxury demand jumped from 175 to 197 (+13%). Expected Market Time plummeted to 155 days — the strongest reading since early May.",
    keyTakeaways: [
      "Luxury Expected Market Time dropped from 181 to 155 days.",
      "Luxury demand surged +13% (197 pending sales vs 175).",
      "$2.5M–$4M bracket: 111 days (down from 148 days).",
      "$4M–$6M bracket: 168 days (down from 188 days); $6M+: 370 days."
    ],
    category: "luxury"
  },
  {
    id: "closed",
    title: "Closed Sales (July)",
    shortTitle: "Closed Sales",
    currentStat: "1,930 Sales",
    currentValue: 1930,
    unit: "Closed Sales",
    trend2Weeks: "-3% vs June 2026",
    isTrendPositive: false,
    compLastYear: "1,934 sales (nearly identical)",
    summary: "There were 1,930 closed residential sales in July 2026, nearly identical to July 2025's 1,934 sales. The sales-to-list price ratio stood at 99.5%, with 99.9% of all sellers having equity.",
    keyTakeaways: [
      "1,930 residential sales closed in July 2026 (1,934 in July 2025).",
      "Median sales price: $1,220,000 (median list: $1,211,900; $717/sq ft).",
      "Sales-to-list price ratio captured: 99.5%.",
      "99.9% of all closed transactions were equity sales."
    ],
    category: "sales"
  },
  {
    id: "distressed",
    title: "Distressed Homes",
    shortTitle: "Distressed",
    currentStat: "9 Homes (0.2%)",
    currentValue: 9,
    unit: "Active Listings",
    trend2Weeks: "-1 home (down from 10)",
    isTrendPositive: true,
    compLastYear: "7 distressed homes (similar)",
    summary: "Short sales and foreclosures combined comprised only 0.2% of all active listings and 0.7% of demand. There are currently only 4 foreclosures and 5 short sales available in the entire county.",
    keyTakeaways: [
      "Total distressed active inventory: 9 homes (4 foreclosures, 5 short sales).",
      "Comprises only 0.2% of all active listings in Orange County.",
      "Accounts for only 0.7% of 30-day buyer demand.",
      "Virtually identical to last year (7 homes); no foreclosure wave exists."
    ],
    category: "distressed"
  }
];

// -----------------------------------------------------------------------------
// PAGE 10: CITY MARKET TIME REPORT (August 17, 2026 Data)
// -----------------------------------------------------------------------------
export const OC_MARKET_TIME_REPORT: OCMarketTimeEntry[] = [
  { city: "Aliso Viejo", region: "South OC", currentActives: 80, demand30Days: 40, marketTimeDays: 60, marketTime2WeeksAgo: 77, marketTime4WeeksAgo: 152, marketTime1YearAgo: 80, marketTime2YearsAgo: 28, medianActiveListPrice: "$882k" },
  { city: "Anaheim", region: "North OC", currentActives: 271, demand30Days: 86, marketTimeDays: 95, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 93, marketTime1YearAgo: 84, marketTime2YearsAgo: 41, medianActiveListPrice: "$900k" },
  { city: "Anaheim Hills", region: "North OC", currentActives: 40, demand30Days: 18, marketTimeDays: 67, marketTime2WeeksAgo: 73, marketTime4WeeksAgo: 45, marketTime1YearAgo: 70, marketTime2YearsAgo: 45, medianActiveListPrice: "$1.4m" },
  { city: "Brea", region: "North OC", currentActives: 47, demand30Days: 27, marketTimeDays: 52, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 60, marketTime1YearAgo: 74, marketTime2YearsAgo: 31, medianActiveListPrice: "$1.2m" },
  { city: "Buena Park", region: "North OC", currentActives: 65, demand30Days: 31, marketTimeDays: 63, marketTime2WeeksAgo: 80, marketTime4WeeksAgo: 78, marketTime1YearAgo: 56, marketTime2YearsAgo: 62, medianActiveListPrice: "$924k" },
  { city: "Corona Del Mar", region: "Coastal", currentActives: 63, demand30Days: 21, marketTimeDays: 90, marketTime2WeeksAgo: 202, marketTime4WeeksAgo: 188, marketTime1YearAgo: 157, marketTime2YearsAgo: 158, medianActiveListPrice: "$5.6m" },
  { city: "Costa Mesa", region: "Coastal", currentActives: 112, demand30Days: 48, marketTimeDays: 70, marketTime2WeeksAgo: 114, marketTime4WeeksAgo: 111, marketTime1YearAgo: 103, marketTime2YearsAgo: 63, medianActiveListPrice: "$1.5m" },
  { city: "Coto De Caza", region: "South OC", currentActives: 65, demand30Days: 11, marketTimeDays: 177, marketTime2WeeksAgo: 396, marketTime4WeeksAgo: 145, marketTime1YearAgo: 114, marketTime2YearsAgo: 167, medianActiveListPrice: "$2.5m" },
  { city: "Cypress", region: "North OC", currentActives: 57, demand30Days: 26, marketTimeDays: 66, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 97, marketTime1YearAgo: 56, marketTime2YearsAgo: 30, medianActiveListPrice: "$950k" },
  { city: "Dana Point", region: "Coastal", currentActives: 103, demand30Days: 24, marketTimeDays: 129, marketTime2WeeksAgo: 140, marketTime4WeeksAgo: 91, marketTime1YearAgo: 194, marketTime2YearsAgo: 121, medianActiveListPrice: "$2.4m" },
  { city: "Dove Canyon", region: "South OC", currentActives: 7, demand30Days: 3, marketTimeDays: 70, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 105, marketTime1YearAgo: 90, marketTime2YearsAgo: 90, medianActiveListPrice: "$1.9m" },
  { city: "Foothill Ranch", region: "South OC", currentActives: 14, demand30Days: 4, marketTimeDays: 105, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 270, marketTime1YearAgo: 168, marketTime2YearsAgo: 60, medianActiveListPrice: "$1.2m" },
  { city: "Fountain Valley", region: "Central OC", currentActives: 53, demand30Days: 26, marketTimeDays: 61, marketTime2WeeksAgo: 74, marketTime4WeeksAgo: 80, marketTime1YearAgo: 60, marketTime2YearsAgo: 66, medianActiveListPrice: "$1.6m" },
  { city: "Fullerton", region: "North OC", currentActives: 137, demand30Days: 58, marketTimeDays: 71, marketTime2WeeksAgo: 78, marketTime4WeeksAgo: 85, marketTime1YearAgo: 69, marketTime2YearsAgo: 66, medianActiveListPrice: "$950k" },
  { city: "Garden Grove", region: "Central OC", currentActives: 111, demand30Days: 44, marketTimeDays: 76, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 89, marketTime1YearAgo: 66, marketTime2YearsAgo: 42, medianActiveListPrice: "$999k" },
  { city: "Huntington Beach", region: "Coastal", currentActives: 315, demand30Days: 98, marketTimeDays: 96, marketTime2WeeksAgo: 79, marketTime4WeeksAgo: 95, marketTime1YearAgo: 78, marketTime2YearsAgo: 61, medianActiveListPrice: "$1.5m" },
  { city: "Irvine", region: "South OC", currentActives: 798, demand30Days: 147, marketTimeDays: 163, marketTime2WeeksAgo: 158, marketTime4WeeksAgo: 153, marketTime1YearAgo: 155, marketTime2YearsAgo: 91, medianActiveListPrice: "$1.6m" },
  { city: "La Habra", region: "North OC", currentActives: 72, demand30Days: 23, marketTimeDays: 94, marketTime2WeeksAgo: 87, marketTime4WeeksAgo: 66, marketTime1YearAgo: 61, marketTime2YearsAgo: 47, medianActiveListPrice: "$809k" },
  { city: "La Palma", region: "North OC", currentActives: 11, demand30Days: 7, marketTimeDays: 47, marketTime2WeeksAgo: 56, marketTime4WeeksAgo: 43, marketTime1YearAgo: 45, marketTime2YearsAgo: 30, medianActiveListPrice: "$1.3m" },
  { city: "Ladera Ranch", region: "South OC", currentActives: 55, demand30Days: 10, marketTimeDays: 165, marketTime2WeeksAgo: 111, marketTime4WeeksAgo: 115, marketTime1YearAgo: 97, marketTime2YearsAgo: 35, medianActiveListPrice: "$1.3m" },
  { city: "Laguna Beach", region: "Coastal", currentActives: 174, demand30Days: 20, marketTimeDays: 261, marketTime2WeeksAgo: 235, marketTime4WeeksAgo: 227, marketTime1YearAgo: 228, marketTime2YearsAgo: 189, medianActiveListPrice: "$4.8m" },
  { city: "Laguna Hills", region: "South OC", currentActives: 55, demand30Days: 16, marketTimeDays: 103, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 77, marketTime1YearAgo: 98, marketTime2YearsAgo: 66, medianActiveListPrice: "$1.1m" },
  { city: "Laguna Niguel", region: "South OC", currentActives: 165, demand30Days: 50, marketTimeDays: 99, marketTime2WeeksAgo: 129, marketTime4WeeksAgo: 96, marketTime1YearAgo: 114, marketTime2YearsAgo: 76, medianActiveListPrice: "$1.5m" },
  { city: "Laguna Woods", region: "South OC", currentActives: 197, demand30Days: 64, marketTimeDays: 92, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 92, marketTime1YearAgo: 59, marketTime2YearsAgo: 39, medianActiveListPrice: "$430k" },
  { city: "Lake Forest", region: "South OC", currentActives: 214, demand30Days: 38, marketTimeDays: 169, marketTime2WeeksAgo: 158, marketTime4WeeksAgo: 121, marketTime1YearAgo: 72, marketTime2YearsAgo: 42, medianActiveListPrice: "$1.3m" },
  { city: "Los Alamitos", region: "North OC", currentActives: 16, demand30Days: 8, marketTimeDays: 60, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 108, marketTime1YearAgo: 37, marketTime2YearsAgo: 36, medianActiveListPrice: "$1.8m" },
  { city: "Mission Viejo", region: "South OC", currentActives: 156, demand30Days: 71, marketTimeDays: 66, marketTime2WeeksAgo: 56, marketTime4WeeksAgo: 60, marketTime1YearAgo: 68, marketTime2YearsAgo: 48, medianActiveListPrice: "$1.1m" },
  { city: "Newport Beach", region: "Coastal", currentActives: 254, demand30Days: 50, marketTimeDays: 152, marketTime2WeeksAgo: 163, marketTime4WeeksAgo: 195, marketTime1YearAgo: 143, marketTime2YearsAgo: 157, medianActiveListPrice: "$4.8m" },
  { city: "Newport Coast", region: "Coastal", currentActives: 45, demand30Days: 8, marketTimeDays: 169, marketTime2WeeksAgo: 201, marketTime4WeeksAgo: 210, marketTime1YearAgo: 170, marketTime2YearsAgo: 184, medianActiveListPrice: "$12.5m" },
  { city: "North Tustin", region: "Central OC", currentActives: 23, demand30Days: 10, marketTimeDays: 69, marketTime2WeeksAgo: 45, marketTime4WeeksAgo: 44, marketTime1YearAgo: 107, marketTime2YearsAgo: 105, medianActiveListPrice: "$2.8m" },
  { city: "Orange", region: "Central OC", currentActives: 151, demand30Days: 55, marketTimeDays: 82, marketTime2WeeksAgo: 72, marketTime4WeeksAgo: 75, marketTime1YearAgo: 66, marketTime2YearsAgo: 47, medianActiveListPrice: "$1.2m" },
  { city: "Placentia", region: "North OC", currentActives: 61, demand30Days: 26, marketTimeDays: 70, marketTime2WeeksAgo: 68, marketTime4WeeksAgo: 160, marketTime1YearAgo: 63, marketTime2YearsAgo: 67, medianActiveListPrice: "$899k" },
  { city: "Portola Hills", region: "South OC", currentActives: 28, demand30Days: 6, marketTimeDays: 140, marketTime2WeeksAgo: 145, marketTime4WeeksAgo: 218, marketTime1YearAgo: 64, marketTime2YearsAgo: 68, medianActiveListPrice: "$1.9m" },
  { city: "Rancho Mission Viejo", region: "South OC", currentActives: 99, demand30Days: 18, marketTimeDays: 165, marketTime2WeeksAgo: 233, marketTime4WeeksAgo: 162, marketTime1YearAgo: 77, marketTime2YearsAgo: 82, medianActiveListPrice: "$1.1m" },
  { city: "Rancho Santa Margarita", region: "South OC", currentActives: 76, demand30Days: 22, marketTimeDays: 104, marketTime2WeeksAgo: 79, marketTime4WeeksAgo: 56, marketTime1YearAgo: 80, marketTime2YearsAgo: 33, medianActiveListPrice: "$857k" },
  { city: "Rossmoor", region: "North OC", currentActives: 6, demand30Days: 5, marketTimeDays: 36, marketTime2WeeksAgo: 68, marketTime4WeeksAgo: 90, marketTime1YearAgo: 240, marketTime2YearsAgo: 42, medianActiveListPrice: "$1.9m" },
  { city: "San Clemente", region: "Coastal", currentActives: 116, demand30Days: 48, marketTimeDays: 73, marketTime2WeeksAgo: 66, marketTime4WeeksAgo: 83, marketTime1YearAgo: 94, marketTime2YearsAgo: 102, medianActiveListPrice: "$2.1m" },
  { city: "San Juan Capistrano", region: "South OC", currentActives: 70, demand30Days: 30, marketTimeDays: 70, marketTime2WeeksAgo: 102, marketTime4WeeksAgo: 127, marketTime1YearAgo: 123, marketTime2YearsAgo: 84, medianActiveListPrice: "$1.7m" },
  { city: "Santa Ana", region: "Central OC", currentActives: 229, demand30Days: 67, marketTimeDays: 103, marketTime2WeeksAgo: 113, marketTime4WeeksAgo: 109, marketTime1YearAgo: 63, marketTime2YearsAgo: 61, medianActiveListPrice: "$850k" },
  { city: "Seal Beach", region: "Coastal", currentActives: 90, demand30Days: 47, marketTimeDays: 57, marketTime2WeeksAgo: 53, marketTime4WeeksAgo: 70, marketTime1YearAgo: 41, marketTime2YearsAgo: 58, medianActiveListPrice: "$434k" },
  { city: "Stanton", region: "Central OC", currentActives: 28, demand30Days: 5, marketTimeDays: 168, marketTime2WeeksAgo: 55, marketTime4WeeksAgo: 90, marketTime1YearAgo: 58, marketTime2YearsAgo: 26, medianActiveListPrice: "$658k" },
  { city: "Talega", region: "Coastal", currentActives: 27, demand30Days: 14, marketTimeDays: 58, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 97, marketTime1YearAgo: 162, marketTime2YearsAgo: 188, medianActiveListPrice: "$2.1m" },
  { city: "Tustin", region: "Central OC", currentActives: 108, demand30Days: 32, marketTimeDays: 101, marketTime2WeeksAgo: 105, marketTime4WeeksAgo: 92, marketTime1YearAgo: 90, marketTime2YearsAgo: 46, medianActiveListPrice: "$1.1m" },
  { city: "Villa Park", region: "Central OC", currentActives: 15, demand30Days: 5, marketTimeDays: 90, marketTime2WeeksAgo: 150, marketTime4WeeksAgo: 68, marketTime1YearAgo: 143, marketTime2YearsAgo: 102, medianActiveListPrice: "$3.3m" },
  { city: "Westminster", region: "Central OC", currentActives: 47, demand30Days: 19, marketTimeDays: 74, marketTime2WeeksAgo: 69, marketTime4WeeksAgo: 83, marketTime1YearAgo: 108, marketTime2YearsAgo: 100, medianActiveListPrice: "$1.2m" },
  { city: "Yorba Linda", region: "North OC", currentActives: 134, demand30Days: 58, marketTimeDays: 69, marketTime2WeeksAgo: 86, marketTime4WeeksAgo: 87, marketTime1YearAgo: 84, marketTime2YearsAgo: 42, medianActiveListPrice: "$1.6m" },
];

// -----------------------------------------------------------------------------
// PAGE 11: PRICE RANGE REPORT (August 17, 2026 Data)
// -----------------------------------------------------------------------------
export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "All of O.C.", currentActives: 5054, demand30Days: 1535, marketTimeDays: 99, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 102, marketTime1YearAgo: 91, marketTime2YearsAgo: 66, medianActivePrice: "$1.3m" },
  { priceRange: "$0-$500k", currentActives: 413, demand30Days: 124, marketTimeDays: 100, marketTime2WeeksAgo: 126, marketTime4WeeksAgo: 112, marketTime1YearAgo: 55, marketTime2YearsAgo: 54, medianActivePrice: "$408k" },
  { priceRange: "$500k-$750k", currentActives: 666, demand30Days: 204, marketTimeDays: 98, marketTime2WeeksAgo: 83, marketTime4WeeksAgo: 88, marketTime1YearAgo: 73, marketTime2YearsAgo: 46, medianActivePrice: "$635k" },
  { priceRange: "$750k-$1m", currentActives: 759, demand30Days: 276, marketTimeDays: 83, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 80, marketTime1YearAgo: 67, marketTime2YearsAgo: 40, medianActivePrice: "$889k" },
  { priceRange: "$1m-$1.25m", currentActives: 612, demand30Days: 215, marketTimeDays: 85, marketTime2WeeksAgo: 83, marketTime4WeeksAgo: 78, marketTime1YearAgo: 65, marketTime2YearsAgo: 42, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 580, demand30Days: 212, marketTimeDays: 82, marketTime2WeeksAgo: 79, marketTime4WeeksAgo: 81, marketTime1YearAgo: 78, marketTime2YearsAgo: 55, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 683, demand30Days: 213, marketTimeDays: 96, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 110, marketTime1YearAgo: 99, marketTime2YearsAgo: 76, medianActivePrice: "$1.8m" },
  { priceRange: "$2m-$2.5m", currentActives: 322, demand30Days: 94, marketTimeDays: 103, marketTime2WeeksAgo: 132, marketTime4WeeksAgo: 129, marketTime1YearAgo: 155, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 482, demand30Days: 130, marketTimeDays: 111, marketTime2WeeksAgo: 148, marketTime4WeeksAgo: 151, marketTime1YearAgo: 180, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 241, demand30Days: 43, marketTimeDays: 168, marketTime2WeeksAgo: 188, marketTime4WeeksAgo: 191, marketTime1YearAgo: 202, marketTime2YearsAgo: 194, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 296, demand30Days: 24, marketTimeDays: 370, marketTime2WeeksAgo: 276, marketTime4WeeksAgo: 341, marketTime1YearAgo: 321, marketTime2YearsAgo: 527, medianActivePrice: "$10.4m" },
];

export const OC_PRICE_RANGE_REPORT_ATTACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Attached", currentActives: 2270, demand30Days: 578, marketTimeDays: 118, marketTime2WeeksAgo: 114, marketTime4WeeksAgo: 112, marketTime1YearAgo: 85, marketTime2YearsAgo: 58, medianActivePrice: "$799k" },
  { priceRange: "$0-$500k", currentActives: 400, demand30Days: 123, marketTimeDays: 98, marketTime2WeeksAgo: 126, marketTime4WeeksAgo: 112, marketTime1YearAgo: 55, marketTime2YearsAgo: 52, medianActivePrice: "$404k" },
  { priceRange: "$500k-$750k", currentActives: 642, demand30Days: 181, marketTimeDays: 106, marketTime2WeeksAgo: 86, marketTime4WeeksAgo: 92, marketTime1YearAgo: 78, marketTime2YearsAgo: 46, medianActivePrice: "$632k" },
  { priceRange: "$750k-$1m", currentActives: 530, demand30Days: 146, marketTimeDays: 109, marketTime2WeeksAgo: 110, marketTime4WeeksAgo: 99, marketTime1YearAgo: 89, marketTime2YearsAgo: 49, medianActivePrice: "$875k" },
  { priceRange: "$1m-$2m", currentActives: 556, demand30Days: 99, marketTimeDays: 168, marketTime2WeeksAgo: 149, marketTime4WeeksAgo: 144, marketTime1YearAgo: 109, marketTime2YearsAgo: 71, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 142, demand30Days: 29, marketTimeDays: 147, marketTime2WeeksAgo: 176, marketTime4WeeksAgo: 253, marketTime1YearAgo: 152, marketTime2YearsAgo: 166, medianActivePrice: "$3.2m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: 2784, demand30Days: 957, marketTimeDays: 87, marketTime2WeeksAgo: 93, marketTime4WeeksAgo: 96, marketTime1YearAgo: 95, marketTime2YearsAgo: 71, medianActivePrice: "$1.8m" },
  { priceRange: "$0-$750k", currentActives: 37, demand30Days: 24, marketTimeDays: 46, marketTime2WeeksAgo: 62, marketTime4WeeksAgo: 50, marketTime1YearAgo: 45, marketTime2YearsAgo: 71, medianActivePrice: "$588k" },
  { priceRange: "$750k-$1m", currentActives: 229, demand30Days: 130, marketTimeDays: 53, marketTime2WeeksAgo: 51, marketTime4WeeksAgo: 55, marketTime1YearAgo: 48, marketTime2YearsAgo: 33, medianActivePrice: "$924k" },
  { priceRange: "$1m-$1.25m", currentActives: 336, demand30Days: 162, marketTimeDays: 62, marketTime2WeeksAgo: 61, marketTime4WeeksAgo: 60, marketTime1YearAgo: 54, marketTime2YearsAgo: 36, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 413, demand30Days: 186, marketTimeDays: 67, marketTime2WeeksAgo: 68, marketTime4WeeksAgo: 68, marketTime1YearAgo: 67, marketTime2YearsAgo: 50, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 570, demand30Days: 193, marketTimeDays: 89, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 101, marketTime1YearAgo: 97, marketTime2YearsAgo: 73, medianActivePrice: "$1.8m" },
  { priceRange: "$2m-$2.5m", currentActives: 280, demand30Days: 86, marketTimeDays: 98, marketTime2WeeksAgo: 125, marketTime4WeeksAgo: 120, marketTime1YearAgo: 154, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 424, demand30Days: 115, marketTimeDays: 111, marketTime2WeeksAgo: 143, marketTime4WeeksAgo: 143, marketTime1YearAgo: 186, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 213, demand30Days: 37, marketTimeDays: 173, marketTime2WeeksAgo: 212, marketTime4WeeksAgo: 188, marketTime1YearAgo: 222, marketTime2YearsAgo: 190, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 282, demand30Days: 24, marketTimeDays: 353, marketTime2WeeksAgo: 272, marketTime4WeeksAgo: 334, marketTime1YearAgo: 315, marketTime2YearsAgo: 535, medianActivePrice: "$10.8m" },
];

// -----------------------------------------------------------------------------
// PAGE 12: SOLD REPORT (July 2026 Resales)
// -----------------------------------------------------------------------------
const RAW_SOLD_REPORT: Omit<OCSoldReportEntry, 'unitsSold2026' | 'unitsSold2025'>[] = [
  { city: "Aliso Viejo", unitsSoldJuly2026: 31, medianSalesPrice: "$940,000", medianListPrice: "$949,900", salesToListRatio: "100.0%", lowPrice: "$490,000", highPrice: "$2,140,000", medianSqFt: 1500, medianPricePerSqFt: "$627", medianDOM: 13, unitsSoldJuly2025: 28 },
  { city: "Anaheim", unitsSoldJuly2026: 85, medianSalesPrice: "$932,000", medianListPrice: "$935,000", salesToListRatio: "100.0%", lowPrice: "$205,000", highPrice: "$1,480,000", medianSqFt: 1482, medianPricePerSqFt: "$629", medianDOM: 13, unitsSoldJuly2025: 91 },
  { city: "Anaheim Hills", unitsSoldJuly2026: 18, medianSalesPrice: "$1,405,000", medianListPrice: "$1,378,500", salesToListRatio: "100.0%", lowPrice: "$810,000", highPrice: "$3,250,000", medianSqFt: 2367, medianPricePerSqFt: "$594", medianDOM: 21, unitsSoldJuly2025: 20 },
  { city: "Brea", unitsSoldJuly2026: 31, medianSalesPrice: "$1,265,000", medianListPrice: "$1,289,000", salesToListRatio: "100.0%", lowPrice: "$560,000", highPrice: "$2,688,000", medianSqFt: 2159, medianPricePerSqFt: "$586", medianDOM: 11, unitsSoldJuly2025: 35 },
  { city: "Buena Park", unitsSoldJuly2026: 33, medianSalesPrice: "$905,000", medianListPrice: "$915,000", salesToListRatio: "98.8%", lowPrice: "$635,000", highPrice: "$1,700,000", medianSqFt: 1497, medianPricePerSqFt: "$605", medianDOM: 13, unitsSoldJuly2025: 36 },
  { city: "Corona Del Mar", unitsSoldJuly2026: 24, medianSalesPrice: "$3,637,500", medianListPrice: "$3,550,000", salesToListRatio: "98.1%", lowPrice: "$1,895,000", highPrice: "$48,500,000", medianSqFt: 2056, medianPricePerSqFt: "$1,770", medianDOM: 39, unitsSoldJuly2025: 14 },
  { city: "Costa Mesa", unitsSoldJuly2026: 51, medianSalesPrice: "$1,595,000", medianListPrice: "$1,600,000", salesToListRatio: "98.9%", lowPrice: "$631,250", highPrice: "$4,000,000", medianSqFt: 1647, medianPricePerSqFt: "$968", medianDOM: 13, unitsSoldJuly2025: 67 },
  { city: "Coto De Caza", unitsSoldJuly2026: 19, medianSalesPrice: "$2,375,000", medianListPrice: "$2,490,000", salesToListRatio: "97.9%", lowPrice: "$1,350,000", highPrice: "$5,875,000", medianSqFt: 3736, medianPricePerSqFt: "$636", medianDOM: 43, unitsSoldJuly2025: 16 },
  { city: "Cypress", unitsSoldJuly2026: 28, medianSalesPrice: "$1,050,000", medianListPrice: "$1,049,944", salesToListRatio: "100.0%", lowPrice: "$508,000", highPrice: "$2,025,000", medianSqFt: 1587, medianPricePerSqFt: "$662", medianDOM: 12, unitsSoldJuly2025: 31 },
  { city: "Dana Point", unitsSoldJuly2026: 44, medianSalesPrice: "$1,810,000", medianListPrice: "$1,797,500", salesToListRatio: "99.5%", lowPrice: "$530,000", highPrice: "$13,250,000", medianSqFt: 1558, medianPricePerSqFt: "$1,162", medianDOM: 28, unitsSoldJuly2025: 34 },
  { city: "Dove Canyon", unitsSoldJuly2026: 7, medianSalesPrice: "$1,705,000", medianListPrice: "$1,749,000", salesToListRatio: "99.2%", lowPrice: "$1,375,000", highPrice: "$1,935,000", medianSqFt: 3137, medianPricePerSqFt: "$544", medianDOM: 42, unitsSoldJuly2025: 3 },
  { city: "Foothill Ranch", unitsSoldJuly2026: 9, medianSalesPrice: "$1,229,000", medianListPrice: "$1,229,000", salesToListRatio: "100.1%", lowPrice: "$665,000", highPrice: "$1,665,000", medianSqFt: 1689, medianPricePerSqFt: "$728", medianDOM: 11, unitsSoldJuly2025: 8 },
  { city: "Fountain Valley", unitsSoldJuly2026: 32, medianSalesPrice: "$1,454,500", medianListPrice: "$1,437,000", salesToListRatio: "100.0%", lowPrice: "$410,000", highPrice: "$2,500,000", medianSqFt: 1908, medianPricePerSqFt: "$763", medianDOM: 9, unitsSoldJuly2025: 25 },
  { city: "Fullerton", unitsSoldJuly2026: 76, medianSalesPrice: "$1,105,000", medianListPrice: "$1,039,500", salesToListRatio: "100.4%", lowPrice: "$226,000", highPrice: "$2,995,000", medianSqFt: 1689, medianPricePerSqFt: "$654", medianDOM: 14, unitsSoldJuly2025: 64 },
  { city: "Garden Grove", unitsSoldJuly2026: 60, medianSalesPrice: "$1,000,000", medianListPrice: "$999,999", salesToListRatio: "100.0%", lowPrice: "$480,000", highPrice: "$1,900,000", medianSqFt: 1434, medianPricePerSqFt: "$697", medianDOM: 11, unitsSoldJuly2025: 53 },
  { city: "Huntington Beach", unitsSoldJuly2026: 138, medianSalesPrice: "$1,294,000", medianListPrice: "$1,292,000", salesToListRatio: "100.0%", lowPrice: "$405,000", highPrice: "$7,200,000", medianSqFt: 1550, medianPricePerSqFt: "$835", medianDOM: 21, unitsSoldJuly2025: 147 },
  { city: "Irvine", unitsSoldJuly2026: 197, medianSalesPrice: "$1,380,000", medianListPrice: "$1,450,000", salesToListRatio: "97.7%", lowPrice: "$390,000", highPrice: "$11,250,000", medianSqFt: 1878, medianPricePerSqFt: "$735", medianDOM: 34, unitsSoldJuly2025: 164 },
  { city: "La Habra", unitsSoldJuly2026: 40, medianSalesPrice: "$850,000", medianListPrice: "$828,475", salesToListRatio: "100.0%", lowPrice: "$435,000", highPrice: "$2,000,000", medianSqFt: 1437, medianPricePerSqFt: "$592", medianDOM: 22, unitsSoldJuly2025: 34 },
  { city: "La Palma", unitsSoldJuly2026: 6, medianSalesPrice: "$1,258,000", medianListPrice: "$1,237,500", salesToListRatio: "101.7%", lowPrice: "$670,000", highPrice: "$1,350,000", medianSqFt: 2161, medianPricePerSqFt: "$582", medianDOM: 8, unitsSoldJuly2025: 7 },
  { city: "Ladera Ranch", unitsSoldJuly2026: 22, medianSalesPrice: "$1,413,750", medianListPrice: "$1,399,900", salesToListRatio: "100.0%", lowPrice: "$750,000", highPrice: "$4,525,000", medianSqFt: 2062, medianPricePerSqFt: "$686", medianDOM: 19, unitsSoldJuly2025: 21 },
  { city: "Laguna Beach", unitsSoldJuly2026: 31, medianSalesPrice: "$3,350,000", medianListPrice: "$3,350,000", salesToListRatio: "95.7%", lowPrice: "$1,295,000", highPrice: "$15,000,000", medianSqFt: 1988, medianPricePerSqFt: "$1,685", medianDOM: 30, unitsSoldJuly2025: 28 },
  { city: "Laguna Hills", unitsSoldJuly2026: 27, medianSalesPrice: "$1,550,000", medianListPrice: "$1,499,900", salesToListRatio: "98.9%", lowPrice: "$562,500", highPrice: "$8,550,000", medianSqFt: 2865, medianPricePerSqFt: "$541", medianDOM: 18, unitsSoldJuly2025: 26 },
  { city: "Laguna Niguel", unitsSoldJuly2026: 72, medianSalesPrice: "$1,387,500", medianListPrice: "$1,450,000", salesToListRatio: "100.0%", lowPrice: "$455,000", highPrice: "$3,025,000", medianSqFt: 1849, medianPricePerSqFt: "$751", medianDOM: 17, unitsSoldJuly2025: 65 },
  { city: "Laguna Woods", unitsSoldJuly2026: 50, medianSalesPrice: "$450,000", medianListPrice: "$459,500", salesToListRatio: "97.9%", lowPrice: "$190,000", highPrice: "$1,750,000", medianSqFt: 1035, medianPricePerSqFt: "$435", medianDOM: 27, unitsSoldJuly2025: 63 },
  { city: "Lake Forest", unitsSoldJuly2026: 59, medianSalesPrice: "$1,229,000", medianListPrice: "$1,229,000", salesToListRatio: "99.7%", lowPrice: "$440,000", highPrice: "$3,260,000", medianSqFt: 1715, medianPricePerSqFt: "$717", medianDOM: 12, unitsSoldJuly2025: 45 },
  { city: "Los Alamitos", unitsSoldJuly2026: 9, medianSalesPrice: "$1,245,000", medianListPrice: "$1,300,000", salesToListRatio: "98.4%", lowPrice: "$610,000", highPrice: "$2,200,000", medianSqFt: 1921, medianPricePerSqFt: "$648", medianDOM: 13, unitsSoldJuly2025: 12 },
  { city: "Mission Viejo", unitsSoldJuly2026: 89, medianSalesPrice: "$1,230,025", medianListPrice: "$1,229,999", salesToListRatio: "100.0%", lowPrice: "$325,000", highPrice: "$2,220,000", medianSqFt: 1640, medianPricePerSqFt: "$750", medianDOM: 17, unitsSoldJuly2025: 102 },
  { city: "Newport Beach", unitsSoldJuly2026: 62, medianSalesPrice: "$3,948,150", medianListPrice: "$4,060,000", salesToListRatio: "97.2%", lowPrice: "$845,000", highPrice: "$15,500,000", medianSqFt: 2556, medianPricePerSqFt: "$1,545", medianDOM: 40, unitsSoldJuly2025: 61 },
  { city: "Newport Coast", unitsSoldJuly2026: 10, medianSalesPrice: "$9,750,000", medianListPrice: "$9,945,000", salesToListRatio: "94.9%", lowPrice: "$3,700,000", highPrice: "$30,100,000", medianSqFt: 4489, medianPricePerSqFt: "$2,172", medianDOM: 22, unitsSoldJuly2025: 9 },
  { city: "North Tustin", unitsSoldJuly2026: 20, medianSalesPrice: "$2,299,500", medianListPrice: "$2,282,000", salesToListRatio: "99.7%", lowPrice: "$1,372,000", highPrice: "$3,900,000", medianSqFt: 3054, medianPricePerSqFt: "$753", medianDOM: 21, unitsSoldJuly2025: 17 },
  { city: "Orange", unitsSoldJuly2026: 79, medianSalesPrice: "$1,180,000", medianListPrice: "$1,160,000", salesToListRatio: "99.4%", lowPrice: "$210,000", highPrice: "$3,450,000", medianSqFt: 1789, medianPricePerSqFt: "$660", medianDOM: 17, unitsSoldJuly2025: 78 },
  { city: "Placentia", unitsSoldJuly2026: 25, medianSalesPrice: "$1,100,000", medianListPrice: "$1,099,000", salesToListRatio: "100.0%", lowPrice: "$444,500", highPrice: "$1,900,000", medianSqFt: 1750, medianPricePerSqFt: "$629", medianDOM: 13, unitsSoldJuly2025: 34 },
  { city: "Portola Hills", unitsSoldJuly2026: 4, medianSalesPrice: "$1,350,000", medianListPrice: "$1,384,450", salesToListRatio: "99.5%", lowPrice: "$780,000", highPrice: "$2,498,600", medianSqFt: 2638, medianPricePerSqFt: "$512", medianDOM: 8, unitsSoldJuly2025: 8 },
  { city: "Rancho Mission Viejo", unitsSoldJuly2026: 26, medianSalesPrice: "$1,114,000", medianListPrice: "$1,139,000", salesToListRatio: "99.2%", lowPrice: "$545,000", highPrice: "$2,050,000", medianSqFt: 1796, medianPricePerSqFt: "$620", medianDOM: 28, unitsSoldJuly2025: 26 },
  { city: "Rancho Santa Margarita", unitsSoldJuly2026: 39, medianSalesPrice: "$715,000", medianListPrice: "$719,800", salesToListRatio: "99.2%", lowPrice: "$390,000", highPrice: "$1,950,000", medianSqFt: 1170, medianPricePerSqFt: "$611", medianDOM: 12, unitsSoldJuly2025: 34 },
  { city: "Rossmoor", unitsSoldJuly2026: 4, medianSalesPrice: "$1,742,500", medianListPrice: "$1,747,000", salesToListRatio: "97.5%", lowPrice: "$1,600,000", highPrice: "$2,000,000", medianSqFt: 2201, medianPricePerSqFt: "$792", medianDOM: 15, unitsSoldJuly2025: 7 },
  { city: "San Clemente", unitsSoldJuly2026: 70, medianSalesPrice: "$1,702,500", medianListPrice: "$1,697,000", salesToListRatio: "99.3%", lowPrice: "$515,000", highPrice: "$5,175,000", medianSqFt: 1978, medianPricePerSqFt: "$861", medianDOM: 10, unitsSoldJuly2025: 55 },
  { city: "San Juan Capistrano", unitsSoldJuly2026: 28, medianSalesPrice: "$1,412,500", medianListPrice: "$1,424,500", salesToListRatio: "98.4%", lowPrice: "$417,500", highPrice: "$8,900,000", medianSqFt: 1870, medianPricePerSqFt: "$755", medianDOM: 25, unitsSoldJuly2025: 35 },
  { city: "Santa Ana", unitsSoldJuly2026: 74, medianSalesPrice: "$870,000", medianListPrice: "$866,900", salesToListRatio: "100.0%", lowPrice: "$215,000", highPrice: "$3,129,000", medianSqFt: 1361, medianPricePerSqFt: "$639", medianDOM: 13, unitsSoldJuly2025: 89 },
  { city: "Seal Beach", unitsSoldJuly2026: 44, medianSalesPrice: "$417,500", medianListPrice: "$427,000", salesToListRatio: "98.3%", lowPrice: "$215,000", highPrice: "$3,050,000", medianSqFt: 976, medianPricePerSqFt: "$428", medianDOM: 36, unitsSoldJuly2025: 55 },
  { city: "Stanton", unitsSoldJuly2026: 11, medianSalesPrice: "$821,000", medianListPrice: "$798,888", salesToListRatio: "101.6%", lowPrice: "$387,500", highPrice: "$1,052,000", medianSqFt: 1203, medianPricePerSqFt: "$682", medianDOM: 57, unitsSoldJuly2025: 10 },
  { city: "Talega", unitsSoldJuly2026: 16, medianSalesPrice: "$1,745,000", medianListPrice: "$1,749,000", salesToListRatio: "100.0%", lowPrice: "$1,075,000", highPrice: "$5,175,000", medianSqFt: 2252, medianPricePerSqFt: "$775", medianDOM: 10, unitsSoldJuly2025: 7 },
  { city: "Tustin", unitsSoldJuly2026: 45, medianSalesPrice: "$1,138,000", medianListPrice: "$1,149,000", salesToListRatio: "99.4%", lowPrice: "$509,000", highPrice: "$2,075,000", medianSqFt: 1501, medianPricePerSqFt: "$758", medianDOM: 20, unitsSoldJuly2025: 41 },
  { city: "Villa Park", unitsSoldJuly2026: 5, medianSalesPrice: "$2,850,000", medianListPrice: "$2,850,000", salesToListRatio: "97.8%", lowPrice: "$2,400,000", highPrice: "$3,050,000", medianSqFt: 3414, medianPricePerSqFt: "$835", medianDOM: 19, unitsSoldJuly2025: 5 },
  { city: "Westminster", unitsSoldJuly2026: 19, medianSalesPrice: "$1,157,000", medianListPrice: "$1,099,000", salesToListRatio: "101.0%", lowPrice: "$730,000", highPrice: "$1,425,000", medianSqFt: 1481, medianPricePerSqFt: "$781", medianDOM: 12, unitsSoldJuly2025: 33 },
  { city: "Yorba Linda", unitsSoldJuly2026: 61, medianSalesPrice: "$1,307,500", medianListPrice: "$1,300,000", salesToListRatio: "100.0%", lowPrice: "$340,000", highPrice: "$3,750,000", medianSqFt: 2176, medianPricePerSqFt: "$601", medianDOM: 18, unitsSoldJuly2025: 61 },
  { city: "All of O.C.", unitsSoldJuly2026: 1930, medianSalesPrice: "$1,220,000", medianListPrice: "$1,211,900", salesToListRatio: "99.5%", lowPrice: "$190,000", highPrice: "$48,500,000", medianSqFt: 1701, medianPricePerSqFt: "$717", medianDOM: 19, unitsSoldJuly2025: 1934 }
];

export const OC_SOLD_REPORT: OCSoldReportEntry[] = RAW_SOLD_REPORT.map(item => ({
  ...item,
  unitsSold2026: item.unitsSoldJuly2026,
  unitsSold2025: item.unitsSoldJuly2025,
}));

// Backwards-compatible summary bullets for legacy widgets
export interface OCHousingSummaryBullet {
  title: string;
  stat: string;
  trend: string;
  description: string;
}

export const OC_HOUSING_SUMMARY_BULLETS: OCHousingSummaryBullet[] = [
  {
    title: "Active Listings",
    stat: "5,054 Homes",
    trend: "+8 in 2 wks (+0.2%)",
    description: "Active inventory is plateauing as summer transitions into Autumn. Inventory is virtually level with last year (-1% vs 2025's 5,011 homes)."
  },
  {
    title: "Buyer Demand",
    stat: "1,535 Escrows",
    trend: "+41 in 2 wks (+3%)",
    description: "30-day pending sales rose by 3%, the largest bi-weekly increase since early May. Demand is 8% lower than 2025 (1,652 escrows)."
  },
  {
    title: "Expected Market Time",
    stat: "99 Days",
    trend: "-2 days vs 2 wks ago",
    description: "Market speed dropped from 101 to 99 days, in a balanced market. Single-family detached is at 87 days while condos are at 118 days."
  },
  {
    title: "Luxury End ($2.5M+)",
    stat: "155 Days",
    trend: "-26 days vs 2 wks ago",
    description: "Luxury demand surged +13% while active supply fell 3%, dropping luxury market time down from 181 to 155 days (211 days last year)."
  },
  {
    title: "July Closed Sales",
    stat: "1,930 Units",
    trend: "Nearly identical YoY",
    description: "1,930 sales closed in July 2026 compared to 1,934 in July 2025. Median sales price is $1.22M with a 99.5% sales-to-list ratio."
  },
  {
    title: "Distressed Properties",
    stat: "9 Homes (0.2%)",
    trend: "Historical Low",
    description: "Only 4 foreclosures and 5 short sales countywide, accounting for just 0.2% of active supply and 0.7% of demand."
  }
];

export const OC_SITTING_ON_MARKET_REPORT = OC_MARKET_TIME_REPORT;


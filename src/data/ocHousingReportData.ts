// Orange County Housing Report Data - Steven Thomas (Reports On Housing)
// August 31, 2026 - "Falling Into Autumn"
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
  unitsSoldAugust2026?: number;
  unitsSoldJuly2026?: number;
  unitsSold2026: number;
  medianSalesPrice: string;
  medianListPrice: string;
  salesToListRatio: string;
  lowPrice: string;
  highPrice: string;
  medianSqFt: number;
  medianPricePerSqFt: string;
  medianDOM: number;
  unitsSoldAugust2025?: number;
  unitsSoldJuly2025?: number;
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
  reportDate: "August 31, 2026",
  coverDate: "August 31, 2026",
  author: "Steven Thomas",
  publisher: "Reports On Housing",
  title: "Falling Into Autumn",
  subtitle: "Housing's seasonal shift is underway, as the autumn market ushers in a distinctly different pace from the rest of the year.",
  
  // Page 9 Core Summary Totals
  countywideActives: 4982,
  countywideActivesLastYear: 4869,

  countywideDemand: 1528,
  countywideDemandLastYear: 1559,

  countywideMarketTime: 98,
  countywideMarketTime2WksAgo: 99,
  countywideMarketTimeLastYear: 94,

  detachedMarketTime: 90,
  detachedMarketTime2WksAgo: 87,
  detachedMarketTimeLastYear: 95,
  detachedActives: 2750,
  detachedDemand: 916,

  attachedMarketTime: 109,
  attachedMarketTime2WksAgo: 118,
  attachedMarketTimeLastYear: 91,
  attachedActives: 2232,
  attachedDemand: 612,

  luxuryMarketTime: 144,
  luxuryMarketTime2WksAgo: 155,
  luxuryMarketTimeLastYear: 248,
  luxuryActives: 995,
  luxuryDemand: 208,

  closedSalesAugust2026: 1994,
  closedSalesResales: 1994,
  closedSalesAugust2025: 1828,
  medianSalesPriceAugust2026: "$1,256,412",
  closedSalesJuly2026: 1994,
  closedSalesJuly2025: 1828,
  medianSalesPriceJuly2026: "$1,256,412",
  countywideMedianPrice: "$1,256,412",
  medianListPriceJuly2026: "$1,257,500",
  salesToListRatioJuly2026: "99.9%",
  salesToListRatio: "99.9%",
  equitySalesPercentage: "99.9%",

  distressedActiveHomes: 11,
  distressedForeclosures: 4,
  distressedShortSales: 7,
  distressedListingsPct: "0.2%",
  distressedDemandPct: "0.5%",
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
    currentStat: "4,982 Homes",
    currentValue: 4982,
    unit: "Active Listings",
    trend2Weeks: "-72 homes (-1%) in 2 weeks",
    isTrendPositive: true,
    compLastYear: "4,869 homes (+2% YoY / 113 more)",
    summary: "The active listing inventory decreased by 72 homes over the past two weeks, falling from 5,054 to 4,982 (-1%). Inventory appears to have peaked in mid-August. Last year, inventory stood at 4,869 homes (113 fewer homes, -2%).",
    keyTakeaways: [
      "Active inventory dropped by 72 homes (-1%) to 4,982, likely passing its summer peak.",
      "Up +2% (113 more homes) compared to last year's 4,869 listings.",
      "Pre-COVID 3-year average was 6,569 homes (+1,587 homes, or 32% more).",
      "18,948 homes placed on the market through July, 27% fewer than pre-COVID norms."
    ],
    category: "supply"
  },
  {
    id: "demand",
    title: "Buyer Demand",
    shortTitle: "Demand",
    currentStat: "1,528 Escrows",
    currentValue: 1528,
    unit: "30-Day Pending Sales",
    trend2Weeks: "-7 escrows (-0.5%) in 2 weeks",
    isTrendPositive: true,
    compLastYear: "1,559 escrows (-2% YoY / 31 fewer)",
    summary: "Demand, the snapshot of new pending sales over the prior month, decreased from 1,535 to 1,528 in the past couple of weeks, down seven pending sales, nearly unchanged. Last year, demand was 1,559 pending sales (+2%).",
    keyTakeaways: [
      "Buyer demand held virtually flat at 1,528 pending sales (-7 in 2 weeks).",
      "Down 9% from the mid-May spring peak of 1,678 pending sales.",
      "Nearly identical to last year's 1,559 pending sales (-31 escrows, -2%).",
      "Pre-COVID 3-year average was 2,438 pending sales, 60% higher than today."
    ],
    category: "demand"
  },
  {
    id: "speed",
    title: "Expected Market Time",
    shortTitle: "Market Speed",
    currentStat: "98 Days",
    currentValue: 98,
    unit: "Days to Sell",
    trend2Weeks: "-1 day (down from 99d)",
    isTrendPositive: true,
    compLastYear: "94 days (similar pace)",
    summary: "With inventory falling by 72 homes and demand nearly unchanged, Expected Market Time decreased by 1 day from 99 to 98 days. The market remains in balanced territory, similar to last year's 94-day start to the Fall Market.",
    keyTakeaways: [
      "Countywide market speed improved by 1 day from 99 to 98 days.",
      "Attached Condos/Townhomes: 109 days (improved 9 days from 118d; 91d last year).",
      "Detached Single-Family: 90 days (up 3 days from 87d; 95d last year).",
      "Detached homes continue to sell significantly faster than attached properties."
    ],
    category: "speed"
  },
  {
    id: "luxury",
    title: "Luxury Market ($2.5M+)",
    shortTitle: "Luxury ($2.5M+)",
    currentStat: "144 Days",
    currentValue: 144,
    unit: "Days to Sell",
    trend2Weeks: "-11 days (improved from 155d)",
    isTrendPositive: true,
    compLastYear: "248 days (substantially slower)",
    summary: "Luxury inventory above $2.5M decreased from 1,019 to 995 (-2%), while luxury demand rose from 197 to 208 (+6%). Expected Market Time dropped to 144 days — its strongest reading of the year and lowest since February 2025.",
    keyTakeaways: [
      "Luxury Expected Market Time dropped from 155 to 144 days (strongest reading of 2026).",
      "Luxury demand rose +6% to 208 pending sales; luxury supply dropped -2% to 995.",
      "$2.5M–$4M bracket: 95 days (improved from 111d; 196d last year).",
      "$4M–$6M bracket: 185 days (up from 168d); $6M+: 352 days (down from 370d; 540d last year)."
    ],
    category: "luxury"
  },
  {
    id: "closed",
    title: "July 2026 Closed Sales",
    shortTitle: "Closed Sales",
    currentStat: "1,994 Sales",
    currentValue: 1994,
    unit: "July Closed Sales",
    trend2Weeks: "+9% vs July 2025",
    isTrendPositive: true,
    compLastYear: "1,828 sales (+9% YoY / 166 more)",
    summary: "There were 1,994 closed residential sales in July 2026 reported countywide in Steven Thomas's report, up +9% compared to 1,828 sales in July 2025. The sales-to-list price ratio stood at 99.9% with a countywide median sales price of $1,256,412.",
    keyTakeaways: [
      "1,994 residential sales closed in July 2026 (up +9% vs 1,828 in July 2025).",
      "Countywide median sales price: $1,256,412 ($717/sq ft).",
      "Sales-to-list price ratio captured: 99.9%.",
      "99.9% of all closed transactions were equity sales."
    ],
    category: "sales"
  },
  {
    id: "distressed",
    title: "Distressed Homes",
    shortTitle: "Distressed",
    currentStat: "11 Homes (0.2%)",
    currentValue: 11,
    unit: "Active Listings",
    trend2Weeks: "+2 homes (up from 9)",
    isTrendPositive: true,
    compLastYear: "7 distressed homes (similar)",
    summary: "Short sales and foreclosures combined comprised only 0.2% of all active listings and 0.5% of demand. There are currently only 4 foreclosures and 7 short sales available in the entire county, bringing the total of distressed homes to 11.",
    keyTakeaways: [
      "Total distressed active inventory: 11 homes (4 foreclosures, 7 short sales).",
      "Comprises only 0.2% of all active listings in Orange County.",
      "Accounts for only 0.5% of 30-day buyer demand.",
      "Virtually identical to last year (7 homes); foreclosure levels remain historically insignificant."
    ],
    category: "distressed"
  }
];

// -----------------------------------------------------------------------------
// PAGE 10: CITY MARKET TIME REPORT (August 31, 2026 Data)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// PAGE 11: PRICE RANGE REPORT (August 31, 2026 Data)
// -----------------------------------------------------------------------------
export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "All of O.C.", currentActives: 4982, demand30Days: 1528, marketTimeDays: 98, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 101, marketTime1YearAgo: 94, marketTime2YearsAgo: 73, medianActivePrice: "$1.3m" },
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
  { priceRange: "All Attached", currentActives: 2232, demand30Days: 612, marketTimeDays: 109, marketTime2WeeksAgo: 118, marketTime4WeeksAgo: 114, marketTime1YearAgo: 91, marketTime2YearsAgo: 62, medianActivePrice: "$790k" },
  { priceRange: "$0-$500k", currentActives: 392, demand30Days: 137, marketTimeDays: 86, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 126, marketTime1YearAgo: 60, marketTime2YearsAgo: 48, medianActivePrice: "$415k" },
  { priceRange: "$500k-$750k", currentActives: 659, demand30Days: 174, marketTimeDays: 114, marketTime2WeeksAgo: 106, marketTime4WeeksAgo: 86, marketTime1YearAgo: 81, marketTime2YearsAgo: 48, medianActivePrice: "$629k" },
  { priceRange: "$750k-$1m", currentActives: 510, demand30Days: 156, marketTimeDays: 98, marketTime2WeeksAgo: 109, marketTime4WeeksAgo: 110, marketTime1YearAgo: 97, marketTime2YearsAgo: 51, medianActivePrice: "$879k" },
  { priceRange: "$1m-$2m", currentActives: 539, demand30Days: 106, marketTimeDays: 153, marketTime2WeeksAgo: 168, marketTime4WeeksAgo: 149, marketTime1YearAgo: 117, marketTime2YearsAgo: 99, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 132, demand30Days: 39, marketTimeDays: 102, marketTime2WeeksAgo: 147, marketTime4WeeksAgo: 176, marketTime1YearAgo: 177, marketTime2YearsAgo: 151, medianActivePrice: "$3.1m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: 2750, demand30Days: 916, marketTimeDays: 90, marketTime2WeeksAgo: 87, marketTime4WeeksAgo: 93, marketTime1YearAgo: 95, marketTime2YearsAgo: 81, medianActivePrice: "$1.8m" },
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
  { city: "All of O.C.", unitsSoldJuly2026: 1994, unitsSoldAugust2026: 1994, medianSalesPrice: "$1,256,412", medianListPrice: "$1,257,500", salesToListRatio: "99.9%", lowPrice: "$190,000", highPrice: "$48,500,000", medianSqFt: 1753, medianPricePerSqFt: "$717", medianDOM: 19, unitsSoldJuly2025: 1828, unitsSoldAugust2025: 1828 }
];

export const OC_SOLD_REPORT: OCSoldReportEntry[] = RAW_SOLD_REPORT.map(item => ({
  ...item,
  unitsSoldAugust2026: (item as any).unitsSoldAugust2026 ?? item.unitsSoldJuly2026,
  unitsSoldAugust2025: (item as any).unitsSoldAugust2025 ?? item.unitsSoldJuly2025,
  unitsSold2026: (item as any).unitsSold2026 ?? item.unitsSoldJuly2026,
  unitsSold2025: (item as any).unitsSold2025 ?? item.unitsSoldJuly2025,
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
    stat: "4,982 Homes",
    trend: "-72 in 2 wks (-1%)",
    description: "Active inventory dipped 1% and has officially peaked for the year as summer transitions into Autumn. Inventory is +17% higher than last year (4,264 homes)."
  },
  {
    title: "Buyer Demand",
    stat: "1,528 Escrows",
    trend: "-7 in 2 wks (level)",
    description: "30-day pending sales remained virtually unchanged (-0.5%), pausing after recent gains. Demand is 3% lower than 2025 (1,570 escrows)."
  },
  {
    title: "Expected Market Time",
    stat: "98 Days",
    trend: "-1 day vs 2 wks ago",
    description: "Market speed eased down from 99 to 98 days, in a balanced market. Single-family detached is at 90 days while condos/attached are at 109 days."
  },
  {
    title: "Luxury End ($2.5M+)",
    stat: "150 Days",
    trend: "-5 days vs 2 wks ago",
    description: "Luxury demand ticked up slightly with active supply contracting, dropping luxury market time down from 155 to 150 days (235 days last year)."
  },
  {
    title: "July 2026 Closed Sales",
    stat: "1,994 Units",
    trend: "+9% vs July 2025",
    description: "1,994 sales closed in July 2026 compared to 1,828 in July 2025 (+9%). Median sales price is $1,256,412 with a 99.9% sales-to-list ratio."
  },
  {
    title: "Distressed Properties",
    stat: "8 Homes (0.2%)",
    trend: "Historical Low",
    description: "Only 3 foreclosures and 5 short sales countywide, accounting for just 0.2% of active supply and 0.5% of demand."
  }
];

export const OC_SITTING_ON_MARKET_REPORT = OC_MARKET_TIME_REPORT;


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
  marketTime2YearsAgo: number;
  medianActivePrice: string;
}

export interface OCSoldReportEntry {
  city: string;
  unitsSold2026: number;
  medianSalesPrice: string;
  medianListPrice: string;
  salesToListRatio: string;
  lowPrice: string;
  highPrice: string;
  medianSqFt: number;
  medianPricePerSqFt: string;
  medianDOM: number;
  unitsSold2025: number;
}

export interface OCSittingOnMarketEntry {
  priceRange: string;
  currentActives: number;
  actives30PlusDays: number;
  percent30PlusDays: string;
  actives60PlusDays: number;
  percent60PlusDays: string;
  marketTimeDays: number;
  offMarketYTD: number;
}

export const OC_HOUSING_REPORT_METADATA = {
  reportDate: "August 3, 2026",
  author: "Steven Thomas",
  publisher: "Reports On Housing",
  title: "The Condo Conundrum",
  subtitle: "The attached home market, condominiums and townhomes, is substantially slower than the detached home market, which is pushing prices lower.",
  countywideActives: 5046,
  countywideDemand: 1494,
  countywideMarketTime: 101,
  countywideMedianPrice: "$1,305,471",
  closedSalesResales: 1994,
  salesToListRatio: "99.9%",
};

export const OC_HOUSING_SUMMARY_BULLETS = [
  {
    title: "INVENTORY UPDATE",
    stat: "5,046 Active Homes",
    trend: "+1% (+26) in 2 Weeks",
    description: "Active listing inventory increased by 26 homes over the past two weeks to 5,046, its highest level since last July. Inventory remains nearly identical to last year's 5,071 active homes."
  },
  {
    title: "DEMAND TICK UP",
    stat: "1,494 Pending Sales",
    trend: "+1% (+22) in 2 Weeks",
    description: "Snapshot of new pending sales over the prior month increased from 1,472 to 1,494 (+1%). This represents the first rise in demand recorded since early May."
  },
  {
    title: "EXPECTED MARKET TIME",
    stat: "101 Days",
    trend: "-1 Day in 2 Weeks",
    description: "With supply rising 1% and demand rising 1%, Expected Market Time decreased slightly from 102 to 101 days. Last year at this time, Expected Market Time was 95 days."
  },
  {
    title: "THE CONDO CONUNDRUM",
    stat: "114 Days Attached vs 93 Days Detached",
    trend: "+21 Days Gap",
    description: "Attached inventory is up 17% YoY with 114 days market time and recent price drops (-0.3%). Detached inventory is down 11% YoY with 93 days market time and rising values (+1.9% YoY)."
  },
  {
    title: "LUXURY MARKET IMPROVED",
    stat: "181 Days ($2.5M+)",
    trend: "Down from 193 Days",
    description: "Luxury inventory ($2.5M+) held flat at 1,055 homes while luxury demand rose 7% to 175 pending sales. Expected Market Time for $6M+ estates dropped sharply from 341 to 276 days."
  },
  {
    title: "CLOSED RESALES (AUGUST REPORT)",
    stat: "1,994 Resales Closed",
    trend: "+9% vs Prior Year",
    description: "Closed resales totaled 1,994 homes (+9% YoY, +10% MoM) with a median sales price of $1,256,412. Sales-to-list price ratio stood at 99.9% with 99.7% of all sales having positive equity."
  }
];

export const OC_MARKET_TIME_REPORT: OCMarketTimeEntry[] = [
  { city: "Aliso Viejo", region: "South OC", currentActives: 82, demand30Days: 32, marketTimeDays: 77, marketTime2WeeksAgo: 152, marketTime4WeeksAgo: 81, marketTime1YearAgo: 89, marketTime2YearsAgo: 40, medianActiveListPrice: "$887k" },
  { city: "Anaheim", region: "North OC", currentActives: 269, demand30Days: 82, marketTimeDays: 98, marketTime2WeeksAgo: 93, marketTime4WeeksAgo: 92, marketTime1YearAgo: 89, marketTime2YearsAgo: 49, medianActiveListPrice: "$930k" },
  { city: "Anaheim Hills", region: "North OC", currentActives: 39, demand30Days: 16, marketTimeDays: 73, marketTime2WeeksAgo: 45, marketTime4WeeksAgo: 51, marketTime1YearAgo: 56, marketTime2YearsAgo: 39, medianActiveListPrice: "$1.5m" },
  { city: "Brea", region: "North OC", currentActives: 48, demand30Days: 24, marketTimeDays: 60, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 44, marketTime1YearAgo: 67, marketTime2YearsAgo: 35, medianActiveListPrice: "$1.2m" },
  { city: "Buena Park", region: "North OC", currentActives: 69, demand30Days: 26, marketTimeDays: 80, marketTime2WeeksAgo: 78, marketTime4WeeksAgo: 97, marketTime1YearAgo: 49, marketTime2YearsAgo: 45, medianActiveListPrice: "$929k" },
  { city: "Corona Del Mar", region: "Coastal", currentActives: 74, demand30Days: 11, marketTimeDays: 202, marketTime2WeeksAgo: 188, marketTime4WeeksAgo: 124, marketTime1YearAgo: 182, marketTime2YearsAgo: 307, medianActiveListPrice: "$5.4m" },
  { city: "Costa Mesa", region: "Coastal", currentActives: 122, demand30Days: 32, marketTimeDays: 114, marketTime2WeeksAgo: 111, marketTime4WeeksAgo: 72, marketTime1YearAgo: 77, marketTime2YearsAgo: 65, medianActiveListPrice: "$1.5m" },
  { city: "Coto De Caza", region: "South OC", currentActives: 66, demand30Days: 5, marketTimeDays: 396, marketTime2WeeksAgo: 145, marketTime4WeeksAgo: 138, marketTime1YearAgo: 158, marketTime2YearsAgo: 69, medianActiveListPrice: "$2.3m" },
  { city: "Cypress", region: "North OC", currentActives: 52, demand30Days: 26, marketTimeDays: 60, marketTime2WeeksAgo: 97, marketTime4WeeksAgo: 43, marketTime1YearAgo: 55, marketTime2YearsAgo: 23, medianActiveListPrice: "$994k" },
  { city: "Dana Point", region: "Coastal", currentActives: 103, demand30Days: 22, marketTimeDays: 140, marketTime2WeeksAgo: 91, marketTime4WeeksAgo: 95, marketTime1YearAgo: 123, marketTime2YearsAgo: 96, medianActiveListPrice: "$2.8m" },
  { city: "Dove Canyon", region: "South OC", currentActives: 6, demand30Days: 3, marketTimeDays: 60, marketTime2WeeksAgo: 105, marketTime4WeeksAgo: 36, marketTime1YearAgo: 126, marketTime2YearsAgo: 60, medianActiveListPrice: "$1.8m" },
  { city: "Foothill Ranch", region: "South OC", currentActives: 15, demand30Days: 5, marketTimeDays: 90, marketTime2WeeksAgo: 270, marketTime4WeeksAgo: 73, marketTime1YearAgo: 203, marketTime2YearsAgo: 98, medianActiveListPrice: "$980k" },
  { city: "Fountain Valley", region: "Central OC", currentActives: 49, demand30Days: 20, marketTimeDays: 74, marketTime2WeeksAgo: 80, marketTime4WeeksAgo: 45, marketTime1YearAgo: 53, marketTime2YearsAgo: 47, medianActiveListPrice: "$1.6m" },
  { city: "Fullerton", region: "North OC", currentActives: 149, demand30Days: 57, marketTimeDays: 78, marketTime2WeeksAgo: 85, marketTime4WeeksAgo: 60, marketTime1YearAgo: 83, marketTime2YearsAgo: 54, medianActiveListPrice: "$925k" },
  { city: "Garden Grove", region: "Central OC", currentActives: 101, demand30Days: 37, marketTimeDays: 82, marketTime2WeeksAgo: 89, marketTime4WeeksAgo: 51, marketTime1YearAgo: 66, marketTime2YearsAgo: 36, medianActiveListPrice: "$1.0m" },
  { city: "Huntington Beach", region: "Coastal", currentActives: 288, demand30Days: 110, marketTimeDays: 79, marketTime2WeeksAgo: 95, marketTime4WeeksAgo: 80, marketTime1YearAgo: 81, marketTime2YearsAgo: 71, medianActiveListPrice: "$1.6m" },
  { city: "Irvine", region: "South OC", currentActives: 769, demand30Days: 146, marketTimeDays: 158, marketTime2WeeksAgo: 153, marketTime4WeeksAgo: 155, marketTime1YearAgo: 165, marketTime2YearsAgo: 94, medianActiveListPrice: "$1.7m" },
  { city: "La Habra", region: "North OC", currentActives: 75, demand30Days: 26, marketTimeDays: 87, marketTime2WeeksAgo: 66, marketTime4WeeksAgo: 50, marketTime1YearAgo: 54, marketTime2YearsAgo: 25, medianActiveListPrice: "$819k" },
  { city: "La Palma", region: "North OC", currentActives: 15, demand30Days: 8, marketTimeDays: 56, marketTime2WeeksAgo: 43, marketTime4WeeksAgo: 90, marketTime1YearAgo: 60, marketTime2YearsAgo: 20, medianActiveListPrice: "$1.2m" },
  { city: "Ladera Ranch", region: "South OC", currentActives: 48, demand30Days: 13, marketTimeDays: 111, marketTime2WeeksAgo: 115, marketTime4WeeksAgo: 68, marketTime1YearAgo: 177, marketTime2YearsAgo: 38, medianActiveListPrice: "$1.4m" },
  { city: "Laguna Beach", region: "Coastal", currentActives: 180, demand30Days: 23, marketTimeDays: 235, marketTime2WeeksAgo: 227, marketTime4WeeksAgo: 177, marketTime1YearAgo: 281, marketTime2YearsAgo: 244, medianActiveListPrice: "$4.7m" },
  { city: "Laguna Hills", region: "South OC", currentActives: 52, demand30Days: 19, marketTimeDays: 82, marketTime2WeeksAgo: 77, marketTime4WeeksAgo: 71, marketTime1YearAgo: 87, marketTime2YearsAgo: 50, medianActiveListPrice: "$1.1m" },
  { city: "Laguna Niguel", region: "South OC", currentActives: 168, demand30Days: 39, marketTimeDays: 129, marketTime2WeeksAgo: 96, marketTime4WeeksAgo: 85, marketTime1YearAgo: 99, marketTime2YearsAgo: 77, medianActiveListPrice: "$1.5m" },
  { city: "Laguna Woods", region: "South OC", currentActives: 196, demand30Days: 58, marketTimeDays: 101, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 98, marketTime1YearAgo: 61, marketTime2YearsAgo: 45, medianActiveListPrice: "$420k" },
  { city: "Lake Forest", region: "South OC", currentActives: 221, demand30Days: 42, marketTimeDays: 158, marketTime2WeeksAgo: 121, marketTime4WeeksAgo: 113, marketTime1YearAgo: 103, marketTime2YearsAgo: 42, medianActiveListPrice: "$1.3m" },
  { city: "Los Alamitos", region: "North OC", currentActives: 15, demand30Days: 5, marketTimeDays: 90, marketTime2WeeksAgo: 108, marketTime4WeeksAgo: 65, marketTime1YearAgo: 63, marketTime2YearsAgo: 33, medianActiveListPrice: "$1.6m" },
  { city: "Mission Viejo", region: "South OC", currentActives: 151, demand30Days: 81, marketTimeDays: 56, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 73, marketTime1YearAgo: 70, marketTime2YearsAgo: 47, medianActiveListPrice: "$1.2m" },
  { city: "Newport Beach", region: "Coastal", currentActives: 266, demand30Days: 49, marketTimeDays: 163, marketTime2WeeksAgo: 195, marketTime4WeeksAgo: 185, marketTime1YearAgo: 148, marketTime2YearsAgo: 134, medianActiveListPrice: "$4.8m" },
  { city: "Newport Coast", region: "Coastal", currentActives: 47, demand30Days: 7, marketTimeDays: 201, marketTime2WeeksAgo: 210, marketTime4WeeksAgo: 288, marketTime1YearAgo: 150, marketTime2YearsAgo: 245, medianActiveListPrice: "$9.0m" },
  { city: "North Tustin", region: "Central OC", currentActives: 18, demand30Days: 12, marketTimeDays: 45, marketTime2WeeksAgo: 44, marketTime4WeeksAgo: 42, marketTime1YearAgo: 99, marketTime2YearsAgo: 133, medianActiveListPrice: "$2.8m" },
  { city: "Orange", region: "Central OC", currentActives: 143, demand30Days: 60, marketTimeDays: 72, marketTime2WeeksAgo: 75, marketTime4WeeksAgo: 74, marketTime1YearAgo: 95, marketTime2YearsAgo: 57, medianActiveListPrice: "$1.2m" },
  { city: "Placentia", region: "North OC", currentActives: 57, demand30Days: 25, marketTimeDays: 68, marketTime2WeeksAgo: 160, marketTime4WeeksAgo: 70, marketTime1YearAgo: 89, marketTime2YearsAgo: 64, medianActiveListPrice: "$886k" },
  { city: "Portola Hills", region: "South OC", currentActives: 29, demand30Days: 6, marketTimeDays: 145, marketTime2WeeksAgo: 218, marketTime4WeeksAgo: 405, marketTime1YearAgo: 95, marketTime2YearsAgo: 135, medianActiveListPrice: "$1.6m" },
  { city: "Rancho Mission Viejo", region: "South OC", currentActives: 101, demand30Days: 13, marketTimeDays: 233, marketTime2WeeksAgo: 162, marketTime4WeeksAgo: 92, marketTime1YearAgo: 63, marketTime2YearsAgo: 56, medianActiveListPrice: "$1.1m" },
  { city: "Rancho Santa Margarita", region: "South OC", currentActives: 79, demand30Days: 30, marketTimeDays: 79, marketTime2WeeksAgo: 56, marketTime4WeeksAgo: 61, marketTime1YearAgo: 86, marketTime2YearsAgo: 54, medianActiveListPrice: "$850k" },
  { city: "Rossmoor", region: "North OC", currentActives: 9, demand30Days: 4, marketTimeDays: 68, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 45, marketTime1YearAgo: 30, marketTime2YearsAgo: 60, medianActiveListPrice: "$2.0m" },
  { city: "San Clemente", region: "Coastal", currentActives: 118, demand30Days: 54, marketTimeDays: 66, marketTime2WeeksAgo: 83, marketTime4WeeksAgo: 70, marketTime1YearAgo: 101, marketTime2YearsAgo: 96, medianActiveListPrice: "$2.2m" },
  { city: "San Juan Capistrano", region: "South OC", currentActives: 75, demand30Days: 22, marketTimeDays: 102, marketTime2WeeksAgo: 127, marketTime4WeeksAgo: 103, marketTime1YearAgo: 105, marketTime2YearsAgo: 89, medianActiveListPrice: "$2.1m" },
  { city: "Santa Ana", region: "Central OC", currentActives: 233, demand30Days: 62, marketTimeDays: 113, marketTime2WeeksAgo: 109, marketTime4WeeksAgo: 112, marketTime1YearAgo: 78, marketTime2YearsAgo: 70, medianActiveListPrice: "$850k" },
  { city: "Seal Beach", region: "Coastal", currentActives: 90, demand30Days: 51, marketTimeDays: 53, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 72, marketTime1YearAgo: 54, marketTime2YearsAgo: 55, medianActiveListPrice: "$444k" },
  { city: "Stanton", region: "Central OC", currentActives: 24, demand30Days: 13, marketTimeDays: 55, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 72, marketTime1YearAgo: 63, marketTime2YearsAgo: 48, medianActiveListPrice: "$658k" },
  { city: "Talega", region: "Coastal", currentActives: 28, demand30Days: 14, marketTimeDays: 60, marketTime2WeeksAgo: 97, marketTime4WeeksAgo: 98, marketTime1YearAgo: 168, marketTime2YearsAgo: 55, medianActiveListPrice: "$2.1m" },
  { city: "Tustin", region: "Central OC", currentActives: 108, demand30Days: 31, marketTimeDays: 105, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 83, marketTime1YearAgo: 80, marketTime2YearsAgo: 45, medianActiveListPrice: "$1.1m" },
  { city: "Villa Park", region: "Central OC", currentActives: 10, demand30Days: 2, marketTimeDays: 150, marketTime2WeeksAgo: 68, marketTime4WeeksAgo: 48, marketTime1YearAgo: 81, marketTime2YearsAgo: 102, medianActiveListPrice: "$3.3m" },
  { city: "Westminster", region: "Central OC", currentActives: 48, demand30Days: 21, marketTimeDays: 69, marketTime2WeeksAgo: 83, marketTime4WeeksAgo: 102, marketTime1YearAgo: 44, marketTime2YearsAgo: 49, medianActiveListPrice: "$1.2m" },
  { city: "Yorba Linda", region: "North OC", currentActives: 152, demand30Days: 53, marketTimeDays: 86, marketTime2WeeksAgo: 87, marketTime4WeeksAgo: 81, marketTime1YearAgo: 78, marketTime2YearsAgo: 62, medianActiveListPrice: "$1.7m" },
];

export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "All of O.C.", currentActives: 5046, demand30Days: 1494, marketTimeDays: 101, marketTime2WeeksAgo: 102, marketTime4WeeksAgo: 90, marketTime1YearAgo: 95, marketTime2YearsAgo: 67, medianActivePrice: "$1.3m" },
  { priceRange: "$0-$500k", currentActives: 416, demand30Days: 99, marketTimeDays: 126, marketTime2WeeksAgo: 112, marketTime4WeeksAgo: 94, marketTime1YearAgo: 63, marketTime2YearsAgo: 57, medianActivePrice: "$410k" },
  { priceRange: "$500k-$750k", currentActives: 631, demand30Days: 227, marketTimeDays: 83, marketTime2WeeksAgo: 88, marketTime4WeeksAgo: 84, marketTime1YearAgo: 85, marketTime2YearsAgo: 39, medianActivePrice: "$635k" },
  { priceRange: "$750k-$1m", currentActives: 757, demand30Days: 277, marketTimeDays: 82, marketTime2WeeksAgo: 80, marketTime4WeeksAgo: 72, marketTime1YearAgo: 64, marketTime2YearsAgo: 42, medianActivePrice: "$895k" },
  { priceRange: "$1m-$1.25m", currentActives: 606, demand30Days: 220, marketTimeDays: 83, marketTime2WeeksAgo: 78, marketTime4WeeksAgo: 65, marketTime1YearAgo: 77, marketTime2YearsAgo: 49, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 551, demand30Days: 209, marketTimeDays: 79, marketTime2WeeksAgo: 81, marketTime4WeeksAgo: 75, marketTime1YearAgo: 85, marketTime2YearsAgo: 57, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 687, demand30Days: 209, marketTimeDays: 99, marketTime2WeeksAgo: 110, marketTime4WeeksAgo: 92, marketTime1YearAgo: 95, marketTime2YearsAgo: 76, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 343, demand30Days: 78, marketTimeDays: 132, marketTime2WeeksAgo: 129, marketTime4WeeksAgo: 103, marketTime1YearAgo: 128, marketTime2YearsAgo: 0, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 507, demand30Days: 103, marketTimeDays: 148, marketTime2WeeksAgo: 151, marketTime4WeeksAgo: 124, marketTime1YearAgo: 168, marketTime2YearsAgo: 0, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 244, demand30Days: 39, marketTimeDays: 188, marketTime2WeeksAgo: 191, marketTime4WeeksAgo: 209, marketTime1YearAgo: 240, marketTime2YearsAgo: 170, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 304, demand30Days: 33, marketTimeDays: 276, marketTime2WeeksAgo: 341, marketTime4WeeksAgo: 295, marketTime1YearAgo: 318, marketTime2YearsAgo: 656, medianActivePrice: "$10.4m" },
];

export const OC_PRICE_RANGE_REPORT_ATTACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Attached", currentActives: 2231, demand30Days: 587, marketTimeDays: 114, marketTime2WeeksAgo: 112, marketTime4WeeksAgo: 103, marketTime1YearAgo: 90, marketTime2YearsAgo: 56, medianActivePrice: "$799k" },
  { priceRange: "$0-$500k", currentActives: 406, demand30Days: 97, marketTimeDays: 126, marketTime2WeeksAgo: 112, marketTime4WeeksAgo: 95, marketTime1YearAgo: 63, marketTime2YearsAgo: 56, medianActivePrice: "$410k" },
  { priceRange: "$500k-$750k", currentActives: 604, demand30Days: 211, marketTimeDays: 86, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 86, marketTime1YearAgo: 89, marketTime2YearsAgo: 39, medianActivePrice: "$630k" },
  { priceRange: "$750k-$1m", currentActives: 530, demand30Days: 144, marketTimeDays: 110, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 96, marketTime1YearAgo: 79, marketTime2YearsAgo: 45, medianActivePrice: "$875k" },
  { priceRange: "$1m-$2m", currentActives: 550, demand30Days: 111, marketTimeDays: 149, marketTime2WeeksAgo: 144, marketTime4WeeksAgo: 129, marketTime1YearAgo: 118, marketTime2YearsAgo: 75, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 141, demand30Days: 24, marketTimeDays: 176, marketTime2WeeksAgo: 253, marketTime4WeeksAgo: 224, marketTime1YearAgo: 159, marketTime2YearsAgo: 212, medianActivePrice: "$3.0m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: 2815, demand30Days: 907, marketTimeDays: 93, marketTime2WeeksAgo: 96, marketTime4WeeksAgo: 82, marketTime1YearAgo: 98, marketTime2YearsAgo: 75, medianActivePrice: "$1.9m" },
  { priceRange: "$0-$750k", currentActives: 37, demand30Days: 18, marketTimeDays: 62, marketTime2WeeksAgo: 50, marketTime4WeeksAgo: 58, marketTime1YearAgo: 59, marketTime2YearsAgo: 44, medianActivePrice: "$625k" },
  { priceRange: "$750k-$1m", currentActives: 227, demand30Days: 133, marketTimeDays: 51, marketTime2WeeksAgo: 55, marketTime4WeeksAgo: 45, marketTime1YearAgo: 49, marketTime2YearsAgo: 39, medianActivePrice: "$925k" },
  { priceRange: "$1m-$1.25m", currentActives: 341, demand30Days: 167, marketTimeDays: 61, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 48, marketTime1YearAgo: 64, marketTime2YearsAgo: 43, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 386, demand30Days: 170, marketTimeDays: 68, marketTime2WeeksAgo: 68, marketTime4WeeksAgo: 58, marketTime1YearAgo: 74, marketTime2YearsAgo: 54, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 567, demand30Days: 190, marketTimeDays: 90, marketTime2WeeksAgo: 101, marketTime4WeeksAgo: 89, marketTime1YearAgo: 93, marketTime2YearsAgo: 71, medianActivePrice: "$1.8m" },
  { priceRange: "$2m-$2.5m", currentActives: 301, demand30Days: 72, marketTimeDays: 125, marketTime2WeeksAgo: 120, marketTime4WeeksAgo: 99, marketTime1YearAgo: 129, marketTime2YearsAgo: 0, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 447, demand30Days: 94, marketTimeDays: 143, marketTime2WeeksAgo: 143, marketTime4WeeksAgo: 119, marketTime1YearAgo: 169, marketTime2YearsAgo: 0, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 219, demand30Days: 31, marketTimeDays: 212, marketTime2WeeksAgo: 188, marketTime4WeeksAgo: 187, marketTime1YearAgo: 254, marketTime2YearsAgo: 159, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 290, demand30Days: 32, marketTimeDays: 272, marketTime2WeeksAgo: 334, marketTime4WeeksAgo: 288, marketTime1YearAgo: 312, marketTime2YearsAgo: 628, medianActivePrice: "$10.8m" },
];

export const OC_SOLD_REPORT: OCSoldReportEntry[] = [
  { city: "Aliso Viejo", unitsSold2026: 34, medianSalesPrice: "$907,000", medianListPrice: "$909,000", salesToListRatio: "99.4%", lowPrice: "$580,000", highPrice: "$2,950,000", medianSqFt: 1419, medianPricePerSqFt: "$639", medianDOM: 16, unitsSold2025: 40 },
  { city: "Anaheim", unitsSold2026: 111, medianSalesPrice: "$935,000", medianListPrice: "$919,000", salesToListRatio: "100.1%", lowPrice: "$370,000", highPrice: "$1,860,000", medianSqFt: 1508, medianPricePerSqFt: "$620", medianDOM: 13, unitsSold2025: 92 },
  { city: "Anaheim Hills", unitsSold2026: 32, medianSalesPrice: "$1,362,500", medianListPrice: "$1,344,000", salesToListRatio: "99.3%", lowPrice: "$645,000", highPrice: "$2,575,000", medianSqFt: 2122, medianPricePerSqFt: "$642", medianDOM: 14, unitsSold2025: 28 },
  { city: "Brea", unitsSold2026: 31, medianSalesPrice: "$1,190,000", medianListPrice: "$1,150,000", salesToListRatio: "100.0%", lowPrice: "$615,000", highPrice: "$3,420,000", medianSqFt: 1999, medianPricePerSqFt: "$595", medianDOM: 11, unitsSold2025: 30 },
  { city: "Buena Park", unitsSold2026: 42, medianSalesPrice: "$881,000", medianListPrice: "$899,000", salesToListRatio: "100.0%", lowPrice: "$580,000", highPrice: "$1,500,000", medianSqFt: 1503, medianPricePerSqFt: "$586", medianDOM: 15, unitsSold2025: 19 },
  { city: "Corona Del Mar", unitsSold2026: 26, medianSalesPrice: "$3,800,000", medianListPrice: "$3,892,500", salesToListRatio: "97.9%", lowPrice: "$1,375,000", highPrice: "$13,500,000", medianSqFt: 2376, medianPricePerSqFt: "$1,599", medianDOM: 52, unitsSold2025: 15 },
  { city: "Costa Mesa", unitsSold2026: 58, medianSalesPrice: "$1,500,000", medianListPrice: "$1,500,000", salesToListRatio: "98.5%", lowPrice: "$639,000", highPrice: "$3,748,000", medianSqFt: 1638, medianPricePerSqFt: "$916", medianDOM: 21, unitsSold2025: 60 },
  { city: "Coto De Caza", unitsSold2026: 13, medianSalesPrice: "$1,950,000", medianListPrice: "$1,849,000", salesToListRatio: "98.3%", lowPrice: "$1,080,000", highPrice: "$23,000,000", medianSqFt: 3769, medianPricePerSqFt: "$517", medianDOM: 15, unitsSold2025: 19 },
  { city: "Cypress", unitsSold2026: 38, medianSalesPrice: "$1,050,000", medianListPrice: "$999,999", salesToListRatio: "100.0%", lowPrice: "$575,000", highPrice: "$2,175,000", medianSqFt: 1634, medianPricePerSqFt: "$643", medianDOM: 17, unitsSold2025: 21 },
  { city: "Dana Point", unitsSold2026: 33, medianSalesPrice: "$2,100,000", medianListPrice: "$2,200,000", salesToListRatio: "100.0%", lowPrice: "$608,000", highPrice: "$17,500,000", medianSqFt: 2067, medianPricePerSqFt: "$1,016", medianDOM: 8, unitsSold2025: 49 },
  { city: "Dove Canyon", unitsSold2026: 1, medianSalesPrice: "$1,850,000", medianListPrice: "$1,865,000", salesToListRatio: "99.2%", lowPrice: "$1,850,000", highPrice: "$1,850,000", medianSqFt: 3063, medianPricePerSqFt: "$604", medianDOM: 58, unitsSold2025: 4 },
  { city: "Foothill Ranch", unitsSold2026: 9, medianSalesPrice: "$940,000", medianListPrice: "$950,000", salesToListRatio: "100.0%", lowPrice: "$777,500", highPrice: "$1,849,000", medianSqFt: 1423, medianPricePerSqFt: "$661", medianDOM: 10, unitsSold2025: 11 },
  { city: "Fountain Valley", unitsSold2026: 28, medianSalesPrice: "$1,395,000", medianListPrice: "$1,325,000", salesToListRatio: "100.3%", lowPrice: "$465,000", highPrice: "$1,922,000", medianSqFt: 1747, medianPricePerSqFt: "$799", medianDOM: 8, unitsSold2025: 30 },
  { city: "Fullerton", unitsSold2026: 64, medianSalesPrice: "$1,085,000", medianListPrice: "$1,075,000", salesToListRatio: "100.0%", lowPrice: "$365,000", highPrice: "$2,950,000", medianSqFt: 1781, medianPricePerSqFt: "$609", medianDOM: 10, unitsSold2025: 74 },
  { city: "Garden Grove", unitsSold2026: 50, medianSalesPrice: "$1,064,000", medianListPrice: "$1,050,000", salesToListRatio: "100.0%", lowPrice: "$350,000", highPrice: "$1,575,000", medianSqFt: 1400, medianPricePerSqFt: "$760", medianDOM: 14, unitsSold2025: 54 },
  { city: "Huntington Beach", unitsSold2026: 139, medianSalesPrice: "$1,375,000", medianListPrice: "$1,395,000", salesToListRatio: "100.0%", lowPrice: "$445,000", highPrice: "$5,400,000", medianSqFt: 1657, medianPricePerSqFt: "$830", medianDOM: 18, unitsSold2025: 124 },
  { city: "Irvine", unitsSold2026: 191, medianSalesPrice: "$1,625,000", medianListPrice: "$1,660,000", salesToListRatio: "98.1%", lowPrice: "$465,000", highPrice: "$6,000,000", medianSqFt: 2033, medianPricePerSqFt: "$799", medianDOM: 25, unitsSold2025: 161 },
  { city: "La Habra", unitsSold2026: 25, medianSalesPrice: "$787,840", medianListPrice: "$788,000", salesToListRatio: "100.0%", lowPrice: "$550,000", highPrice: "$2,320,000", medianSqFt: 1390, medianPricePerSqFt: "$567", medianDOM: 20, unitsSold2025: 29 },
  { city: "La Palma", unitsSold2026: 7, medianSalesPrice: "$1,150,000", medianListPrice: "$1,150,000", salesToListRatio: "100.0%", lowPrice: "$938,000", highPrice: "$1,460,000", medianSqFt: 2222, medianPricePerSqFt: "$518", medianDOM: 11, unitsSold2025: 8 },
  { city: "Ladera Ranch", unitsSold2026: 28, medianSalesPrice: "$1,755,000", medianListPrice: "$1,799,500", salesToListRatio: "99.5%", lowPrice: "$723,000", highPrice: "$3,500,000", medianSqFt: 2571, medianPricePerSqFt: "$683", medianDOM: 15, unitsSold2025: 28 },
  { city: "Laguna Beach", unitsSold2026: 28, medianSalesPrice: "$3,395,000", medianListPrice: "$3,477,000", salesToListRatio: "97.2%", lowPrice: "$1,220,000", highPrice: "$10,800,000", medianSqFt: 2236, medianPricePerSqFt: "$1,518", medianDOM: 32, unitsSold2025: 29 },
  { city: "Laguna Hills", unitsSold2026: 19, medianSalesPrice: "$1,450,000", medianListPrice: "$1,500,000", salesToListRatio: "100.2%", lowPrice: "$205,000", highPrice: "$4,800,000", medianSqFt: 2305, medianPricePerSqFt: "$629", medianDOM: 7, unitsSold2025: 17 },
  { city: "Laguna Niguel", unitsSold2026: 78, medianSalesPrice: "$1,585,000", medianListPrice: "$1,587,450", salesToListRatio: "99.7%", lowPrice: "$575,000", highPrice: "$12,000,000", medianSqFt: 1952, medianPricePerSqFt: "$812", medianDOM: 15, unitsSold2025: 68 },
  { city: "Laguna Woods", unitsSold2026: 54, medianSalesPrice: "$468,500", medianListPrice: "$481,500", salesToListRatio: "98.1%", lowPrice: "$95,000", highPrice: "$1,348,000", medianSqFt: 1080, medianPricePerSqFt: "$434", medianDOM: 36, unitsSold2025: 57 },
  { city: "Lake Forest", unitsSold2026: 81, medianSalesPrice: "$1,301,500", medianListPrice: "$1,299,900", salesToListRatio: "100.0%", lowPrice: "$355,000", highPrice: "$3,260,000", medianSqFt: 1946, medianPricePerSqFt: "$669", medianDOM: 14, unitsSold2025: 47 },
  { city: "Los Alamitos", unitsSold2026: 6, medianSalesPrice: "$1,562,500", medianListPrice: "$1,549,950", salesToListRatio: "100.8%", lowPrice: "$1,360,000", highPrice: "$3,200,000", medianSqFt: 2094, medianPricePerSqFt: "$746", medianDOM: 5, unitsSold2025: 6 },
  { city: "Mission Viejo", unitsSold2026: 92, medianSalesPrice: "$1,292,500", medianListPrice: "$1,299,444", salesToListRatio: "99.1%", lowPrice: "$355,000", highPrice: "$2,750,000", medianSqFt: 1771, medianPricePerSqFt: "$730", medianDOM: 21, unitsSold2025: 86 },
  { city: "Newport Beach", unitsSold2026: 66, medianSalesPrice: "$3,700,000", medianListPrice: "$3,795,000", salesToListRatio: "96.9%", lowPrice: "$810,000", highPrice: "$27,500,000", medianSqFt: 2540, medianPricePerSqFt: "$1,457", medianDOM: 28, unitsSold2025: 70 },
  { city: "Newport Coast", unitsSold2026: 7, medianSalesPrice: "$12,900,000", medianListPrice: "$13,988,800", salesToListRatio: "95.1%", lowPrice: "$6,000,000", highPrice: "$38,000,000", medianSqFt: 7800, medianPricePerSqFt: "$1,654", medianDOM: 63, unitsSold2025: 9 },
  { city: "North Tustin", unitsSold2026: 14, medianSalesPrice: "$1,927,500", medianListPrice: "$1,897,500", salesToListRatio: "99.4%", lowPrice: "$1,400,000", highPrice: "$6,500,000", medianSqFt: 2763, medianPricePerSqFt: "$698", medianDOM: 13, unitsSold2025: 15 },
  { city: "Orange", unitsSold2026: 74, medianSalesPrice: "$1,205,000", medianListPrice: "$1,166,500", salesToListRatio: "100.4%", lowPrice: "$499,800", highPrice: "$2,075,000", medianSqFt: 1700, medianPricePerSqFt: "$709", medianDOM: 12, unitsSold2025: 78 },
  { city: "Placentia", unitsSold2026: 34, medianSalesPrice: "$1,180,000", medianListPrice: "$1,189,500", salesToListRatio: "100.0%", lowPrice: "$540,000", highPrice: "$1,965,000", medianSqFt: 2026, medianPricePerSqFt: "$582", medianDOM: 12, unitsSold2025: 26 },
  { city: "Portola Hills", unitsSold2026: 6, medianSalesPrice: "$827,500", medianListPrice: "$802,000", salesToListRatio: "99.7%", lowPrice: "$520,000", highPrice: "$3,231,882", medianSqFt: 1341, medianPricePerSqFt: "$617", medianDOM: 23, unitsSold2025: 6 },
  { city: "Rancho Mission Viejo", unitsSold2026: 45, medianSalesPrice: "$1,308,000", medianListPrice: "$1,325,000", salesToListRatio: "100.0%", lowPrice: "$595,000", highPrice: "$2,400,000", medianSqFt: 1990, medianPricePerSqFt: "$657", medianDOM: 33, unitsSold2025: 22 },
  { city: "Rancho Santa Margarita", unitsSold2026: 26, medianSalesPrice: "$860,000", medianListPrice: "$859,500", salesToListRatio: "100.0%", lowPrice: "$365,000", highPrice: "$1,580,000", medianSqFt: 1380, medianPricePerSqFt: "$623", medianDOM: 15, unitsSold2025: 36 },
  { city: "Rossmoor", unitsSold2026: 4, medianSalesPrice: "$1,715,000", medianListPrice: "$1,724,000", salesToListRatio: "98.7%", lowPrice: "$1,575,000", highPrice: "$2,350,000", medianSqFt: 2199, medianPricePerSqFt: "$780", medianDOM: 28, unitsSold2025: 7 },
  { city: "San Clemente", unitsSold2026: 62, medianSalesPrice: "$1,800,000", medianListPrice: "$1,824,500", salesToListRatio: "99.2%", lowPrice: "$460,000", highPrice: "$5,375,000", medianSqFt: 2110, medianPricePerSqFt: "$853", medianDOM: 11, unitsSold2025: 59 },
  { city: "San Juan Capistrano", unitsSold2026: 35, medianSalesPrice: "$1,765,000", medianListPrice: "$1,775,000", salesToListRatio: "98.6%", lowPrice: "$515,000", highPrice: "$13,850,000", medianSqFt: 2682, medianPricePerSqFt: "$658", medianDOM: 9, unitsSold2025: 26 },
  { city: "Santa Ana", unitsSold2026: 81, medianSalesPrice: "$850,000", medianListPrice: "$815,000", salesToListRatio: "100.0%", lowPrice: "$310,000", highPrice: "$3,700,000", medianSqFt: 1275, medianPricePerSqFt: "$667", medianDOM: 20, unitsSold2025: 79 },
  { city: "Seal Beach", unitsSold2026: 44, medianSalesPrice: "$385,000", medianListPrice: "$388,500", salesToListRatio: "100.0%", lowPrice: "$205,000", highPrice: "$4,600,000", medianSqFt: 1021, medianPricePerSqFt: "$377", medianDOM: 12, unitsSold2025: 45 },
  { city: "Stanton", unitsSold2026: 15, medianSalesPrice: "$621,000", medianListPrice: "$599,000", salesToListRatio: "100.0%", lowPrice: "$390,000", highPrice: "$1,025,000", medianSqFt: 1027, medianPricePerSqFt: "$605", medianDOM: 14, unitsSold2025: 13 },
  { city: "Talega", unitsSold2026: 10, medianSalesPrice: "$1,935,000", medianListPrice: "$1,947,000", salesToListRatio: "99.7%", lowPrice: "$1,065,000", highPrice: "$3,600,000", medianSqFt: 3008, medianPricePerSqFt: "$643", medianDOM: 43, unitsSold2025: 10 },
  { city: "Tustin", unitsSold2026: 49, medianSalesPrice: "$1,195,000", medianListPrice: "$1,199,900", salesToListRatio: "100.0%", lowPrice: "$426,000", highPrice: "$2,739,900", medianSqFt: 1590, medianPricePerSqFt: "$752", medianDOM: 10, unitsSold2025: 42 },
  { city: "Villa Park", unitsSold2026: 3, medianSalesPrice: "$2,993,850", medianListPrice: "$2,999,888", salesToListRatio: "94.7%", lowPrice: "$2,450,000", highPrice: "$3,500,000", medianSqFt: 3916, medianPricePerSqFt: "$765", medianDOM: 43, unitsSold2025: 4 },
  { city: "Westminster", unitsSold2026: 28, medianSalesPrice: "$1,147,288", medianListPrice: "$1,125,000", salesToListRatio: "100.8%", lowPrice: "$780,000", highPrice: "$1,500,000", medianSqFt: 1663, medianPricePerSqFt: "$690", medianDOM: 13, unitsSold2025: 20 },
  { city: "Yorba Linda", unitsSold2026: 66, medianSalesPrice: "$1,324,500", medianListPrice: "$1,299,750", salesToListRatio: "100.0%", lowPrice: "$437,000", highPrice: "$3,779,000", medianSqFt: 1862, medianPricePerSqFt: "$712", medianDOM: 12, unitsSold2025: 48 },
  { city: "All of O.C.", unitsSold2026: 1994, medianSalesPrice: "$1,256,412", medianListPrice: "$1,250,000", salesToListRatio: "99.9%", lowPrice: "$95,000", highPrice: "$38,000,000", medianSqFt: 1753, medianPricePerSqFt: "$717", medianDOM: 15, unitsSold2025: 1828 }
];

export const OC_SITTING_ON_MARKET_REPORT: OCSittingOnMarketEntry[] = [
  { priceRange: "$0-$750k", currentActives: 1019, actives30PlusDays: 673, percent30PlusDays: "66%", actives60PlusDays: 440, percent60PlusDays: "43%", marketTimeDays: 93, offMarketYTD: 686 },
  { priceRange: "$750k-$1m", currentActives: 739, actives30PlusDays: 430, percent30PlusDays: "58%", actives60PlusDays: 250, percent60PlusDays: "34%", marketTimeDays: 78, offMarketYTD: 535 },
  { priceRange: "$1m-$1.5m", currentActives: 1130, actives30PlusDays: 640, percent30PlusDays: "57%", actives60PlusDays: 340, percent60PlusDays: "30%", marketTimeDays: 76, offMarketYTD: 748 },
  { priceRange: "$1.5m-$2m", currentActives: 727, actives30PlusDays: 450, percent30PlusDays: "62%", actives60PlusDays: 280, percent60PlusDays: "39%", marketTimeDays: 116, offMarketYTD: 555 },
  { priceRange: "$2m-$2.5m", currentActives: 376, actives30PlusDays: 235, percent30PlusDays: "63%", actives60PlusDays: 145, percent60PlusDays: "39%", marketTimeDays: 176, offMarketYTD: 303 },
  { priceRange: "$2.5m-$4m", currentActives: 503, actives30PlusDays: 355, percent30PlusDays: "71%", actives60PlusDays: 249, percent60PlusDays: "50%", marketTimeDays: 138, offMarketYTD: 440 },
  { priceRange: "$4m-$6m", currentActives: 240, actives30PlusDays: 180, percent30PlusDays: "75%", actives60PlusDays: 131, percent60PlusDays: "55%", marketTimeDays: 189, offMarketYTD: 177 },
  { priceRange: "$6m+", currentActives: 312, actives30PlusDays: 250, percent30PlusDays: "80%", actives60PlusDays: 205, percent60PlusDays: "66%", marketTimeDays: 275, offMarketYTD: 225 },
  { priceRange: "All of O.C.", currentActives: 5046, actives30PlusDays: 3213, percent30PlusDays: "64%", actives60PlusDays: 2040, percent60PlusDays: "40%", marketTimeDays: 101, offMarketYTD: 3669 }
];

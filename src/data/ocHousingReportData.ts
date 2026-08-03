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
  unitsSoldJune2026: number;
  medianSalesPrice: string;
  medianListPrice: string;
  salesToListRatio: string;
  lowPrice: string;
  highPrice: string;
  medianSqFt: number;
  medianPricePerSqFt: string;
  medianDOM: number;
  unitsSoldJune2025: number;
}

export interface OCSittingOnMarketEntry {
  priceRange: string;
  currentActives: number;
  actives30PlusDays: number;
  percent30PlusDays: string;
  actives60PlusDays: number;
  percent60PlusDays: string;
  marketTimeDays: number;
  offMarketJanJun: number;
}

export const OC_HOUSING_REPORT_METADATA = {
  reportDate: "July 21, 2026",
  author: "Steven Thomas",
  publisher: "Reports On Housing",
  title: "The Lull Phase",
  subtitle: "Housing has cooled considerably since earlier this year, and more sellers are languishing on the market without success.",
  countywideActives: 5020,
  countywideDemand: 1472,
  countywideMarketTime: 102,
  countywideMedianPrice: "$1,300,000",
  juneClosedSalesResales: 1994,
  salesToListRatio: "99.9%",
};

export const OC_HOUSING_SUMMARY_BULLETS = [
  {
    title: "INVENTORY SURGE",
    stat: "5,020 Active Homes",
    trend: "+7% in 2 Weeks",
    description: "Active listing inventory increased by 323 homes over the past two weeks to 5,020, its highest level since last July. The sharp rise coincided with a sudden drop in demand."
  },
  {
    title: "DEMAND PLUNGE",
    stat: "1,472 Pending Sales",
    trend: "-6% in 2 Weeks",
    description: "Snapshot of new pending sales over the prior month fell by 86 sales (-6%) to 1,472. This is the lowest mid-July reading since tracking began in 2004."
  },
  {
    title: "EXPECTED MARKET TIME",
    stat: "102 Days",
    trend: "+12 Days in 2 Weeks",
    description: "With supply up 7% and demand down 6%, Expected Market Time increased from 90 to 102 days—the slowest mid-July pace since April 2020 during the COVID lockdown."
  },
  {
    title: "LUXURY MARKET TIME",
    stat: "193 Days ($2.5M+)",
    trend: "Slowing Luxury Pace",
    description: "Luxury inventory ($2.5M+) rose to 1,053 homes (+2%) while luxury demand fell 9% to 164 pending sales. Homes priced above $6M face an Expected Market Time of 341 days."
  },
  {
    title: "SITTING ON THE MARKET",
    stat: "64% Listed 30+ Days",
    trend: "41% Over 60 Days",
    description: "Nearly two-thirds of all active Orange County listings have been on the market for over a month. 3,669 sellers pulled their homes off the market from Jan–June (+11% YoY)."
  },
  {
    title: "JUNE CLOSED RESALES",
    stat: "1,994 Resales Closed",
    trend: "+9% vs June 2025",
    description: "June resales totaled 1,994 homes with a median sales price of $1,256,412. The sales-to-list price ratio held strong at 99.9%, with 99.7% of all sales having positive seller equity."
  }
];

export const OC_MARKET_TIME_REPORT: OCMarketTimeEntry[] = [
  { city: "Aliso Viejo", region: "South OC", currentActives: 86, demand30Days: 17, marketTimeDays: 152, marketTime2WeeksAgo: 81, marketTime4WeeksAgo: 73, marketTime1YearAgo: 78, marketTime2YearsAgo: 36, medianActiveListPrice: "$887k" },
  { city: "Anaheim", region: "North OC", currentActives: 244, demand30Days: 79, marketTimeDays: 93, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 74, marketTime1YearAgo: 86, marketTime2YearsAgo: 46, medianActiveListPrice: "$940k" },
  { city: "Anaheim Hills", region: "North OC", currentActives: 36, demand30Days: 24, marketTimeDays: 45, marketTime2WeeksAgo: 51, marketTime4WeeksAgo: 53, marketTime1YearAgo: 111, marketTime2YearsAgo: 39, medianActiveListPrice: "$1.2m" },
  { city: "Brea", region: "North OC", currentActives: 48, demand30Days: 24, marketTimeDays: 60, marketTime2WeeksAgo: 44, marketTime4WeeksAgo: 60, marketTime1YearAgo: 36, marketTime2YearsAgo: 52, medianActiveListPrice: "$1.2m" },
  { city: "Buena Park", region: "North OC", currentActives: 68, demand30Days: 26, marketTimeDays: 78, marketTime2WeeksAgo: 97, marketTime4WeeksAgo: 91, marketTime1YearAgo: 64, marketTime2YearsAgo: 48, medianActiveListPrice: "$949k" },
  { city: "Corona Del Mar", region: "Coastal", currentActives: 75, demand30Days: 12, marketTimeDays: 188, marketTime2WeeksAgo: 124, marketTime4WeeksAgo: 148, marketTime1YearAgo: 137, marketTime2YearsAgo: 194, medianActiveListPrice: "$5.5m" },
  { city: "Costa Mesa", region: "Coastal", currentActives: 111, demand30Days: 30, marketTimeDays: 111, marketTime2WeeksAgo: 72, marketTime4WeeksAgo: 75, marketTime1YearAgo: 77, marketTime2YearsAgo: 71, medianActiveListPrice: "$1.5m" },
  { city: "Coto De Caza", region: "South OC", currentActives: 58, demand30Days: 12, marketTimeDays: 145, marketTime2WeeksAgo: 138, marketTime4WeeksAgo: 249, marketTime1YearAgo: 120, marketTime2YearsAgo: 87, medianActiveListPrice: "$2.3m" },
  { city: "Cypress", region: "North OC", currentActives: 58, demand30Days: 18, marketTimeDays: 97, marketTime2WeeksAgo: 43, marketTime4WeeksAgo: 41, marketTime1YearAgo: 69, marketTime2YearsAgo: 29, medianActiveListPrice: "$1.0m" },
  { city: "Dana Point", region: "Coastal", currentActives: 94, demand30Days: 31, marketTimeDays: 91, marketTime2WeeksAgo: 95, marketTime4WeeksAgo: 81, marketTime1YearAgo: 103, marketTime2YearsAgo: 98, medianActiveListPrice: "$2.9m" },
  { city: "Dove Canyon", region: "South OC", currentActives: 7, demand30Days: 2, marketTimeDays: 105, marketTime2WeeksAgo: 36, marketTime4WeeksAgo: 30, marketTime1YearAgo: 210, marketTime2YearsAgo: 50, medianActiveListPrice: "$1.7m" },
  { city: "Foothill Ranch", region: "South OC", currentActives: 18, demand30Days: 2, marketTimeDays: 270, marketTime2WeeksAgo: 73, marketTime4WeeksAgo: 80, marketTime1YearAgo: 94, marketTime2YearsAgo: 50, medianActiveListPrice: "$1.3m" },
  { city: "Fountain Valley", region: "Central OC", currentActives: 53, demand30Days: 20, marketTimeDays: 80, marketTime2WeeksAgo: 45, marketTime4WeeksAgo: 65, marketTime1YearAgo: 40, marketTime2YearsAgo: 102, medianActiveListPrice: "$1.5m" },
  { city: "Fullerton", region: "North OC", currentActives: 141, demand30Days: 50, marketTimeDays: 85, marketTime2WeeksAgo: 60, marketTime4WeeksAgo: 56, marketTime1YearAgo: 79, marketTime2YearsAgo: 45, medianActiveListPrice: "$930k" },
  { city: "Garden Grove", region: "Central OC", currentActives: 104, demand30Days: 35, marketTimeDays: 89, marketTime2WeeksAgo: 51, marketTime4WeeksAgo: 49, marketTime1YearAgo: 65, marketTime2YearsAgo: 35, medianActiveListPrice: "$907k" },
  { city: "Huntington Beach", region: "Coastal", currentActives: 299, demand30Days: 94, marketTimeDays: 95, marketTime2WeeksAgo: 80, marketTime4WeeksAgo: 72, marketTime1YearAgo: 90, marketTime2YearsAgo: 69, medianActiveListPrice: "$1.6m" },
  { city: "Irvine", region: "South OC", currentActives: 801, demand30Days: 157, marketTimeDays: 153, marketTime2WeeksAgo: 155, marketTime4WeeksAgo: 177, marketTime1YearAgo: 173, marketTime2YearsAgo: 93, medianActiveListPrice: "$1.6m" },
  { city: "La Habra", region: "North OC", currentActives: 68, demand30Days: 31, marketTimeDays: 66, marketTime2WeeksAgo: 50, marketTime4WeeksAgo: 61, marketTime1YearAgo: 61, marketTime2YearsAgo: 49, medianActiveListPrice: "$805k" },
  { city: "La Palma", region: "North OC", currentActives: 10, demand30Days: 7, marketTimeDays: 43, marketTime2WeeksAgo: 90, marketTime4WeeksAgo: 75, marketTime1YearAgo: 90, marketTime2YearsAgo: 105, medianActiveListPrice: "$1.4m" },
  { city: "Ladera Ranch", region: "South OC", currentActives: 50, demand30Days: 13, marketTimeDays: 115, marketTime2WeeksAgo: 68, marketTime4WeeksAgo: 64, marketTime1YearAgo: 116, marketTime2YearsAgo: 29, medianActiveListPrice: "$1.3m" },
  { city: "Laguna Beach", region: "Coastal", currentActives: 174, demand30Days: 23, marketTimeDays: 227, marketTime2WeeksAgo: 177, marketTime4WeeksAgo: 176, marketTime1YearAgo: 337, marketTime2YearsAgo: 246, medianActiveListPrice: "$4.5m" },
  { city: "Laguna Hills", region: "South OC", currentActives: 59, demand30Days: 23, marketTimeDays: 77, marketTime2WeeksAgo: 71, marketTime4WeeksAgo: 76, marketTime1YearAgo: 124, marketTime2YearsAgo: 59, medianActiveListPrice: "$1.2m" },
  { city: "Laguna Niguel", region: "South OC", currentActives: 157, demand30Days: 49, marketTimeDays: 96, marketTime2WeeksAgo: 85, marketTime4WeeksAgo: 84, marketTime1YearAgo: 104, marketTime2YearsAgo: 72, medianActiveListPrice: "$1.6m" },
  { city: "Laguna Woods", region: "South OC", currentActives: 184, demand30Days: 60, marketTimeDays: 92, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 96, marketTime1YearAgo: 64, marketTime2YearsAgo: 40, medianActiveListPrice: "$420k" },
  { city: "Lake Forest", region: "South OC", currentActives: 210, demand30Days: 52, marketTimeDays: 121, marketTime2WeeksAgo: 113, marketTime4WeeksAgo: 119, marketTime1YearAgo: 88, marketTime2YearsAgo: 58, medianActiveListPrice: "$1.3m" },
  { city: "Los Alamitos", region: "North OC", currentActives: 18, demand30Days: 5, marketTimeDays: 108, marketTime2WeeksAgo: 65, marketTime4WeeksAgo: 140, marketTime1YearAgo: 80, marketTime2YearsAgo: 55, medianActiveListPrice: "$1.6m" },
  { city: "Mission Viejo", region: "South OC", currentActives: 154, demand30Days: 77, marketTimeDays: 60, marketTime2WeeksAgo: 73, marketTime4WeeksAgo: 59, marketTime1YearAgo: 64, marketTime2YearsAgo: 45, medianActiveListPrice: "$1.1m" },
  { city: "Newport Beach", region: "Coastal", currentActives: 273, demand30Days: 42, marketTimeDays: 195, marketTime2WeeksAgo: 185, marketTime4WeeksAgo: 177, marketTime1YearAgo: 168, marketTime2YearsAgo: 137, medianActiveListPrice: "$4.8m" },
  { city: "Newport Coast", region: "Coastal", currentActives: 49, demand30Days: 7, marketTimeDays: 210, marketTime2WeeksAgo: 288, marketTime4WeeksAgo: 173, marketTime1YearAgo: 193, marketTime2YearsAgo: 177, medianActiveListPrice: "$7.8m" },
  { city: "North Tustin", region: "Central OC", currentActives: 19, demand30Days: 13, marketTimeDays: 44, marketTime2WeeksAgo: 42, marketTime4WeeksAgo: 81, marketTime1YearAgo: 83, marketTime2YearsAgo: 110, medianActiveListPrice: "$2.8m" },
  { city: "Orange", region: "Central OC", currentActives: 143, demand30Days: 57, marketTimeDays: 75, marketTime2WeeksAgo: 74, marketTime4WeeksAgo: 59, marketTime1YearAgo: 74, marketTime2YearsAgo: 62, medianActiveListPrice: "$1.2m" },
  { city: "Placentia", region: "North OC", currentActives: 64, demand30Days: 12, marketTimeDays: 160, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 47, marketTime1YearAgo: 78, marketTime2YearsAgo: 83, medianActiveListPrice: "$927k" },
  { city: "Portola Hills", region: "South OC", currentActives: 29, demand30Days: 4, marketTimeDays: 218, marketTime2WeeksAgo: 405, marketTime4WeeksAgo: 690, marketTime1YearAgo: 71, marketTime2YearsAgo: 240, medianActiveListPrice: "$1.8m" },
  { city: "Rancho Mission Viejo", region: "South OC", currentActives: 97, demand30Days: 18, marketTimeDays: 162, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 75, marketTime1YearAgo: 109, marketTime2YearsAgo: 93, medianActiveListPrice: "$1.2m" },
  { city: "Rancho Santa Margarita", region: "South OC", currentActives: 73, demand30Days: 39, marketTimeDays: 56, marketTime2WeeksAgo: 61, marketTime4WeeksAgo: 91, marketTime1YearAgo: 51, marketTime2YearsAgo: 57, medianActiveListPrice: "$799k" },
  { city: "Rossmoor", region: "North OC", currentActives: 9, demand30Days: 3, marketTimeDays: 90, marketTime2WeeksAgo: 45, marketTime4WeeksAgo: 135, marketTime1YearAgo: 21, marketTime2YearsAgo: 40, medianActiveListPrice: "$1.9m" },
  { city: "San Clemente", region: "Coastal", currentActives: 130, demand30Days: 47, marketTimeDays: 83, marketTime2WeeksAgo: 70, marketTime4WeeksAgo: 68, marketTime1YearAgo: 88, marketTime2YearsAgo: 86, medianActiveListPrice: "$2.2m" },
  { city: "San Juan Capistrano", region: "South OC", currentActives: 76, demand30Days: 18, marketTimeDays: 127, marketTime2WeeksAgo: 103, marketTime4WeeksAgo: 74, marketTime1YearAgo: 116, marketTime2YearsAgo: 66, medianActiveListPrice: "$2.5m" },
  { city: "Santa Ana", region: "Central OC", currentActives: 225, demand30Days: 62, marketTimeDays: 109, marketTime2WeeksAgo: 112, marketTime4WeeksAgo: 94, marketTime1YearAgo: 86, marketTime2YearsAgo: 58, medianActiveListPrice: "$850k" },
  { city: "Seal Beach", region: "Coastal", currentActives: 98, demand30Days: 42, marketTimeDays: 70, marketTime2WeeksAgo: 72, marketTime4WeeksAgo: 61, marketTime1YearAgo: 60, marketTime2YearsAgo: 65, medianActiveListPrice: "$482k" },
  { city: "Stanton", region: "Central OC", currentActives: 24, demand30Days: 8, marketTimeDays: 90, marketTime2WeeksAgo: 72, marketTime4WeeksAgo: 77, marketTime1YearAgo: 107, marketTime2YearsAgo: 57, medianActiveListPrice: "$665k" },
  { city: "Talega", region: "Coastal", currentActives: 29, demand30Days: 9, marketTimeDays: 97, marketTime2WeeksAgo: 98, marketTime4WeeksAgo: 66, marketTime1YearAgo: 90, marketTime2YearsAgo: 54, medianActiveListPrice: "$2.1m" },
  { city: "Tustin", region: "Central OC", currentActives: 98, demand30Days: 32, marketTimeDays: 92, marketTime2WeeksAgo: 83, marketTime4WeeksAgo: 71, marketTime1YearAgo: 85, marketTime2YearsAgo: 33, medianActiveListPrice: "$1.1m" },
  { city: "Villa Park", region: "Central OC", currentActives: 9, demand30Days: 4, marketTimeDays: 68, marketTime2WeeksAgo: 48, marketTime4WeeksAgo: 35, marketTime1YearAgo: 108, marketTime2YearsAgo: 255, medianActiveListPrice: "$3.3m" },
  { city: "Westminster", region: "Central OC", currentActives: 55, demand30Days: 20, marketTimeDays: 83, marketTime2WeeksAgo: 102, marketTime4WeeksAgo: 90, marketTime1YearAgo: 44, marketTime2YearsAgo: 50, medianActiveListPrice: "$1.2m" },
  { city: "Yorba Linda", region: "North OC", currentActives: 150, demand30Days: 52, marketTimeDays: 87, marketTime2WeeksAgo: 81, marketTime4WeeksAgo: 79, marketTime1YearAgo: 99, marketTime2YearsAgo: 46, medianActiveListPrice: "$1.6m" },
];

export const OC_PRICE_RANGE_REPORT_ALL: OCPriceRangeEntry[] = [
  { priceRange: "$0-$500k", currentActives: 388, demand30Days: 104, marketTimeDays: 112, marketTime2WeeksAgo: 94, marketTime4WeeksAgo: 97, marketTime1YearAgo: 67, marketTime2YearsAgo: 56, medianActivePrice: "$403k" },
  { priceRange: "$500k-$750k", currentActives: 631, demand30Days: 216, marketTimeDays: 88, marketTime2WeeksAgo: 84, marketTime4WeeksAgo: 84, marketTime1YearAgo: 81, marketTime2YearsAgo: 42, medianActivePrice: "$635k" },
  { priceRange: "$750k-$1m", currentActives: 745, demand30Days: 281, marketTimeDays: 80, marketTime2WeeksAgo: 72, marketTime4WeeksAgo: 74, marketTime1YearAgo: 64, marketTime2YearsAgo: 46, medianActivePrice: "$890k" },
  { priceRange: "$1m-$1.25m", currentActives: 585, demand30Days: 225, marketTimeDays: 78, marketTime2WeeksAgo: 65, marketTime4WeeksAgo: 62, marketTime1YearAgo: 73, marketTime2YearsAgo: 46, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 568, demand30Days: 210, marketTimeDays: 81, marketTime2WeeksAgo: 75, marketTime4WeeksAgo: 65, marketTime1YearAgo: 90, marketTime2YearsAgo: 52, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 703, demand30Days: 191, marketTimeDays: 110, marketTime2WeeksAgo: 92, marketTime4WeeksAgo: 77, marketTime1YearAgo: 95, marketTime2YearsAgo: 65, medianActivePrice: "$1.7m" },
  { priceRange: "$2m-$2.5m", currentActives: 347, demand30Days: 81, marketTimeDays: 129, marketTime2WeeksAgo: 103, marketTime4WeeksAgo: 109, marketTime1YearAgo: 123, marketTime2YearsAgo: 0, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 499, demand30Days: 99, marketTimeDays: 151, marketTime2WeeksAgo: 124, marketTime4WeeksAgo: 125, marketTime1YearAgo: 146, marketTime2YearsAgo: 0, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 236, demand30Days: 37, marketTimeDays: 191, marketTime2WeeksAgo: 209, marketTime4WeeksAgo: 267, marketTime1YearAgo: 161, marketTime2YearsAgo: 320, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 318, demand30Days: 28, marketTimeDays: 341, marketTime2WeeksAgo: 295, marketTime4WeeksAgo: 284, marketTime1YearAgo: 320, marketTime2YearsAgo: 156, medianActivePrice: "$10.0m" },
];

export const OC_PRICE_RANGE_REPORT_ATTACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Attached", currentActives: 2218, demand30Days: 592, marketTimeDays: 112, marketTime2WeeksAgo: 103, marketTime4WeeksAgo: 100, marketTime1YearAgo: 94, marketTime2YearsAgo: 58, medianActivePrice: "$803k" },
  { priceRange: "$0-$500k", currentActives: 378, demand30Days: 101, marketTimeDays: 112, marketTime2WeeksAgo: 95, marketTime4WeeksAgo: 98, marketTime1YearAgo: 67, marketTime2YearsAgo: 57, medianActivePrice: "$400k" },
  { priceRange: "$500k-$750k", currentActives: 606, demand30Days: 198, marketTimeDays: 92, marketTime2WeeksAgo: 86, marketTime4WeeksAgo: 85, marketTime1YearAgo: 88, marketTime2YearsAgo: 43, medianActivePrice: "$635k" },
  { priceRange: "$750k-$1m", currentActives: 521, demand30Days: 158, marketTimeDays: 99, marketTime2WeeksAgo: 96, marketTime4WeeksAgo: 103, marketTime1YearAgo: 83, marketTime2YearsAgo: 52, medianActivePrice: "$875k" },
  { priceRange: "$1m-$2m", currentActives: 561, demand30Days: 117, marketTimeDays: 144, marketTime2WeeksAgo: 129, marketTime4WeeksAgo: 100, marketTime1YearAgo: 129, marketTime2YearsAgo: 69, medianActivePrice: "$1.3m" },
  { priceRange: "$2m+", currentActives: 152, demand30Days: 18, marketTimeDays: 253, marketTime2WeeksAgo: 224, marketTime4WeeksAgo: 222, marketTime1YearAgo: 170, marketTime2YearsAgo: 223, medianActivePrice: "$3.0m" },
];

export const OC_PRICE_RANGE_REPORT_DETACHED: OCPriceRangeEntry[] = [
  { priceRange: "All Detached", currentActives: 2802, demand30Days: 880, marketTimeDays: 96, marketTime2WeeksAgo: 82, marketTime4WeeksAgo: 80, marketTime1YearAgo: 97, marketTime2YearsAgo: 71, medianActivePrice: "$1.9m" },
  { priceRange: "$0-$750k", currentActives: 35, demand30Days: 21, marketTimeDays: 50, marketTime2WeeksAgo: 58, marketTime4WeeksAgo: 66, marketTime1YearAgo: 97, marketTime2YearsAgo: 39, medianActivePrice: "$625k" },
  { priceRange: "$750k-$1m", currentActives: 224, demand30Days: 123, marketTimeDays: 55, marketTime2WeeksAgo: 45, marketTime4WeeksAgo: 44, marketTime1YearAgo: 45, marketTime2YearsAgo: 40, medianActivePrice: "$915k" },
  { priceRange: "$1m-$1.25m", currentActives: 324, demand30Days: 162, marketTimeDays: 60, marketTime2WeeksAgo: 48, marketTime4WeeksAgo: 50, marketTime1YearAgo: 59, marketTime2YearsAgo: 42, medianActivePrice: "$1.1m" },
  { priceRange: "$1.25m-$1.5m", currentActives: 399, demand30Days: 177, marketTimeDays: 68, marketTime2WeeksAgo: 58, marketTime4WeeksAgo: 57, marketTime1YearAgo: 78, marketTime2YearsAgo: 47, medianActivePrice: "$1.4m" },
  { priceRange: "$1.5m-$2m", currentActives: 572, demand30Days: 170, marketTimeDays: 101, marketTime2WeeksAgo: 89, marketTime4WeeksAgo: 70, marketTime1YearAgo: 89, marketTime2YearsAgo: 61, medianActivePrice: "$1.8m" },
  { priceRange: "$2m-$2.5m", currentActives: 301, demand30Days: 75, marketTimeDays: 120, marketTime2WeeksAgo: 99, marketTime4WeeksAgo: 107, marketTime1YearAgo: 118, marketTime2YearsAgo: 0, medianActivePrice: "$2.3m" },
  { priceRange: "$2.5m-$4m", currentActives: 439, demand30Days: 92, marketTimeDays: 143, marketTime2WeeksAgo: 119, marketTime4WeeksAgo: 118, marketTime1YearAgo: 167, marketTime2YearsAgo: 0, medianActivePrice: "$3.1m" },
  { priceRange: "$4m-$6m", currentActives: 207, demand30Days: 33, marketTimeDays: 188, marketTime2WeeksAgo: 187, marketTime4WeeksAgo: 242, marketTime1YearAgo: 314, marketTime2YearsAgo: 152, medianActivePrice: "$5.0m" },
  { priceRange: "$6m+", currentActives: 301, demand30Days: 27, marketTimeDays: 334, marketTime2WeeksAgo: 288, marketTime4WeeksAgo: 275, marketTime1YearAgo: 371, marketTime2YearsAgo: 606, medianActivePrice: "$10.3m" },
];

export const OC_SOLD_REPORT: OCSoldReportEntry[] = [
  { city: "Aliso Viejo", unitsSoldJune2026: 34, medianSalesPrice: "$907,000", medianListPrice: "$909,000", salesToListRatio: "99.4%", lowPrice: "$580,000", highPrice: "$2,950,000", medianSqFt: 1419, medianPricePerSqFt: "$639", medianDOM: 16, unitsSoldJune2025: 40 },
  { city: "Anaheim", unitsSoldJune2026: 111, medianSalesPrice: "$935,000", medianListPrice: "$919,000", salesToListRatio: "100.1%", lowPrice: "$370,000", highPrice: "$1,860,000", medianSqFt: 1508, medianPricePerSqFt: "$620", medianDOM: 13, unitsSoldJune2025: 92 },
  { city: "Anaheim Hills", unitsSoldJune2026: 32, medianSalesPrice: "$1,362,500", medianListPrice: "$1,344,000", salesToListRatio: "99.3%", lowPrice: "$645,000", highPrice: "$2,575,000", medianSqFt: 2122, medianPricePerSqFt: "$642", medianDOM: 14, unitsSoldJune2025: 28 },
  { city: "Brea", unitsSoldJune2026: 31, medianSalesPrice: "$1,190,000", medianListPrice: "$1,150,000", salesToListRatio: "100.0%", lowPrice: "$615,000", highPrice: "$3,420,000", medianSqFt: 1999, medianPricePerSqFt: "$595", medianDOM: 11, unitsSoldJune2025: 30 },
  { city: "Buena Park", unitsSoldJune2026: 42, medianSalesPrice: "$881,000", medianListPrice: "$899,000", salesToListRatio: "100.0%", lowPrice: "$580,000", highPrice: "$1,500,000", medianSqFt: 1503, medianPricePerSqFt: "$586", medianDOM: 15, unitsSoldJune2025: 19 },
  { city: "Corona Del Mar", unitsSoldJune2026: 26, medianSalesPrice: "$3,800,000", medianListPrice: "$3,892,500", salesToListRatio: "97.9%", lowPrice: "$1,375,000", highPrice: "$13,500,000", medianSqFt: 2376, medianPricePerSqFt: "$1,599", medianDOM: 52, unitsSoldJune2025: 15 },
  { city: "Costa Mesa", unitsSoldJune2026: 58, medianSalesPrice: "$1,500,000", medianListPrice: "$1,500,000", salesToListRatio: "98.5%", lowPrice: "$639,000", highPrice: "$3,748,000", medianSqFt: 1638, medianPricePerSqFt: "$916", medianDOM: 21, unitsSoldJune2025: 60 },
  { city: "Coto De Caza", unitsSoldJune2026: 13, medianSalesPrice: "$1,950,000", medianListPrice: "$1,849,000", salesToListRatio: "98.3%", lowPrice: "$1,080,000", highPrice: "$23,000,000", medianSqFt: 3769, medianPricePerSqFt: "$517", medianDOM: 15, unitsSoldJune2025: 19 },
  { city: "Cypress", unitsSoldJune2026: 38, medianSalesPrice: "$1,050,000", medianListPrice: "$999,999", salesToListRatio: "100.0%", lowPrice: "$575,000", highPrice: "$2,175,000", medianSqFt: 1634, medianPricePerSqFt: "$643", medianDOM: 17, unitsSoldJune2025: 21 },
  { city: "Dana Point", unitsSoldJune2026: 33, medianSalesPrice: "$2,100,000", medianListPrice: "$2,200,000", salesToListRatio: "100.0%", lowPrice: "$608,000", highPrice: "$17,500,000", medianSqFt: 2067, medianPricePerSqFt: "$1,016", medianDOM: 8, unitsSoldJune2025: 49 },
  { city: "Dove Canyon", unitsSoldJune2026: 1, medianSalesPrice: "$1,850,000", medianListPrice: "$1,865,000", salesToListRatio: "99.2%", lowPrice: "$1,850,000", highPrice: "$1,850,000", medianSqFt: 3063, medianPricePerSqFt: "$604", medianDOM: 58, unitsSoldJune2025: 4 },
  { city: "Foothill Ranch", unitsSoldJune2026: 9, medianSalesPrice: "$940,000", medianListPrice: "$950,000", salesToListRatio: "100.0%", lowPrice: "$777,500", highPrice: "$1,849,000", medianSqFt: 1423, medianPricePerSqFt: "$661", medianDOM: 10, unitsSoldJune2025: 11 },
  { city: "Fountain Valley", unitsSoldJune2026: 28, medianSalesPrice: "$1,395,000", medianListPrice: "$1,325,000", salesToListRatio: "100.3%", lowPrice: "$465,000", highPrice: "$1,922,000", medianSqFt: 1747, medianPricePerSqFt: "$799", medianDOM: 8, unitsSoldJune2025: 30 },
  { city: "Fullerton", unitsSoldJune2026: 64, medianSalesPrice: "$1,085,000", medianListPrice: "$1,075,000", salesToListRatio: "100.0%", lowPrice: "$365,000", highPrice: "$2,950,000", medianSqFt: 1781, medianPricePerSqFt: "$609", medianDOM: 10, unitsSoldJune2025: 74 },
  { city: "Garden Grove", unitsSoldJune2026: 50, medianSalesPrice: "$1,064,000", medianListPrice: "$1,050,000", salesToListRatio: "100.0%", lowPrice: "$350,000", highPrice: "$1,575,000", medianSqFt: 1400, medianPricePerSqFt: "$760", medianDOM: 14, unitsSoldJune2025: 54 },
  { city: "Huntington Beach", unitsSoldJune2026: 139, medianSalesPrice: "$1,375,000", medianListPrice: "$1,395,000", salesToListRatio: "100.0%", lowPrice: "$445,000", highPrice: "$5,400,000", medianSqFt: 1657, medianPricePerSqFt: "$830", medianDOM: 18, unitsSoldJune2025: 124 },
  { city: "Irvine", unitsSoldJune2026: 191, medianSalesPrice: "$1,625,000", medianListPrice: "$1,660,000", salesToListRatio: "98.1%", lowPrice: "$465,000", highPrice: "$6,000,000", medianSqFt: 2033, medianPricePerSqFt: "$799", medianDOM: 25, unitsSoldJune2025: 161 },
  { city: "La Habra", unitsSoldJune2026: 25, medianSalesPrice: "$787,840", medianListPrice: "$788,000", salesToListRatio: "100.0%", lowPrice: "$550,000", highPrice: "$2,320,000", medianSqFt: 1390, medianPricePerSqFt: "$567", medianDOM: 20, unitsSoldJune2025: 29 },
  { city: "La Palma", unitsSoldJune2026: 7, medianSalesPrice: "$1,150,000", medianListPrice: "$1,150,000", salesToListRatio: "100.0%", lowPrice: "$938,000", highPrice: "$1,460,000", medianSqFt: 2222, medianPricePerSqFt: "$518", medianDOM: 11, unitsSoldJune2025: 8 },
  { city: "Ladera Ranch", unitsSoldJune2026: 28, medianSalesPrice: "$1,755,000", medianListPrice: "$1,799,500", salesToListRatio: "99.5%", lowPrice: "$723,000", highPrice: "$3,500,000", medianSqFt: 2571, medianPricePerSqFt: "$683", medianDOM: 15, unitsSoldJune2025: 28 },
  { city: "Laguna Beach", unitsSoldJune2026: 28, medianSalesPrice: "$3,395,000", medianListPrice: "$3,477,000", salesToListRatio: "97.2%", lowPrice: "$1,220,000", highPrice: "$10,800,000", medianSqFt: 2236, medianPricePerSqFt: "$1,518", medianDOM: 32, unitsSoldJune2025: 29 },
  { city: "Laguna Hills", unitsSoldJune2026: 19, medianSalesPrice: "$1,450,000", medianListPrice: "$1,500,000", salesToListRatio: "100.2%", lowPrice: "$205,000", highPrice: "$4,800,000", medianSqFt: 2305, medianPricePerSqFt: "$629", medianDOM: 7, unitsSoldJune2025: 17 },
  { city: "Laguna Niguel", unitsSoldJune2026: 78, medianSalesPrice: "$1,585,000", medianListPrice: "$1,587,450", salesToListRatio: "99.7%", lowPrice: "$575,000", highPrice: "$12,000,000", medianSqFt: 1952, medianPricePerSqFt: "$812", medianDOM: 15, unitsSoldJune2025: 68 },
  { city: "Laguna Woods", unitsSoldJune2026: 54, medianSalesPrice: "$468,500", medianListPrice: "$481,500", salesToListRatio: "98.1%", lowPrice: "$95,000", highPrice: "$1,348,000", medianSqFt: 1080, medianPricePerSqFt: "$434", medianDOM: 36, unitsSoldJune2025: 57 },
  { city: "Lake Forest", unitsSoldJune2026: 81, medianSalesPrice: "$1,301,500", medianListPrice: "$1,299,900", salesToListRatio: "100.0%", lowPrice: "$355,000", highPrice: "$3,260,000", medianSqFt: 1946, medianPricePerSqFt: "$669", medianDOM: 14, unitsSoldJune2025: 47 },
  { city: "Los Alamitos", unitsSoldJune2026: 6, medianSalesPrice: "$1,562,500", medianListPrice: "$1,549,950", salesToListRatio: "100.8%", lowPrice: "$1,360,000", highPrice: "$3,200,000", medianSqFt: 2094, medianPricePerSqFt: "$746", medianDOM: 5, unitsSoldJune2025: 6 },
  { city: "Mission Viejo", unitsSoldJune2026: 92, medianSalesPrice: "$1,292,500", medianListPrice: "$1,299,444", salesToListRatio: "99.1%", lowPrice: "$355,000", highPrice: "$2,750,000", medianSqFt: 1771, medianPricePerSqFt: "$730", medianDOM: 21, unitsSoldJune2025: 86 },
  { city: "Newport Beach", unitsSoldJune2026: 66, medianSalesPrice: "$3,700,000", medianListPrice: "$3,795,000", salesToListRatio: "96.9%", lowPrice: "$810,000", highPrice: "$27,500,000", medianSqFt: 2540, medianPricePerSqFt: "$1,457", medianDOM: 28, unitsSoldJune2025: 70 },
  { city: "Newport Coast", unitsSoldJune2026: 7, medianSalesPrice: "$12,900,000", medianListPrice: "$13,988,800", salesToListRatio: "95.1%", lowPrice: "$6,000,000", highPrice: "$38,000,000", medianSqFt: 7800, medianPricePerSqFt: "$1,654", medianDOM: 63, unitsSoldJune2025: 9 },
  { city: "North Tustin", unitsSoldJune2026: 14, medianSalesPrice: "$1,927,500", medianListPrice: "$1,897,500", salesToListRatio: "99.4%", lowPrice: "$1,400,000", highPrice: "$6,500,000", medianSqFt: 2763, medianPricePerSqFt: "$698", medianDOM: 13, unitsSoldJune2025: 15 },
  { city: "Orange", unitsSoldJune2026: 74, medianSalesPrice: "$1,205,000", medianListPrice: "$1,166,500", salesToListRatio: "100.4%", lowPrice: "$499,800", highPrice: "$2,075,000", medianSqFt: 1700, medianPricePerSqFt: "$709", medianDOM: 12, unitsSoldJune2025: 78 },
  { city: "Placentia", unitsSoldJune2026: 34, medianSalesPrice: "$1,180,000", medianListPrice: "$1,189,500", salesToListRatio: "100.0%", lowPrice: "$540,000", highPrice: "$1,965,000", medianSqFt: 2026, medianPricePerSqFt: "$582", medianDOM: 12, unitsSoldJune2025: 26 },
  { city: "Portola Hills", unitsSoldJune2026: 6, medianSalesPrice: "$827,500", medianListPrice: "$802,000", salesToListRatio: "99.7%", lowPrice: "$520,000", highPrice: "$3,231,882", medianSqFt: 1341, medianPricePerSqFt: "$617", medianDOM: 23, unitsSoldJune2025: 6 },
  { city: "Rancho Mission Viejo", unitsSoldJune2026: 45, medianSalesPrice: "$1,308,000", medianListPrice: "$1,325,000", salesToListRatio: "100.0%", lowPrice: "$595,000", highPrice: "$2,400,000", medianSqFt: 1990, medianPricePerSqFt: "$657", medianDOM: 33, unitsSoldJune2025: 22 },
  { city: "Rancho Santa Margarita", unitsSoldJune2026: 26, medianSalesPrice: "$860,000", medianListPrice: "$859,500", salesToListRatio: "100.0%", lowPrice: "$365,000", highPrice: "$1,580,000", medianSqFt: 1380, medianPricePerSqFt: "$623", medianDOM: 15, unitsSoldJune2025: 36 },
  { city: "Rossmoor", unitsSoldJune2026: 4, medianSalesPrice: "$1,715,000", medianListPrice: "$1,724,000", salesToListRatio: "98.7%", lowPrice: "$1,575,000", highPrice: "$2,350,000", medianSqFt: 2199, medianPricePerSqFt: "$780", medianDOM: 28, unitsSoldJune2025: 7 },
  { city: "San Clemente", unitsSoldJune2026: 62, medianSalesPrice: "$1,800,000", medianListPrice: "$1,824,500", salesToListRatio: "99.2%", lowPrice: "$460,000", highPrice: "$5,375,000", medianSqFt: 2110, medianPricePerSqFt: "$853", medianDOM: 11, unitsSoldJune2025: 59 },
  { city: "San Juan Capistrano", unitsSoldJune2026: 35, medianSalesPrice: "$1,765,000", medianListPrice: "$1,775,000", salesToListRatio: "98.6%", lowPrice: "$515,000", highPrice: "$13,850,000", medianSqFt: 2682, medianPricePerSqFt: "$658", medianDOM: 9, unitsSoldJune2025: 26 },
  { city: "Santa Ana", unitsSoldJune2026: 81, medianSalesPrice: "$850,000", medianListPrice: "$815,000", salesToListRatio: "100.0%", lowPrice: "$310,000", highPrice: "$3,700,000", medianSqFt: 1275, medianPricePerSqFt: "$667", medianDOM: 20, unitsSoldJune2025: 79 },
  { city: "Seal Beach", unitsSoldJune2026: 44, medianSalesPrice: "$385,000", medianListPrice: "$388,500", salesToListRatio: "100.0%", lowPrice: "$205,000", highPrice: "$4,600,000", medianSqFt: 1021, medianPricePerSqFt: "$377", medianDOM: 12, unitsSoldJune2025: 45 },
  { city: "Stanton", unitsSoldJune2026: 15, medianSalesPrice: "$621,000", medianListPrice: "$599,000", salesToListRatio: "100.0%", lowPrice: "$390,000", highPrice: "$1,025,000", medianSqFt: 1027, medianPricePerSqFt: "$605", medianDOM: 14, unitsSoldJune2025: 13 },
  { city: "Talega", unitsSoldJune2026: 10, medianSalesPrice: "$1,935,000", medianListPrice: "$1,947,000", salesToListRatio: "99.7%", lowPrice: "$1,065,000", highPrice: "$3,600,000", medianSqFt: 3008, medianPricePerSqFt: "$643", medianDOM: 43, unitsSoldJune2025: 10 },
  { city: "Tustin", unitsSoldJune2026: 49, medianSalesPrice: "$1,195,000", medianListPrice: "$1,199,900", salesToListRatio: "100.0%", lowPrice: "$426,000", highPrice: "$2,739,900", medianSqFt: 1590, medianPricePerSqFt: "$752", medianDOM: 10, unitsSoldJune2025: 42 },
  { city: "Villa Park", unitsSoldJune2026: 3, medianSalesPrice: "$2,993,850", medianListPrice: "$2,999,888", salesToListRatio: "94.7%", lowPrice: "$2,450,000", highPrice: "$3,500,000", medianSqFt: 3916, medianPricePerSqFt: "$765", medianDOM: 43, unitsSoldJune2025: 4 },
  { city: "Westminster", unitsSoldJune2026: 28, medianSalesPrice: "$1,147,288", medianListPrice: "$1,125,000", salesToListRatio: "100.8%", lowPrice: "$780,000", highPrice: "$1,500,000", medianSqFt: 1663, medianPricePerSqFt: "$690", medianDOM: 13, unitsSoldJune2025: 20 },
  { city: "Yorba Linda", unitsSoldJune2026: 66, medianSalesPrice: "$1,324,500", medianListPrice: "$1,299,750", salesToListRatio: "100.0%", lowPrice: "$437,000", highPrice: "$3,779,000", medianSqFt: 1862, medianPricePerSqFt: "$712", medianDOM: 12, unitsSoldJune2025: 48 },
  { city: "All of O.C.", unitsSoldJune2026: 1994, medianSalesPrice: "$1,256,412", medianListPrice: "$1,250,000", salesToListRatio: "99.9%", lowPrice: "$95,000", highPrice: "$38,000,000", medianSqFt: 1753, medianPricePerSqFt: "$717", medianDOM: 15, unitsSoldJune2025: 1828 }
];

export const OC_SITTING_ON_MARKET_REPORT: OCSittingOnMarketEntry[] = [
  { priceRange: "$0-$750k", currentActives: 1019, actives30PlusDays: 673, percent30PlusDays: "66%", actives60PlusDays: 440, percent60PlusDays: "43%", marketTimeDays: 96, offMarketJanJun: 686 },
  { priceRange: "$750k-$1m", currentActives: 745, actives30PlusDays: 434, percent30PlusDays: "58%", actives60PlusDays: 259, percent60PlusDays: "35%", marketTimeDays: 80, offMarketJanJun: 535 },
  { priceRange: "$1m-$1.5m", currentActives: 1153, actives30PlusDays: 660, percent30PlusDays: "57%", actives60PlusDays: 356, percent60PlusDays: "31%", marketTimeDays: 80, offMarketJanJun: 748 },
  { priceRange: "$1.5m-$2m", currentActives: 703, actives30PlusDays: 437, percent30PlusDays: "62%", actives60PlusDays: 265, percent60PlusDays: "38%", marketTimeDays: 110, offMarketJanJun: 555 },
  { priceRange: "$2m-$2.5m", currentActives: 347, actives30PlusDays: 215, percent30PlusDays: "62%", actives60PlusDays: 129, percent60PlusDays: "37%", marketTimeDays: 129, offMarketJanJun: 303 },
  { priceRange: "$2.5m-$4m", currentActives: 499, actives30PlusDays: 355, percent30PlusDays: "71%", actives60PlusDays: 249, percent60PlusDays: "50%", marketTimeDays: 151, offMarketJanJun: 440 },
  { priceRange: "$4m-$6m", currentActives: 236, actives30PlusDays: 180, percent30PlusDays: "76%", actives60PlusDays: 131, percent60PlusDays: "56%", marketTimeDays: 191, offMarketJanJun: 177 },
  { priceRange: "$6m+", currentActives: 318, actives30PlusDays: 256, percent30PlusDays: "81%", actives60PlusDays: 213, percent60PlusDays: "67%", marketTimeDays: 341, offMarketJanJun: 225 },
  { priceRange: "All of O.C.", currentActives: 5020, actives30PlusDays: 3210, percent30PlusDays: "64%", actives60PlusDays: 2042, percent60PlusDays: "41%", marketTimeDays: 102, offMarketJanJun: 3669 }
];

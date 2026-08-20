export interface OCFastMetricItem {
  key: string;
  label: string;
  category: 'volume' | 'pricing' | 'velocity' | 'inventory';
  // July Monthly
  july2025: string;
  july2026: string;
  monthlyChange: string;
  monthlyChangeNumeric: number;
  // Year to Date
  ytd2025?: string;
  ytd2026?: string;
  ytdChange?: string;
  ytdChangeNumeric?: number;
  unit?: string;
}

export interface OCFastHistoricalPoint {
  date: string;
  label: string;
  year: number;
  attachedMedian: number;
  detachedMedian: number;
}

export const OC_FAST_METADATA = {
  reportName: "OC Fast",
  reportSubtitle: "Local Market Update – July 2026",
  providedBy: "Orange County REALTORS®",
  associationTagline: "Association of Professionals",
  currentAsOf: "August 5, 2026",
  copyright: "Data © 2026 and provided by CRMLS, Inc. Report © 2026 ShowingTime Plus, LLC.",
  disclaimer: "* Does not account for sale concessions and/or downpayment assistance. | Percent changes are calculated using rounded figures and can sometimes look extreme due to small sample size.",
  period: "July 2026 & Year to Date (Thru 7-2026)",
  region: "Orange County (Countywide)",
};

export const OC_FAST_SUMMARY_POINTS = [
  {
    title: "DETACHED SALES PRICE SURGE",
    stat: "$1,460,000 Median / $2,086,508 Avg",
    trend: "+12.0% Average Price YoY",
    description: "Detached single-family homes in Orange County saw average sales prices climb +12.0% in July to $2,086,508 (up from $1,863,601). Median sales price gained +2.8% to $1,460,000.",
    type: "positive"
  },
  {
    title: "ATTACHED (CONDO) MARKET SOFTENING",
    stat: "$767,500 Median / 42 Days DOM",
    trend: "-2.1% Median Price / +20% DOM",
    description: "Condo & townhome median prices dipped -2.1% to $767,500 with days on market expanding to 42 days (+20.0%). Inventory expanded +2.8% to 2,623 active units.",
    type: "caution"
  },
  {
    title: "DETACHED INVENTORY TIGHTENING",
    stat: "3,355 Homes (-16.6%)",
    trend: "3.3 Months Supply (-15.4%)",
    description: "Single-family detached inventory tightened significantly, dropping -16.6% year-over-year to 3,355 homes, bringing months of supply down from 3.9 to 3.3 months.",
    type: "positive"
  },
  {
    title: "HIGH LIST-TO-SALE REALIZATION",
    stat: "99.5% Detached / 99.0% Attached",
    trend: "Up to 98.1% of Original List",
    description: "Sellers continue capturing near 100% of their final asking price across Orange County (99.5% for detached, 99.0% for attached), with original list price capture averaging 98.1% for SFH.",
    type: "neutral"
  }
];

export const OC_FAST_ATTACHED_METRICS: OCFastMetricItem[] = [
  {
    key: "new_listings",
    label: "New Listings",
    category: "volume",
    july2025: "1,159",
    july2026: "978",
    monthlyChange: "-15.6%",
    monthlyChangeNumeric: -15.6,
    ytd2025: "7,451",
    ytd2026: "7,403",
    ytdChange: "-0.6%",
    ytdChangeNumeric: -0.6,
    unit: "units"
  },
  {
    key: "pending_sales",
    label: "Pending Sales",
    category: "volume",
    july2025: "745",
    july2026: "410",
    monthlyChange: "-45.0%",
    monthlyChangeNumeric: -45.0,
    ytd2025: "4,831",
    ytd2026: "4,490",
    ytdChange: "-7.1%",
    ytdChangeNumeric: -7.1,
    unit: "units"
  },
  {
    key: "closed_sales",
    label: "Closed Sales",
    category: "volume",
    july2025: "731",
    july2026: "727",
    monthlyChange: "-0.5%",
    monthlyChangeNumeric: -0.5,
    ytd2025: "4,591",
    ytd2026: "4,622",
    ytdChange: "+0.7%",
    ytdChangeNumeric: 0.7,
    unit: "units"
  },
  {
    key: "dom",
    label: "Days on Market Until Sale",
    category: "velocity",
    july2025: "35",
    july2026: "42",
    monthlyChange: "+20.0%",
    monthlyChangeNumeric: 20.0,
    ytd2025: "33",
    ytd2026: "40",
    ytdChange: "+21.2%",
    ytdChangeNumeric: 21.2,
    unit: "days"
  },
  {
    key: "median_price",
    label: "Median Sales Price*",
    category: "pricing",
    july2025: "$784,000",
    july2026: "$767,500",
    monthlyChange: "-2.1%",
    monthlyChangeNumeric: -2.1,
    ytd2025: "$780,000",
    ytd2026: "$790,000",
    ytdChange: "+1.3%",
    ytdChangeNumeric: 1.3,
    unit: "currency"
  },
  {
    key: "avg_price",
    label: "Average Sales Price*",
    category: "pricing",
    july2025: "$927,084",
    july2026: "$914,628",
    monthlyChange: "-1.3%",
    monthlyChangeNumeric: -1.3,
    ytd2025: "$922,609",
    ytd2026: "$944,282",
    ytdChange: "+2.3%",
    ytdChangeNumeric: 2.3,
    unit: "currency"
  },
  {
    key: "pct_orig_price",
    label: "Percent of Original List Price Received*",
    category: "pricing",
    july2025: "97.3%",
    july2026: "97.1%",
    monthlyChange: "-0.2%",
    monthlyChangeNumeric: -0.2,
    ytd2025: "98.3%",
    ytd2026: "97.5%",
    ytdChange: "-0.8%",
    ytdChangeNumeric: -0.8,
    unit: "percent"
  },
  {
    key: "pct_list_price",
    label: "Percent of List Price Received*",
    category: "pricing",
    july2025: "98.9%",
    july2026: "99.0%",
    monthlyChange: "+0.1%",
    monthlyChangeNumeric: 0.1,
    ytd2025: "99.5%",
    ytd2026: "99.1%",
    ytdChange: "-0.4%",
    ytdChangeNumeric: -0.4,
    unit: "percent"
  },
  {
    key: "inventory",
    label: "Inventory of Homes for Sale",
    category: "inventory",
    july2025: "2,551",
    july2026: "2,623",
    monthlyChange: "+2.8%",
    monthlyChangeNumeric: 2.8,
    ytd2025: "—",
    ytd2026: "—",
    ytdChange: "—",
    unit: "units"
  },
  {
    key: "months_supply",
    label: "Months Supply of Inventory",
    category: "inventory",
    july2025: "3.9",
    july2026: "4.2",
    monthlyChange: "+7.7%",
    monthlyChangeNumeric: 7.7,
    ytd2025: "—",
    ytd2026: "—",
    ytdChange: "—",
    unit: "months"
  },
  {
    key: "price_sqft",
    label: "Price Per Square Foot*",
    category: "pricing",
    july2025: "$622.28",
    july2026: "$617.03",
    monthlyChange: "-0.8%",
    monthlyChangeNumeric: -0.8,
    ytd2025: "$621.37",
    ytd2026: "$620.01",
    ytdChange: "-0.2%",
    ytdChangeNumeric: -0.2,
    unit: "currency"
  }
];

export const OC_FAST_DETACHED_METRICS: OCFastMetricItem[] = [
  {
    key: "new_listings",
    label: "New Listings",
    category: "volume",
    july2025: "1,739",
    july2026: "1,454",
    monthlyChange: "-16.4%",
    monthlyChangeNumeric: -16.4,
    ytd2025: "11,941",
    ytd2026: "11,043",
    ytdChange: "-7.5%",
    ytdChangeNumeric: -7.5,
    unit: "units"
  },
  {
    key: "pending_sales",
    label: "Pending Sales",
    category: "volume",
    july2025: "1,248",
    july2026: "698",
    monthlyChange: "-44.1%",
    monthlyChangeNumeric: -44.1,
    ytd2025: "7,628",
    ytd2026: "7,300",
    ytdChange: "-4.3%",
    ytdChangeNumeric: -4.3,
    unit: "units"
  },
  {
    key: "closed_sales",
    label: "Closed Sales",
    category: "volume",
    july2025: "1,185",
    july2026: "1,198",
    monthlyChange: "+1.1%",
    monthlyChangeNumeric: 1.1,
    ytd2025: "7,227",
    ytd2026: "7,425",
    ytdChange: "+2.7%",
    ytdChangeNumeric: 2.7,
    unit: "units"
  },
  {
    key: "dom",
    label: "Days on Market Until Sale",
    category: "velocity",
    july2025: "32",
    july2026: "32",
    monthlyChange: "0.0%",
    monthlyChangeNumeric: 0.0,
    ytd2025: "30",
    ytd2026: "32",
    ytdChange: "+6.7%",
    ytdChangeNumeric: 6.7,
    unit: "days"
  },
  {
    key: "median_price",
    label: "Median Sales Price*",
    category: "pricing",
    july2025: "$1,420,000",
    july2026: "$1,460,000",
    monthlyChange: "+2.8%",
    monthlyChangeNumeric: 2.8,
    ytd2025: "$1,450,000",
    ytd2026: "$1,479,000",
    ytdChange: "+2.0%",
    ytdChangeNumeric: 2.0,
    unit: "currency"
  },
  {
    key: "avg_price",
    label: "Average Sales Price*",
    category: "pricing",
    july2025: "$1,863,601",
    july2026: "$2,086,508",
    monthlyChange: "+12.0%",
    monthlyChangeNumeric: 12.0,
    ytd2025: "$1,966,225",
    ytd2026: "$2,037,423",
    ytdChange: "+3.6%",
    ytdChangeNumeric: 3.6,
    unit: "currency"
  },
  {
    key: "pct_orig_price",
    label: "Percent of Original List Price Received*",
    category: "pricing",
    july2025: "97.5%",
    july2026: "98.1%",
    monthlyChange: "+0.6%",
    monthlyChangeNumeric: 0.6,
    ytd2025: "98.7%",
    ytd2026: "98.6%",
    ytdChange: "-0.1%",
    ytdChangeNumeric: -0.1,
    unit: "percent"
  },
  {
    key: "pct_list_price",
    label: "Percent of List Price Received*",
    category: "pricing",
    july2025: "99.1%",
    july2026: "99.5%",
    monthlyChange: "+0.4%",
    monthlyChangeNumeric: 0.4,
    ytd2025: "99.8%",
    ytd2026: "99.7%",
    ytdChange: "-0.1%",
    ytdChangeNumeric: -0.1,
    unit: "percent"
  },
  {
    key: "inventory",
    label: "Inventory of Homes for Sale",
    category: "inventory",
    july2025: "4,025",
    july2026: "3,355",
    monthlyChange: "-16.6%",
    monthlyChangeNumeric: -16.6,
    ytd2025: "—",
    ytd2026: "—",
    ytdChange: "—",
    unit: "units"
  },
  {
    key: "months_supply",
    label: "Months Supply of Inventory",
    category: "inventory",
    july2025: "3.9",
    july2026: "3.3",
    monthlyChange: "-15.4%",
    monthlyChangeNumeric: -15.4,
    ytd2025: "—",
    ytd2026: "—",
    ytdChange: "—",
    unit: "months"
  },
  {
    key: "price_sqft",
    label: "Price Per Square Foot*",
    category: "pricing",
    july2025: "$715.00",
    july2026: "$734.97",
    monthlyChange: "+2.8%",
    monthlyChangeNumeric: 2.8,
    ytd2025: "$723.33",
    ytd2026: "$733.86",
    ytdChange: "+1.5%",
    ytdChangeNumeric: 1.5,
    unit: "currency"
  }
];

export const OC_FAST_HISTORICAL_TIMELINE: OCFastHistoricalPoint[] = [
  { date: "2-2012", label: "Feb 2012", year: 2012, attachedMedian: 270000, detachedMedian: 535000 },
  { date: "2-2013", label: "Feb 2013", year: 2013, attachedMedian: 330000, detachedMedian: 615000 },
  { date: "2-2014", label: "Feb 2014", year: 2014, attachedMedian: 395000, detachedMedian: 725000 },
  { date: "2-2015", label: "Feb 2015", year: 2015, attachedMedian: 425000, detachedMedian: 755000 },
  { date: "2-2016", label: "Feb 2016", year: 2016, attachedMedian: 460000, detachedMedian: 805000 },
  { date: "2-2017", label: "Feb 2017", year: 2017, attachedMedian: 485000, detachedMedian: 845000 },
  { date: "2-2018", label: "Feb 2018", year: 2018, attachedMedian: 510000, detachedMedian: 890000 },
  { date: "2-2019", label: "Feb 2019", year: 2019, attachedMedian: 512000, detachedMedian: 895000 },
  { date: "2-2020", label: "Feb 2020", year: 2020, attachedMedian: 525000, detachedMedian: 910000 },
  { date: "2-2021", label: "Feb 2021", year: 2021, attachedMedian: 600000, detachedMedian: 1080000 },
  { date: "2-2022", label: "Feb 2022", year: 2022, attachedMedian: 705000, detachedMedian: 1310000 },
  { date: "2-2023", label: "Feb 2023", year: 2023, attachedMedian: 690000, detachedMedian: 1250000 },
  { date: "2-2024", label: "Feb 2024", year: 2024, attachedMedian: 745000, detachedMedian: 1420000 },
  { date: "2-2025", label: "Feb 2025", year: 2025, attachedMedian: 760000, detachedMedian: 1445000 },
  { date: "2-2026", label: "Feb 2026", year: 2026, attachedMedian: 767500, detachedMedian: 1460000 },
  { date: "7-2026", label: "Jul 2026", year: 2026.5, attachedMedian: 767500, detachedMedian: 1460000 },
];

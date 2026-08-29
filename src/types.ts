export type NewsCategory = 
  | 'all' 
  | 'mortgage-news'
  | 'market-trends'
  | 'oc-fast'
  | 'mortgage-calculator'
  | 'real-estate' 
  | 'restaurants-bars' 
  | 'city-developments' 
  | 'lifestyle'
  | 'team-news'
  | 'events';

export interface CityInfo {
  id: string;
  name: string;
  state: string;
  avgSqftPrice: string;
  tagline?: string;
  image: string;
}

export interface VenueDetails {
  name: string;
  type: 'restaurant' | 'bar' | 'development' | 'residential' | 'retail';
  address: string;
  priceTier?: '$' | '$$' | '$$$' | '$$$$';
  highlight: string;
  lat?: number;
  lng?: number;
}

export interface RealEstateData {
  neighborhood: string;
  priceRange: string;
  avgSqftPrice?: string;
  trend: 'up' | 'down' | 'stable';
  keyStat?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  category: NewsCategory;
  cityName: string;
  publisher: string;
  publisherLogo?: string;
  publishedAt: string;
  readTime: string;
  heroImage: string;
  content: string;
  keyTakeaways: string[];
  isBreaking?: boolean;
  isFeatured?: boolean;
  venueDetails?: VenueDetails;
  realEstateData?: RealEstateData;
  sourceUrl?: string;
  sourceCitation?: string;
  isLiveAi?: boolean;
  isLivePublicRss?: boolean;
}

export type AdCategory = 
  | 'escrow' 
  | 'lender' 
  | 'contractor' 
  | 'realtor' 
  | 'broker' 
  | 'title' 
  | 'insurance' 
  | 'staging'
  | 'inspection'
  | 'mover'
  | 'legal';

export type AdPlacement = 
  | 'header-banner' 
  | 'feed-native' 
  | 'article-spotlight' 
  | 'calculator-sidebar' 
  | 'market-trends-banner';

export interface AdBanner {
  id: string;
  advertiserName: string;
  category: AdCategory;
  placement: AdPlacement;
  targetCity?: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string;
  logoUrl?: string;
  bgImageUrl?: string;
  sponsorBadge?: string;
  phone?: string;
  status: 'active' | 'paused';
  priority: 'featured' | 'high' | 'standard';
  impressions: number;
  clicks: number;
  createdAtMs: number;
  updatedAt: string;
}

export interface LiveMortgageRates {
  source: string;
  asOfDate: string;
  mortgage30Year: string;
  mortgage15Year: string;
  jumbo30Year?: string;
  fha30Year?: string;
  va30Year?: string;
  lastChecked?: string;
  sourceType: string;
  isRealLiveRate?: boolean;
}

export interface FilterState {
  city: CityInfo;
  category: NewsCategory;
  searchQuery: string;
  onlyBookmarked: boolean;
}

export function cleanText(text?: string): string {
  if (!text) return '';
  return text.replace(/\s*\([^)]*(\.com|\.gov|\.org|\.net|\.edu|http|www|\.io|\.ca|\.us)[^)]*\)/gi, '').replace(/\s*\([^)]*\)/g, (match) => {
    if (/com|gov|org|net|edu|http|www|site|portal/i.test(match)) return '';
    return match;
  }).trim();
}

export const CITY_ROOT_URLS: Record<string, string> = {
  'Orange County': 'https://www.ocgov.com/gov/bos',
  'Irvine': 'https://www.cityofirvine.org/great-park',
  'Costa Mesa': 'https://www.costamesaca.gov/city-hall/city-departments/development-services/planning-division',
  'Newport Beach': 'https://www.newportbeachca.gov/government/departments/public-works/harbor-resources-division',
  'Orange': 'https://www.cityoforange.org/our-city/departments/community-development',
  'Huntington Beach': 'https://www.huntingtonbeachca.gov/government/departments/public-works/',
  'Laguna Beach': 'https://www.lagunabeachcity.net/government/departments/community-development/planning-building',
  'Anaheim': 'https://www.anaheim.net/ocvibe',
  'Dana Point': 'https://www.danapoint.org/department/ocean-water-quality/harbor-revitalization',
  'San Clemente': 'https://www.san-clemente.org/government/city-departments/public-works/coastal-resiliency',
  'Fullerton': 'https://www.cityoffullerton.com/government/departments/community-economic-development',
  'Mission Viejo': 'https://cityofmissionviejo.org/departments/public-works/core-city-center',
  'Lake Forest': 'https://www.lakeforestca.gov/en/departments/community-development',
  'Tustin': 'https://www.tustinca.org/tustinlegacy',
  'San Juan Capistrano': 'https://www.sanjuancapistrano.org/departments/development-services',
  'Aliso Viejo': 'https://www.cityofalisoviejo.com/264/Town-Center-Master-Plan',
  'Brea': 'https://www.cityofbrea.net/145/Downtown-Birch-Street-Plan',
  'Buena Park': 'https://www.buenapark.com/city_departments/community_development/beach_blvd_revitalization.php',
  'Cypress': 'https://www.cypressca.org/government/departments/community-development',
  'Fountain Valley': 'https://www.fountainvalley.org/1120/Mile-Square-Regional-Park-Corridor',
  'Garden Grove': 'https://ggcity.org/economic-development/brookhurst-street-district',
  'La Habra': 'https://www.lahabraca.gov/432/La-Habra-Boulevard-Enhancements',
  'La Palma': 'https://www.cityoflapalma.org/321/Central-Park-Renewal',
  'Laguna Hills': 'https://www.lagunahillsca.gov/318/Mall-Village-Revitalization',
  'Laguna Niguel': 'https://www.cityoflagunaniguel.org/189/Town-Center-Master-Plan',
  'Laguna Woods': 'https://www.cityoflagunawoods.org/departments/community-development/housing',
  'Los Alamitos': 'https://www.cityoflosalamitos.org/214/Katella-Corridor-Enhancement',
  'Placentia': 'https://www.placentia.org/852/Metrolink-Transit-District',
  'Rancho Santa Margarita': 'https://www.cityofrsm.org/340/Lake-Park-Town-Center-Plan',
  'Santa Ana': 'https://www.santa-ana.org/oc-streetcar-arts-district/',
  'Seal Beach': 'https://www.sealbeachca.gov/Departments/Public-Works/Pier-Main-Street-Project',
  'Stanton': 'https://www.ci.stanton.ca.us/Departments/Community-Development/Beach-Boulevard-Renewal',
  'Villa Park': 'https://villapark.org/government/city-departments/planning-building/',
  'Westminster': 'https://www.westminster-ca.gov/departments/community-development/civic-center-master-plan',
  'Yorba Linda': 'https://www.yorbalindaca.gov/395/Town-Center-Equestrian-Preservation'
};

export function getCityRootUrl(cityName?: string, sourceUrl?: string): string {
  if (sourceUrl && (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://'))) {
    return sourceUrl;
  }
  if (cityName && CITY_ROOT_URLS[cityName]) {
    return CITY_ROOT_URLS[cityName];
  }
  return 'https://www.ocgov.com/gov/bos';
}

export function getDirectStoryUrl(article: { sourceUrl?: string; cityName?: string; category?: string; title?: string }): string {
  if (article.sourceUrl && (article.sourceUrl.startsWith('http://') || article.sourceUrl.startsWith('https://'))) {
    const trimmed = article.sourceUrl.trim();
    // If it is just a naked homepage for MND, route directly to mortgage rates news
    if (trimmed === 'https://www.mortgagenewsdaily.com' || trimmed === 'http://www.mortgagenewsdaily.com') {
      return 'https://www.mortgagenewsdaily.com/mortgage-rates';
    }
    return trimmed;
  }
  if (article.cityName && CITY_ROOT_URLS[article.cityName]) {
    return CITY_ROOT_URLS[article.cityName];
  }
  if (article.category === 'mortgage-news') {
    return 'https://www.mortgagenewsdaily.com/mortgage-rates';
  }
  return 'https://www.ocgov.com/gov/bos';
}


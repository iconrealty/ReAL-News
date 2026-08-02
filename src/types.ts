export type NewsCategory = 
  | 'all' 
  | 'real-estate' 
  | 'restaurants-bars' 
  | 'city-developments' 
  | 'market-trends' 
  | 'mortgage-calculator'
  | 'lifestyle';

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
  'Orange County': 'https://www.ocgov.com',
  'Irvine': 'https://www.cityofirvine.org',
  'Costa Mesa': 'https://www.costamesaca.gov',
  'Newport Beach': 'https://www.newportbeachca.gov',
  'Orange': 'https://www.cityoforange.org',
  'Huntington Beach': 'https://www.huntingtonbeachca.gov',
  'Laguna Beach': 'https://www.lagunabeachcity.net',
  'Anaheim': 'https://www.anaheim.net',
  'Dana Point': 'https://www.danapoint.org',
  'San Clemente': 'https://www.san-clemente.org',
  'Fullerton': 'https://www.cityoffullerton.com',
  'Mission Viejo': 'https://www.cityofmissionviejo.org',
  'Lake Forest': 'https://www.lakeforestca.gov',
  'Tustin': 'https://www.tustinca.org',
  'San Juan Capistrano': 'https://www.sanjuancapistrano.org',
};

export function getCityRootUrl(cityName?: string, sourceUrl?: string): string {
  if (sourceUrl && (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://'))) {
    return sourceUrl;
  }
  if (cityName && CITY_ROOT_URLS[cityName]) {
    return CITY_ROOT_URLS[cityName];
  }
  return 'https://www.ocgov.com';
}


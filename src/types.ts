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
  'Mission Viejo': 'https://cityofmissionviejo.org',
  'Lake Forest': 'https://www.lakeforestca.gov',
  'Tustin': 'https://www.tustinca.org',
  'San Juan Capistrano': 'https://www.sanjuancapistrano.org',
  'Aliso Viejo': 'https://www.cityofalisoviejo.com',
  'Brea': 'https://www.cityofbrea.net',
  'Buena Park': 'https://www.buenapark.com',
  'Cypress': 'https://www.cypressca.org',
  'Fountain Valley': 'https://www.fountainvalley.org',
  'Garden Grove': 'https://ggcity.org',
  'La Habra': 'https://www.lahabraca.gov',
  'La Palma': 'https://www.cityoflapalma.org',
  'Laguna Hills': 'https://www.lagunahillsca.gov',
  'Laguna Niguel': 'https://www.cityoflagunaniguel.org',
  'Laguna Woods': 'https://www.cityoflagunawoods.org',
  'Los Alamitos': 'https://www.cityoflosalamitos.org',
  'Placentia': 'https://www.placentia.org',
  'Rancho Santa Margarita': 'https://www.cityofrsm.org',
  'Santa Ana': 'https://www.santa-ana.org',
  'Seal Beach': 'https://www.sealbeachca.gov',
  'Stanton': 'https://www.ci.stanton.ca.us',
  'Villa Park': 'https://villapark.org',
  'Westminster': 'https://www.westminster-ca.gov',
  'Yorba Linda': 'https://www.yorbalindaca.gov'
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

export function getDirectStoryUrl(article: { 
  sourceUrl?: string; 
  cityName?: string; 
  category?: string; 
  title?: string; 
  publisher?: string;
  isLivePublicRss?: boolean;
}): string {
  // 1. If this article is from a live public RSS feed (with a real live article link)
  if (article.isLivePublicRss && article.sourceUrl && (article.sourceUrl.startsWith('http://') || article.sourceUrl.startsWith('https://'))) {
    const trimmed = article.sourceUrl.trim();
    // Verify it is an actual article link and not a generic homepage
    if (trimmed !== 'https://news.google.com' && trimmed !== 'https://www.mortgagenewsdaily.com') {
      return trimmed;
    }
  }

  // 2. Build targeted Google search query for the headline + publisher/city
  // &igu=1 allows Google search to render inside in-app frames seamlessly
  const cleanTitle = article.title
    ? article.title.replace(/\s*\([^)]*(\.com|\.gov|\.org|\.net|\.edu|http|www|\.io|\.ca|\.us)[^)]*\)/gi, '').trim()
    : '';
  const publisherOrCity = article.publisher || article.cityName || '';
  const query = [cleanTitle, publisherOrCity].filter(Boolean).join(' ');

  return `https://www.google.com/search?q=${encodeURIComponent(query || cleanTitle || 'Orange County Real Estate News')}&igu=1`;
}



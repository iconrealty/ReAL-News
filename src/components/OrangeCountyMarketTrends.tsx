import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { CityInfo } from '../types';

export interface OCCityMarketData {
  id: string;
  name: string;
  region: 'Coastal' | 'South OC' | 'North OC' | 'Central OC';
  medianPrice: number;
  avgSqftPrice: number;
  ytdSalesVolume: string; // e.g. "$2.84B"
  ytdSalesRaw: number; // in millions for sorting
  homesSoldYtd: number;
  pendingHomes: number;
  daysOnMarket: number;
  yoyGrowth: number; // percentage e.g. 8.1
  description?: string;
}

export const OC_MARKET_DATA: OCCityMarketData[] = [
  { id: 'aliso-viejo', name: 'Aliso Viejo', region: 'South OC', medianPrice: 1150000, avgSqftPrice: 720, ytdSalesVolume: '$385M', ytdSalesRaw: 385, homesSoldYtd: 335, pendingHomes: 42, daysOnMarket: 21, yoyGrowth: 5.8, description: 'Master-planned community with vast parkways, top schools, and modern suburban homes.' },
  { id: 'anaheim', name: 'Anaheim', region: 'North OC', medianPrice: 920000, avgSqftPrice: 650, ytdSalesVolume: '$1.12B', ytdSalesRaw: 1120, homesSoldYtd: 1220, pendingHomes: 145, daysOnMarket: 24, yoyGrowth: 4.9, description: 'Major Orange County hub with sports venues, resort districts, and diverse residential areas.' },
  { id: 'brea', name: 'Brea', region: 'North OC', medianPrice: 980000, avgSqftPrice: 640, ytdSalesVolume: '$410M', ytdSalesRaw: 410, homesSoldYtd: 418, pendingHomes: 48, daysOnMarket: 23, yoyGrowth: 4.2, description: 'North OC city known for excellent shopping, hillside neighborhoods, and public services.' },
  { id: 'buena-park', name: 'Buena Park', region: 'North OC', medianPrice: 880000, avgSqftPrice: 610, ytdSalesVolume: '$490M', ytdSalesRaw: 490, homesSoldYtd: 556, pendingHomes: 59, daysOnMarket: 22, yoyGrowth: 3.8, description: 'Entertainment hub featuring convenient transit access and accessible family home options.' },
  { id: 'costa-mesa', name: 'Costa Mesa', region: 'Coastal', medianPrice: 1380000, avgSqftPrice: 720, ytdSalesVolume: '$890M', ytdSalesRaw: 890, homesSoldYtd: 645, pendingHomes: 72, daysOnMarket: 25, yoyGrowth: 6.1, description: 'Cultural and culinary destination adjacent to Newport Beach with stylish neighborhoods.' },
  { id: 'cypress', name: 'Cypress', region: 'North OC', medianPrice: 940000, avgSqftPrice: 630, ytdSalesVolume: '$340M', ytdSalesRaw: 340, homesSoldYtd: 362, pendingHomes: 38, daysOnMarket: 20, yoyGrowth: 4.5, description: 'Quiet North County community with top-ranked Oxford Academy and serene streets.' },
  { id: 'dana-point', name: 'Dana Point', region: 'Coastal', medianPrice: 2450000, avgSqftPrice: 1150, ytdSalesVolume: '$780M', ytdSalesRaw: 780, homesSoldYtd: 318, pendingHomes: 34, daysOnMarket: 34, yoyGrowth: 7.4, description: 'Harbor town offering oceanfront living, Lantern District dining, and scenic coastal bluffs.' },
  { id: 'fountain-valley', name: 'Fountain Valley', region: 'Central OC', medianPrice: 1180000, avgSqftPrice: 690, ytdSalesVolume: '$420M', ytdSalesRaw: 420, homesSoldYtd: 356, pendingHomes: 41, daysOnMarket: 19, yoyGrowth: 5.2, description: 'Central OC suburban community with Mile Square Regional Park and high homeowner stability.' },
  { id: 'fullerton', name: 'Fullerton', region: 'North OC', medianPrice: 960000, avgSqftPrice: 620, ytdSalesVolume: '$860M', ytdSalesRaw: 860, homesSoldYtd: 895, pendingHomes: 98, daysOnMarket: 22, yoyGrowth: 4.6, description: 'Historic university town featuring historic downtown, tree-lined streets, and diverse architecture.' },
  { id: 'garden-grove', name: 'Garden Grove', region: 'Central OC', medianPrice: 870000, avgSqftPrice: 590, ytdSalesVolume: '$790M', ytdSalesRaw: 790, homesSoldYtd: 908, pendingHomes: 104, daysOnMarket: 20, yoyGrowth: 4.1, description: 'Central city with rich cultural districts, convenient freeway access, and steady home appreciation.' },
  { id: 'huntington-beach', name: 'Huntington Beach', region: 'Coastal', medianPrice: 1480000, avgSqftPrice: 810, ytdSalesVolume: '$1.65B', ytdSalesRaw: 1650, homesSoldYtd: 1115, pendingHomes: 128, daysOnMarket: 26, yoyGrowth: 6.3, description: 'Vibrant beach city featuring famous coastline, downtown pier district, and strong suburban demand.' },
  { id: 'irvine', name: 'Irvine', region: 'South OC', medianPrice: 1620000, avgSqftPrice: 845, ytdSalesVolume: '$2.84B', ytdSalesRaw: 2840, homesSoldYtd: 1753, pendingHomes: 210, daysOnMarket: 18, yoyGrowth: 8.1, description: 'Master-planned community with premier tech hubs, top-rated schools, and high residential demand.' },
  { id: 'la-habra', name: 'La Habra', region: 'North OC', medianPrice: 850000, avgSqftPrice: 580, ytdSalesVolume: '$390M', ytdSalesRaw: 390, homesSoldYtd: 458, pendingHomes: 52, daysOnMarket: 21, yoyGrowth: 3.6, description: 'Peaceful border community nestled against North County hills with competitive entry pricing.' },
  { id: 'la-palma', name: 'La Palma', region: 'North OC', medianPrice: 990000, avgSqftPrice: 625, ytdSalesVolume: '$140M', ytdSalesRaw: 140, homesSoldYtd: 141, pendingHomes: 16, daysOnMarket: 17, yoyGrowth: 4.0, description: 'Compact, safe community with top-ranked public safety and tight-knit neighborhoods.' },
  { id: 'laguna-beach', name: 'Laguna Beach', region: 'Coastal', medianPrice: 4250000, avgSqftPrice: 1680, ytdSalesVolume: '$1.15B', ytdSalesRaw: 1150, homesSoldYtd: 270, pendingHomes: 28, daysOnMarket: 42, yoyGrowth: 9.2, description: 'Artistic seaside community with dramatic ocean bluffs, pristine coves, and ultra-exclusive real estate.' },
  { id: 'laguna-hills', name: 'Laguna Hills', region: 'South OC', medianPrice: 1280000, avgSqftPrice: 710, ytdSalesVolume: '$350M', ytdSalesRaw: 350, homesSoldYtd: 273, pendingHomes: 31, daysOnMarket: 24, yoyGrowth: 5.1, description: 'South County city featuring spacious lots, rolling hills, and proximity to medical hubs.' },
  { id: 'laguna-niguel', name: 'Laguna Niguel', region: 'South OC', medianPrice: 1550000, avgSqftPrice: 760, ytdSalesVolume: '$920M', ytdSalesRaw: 920, homesSoldYtd: 593, pendingHomes: 65, daysOnMarket: 23, yoyGrowth: 6.0, description: 'Master-planned community nestled in coastal hills with expansive trails and luxury developments.' },
  { id: 'laguna-woods', name: 'Laguna Woods', region: 'South OC', medianPrice: 510000, avgSqftPrice: 420, ytdSalesVolume: '$280M', ytdSalesRaw: 280, homesSoldYtd: 549, pendingHomes: 62, daysOnMarket: 28, yoyGrowth: 3.2, description: 'Premier 55+ active senior community featuring golf courses, clubhouses, and low maintenance homes.' },
  { id: 'lake-forest', name: 'Lake Forest', region: 'South OC', medianPrice: 1160000, avgSqftPrice: 695, ytdSalesVolume: '$710M', ytdSalesRaw: 710, homesSoldYtd: 612, pendingHomes: 74, daysOnMarket: 20, yoyGrowth: 5.4, description: 'Picturesque South OC community featuring eucalyptus groves, lakes, and new construction options.' },
  { id: 'los-alamitos', name: 'Los Alamitos', region: 'North OC', medianPrice: 1320000, avgSqftPrice: 740, ytdSalesVolume: '$210M', ytdSalesRaw: 210, homesSoldYtd: 159, pendingHomes: 18, daysOnMarket: 22, yoyGrowth: 5.6, description: 'Charming small town renowned for top-tier school district and prime coastal proximity.' },
  { id: 'mission-viejo', name: 'Mission Viejo', region: 'South OC', medianPrice: 1220000, avgSqftPrice: 680, ytdSalesVolume: '$1.08B', ytdSalesRaw: 1080, homesSoldYtd: 885, pendingHomes: 96, daysOnMarket: 21, yoyGrowth: 5.3, description: 'Acclaimed master-planned city centered around Lake Mission Viejo with tree-lined streets.' },
  { id: 'newport-beach', name: 'Newport Beach', region: 'Coastal', medianPrice: 4650000, avgSqftPrice: 1750, ytdSalesVolume: '$3.25B', ytdSalesRaw: 3250, homesSoldYtd: 698, pendingHomes: 82, daysOnMarket: 38, yoyGrowth: 8.7, description: 'Luxury coastal enclave renowned for oceanfront estates, private harbor docks, and high-value equity.' },
  { id: 'orange', name: 'Orange', region: 'Central OC', medianPrice: 1050000, avgSqftPrice: 660, ytdSalesVolume: '$980M', ytdSalesRaw: 980, homesSoldYtd: 933, pendingHomes: 105, daysOnMarket: 21, yoyGrowth: 4.8, description: 'Historic center with iconic Plaza Square, Chapman University, and charming vintage homes.' },
  { id: 'placentia', name: 'Placentia', region: 'North OC', medianPrice: 930000, avgSqftPrice: 615, ytdSalesVolume: '$380M', ytdSalesRaw: 380, homesSoldYtd: 408, pendingHomes: 46, daysOnMarket: 20, yoyGrowth: 4.3, description: 'Quiet residential town with friendly neighborhoods and strong public school track record.' },
  { id: 'rancho-santa-margarita', name: 'Rancho Santa Margarita', region: 'South OC', medianPrice: 1080000, avgSqftPrice: 670, ytdSalesVolume: '$540M', ytdSalesRaw: 540, homesSoldYtd: 500, pendingHomes: 58, daysOnMarket: 19, yoyGrowth: 5.0, description: 'Scenic foothill community with RSM Lake, mountain views, and modern family neighborhoods.' },
  { id: 'san-clemente', name: 'San Clemente', region: 'Coastal', medianPrice: 1850000, avgSqftPrice: 890, ytdSalesVolume: '$1.12B', ytdSalesRaw: 1120, homesSoldYtd: 605, pendingHomes: 69, daysOnMarket: 27, yoyGrowth: 7.1, description: 'Spanish Village by the Sea featuring ocean-view neighborhoods and active surf culture.' },
  { id: 'san-juan-capistrano', name: 'San Juan Capistrano', region: 'South OC', medianPrice: 1650000, avgSqftPrice: 820, ytdSalesVolume: '$480M', ytdSalesRaw: 480, homesSoldYtd: 291, pendingHomes: 33, daysOnMarket: 29, yoyGrowth: 6.5, description: 'Historic mission city featuring equestrian estates, historic downtown, and coastal valley views.' },
  { id: 'santa-ana', name: 'Santa Ana', region: 'Central OC', medianPrice: 820000, avgSqftPrice: 560, ytdSalesVolume: '$1.02B', ytdSalesRaw: 1020, homesSoldYtd: 1243, pendingHomes: 138, daysOnMarket: 23, yoyGrowth: 4.0, description: 'County seat with vibrant downtown arts district, historic Floral Park, and government centers.' },
  { id: 'seal-beach', name: 'Seal Beach', region: 'Coastal', medianPrice: 1390000, avgSqftPrice: 790, ytdSalesVolume: '$310M', ytdSalesRaw: 310, homesSoldYtd: 223, pendingHomes: 26, daysOnMarket: 25, yoyGrowth: 5.5, description: 'Quaint oceanfront village with historic wooden pier, Main Street shops, and quiet beach life.' },
  { id: 'stanton', name: 'Stanton', region: 'Central OC', medianPrice: 780000, avgSqftPrice: 540, ytdSalesVolume: '$180M', ytdSalesRaw: 180, homesSoldYtd: 230, pendingHomes: 25, daysOnMarket: 22, yoyGrowth: 3.5, description: 'Revitalizing Central County city with new residential developments and community investments.' },
  { id: 'tustin', name: 'Tustin', region: 'Central OC', medianPrice: 1150000, avgSqftPrice: 710, ytdSalesVolume: '$760M', ytdSalesRaw: 760, homesSoldYtd: 660, pendingHomes: 78, daysOnMarket: 20, yoyGrowth: 5.7, description: 'City of Trees combining historic Old Town charm with modern Tustin Legacy master development.' },
  { id: 'villa-park', name: 'Villa Park', region: 'Central OC', medianPrice: 2350000, avgSqftPrice: 840, ytdSalesVolume: '$190M', ytdSalesRaw: 190, homesSoldYtd: 81, pendingHomes: 9, daysOnMarket: 31, yoyGrowth: 6.8, description: 'Exclusive enclave of half-acre estate lots surrounded entirely by the city of Orange.' },
  { id: 'westminster', name: 'Westminster', region: 'Central OC', medianPrice: 890000, avgSqftPrice: 595, ytdSalesVolume: '$520M', ytdSalesRaw: 520, homesSoldYtd: 584, pendingHomes: 64, daysOnMarket: 21, yoyGrowth: 4.1, description: 'Culturally rich hub featuring Little Saigon, central location, and consistent property demand.' },
  { id: 'yorba-linda', name: 'Yorba Linda', region: 'North OC', medianPrice: 1420000, avgSqftPrice: 710, ytdSalesVolume: '$850M', ytdSalesRaw: 850, homesSoldYtd: 598, pendingHomes: 67, daysOnMarket: 22, yoyGrowth: 5.9, description: 'Affluent equestrian city with Nixon Presidential Library, expansive trails, and top schools.' }
];

type SortField = 'name' | 'medianPrice' | 'avgSqftPrice' | 'ytdSalesRaw' | 'homesSoldYtd' | 'pendingHomes' | 'yoyGrowth';

interface OrangeCountyMarketTrendsProps {
  onSelectCity?: (city: CityInfo) => void;
}

export const OrangeCountyMarketTrends: React.FC<OrangeCountyMarketTrendsProps> = ({ onSelectCity }) => {
  const [selectedCity, setSelectedCity] = useState<OCCityMarketData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('avgSqftPrice');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [fredStats, setFredStats] = useState<{ mortgage30Year: string; mortgage15Year: string; asOfDate: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/live-market-stats')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setFredStats(json.data);
        }
      })
      .catch(err => console.warn("Failed to load live FRED stats", err));
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    return OC_MARKET_DATA.filter(city => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || city.name.toLowerCase().includes(q) || city.region.toLowerCase().includes(q);
      return matchesSearch;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [searchQuery, sortField, sortDirection]);

  // Aggregate totals
  const overallStats = useMemo(() => {
    const totalVolume = OC_MARKET_DATA.reduce((acc, c) => acc + c.ytdSalesRaw, 0);
    const totalSold = OC_MARKET_DATA.reduce((acc, c) => acc + c.homesSoldYtd, 0);
    const totalPending = OC_MARKET_DATA.reduce((acc, c) => acc + c.pendingHomes, 0);
    const avgSqft = Math.round(OC_MARKET_DATA.reduce((acc, c) => acc + c.avgSqftPrice, 0) / OC_MARKET_DATA.length);
    const avgMedian = Math.round(OC_MARKET_DATA.reduce((acc, c) => acc + c.medianPrice, 0) / OC_MARKET_DATA.length);
    return {
      totalVolume: `$${(totalVolume / 1000).toFixed(1)}B`,
      totalSold: totalSold.toLocaleString(),
      totalPending: totalPending.toLocaleString(),
      avgSqft: `$${avgSqft}`,
      avgMedian: `$${(avgMedian / 1000000).toFixed(2)}M`,
    };
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      
      {/* Top City Selector Tab Bar (Sleek Apple Segment Bar) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Select Market View
          </div>
          <div className="text-xs font-bold text-slate-500">
            {selectedCity ? `Viewing: ${selectedCity.name}` : 'Viewing: All Orange County'}
          </div>
        </div>
        
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 px-1">
          <button
            onClick={() => setSelectedCity(null)}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-tight whitespace-nowrap transition-all cursor-pointer ${
              selectedCity === null
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Orange County
          </button>

          {OC_MARKET_DATA.map((city) => {
            const isSelected = selectedCity?.id === city.id;
            return (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-950 text-white shadow-xs font-black'
                    : 'bg-slate-50 text-slate-700 border border-slate-200/60 hover:bg-slate-100'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* If a city is selected, present the exact same layout as Orange County market trends but for that city */}
      {selectedCity ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Header Card matching OC Market Trends exactly */}
          <div className="bg-white text-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                  {selectedCity.name} Market Trends
                </h1>
              </div>
            </div>

            {/* 4 Apple-Style Clean Metric Summary Cards matching OC Header layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Median Home Price
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 pt-1 tracking-tight">
                  {formatCurrency(selectedCity.medianPrice)}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold pt-0.5">
                  +{selectedCity.yoyGrowth}% YoY Growth
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Price Per Sq. Ft.
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#FA2D48] pt-1 tracking-tight">
                  ${selectedCity.avgSqftPrice} <span className="text-xs text-slate-500 font-normal">/ sqft</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-bold pt-0.5">
                  County Avg: {overallStats.avgSqft}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  YTD Sales Volume
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 pt-1 tracking-tight">
                  {selectedCity.ytdSalesVolume}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold pt-0.5">
                  {selectedCity.homesSoldYtd.toLocaleString()} Closed Sales
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending / Active Escrow
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 pt-1 tracking-tight">
                  {selectedCity.pendingHomes} <span className="text-xs text-slate-500 font-normal">homes</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-bold pt-0.5">
                  Avg DOM: {selectedCity.daysOnMarket} Days
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Default Orange County Main View */
        <>
          {/* Apple Minimalist Header & Benchmark Cards */}
          <div className="bg-white text-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                  Orange County Market Trends
                </h1>
              </div>
            </div>

            {/* 4 Apple-Style Clean Metric Summary Cards (Pure Black Numbers, No Mini Badges) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  FRED 30-Yr Fixed Rate
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 pt-1 tracking-tight">
                  {fredStats?.mortgage30Year || '6.78%'}
                </div>
                <div className="text-[11px] text-slate-400 pt-0.5 font-medium">
                  Freddie Mac Survey
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Median OC Home Price
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 pt-1 tracking-tight">
                  {overallStats.avgMedian}
                </div>
                <div className="text-[11px] text-slate-400 pt-0.5 font-medium">
                  Countywide Average
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  County Avg $/SqFt
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#FA2D48] pt-1 tracking-tight">
                  {overallStats.avgSqft} <span className="text-xs text-slate-500 font-normal">/ sqft</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-0.5 font-medium">
                  Across 34 Cities
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Escrow / Pending
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 pt-1 tracking-tight">
                  {overallStats.totalPending} <span className="text-xs text-slate-500 font-normal">homes</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-0.5 font-medium">
                  Under Contract
                </div>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search city or region (e.g. Coastal, Irvine)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F2F2F7] border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#FA2D48] focus:bg-white transition-all"
              />
            </div>

            <div className="text-xs font-bold text-slate-500 tracking-wide">
              Showing <span className="text-slate-950 font-black">{filteredAndSortedData.length}</span> Cities • Click any row or top tab for detailed city report
            </div>
          </div>

          {/* Main Orange County Cities Table View */}
          <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-[#F9F9FB] text-slate-950 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th onClick={() => handleSort('name')} className="py-4 px-6 cursor-pointer hover:bg-slate-100/80 transition-colors">
                      <div className="flex items-center space-x-1">
                        <span>City</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('avgSqftPrice')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/80 text-right transition-colors">
                      <div className="flex items-center justify-end space-x-1">
                        <span>$/SqFt</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('medianPrice')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/80 text-right transition-colors">
                      <div className="flex items-center justify-end space-x-1">
                        <span>Median Price</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('ytdSalesRaw')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/80 text-right transition-colors">
                      <div className="flex items-center justify-end space-x-1">
                        <span>YTD Sales Vol</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('homesSoldYtd')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/80 text-right transition-colors">
                      <div className="flex items-center justify-end space-x-1">
                        <span>Sold YTD</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('pendingHomes')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/80 text-right transition-colors">
                      <div className="flex items-center justify-end space-x-1">
                        <span>Pending Escrows</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('yoyGrowth')} className="py-4 px-6 cursor-pointer hover:bg-slate-100/80 text-right transition-colors">
                      <div className="flex items-center justify-end space-x-1">
                        <span>YoY %</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedData.map((city) => (
                    <tr
                      key={city.id}
                      onClick={() => setSelectedCity(city)}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-black text-slate-950 text-sm tracking-tight group-hover:text-[#FA2D48] transition-colors">
                          {city.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase pt-0.5">
                          {city.region} • DOM: {city.daysOnMarket}d
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-black text-[#FA2D48] text-sm tracking-tight">
                        ${city.avgSqftPrice}
                      </td>
                      <td className="py-4 px-4 text-right font-black text-slate-950 text-sm tracking-tight">
                        {formatCurrency(city.medianPrice)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-slate-800">
                        {city.ytdSalesVolume}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-slate-800">
                        {city.homesSoldYtd.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-black text-slate-950">
                        {city.pendingHomes}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-950">
                        +{city.yoyGrowth}%
                      </td>
                    </tr>
                  ))}

                  {filteredAndSortedData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-medium text-xs">
                        No cities matching "{searchQuery}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

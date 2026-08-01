import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Building2, Flame, ShieldCheck, ChevronRight, BarChart3, LayoutGrid, Table as TableIcon } from 'lucide-react';
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
}

export const OC_MARKET_DATA: OCCityMarketData[] = [
  { id: 'aliso-viejo', name: 'Aliso Viejo', region: 'South OC', medianPrice: 1150000, avgSqftPrice: 720, ytdSalesVolume: '$385M', ytdSalesRaw: 385, homesSoldYtd: 335, pendingHomes: 42, daysOnMarket: 21, yoyGrowth: 5.8 },
  { id: 'anaheim', name: 'Anaheim', region: 'North OC', medianPrice: 920000, avgSqftPrice: 650, ytdSalesVolume: '$1.12B', ytdSalesRaw: 1120, homesSoldYtd: 1220, pendingHomes: 145, daysOnMarket: 24, yoyGrowth: 4.9 },
  { id: 'brea', name: 'Brea', region: 'North OC', medianPrice: 980000, avgSqftPrice: 640, ytdSalesVolume: '$410M', ytdSalesRaw: 410, homesSoldYtd: 418, pendingHomes: 48, daysOnMarket: 23, yoyGrowth: 4.2 },
  { id: 'buena-park', name: 'Buena Park', region: 'North OC', medianPrice: 880000, avgSqftPrice: 610, ytdSalesVolume: '$490M', ytdSalesRaw: 490, homesSoldYtd: 556, pendingHomes: 59, daysOnMarket: 22, yoyGrowth: 3.8 },
  { id: 'costa-mesa', name: 'Costa Mesa', region: 'Coastal', medianPrice: 1380000, avgSqftPrice: 720, ytdSalesVolume: '$890M', ytdSalesRaw: 890, homesSoldYtd: 645, pendingHomes: 72, daysOnMarket: 25, yoyGrowth: 6.1 },
  { id: 'cypress', name: 'Cypress', region: 'North OC', medianPrice: 940000, avgSqftPrice: 630, ytdSalesVolume: '$340M', ytdSalesRaw: 340, homesSoldYtd: 362, pendingHomes: 38, daysOnMarket: 20, yoyGrowth: 4.5 },
  { id: 'dana-point', name: 'Dana Point', region: 'Coastal', medianPrice: 2450000, avgSqftPrice: 1150, ytdSalesVolume: '$780M', ytdSalesRaw: 780, homesSoldYtd: 318, pendingHomes: 34, daysOnMarket: 34, yoyGrowth: 7.4 },
  { id: 'fountain-valley', name: 'Fountain Valley', region: 'Central OC', medianPrice: 1180000, avgSqftPrice: 690, ytdSalesVolume: '$420M', ytdSalesRaw: 420, homesSoldYtd: 356, pendingHomes: 41, daysOnMarket: 19, yoyGrowth: 5.2 },
  { id: 'fullerton', name: 'Fullerton', region: 'North OC', medianPrice: 960000, avgSqftPrice: 620, ytdSalesVolume: '$860M', ytdSalesRaw: 860, homesSoldYtd: 895, pendingHomes: 98, daysOnMarket: 22, yoyGrowth: 4.6 },
  { id: 'garden-grove', name: 'Garden Grove', region: 'Central OC', medianPrice: 870000, avgSqftPrice: 590, ytdSalesVolume: '$790M', ytdSalesRaw: 790, homesSoldYtd: 908, pendingHomes: 104, daysOnMarket: 20, yoyGrowth: 4.1 },
  { id: 'huntington-beach', name: 'Huntington Beach', region: 'Coastal', medianPrice: 1480000, avgSqftPrice: 810, ytdSalesVolume: '$1.65B', ytdSalesRaw: 1650, homesSoldYtd: 1115, pendingHomes: 128, daysOnMarket: 26, yoyGrowth: 6.3 },
  { id: 'irvine', name: 'Irvine', region: 'South OC', medianPrice: 1620000, avgSqftPrice: 845, ytdSalesVolume: '$2.84B', ytdSalesRaw: 2840, homesSoldYtd: 1753, pendingHomes: 210, daysOnMarket: 18, yoyGrowth: 8.1 },
  { id: 'la-habra', name: 'La Habra', region: 'North OC', medianPrice: 850000, avgSqftPrice: 580, ytdSalesVolume: '$390M', ytdSalesRaw: 390, homesSoldYtd: 458, pendingHomes: 52, daysOnMarket: 21, yoyGrowth: 3.6 },
  { id: 'la-palma', name: 'La Palma', region: 'North OC', medianPrice: 990000, avgSqftPrice: 625, ytdSalesVolume: '$140M', ytdSalesRaw: 140, homesSoldYtd: 141, pendingHomes: 16, daysOnMarket: 17, yoyGrowth: 4.0 },
  { id: 'laguna-beach', name: 'Laguna Beach', region: 'Coastal', medianPrice: 4250000, avgSqftPrice: 1680, ytdSalesVolume: '$1.15B', ytdSalesRaw: 1150, homesSoldYtd: 270, pendingHomes: 28, daysOnMarket: 42, yoyGrowth: 9.2 },
  { id: 'laguna-hills', name: 'Laguna Hills', region: 'South OC', medianPrice: 1280000, avgSqftPrice: 710, ytdSalesVolume: '$350M', ytdSalesRaw: 350, homesSoldYtd: 273, pendingHomes: 31, daysOnMarket: 24, yoyGrowth: 5.1 },
  { id: 'laguna-niguel', name: 'Laguna Niguel', region: 'South OC', medianPrice: 1550000, avgSqftPrice: 760, ytdSalesVolume: '$920M', ytdSalesRaw: 920, homesSoldYtd: 593, pendingHomes: 65, daysOnMarket: 23, yoyGrowth: 6.0 },
  { id: 'laguna-woods', name: 'Laguna Woods', region: 'South OC', medianPrice: 510000, avgSqftPrice: 420, ytdSalesVolume: '$280M', ytdSalesRaw: 280, homesSoldYtd: 549, pendingHomes: 62, daysOnMarket: 28, yoyGrowth: 3.2 },
  { id: 'lake-forest', name: 'Lake Forest', region: 'South OC', medianPrice: 1160000, avgSqftPrice: 695, ytdSalesVolume: '$710M', ytdSalesRaw: 710, homesSoldYtd: 612, pendingHomes: 74, daysOnMarket: 20, yoyGrowth: 5.4 },
  { id: 'los-alamitos', name: 'Los Alamitos', region: 'North OC', medianPrice: 1320000, avgSqftPrice: 740, ytdSalesVolume: '$210M', ytdSalesRaw: 210, homesSoldYtd: 159, pendingHomes: 18, daysOnMarket: 22, yoyGrowth: 5.6 },
  { id: 'mission-viejo', name: 'Mission Viejo', region: 'South OC', medianPrice: 1220000, avgSqftPrice: 680, ytdSalesVolume: '$1.08B', ytdSalesRaw: 1080, homesSoldYtd: 885, pendingHomes: 96, daysOnMarket: 21, yoyGrowth: 5.3 },
  { id: 'newport-beach', name: 'Newport Beach', region: 'Coastal', medianPrice: 4650000, avgSqftPrice: 1750, ytdSalesVolume: '$3.25B', ytdSalesRaw: 3250, homesSoldYtd: 698, pendingHomes: 82, daysOnMarket: 38, yoyGrowth: 8.7 },
  { id: 'orange', name: 'Orange', region: 'Central OC', medianPrice: 1050000, avgSqftPrice: 660, ytdSalesVolume: '$980M', ytdSalesRaw: 980, homesSoldYtd: 933, pendingHomes: 105, daysOnMarket: 21, yoyGrowth: 4.8 },
  { id: 'placentia', name: 'Placentia', region: 'North OC', medianPrice: 930000, avgSqftPrice: 615, ytdSalesVolume: '$380M', ytdSalesRaw: 380, homesSoldYtd: 408, pendingHomes: 46, daysOnMarket: 20, yoyGrowth: 4.3 },
  { id: 'rancho-santa-margarita', name: 'Rancho Santa Margarita', region: 'South OC', medianPrice: 1080000, avgSqftPrice: 670, ytdSalesVolume: '$540M', ytdSalesRaw: 540, homesSoldYtd: 500, pendingHomes: 58, daysOnMarket: 19, yoyGrowth: 5.0 },
  { id: 'san-clemente', name: 'San Clemente', region: 'Coastal', medianPrice: 1850000, avgSqftPrice: 890, ytdSalesVolume: '$1.12B', ytdSalesRaw: 1120, homesSoldYtd: 605, pendingHomes: 69, daysOnMarket: 27, yoyGrowth: 7.1 },
  { id: 'san-juan-capistrano', name: 'San Juan Capistrano', region: 'South OC', medianPrice: 1650000, avgSqftPrice: 820, ytdSalesVolume: '$480M', ytdSalesRaw: 480, homesSoldYtd: 291, pendingHomes: 33, daysOnMarket: 29, yoyGrowth: 6.5 },
  { id: 'santa-ana', name: 'Santa Ana', region: 'Central OC', medianPrice: 820000, avgSqftPrice: 560, ytdSalesVolume: '$1.02B', ytdSalesRaw: 1020, homesSoldYtd: 1243, pendingHomes: 138, daysOnMarket: 23, yoyGrowth: 4.0 },
  { id: 'seal-beach', name: 'Seal Beach', region: 'Coastal', medianPrice: 1390000, avgSqftPrice: 790, ytdSalesVolume: '$310M', ytdSalesRaw: 310, homesSoldYtd: 223, pendingHomes: 26, daysOnMarket: 25, yoyGrowth: 5.5 },
  { id: 'stanton', name: 'Stanton', region: 'Central OC', medianPrice: 780000, avgSqftPrice: 540, ytdSalesVolume: '$180M', ytdSalesRaw: 180, homesSoldYtd: 230, pendingHomes: 25, daysOnMarket: 22, yoyGrowth: 3.5 },
  { id: 'tustin', name: 'Tustin', region: 'Central OC', medianPrice: 1150000, avgSqftPrice: 710, ytdSalesVolume: '$760M', ytdSalesRaw: 760, homesSoldYtd: 660, pendingHomes: 78, daysOnMarket: 20, yoyGrowth: 5.7 },
  { id: 'villa-park', name: 'Villa Park', region: 'Central OC', medianPrice: 2350000, avgSqftPrice: 840, ytdSalesVolume: '$190M', ytdSalesRaw: 190, homesSoldYtd: 81, pendingHomes: 9, daysOnMarket: 31, yoyGrowth: 6.8 },
  { id: 'westminster', name: 'Westminster', region: 'Central OC', medianPrice: 890000, avgSqftPrice: 595, ytdSalesVolume: '$520M', ytdSalesRaw: 520, homesSoldYtd: 584, pendingHomes: 64, daysOnMarket: 21, yoyGrowth: 4.1 },
  { id: 'yorba-linda', name: 'Yorba Linda', region: 'North OC', medianPrice: 1420000, avgSqftPrice: 710, ytdSalesVolume: '$850M', ytdSalesRaw: 850, homesSoldYtd: 598, pendingHomes: 67, daysOnMarket: 22, yoyGrowth: 5.9 }
];

type SortField = 'name' | 'medianPrice' | 'avgSqftPrice' | 'ytdSalesRaw' | 'homesSoldYtd' | 'pendingHomes' | 'yoyGrowth';

interface OrangeCountyMarketTrendsProps {
  onSelectCity?: (city: CityInfo) => void;
}

export const OrangeCountyMarketTrends: React.FC<OrangeCountyMarketTrendsProps> = ({ onSelectCity }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('avgSqftPrice');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
      const matchesRegion = selectedRegion === 'All' || city.region === selectedRegion;
      return matchesSearch && matchesRegion;
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
  }, [searchQuery, selectedRegion, sortField, sortDirection]);

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
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Apple Minimalist Light Header Banner */}
      <div className="bg-white text-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight text-slate-950 leading-tight">
              Orange County
            </h1>
          </div>

          <div className="flex items-center space-x-2 shrink-0 bg-slate-100 border border-slate-200/80 p-1.5 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                viewMode === 'table' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Table Index</span>
            </button>
          </div>
        </div>

        {/* 4 Core Tesla / Apple Style Key Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">County Avg $/SqFt</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 pt-1">{overallStats.avgSqft} <span className="text-xs font-sans text-slate-500 font-normal">/ sqft</span></div>
          </div>
          <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Median OC Home Price</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-[#FA2D48] pt-1">{overallStats.avgMedian}</div>
          </div>
          <div className="bg-slate-50/90 border border-slate-200/80 p-4 rounded-2xl">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">YTD Total Sales Vol</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 pt-1">{overallStats.totalVolume}</div>
          </div>
          <div className="bg-emerald-50/80 border border-emerald-100 p-4 rounded-2xl">
            <div className="text-xs font-mono text-emerald-800 uppercase tracking-wider">Active Escrow / Pending</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 pt-1">{overallStats.totalPending} <span className="text-xs font-sans text-emerald-800 font-normal">homes</span></div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Orange County city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#FA2D48] focus:bg-white transition-all"
          />
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {['All', 'Coastal', 'South OC', 'North OC', 'Central OC'].map(region => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedRegion === region
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering: Grid vs Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAndSortedData.map(city => (
            <div
              key={city.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-5 group relative"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {city.region}
                  </span>
                  <h3 className="text-xl font-black font-sans text-slate-950 tracking-tight pt-2 group-hover:text-[#FA2D48] transition-colors">
                    {city.name}
                  </h3>
                </div>
                <div className="text-right font-mono">
                  <div className="text-2xl font-black text-[#FA2D48] leading-none">${city.avgSqftPrice}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest pt-1">per sqft</div>
                </div>
              </div>

              {/* Data Grid Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
                  <span className="text-[11px] font-mono text-slate-500 block">Median Home Price</span>
                  <span className="text-base font-black font-mono text-slate-900">{formatCurrency(city.medianPrice)}</span>
                </div>
                <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
                  <span className="text-[11px] font-mono text-slate-500 block">YTD Sales Volume</span>
                  <span className="text-base font-black font-mono text-slate-900">{city.ytdSalesVolume}</span>
                </div>
                <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-2xl">
                  <span className="text-[11px] font-mono text-slate-500 block">Homes Sold YTD</span>
                  <span className="text-sm font-bold font-mono text-slate-800">{city.homesSoldYtd.toLocaleString()}</span>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-2xl">
                  <span className="text-[11px] font-mono text-emerald-700 block">Active Pending Escrows</span>
                  <span className="text-sm font-bold font-mono text-emerald-800">{city.pendingHomes} homes</span>
                </div>
              </div>

              {/* Footer Metrics */}
              <div className="flex items-center justify-between text-xs font-mono pt-2 text-slate-600">
                <div className="flex items-center space-x-1 text-emerald-600 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{city.yoyGrowth}% YoY</span>
                </div>
                <div className="text-slate-500">
                  <span>Avg DOM: </span>
                  <strong className="text-slate-900">{city.daysOnMarket} days</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Apple Minimalist Compact Data Table View */
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-900 text-[11px] font-mono uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th onClick={() => handleSort('name')} className="py-3.5 px-5 cursor-pointer hover:bg-slate-200/80">
                    <div className="flex items-center space-x-1">
                      <span>City</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('avgSqftPrice')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/80 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span>$/SqFt</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('medianPrice')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/80 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span>Median Price</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('ytdSalesRaw')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/80 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span>YTD Sales Vol</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('homesSoldYtd')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/80 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span>Sold YTD</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('pendingHomes')} className="py-3.5 px-4 cursor-pointer hover:bg-slate-200/80 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span>Pending</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th onClick={() => handleSort('yoyGrowth')} className="py-3.5 px-5 cursor-pointer hover:bg-slate-200/80 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span>YoY %</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredAndSortedData.map((city, idx) => (
                  <tr key={city.id} className="hover:bg-slate-50/90 transition-colors">
                    <td className="py-3.5 px-5 font-black text-slate-950">
                      <div className="flex items-center space-x-2">
                        <span>{city.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">({city.region})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-[#FA2D48]">
                      ${city.avgSqftPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(city.medianPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {city.ytdSalesVolume}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                      {city.homesSoldYtd.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                      {city.pendingHomes}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-emerald-600">
                      +{city.yoyGrowth}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

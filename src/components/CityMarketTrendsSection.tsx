import React from 'react';
import { CityInfo } from '../types';
import {
  OC_MARKET_TIME_REPORT,
  OC_SOLD_REPORT,
  OC_HOUSING_REPORT_METADATA
} from '../data/ocHousingReportData';

interface CityMarketTrendsSectionProps {
  currentCity: CityInfo;
  onExploreFullReport: () => void;
}

export const CityMarketTrendsSection: React.FC<CityMarketTrendsSectionProps> = ({
  currentCity,
  onExploreFullReport,
}) => {
  const cName = currentCity.name.trim();
  const isCountywide = currentCity.id === 'orange-county' || cName.toLowerCase().includes('orange county');

  // Match city data
  const marketTimeEntry = OC_MARKET_TIME_REPORT.find(
    r => r.city.toLowerCase() === cName.toLowerCase()
  ) || OC_MARKET_TIME_REPORT.find(
    r => r.city.toLowerCase().includes(cName.toLowerCase()) || cName.toLowerCase().includes(r.city.toLowerCase())
  );

  const soldEntry = OC_SOLD_REPORT.find(
    s => s.city.toLowerCase() === cName.toLowerCase()
  ) || OC_SOLD_REPORT.find(
    s => s.city.toLowerCase().includes(cName.toLowerCase()) || cName.toLowerCase().includes(s.city.toLowerCase())
  );

  // Fallback values if countywide or not found
  const medianSalesPrice = soldEntry?.medianSalesPrice || OC_HOUSING_REPORT_METADATA.countywideMedianPrice;
  const medianListPrice = soldEntry?.medianListPrice || marketTimeEntry?.medianActiveListPrice || "$1,280,000";
  const salesToListRatio = soldEntry?.salesToListRatio || OC_HOUSING_REPORT_METADATA.salesToListRatio;
  const medianPricePerSqFt = soldEntry?.medianPricePerSqFt || currentCity.avgSqftPrice.replace(' sqft', '');
  const medianSqFt = soldEntry?.medianSqFt || 2100;
  const unitsSoldJune2026 = soldEntry?.unitsSoldJune2026 || OC_HOUSING_REPORT_METADATA.juneClosedSalesResales;
  const unitsSoldJune2025 = soldEntry?.unitsSoldJune2025 || 1828;
  const lowPrice = soldEntry?.lowPrice || "$600,000";
  const highPrice = soldEntry?.highPrice || "$3,500,000";
  const medianDOM = soldEntry?.medianDOM || 18;

  const marketTimeDays = marketTimeEntry?.marketTimeDays || OC_HOUSING_REPORT_METADATA.countywideMarketTime;
  const currentActives = marketTimeEntry?.currentActives || OC_HOUSING_REPORT_METADATA.countywideActives;
  const demand30Days = marketTimeEntry?.demand30Days || OC_HOUSING_REPORT_METADATA.countywideDemand;
  const medianActiveListPrice = marketTimeEntry?.medianActiveListPrice || "$1,280,000";

  const marketTime2WeeksAgo = marketTimeEntry?.marketTime2WeeksAgo || 88;
  const marketTime4WeeksAgo = marketTimeEntry?.marketTime4WeeksAgo || 85;
  const marketTime1YearAgo = marketTimeEntry?.marketTime1YearAgo || 72;
  const marketTime2YearsAgo = marketTimeEntry?.marketTime2YearsAgo || 65;

  const yoyUnitsChange = unitsSoldJune2026 - unitsSoldJune2025;

  return (
    <section className="space-y-4">
      {/* City Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {currentCity.name}
        </h2>
        <button
          onClick={onExploreFullReport}
          className="text-xs font-bold text-slate-600 hover:text-[#FA2D48] transition-colors cursor-pointer self-start sm:self-auto"
        >
          View Full Market Trends →
        </button>
      </div>

      {/* Data Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
        
        {/* June Closed Sales Data */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            June Closed Sales
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Median Sales Price
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {medianSalesPrice}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                List Price: {medianListPrice}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Sales-to-List Ratio
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
                {salesToListRatio}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Countywide Avg: {OC_HOUSING_REPORT_METADATA.salesToListRatio}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Median Price / Sq. Ft.
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {medianPricePerSqFt}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Median Size: {medianSqFt.toLocaleString()} sq ft
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                June Units Sold
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {unitsSoldJune2026} Units
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {yoyUnitsChange >= 0 ? `+${yoyUnitsChange}` : yoyUnitsChange} vs June '25 ({unitsSoldJune2025})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="py-2 px-3 bg-slate-50/60 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">June Price Range (Low to High):</span>
              <span className="font-bold text-slate-900">{lowPrice} – {highPrice}</span>
            </div>
            <div className="py-2 px-3 bg-slate-50/60 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Closed Days on Market (DOM):</span>
              <span className="font-bold text-slate-900">{medianDOM} Days</span>
            </div>
          </div>
        </div>

        {/* Current Active Inventory & Expected Market Time */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Inventory &amp; Expected Market Time
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Expected Market Time
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {marketTimeDays} Days
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Active Inventory
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {currentActives.toLocaleString()} Homes
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                30-Day Demand
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {demand30Days.toLocaleString()} Pending
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Median Active List Price
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {medianActiveListPrice}
              </div>
            </div>
          </div>

          {/* Historical Market Time Pace */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-600">
              Historical Expected Market Time Pace:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold">2 Weeks Ago</div>
                <div className="font-bold text-slate-900">{marketTime2WeeksAgo} Days</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold">4 Weeks Ago</div>
                <div className="font-bold text-slate-900">{marketTime4WeeksAgo} Days</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold">1 Year Ago</div>
                <div className="font-bold text-slate-900">{marketTime1YearAgo} Days</div>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold">2 Years Ago</div>
                <div className="font-bold text-slate-900">{marketTime2YearsAgo} Days</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

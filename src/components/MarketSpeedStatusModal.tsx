import React from 'react';
import { X } from 'lucide-react';
import {
  STEVEN_THOMAS_DIRECTION_MATRIX,
  STEVEN_THOMAS_MARKET_DIRECTION,
  OC_COUNTYWIDE_LIVE_METRICS
} from '../data/ocHousingReportData';
import { getMarketCondition } from './OrangeCountyMarketTrends';

interface MarketSpeedStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName?: string;
  emtDays?: number;
  demand?: number;
  supply?: number;
  demandDelta?: number;
  supplyDelta?: number;
  emtDelta?: number;
}

export const MarketSpeedStatusModal: React.FC<MarketSpeedStatusModalProps> = ({
  isOpen,
  onClose,
  emtDays = OC_COUNTYWIDE_LIVE_METRICS.emtDays,
}) => {
  if (!isOpen) return null;

  const cond = getMarketCondition(emtDays);
  const matchedId = STEVEN_THOMAS_MARKET_DIRECTION.matchedRowId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="market-speed-modal"
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 font-sans text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (No Subtitles, Market Status in Title) */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Market Speed</h3>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-600">
              {cond.label} ({emtDays} Days)
            </span>
          </div>
          <button
            type="button"
            id="close-market-speed-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Simple Table: Arrows Up/Down, No Letters */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-2.5 px-3">Demand</th>
                <th className="py-2.5 px-3">Supply</th>
                <th className="py-2.5 px-3">Expected Time</th>
                <th className="py-2.5 px-3">Market Speed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {STEVEN_THOMAS_DIRECTION_MATRIX.map((row) => {
                const isCurrent = matchedId === row.id;

                return (
                  <tr
                    key={row.id}
                    className={isCurrent ? 'bg-slate-100 font-bold text-slate-950' : 'hover:bg-slate-50'}
                  >
                    <td className="py-2.5 px-3">
                      <span className={row.demand === 'UP' ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                        {row.demand}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={row.supply === 'UP' ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                        {row.supply}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={row.emt === 'UP' ? 'font-bold text-emerald-600' : 'font-bold text-rose-600'}>
                        {row.emt}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`font-bold ${
                          row.speed === 'FASTER' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {row.result}
                      </span>
                      {isCurrent && (
                        <span className="ml-2 text-[10px] font-bold text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Simple Footer */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

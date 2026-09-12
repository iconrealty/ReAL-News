import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { OC_FAST_METADATA } from '../data/ocFastReportData';
import { OCFastMonthlySnapshotSection } from './OCFastMonthlySnapshotSection';

interface OCFastTopOverviewProps {
  onViewFullReport?: () => void;
  title?: string;
  showExploreButton?: boolean;
}

export const OCFastTopOverview: React.FC<OCFastTopOverviewProps> = ({
  onViewFullReport,
  title = "Orange County Local Market Update",
  showExploreButton = true,
}) => {
  const [propertyType, setPropertyType] = useState<'all' | 'detached' | 'attached'>('all');

  return (
    <section className="space-y-4 font-sans">
      {/* Orange County Local Market Update Header Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs sm:text-sm font-sans font-black tracking-wider text-[#FA2D48] uppercase">
                OC FastStats
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[11px] font-bold text-slate-600">
                Current as of {OC_FAST_METADATA.currentAsOf}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight text-slate-950 leading-tight">
              {title}
            </h2>
          </div>

          {showExploreButton && onViewFullReport && (
            <button
              onClick={onViewFullReport}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FA2D48] text-white font-black text-xs hover:bg-[#d91b35] transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
            >
              <span>Explore All Pages</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Page 1 Monthly Indicators Snapshot Tabs & Core Velocity Indicators */}
      <OCFastMonthlySnapshotSection
        propertyType={propertyType}
        onPropertyTypeChange={setPropertyType}
        title="Market Activity"
        showTabsSubtitle={true}
      />
    </section>
  );
};


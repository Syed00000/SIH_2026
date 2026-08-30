import React from 'react';
import { FileText, FileSearch, Users, CheckCircle2, ChevronRight, ArrowUpRight } from 'lucide-react';

export const MyActivitiesTracker = ({ activities = {}, onStatusClick, onViewAllClick }) => {
  const submittedCount = activities.submitted ?? 0;
  const underReviewCount = activities.underReview ?? 0;
  const inProgressCount = activities.inProgress ?? 0;
  const resolvedCount = activities.resolved ?? 0;

  const items = [
    {
      key: 'Submitted',
      count: submittedCount,
      label: 'Submitted',
      icon: FileText,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
      iconColor: 'text-emerald-700'
    },
    {
      key: 'Under Review',
      count: underReviewCount,
      label: 'Under Review',
      icon: FileSearch,
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200/60',
      iconColor: 'text-amber-700'
    },
    {
      key: 'In Progress',
      count: inProgressCount,
      label: 'In Progress',
      icon: Users,
      badgeColor: 'bg-emerald-50 text-emerald-950 border-emerald-300/60',
      iconColor: 'text-emerald-800'
    },
    {
      key: 'Resolved',
      count: resolvedCount,
      label: 'Resolved',
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-100/60 text-emerald-900 border-emerald-300/60',
      iconColor: 'text-emerald-700'
    }
  ];

  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            My Activities
          </h3>
          <span className="text-[11px] font-semibold text-slate-500">
            &bull; Live Tracking
          </span>
        </div>

        <button
          onClick={onViewAllClick}
          className="flex items-center text-[11px] sm:text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* 4 Activity Metric Cards with interactive click-to-filter */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-2 sm:p-2.5 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onStatusClick && onStatusClick(item.key)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/60 border border-transparent hover:border-emerald-200 transition-all duration-200 cursor-pointer group text-left shadow-none hover:shadow-2xs"
              title={`View ${item.count} challenges under ${item.label}`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                {/* Icon Container */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.badgeColor} shrink-0 transition-transform group-hover:scale-105`}>
                  <Icon className={`w-4.5 h-4.5 ${item.iconColor}`} />
                </div>

                {/* Number & Label */}
                <div className="flex flex-col min-w-0">
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {item.count}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-600 leading-tight whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </div>

              {/* Mini Arrow Indicator on hover */}
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-1" />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MyActivitiesTracker;

import React from 'react';
import { FileText, FileSearch, Users, CheckCircle2, ChevronRight } from 'lucide-react';

export const MyActivitiesTracker = ({ activities = {}, onStatusClick, onViewAllClick }) => {
  const submittedCount = activities.submitted ?? 0;
  const underReviewCount = activities.underReview ?? 0;
  const inProgressCount = activities.inProgress ?? 0;
  const resolvedCount = activities.resolved ?? 0;

  const items = [
    { key: 'Submitted', count: submittedCount, label: 'Submitted', icon: FileText, iconColor: 'text-emerald-600' },
    { key: 'Under Review', count: underReviewCount, label: 'Under Review', icon: FileSearch, iconColor: 'text-amber-600' },
    { key: 'In Progress', count: inProgressCount, label: 'In Progress', icon: Users, iconColor: 'text-blue-600' },
    { key: 'Resolved', count: resolvedCount, label: 'Resolved', icon: CheckCircle2, iconColor: 'text-emerald-700' }
  ];

  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
          My Activities
        </h3>
        <button
          onClick={onViewAllClick}
          className="flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* 4 Activity Metrics Row in single clean card */}
      <div className="bg-white border border-slate-200/90 rounded-lg p-3.5 shadow-2xs grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-2 sm:gap-0">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onStatusClick && onStatusClick(item.key)}
              className="flex items-center space-x-3 px-3.5 py-2 text-left hover:bg-emerald-50/40 rounded-md transition-all cursor-pointer group"
            >
              {/* Direct Icon with distinct vibrant colors */}
              <Icon className={`w-4.5 h-4.5 ${item.iconColor} transition-transform group-hover:scale-110 shrink-0`} />

              {/* Number and Label */}
              <div className="flex flex-col min-w-0">
                <span className="text-base font-extrabold text-slate-900 leading-tight">
                  {item.count}
                </span>
                <span className="text-xs font-medium text-slate-500 leading-tight truncate">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MyActivitiesTracker;

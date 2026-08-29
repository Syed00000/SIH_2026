import React from 'react';
import { FileText, FileSearch, Users, CheckCircle2, ChevronRight } from 'lucide-react';

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
      circleBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      textColor: 'text-emerald-700'
    },
    {
      key: 'Under Review',
      count: underReviewCount,
      label: 'Under Review',
      icon: FileSearch,
      circleBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      textColor: 'text-amber-700'
    },
    {
      key: 'In Progress',
      count: inProgressCount,
      label: 'In Progress',
      icon: Users,
      circleBg: 'bg-blue-50 text-blue-600 border-blue-200/80',
      textColor: 'text-blue-700'
    },
    {
      key: 'Resolved',
      count: resolvedCount,
      label: 'Resolved',
      icon: CheckCircle2,
      circleBg: 'bg-green-50 text-green-600 border-green-200/80',
      textColor: 'text-green-700'
    }
  ];

  return (
    <section className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-extrabold text-slate-900 tracking-tight">
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

      {/* 4 Activity Metrics Row in single card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-2xs grid grid-cols-4 divide-x divide-slate-100">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => onStatusClick && onStatusClick(item.key)}
              className="flex items-center justify-center space-x-2 px-1.5 py-1 text-left hover:bg-slate-50/80 rounded-xl transition-all cursor-pointer group"
            >
              {/* Circular Badge Icon */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border ${item.circleBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Number and Label */}
              <div className="flex flex-col min-w-0">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  {item.count}
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight truncate">
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

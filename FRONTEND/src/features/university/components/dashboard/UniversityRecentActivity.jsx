import React from 'react';
import { CheckCircle2, Users, FileText, Building2, AlertCircle, ArrowRight } from 'lucide-react';

const TYPE_CONFIG = {
  accepted: { icon: CheckCircle2, iconClass: 'text-slate-800 bg-slate-100 border-slate-200' },
  milestone: { icon: Users, iconClass: 'text-slate-800 bg-slate-100 border-slate-200' },
  proposal: { icon: FileText, iconClass: 'text-slate-800 bg-slate-100 border-slate-200' },
  partner: { icon: Building2, iconClass: 'text-slate-800 bg-slate-100 border-slate-200' },
  delayed: { icon: AlertCircle, iconClass: 'text-rose-700 bg-rose-50 border-rose-200' }
};

export const UniversityRecentActivity = ({
  activities = [],
  onViewAll,
  onClear
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-none flex flex-col justify-between h-full">
      {/* Header */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Recent Activity
        </h2>
        {activities.length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-[10px] font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            title="Clear all activity logs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Activity Timeline List */}
      <div className="p-2.5 divide-y divide-slate-100">
        {activities.map((item, idx) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.accepted;
          const Icon = cfg.icon;

          return (
            <div
              key={item.id || idx}
              className="flex items-center justify-between py-2 px-1 text-xs hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-2 min-w-0 pr-2">
                <div className={`p-1 rounded-none border ${cfg.iconClass} shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="font-semibold text-slate-900 truncate">
                  {item.text}
                </p>
              </div>

              <span className="text-[10.5px] text-slate-500 font-mono font-medium whitespace-nowrap shrink-0">
                {item.timeAgo || item.relativeTime}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="px-3.5 py-2 border-t border-slate-200 text-center bg-slate-50">
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-slate-900 hover:text-black flex items-center justify-center space-x-1 mx-auto cursor-pointer"
        >
          <span>View all activity</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default UniversityRecentActivity;

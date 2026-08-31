import React from 'react';
import { ArrowRight } from 'lucide-react';

export const ApprovalsTableHeader = ({
  tabs = [],
  activeTab,
  onTabChange,
  onViewAll
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
      <div className="flex items-center space-x-2">
        <h3 className="text-sm font-black text-slate-900 tracking-tight">
          Pending Nodal Approvals & Triage
        </h3>
        <span className="text-[10.5px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          Action Required
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto">
        <div className="flex items-center bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/80 text-xs font-semibold">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer text-[11px] ${
                  isActive
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-100 text-slate-900 font-extrabold' : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors shrink-0 ml-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ApprovalsTableHeader;

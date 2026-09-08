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
        <span className="text-[10.5px] font-bold text-[#007A61]">
          Action Required
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto">
        <div className="flex items-center bg-slate-50 p-0.5 rounded-none border border-slate-200 text-xs font-semibold">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3 py-1.5 rounded-none transition-colors cursor-pointer text-[11px] font-bold ${
                  isActive
                    ? 'bg-[#007A61] text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`ml-1.5 text-[10px] px-1 py-0.5 rounded-none ${
                    isActive ? 'bg-[#00604c] text-white' : 'bg-slate-200/50 text-slate-500'
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
            className="flex items-center space-x-1 text-[11px] font-bold text-[#007A61] hover:text-[#00604c] transition-colors shrink-0 ml-1 cursor-pointer"
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

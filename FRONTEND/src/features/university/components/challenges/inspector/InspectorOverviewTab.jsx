import React from 'react';
import { GraduationCap } from 'lucide-react';

export const InspectorOverviewTab = ({
  displayedStatement,
  rawStatement,
  showFullStatement,
  setShowFullStatement,
  assignedUni,
  assignedDept,
  challenge
}) => {
  return (
    <div className="space-y-3 text-left">
      <div className="bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs space-y-1.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
          <span className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
            Ground Problem Statement
          </span>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Citizen Verified
          </span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-normal pt-1">
          {displayedStatement}
        </p>
        {rawStatement.length > 180 && (
          <button
            onClick={() => setShowFullStatement(!showFullStatement)}
            className="text-[11px] font-bold text-[#007A61] hover:underline pt-0.5 cursor-pointer block"
          >
            {showFullStatement ? 'Show Less' : 'Read Full Ground Statement'}
          </button>
        )}
      </div>

      <div className="bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
            <GraduationCap className="w-4 h-4 text-[#007A61]" />
            <span>Institutional Allocation Node</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Assigned Institution</span>
            <span className="font-extrabold text-slate-900 text-xs block mt-0.5">{assignedUni}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Designated Department</span>
            <span className="font-extrabold text-slate-900 text-xs block mt-0.5 truncate">{assignedDept}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorOverviewTab;

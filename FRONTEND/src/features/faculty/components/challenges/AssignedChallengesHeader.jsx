import React from 'react';
import { ClipboardList } from 'lucide-react';

export const AssignedChallengesHeader = ({
  allocationFilter,
  setAllocationFilter,
  myCount = 0,
  reassignedCount = 0,
  totalCount = 0
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Faculty Research Node</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Assigned Problem Statements</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <ClipboardList className="w-5 h-5 text-[#007A61]" />
          <span>Official Grassroots Problem Statements</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified ground problems allocated by Ranchi University for solution scoping and prototype formulation.
        </p>
      </div>

      <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={() => setAllocationFilter('my')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            allocationFilter === 'my'
              ? 'bg-white text-[#007A61] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Assigned to You</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            allocationFilter === 'my' ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
          }`}>
            {myCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAllocationFilter('reassigned')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            allocationFilter === 'reassigned'
              ? 'bg-white text-blue-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Allocated</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            allocationFilter === 'reassigned' ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-700'
          }`}>
            {reassignedCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAllocationFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
            allocationFilter === 'all'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All ({totalCount})</span>
        </button>
      </div>
    </div>
  );
};

export default AssignedChallengesHeader;

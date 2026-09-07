import React from 'react';
import { Users } from 'lucide-react';

export const TeamsHeader = () => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <span>Faculty Research Node</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">Student Research Team Management</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#007A61]" />
          <span>Student Research Teams</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Form student researcher rosters, assign custom team designations, and allocate project leadership.
        </p>
      </div>
    </div>
  );
};

export default TeamsHeader;

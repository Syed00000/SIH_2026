import React from 'react';
import { UserCheck, Building } from 'lucide-react';

export const FacultyWelcomeBanner = ({ faculty }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            <UserCheck className="w-3 h-3 mr-1 text-slate-900" />
            Faculty Research Node
          </span>
          <span className="text-[11px] font-bold text-slate-500">
            Higher Education &amp; Innovation Cell
          </span>
        </div>

        <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          Welcome, {faculty?.name || 'Faculty Mentor'}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium pt-0.5">
          <span>{faculty?.designation || 'Lead Faculty Mentor'}</span>
          <span>•</span>
          <span className="flex items-center">
            <Building className="w-3 h-3 mr-1 text-slate-400" />
            {faculty?.department || 'Department of Engineering'}
          </span>
          <span>•</span>
          <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
            {faculty?.universityCode || 'RU001'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FacultyWelcomeBanner;

import React from 'react';
import { Landmark, MapPin, Layers } from 'lucide-react';

export const WardDirectoryStats = ({ totalWards = 0, totalLocalities = 0, totalAssigned = 0 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xl font-black text-slate-900 leading-none">{totalWards}</span>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Ward Departments</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xl font-black text-slate-900 leading-none">{totalLocalities}</span>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Department Leads</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xl font-black text-slate-900 leading-none">{totalAssigned}</span>
          <p className="text-[11px] text-slate-400 font-semibold uppercase mt-0.5">Assigned Civic Issues</p>
        </div>
      </div>
    </div>
  );
};

export default WardDirectoryStats;

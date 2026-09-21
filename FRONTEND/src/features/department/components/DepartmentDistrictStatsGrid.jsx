import React from 'react';
import { IndianRupee, MapPin, Briefcase, ShieldCheck } from 'lucide-react';

export const DepartmentDistrictStatsGrid = ({ dist, jurisdictionValue, isInactive }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Fund Pool */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <IndianRupee className="w-5 h-5 font-black" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Allocated Fund Pool</span>
          <div className="text-lg font-black text-emerald-700 truncate">
            ₹ {(Number(dist.allocatedFundPool) || 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Operational State Grant</span>
        </div>
      </div>

      {/* Jurisdiction */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jurisdiction Area</span>
          <div className="text-sm font-extrabold text-slate-900 truncate">{jurisdictionValue}</div>
          <span className="text-[10px] text-slate-500 font-medium">{dist.district ? `${dist.district} District` : 'Jharkhand'}</span>
        </div>
      </div>

      {/* In-Charge Lead */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Officer In-Charge</span>
          <div className="text-sm font-extrabold text-slate-900 truncate">{dist.headName || 'Department Head'}</div>
          <span className="text-[10px] text-slate-500 font-medium truncate block">{dist.headRole || 'Lead Nodal Officer'}</span>
        </div>
      </div>

      {/* Portal Access Status */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Portal Access</span>
          <div className="text-sm font-extrabold text-slate-900 truncate">
            {!isInactive ? 'Authorized & Active' : 'Access Suspended'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Secured RBAC Login</span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDistrictStatsGrid;

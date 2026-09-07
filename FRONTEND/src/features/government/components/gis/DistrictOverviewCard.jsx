import React from 'react';
import { MapPin, AlertCircle, CheckCircle, Clock, ExternalLink, ShieldAlert } from 'lucide-react';

export const DistrictOverviewCard = ({
  selectedDistrict = 'All Districts',
  stats = {},
  problems = [],
  onViewProblemDetails
}) => {
  const isStateLevel = !selectedDistrict || selectedDistrict === 'All Districts';
  const total = typeof stats.total === 'number' ? stats.total : problems.length;
  const highPriority = typeof stats.highPriority === 'number'
    ? stats.highPriority
    : problems.filter(p => p.severity === 'HIGH' || p.severity === 'CRITICAL').length;
  const active = typeof stats.active === 'number'
    ? stats.active
    : problems.filter(p => p.status !== 'RESOLVED' && p.status !== 'DEPLOYED').length;
  const resolved = typeof stats.resolved === 'number'
    ? stats.resolved
    : problems.filter(p => p.status === 'RESOLVED' || p.status === 'DEPLOYED').length;

  const getSeverityBadge = (severity) => {
    const s = String(severity || '').toUpperCase();
    if (s === 'CRITICAL' || s === 'HIGH') {
      return { bg: 'bg-red-50 text-red-700 border-red-200', label: severity || 'High' };
    }
    if (s === 'MEDIUM') {
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: severity || 'Medium' };
    }
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: severity || 'Low' };
  };

  return (
    <div className="bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl text-slate-800 p-3.5 w-80 max-h-[580px] flex flex-col transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="w-4 h-4 text-[#007A61] shrink-0" />
          <span className="font-extrabold text-xs text-slate-900 truncate">
            {isStateLevel ? 'All Districts (Statewide)' : `${selectedDistrict} District`}
          </span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#007A61]/10 text-[#007A61] shrink-0">
          {isStateLevel ? '24 Districts' : 'District'}
        </span>
      </div>

      {/* Overview Metric Pills */}
      <div className="grid grid-cols-4 gap-1.5 mb-2.5 shrink-0 text-center">
        <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <span className="text-[9px] font-bold text-slate-400 block uppercase">Total</span>
          <span className="text-sm font-black text-slate-900">{total}</span>
        </div>
        <div className="bg-red-50/60 p-1.5 rounded-xl border border-red-100">
          <span className="text-[9px] font-bold text-red-600 block uppercase">High</span>
          <span className="text-sm font-black text-red-700">{highPriority}</span>
        </div>
        <div className="bg-amber-50/60 p-1.5 rounded-xl border border-amber-100">
          <span className="text-[9px] font-bold text-amber-600 block uppercase">Active</span>
          <span className="text-sm font-black text-amber-700">{active}</span>
        </div>
        <div className="bg-emerald-50/60 p-1.5 rounded-xl border border-emerald-100">
          <span className="text-[9px] font-bold text-emerald-600 block uppercase">Solved</span>
          <span className="text-sm font-black text-emerald-700">{resolved}</span>
        </div>
      </div>

      {/* Problem Details Section Header */}
      <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5 px-0.5 shrink-0">
        <span>{isStateLevel ? 'Statewide Problems' : `${selectedDistrict} Problems`}</span>
        <span className="text-slate-400 font-bold">{problems.length} listed</span>
      </div>

      {/* Scrollable Problem Details List */}
      <div className="overflow-y-auto flex-1 space-y-2 pr-1 min-h-[120px]">
        {problems.length === 0 ? (
          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center space-y-1 my-auto">
            <AlertCircle className="w-4 h-4 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No problems recorded</p>
            <p className="text-[10px] text-slate-400">
              {isStateLevel
                ? 'No active problem statements found statewide.'
                : `No reported issues recorded in ${selectedDistrict}.`}
            </p>
          </div>
        ) : (
          problems.map((prob) => {
            const sev = getSeverityBadge(prob.rawSeverity || prob.severity);
            const distName = prob.district || selectedDistrict;
            return (
              <div
                key={prob.id}
                onClick={() => onViewProblemDetails && onViewProblemDetails(prob)}
                className="p-2.5 rounded-xl bg-slate-50/70 hover:bg-[#007A61]/5 border border-slate-200/80 hover:border-[#007A61]/40 transition-all cursor-pointer group space-y-1.5 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#007A61] line-clamp-2 leading-snug">
                    {prob.title || 'Untitled Problem'}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#007A61] shrink-0 mt-0.5 transition-colors" />
                </div>

                <div className="flex items-center justify-between text-[10px] pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {prob.category || 'General'}
                    </span>
                    {isStateLevel && (
                      <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/70">
                        {distName}
                      </span>
                    )}
                  </div>

                  <span className={`px-1.5 py-0.5 rounded-full font-bold border ${sev.bg}`}>
                    {sev.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DistrictOverviewCard;

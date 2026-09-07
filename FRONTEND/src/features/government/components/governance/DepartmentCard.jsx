import React from 'react';
import { Landmark, Users, MapPin, Mail, ChevronRight, AlertCircle } from 'lucide-react';

export const DepartmentCard = ({ department, onViewDetails }) => {
  const {
    name,
    code,
    secretariatLocation,
    email,
    mandate,
    officersCount = 0,
    problemsCount = 0,
    leadOfficer
  } = department;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between hover:border-[#007A61]/50 transition-all group">
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-[#007A61] transition-colors">
                {name}
              </h3>
              <span className="text-[10px] font-bold text-slate-400">{code} • Government of Jharkhand</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            Active Node
          </span>
        </div>

        {/* Mandate Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
          {mandate}
        </p>

        {/* Secretariat & Contact */}
        <div className="space-y-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{secretariatLocation}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-mono text-[11px]">{email}</span>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" /> Officers:
            </span>
            <span className="text-xs font-black text-slate-900">{officersCount}</span>
          </div>
          <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500" /> Problems:
            </span>
            <span className="text-xs font-black text-amber-700">{problemsCount}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium truncate">
          Lead: <strong className="text-slate-800">{leadOfficer || 'Director / Secretary'}</strong>
        </span>
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(department)}
          className="text-xs font-bold text-[#007A61] hover:text-[#00624e] flex items-center gap-0.5 cursor-pointer shrink-0 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Inspect</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;

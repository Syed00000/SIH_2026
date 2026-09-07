import React from 'react';
import { Landmark, Users, MapPin, Mail, ChevronRight, Eye, Pencil, Trash2, PauseCircle, PlayCircle, Home, ShieldCheck } from 'lucide-react';

export const DepartmentCard = ({
  department,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const {
    deptId,
    name,
    code,
    category = 'District Department',
    headName,
    headRole,
    headEmail,
    headPhone,
    district,
    block,
    panchayat,
    status = 'Active',
    officersCount = 0,
    problemsCount = 0,
    activeProjectsCount = 0
  } = department;

  const isGramPanchayat = category === 'Gram Panchayat';
  const isInactive = status === 'Inactive' || status === 'Suspended';

  const locationText = isGramPanchayat
    ? [panchayat, block, district].filter(Boolean).join(', ')
    : `${district} District`;

  return (
    <div className={`bg-white rounded-2xl border shadow-2xs p-4 flex flex-col justify-between hover:border-[#007A61]/50 transition-all group select-none ${
      isInactive ? 'border-slate-200/60 opacity-85' : 'border-slate-200/90'
    }`}>
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isGramPanchayat ? 'bg-amber-500/10 text-amber-700' : 'bg-[#007A61]/10 text-[#007A61]'
            }`}>
              {isGramPanchayat ? <Home className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-[#007A61] transition-colors truncate">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-0.5">
                <span className="font-mono text-slate-600 bg-slate-100 px-1 rounded font-bold">{deptId || code}</span>
                <span>•</span>
                <span>{category}</span>
              </div>
            </div>
          </div>
          <span
            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
              isInactive
                ? 'bg-red-50 text-red-700 border-red-200'
                : isGramPanchayat
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {isInactive ? 'Inactive' : category}
          </span>
        </div>

        {/* Head / Mukhiya Details */}
        <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1 text-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
            <span>{headRole || 'Department Head'}</span>
            <span className="text-[#007A61] flex items-center gap-0.5 font-extrabold">
              <ShieldCheck className="w-3 h-3" /> State Head
            </span>
          </div>
          <div className="font-extrabold text-slate-800 text-xs truncate">
            {headName || 'Pending Officer Assignment'}
          </div>
          {(headEmail || headPhone) && (
            <div className="text-[10px] text-slate-500 font-mono truncate">
              {[headEmail, headPhone].filter(Boolean).join(' • ')}
            </div>
          )}
        </div>

        {/* Location Jurisdiction */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="truncate font-medium text-[11px]">{locationText}</span>
        </div>

        {/* Real Database Metric Badges */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Officers</span>
            <span className="text-xs font-black text-slate-900">{officersCount}</span>
          </div>
          <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-100">
            <span className="text-[10px] font-bold text-amber-600 block uppercase">Problems</span>
            <span className="text-xs font-black text-amber-700">{problemsCount}</span>
          </div>
          <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-600 block uppercase">Solutions</span>
            <span className="text-xs font-black text-emerald-700">{activeProjectsCount}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => onViewDetails && onViewDetails(department)}
            className="p-1.5 text-slate-400 hover:text-[#007A61] hover:bg-[#007A61]/10 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(department)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Department"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus && onToggleStatus(department)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              !isInactive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={!isInactive ? 'Deactivate Department' : 'Activate Department'}
          >
            {!isInactive ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(department)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Department"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

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

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

  const isGramPanchayat = category === 'Gram Panchayat' || category === 'Ward Commissioner';
  const isInactive = status === 'Inactive' || status === 'Suspended';

  const locationText = isGramPanchayat
    ? [panchayat, block, district].filter(Boolean).join(', ')
    : `${district ? `${district} District` : 'Statewide'}`;

  return (
    <div className={`bg-white rounded-2xl border shadow-2xs p-5 flex flex-col justify-between hover:border-slate-400 transition-all group select-none ${
      isInactive ? 'border-slate-200/60 opacity-85' : 'border-slate-200/90'
    }`}>
      <div className="space-y-3.5">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isGramPanchayat ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {isGramPanchayat ? <Home className="w-4.5 h-4.5" /> : <Landmark className="w-4.5 h-4.5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#007A61] transition-colors truncate">
                {name}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mt-0.5">
                <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-bold border border-slate-200">
                  {deptId || code}
                </span>
                <span>•</span>
                <span>{category}</span>
              </div>
            </div>
          </div>
          <span
            className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
              isInactive
                ? 'bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {isInactive ? 'Inactive' : 'Active'}
          </span>
        </div>

        {/* Head / Officer Details */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>{headRole || (isGramPanchayat ? 'Mukhiya / Head' : 'Department Head')}</span>
            <span className="text-[#007A61] flex items-center gap-0.5 font-bold">
              <ShieldCheck className="w-3 h-3" /> Assigned
            </span>
          </div>
          <div className="font-bold text-slate-900 text-xs truncate">
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

        {/* Database Metric Badges */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Officers</span>
            <span className="text-xs font-black text-slate-900 font-mono">{officersCount}</span>
          </div>
          <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/70">
            <span className="text-[10px] font-bold text-amber-700 block uppercase">Issues</span>
            <span className="text-xs font-black text-amber-800 font-mono">{problemsCount}</span>
          </div>
          <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/70">
            <span className="text-[10px] font-bold text-emerald-700 block uppercase">Solutions</span>
            <span className="text-xs font-black text-emerald-800 font-mono">{activeProjectsCount}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => onEdit && onEdit(department)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Department"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus && onToggleStatus(department)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              !isInactive ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={!isInactive ? 'Deactivate Department' : 'Activate Department'}
          >
            {!isInactive ? <PauseCircle className="w-3.5 h-3.5" /> : <PlayCircle className="w-3.5 h-3.5" />}
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete && onDelete(department)}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Department"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(department)}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;

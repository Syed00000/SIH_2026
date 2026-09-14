import React from 'react';
import { Landmark, Building2, MapPin, ShieldCheck, Menu, ChevronDown } from 'lucide-react';

export const DepartmentHeader = ({
  department,
  activeTab,
  onNavigateTab,
  onToggleSidebar,
  allDepartments = [],
  onSelectDepartment
}) => {
  const isGramPanchayat = department?.category === 'Gram Panchayat' || department?.category === 'Ward Commissioner';
  const name = department?.name || 'Department Authority';
  const headName = department?.headName || 'Officer in Charge';
  const headRole = department?.headRole || (isGramPanchayat ? 'Mukhiya' : 'Department Head');
  const district = department?.district || 'Ranchi';
  const locationStr = isGramPanchayat
    ? [department?.panchayat, department?.block, district].filter(Boolean).join(', ')
    : `${district} District`;

  return (
    <header className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 select-none flex-shrink-0 z-30 shadow-2xs">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
              title="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0 border border-[#007A61]/20">
            {isGramPanchayat ? <Building2 className="w-5 h-5 text-slate-900" /> : <Landmark className="w-5 h-5 text-[#007A61]" />}
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-base font-black text-slate-900 truncate leading-snug">
                {name}
              </h1>
              <span className={`px-1.5 sm:px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-extrabold border shrink-0 ${
                isGramPanchayat ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {department?.category || 'State Ministry'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#007A61]" />
                <span className="truncate">{headName} ({headRole})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{locationStr}</span>
              </span>
            </div>
          </div>
        </div>

        {allDepartments.length > 1 && onSelectDepartment && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden lg:inline text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Tier:</span>
            <div className="relative">
              <select
                value={department?.deptId || department?.id || ''}
                onChange={(e) => {
                  const target = allDepartments.find((d) => (d.deptId || d.id || d._id) === e.target.value);
                  if (target) onSelectDepartment(target);
                }}
                className="appearance-none pl-2.5 pr-7 py-1 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-slate-800 cursor-pointer transition focus:outline-none shadow-2xs"
              >
                {allDepartments.map((d) => (
                  <option key={d.deptId || d.id || d._id} value={d.deptId || d.id || d._id}>
                    {d.name} ({d.category || d.deptId})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DepartmentHeader;

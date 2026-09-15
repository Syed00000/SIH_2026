import React from 'react';
import { Landmark, Building2, MapPin, ShieldCheck, Menu } from 'lucide-react';

export const DepartmentHeader = ({
  department,
  activeTab,
  onNavigateTab,
  onToggleSidebar
}) => {
  const isGramPanchayat = department?.category === 'Gram Panchayat' || department?.category === 'Ward Commissioner';
  const isStateMinistry = department?.category === 'State Ministry' || department?.category === 'State Department' || (department?.deptId && String(department.deptId).includes('STATE'));
  const isBlock = department?.category === 'Block / Tehsil Office';
  const name = department?.name || 'Department Authority';
  const headName = department?.headName || 'Officer in Charge';
  const headRole = department?.headRole || (isGramPanchayat ? 'Mukhiya' : (isStateMinistry ? 'State Department Head' : 'Department Head'));
  const district = department?.district || 'Ranchi';
  const locationStr = isStateMinistry
    ? 'Govt of Jharkhand'
    : isGramPanchayat
    ? [department?.panchayat, department?.block, district].filter(Boolean).join(', ')
    : isBlock
    ? `${department?.block || district} Block, ${district}`
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
      </div>
    </header>
  );
};

export default DepartmentHeader;

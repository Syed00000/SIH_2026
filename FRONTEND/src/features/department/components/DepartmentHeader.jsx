import React from 'react';
import { Landmark, Building2, MapPin, Mail, ArrowLeft, LogOut, ShieldCheck } from 'lucide-react';

export const DepartmentHeader = ({
  department,
  activeTab,
  onNavigateTab,
  onBackToNodal,
  onLogout
}) => {
  const isGramPanchayat = department?.category === 'Gram Panchayat';
  const name = department?.name || 'Department Authority';
  const headName = department?.headName || 'Officer in Charge';
  const headRole = department?.headRole || (isGramPanchayat ? 'Mukhiya' : 'Department Head');
  const district = department?.district || 'Ranchi';
  const locationStr = isGramPanchayat
    ? [department?.panchayat, department?.block, district].filter(Boolean).join(', ')
    : `${district} District`;

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 select-none flex-shrink-0 z-30 shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Department Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0 border border-[#007A61]/20">
            {isGramPanchayat ? <Building2 className="w-5 h-5 text-amber-700" /> : <Landmark className="w-5 h-5 text-[#007A61]" />}
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate leading-snug">
                {name}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                isGramPanchayat ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {department?.category || 'State Ministry'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium truncate mt-0.5">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
                <span>{headName} ({headRole})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                <span>{locationStr}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onBackToNodal && (
            <button
              type="button"
              onClick={onBackToNodal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-all cursor-pointer"
              title="Return to Nodal Authority Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Nodal Cell</span>
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DepartmentHeader;

import React from 'react';
import { Landmark, Bell, LogOut, Shield } from 'lucide-react';

export const WardHeader = ({ ward, onLogout }) => {
  const wardName = ward?.name || 'Ward Administration';
  const wardNumber = ward?.wardNumber || '01';
  const councillor = ward?.councillorName || 'Ward Councillor';
  const district = ward?.district || 'Ranchi';

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs select-none sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center font-bold">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-slate-900 leading-tight">{wardName}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
              Ward #{wardNumber}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
            <span>{district} Municipal Corporation</span>
            <span>•</span>
            <span className="text-slate-700 font-bold">{councillor}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Ward Officer Portal</span>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default WardHeader;

import React from 'react';
import { ArrowLeft, Info, Plus, CheckCircle2 } from 'lucide-react';

export const UniversityProblemsDetailHeader = ({
  university,
  showProfileDrawer,
  setShowProfileDrawer,
  onOpenAssignNew,
  onBack,
  toastMsg
}) => {
  return (
    <div className="space-y-3">
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#064e3b] text-xs font-bold rounded-lg flex items-center space-x-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div className="flex items-start space-x-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs mt-0.5"
            title="Back to Universities Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {university.name}
              </h2>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {university.code}
              </span>
              <span className="text-xs font-bold text-slate-500">
                &bull; {university.district || 'Jharkhand'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {university.legalName || university.name} &bull; AISHE: {university.aisheCode || 'U-0000'} &bull; Type: {university.universityType || university.type || 'State University'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowProfileDrawer(!showProfileDrawer)}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>{showProfileDrawer ? 'Hide Profile' : 'Institution Profile'}</span>
          </button>

          <button
            onClick={onOpenAssignNew}
            className="flex items-center justify-center space-x-2 bg-white hover:bg-[#064e3b] text-slate-900 hover:text-white border border-slate-200/90 hover:border-[#064e3b] text-xs font-bold px-4 py-2 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Allocate Problem</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityProblemsDetailHeader;

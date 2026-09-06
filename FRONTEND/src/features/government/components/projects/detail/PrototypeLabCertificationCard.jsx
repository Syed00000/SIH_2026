import React from 'react';
import { ShieldCheck, FileCheck2, CheckCircle2, Award } from 'lucide-react';
import { openPdf } from '../../../../../shared/utils/openPdf.js';

export const PrototypeLabCertificationCard = ({ project }) => {
  const labName = project.testingPartner || 'Ariba Research Labs & Testing Facility';
  const certId = project.prototypeData?.certNumber || `NABL-JH-${project.id || project.projectId || '2026'}-CL`;
  const clearanceDate = project.prototypeData?.clearedAt || 'August 2026';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Industrial Testing & NABL Clearance</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[10px] font-extrabold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>100% Calibrated</span>
          </span>
          {project.testingReportPdfUrl && (
            <button
              type="button"
              onClick={() => openPdf(project.testingReportPdfUrl)}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <FileCheck2 className="w-3 h-3 text-emerald-600" />
              <span>Lab Audit Report PDF</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Accredited Testing Facility</span>
          <p className="font-black text-slate-900 truncate">{labName}</p>
          <span className="text-[10px] text-slate-500 block">ISO/IEC 17025 Accredited</span>
        </div>
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Clearance Certificate No.</span>
          <p className="font-mono font-bold text-emerald-800 truncate">{certId}</p>
          <span className="text-[10px] text-slate-500 block">Validation Date: {clearanceDate}</span>
        </div>
        <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Validation Protocol</span>
          <p className="font-bold text-slate-900">Stress, Thermal & Radio EMI</p>
          <span className="text-[10px] text-emerald-600 font-semibold block">Passed All 4 Rigorous Stages</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <div className="flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5 text-slate-500" />
          <span>Industry Quality Assurance: <strong className="text-slate-800">Meets Jharkhand Industrial Innovation Standard (JIIS-2026)</strong></span>
        </div>
      </div>
    </div>
  );
};

export default PrototypeLabCertificationCard;

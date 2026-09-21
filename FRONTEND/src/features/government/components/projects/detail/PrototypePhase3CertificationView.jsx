import React from 'react';
import { SafeHtml } from '../../../../../shared/components/SafeHtml.jsx';
import { ShieldCheck, Building2, CheckSquare, Printer, Award, FileText, CheckCircle2 } from 'lucide-react';

export const PrototypePhase3CertificationView = ({ project, onPrintCertificate }) => {
  const pData = project.prototypeData || {};
  const targetDept = project.targetDepartment || project.domain || project.sector || 'Urban Development & Housing Department';
  const certNotes = pData.phases?.stateCert || '';

  return (
    <div className="space-y-4">
      {/* 1. State Council Clearance & Department Handover */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#007A61]" />
            <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">State Innovation Council Clearance</h3>
          </div>
          <button type="button" onClick={onPrintCertificate} className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer hover:bg-slate-800 transition-colors">
            <Printer className="w-3.5 h-3.5 text-emerald-300" />
            <span>Print Official State Certificate</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Evaluation Level</span>
            <p className="font-mono font-bold text-emerald-800 text-sm">{project.trlLevel || 'TRL-8'}</p>
            <span className="text-[10px] text-slate-500 block">State Technical Council Certified</span>
          </div>
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Designated Handover Department</span>
            <p className="font-bold text-slate-900 truncate flex items-center space-x-1">
              <Building2 className="w-3 h-3 text-[#007A61] shrink-0" />
              <span className="truncate">{targetDept}</span>
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold block">SLA & Protocol Aligned</span>
          </div>
          <div className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Asset Transfer Dossier</span>
            <p className="font-bold text-slate-900">CAD, Firmware & Manuals</p>
            <span className="text-[10px] text-slate-500 block">Cleared for Statewide Rollout</span>
          </div>
        </div>
      </div>

      {/* 2. Department Handover Readiness Checklist */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Department Handover Readiness Checklist</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">Cryptographically Signed Firmware</strong>
              <span className="text-slate-500 text-[11px]">Firmware binaries verified and hash-locked against tampering.</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">Operating Manual & Technician SOP</strong>
              <span className="text-slate-500 text-[11px]">Step-by-step diagnostic and field repair manuals submitted.</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">State Command Center Telemetry Link</strong>
              <span className="text-slate-500 text-[11px]">Direct encrypted uplink connected to Jharkhand State Dashboard.</span>
            </div>
          </div>
          <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-100 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">12-Month Hardware Support & SLA</strong>
              <span className="text-slate-500 text-[11px]">Nodal university commits dedicated engineering support team.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. State Certification Documentation Notes */}
      {certNotes && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-800 flex items-center space-x-1.5"><Award className="w-3.5 h-3.5 text-slate-500" /><span>State Technical Council Sanction Directives</span></h4>
          <SafeHtml html={certNotes} className="text-xs text-slate-700 leading-relaxed prose max-w-none" />
        </div>
      )}
    </div>
  );
};

export default PrototypePhase3CertificationView;

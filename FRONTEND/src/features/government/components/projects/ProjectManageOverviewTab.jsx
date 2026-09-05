import React from 'react';
import { Building2, Cpu, ShieldCheck, Printer, FileText } from 'lucide-react';
import { openPdf } from '../../../../shared/utils/openPdf.js';

export const ProjectManageOverviewTab = ({ project, onOpenCertificate }) => {
  return (
    <div className="space-y-5">
      {/* Institution & Team Lead Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Executing HEI</span>
          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>{project.hei}</span>
          </div>
          <span className="text-[11px] text-slate-500">{project.heiType || 'State University'}</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Principal Investigator</span>
          <div className="font-bold text-slate-900">{project.teamLead}</div>
          <span className="text-[11px] text-slate-500">{project.leadEmail}</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Technology Readiness</span>
          <div className="font-mono font-black text-sm text-slate-900 flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-slate-900 text-white rounded-md">{project.trlLevel}</span>
            <span className="text-xs font-bold text-slate-700">{project.prototypeType}</span>
          </div>
          <span className="text-[10px] text-slate-500 line-clamp-1">{project.trlDescription}</span>
        </div>
      </div>

      {/* Hardware BOM */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Cpu className="w-4 h-4 text-slate-700" />
          <span>Technical Architecture & Hardware Bill of Materials (BOM)</span>
        </h3>
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed font-mono text-xs">
          {project.hardwareSpecs || 'Industrial Grade Embedded Microcontroller, Sub-GHz Transceiver, Integrated Solar Harvester.'}
        </div>
        <div className="text-[11px] text-slate-500 flex items-center space-x-2">
          <span className="font-bold text-slate-700">Lab Facility:</span>
          <span>{project.labsAndFacilities}</span>
        </div>
      </div>

      {/* Lab Certified Report & Prototype PDF strip */}
      {(project.testingReportPdfUrl || project.pdfUrl) && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">
                Official Certified Testing Report & Technical Dossier
              </div>
              <div className="text-[11px] text-emerald-700">
                Industry & Lab verified documentation submitted for state deployment.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openPdf(project.testingReportPdfUrl || project.pdfUrl)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Open Dossier PDF
          </button>
        </div>
      )}

      {/* State Validation Banner */}
      <div className="p-5 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-md">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center space-x-2 text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>State Validation & Deployment Status</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Certified compliant with Jharkhand State Societal Innovation Standards.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCertificate}
          className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>View Official Certificate</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectManageOverviewTab;

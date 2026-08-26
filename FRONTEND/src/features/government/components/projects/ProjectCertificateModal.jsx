import React from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  Building2,
  Award,
  Calendar,
  CheckCircle2,
  QrCode,
  Download,
  FileCheck
} from 'lucide-react';

export const ProjectCertificateModal = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">
              Official State Innovation Validation Certificate
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white text-slate-900 space-y-6 print:p-0 print:m-0">
          {/* Certificate Border Container */}
          <div className="border-4 border-double border-slate-900 p-8 rounded-xl relative space-y-6 bg-radial from-slate-50/50 to-white">
            {/* Top State Header */}
            <div className="text-center space-y-1 border-b-2 border-slate-900 pb-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-lg mb-2 shadow-xs">
                JH
              </div>
              <h1 className="text-base font-black tracking-widest uppercase text-slate-900">
                GOVERNMENT OF JHARKHAND
              </h1>
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Department of Higher & Technical Education • Societal Innovation Hub
              </h2>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                Certificate ID: JHK-INNOV-{project.id}-2026-VAL
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-2 py-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                STATE DEPLOYMENT & TECHNOLOGY VALIDATION CERTIFICATE
              </span>
              <p className="text-xs text-slate-600 max-w-xl mx-auto italic">
                This is to officially certify that the engineering prototype and societal innovation titled
              </p>
              <h3 className="text-base sm:text-lg font-black text-slate-900 max-w-2xl mx-auto leading-snug">
                "{project.title}"
              </h3>
            </div>

            {/* Grantee & Specification Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Executing HEI:</span>
                <span className="font-bold text-slate-900">{project.hei}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Principal Investigator:</span>
                <span className="font-bold text-slate-900">{project.teamLead}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Readiness Rating:</span>
                <span className="font-bold text-slate-900">{project.trlLevel} (Validated)</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">District Pilot Zone:</span>
                <span className="font-bold text-slate-900">{project.district}</span>
              </div>
            </div>

            {/* Certification Statement */}
            <div className="text-xs text-slate-700 space-y-2 leading-relaxed text-justify">
              <p>
                Has successfully fulfilled all stage-gate milestone deliverables, statutory NABL laboratory benchmarks,
                and field operational trials under the Jharkhand Societal Innovation Framework. The technology has been
                independently audited by the State Technical Steering Committee and certified fit for state-wide deployment and public procurement.
              </p>
            </div>

            {/* Signatures & QR Code */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <div className="text-left space-y-1">
                <div className="w-32 h-0.5 bg-slate-900" />
                <div className="text-xs font-bold text-slate-900">Dr. Arvind Kumar, IAS</div>
                <div className="text-[10px] text-slate-500 font-medium">Principal Secretary (Technical Education)</div>
              </div>

              {/* QR Verification Seal */}
              <div className="text-center space-y-1">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-lg p-1.5 mx-auto flex items-center justify-center font-mono text-[9px] text-center font-bold">
                  [VERIFIED STATE QR]
                </div>
                <span className="text-[9px] font-mono text-slate-400 block">Digitally Signed</span>
              </div>

              <div className="text-right space-y-1">
                <div className="w-32 h-0.5 bg-slate-900 ml-auto" />
                <div className="text-xs font-bold text-slate-900">Prof. R. C. Murmu</div>
                <div className="text-[10px] text-slate-500 font-medium">Director, State Innovation Council</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCertificateModal;

import React from 'react';
import { CheckCircle2, Rocket, ExternalLink, FileText, X, ArrowRight } from 'lucide-react';
import { openPdfDocument } from '../../../../shared/utils/openPdf.js';

export const ProjectDeployedSuccessModal = ({ project, isOpen, onClose, onViewCitizenPortal }) => {
  if (!isOpen || !project) return null;

  const pdfUrl = project.testingReportPdfUrl || project.pdfUrl;
  const pdfName = project.testingReportPdfName || project.pdfName || 'Certified_Prototype_Dossier.pdf';

  const handleOpenPdf = () => {
    if (pdfUrl) {
      openPdfDocument(pdfUrl, pdfName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-center p-6 space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#007A61] border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <Rocket className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#007A61] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Citizen Registry Live Broadcast
          </span>
          <h3 className="text-lg font-black text-slate-900">Project Successfully Deployed!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The solution for <strong className="text-slate-800 font-bold">"{project.title}"</strong> is now active in public rollout across Jharkhand.
          </p>
        </div>

        {/* Status card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <span className="text-slate-500 font-medium">Challenge Code:</span>
            <span className="font-mono font-bold text-slate-900">{project.id}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <span className="text-slate-500 font-medium">Public Status:</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded text-[10px]">
              DEPLOYED &amp; RESOLVED
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Citizen Notification:</span>
            <span className="text-emerald-700 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dossier Dispatched</span>
            </span>
          </div>
        </div>

        {/* Attached PDF Preview Link */}
        {pdfUrl && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-left">
            <div className="flex items-center space-x-2.5 min-w-0">
              <FileText className="w-5 h-5 text-[#007A61] shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate block">{pdfName}</span>
                <span className="text-[10px] text-emerald-700 font-semibold block">✓ Attached Prototype Dossier</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenPdf}
              className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 shadow-2xs cursor-pointer"
            >
              <span>View PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          {onViewCitizenPortal && (
            <button
              type="button"
              onClick={onViewCitizenPortal}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>View Citizen Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDeployedSuccessModal;

import React from 'react';
import { X, Mail, Send, CheckCircle2, FileText, Paperclip, ExternalLink } from 'lucide-react';

export const ValidationEmailModal = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-scaleUp">
        {/* Email Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">
              Government Official Notification Dispatched
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="space-y-2 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="font-bold text-slate-400 w-16">From:</span>
              <span className="font-mono text-slate-900">dhte.jharkhand@gov.in (Dept of Higher & Technical Education)</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="font-bold text-slate-400 w-16">To:</span>
              <span className="font-mono text-slate-900 font-semibold">{project.leadEmail || 'pi.contact@university.ac.in'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="font-bold text-slate-400 w-16">Subject:</span>
              <span className="font-bold text-slate-900">
                [OFFICIAL ORDER] State Innovation Validation Certificate Issued for {project.id}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 space-y-2 leading-relaxed font-sans">
            <p>Dear <strong>{project.teamLead}</strong> ({project.hei}),</p>
            <p>
              We are pleased to inform you that your societal innovation project titled <strong>"{project.title}"</strong> ({project.id})
              has successfully passed all milestone stage-gate reviews and field operational audits.
            </p>
            <p>
              The Government of Jharkhand has officially granted <strong>State Deployment Validation (TRL-8)</strong> status.
              Your official signed certificate has been registered on the state innovation portal.
            </p>
            <p className="pt-1 text-[11px] text-slate-500">
              Reference: JHK-INNOV-{project.id}-2026-VAL • Issued by State Technical Steering Committee
            </p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-emerald-800">
            <div className="flex items-center space-x-2">
              <Paperclip className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">Attached: Official_State_Validation_Certificate_{project.id}.pdf</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300">
              Verified ✓
            </span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-end space-x-2 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationEmailModal;

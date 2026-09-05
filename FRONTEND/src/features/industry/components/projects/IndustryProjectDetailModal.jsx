import React from 'react';
import { X, Briefcase, Building2, UserCheck, Users, Banknote, Calendar, ArrowRight, ShieldCheck, FileText, ExternalLink } from 'lucide-react';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const IndustryProjectDetailModal = ({ project, onClose, onNavigateToFunding }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-700">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-[10px] tracking-wider text-emerald-400 uppercase">ACTIVE PROJECT</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[9px] font-bold border border-emerald-400/30">
                  Approved
                </span>
              </div>
              <h2 className="text-base font-black text-white mt-0.5 line-clamp-1">{project.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-slate-50 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center text-xs font-bold text-slate-700">
                <Building2 className="w-4 h-4 mr-1.5 text-[#007A61]" />
                <span>{project.university || 'Ranchi University'}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                {project.stage || 'In Progress'}
              </span>
            </div>

            {project.problemStatement && (
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Problem Statement / Outcome</p>
                <p className="text-xs font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{project.problemStatement}"
                </p>
              </div>
            )}

            {project.pdfUrl && (
              <div className="flex items-center justify-between p-2.5 bg-rose-50/80 border border-rose-200 rounded-xl">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{project.pdfName || 'Prototype_Blueprint.pdf'}</p>
                    <p className="text-[9.5px] text-emerald-700 font-semibold">✓ Verified Technical Blueprint</p>
                  </div>
                </div>
                <a href={getPdfViewUrl(project.pdfUrl, project.pdfName || 'Prototype_Blueprint.pdf')} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 shadow-2xs cursor-pointer">
                  <span>View PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center">
                  <UserCheck className="w-3 h-3 mr-1 text-blue-600" /> Faculty Mentor
                </p>
                <p className="text-xs font-bold text-slate-800 mt-1">{project.leadMentor || 'Faculty Nodal Officer'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center">
                  <Users className="w-3 h-3 mr-1 text-purple-600" /> Student Team
                </p>
                <p className="text-xs font-bold text-slate-800 mt-1">{project.studentTeam || 'Innovation Team'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center">
              <Banknote className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Financial Overview & Lab Testing Grants
            </p>

            {project.labChargesQuoted && (
              <div className="p-3.5 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 border border-emerald-300/90 rounded-xl space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#007A61]" />
                    <span>University Accepted Lab Fee Commitment</span>
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-md text-xs font-black shadow-2xs">
                    {project.labChargesQuoted}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                  The University (<strong className="text-emerald-950">{project.university || 'Ranchi University'}</strong>) has officially accepted and confirmed that it will pay/grant <strong className="text-emerald-950">{project.labChargesQuoted}</strong> to the Industry for utilizing research laboratory facilities, specialized testing apparatus, and technical resources.
                </p>
                {project.quoteTerms && (
                  <p className="text-[11px] text-slate-600 italic pt-1 border-t border-emerald-200/70">
                    Agreed Terms: "{project.quoteTerms}"
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Sanctioned Budget</span>
                <span className="text-sm font-black text-emerald-800 mt-0.5 block">{project.budget || '₹ 0'}</span>
              </div>
              <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">
                  {project.labChargesQuoted ? 'Committed Lab Fee' : 'Disbursed'}
                </span>
                <span className="text-sm font-black text-blue-800 mt-0.5 block">
                  {project.labChargesQuoted || project.disbursed || '₹ 0'}
                </span>
              </div>
              <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-[9px] font-bold text-slate-500 uppercase block">Fee Status</span>
                <span className="text-xs font-black text-amber-800 mt-1 block">
                  {project.quoteStatus === 'Accepted' ? 'Fee Accepted' : project.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Close
          </button>
          
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigateToFunding) onNavigateToFunding();
            }}
            className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Proceed to Funding & Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryProjectDetailModal;

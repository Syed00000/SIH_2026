import React from 'react';
import { Briefcase, Building2, UserCheck, Users, Banknote, ShieldCheck, FileText, ExternalLink, ArrowRight } from 'lucide-react';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';

export const IndustryProjectDetailPanel = ({ project, onBack, onNavigateToFunding }) => {
  if (!project) return null;

  const projectId = project.id || project.projectId || 'PRJ-ACT-001';

  return (
    <FullPageDetailPanel
      onBack={onBack}
      backLabel="Back to Active Projects"
      breadcrumbs={['Industry Portal', 'Active University Research', projectId]}
      idBadge={projectId}
      statusBadge={
        (project.status === 'Deployed' || project.isDeployed || project.isLocked) ? (
          <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-black border border-teal-300">
            🔒 Deployed
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-300">
            {project.stage || 'In Progress'}
          </span>
        )
      }
      title={project.title}
      subtitle={`Partner Institution: ${project.university || 'State University'} · Lead Mentor: ${project.leadMentor || 'Faculty Nodal Officer'}`}
      stickyFooter={
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            ← Back to Listing
          </button>
          <button
            type="button"
            onClick={() => {
              if (onNavigateToFunding) onNavigateToFunding();
            }}
            className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all shadow-sm cursor-pointer"
          >
            <span>Proceed to Funding & Support Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Core Project Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center text-xs font-bold text-slate-700">
              <Building2 className="w-4 h-4 mr-1.5 text-[#007A61]" />
              <span>{project.university || 'State University'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
              Status: {project.quoteStatus === 'Accepted' ? 'Fee Accepted & Active' : project.status || 'Active'}
            </span>
          </div>

          {project.problemStatement && (
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">Problem Statement & Scope</p>
              <p className="text-xs font-medium text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 leading-relaxed italic">
                "{project.problemStatement}"
              </p>
            </div>
          )}

          {project.pdfUrl && (
            <div className="flex items-center justify-between p-3 bg-rose-50/80 border border-rose-200 rounded-xl">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{project.pdfName || 'Prototype_Blueprint.pdf'}</p>
                  <p className="text-[9.5px] text-emerald-700 font-semibold">✓ Verified Technical Blueprint</p>
                </div>
              </div>
              <a
                href={getPdfViewUrl(project.pdfUrl, project.pdfName || 'Prototype_Blueprint.pdf')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-white hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              >
                <span>View PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Faculty Mentor
              </p>
              <p className="text-xs font-bold text-slate-800 mt-1">{project.leadMentor || 'Faculty Nodal Officer'}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center">
                <Users className="w-3.5 h-3.5 mr-1.5 text-purple-600" /> Student Innovation Team
              </p>
              <p className="text-xs font-bold text-slate-800 mt-1">{project.studentTeam || 'Assigned Innovation Team'}</p>
            </div>
          </div>
        </div>

        {/* Financial & Testing Commitments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center">
            <Banknote className="w-4 h-4 mr-1.5 text-emerald-600" /> Financial Overview & Lab Testing Grants
          </p>

          {project.labChargesQuoted && (
            <div className="p-4 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 border border-emerald-300/90 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-950 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#007A61]" />
                  <span>University Accepted Lab Fee Commitment</span>
                </span>
                <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black shadow-2xs">
                  {project.labChargesQuoted}
                </span>
              </div>
              <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                The University (<strong className="text-emerald-950">{project.university || 'State University'}</strong>) has officially accepted and confirmed that it will pay/grant <strong className="text-emerald-950">{project.labChargesQuoted}</strong> to the Industry for utilizing research laboratory facilities and testing apparatus.
              </p>
              {project.quoteTerms && (
                <p className="text-[11px] text-slate-600 italic pt-1.5 border-t border-emerald-200/70">
                  Agreed Terms: "{project.quoteTerms}"
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Sanctioned Budget</span>
              <span className="text-sm font-black text-emerald-800 mt-0.5 block">{project.budget || '₹ 0'}</span>
            </div>
            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">
                {project.labChargesQuoted ? 'Committed Lab Fee' : 'Disbursed'}
              </span>
              <span className="text-sm font-black text-blue-800 mt-0.5 block">
                {project.labChargesQuoted || project.disbursed || '₹ 0'}
              </span>
            </div>
            <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Fee Status</span>
              <span className="text-xs font-black text-amber-800 mt-1 block">
                {project.quoteStatus === 'Accepted' ? 'Fee Accepted' : project.status || 'Active'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </FullPageDetailPanel>
  );
};

export default IndustryProjectDetailPanel;

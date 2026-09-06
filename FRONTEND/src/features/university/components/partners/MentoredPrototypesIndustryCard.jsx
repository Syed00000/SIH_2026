import React from 'react';
import { Rocket, FileText, ArrowUpRight, Users, CheckCircle2, FlaskConical, Cpu } from 'lucide-react';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const MentoredPrototypesIndustryCard = ({ prototypes = [], onConnectIndustry }) => {
  if (!prototypes || prototypes.length === 0) return null;

  return (
    <div className="bg-white border-2 border-emerald-300 rounded-2xl shadow-xs overflow-hidden select-none text-left">
      <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#007A61] text-white flex items-center justify-center shadow-2xs shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 flex items-center space-x-2">
              <span>Mentored Research Prototypes Submitted to University</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {prototypes.length} Ready for Industry Collaboration
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Prototypes developed by student squads & faculty mentors, verified with in-house lab metrics & Cloudinary PDF.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {prototypes.map((p) => {
          const pdfUrl = p.pdfUrl || p.prototypeData?.pdfUrl;
          const pdfName = p.pdfName || p.prototypeData?.pdfName || 'Prototype_Blueprint.pdf';
          const teamName = p.studentTeam || p.teamName || p.assignedTeamName || 'Student Research Squad';
          const leadName = p.studentLead || p.leadMentor || 'Student Lead';
          const protoTitle = p.prototypeData?.title || p.title;
          const techStack = p.prototypeData?.techStack;
          const mechanism = p.prototypeData?.mechanism || p.prototypeData?.content;
          const targetPartner = p.prototypeData?.industryRequisition?.selectedPartner;
          const labStatus = p.prototypeData?.labTests?.status || 'Passed';

          return (
            <div key={p.projectId || p.id || p._id} className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-[10px] font-mono font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {p.projectId || p.id}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900">{p.title}</h4>
                  <span className="text-[9.5px] font-black bg-emerald-50 text-[#007A61] border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-[#007A61]" />
                    <span>Submitted for University Review</span>
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
                  <span className="flex items-center space-x-1 font-semibold text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teamName} ({leadName})</span>
                  </span>
                  <span className="text-emerald-700 font-bold">
                    💰 1st Grant Disbursed: {p.sanctionedBudget || p.disbursedAmount || '₹ 80,000'}
                  </span>
                  <span className="text-blue-700 font-bold">
                    🧪 Lab Verdict: {labStatus}
                  </span>
                </div>

                {/* Prototype Architecture & Target Requisition */}
                <div className="text-[11px] text-slate-800 bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-900">
                    <Cpu className="w-3.5 h-3.5 text-[#007A61]" />
                    <span>Prototype: {protoTitle}</span>
                    {techStack && <span className="text-[10px] font-mono text-slate-500 font-normal">({techStack})</span>}
                  </div>
                  {mechanism && (
                    <p className="text-slate-600 italic text-[10.5px] line-clamp-2">
                      "{mechanism}"
                    </p>
                  )}
                  {targetPartner && (
                    <p className="text-[10.5px] font-bold text-[#007A61]">
                      🎯 Requested Industry Facility: {targetPartner}
                    </p>
                  )}
                  {p.industryMentor && (
                    <div className="flex items-center justify-between text-[10.5px] font-bold text-emerald-900 bg-white p-2 rounded-lg border border-emerald-300">
                      <span className="flex items-center space-x-1.5"><Users className="w-3 h-3 text-[#007A61]" /><span>Industry Mentor: <strong>{p.industryMentor.name}</strong> ({p.industryMentor.designation})</span></span>
                      <span className="text-[9.5px] text-emerald-700 font-mono">{p.industryMentor.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start lg:self-auto shrink-0">
                {pdfUrl ? (
                  <a
                    href={getPdfViewUrl(pdfUrl, pdfName)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                    title={pdfName}
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                    <span>View Technical PDF</span>
                  </a>
                ) : (
                  <span className="text-[10.5px] text-slate-400 italic">No PDF uploaded</span>
                )}

                <button
                  type="button"
                  onClick={() => onConnectIndustry && onConnectIndustry(p)}
                  className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Request Industry Lab / CSR</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MentoredPrototypesIndustryCard;

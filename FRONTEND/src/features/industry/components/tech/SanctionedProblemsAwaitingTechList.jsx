import React from 'react';
import {
  FolderGit2, Lock, Building2, Cpu, ArrowRight,
  FileText, ExternalLink, Sparkles, Layers, CheckCircle2
} from 'lucide-react';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const SanctionedProblemsAwaitingTechList = ({
  eligibleProblems = [],
  onSelectProblem
}) => {
  if (!eligibleProblems || eligibleProblems.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 text-left animate-in fade-in duration-200">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#007A61] flex items-center justify-center font-black shrink-0">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <span>Sanctioned Problems Awaiting Tech Transfer &amp; Lab Access</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black border border-emerald-200">
                {eligibleProblems.length} Ready
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              University has accepted and locked the laboratory fee. Click to inspect prototype tech stack and dispatch official Lab Access ID Letter.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-xl text-[10px] font-extrabold flex items-center space-x-1 shrink-0 self-start sm:self-auto">
          <Lock className="w-3 h-3 text-amber-600" />
          <span>Fee Locked by University</span>
        </span>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {eligibleProblems.map((prob) => {
          const proto = prob.prototypeData || {};
          const stack = prob.techStack || proto.techStack || '';
          const stackList = stack ? stack.split(',').map((s) => s.trim()).filter(Boolean) : [];
          const fee = prob.feeAmount || '₹ 25,000';
          const dept = prob.department || proto.department || prob.domain || 'Applied R&D';

          return (
            <div
              key={prob.projectId || prob.requestId}
              onClick={() => onSelectProblem && onSelectProblem(prob)}
              className="p-4 bg-gradient-to-r from-emerald-50/40 via-white to-slate-50/60 border border-slate-200 hover:border-emerald-400 rounded-2xl transition-all shadow-2xs hover:shadow-md cursor-pointer group space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {prob.challengeId || prob.projectId || 'PRJ-2026'}
                  </span>
                  <span className="text-xs font-bold text-[#007A61] flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{prob.universityName || 'Ranchi University'}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-[10.5px] font-black flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Fee Locked: {fee}</span>
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 group-hover:text-[#007A61] transition-colors line-clamp-1">
                  {prob.title}
                </h4>
                {prob.problemStatement && (
                  <p className="text-xs text-slate-600 font-medium line-clamp-2 mt-0.5 italic">
                    "{prob.problemStatement}"
                  </p>
                )}
              </div>

              {/* Prototype Tech Preview Box */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center space-x-1 mr-1">
                    <Cpu className="w-3 h-3 text-[#007A61]" />
                    <span>Prototype Tech:</span>
                  </span>
                  {stackList.length > 0 ? (
                    stackList.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold rounded border border-emerald-200"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium italic">Standard R&amp;D Stack</span>
                  )}
                  {dept && (
                    <span className="px-2 py-0.5 bg-sky-50 text-sky-800 text-[10px] font-bold rounded border border-sky-200">
                      {dept}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-auto">
                  {prob.pdfUrl && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(getPdfViewUrl(prob.pdfUrl, prob.pdfName || 'Blueprint.pdf'), '_blank');
                      }}
                      className="text-[10.5px] font-bold text-rose-600 hover:text-rose-800 flex items-center space-x-0.5 hover:underline"
                    >
                      <FileText className="w-3 h-3" />
                      <span>PDF</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProblem && onSelectProblem(prob);
                    }}
                    className="px-3 py-1 bg-[#007A61] group-hover:bg-[#00604c] text-white text-[11px] font-bold rounded-lg flex items-center space-x-1 shadow-2xs transition-all"
                  >
                    <span>Grant Tech &amp; Lab Access</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SanctionedProblemsAwaitingTechList;

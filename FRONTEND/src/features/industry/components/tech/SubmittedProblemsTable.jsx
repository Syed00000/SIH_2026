import React, { useState } from 'react';
import {
  Search, Building2, Cpu, Key, ArrowRight,
  FileText, ExternalLink, CheckCircle2, Clock, Lock
} from 'lucide-react';
import { getPdfViewUrl } from '../../../../shared/utils/openPdf.js';

export const SubmittedProblemsTable = ({
  eligibleProblems = [],
  onSelectProblem
}) => {
  const [search, setSearch] = useState('');

  const filtered = eligibleProblems.filter((p) => {
    const term = search.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(term) ||
      (p.problemStatement || '').toLowerCase().includes(term) ||
      (p.universityName || '').toLowerCase().includes(term) ||
      (p.techStack || '').toLowerCase().includes(term) ||
      (p.projectId || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 text-left">
      {/* Table Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
            <span>Submitted University Problem Statements</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
              {eligibleProblems.length} Sanctioned
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Problem statements whose research fee has been accepted and locked by the university.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems, tech stack, university..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#007A61]"
          />
        </div>
      </div>

      {/* Table or Empty State */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center space-y-2 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <p className="text-xs font-bold text-slate-700">No Sanctioned Problems Found</p>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
            Problem statements will appear here only after the university accepts and locks the proposal fee.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="pb-2.5">Problem Statement &amp; Institution</th>
                <th className="pb-2.5">Prototype Tech Stack</th>
                <th className="pb-2.5">Fee Status</th>
                <th className="pb-2.5">Lab Access Status</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prob) => {
                const proto = prob.prototypeData || {};
                const stack = prob.techStack || proto.techStack || '';
                const stackList = stack ? stack.split(',').map((s) => s.trim()).filter(Boolean) : [];
                const isGranted = (prob.grantedTechHelp?.length || 0) > 0;
                const lastGrant = isGranted ? prob.grantedTechHelp[prob.grantedTechHelp.length - 1] : null;

                return (
                  <tr
                    key={prob.projectId || prob.requestId}
                    onClick={() => onSelectProblem && onSelectProblem(prob)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 pr-3 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {prob.challengeId || prob.projectId || 'PRJ'}
                        </span>
                        <span className="text-[11px] font-bold text-[#007A61] flex items-center space-x-1">
                          <Building2 className="w-3 h-3" />
                          <span>{prob.universityName || 'Ranchi University'}</span>
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-[#007A61] transition-colors line-clamp-1">
                        {prob.title}
                      </h4>
                      {prob.problemStatement && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-1">
                          "{prob.problemStatement}"
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 pr-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {stackList.length > 0 ? (
                          stackList.map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[9.5px] font-mono font-bold rounded border border-emerald-200"
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Standard Prototype</span>
                        )}
                      </div>
                      {prob.pdfUrl && (
                        <div className="pt-1">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(getPdfViewUrl(prob.pdfUrl, prob.pdfName || 'Blueprint.pdf'), '_blank');
                            }}
                            className="text-[10px] font-bold text-rose-600 hover:text-rose-800 flex items-center space-x-0.5 hover:underline"
                          >
                            <FileText className="w-2.5 h-2.5" />
                            <span>View Blueprint PDF</span>
                            <ExternalLink className="w-2 h-2 ml-0.5" />
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-black flex items-center space-x-1 w-fit">
                        <Lock className="w-3 h-3 text-emerald-700" />
                        <span>Fee Locked: {prob.feeAmount || '₹ 25,000'}</span>
                      </span>
                    </td>

                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      {isGranted ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-[9.5px] font-bold flex items-center space-x-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span>Letter Dispatched</span>
                          </span>
                          {lastGrant?.accessCredentials && (
                            <p className="font-mono text-[9px] font-bold text-slate-600">
                              Key: {lastGrant.accessCredentials}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-md text-[9.5px] font-bold flex items-center space-x-1 w-fit">
                          <Clock className="w-3 h-3 text-purple-600" />
                          <span>Awaiting Access ID</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProblem && onSelectProblem(prob);
                        }}
                        className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white text-[11px] font-bold rounded-xl flex items-center space-x-1.5 shadow-2xs transition-all ml-auto cursor-pointer"
                      >
                        <span>{isGranted ? 'View / Re-issue Key' : 'Grant Lab Access & ID Key'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmittedProblemsTable;

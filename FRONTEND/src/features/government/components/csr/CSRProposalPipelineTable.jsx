import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, Search, ExternalLink, X, FileText, Building2, MapPin } from 'lucide-react';

const getSourceBadge = (scheme = '') => {
  if (scheme.includes('Corporate')) return 'bg-blue-50 text-blue-700 border-blue-200/80';
  if (scheme.includes('Govt')) return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  if (scheme.includes('Joint')) return 'bg-purple-50 text-purple-700 border-purple-200/80';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

export const CSRProposalPipelineTable = ({ proposals = [], onOpenAddModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDprModal, setActiveDprModal] = useState(null);

  const filtered = proposals.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.institutionName.toLowerCase().includes(q) ||
      p.sourceScheme.toLowerCase().includes(q) ||
      (p.projectTitle && p.projectTitle.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      {/* Table Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
            COMPREHENSIVE PROPOSAL APPROVAL PIPELINE
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Live tracking linked with R&D Solution Proposals and Project DPRs
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search proposals or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 shadow-2xs"
            />
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Proposal Entry</span>
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-5">ID & Inst. Code</th>
              <th className="py-3.5 px-4">Institution & Linked Project</th>
              <th className="py-3.5 px-4">Source & Scheme</th>
              <th className="py-3.5 px-4">Due Diligence Status</th>
              <th className="py-3.5 px-4">Board Approval</th>
              <th className="py-3.5 px-5">MoU & DPR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  No proposal entries found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-blue-600">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{item.institutionName}</div>
                    {item.projectTitle && (
                      <div className="text-[11px] text-blue-600 font-medium flex items-center space-x-1 mt-0.5">
                        <span className="font-mono bg-blue-50 px-1.5 py-0.2 rounded text-[10px] font-bold border border-blue-100">{item.projectId || item.solutionId}</span>
                        <span className="truncate max-w-[220px]">{item.projectTitle}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getSourceBadge(item.sourceScheme)}`}>
                      {item.sourceScheme}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.dueDiligenceStatus === 'passed' ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{item.dueDiligence}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-amber-700 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.dueDiligence}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] font-semibold text-emerald-700">
                    {item.boardApproval}
                  </td>
                  <td className="py-3.5 px-5">
                    <button
                      onClick={() => setActiveDprModal(item)}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200/80 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{item.mouExecution}</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Linked Project DPR Quick Details Modal */}
      {activeDprModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{activeDprModal.projectId || activeDprModal.id}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{activeDprModal.projectTitle || activeDprModal.institutionName}</h3>
              </div>
              <button onClick={() => setActiveDprModal(null)} className="p-1 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p className="text-slate-600 leading-relaxed">{activeDprModal.abstract || 'Approved R&D Solution project grant linked with multi-tier statutory verification.'}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Allocated Grant</span>
                  <span className="text-xs font-bold text-slate-900">{activeDprModal.allocatedAmount}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">DPR Phase 1 Budget</span>
                  <span className="text-xs font-bold text-emerald-700">{activeDprModal.dprBudget || activeDprModal.allocatedAmount}</span>
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setActiveDprModal(null)} className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSRProposalPipelineTable;

import React, { useState } from 'react';
import { CheckCircle2, Clock, Search, Eye, Filter, ArrowUpRight, Trash2, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { ProposalDetailModal } from './ProposalDetailModal.jsx';

const getSourceBadgeStyle = (scheme = '') => {
  if (scheme.includes('Corporate')) return 'bg-blue-50 text-blue-700 border-blue-200/80';
  if (scheme.includes('Govt')) return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  if (scheme.includes('Joint')) return 'bg-purple-50 text-purple-700 border-purple-200/80';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

const getBoardBadgeStyle = (board = '') => {
  if (board.includes('Rejected') || board.includes('Failed') || board.includes('Disqualified')) {
    return 'text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200';
  }
  if (board.includes('Approved') || board.includes('Sanctioned')) {
    return 'text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200';
  }
  return 'text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200';
};

const getMouBadgeStyle = (mou = '') => {
  if (mou.includes('Terminated') || mou.includes('Not Executed') || mou.includes('Rejected')) {
    return 'text-rose-700 font-bold';
  }
  if (mou.includes('Signed') || mou.includes('Executed')) {
    return 'text-emerald-700 font-semibold';
  }
  return 'text-slate-600 font-medium';
};

export const CSRProposalPipelineTable = ({
  proposals = [],
  onUpdateProposal,
  onDeleteProposal,
  onInitiateDisbursal,
  activeFilter = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schemeFilter, setSchemeFilter] = useState('All');
  const [selectedProposal, setSelectedProposal] = useState(null);

  const filtered = proposals.filter((p) => {
    // 1. Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        p.id.toLowerCase().includes(q) ||
        p.institutionName.toLowerCase().includes(q) ||
        p.sourceScheme.toLowerCase().includes(q) ||
        p.dueDiligence.toLowerCase().includes(q) ||
        (p.district && p.district.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Scheme Filter
    if (schemeFilter !== 'All') {
      if (schemeFilter === 'Corporate' && !p.sourceScheme.includes('Corporate')) return false;
      if (schemeFilter === 'Govt' && !p.sourceScheme.includes('Govt')) return false;
      if (schemeFilter === 'Joint' && !p.sourceScheme.includes('Joint')) return false;
    }

    // 3. Statutory Filter Card
    if (activeFilter === 'verified') {
      return p.dueDiligenceStatus === 'passed';
    }
    if (activeFilter === 'pending') {
      return p.dueDiligenceStatus === 'review';
    }
    if (activeFilter === 'rejected') {
      return (
        p.dueDiligenceStatus === 'failed' ||
        p.dueDiligence.includes('Failed') ||
        p.dueDiligence.includes('Rejected') ||
        p.boardApproval?.includes('Rejected')
      );
    }

    return true;
  });

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              COMPREHENSIVE PROPOSAL APPROVAL PIPELINE
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Click any ready-to-work proposal row to view complete project dossier, payment tranches, and statutory clearance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Scheme Filter */}
            <select
              value={schemeFilter}
              onChange={(e) => setSchemeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">All Funding Schemes</option>
              <option value="Corporate">Corporate CSR (Sec 135)</option>
              <option value="Govt">Government Grants (State R&D)</option>
              <option value="Joint">Joint Co-Funding (PPP)</option>
            </select>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search proposal ID, HEI, title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">ID & Inst. Code</th>
                <th className="py-3.5 px-4">Institution / Project Title</th>
                <th className="py-3.5 px-4">Source & Scheme</th>
                <th className="py-3.5 px-4">Due Diligence Status</th>
                <th className="py-3.5 px-4">Board Approval Committee</th>
                <th className="py-3.5 px-4">MoU Execution</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                    <span>No active proposal entries found matching the filter.</span>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isFailed =
                    item.dueDiligenceStatus === 'failed' ||
                    item.dueDiligence?.includes('Failed') ||
                    item.dueDiligence?.includes('Disqualified') ||
                    item.dueDiligence?.includes('Rejected') ||
                    item.boardApproval?.includes('Rejected');

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedProposal(item)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-5 font-mono text-[11px] font-bold text-blue-600 whitespace-nowrap">
                        <span className="group-hover:underline flex items-center space-x-1">
                          <span>{item.id}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{item.institutionName}</div>
                        <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
                          {item.projectTitle || 'Societal Innovation & Tech Transfer'}
                        </div>
                        {item.district && (
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.district} District</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getSourceBadgeStyle(
                            item.sourceScheme
                          )}`}
                        >
                          {item.sourceScheme}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isFailed ? (
                          <span className="inline-flex items-center space-x-1 text-rose-700 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>{item.dueDiligence || 'Failed / Disqualified'}</span>
                          </span>
                        ) : item.dueDiligenceStatus === 'passed' ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                            <span>{item.dueDiligence}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-amber-700 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>{item.dueDiligence}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] whitespace-nowrap">
                        <span className={`inline-block ${getBoardBadgeStyle(item.boardApproval)}`}>
                          {item.boardApproval}
                        </span>
                      </td>
                      <td className={`py-3.5 px-4 text-[11px] whitespace-nowrap ${getMouBadgeStyle(item.mouExecution)}`}>
                        {item.mouExecution}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedProposal(item)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold flex items-center space-x-1 text-[11px] cursor-pointer"
                            title="View Full Proposal Dossier & Payments"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>View Dossier</span>
                          </button>
                          {onDeleteProposal && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete proposal ${item.id}?`)) {
                                  onDeleteProposal(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Delete Proposal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dossier & Payment Modal */}
      <ProposalDetailModal
        isOpen={Boolean(selectedProposal)}
        onClose={() => setSelectedProposal(null)}
        proposal={selectedProposal}
        onUpdateProposal={(updated) => {
          onUpdateProposal?.(updated);
          setSelectedProposal(updated);
        }}
        onInitiateDisbursal={onInitiateDisbursal}
      />
    </>
  );
};

export default CSRProposalPipelineTable;

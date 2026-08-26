import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, Search } from 'lucide-react';

const getSourceBadgeStyle = (scheme = '') => {
  if (scheme.includes('Corporate')) return 'bg-blue-50 text-blue-700 border-blue-200/80';
  if (scheme.includes('Govt')) return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
  if (scheme.includes('Joint')) return 'bg-purple-50 text-purple-700 border-purple-200/80';
  return 'bg-slate-50 text-slate-700 border-slate-200';
};

const getBoardBadgeStyle = (board = '') => {
  if (board.includes('Approved') || board.includes('Sanctioned')) {
    return 'text-emerald-700 font-semibold';
  }
  return 'text-amber-700 font-semibold';
};

const getMouBadgeStyle = (mou = '') => {
  if (mou.includes('Signed') || mou.includes('Executed')) {
    return 'text-emerald-700 font-semibold';
  }
  return 'text-slate-600 font-medium';
};

export const CSRProposalPipelineTable = ({ proposals = [], onOpenAddModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = proposals.filter((p) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.id.toLowerCase().includes(q) ||
      p.institutionName.toLowerCase().includes(q) ||
      p.sourceScheme.toLowerCase().includes(q) ||
      p.dueDiligence.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col">
      {/* Table Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
          COMPREHENSIVE PROPOSAL APPROVAL PIPELINE
        </h3>

        <div className="flex items-center space-x-2.5">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 shadow-2xs"
            />
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-xs transition-colors cursor-pointer shrink-0"
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
              <th className="py-3.5 px-4">Institution / Requester Name</th>
              <th className="py-3.5 px-4">Source & Scheme</th>
              <th className="py-3.5 px-4">Due Diligence Status</th>
              <th className="py-3.5 px-4">Board Approval Committee</th>
              <th className="py-3.5 px-5">MoU Execution</th>
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
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {item.institutionName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getSourceBadgeStyle(item.sourceScheme)}`}>
                      {item.sourceScheme}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.dueDiligenceStatus === 'passed' ? (
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
                  <td className={`py-3.5 px-4 text-[11px] ${getBoardBadgeStyle(item.boardApproval)}`}>
                    {item.boardApproval}
                  </td>
                  <td className={`py-3.5 px-5 text-[11px] ${getMouBadgeStyle(item.mouExecution)}`}>
                    {item.mouExecution}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSRProposalPipelineTable;

import React from 'react';
import { Eye, ChevronRight, CheckCircle2, Trash2 } from 'lucide-react';
import { parseGrantRupees } from './GrantPaymentModal.jsx';

export const SolutionProposalTable = ({
  proposals = [],
  onViewDetails,
  onDelete
}) => {
  return (
    <div className="bg-white border border-slate-200 overflow-hidden shadow-xs rounded-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Proposal ID &amp; Title</th>
              <th className="py-3 px-4">HEI &amp; District</th>
              <th className="py-3 px-4">Sector</th>
              <th className="py-3 px-4 text-right">DPR Budget</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {proposals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                  No project proposals currently pending review matching the filter criteria.
                </td>
              </tr>
            ) : (
              proposals.map((proposal) => {
                const disbNum = parseGrantRupees(proposal.disbursedAmount) || 0;
                const isFunded = disbNum > 0 || proposal.budgetStatus === 'Grant Sanctioned by Government' || proposal.budgetStatus === 'Grant Disbursed';
                const isApproved = isFunded || proposal.status === 'Approved' || proposal.budgetStatus === 'Forwarded to CSR Grants Pipeline';
                const isRejected = proposal.status === 'Rejected';

                return (
                  <tr key={proposal.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-xs border border-slate-200">
                          {proposal.id}
                        </span>
                        <span className="font-bold text-slate-900 line-clamp-1">{proposal.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      <div>{proposal.hei || 'Ranchi University'}</div>
                      <div className="text-[10px] text-slate-400">{proposal.district || 'Ranchi'} District</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{proposal.sector}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {proposal.requestedGrant || '₹ 73,000'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border inline-block ${
                        isRejected
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : isFunded
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : isApproved
                          ? 'bg-[#007A61]/10 text-[#007A61] border-[#007A61]/30'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        {isRejected
                          ? 'Rejected'
                          : isFunded
                          ? 'Grant Disbursed'
                          : isApproved
                          ? 'Forwarded'
                          : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {isFunded ? (
                          <a
                            href="?tab=projects_active"
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900 hover:bg-black rounded-xs transition-colors cursor-pointer inline-flex items-center space-x-1 shadow-xs"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Active</span>
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onViewDetails(proposal)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#007A61] hover:bg-[#00624e] rounded-xs transition-colors cursor-pointer inline-flex items-center space-x-1 shadow-xs"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Review</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDelete(proposal.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                          title="Delete Proposal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
  );
};

export default SolutionProposalTable;

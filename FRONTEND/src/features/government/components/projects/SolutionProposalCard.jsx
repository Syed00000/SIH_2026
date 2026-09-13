import React from 'react';
import { Building2, Eye, CheckCircle2, ChevronRight, Trash2 } from 'lucide-react';
import { parseGrantRupees } from './GrantPaymentModal.jsx';

export const SolutionProposalCard = ({
  proposal,
  onViewDetails,
  onDelete
}) => {
  const disbNum = parseGrantRupees(proposal.disbursedAmount) || 0;
  const isFunded = disbNum > 0 || proposal.budgetStatus === 'Grant Sanctioned by Government' || proposal.budgetStatus === 'Grant Disbursed';
  const isApproved = isFunded || proposal.status === 'Approved' || proposal.budgetStatus === 'Forwarded to CSR Grants Pipeline';
  const isRejected = proposal.status === 'Rejected';

  return (
    <div className="bg-white border border-slate-200 p-4.5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xs">
      <div className="space-y-2 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-300">
            {proposal.id}
          </span>
          <span className="text-xs font-bold text-slate-800">{proposal.sector}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 font-medium">{proposal.district || 'Ranchi'} District</span>
          <span className="text-slate-300">•</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${
            isRejected
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : isFunded
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : isApproved
              ? 'bg-[#007A61]/10 text-[#007A61] border-[#007A61]/30'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            {isRejected
              ? 'Rejected by Review Board'
              : isFunded
              ? 'Grant Disbursed (In Active Execution) ✓'
              : isApproved
              ? 'Approved & Forwarded for Clearance ✓'
              : 'Pending Technical Scrutiny'}
          </span>
        </div>

        <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
          {proposal.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
          <span className="font-bold text-slate-900 flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{proposal.hei || 'Ranchi University (RU001)'}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>DPR Allocation: <strong className="font-mono text-slate-900 font-bold">{proposal.requestedGrant || '₹ 73,000'}</strong></span>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
        {isFunded ? (
          <a
            href="?tab=projects_active"
            className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Active Project</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={() => onViewDetails(proposal)}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#007A61] hover:bg-[#00624e] rounded-xs transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review &amp; Validate</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onDelete(proposal.id)}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xs border border-transparent hover:border-red-200 transition-colors cursor-pointer"
          title="Delete Proposal"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SolutionProposalCard;

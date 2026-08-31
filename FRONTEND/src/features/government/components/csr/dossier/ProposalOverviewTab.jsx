import React from 'react';
import { IndianRupee, Layers, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { projectCsrSyncService } from '../../../services/projectCsrSyncService.js';
import { formatRupeesINR, parseGrantRupees } from '../../projects/GrantPaymentModal.jsx';

export const ProposalOverviewTab = ({ proposal, linkedProject }) => {
  const projId = proposal.projectId || proposal.id?.replace('PROP-', '') || proposal.id;
  const rawDisbursed =
    projectCsrSyncService.getProjectDisbursed(proposal.id) ||
    projectCsrSyncService.getProjectDisbursed(projId) ||
    (linkedProject?.disbursedAmount ? parseGrantRupees(linkedProject.disbursedAmount) : 0) ||
    (proposal.disbursedAmount ? parseGrantRupees(proposal.disbursedAmount) : 0);

  const disbursedDisplay = rawDisbursed > 0 ? formatRupeesINR(rawDisbursed) : (proposal.disbursedAmount && proposal.disbursedAmount !== '₹ 0' ? proposal.disbursedAmount : '₹ 0');

  const budgetDisplay = proposal.allocatedAmount || proposal.fundingRequested || proposal.requestedGrant || proposal.budget || linkedProject?.sanctionedGrant || '₹ 75,000';

  return (
    <div className="space-y-4 text-xs select-none">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
            Approved DPR Budget
          </span>
          <span className="text-base font-black font-mono text-slate-900 block mt-0.5">
            {budgetDisplay}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            Scheme: {proposal.sourceScheme || 'State Innovation Grant'}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
            Disbursed to Escrow
          </span>
          <span className="text-base font-black font-mono text-[#007A61] block mt-0.5">
            {disbursedDisplay}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            {rawDisbursed > 0 ? 'Tranche Released & Credited ✓' : 'Tranche Balance: Available'}
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-wider">
            Diligence Status
          </span>
          <span className="text-base font-bold text-slate-900 block mt-0.5">
            {proposal.dueDiligence || 'Passed (All Checks)'}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            Verified by State Council
          </span>
        </div>
      </div>

      {/* Challenge Dossier Summary */}
      <div className="border border-slate-200/90 rounded-xl p-4 bg-slate-50/60 space-y-2 shadow-2xs">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Problem Description & Institutional Context
        </h4>
        <p className="text-slate-800 leading-relaxed font-semibold text-xs">
          {proposal.projectTitle || proposal.title || 'Societal Problem Resolution Project'}
        </p>
        <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-4 text-xs text-slate-600">
          <span><strong>Lead Investigator:</strong> {proposal.leadMentor || proposal.teamLead || 'Dr. Amitabh Verma'}</span>
          <span><strong>Institution:</strong> {proposal.institutionName || 'Ranchi University (RU001)'}</span>
          <span><strong>District:</strong> {proposal.district || 'Ranchi'}</span>
        </div>
      </div>

      {/* Statutory Registrations */}
      <div className="border border-slate-200/90 rounded-xl p-4 bg-white space-y-3 shadow-2xs">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Statutory Registrations & Governance
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">MCA CSR-1 No.</span>
            <span className="font-mono font-bold text-slate-900 text-[11.5px]">{proposal.csr1Number || 'CSR00018921'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">80G / 12A Status</span>
            <span className="font-mono font-bold text-slate-900 text-[11.5px]">{proposal.pan80G || '80G-VALIDATED'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">Board Approval</span>
            <span className="font-bold text-slate-900 text-[11.5px]">{proposal.boardApproval || 'Approved'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-extrabold uppercase">MoU Status</span>
            <span className="font-bold text-slate-900 text-[11.5px]">{proposal.mouExecution || 'Signed & Active'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalOverviewTab;

import React from 'react';
import { IndianRupee, Layers, ShieldCheck, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { projectCsrSyncService } from '../../../services/projectCsrSyncService.js';
import { formatRupeesINR, parseGrantRupees } from '../../projects/GrantPaymentModal.jsx';
import { TrancheAmountAdjuster } from './TrancheAmountAdjuster.jsx';

export const ProposalOverviewTab = ({
  proposal,
  linkedProject,
  disburseAmount = 40000,
  setDisburseAmount
}) => {
  const projId = proposal.projectId || proposal.id?.replace('PROP-', '') || proposal.id;
  const rawDisbursed =
    projectCsrSyncService.getProjectDisbursed(proposal.id) ||
    projectCsrSyncService.getProjectDisbursed(projId) ||
    (linkedProject?.disbursedAmount ? parseGrantRupees(linkedProject.disbursedAmount) : 0) ||
    (proposal.disbursedAmount ? parseGrantRupees(proposal.disbursedAmount) : 0);

  const disbursedDisplay = rawDisbursed > 0 ? formatRupeesINR(rawDisbursed) : (proposal.disbursedAmount && proposal.disbursedAmount !== '₹ 0' ? proposal.disbursedAmount : '₹ 0');

  const bList = Array.isArray(proposal.budgetBreakdown) && proposal.budgetBreakdown.length > 0
    ? proposal.budgetBreakdown
    : Array.isArray(linkedProject?.budgetBreakdown) && linkedProject.budgetBreakdown.length > 0
    ? linkedProject.budgetBreakdown
    : [];
  const bBreakdownSum = bList.reduce((sum, it) => sum + (typeof it.amount === 'number' ? it.amount : Number(String(it.amount || '0').replace(/[^\d]/g, '')) || 0), 0);

  const totalBudgetNum = bBreakdownSum > 0 ? bBreakdownSum : (parseGrantRupees(proposal.allocatedAmount || proposal.fundingRequested || proposal.budget || linkedProject?.sanctionedGrant) || 80000);
  const budgetDisplay = `₹ ${totalBudgetNum.toLocaleString('en-IN')}`;
  const isFullyDisbursed = totalBudgetNum > 0 && rawDisbursed >= totalBudgetNum;
  const remainingBudgetNum = Math.max(0, totalBudgetNum - rawDisbursed);
  const trancheReq = proposal.trancheRequest || linkedProject?.trancheRequest;
  const additionalAmountNum = Math.max(0, totalBudgetNum - 80000);

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Supplemental Faculty Grant Banner */}
      {additionalAmountNum > 0 && !isFullyDisbursed && (
        <div className="bg-amber-50 border border-amber-300 rounded-md p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-sm bg-amber-500 text-white flex items-center justify-center font-black shrink-0 text-sm">
              +₹
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-amber-950">
                Additional Grant Amount Added by Faculty: +₹ {additionalAmountNum.toLocaleString('en-IN')}
              </h4>
              <p className="text-[11px] text-amber-800">
                Faculty Investigator submitted revision with supplemental line items. Baseline: ₹ 80,000 &bull; Revised DPR Budget: {budgetDisplay} (Pending Disbursal: ₹ {remainingBudgetNum.toLocaleString('en-IN')})
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-amber-600 text-white font-mono text-[10px] font-extrabold rounded-xs shrink-0">
            REVISED DPR GRANT
          </span>
        </div>
      )}

      {/* 100% Fully Disbursed Status Banner */}
      {isFullyDisbursed && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-md p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-sm bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">
              ✓
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-emerald-950">
                Approved DPR Budget 100% Completed
              </h4>
              <p className="text-[11px] text-emerald-800">
                Total approved grant of {budgetDisplay} has been fully credited to University Escrow. All options locked.
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[10px] font-extrabold rounded-xs shrink-0">
            CORPUS FULLY RELEASED
          </span>
        </div>
      )}

      {/* University Tranche 2 EMI Request Banner */}
      {!isFullyDisbursed && trancheReq?.status === 'Pending' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-sm bg-blue-600 text-white flex items-center justify-center font-black shrink-0">
              ₹
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-blue-950">
                University Requested {trancheReq.requestedTranche === 1 ? 'Initial Grant Release' : 'Second EMI (Tranche 2)'}
              </h4>
              <p className="text-[11px] text-blue-800">
                Requested Amount: <span className="font-bold font-mono">₹ {(Number(trancheReq.amount) || remainingBudgetNum).toLocaleString('en-IN')}</span> &bull; Pending Government Release
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-extrabold rounded-xs shrink-0">
            ACTION REQUIRED
          </span>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-300 rounded-md p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
            Approved DPR Budget
          </span>
          <span className="text-base font-black font-mono text-slate-900 block mt-0.5">
            {budgetDisplay}
          </span>
          {additionalAmountNum > 0 ? (
            <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm inline-block mt-0.5">
              +₹ {additionalAmountNum.toLocaleString('en-IN')} Faculty Revision
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 font-medium block">
              Scheme: {proposal.sourceScheme || 'State Innovation Grant'}
            </span>
          )}
        </div>

        <div className="bg-white border border-slate-300 rounded-md p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
            Disbursed to Escrow
          </span>
          <span className="text-base font-black font-mono text-[#007A61] block mt-0.5">
            {disbursedDisplay}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            {rawDisbursed > 0 ? 'PFMS Escrow Transfer Credited' : 'Tranche Allocation Available'}
          </span>
        </div>

        <div className="bg-white border border-slate-300 rounded-md p-4 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
            Technical Diligence
          </span>
          <span className="text-base font-extrabold text-[#007A61] block mt-0.5">
            {proposal.dueDiligence || 'Technical Advisory Clearance'}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block">
            Approved by State Advisory Council
          </span>
        </div>
      </div>

      {/* Interactive Tranche Disbursal Amount Adjuster */}
      <TrancheAmountAdjuster
        totalBudgetVal={totalBudgetNum}
        rawDisbursed={rawDisbursed}
        remainingBudget={remainingBudgetNum}
        disburseAmount={disburseAmount}
        setDisburseAmount={setDisburseAmount}
        isFullyDisbursed={isFullyDisbursed}
        hasTrancheRequest={Boolean(trancheReq?.status === 'Pending')}
      />

      {/* Challenge Dossier Summary */}
      <div className="border border-slate-300 rounded-md p-4 bg-slate-50/70 space-y-2 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Problem Statement &amp; Research Context</h4>
        <p className="text-slate-800 font-semibold text-xs leading-relaxed">{proposal.projectTitle || proposal.title || 'Societal Problem Resolution Project'}</p>
        <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-4 text-xs text-slate-600">
          <span><strong>Lead Investigator:</strong> {proposal.leadMentor || proposal.teamLead || 'Faculty Mentor'}</span>
          <span><strong>Nodal Institution:</strong> {proposal.institutionName || 'Ranchi University (CUJ-099)'}</span>
          <span><strong>District Jurisdiction:</strong> {proposal.district || 'Ranchi, Jharkhand'}</span>
        </div>
        {additionalAmountNum > 0 && (
          <div className="mt-2.5 pt-2 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2 bg-amber-50/80 p-2.5 rounded-md">
            <span className="font-extrabold text-xs text-amber-950">Faculty Supplemental Grant Allocation</span>
            <span className="font-mono font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-sm border border-amber-300 text-xs">+₹ {additionalAmountNum.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Statutory Registrations & Governance */}
      <div className="border border-slate-300 rounded-md p-4 bg-white space-y-2.5 shadow-2xs">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Institutional Accreditation &amp; Governance</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div><span className="text-[10px] text-slate-400 font-bold block">INSTITUTION TYPE</span><span className="font-semibold text-slate-800">State University</span></div>
          <div><span className="text-[10px] text-slate-400 font-bold block">AISHE / NIRF CODE</span><span className="font-mono font-bold text-slate-800">CUJ-099 (Jharkhand)</span></div>
          <div><span className="text-[10px] text-slate-400 font-bold block">NAAC ACCREDITATION</span><span className="font-bold text-[#007A61]">Grade 'A' (Valid 2028)</span></div>
          <div><span className="text-[10px] text-slate-400 font-bold block">FRAMEWORK MOU</span><span className="font-semibold text-slate-800">Executed &amp; Active</span></div>
        </div>
      </div>
    </div>
  );
};

export default ProposalOverviewTab;

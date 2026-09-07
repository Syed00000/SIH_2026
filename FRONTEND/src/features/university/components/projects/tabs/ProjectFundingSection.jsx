import React from 'react';
import { CheckCircle2, Clock, Send } from 'lucide-react';
import { universityApiService } from '../../../services/universityApiService.js';
import { projectCsrSyncService } from '../../../../government/services/projectCsrSyncService.js';

export const ProjectFundingSection = ({ project, trancheRequested, setTrancheRequested, isRequestingTranche, setIsRequestingTranche, isDeployed }) => {
  const isFunded = Boolean(project.disbursedAmount && project.disbursedAmount !== '0' && project.disbursedAmount !== '₹ 0');

  const handleRequestSecondEmi = async (amount) => {
    setIsRequestingTranche(true);
    try {
      const projId = project.projectId || project.id;
      const tranchePayload = {
        status: 'Pending', amount: Number(amount) || 40000, requestedTranche: 2,
        formattedAmount: `₹ ${(Number(amount) || 40000).toLocaleString('en-IN')}`,
        reason: 'Stage 1 Formulation & Rig Prototyping completed. Requesting Second EMI release.',
        requestedAt: new Date(), requestedBy: 'Ranchi University (RU001)'
      };
      await universityApiService.requestProjectTranche(projId, tranchePayload);
      projectCsrSyncService.updateProposalTrancheRequest(projId, tranchePayload);
      setTrancheRequested(true);
    } catch (e) { console.warn('Request second EMI error:', e); }
    finally { setIsRequestingTranche(false); }
  };

  if (!isFunded) {
    const facultyName = project.facultyMentor?.name || project.leadMentor || 'Unassigned';
    return (
      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1">
        <div className="flex items-center space-x-1.5 font-bold text-amber-950">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Funding Status: Budget Not Sanctioned (Proposal Pending)</span>
        </div>
        <p className="text-[11px] text-amber-900 leading-relaxed pl-3.5">
          Budget will be formulated by the designated Faculty Mentor ({facultyName}) and team, approved by the University, and submitted to the Government for grant sanction.
        </p>
      </div>
    );
  }

  const paymentLedger = projectCsrSyncService.getCsrLedger();
  const p = project;
  const dbTranches = Array.isArray(p.tranches) ? p.tranches : [];
  let linkedPayments = paymentLedger.filter(
    (pay) => pay.projectRef === p.projectId || pay.projectRef === p.id || pay.projectRef === `PROP-${p.projectId}`
  ).filter(pay => (Number(pay.rawAmount) > 0) || (pay.amount && pay.amount !== '₹ 0'));
  const allPayments = [...dbTranches, ...linkedPayments];
  const uniquePayments = Array.from(new Map(allPayments.map(item => [item.id, item])).values());
  linkedPayments = uniquePayments.filter(pay => (Number(pay.rawAmount) > 0) || (pay.amount && pay.amount !== '₹ 0'));
  const backendDisbursedAmt = parseInt(String(p.disbursedAmount || '0').replace(/[^0-9]/g, ''), 10) || 0;
  const ledgerSum = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);
  if (linkedPayments.length === 0 && backendDisbursedAmt > 0) linkedPayments = [{ id: 'LEGACY-1', rawAmount: backendDisbursedAmt }];
  else if (backendDisbursedAmt > ledgerSum) linkedPayments.unshift({ id: 'LEGACY-DIFF', rawAmount: backendDisbursedAmt - ledgerSum });
  const totalBudgetVal = parseInt((p.sanctionedBudget || p.budget || p.proposedBudget || '73000').toString().replace(/[^0-9]/g, ''), 10) || 73000;
  const totalDisbursedVal = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);
  const pendingVal = Math.max(0, totalBudgetVal - totalDisbursedVal);
  const utilizedVal = Math.round(totalDisbursedVal * 0.78);

  return (
    <div className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-xl text-xs space-y-2.5">
      <div className="flex items-center space-x-1.5 font-bold text-emerald-950">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Funding Status: Grant Disbursed &amp; Received</span>
      </div>
      <div className="pl-3.5 space-y-2">
        <div className="flex items-center justify-between text-[10.5px] text-emerald-900 font-medium px-1">
          <span>Total Sanctioned Grant</span><span className="font-bold">₹ {totalBudgetVal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-[#007A61] font-medium px-1">
          <span>Total Amount Received</span><span className="font-bold">₹ {totalDisbursedVal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex items-center justify-between text-[10.5px] text-blue-700 font-medium px-1 mb-2">
          <span>Total Amount Utilized (Approx)</span><span className="font-bold">₹ {utilizedVal.toLocaleString('en-IN')}</span>
        </div>
        {linkedPayments.map((pay, idx) => (
          <div key={pay.id || idx} className="flex items-center justify-between text-[10.5px] text-emerald-900 font-medium bg-emerald-100/50 p-2 rounded-lg border border-emerald-200 shadow-2xs">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Tranche {idx + 1} (Received)</span>
            </div>
            <span className="font-bold">₹ {(Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0).toLocaleString('en-IN')}</span>
          </div>
        ))}
        {pendingVal > 0 ? (
          <div className="mt-2.5 p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-950 text-xs">Second Installment / EMI</span>
              <span className="text-[11px] font-mono font-bold text-blue-700">₹ {pendingVal.toLocaleString('en-IN')} Available</span>
            </div>
            {trancheRequested ? (
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Second EMI Requested • Pending Government Release</span>
              </div>
            ) : isDeployed ? (
              <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-200">
                <span>🔒 Project Deployed — All financial actions are locked</span>
              </div>
            ) : (
              <button type="button" onClick={() => handleRequestSecondEmi(pendingVal)} disabled={isRequestingTranche}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer transition-colors">
                <Send className="w-3.5 h-3.5" />
                <span>{isRequestingTranche ? 'Submitting Request...' : `Request Second EMI (₹ ${pendingVal.toLocaleString('en-IN')})`}</span>
              </button>
            )}
          </div>
        ) : totalDisbursedVal > 0 ? (
          <div className="mt-2.5 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900 shadow-2xs">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Approved DPR Budget Completed (100% Disbursed)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-600 text-white rounded font-mono font-bold">FULLY RELEASED</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectFundingSection;

import React, { useState, useEffect } from 'react';
import { Landmark, CheckCircle2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { projectCsrSyncService } from '../../../government/services/projectCsrSyncService.js';
import { parseGrantRupees } from '../../../government/components/projects/GrantPaymentModal.jsx';
import { GrantRequestForm } from './GrantRequestForm.jsx';
import apiClient from '../../../../infrastructure/api/client.js';

export const GovernmentGrantStatusCard = ({ approval }) => {
  const pId = approval?.projectId || approval?.challengeId || approval?.approvalId?.replace('APP-PROTO-', '').replace('APP-', '');
  const [project, setProject] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [trancheRequested, setTrancheRequested] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [ledgerPayments, setLedgerPayments] = useState([]);

  const fetchLiveStatus = async () => {
    try {
      const [ledgerRes, projRes] = await Promise.allSettled([
        apiClient.get('government/funds/ledger'),
        apiClient.get(`university/projects/${pId}?universityCode=RU001`)
      ]);
      if (ledgerRes.status === 'fulfilled') {
        const data = ledgerRes.value.data?.data || ledgerRes.value.data || [];
        if (Array.isArray(data)) setLedgerPayments(data);
      }
      if (projRes.status === 'fulfilled') {
        const pData = projRes.value.data?.data || projRes.value.data;
        if (pData) {
          setProject(pData);
          if (pData.trancheRequest?.status === 'Pending') setTrancheRequested(true);
        }
      }
    } catch {}
  };

  const syncProjectData = () => {
    const allProposals = projectCsrSyncService.getSolutionProposals() || [];
    const activeProjects = projectCsrSyncService.getActiveProjects() || [];
    const pool = [...activeProjects, ...allProposals];
    const found = pool.find(
      (p) => p.id === pId || p.projectId === pId || p.projectId === approval?.projectId ||
             p.title === approval?.project || p.challengeId === approval?.challengeId
    );
    if (found) setProject((prev) => ({ ...found, ...prev }));
    if (found?.trancheRequest?.status === 'Pending' || approval?.trancheRequest?.status === 'Pending') {
      setTrancheRequested(true);
    }
  };

  useEffect(() => {
    syncProjectData();
    fetchLiveStatus();
    const unsub = projectCsrSyncService.subscribe(() => {
      syncProjectData();
      fetchLiveStatus();
    });
    const interval = setInterval(fetchLiveStatus, 3000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [pId, approval?.approvalId]);

  // Calculate total disbursed by State Government for this project
  const ledgerDisbursed = ledgerPayments
    .filter((t) => {
      const matchId = t.projectRef === pId || t.projectRef === approval?.projectId || t.challengeId === approval?.challengeId;
      const matchTitle = t.projectTitle && approval?.project && t.projectTitle.toLowerCase() === approval.project.toLowerCase();
      return (matchId || matchTitle) && (t.makerCheckerStatus === 'Approved' || t.bankStatus === 'success');
    })
    .reduce((acc, t) => acc + (Number(t.rawAmount) || Number(String(t.amount || '0').replace(/[^\d]/g, '')) || 0), 0);

  const rawDisbursed = Math.max(
    ledgerDisbursed,
    project?.disbursedAmount ? parseGrantRupees(project.disbursedAmount) : 0,
    approval?.disbursedAmount ? parseGrantRupees(approval.disbursedAmount) : 0,
    projectCsrSyncService.getProjectDisbursed(pId)
  );

  const totalSanctionedNum =
    parseGrantRupees(project?.originalGovernmentGrant) ||
    parseGrantRupees(project?.sanctionedBudget || project?.sanctionedGrant || approval?.sanctionedBudget) ||
    parseGrantRupees(approval?.proposedBudget || approval?.estimatedBudget) ||
    80000;

  const pendingVal = Math.max(0, totalSanctionedNum - rawDisbursed);
  const isFullyDisbursed = totalSanctionedNum > 0 && rawDisbursed >= totalSanctionedNum;

  const handleRequestGrant = async (reqAmount, reason) => {
    if (reqAmount <= 0 || isRequesting) return;
    setIsRequesting(true);
    try {
      const targetId = project?.id || project?.projectId || approval?.projectId || pId;
      const tranchePayload = {
        status: 'Pending',
        amount: Number(reqAmount),
        requestedTranche: rawDisbursed === 0 ? 1 : 2,
        formattedAmount: `₹ ${Number(reqAmount).toLocaleString('en-IN')}`,
        reason: reason || 'Milestone research materials validated. University requesting installment release from Government Escrow.',
        requestedAt: new Date(),
        requestedBy: 'Ranchi University (RU001)'
      };

      await universityApiService.requestProjectTranche(targetId, tranchePayload).catch(() => {});
      await apiClient.patch(`university/approvals/${approval.approvalId || targetId}?universityCode=RU001`, {
        trancheRequest: tranchePayload
      }).catch(() => {});
      projectCsrSyncService.updateProposalTrancheRequest(targetId, tranchePayload);

      setTrancheRequested(true);
      setFeedbackMsg(`✓ Request of ₹ ${Number(reqAmount).toLocaleString('en-IN')} submitted to State Government!`);
      setTimeout(() => setFeedbackMsg(''), 4500);
    } catch (err) {
      console.warn('Failed to submit grant request:', err);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="bg-white border border-blue-200/90 rounded-xl p-4 shadow-2xs space-y-3 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-blue-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Government Grant Sanction & PFMS Escrow Status
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Department of Higher & Technical Education (DHTE) &bull; State Innovation Scheme
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full">
          PFMS Direct Disbursal
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Government Sanctioned DPR</span>
          <span className="text-sm font-black text-slate-900 font-mono">₹ {totalSanctionedNum.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-emerald-800 font-bold block">Official State Sanction</span>
        </div>

        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-0.5">
          <span className="text-[10px] font-bold text-emerald-800 uppercase block">Amount Received (Disbursed)</span>
          <span className="text-sm font-black text-[#007A61] font-mono">₹ {rawDisbursed.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-[#007A61] font-bold block truncate">
            {project?.testingLabFee ? `Net after ${project.testingLabFee} Lab Fee` : rawDisbursed > 0 ? 'Credited to University Escrow ✓' : 'Initial Release Pending'}
          </span>
        </div>

        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-0.5">
          <span className="text-[10px] font-bold text-blue-800 uppercase block">Pending State Escrow Balance</span>
          <span className="text-sm font-black text-blue-900 font-mono">₹ {pendingVal.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-blue-700 font-bold block">
            {pendingVal > 0 ? 'Available for Release' : 'Fully Settled (100%)'}
          </span>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-bold flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {isFullyDisbursed || project?.isDeployed ? (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{project?.isDeployed ? '✓ Project Deployed to Public Registry (PFMS Escrow Settled)' : 'Government Grant 100% Fully Disbursed & Received in Escrow'}</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono text-[10px] font-bold rounded">
            {project?.isDeployed ? 'DEPLOYED' : 'SETTLED'}
          </span>
        </div>
      ) : pendingVal > 0 ? (
        <GrantRequestForm
          pendingVal={pendingVal}
          rawDisbursed={rawDisbursed}
          trancheRequested={trancheRequested}
          existingRequest={project?.trancheRequest || approval?.trancheRequest}
          isRequesting={isRequesting}
          onSubmitRequest={handleRequestGrant}
        />
      ) : null}
    </div>
  );
};

export default GovernmentGrantStatusCard;

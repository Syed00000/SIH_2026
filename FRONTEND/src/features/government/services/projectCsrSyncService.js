/**
 * Project-CSR Real-Time Financial & Operational Synchronization Service
 * Interlinks all financial transactions, grant disbursals, proposal approvals,
 * proposal rejections, milestone verification, and physical geo-tagging between
 * Projects & Solutions and CSR & Grants Lifecycle.
 */

import {
  MOCK_PROPOSAL_PIPELINE,
  MOCK_PAYMENT_LEDGER,
  MOCK_CSR_FUNDING_SOURCES,
  MOCK_UTILIZATION_TRANSACTIONS,
  MOCK_MILESTONES_PROGRESS,
  MOCK_COMPLIANCE_CHECKLIST
} from '../data/mockCsrLifecycleData.js';

import { INITIAL_ACTIVE_PROJECTS, INITIAL_SOLUTION_PROPOSALS } from '../data/projectsSolutionsData.js';

const STORAGE_KEYS = {
  CSR_PROPOSALS: 'joharsetu_csr_proposals',
  CSR_LEDGER: 'joharsetu_csr_ledger',
  ACTIVE_PROJECTS: 'joharsetu_active_projects',
  SOLUTION_PROPOSALS: 'joharsetu_solution_proposals',
  CSR_SOURCES: 'joharsetu_csr_sources',
  CSR_UTILIZATION: 'joharsetu_csr_utilization',
  CSR_MILESTONES: 'joharsetu_csr_milestones',
  CSR_CHECKLIST: 'joharsetu_csr_checklist'
};

const guessSector = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('water') || t.includes('arsenic') || t.includes('dam') || t.includes('purif')) return 'Water & Sanitation';
  if (t.includes('mine') || t.includes('coal') || t.includes('seismic') || t.includes('gas')) return 'Mining & Energy';
  if (t.includes('crop') || t.includes('cold') || t.includes('lac') || t.includes('farm') || t.includes('agri')) return 'Agriculture & Food';
  if (t.includes('health') || t.includes('medic') || t.includes('diagnostic') || t.includes('van')) return 'Healthcare & Telemedicine';
  if (t.includes('robot') || t.includes('ai') || t.includes('rover')) return 'Tribal Tech & Education';
  return 'Environment & Forest';
};

class ProjectCsrSyncService {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CSR_PROPOSALS)) {
      localStorage.setItem(STORAGE_KEYS.CSR_PROPOSALS, JSON.stringify(MOCK_PROPOSAL_PIPELINE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CSR_LEDGER)) {
      localStorage.setItem(STORAGE_KEYS.CSR_LEDGER, JSON.stringify(MOCK_PAYMENT_LEDGER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(INITIAL_ACTIVE_PROJECTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SOLUTION_PROPOSALS)) {
      localStorage.setItem(STORAGE_KEYS.SOLUTION_PROPOSALS, JSON.stringify(INITIAL_SOLUTION_PROPOSALS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CSR_SOURCES)) {
      localStorage.setItem(STORAGE_KEYS.CSR_SOURCES, JSON.stringify(MOCK_CSR_FUNDING_SOURCES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CSR_UTILIZATION)) {
      localStorage.setItem(STORAGE_KEYS.CSR_UTILIZATION, JSON.stringify(MOCK_UTILIZATION_TRANSACTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CSR_MILESTONES)) {
      localStorage.setItem(STORAGE_KEYS.CSR_MILESTONES, JSON.stringify(MOCK_MILESTONES_PROGRESS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CSR_CHECKLIST)) {
      localStorage.setItem(STORAGE_KEYS.CSR_CHECKLIST, JSON.stringify(MOCK_COMPLIANCE_CHECKLIST));
    }

    this.reconcileAll();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventType, data) {
    this.listeners.forEach((listener) => {
      try {
        listener(eventType, data);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }

  getCsrProposals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CSR_PROPOSALS);
      return data ? JSON.parse(data) : MOCK_PROPOSAL_PIPELINE;
    } catch {
      return MOCK_PROPOSAL_PIPELINE;
    }
  }

  getCsrLedger() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CSR_LEDGER);
      return data ? JSON.parse(data) : MOCK_PAYMENT_LEDGER;
    } catch {
      return MOCK_PAYMENT_LEDGER;
    }
  }

  getActiveProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECTS);
      return data ? JSON.parse(data) : INITIAL_ACTIVE_PROJECTS;
    } catch {
      return INITIAL_ACTIVE_PROJECTS;
    }
  }

  getSolutionProposals() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOLUTION_PROPOSALS);
      return data ? JSON.parse(data) : INITIAL_SOLUTION_PROPOSALS;
    } catch {
      return INITIAL_SOLUTION_PROPOSALS;
    }
  }

  reconcileAll() {
    try {
      const csrProposals = this.getCsrProposals();
      let solProposals = this.getSolutionProposals();
      let activeProjects = this.getActiveProjects();

      let solChanged = false;
      let prjChanged = false;

      csrProposals.forEach((cp) => {
        const isRejected =
          cp.boardApproval?.includes('Rejected') ||
          cp.boardApproval?.includes('Failed') ||
          cp.dueDiligence?.includes('Failed') ||
          cp.dueDiligence?.includes('Rejected') ||
          cp.dueDiligenceStatus === 'failed';

        const isApproved =
          !isRejected &&
          (cp.boardApproval?.includes('Approved') ||
            cp.boardApproval?.includes('Sanctioned') ||
            cp.mouExecution?.includes('Signed') ||
            cp.mouExecution?.includes('Executed'));

        const solStatus = isRejected
          ? 'Rejected'
          : isApproved
          ? 'Approved'
          : cp.dueDiligenceStatus === 'review'
          ? 'Pending Review'
          : 'Under Evaluation';

        const existingSol = solProposals.find((sp) => sp.id === cp.id || sp.title === cp.projectTitle);

        if (!existingSol) {
          solProposals = [
            {
              id: cp.id,
              title: cp.projectTitle || `Innovation Project (${cp.institutionName})`,
              hei: cp.institutionName,
              district: cp.district || 'Ranchi',
              sector: guessSector(cp.projectTitle),
              requestedGrant: cp.allocatedAmount || '₹ 18.50 Lakhs',
              status: solStatus,
              trlLevel: 'TRL-5',
              prototypeType: 'Hardware',
              teamLead: cp.leadSpoc || 'Principal Investigator',
              submissionDate: cp.mouSignedDate || '2026-08-15',
              fundingScheme: cp.sourceScheme,
              donor: cp.donor || 'CSR & State Grants Pool',
              feasibilityScore: parseInt(String(cp.feasibilityScore || '92').replace(/[^\d]/g, ''), 10) || 92,
              technicalReviewStatus: cp.dueDiligence,
              reviewerNotes: cp.remarks || 'Synchronized from CSR Approval Pipeline.',
              hardwareSpecs: 'Integrated IoT sensor suite with cloud telemetry mapped under CSR Escrow framework.'
            },
            ...solProposals
          ];
          solChanged = true;
        } else if (existingSol.status !== solStatus) {
          solProposals = solProposals.map((sp) =>
            sp.id === cp.id
              ? {
                  ...sp,
                  status: solStatus,
                  technicalReviewStatus: cp.dueDiligence,
                  reviewerNotes: cp.remarks || sp.reviewerNotes
                }
              : sp
          );
          solChanged = true;
        }

        // If rejected, ensure it's purged from activeProjects
        const prjId = cp.id.startsWith('PROP-') ? cp.id.replace('PROP-', 'PRJ-') : cp.id;
        if (isRejected) {
          const wasInActive = activeProjects.some((p) => p.id === prjId || p.id === cp.id);
          if (wasInActive) {
            activeProjects = activeProjects.filter((p) => p.id !== prjId && p.id !== cp.id);
            prjChanged = true;
          }
        } else if (isApproved) {
          const existingPrj = activeProjects.find((p) => p.id === prjId || p.id === cp.id || p.title === cp.projectTitle);
          if (!existingPrj) {
            activeProjects = [
              {
                id: prjId,
                title: cp.projectTitle || `Active Innovation (${cp.institutionName})`,
                hei: cp.institutionName,
                district: cp.district || 'Ranchi',
                sector: guessSector(cp.projectTitle),
                sanctionedGrant: cp.allocatedAmount || '₹ 18.50 Lakhs',
                disbursedAmount: cp.disbursedToDate || '₹ 5.00 Lakhs',
                paymentPercentage: 35,
                trlLevel: 'TRL-5',
                prototypeType: 'Hardware',
                deploymentStatus: 'In Progress',
                problemOrigin: `${cp.district || 'Ranchi'} Ground Area`,
                activeWorkSite: `${cp.institutionName} Research Lab`,
                teamLead: cp.leadSpoc || 'Principal Investigator',
                fundingSource: cp.donor || cp.sourceScheme,
                fundingScheme: cp.sourceScheme,
                stageGateStatus: 'Stage 2 In Progress',
                milestoneProgress: 60,
                hardwareSpecs: 'Field deployed hardware node linked with live Escrow ledger telemetry.',
                milestones: [
                  { id: 'm1', title: 'Phase 1: Lab Prototyping & Sensor Rig', status: 'Completed', progress: 100 },
                  { id: 'm2', title: 'Phase 2: Ground Field Trials & Telemetry', status: 'In Progress', progress: 60 },
                  { id: 'm3', title: 'Phase 3: State Deployment Handover', status: 'Pending', progress: 0 }
                ]
              },
              ...activeProjects
            ];
            prjChanged = true;
          }
        }
      });

      if (solChanged) {
        localStorage.setItem(STORAGE_KEYS.SOLUTION_PROPOSALS, JSON.stringify(solProposals));
      }
      if (prjChanged) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(activeProjects));
      }
    } catch (e) {
      console.error('Error during reconcileAll:', e);
    }
  }

  // ACTION 1: Add or Update CSR Proposal
  addOrUpdateCsrProposal(proposal) {
    const proposals = this.getCsrProposals();
    const exists = proposals.find((p) => p.id === proposal.id);

    let updatedCsrProposals;
    if (exists) {
      updatedCsrProposals = proposals.map((p) => (p.id === proposal.id ? proposal : p));
    } else {
      updatedCsrProposals = [proposal, ...proposals];
    }
    localStorage.setItem(STORAGE_KEYS.CSR_PROPOSALS, JSON.stringify(updatedCsrProposals));

    const isRejected =
      proposal.boardApproval?.includes('Rejected') ||
      proposal.boardApproval?.includes('Failed') ||
      proposal.dueDiligence?.includes('Failed') ||
      proposal.dueDiligence?.includes('Rejected') ||
      proposal.dueDiligenceStatus === 'failed';

    const isApproved =
      !isRejected &&
      (proposal.boardApproval?.includes('Approved') ||
        proposal.boardApproval?.includes('Sanctioned') ||
        proposal.mouExecution?.includes('Signed') ||
        proposal.mouExecution?.includes('Executed'));

    const solStatus = isRejected
      ? 'Rejected'
      : isApproved
      ? 'Approved'
      : proposal.dueDiligenceStatus === 'review'
      ? 'Pending Review'
      : 'Under Evaluation';

    // 1. Sync into Solution Proposals
    let solProposals = this.getSolutionProposals();
    const solObj = {
      id: proposal.id,
      title: proposal.projectTitle || proposal.title || `Innovation Project (${proposal.institutionName})`,
      hei: proposal.institutionName || proposal.hei,
      district: proposal.district || 'Ranchi',
      sector: guessSector(proposal.projectTitle || proposal.title),
      requestedGrant: proposal.allocatedAmount || '₹ 18.50 Lakhs',
      status: solStatus,
      trlLevel: 'TRL-5',
      prototypeType: 'Hardware',
      teamLead: proposal.leadSpoc || 'Faculty Researcher',
      submissionDate: proposal.mouSignedDate || new Date().toISOString().split('T')[0],
      fundingScheme: proposal.sourceScheme,
      donor: proposal.donor || 'Tata Steel CSR Foundation',
      feasibilityScore: parseInt(String(proposal.feasibilityScore || '92').replace(/[^\d]/g, ''), 10) || 92,
      technicalReviewStatus: proposal.dueDiligence,
      reviewerNotes: proposal.remarks || (isRejected ? 'Proposal rejected by State Committee.' : 'Synchronized from CSR Pipeline.'),
      hardwareSpecs: 'Integrated IoT sensor suite with cloud telemetry mapped under CSR Escrow framework.'
    };

    const solExists = solProposals.find((sp) => sp.id === proposal.id);
    let updatedSolProposals;
    if (solExists) {
      updatedSolProposals = solProposals.map((sp) => (sp.id === proposal.id ? { ...sp, ...solObj } : sp));
    } else {
      updatedSolProposals = [solObj, ...solProposals];
    }
    localStorage.setItem(STORAGE_KEYS.SOLUTION_PROPOSALS, JSON.stringify(updatedSolProposals));

    // 2. Active Projects Update
    let activeProjects = this.getActiveProjects();
    let updatedActiveProjects = activeProjects;
    const prjId = proposal.id.startsWith('PROP-') ? proposal.id.replace('PROP-', 'PRJ-') : proposal.id;

    if (isRejected) {
      // Remove from active projects if rejected
      updatedActiveProjects = activeProjects.filter((p) => p.id !== prjId && p.id !== proposal.id);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(updatedActiveProjects));
    } else if (isApproved) {
      const prjExists = activeProjects.find((p) => p.id === prjId || p.id === proposal.id);
      const prjObj = {
        id: prjId,
        title: proposal.projectTitle || `Active Innovation (${proposal.institutionName})`,
        hei: proposal.institutionName,
        district: proposal.district || 'Ranchi',
        sector: guessSector(proposal.projectTitle),
        sanctionedGrant: proposal.allocatedAmount || '₹ 18.50 Lakhs',
        disbursedAmount: proposal.disbursedToDate || '₹ 0.00 Lakhs',
        paymentPercentage: 25,
        trlLevel: 'TRL-5',
        prototypeType: 'Hardware',
        deploymentStatus: 'In Progress',
        problemOrigin: `${proposal.district || 'Ranchi'} Ground Area`,
        activeWorkSite: `${proposal.institutionName} Research Lab`,
        teamLead: proposal.leadSpoc || 'Principal Investigator',
        fundingSource: proposal.donor || proposal.sourceScheme,
        fundingScheme: proposal.sourceScheme,
        stageGateStatus: 'Stage 1 Lab Rig Active',
        milestoneProgress: 50,
        hardwareSpecs: 'Field deployed hardware node linked with live Escrow ledger telemetry.',
        milestones: [
          { id: 'm1', title: 'Phase 1: Lab Prototyping & Sensor Rig', status: 'Completed', progress: 100 },
          { id: 'm2', title: 'Phase 2: Ground Field Trials & Telemetry', status: 'In Progress', progress: 50 },
          { id: 'm3', title: 'Phase 3: State Deployment Handover', status: 'Pending', progress: 0 }
        ]
      };

      if (prjExists) {
        updatedActiveProjects = activeProjects.map((p) =>
          p.id === prjId || p.id === proposal.id ? { ...p, ...prjObj, disbursedAmount: p.disbursedAmount || prjObj.disbursedAmount } : p
        );
      } else {
        updatedActiveProjects = [prjObj, ...activeProjects];
      }
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(updatedActiveProjects));
    }

    this.notify('CSR_PROPOSAL_SYNCED', {
      proposal,
      updatedCsrProposals,
      updatedSolProposals,
      updatedActiveProjects
    });

    return {
      updatedCsrProposals,
      updatedSolProposals,
      updatedActiveProjects
    };
  }

  // ACTION 2: Reject Proposal from Projects & Solutions
  rejectProposalFromProjects(proposal, remarks = '') {
    const pId = proposal.id;
    const cleanRemarks = remarks || 'Proposal rejected by State Technical Committee following DPR evaluation.';

    // 1. Update Solution Proposals
    const solProposals = this.getSolutionProposals().map((sp) =>
      sp.id === pId
        ? {
            ...sp,
            status: 'Rejected',
            technicalReviewStatus: 'Failed / Disqualified',
            reviewerNotes: cleanRemarks
          }
        : sp
    );
    localStorage.setItem(STORAGE_KEYS.SOLUTION_PROPOSALS, JSON.stringify(solProposals));

    // 2. Update CSR Pipeline (Phase 1 & 2)
    const csrProposals = this.getCsrProposals().map((cp) =>
      cp.id === pId || cp.projectTitle === proposal.title
        ? {
            ...cp,
            dueDiligence: 'Failed / Disqualified',
            dueDiligenceStatus: 'failed',
            boardApproval: 'Rejected (Technical Review Failed)',
            boardApprovalStatus: 'rejected',
            mouExecution: 'Terminated / Not Executed',
            remarks: cleanRemarks
          }
        : cp
    );
    localStorage.setItem(STORAGE_KEYS.CSR_PROPOSALS, JSON.stringify(csrProposals));

    // 3. Remove from Active Projects
    const prjId = pId.startsWith('PROP-') ? pId.replace('PROP-', 'PRJ-') : pId;
    const activeProjects = this.getActiveProjects().filter((p) => p.id !== prjId && p.id !== pId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(activeProjects));

    // 4. Notify
    this.notify('PROPOSAL_REJECTED', {
      proposalId: pId,
      updatedSolProposals: solProposals,
      updatedCsrProposals: csrProposals,
      updatedActiveProjects: activeProjects
    });

    return {
      updatedSolProposals: solProposals,
      updatedCsrProposals: csrProposals,
      updatedActiveProjects: activeProjects
    };
  }

  // ACTION 3: Delete CSR Proposal
  deleteCsrProposal(id) {
    const proposals = this.getCsrProposals().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.CSR_PROPOSALS, JSON.stringify(proposals));

    const solProposals = this.getSolutionProposals().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.SOLUTION_PROPOSALS, JSON.stringify(solProposals));

    const prjId = id.startsWith('PROP-') ? id.replace('PROP-', 'PRJ-') : id;
    const activeProjects = this.getActiveProjects().filter((p) => p.id !== prjId && p.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(activeProjects));

    this.notify('CSR_PROPOSAL_DELETED', {
      id,
      updatedCsrProposals: proposals,
      updatedSolProposals: solProposals,
      updatedActiveProjects: activeProjects
    });
    return proposals;
  }

  // ACTION 4: Disburse Grant Payment
  disburseGrantPayment({
    projectId,
    amountLakhs,
    trancheName,
    paymentMode = 'RTGS',
    voucherRef,
    remarks
  }) {
    const projects = this.getActiveProjects();
    const targetProject = projects.find((p) => p.id === projectId);

    const payingNum = parseFloat(amountLakhs) || 0;
    const amountStr = `₹ ${payingNum.toFixed(2)} Lakhs`;

    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const currentDisbursedNum = parseFloat(String(p.disbursedAmount || '0').replace(/[^\d.]/g, '')) || 0;
        const newDisbursedNum = currentDisbursedNum + payingNum;
        const sanctionedNum = parseFloat(String(p.sanctionedGrant || '0').replace(/[^\d.]/g, '')) || 0;
        const newPercent = sanctionedNum > 0 ? Math.min(100, Math.round((newDisbursedNum / sanctionedNum) * 100)) : 0;

        const newPaymentHistory = [
          {
            id: voucherRef || `JH-TR-${Math.floor(1000 + Math.random() * 9000)}`,
            trancheName: trancheName || 'Milestone Tranche Release',
            amount: amountStr,
            date: new Date().toISOString().split('T')[0],
            paymentMode,
            remarks: remarks || 'Grant payment released under Schedule VII & Jharkhand State Innovation Fund.',
            status: 'Paid'
          },
          ...(p.grantTranchesHistory || [])
        ];

        return {
          ...p,
          disbursedAmount: `₹ ${newDisbursedNum.toFixed(2)} Lakhs`,
          paymentPercentage: newPercent,
          grantTranchesHistory: newPaymentHistory,
          stageGateStatus: newPercent >= 100 ? 'Fully Funded ✓' : `Active (Tranche Disbursed)`
        };
      }
      return p;
    });

    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(updatedProjects));

    const ledger = this.getCsrLedger();
    const donorName = targetProject?.fundingSource || (targetProject?.hei?.includes('Tata') ? 'Tata Steel CSR Foundation' : 'Govt State Innovation Fund');
    const newPaymentId = `PAY-${Math.floor(90000 + Math.random() * 9999)}`;
    const utr = `UTR${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newLedgerEntry = {
      id: newPaymentId,
      payer: donorName,
      payee: targetProject?.hei || 'BIT Mesra',
      disbursedAmount: `₹${(payingNum * 100000).toLocaleString('en-IN')}`,
      mode: paymentMode.includes('RTGS') ? 'RTGS' : paymentMode.includes('PFMS') ? 'Direct PFMS' : 'NEFT',
      utrNumber: utr,
      makerCheckerSign: 'Verified & Approved',
      makerCheckerStatus: 'approved',
      bankAckStatus: 'Acknowledged',
      bankStatus: 'ack',
      timestamp: new Date().toLocaleString('en-IN'),
      scheme: targetProject?.fundingScheme || 'Corporate CSR / State Grant',
      projectRef: projectId,
      tdsAmount: `₹${((payingNum * 100000) * 0.02).toLocaleString('en-IN')} (194C @ 2%)`,
      netDisbursed: `₹${((payingNum * 100000) * 0.98).toLocaleString('en-IN')}`,
      purpose: `${trancheName} for ${targetProject?.title || projectId}`
    };

    const updatedLedger = [newLedgerEntry, ...ledger];
    localStorage.setItem(STORAGE_KEYS.CSR_LEDGER, JSON.stringify(updatedLedger));

    try {
      const utilData = JSON.parse(localStorage.getItem(STORAGE_KEYS.CSR_UTILIZATION) || '[]');
      const newUtilEntry = {
        id: newPaymentId,
        tracking: `${donorName.split(' ')[0]} — ${targetProject?.hei || 'HEI'}`,
        amount: `₹${(payingNum * 100000).toLocaleString('en-IN')}`,
        mode: newLedgerEntry.mode,
        utr: utr,
        makerChecker: 'Verified & Approved',
        makerCheckerStatus: 'approved',
        bankAck: 'Received & Ack.',
        bankStatus: 'ack',
        projectRef: projectId
      };
      localStorage.setItem(STORAGE_KEYS.CSR_UTILIZATION, JSON.stringify([newUtilEntry, ...utilData]));
    } catch {}

    this.notify('GRANT_DISBURSED', {
      projectId,
      amountLakhs: payingNum,
      updatedProjects,
      updatedLedger,
      ledgerEntry: newLedgerEntry
    });

    return { updatedProjects, updatedLedger, ledgerEntry: newLedgerEntry };
  }

  // ACTION 5: Approve Solution Proposal from Projects
  approveProposalFromProjects(proposal, remarks = '') {
    const proposals = this.getCsrProposals();
    const exists = proposals.find((p) => p.id === proposal.id);

    const newCsrProposal = {
      id: proposal.id,
      institutionName: proposal.hei || proposal.institutionName || 'University Lab',
      projectTitle: proposal.title || proposal.projectTitle || 'Societal Innovation Project',
      district: proposal.district || 'Ranchi',
      sourceScheme: proposal.fundingScheme || 'Corporate CSR (Tata)',
      donor: proposal.donor || 'Tata Steel CSR Foundation',
      dueDiligence: 'Passed (All Checks)',
      dueDiligenceStatus: 'passed',
      boardApproval: 'Approved (A-Grade)',
      boardApprovalStatus: 'approved',
      mouExecution: 'Signed & Active',
      allocatedAmount: proposal.requestedGrant || proposal.allocatedAmount || '₹4.50 Cr',
      disbursedToDate: '₹0.00 Cr',
      csr1Number: 'CSR000' + Math.floor(10000 + Math.random() * 90000),
      pan80G: '80G-VALIDATED',
      leadSpoc: proposal.teamLead || 'Faculty Incharge',
      feasibilityScore: `${proposal.feasibilityScore || 92}/100`,
      totalTranches: 3,
      currentTranche: 1,
      remarks: remarks || 'Sanctioned via State Innovation Board. Synchronized with CSR Grants pool.'
    };

    let updatedCsrProposals;
    if (exists) {
      updatedCsrProposals = proposals.map((p) => (p.id === proposal.id ? newCsrProposal : p));
    } else {
      updatedCsrProposals = [newCsrProposal, ...proposals];
    }

    localStorage.setItem(STORAGE_KEYS.CSR_PROPOSALS, JSON.stringify(updatedCsrProposals));
    this.addOrUpdateCsrProposal(newCsrProposal);

    this.notify('PROPOSAL_SANCTIONED', {
      proposal: newCsrProposal,
      updatedCsrProposals
    });

    return updatedCsrProposals;
  }

  // ACTION 6: Disbursal Initiated from CSR Module
  syncDisbursalFromCsr(newCsrPayment) {
    const projects = this.getActiveProjects();
    const rawAmt = parseFloat(String(newCsrPayment.disbursedAmount || '0').replace(/[^\d.]/g, '')) || 0;
    const amountInLakhs = rawAmt / 100000;

    const updatedProjects = projects.map((p) => {
      if (
        p.id === newCsrPayment.projectRef ||
        newCsrPayment.payee?.toLowerCase().includes(p.hei?.toLowerCase())
      ) {
        const curD = parseFloat(String(p.disbursedAmount || '0').replace(/[^\d.]/g, '')) || 0;
        const newD = curD + amountInLakhs;
        const sanct = parseFloat(String(p.sanctionedGrant || '0').replace(/[^\d.]/g, '')) || 0;
        const newPercent = sanct > 0 ? Math.min(100, Math.round((newD / sanct) * 100)) : 0;

        const newHistory = [
          {
            id: newCsrPayment.id,
            trancheName: newCsrPayment.purpose || 'CSR Escrow Tranche Disbursal',
            amount: `₹ ${amountInLakhs.toFixed(2)} Lakhs`,
            date: new Date().toISOString().split('T')[0],
            paymentMode: newCsrPayment.mode,
            remarks: `Disbursed via ${newCsrPayment.payer} (UTR: ${newCsrPayment.utrNumber})`,
            status: 'Paid'
          },
          ...(p.grantTranchesHistory || [])
        ];

        return {
          ...p,
          disbursedAmount: `₹ ${newD.toFixed(2)} Lakhs`,
          paymentPercentage: newPercent,
          grantTranchesHistory: newHistory
        };
      }
      return p;
    });

    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(updatedProjects));

    this.notify('CSR_PAYMENT_SYNCED', {
      payment: newCsrPayment,
      updatedProjects
    });

    return updatedProjects;
  }

  // ACTION 7: Advance TRL
  advancePrototypeTrl(projectId) {
    const projects = this.getActiveProjects();
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const curNum = parseInt(String(p.trlLevel || 'TRL-4').replace('TRL-', ''), 10) || 4;
        const nextNum = Math.min(9, curNum + 1);

        let stageName = 'Stage 1: Lab Concept';
        let desc = 'Lab design and sensor calibration verified.';
        if (nextNum >= 4 && nextNum <= 6) {
          stageName = 'Stage 2: Working Field Prototype';
          desc = `Field testing in progress at ${p.activeWorkSite || 'ground site'}.`;
        } else if (nextNum >= 7 && nextNum <= 8) {
          stageName = 'Stage 3: State Deployment Ready';
          desc = 'NABL certification cleared. Handover ready for district administration.';
        } else if (nextNum >= 9) {
          stageName = 'Stage 4: Fully Operational & Scaled';
          desc = 'Deployed publicly across Jharkhand districts with citizen impact.';
        }

        return {
          ...p,
          trlLevel: `TRL-${nextNum}`,
          trlStageName: stageName,
          trlDescription: desc
        };
      }
      return p;
    });

    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECTS, JSON.stringify(updated));
    this.notify('TRL_ADVANCED', { projectId, updatedProjects: updated });
    return updated;
  }
}

export const projectCsrSyncService = new ProjectCsrSyncService();
export default projectCsrSyncService;

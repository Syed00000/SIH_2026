import apiClient from '../../../infrastructure/api/client.js';

const formatBudget = (b) => {
  if (!b) return '₹ 0';
  if (typeof b === 'number') return `₹ ${b.toLocaleString('en-IN')}`;
  if (typeof b === 'object') {
    const amt = b.total || b.amount || b.sanctioned || 0;
    return `₹ ${Number(amt).toLocaleString('en-IN')}`;
  }
  return String(b);
};

class ProjectCsrSyncService {
  constructor() {
    this.listeners = new Set();
    this.activeProjects = [];
    this.solutionProposals = [];
    this.csrProposals = [];
    this.csrLedger = [];
    this.totalCorpus = 0;
    this.govtAllocation = 0;
    this.corporateAllocation = 0;
    this.hasInitialized = false;
    this.initializeFromBackend();
  }

  async initializeFromBackend() {
    try {
      // 1. Clear any legacy dummy ledger from localStorage
      try {
        localStorage.removeItem('joharsetu_csr_ledger');
      } catch {}

      // Fetch live ledger from backend MongoDB
      let backendLedger = [];
      try {
        const ledgerRes = await apiClient.get('government/funds/ledger');
        backendLedger = ledgerRes.data?.data || ledgerRes.data || [];
      } catch (err) {
        console.warn('Failed to load backend ledger:', err);
      }
      this.csrLedger = Array.isArray(backendLedger) ? backendLedger : [];

      // 2. Fetch live projects from MongoDB (Statewide across all HEIs)
      const res = await apiClient.get('university/projects?universityCode=ALL');
      const data = res.data?.data || res.data || [];
      const projectsList = Array.isArray(data) ? data : [];

      // 3. Map Solution Proposals (Only projects approved & forwarded to Government by University)
      this.solutionProposals = projectsList
        .filter((p) => Boolean(p.sentToGovernment))
        .map((p, idx) => {
        const bBreakdownSum = Array.isArray(p.budgetBreakdown) && p.budgetBreakdown.length > 0
          ? p.budgetBreakdown.reduce((sum, it) => sum + (typeof it.amount === 'number' ? it.amount : Number(String(it.amount || '0').replace(/[^\d]/g, '')) || 0), 0)
          : 0;
        const bProp = Number(String(p.proposedBudget || '0').replace(/[^\d]/g, '')) || 0;
        const bSanct = Number(String(p.sanctionedBudget || '0').replace(/[^\d]/g, '')) || 0;
        const bBase = Number(String(p.budget || '0').replace(/[^\d]/g, '')) || 0;
        const effectiveBudgetNum = bBreakdownSum > 0 ? bBreakdownSum : Math.max(bProp, bSanct, bBase, 80000);
        const effectiveBudgetStr = `₹ ${effectiveBudgetNum.toLocaleString('en-IN')}`;
        const effectiveAdditional = Math.max(0, effectiveBudgetNum - 80000);

        const uniCode = p.universityCode || 'RU001';
        const uniName = uniCode === 'RU001' ? 'Ranchi University (RU001)' : `Nodal University (${uniCode})`;
        const pId = p.projectId || p._id;

        // Check if ledger has any recorded disbursals for this project
        const ledgerDisbursed = this.csrLedger
          .filter(t => (t.projectRef === pId || t.projectRef === `PROP-${pId}`) && (t.makerCheckerStatus === 'Approved' || t.bankStatus === 'success'))
          .reduce((acc, t) => acc + (Number(t.rawAmount) || Number(String(t.amount || '0').replace(/[^\d]/g, '')) || 0), 0);

        const backendDisbursed = p.disbursedAmount ? (Number(String(p.disbursedAmount).replace(/[^\d.]/g, '')) || 0) : 0;
        const testingFeeNum = Number(String(p.testingLabFee || '0').replace(/[^\d]/g, '')) || 0;
        const rawGovtGrant = p.originalGovernmentGrant || '₹ 80,000';
        const govtGrantNum = Number(String(rawGovtGrant).replace(/[^\d]/g, '')) || 80000;
        const finalDisbursedNum = testingFeeNum > 0 ? Math.max(0, govtGrantNum - testingFeeNum) : Math.max(ledgerDisbursed, backendDisbursed);
        const finalDisbursedStr = finalDisbursedNum > 0 ? `₹ ${finalDisbursedNum.toLocaleString('en-IN')}` : '₹ 0';

        const isFunded = finalDisbursedNum > 0 || p.budgetStatus === 'Grant Sanctioned by Government' || p.budgetStatus === 'Grant Disbursed';
        const isApproved = isFunded || p.budgetStatus === 'Forwarded to CSR Grants Pipeline' || Boolean(p.sentToGovernment);

        return {
          id: `PROP-${pId || idx + 1}`,
          projectId: pId,
          title: p.title || 'Grassroots Innovation Solution',
          projectTitle: p.title || 'Grassroots Innovation Solution',
          sector: p.domain || p.sector || 'Engineering & Technology',
          district: p.district || 'Ranchi',
          hei: uniName,
          universityCode: uniCode,
          teamLead: p.leadMentor || p.facultyMentor?.name || p.faculty || p.mentorName || 'Unassigned Lead',
          studentTeam: p.studentTeam || p.teamName || 'Research Team',
          teamName: p.teamName || p.studentTeam || 'Research Team',
          fundingRequested: effectiveBudgetStr,
          requestedGrant: effectiveBudgetStr,
          budgetRequested: effectiveBudgetStr,
          allocatedAmount: effectiveBudgetStr,
          budget: effectiveBudgetStr,
          proposedBudget: effectiveBudgetStr,
          rawBudget: effectiveBudgetNum,
          additionalAmount: effectiveAdditional,
          status: isFunded ? 'Grant Sanctioned' : 'Approved',
          budgetStatus: isFunded ? 'Grant Sanctioned by Government' : 'Forwarded to CSR Grants Pipeline',
          sourceScheme: p.domain ? `${p.domain} State Innovation Grant` : 'Govt State R&D & CSR Pool',
          stage: p.stage || 'Stage 1: Formulation & DPR',
          trlLevel: p.trlLevel || 'TRL-4',
          prototypeData: p.prototypeData || {},
          prototypeStatus: p.prototypeStatus || 'Not Started',
          sentToGovernment: p.sentToGovernment || false,
          governmentStatus: p.governmentStatus || 'Under State Evaluation',
          forwardedToGovAt: p.forwardedToGovAt,
          dueDiligence: isApproved ? 'Passed (State Tech Council)' : 'Under Government Evaluation',
          dueDiligenceStatus: isApproved ? 'passed' : 'review',
          boardApproval: isApproved ? 'Approved (A-Grade)' : 'Under Board Evaluation',
          boardApprovalStatus: isApproved ? 'approved' : 'pending',
          mouExecution: isFunded ? 'MoU Executed (Active)' : 'Drafted',
          methodology: p.methodology || '',
          milestones: p.milestones || [],
          budgetBreakdown: p.budgetBreakdown || [],
          disbursedAmount: finalDisbursedStr,
          originalGovernmentGrant: p.originalGovernmentGrant || (govtGrantNum > 0 ? `₹ ${govtGrantNum.toLocaleString('en-IN')}` : '₹ 80,000'),
          testingLabFee: p.testingLabFee || (testingFeeNum > 0 ? `₹ ${testingFeeNum.toLocaleString('en-IN')}` : ''),
          trancheRequest: p.trancheRequest || null,
          createdAt: p.createdAt || new Date()
        };
      });

      // 4. CSR & State Grants Pipeline (all citizen problem statements / solutions)
      this.csrProposals = this.solutionProposals;

      // 5. Active Projects (Funded / In Execution / Forwarded Prototypes)
      this.activeProjects = this.solutionProposals
        .filter((p) => {
          const disbNum = Number(String(p.disbursedAmount || '0').replace(/[^\d]/g, '')) || 0;
          return (
            disbNum > 0 ||
            p.budgetStatus === 'Grant Sanctioned by Government' ||
            p.budgetStatus === 'Grant Disbursed' ||
            p.status === 'Active' ||
            p.status === 'Deployed' ||
            p.isDeployed ||
            p.prototypeStatus === 'Approved'
          );
        })
        .map((p) => {
          const isProtoDone = Boolean(p.testingCompleted || p.testingReportPdfUrl || p.prototypeStatus === 'Pending Approval' || p.prototypeStatus === 'Approved' || p.status === 'Deployed' || p.isDeployed);
          const isDeployed = Boolean(p.status === 'Deployed' || p.isDeployed);
          return {
            id: p.projectId || p.id.replace('PROP-', ''),
            projectId: p.projectId,
            challengeId: p.challengeId,
            title: p.title,
            problemStatement: p.problemStatement,
            sector: p.sector,
            district: p.district,
            hei: p.hei,
            progress: isDeployed ? 100 : (isProtoDone ? 100 : (p.prototypeStatus === 'Approved' ? 85 : 57)),
            status: isDeployed ? 'Deployed' : (isProtoDone ? 'Completed' : 'Active'),
            stage: isDeployed ? 'Deployed to Citizen Registry' : (isProtoDone ? 'Prototype Done & Lab Verified (TRL-8/9)' : (p.prototypeStatus === 'Approved' ? 'Prototype Testing & Validation (TRL-4 to TRL-7)' : 'R&D Lab Phase')),
            trlLevel: isProtoDone ? 'TRL-9' : (p.trlLevel || 'TRL-4'),
            isProtoDone,
            isDeployed,
            testingCompleted: p.testingCompleted,
            testingReportPdfUrl: p.testingReportPdfUrl,
            testingReportPdfName: p.testingReportPdfName,
            pdfUrl: p.pdfUrl,
            pdfName: p.pdfName,
            sanctionedGrant: p.allocatedAmount || p.requestedGrant,
            disbursedGrant: p.disbursedAmount,
            disbursedAmount: p.disbursedAmount,
            budgetStatus: p.budgetStatus,
            rawBudget: p.rawBudget,
            additionalAmount: p.additionalAmount || 0,
            proposedBudget: p.proposedBudget,
            budget: p.budget,
            telemetryStatus: isDeployed ? 'Live Citizen Telemetry' : 'Active Telemetry',
            hardwareSpecs: p.hardwareSpecs || '',
            teamLead: p.teamLead,
            studentTeam: p.studentTeam,
            teamName: p.teamName,
            prototypeData: p.prototypeData,
            prototypeStatus: p.prototypeStatus,
            sentToGovernment: p.sentToGovernment,
            governmentStatus: p.governmentStatus,
            forwardedToGovAt: p.forwardedToGovAt,
            milestones: p.milestones || []
          };
        });

      // 6. Calculate dynamic allocations directly from database
      try {
        const fundsRes = await apiClient.get('government/funds');
        const fundsData = fundsRes.data?.data || fundsRes.data || {};
        this.govtAllocation = Number(fundsData.stateGrantsTotal || 100000);
        this.corporateAllocation = Number(fundsData.corporateCsrTotal || 0);
        this.totalCorpus = this.govtAllocation + this.corporateAllocation;
      } catch (e) {
        this.govtAllocation = 100000;
        this.totalCorpus = 100000;
      }

      this.hasInitialized = true;
      this.notify('DATA_SYNCED', {
        updatedProjects: this.getActiveProjects(),
        updatedSolProposals: this.solutionProposals,
        updatedCsrProposals: this.csrProposals,
        updatedCsrLedger: this.csrLedger
      });
    } catch (err) {
      console.warn('Live projects sync error:', err);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload) {
    this.listeners.forEach((cb) => {
      try { cb(event, payload); } catch (e) { console.error('Listener err:', e); }
    });
  }

  getProjectDisbursed(projectId) {
    const pId = String(projectId).replace('PROP-', '');
    const total = this.csrLedger
      .filter((t) => (t.projectRef === pId || t.projectRef === `PROP-${pId}` || t.project === pId) && (t.makerCheckerStatus === 'Approved' || t.bankStatus === 'success'))
      .reduce((acc, t) => acc + (Number(t.rawAmount) || Number(String(t.amount || '0').replace(/[^\d]/g, '')) || 0), 0);
    return total;
  }

  getFinancials() {
    const totalDisbursed = this.csrLedger
      .filter((t) => t.makerCheckerStatus === 'Approved' || t.bankStatus === 'success')
      .reduce((acc, t) => acc + (Number(t.rawAmount) || Number(String(t.amount || '0').replace(/[^\d]/g, '')) || 0), 0);
    return {
      totalCorpus: this.totalCorpus,
      govtAllocation: this.govtAllocation,
      corporateAllocation: this.corporateAllocation,
      totalDisbursed,
      availableCorpus: Math.max(0, this.totalCorpus - totalDisbursed),
      sbiEscrowBalance: 0,
      pnbEscrowBalance: 0
    };
  }

  async approveProposalFromProjects(proposal, remarks = '') {
    const pId = proposal.projectId || (proposal.id ? proposal.id.replace('PROP-', '') : '');
    const uniCode = proposal.universityCode || 'RU001';
    
    // Update local state
    this.solutionProposals = this.solutionProposals.map((p) => {
      if (p.id === proposal.id || p.projectId === pId) {
        return {
          ...p,
          status: 'Approved',
          governmentStatus: 'Approved',
          budgetStatus: 'Forwarded to CSR Grants Pipeline',
          milestonesCompleted: 5,
          progressPercentage: 71,
          reviewedAt: new Date().toISOString(),
          reviewerNotes: remarks || 'Proposal approved by Government Review Board and forwarded to CSR Grants Pipeline.'
        };
      }
      return p;
    });

    // Sync to CSR pipeline
    this.addOrUpdateCsrProposal({
      ...proposal,
      status: 'Approved',
      governmentStatus: 'Approved',
      budgetStatus: 'Forwarded to CSR Grants Pipeline',
      milestonesCompleted: 5,
      progressPercentage: 71
    });

    // Save directly to backend MongoDB
    if (pId) {
      try {
        await apiClient.put(`university/projects/${pId}?universityCode=${uniCode}`, {
          universityCode: uniCode,
          budgetStatus: 'Forwarded to CSR Grants Pipeline',
          governmentStatus: 'Approved',
          status: 'Approved',
          milestonesCompleted: 5,
          progressPercentage: 71,
          adminRemarks: remarks || 'Approved by Government Review Board and forwarded to CSR Grants.'
        });
      } catch (err) {
        console.warn('Failed to sync proposal approval to MongoDB:', err);
      }
    }

    this.notify('DATA_SYNCED', {
      updatedProjects: this.getActiveProjects(),
      updatedSolProposals: this.solutionProposals,
      updatedCsrProposals: this.csrProposals,
      updatedCsrLedger: this.csrLedger
    });
    return this.solutionProposals;
  }

  updateProposalTrancheRequest(projectId, trancheRequest) {
    const cleanId = String(projectId || '').replace('PROP-', '');
    this.solutionProposals = this.solutionProposals.map((p) => {
      const pId = String(p.id || p.projectId || '').replace('PROP-', '');
      if (pId === cleanId) {
        return { ...p, trancheRequest };
      }
      return p;
    });
    this.csrProposals = this.solutionProposals;
    this.activeProjects = this.activeProjects.map((p) => {
      const pId = String(p.id || p.projectId || '').replace('PROP-', '');
      if (pId === cleanId) {
        return { ...p, trancheRequest };
      }
      return p;
    });
    this.notify('DATA_SYNCED', {
      updatedProjects: this.getActiveProjects(),
      updatedSolProposals: this.solutionProposals,
      updatedCsrProposals: this.csrProposals,
      updatedCsrLedger: this.csrLedger
    });
  }

  async rejectProposalFromProjects(proposal, remarks = '') {
    const pId = proposal.projectId || (proposal.id ? proposal.id.replace('PROP-', '') : '');
    this.solutionProposals = this.solutionProposals.map((p) => {
      if (p.id === proposal.id || p.projectId === pId) {
        return {
          ...p,
          status: 'Rejected',
          budgetStatus: 'Rejected',
          reviewerNotes: remarks || 'Proposal rejected.'
        };
      }
      return p;
    });

    if (pId) {
      try {
        await apiClient.put(`university/projects/${pId}`, {
          budgetStatus: 'Changes Required by Government',
          status: 'Pending',
          governmentRemarks: remarks || 'Proposal rejected by Government Review Board.'
        });
      } catch (err) {
        console.warn('Failed to sync proposal rejection to MongoDB:', err);
      }
    }

    this.notify('DATA_SYNCED', {
      updatedProjects: this.getActiveProjects(),
      updatedSolProposals: this.solutionProposals,
      updatedCsrProposals: this.csrProposals,
      updatedCsrLedger: this.csrLedger
    });
    return this.solutionProposals;
  }

  async recordDisbursal(payment) {
    const rawVal = Number(payment.rawAmount) || Number(String(payment.amount || payment.disbursedAmount || '0').replace(/[^\d]/g, '')) || 75000;
    const formattedAmt = `₹ ${rawVal.toLocaleString('en-IN')}`;
    const pId = payment.projectId || (payment.projectRef ? payment.projectRef.replace('PROP-', '') : '');

    const newEntry = {
      id: payment.id || `PAY-${Math.floor(90000 + Math.random() * 9999)}`,
      txId: `LED-${this.csrLedger.length + 1}`,
      project: payment.project || payment.projectRef || 'Grassroots Innovation Project',
      tracking: payment.purpose || payment.tracking || 'Grant Tranche Disbursal',
      amount: formattedAmt,
      rawAmount: rawVal,
      disbursedAmount: formattedAmt,
      mode: payment.mode || 'Direct PFMS',
      utr: payment.utrNumber || payment.utr || `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      utrNumber: payment.utrNumber || payment.utr || `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      payer: payment.payer || 'Govt State Treasury (PFMS)',
      payee: payment.payee || 'Ranchi University (RU001)',
      timestamp: new Date().toLocaleDateString('en-IN'),
      makerCheckerStatus: 'Approved',
      makerCheckerSign: 'Verified & Approved',
      bankStatus: 'success',
      bankAck: 'Credited to University Escrow',
      bankAckStatus: 'Credited to University Escrow',
      projectRef: pId || payment.projectRef || ''
    };

    this.csrLedger = [newEntry, ...this.csrLedger.filter(item => {
      const itemAmt = Number(item.rawAmount) || Number(String(item.amount || item.disbursedAmount || '0').replace(/[^\d]/g, ''));
      return itemAmt > 0;
    })];

    // Save directly to backend MongoDB
    try {
      apiClient.post('government/funds/ledger', newEntry).catch(() => {});
    } catch {}

    // Update in-memory solution proposals
    let cumulativeDisbursedStr = formattedAmt;
    this.solutionProposals = this.solutionProposals.map((p) => {
      if (p.projectId === pId || p.id === payment.projectRef || p.id === `PROP-${pId}`) {
        const currDisb = Number(String(p.disbursedAmount || '0').replace(/[^\d]/g, '')) || 0;
        const newTotalDisb = currDisb + rawVal;
        cumulativeDisbursedStr = `₹ ${newTotalDisb.toLocaleString('en-IN')}`;
        return {
          ...p,
          disbursedAmount: cumulativeDisbursedStr,
          budgetStatus: 'Grant Sanctioned by Government',
          status: 'Approved'
        };
      }
      return p;
    });

    // Update active projects list
    const existingActive = this.activeProjects.find(p => p.id === pId);
    if (existingActive) {
      this.activeProjects = this.activeProjects.map(p => {
        if (p.id === pId) {
          return {
            ...p,
            disbursedAmount: cumulativeDisbursedStr,
            disbursedGrant: cumulativeDisbursedStr,
            budgetStatus: 'Grant Sanctioned by Government'
          };
        }
        return p;
      });
    } else {
      const sol = this.solutionProposals.find(p => p.projectId === pId || p.id === `PROP-${pId}`);
      if (sol) {
        this.activeProjects = [
          {
            id: pId,
            title: sol.title,
            sector: sol.sector,
            district: sol.district,
            hei: sol.hei,
            progress: 57,
            status: 'Active',
            stage: 'R&D Lab Phase',
            trlLevel: sol.trlLevel || 'TRL-4',
            sanctionedGrant: sol.allocatedAmount || sol.requestedGrant,
            disbursedGrant: cumulativeDisbursedStr,
            disbursedAmount: cumulativeDisbursedStr,
            budgetStatus: 'Grant Sanctioned by Government',
            rawBudget: sol.rawBudget,
            telemetryStatus: 'Active Telemetry',
            hardwareSpecs: '',
            teamLead: sol.teamLead,
            milestones: sol.milestones || []
          },
          ...this.activeProjects
        ];
      }
    }

    // Sync directly to backend MongoDB
    if (pId) {
      try {
        const uniCode = payment.universityCode || 'RU001';
        const projectTranches = this.csrLedger.filter(t => t.projectRef === pId || t.projectRef === payment.projectRef || t.projectRef === `PROP-${pId}`);
        await apiClient.put(`university/projects/${pId}?universityCode=${uniCode}`, {
          universityCode: uniCode,
          disbursedAmount: cumulativeDisbursedStr,
          budgetStatus: 'Grant Sanctioned by Government',
          status: 'Active',
          tranches: projectTranches
        });
      } catch (err) {
        console.warn('Failed to sync disbursal to MongoDB:', err);
      }
    }

    this.notify('LEDGER_UPDATED', { updatedCsrLedger: this.csrLedger });
    this.notify('DATA_SYNCED', {
      updatedProjects: this.getActiveProjects(),
      updatedSolProposals: this.solutionProposals,
      updatedCsrProposals: this.csrProposals,
      updatedCsrLedger: this.csrLedger
    });
    
    return this.csrLedger;
  }

  addCsrPayment(payment) {
    return this.recordDisbursal(payment);
  }

  getActiveProjects() {
    return this.activeProjects.map((proj) => {
      const disbursedVal = this.getProjectDisbursed(proj.id);
      const formattedDisb = disbursedVal > 0 ? formatBudget(disbursedVal) : (proj.disbursedAmount || '₹ 0');
      return {
        ...proj,
        disbursedGrant: formattedDisb,
        disbursedAmount: formattedDisb
      };
    });
  }

  getSolutionProposals() { return this.solutionProposals; }
  getCsrProposals() { return this.csrProposals; }
  getCsrLedger() { return this.csrLedger; }

  addOrUpdateCsrProposal(proposal) {
    const idx = this.csrProposals.findIndex((p) => p.id === proposal.id);
    if (idx >= 0) {
      this.csrProposals[idx] = { ...this.csrProposals[idx], ...proposal };
    } else {
      this.csrProposals = [proposal, ...this.csrProposals];
    }
    this.notify('PROPOSALS_UPDATED', { updatedCsrProposals: this.csrProposals });
    return this.csrProposals;
  }

  deleteCsrProposal(id) {
    this.csrProposals = this.csrProposals.filter((p) => p.id !== id);
    this.notify('PROPOSALS_UPDATED', { updatedCsrProposals: this.csrProposals });
    return this.csrProposals;
  }

  async authorizePayment(ledgerId) {
    try {
      apiClient.put(`government/funds/ledger/${ledgerId}/authorize`).catch(() => {});
    } catch {}
    this.csrLedger = this.csrLedger.map((item) =>
      item.id === ledgerId || item.paymentId === ledgerId
        ? { ...item, makerCheckerStatus: 'Approved', makerCheckerSign: 'Verified & Approved' }
        : item
    );
    this.notify('LEDGER_UPDATED', { updatedCsrLedger: this.csrLedger });
    return this.csrLedger;
  }
}

export const projectCsrSyncService = new ProjectCsrSyncService();
export default projectCsrSyncService;

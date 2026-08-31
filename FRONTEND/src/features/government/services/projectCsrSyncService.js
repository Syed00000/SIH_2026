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
      // 1. Load ledger first to know any disbursed funds
      const savedLedger = JSON.parse(localStorage.getItem('joharsetu_csr_ledger') || '[]')
        .filter(item => {
          const rawAmt = Number(item.rawAmount) || Number(String(item.amount || item.disbursedAmount || '0').replace(/[^\d]/g, ''));
          return !String(item.id).startsWith('PAY-992') && rawAmt > 0;
        });
      this.csrLedger = savedLedger;

      // 2. Fetch live projects from MongoDB
      const res = await apiClient.get('university/projects?universityCode=RU001');
      const data = res.data?.data || res.data || [];
      const projectsList = Array.isArray(data) ? data : [];

      // 3. Map Solution Proposals
      this.solutionProposals = projectsList.map((p, idx) => {
        const budgetStr = String(p.proposedBudget || p.budget || '0');
        const budgetVal = parseFloat(budgetStr.replace(/[^\d.]/g, '')) || 0;
        const uniCode = p.universityCode || 'RU001';
        const uniName = uniCode === 'RU001' ? 'Ranchi University (RU001)' : `Nodal University (${uniCode})`;
        const pId = p.projectId || p._id;

        // Check if ledger has any recorded disbursals for this project
        const ledgerDisbursed = this.csrLedger
          .filter(t => (t.projectRef === pId || t.projectRef === `PROP-${pId}`) && (t.makerCheckerStatus === 'Approved' || t.bankStatus === 'success'))
          .reduce((acc, t) => acc + (Number(t.rawAmount) || Number(String(t.amount || '0').replace(/[^\d]/g, '')) || 0), 0);

        const backendDisbursed = p.disbursedAmount ? (Number(String(p.disbursedAmount).replace(/[^\d.]/g, '')) || 0) : 0;
        const finalDisbursedNum = Math.max(ledgerDisbursed, backendDisbursed);
        const finalDisbursedStr = finalDisbursedNum > 0 ? `₹ ${finalDisbursedNum.toLocaleString('en-IN')}` : '₹ 0';

        const isFunded = finalDisbursedNum > 0 || p.budgetStatus === 'Grant Sanctioned by Government' || p.budgetStatus === 'Grant Disbursed';
        const isApproved = isFunded || p.budgetStatus === 'Forwarded to CSR Grants Pipeline' || p.status === 'Approved' || p.status === 'Active';

        return {
          id: `PROP-${pId || idx + 1}`,
          projectId: pId,
          title: p.title || 'Grassroots Innovation Solution',
          projectTitle: p.title || 'Grassroots Innovation Solution',
          sector: p.domain || p.sector || 'Engineering & Technology',
          district: p.district || 'Ranchi',
          hei: uniName,
          universityCode: uniCode,
          teamLead: p.leadMentor || p.facultyMentor?.name || 'Lead Faculty Investigator',
          studentTeam: p.studentTeam || '',
          requestedGrant: formatBudget(p.proposedBudget || p.budget || 73000),
          budgetRequested: formatBudget(p.proposedBudget || p.budget || 73000),
          allocatedAmount: formatBudget(p.sanctionedBudget || p.proposedBudget || p.budget || 73000),
          rawBudget: budgetVal || 73000,
          status: isApproved ? 'Approved' : (p.status || 'Pending'),
          budgetStatus: isFunded ? 'Grant Sanctioned by Government' : isApproved ? 'Forwarded to CSR Grants Pipeline' : (p.budgetStatus || 'Pending Review'),
          sourceScheme: p.domain ? `${p.domain} State Innovation Grant` : 'Govt State R&D & CSR Pool',
          stage: p.stage || 'Stage 1: Formulation & DPR',
          trlLevel: p.trlLevel || 'TRL-3',
          dueDiligence: isApproved ? 'Passed (State Tech Council)' : 'Under Government Evaluation',
          dueDiligenceStatus: isApproved ? 'passed' : 'review',
          boardApproval: isApproved ? 'Approved (A-Grade)' : 'Under Board Evaluation',
          boardApprovalStatus: isApproved ? 'approved' : 'pending',
          mouExecution: isFunded ? 'MoU Executed (Active)' : 'Drafted',
          methodology: p.methodology || '',
          milestones: p.milestones || [],
          budgetBreakdown: p.budgetBreakdown || [],
          disbursedAmount: finalDisbursedStr,
          createdAt: p.createdAt || new Date()
        };
      });

      // 4. CSR & State Grants Pipeline
      this.csrProposals = this.solutionProposals.filter((p) => {
        return (
          p.budgetStatus === 'Forwarded to Government for Grant Sanction' ||
          p.budgetStatus === 'Forwarded to CSR Grants Pipeline' ||
          p.budgetStatus === 'Grant Sanctioned by Government' ||
          p.budgetStatus === 'Grant Disbursed' ||
          p.status === 'Approved'
        );
      });

      // 5. Active Projects (Funded / In Execution)
      this.activeProjects = this.solutionProposals
        .filter((p) => {
          const disbNum = Number(String(p.disbursedAmount || '0').replace(/[^\d]/g, '')) || 0;
          return disbNum > 0 || p.budgetStatus === 'Grant Sanctioned by Government';
        })
        .map((p) => {
          return {
            id: p.projectId || p.id.replace('PROP-', ''),
            title: p.title,
            sector: p.sector,
            district: p.district,
            hei: p.hei,
            progress: 57,
            status: 'Active',
            stage: 'R&D Lab Phase',
            trlLevel: p.trlLevel || 'TRL-4',
            sanctionedGrant: p.allocatedAmount || p.requestedGrant,
            disbursedGrant: p.disbursedAmount,
            disbursedAmount: p.disbursedAmount,
            budgetStatus: 'Grant Sanctioned by Government',
            rawBudget: p.rawBudget,
            telemetryStatus: 'Active Telemetry',
            hardwareSpecs: '',
            teamLead: p.teamLead,
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
    
    // Update local state
    this.solutionProposals = this.solutionProposals.map((p) => {
      if (p.id === proposal.id || p.projectId === pId) {
        return {
          ...p,
          status: 'Approved',
          budgetStatus: 'Forwarded to CSR Grants Pipeline',
          reviewedAt: new Date().toISOString(),
          reviewerNotes: remarks || 'Proposal approved by Government Review Board.'
        };
      }
      return p;
    });

    // Sync to CSR pipeline
    this.addOrUpdateCsrProposal({
      ...proposal,
      status: 'Approved',
      budgetStatus: 'Forwarded to CSR Grants Pipeline'
    });

    // Save directly to backend MongoDB
    if (pId) {
      try {
        await apiClient.put(`university/projects/${pId}`, {
          budgetStatus: 'Forwarded to CSR Grants Pipeline',
          status: 'In Progress',
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
    localStorage.setItem('joharsetu_csr_ledger', JSON.stringify(this.csrLedger));

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
        const projectTranches = this.csrLedger.filter(t => t.projectRef === pId || t.projectRef === payment.projectRef || t.projectRef === `PROP-${pId}`);
        await apiClient.put(`university/projects/${pId}`, {
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
}

export const projectCsrSyncService = new ProjectCsrSyncService();
export default projectCsrSyncService;

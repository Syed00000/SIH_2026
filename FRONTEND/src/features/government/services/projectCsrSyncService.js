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
      const res = await apiClient.get('university/projects?universityCode=RU001');
      const data = res.data?.data || res.data || [];
      const projectsList = Array.isArray(data) ? data : [];

      this.activeProjects = projectsList.map((p, idx) => {
        const totalMilestones = (p.milestones || []).length;
        const completedMilestones = (p.milestones || []).filter(m => m.status === 'Completed').length;
        
        const budgetStr = String(p.budget || '0');
        const budgetVal = parseFloat(budgetStr.replace(/[^\d.]/g, '')) || 0;

        return {
          id: p.projectId || p._id || `PRJ-${idx + 1}`,
          title: p.title || 'Untitled Project',
          sector: p.domain || p.sector || 'General',
          district: p.district || 'N/A',
          hei: p.leadMentor || p.facultyMentor?.name || p.universityCode || 'Nodal University',
          progress: p.progressPercentage || 0,
          status: p.status || 'Active',
          stage: p.stage || 'R&D',
          trlLevel: p.trlLevel || 'TRL-1',
          sanctionedGrant: formatBudget(p.budget),
          disbursedGrant: '₹ 0',
          disbursedAmount: '₹ 0',
          rawBudget: budgetVal,
          telemetryStatus: p.telemetryStatus || 'Inactive',
          hardwareSpecs: p.hardwareSpecs || '',
          teamLead: p.leadMentor || p.facultyMentor?.name || '',
          problemOrigin: p.problemOrigin || (p.district ? `${p.district} District` : ''),
          milestonesCount: { total: totalMilestones, completed: completedMilestones },
          milestones: p.milestones || []
        };
      });

      // Pure empty arrays unless populated by real backend proposals
      this.solutionProposals = [];
      this.csrProposals = [];

      // Load manual session transactions from localStorage if any, filtering out old mock IDs
      const savedLedger = JSON.parse(localStorage.getItem('joharsetu_csr_ledger') || '[]')
        .filter(item => !String(item.id).startsWith('PAY-992'));
      this.csrLedger = savedLedger;
      localStorage.setItem('joharsetu_csr_ledger', JSON.stringify(this.csrLedger));

      // Calculate dynamic allocations from database
      let totalCsrCr = 0;
      try {
        const statsRes = await apiClient.get('government/overview/stats');
        const stats = statsRes.data?.data || statsRes.data || {};
        totalCsrCr = stats.financials?.totalCsrFundsCr || 0;
      } catch (e) {
        console.warn('Failed to load overview stats for allocations:', e);
      }

      this.corporateAllocation = totalCsrCr * 10000000; // convert Cr to Rs
      const totalProjectsBudget = this.activeProjects.reduce((acc, p) => acc + (p.rawBudget || 0), 0);
      this.govtAllocation = totalProjectsBudget;
      this.totalCorpus = this.corporateAllocation + this.govtAllocation;

      this.hasInitialized = true;
      this.notify('DATA_SYNCED', {
        updatedProjects: this.getActiveProjects(),
        updatedSolProposals: this.solutionProposals,
        updatedCsrProposals: this.csrProposals,
        updatedCsrLedger: this.csrLedger
      });
    } catch (err) {
      console.warn('Live projects sync:', err);
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
    // Sum of all approved/authorized ledger payments for this project
    const total = this.csrLedger
      .filter((t) => (t.projectRef === projectId || t.project === projectId) && t.makerCheckerStatus === 'Approved')
      .reduce((acc, t) => acc + (t.rawAmount || 0), 0);
    return total;
  }

  getFinancials() {
    const totalDisbursed = this.csrLedger
      .filter((t) => t.makerCheckerStatus === 'Approved')
      .reduce((acc, t) => acc + (t.rawAmount || 0), 0);
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

  recordDisbursal(payment) {
    const newEntry = {
      id: payment.id || `PAY-${Date.now().toString().slice(-5)}`,
      txId: `LED-${this.csrLedger.length + 1}`,
      project: payment.project || 'Innovation Challenge Pilot',
      tracking: payment.project || 'Grassroots Project',
      amount: formatBudget(payment.amount),
      rawAmount: Number(payment.amount) || Number(String(payment.disbursedAmount || '0').replace(/[^\d]/g, '')) || 0,
      mode: payment.mode || 'Direct PFMS',
      utr: payment.utrNumber || `UTR-${Date.now().toString().slice(-6)}`,
      payer: payment.payer || payment.source || 'State Innovation Council',
      payee: payment.payee || payment.hei || 'University R&D Node',
      timestamp: new Date().toLocaleDateString('en-GB'),
      makerCheckerStatus: payment.makerCheckerStatus || 'pending',
      makerChecker: payment.makerCheckerSign || 'Pending Board Clearance',
      bankStatus: payment.bankStatus || 'pending',
      bankAck: payment.bankAckStatus || 'Awaiting Bank Node',
      projectRef: payment.projectRef || ''
    };
    this.csrLedger = [newEntry, ...this.csrLedger];
    localStorage.setItem('joharsetu_csr_ledger', JSON.stringify(this.csrLedger));
    this.notify('LEDGER_UPDATED', { updatedCsrLedger: this.csrLedger });
    
    // Also trigger update of active projects list
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

  authorizePayment(ledgerId) {
    this.csrLedger = this.csrLedger.map((item) =>
      item.id === ledgerId
        ? {
            ...item,
            makerCheckerStatus: 'Approved',
            makerChecker: 'Authorized by Nodal Board',
            makerCheckerSign: 'Verified & Approved',
            bankStatus: 'success',
            bankAck: 'Acknowledged',
            bankAckStatus: 'Acknowledged'
          }
        : item
    );
    localStorage.setItem('joharsetu_csr_ledger', JSON.stringify(this.csrLedger));
    this.notify('LEDGER_UPDATED', { updatedCsrLedger: this.csrLedger });
    
    // Also trigger update of active projects list
    this.notify('DATA_SYNCED', {
      updatedProjects: this.getActiveProjects(),
      updatedSolProposals: this.solutionProposals,
      updatedCsrProposals: this.csrProposals,
      updatedCsrLedger: this.csrLedger
    });
    
    return this.csrLedger;
  }

  getActiveProjects() {
    return this.activeProjects.map((proj) => {
      const disbursedVal = this.getProjectDisbursed(proj.id);
      return {
        ...proj,
        disbursedGrant: formatBudget(disbursedVal),
        disbursedAmount: formatBudget(disbursedVal)
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

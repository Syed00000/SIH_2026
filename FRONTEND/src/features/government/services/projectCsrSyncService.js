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

      this.activeProjects = projectsList.map((p, idx) => ({
        id: p.projectId || `PRJ-${idx + 101}`,
        title: p.title,
        sector: p.domain || 'Technology',
        district: p.district || 'Ranchi',
        hei: p.leadMentor ? `${p.leadMentor}` : 'University R&D Node',
        progress: p.progressPercentage || 0,
        status: p.status || 'Active',
        stage: 'Field Implementation',
        trlLevel: p.trlLevel || 'TRL-4',
        sanctionedGrant: formatBudget(p.budget),
        disbursedGrant: '₹ 0',
        telemetryStatus: 'Active',
        hardwareSpecs: 'Integrated embedded telemetry unit.',
        teamLead: p.leadMentor || p.facultyMentor?.name || 'Academic Mentor',
        problemOrigin: `${p.district || 'Jharkhand'} Community Sector`,
        milestonesCount: { total: p.milestonesTotal || 0, completed: p.milestonesCompleted || 0 }
      }));

      this.solutionProposals = projectsList.map((p, idx) => ({
        id: `PROP-${idx + 201}`,
        instCode: p.universityCode || 'RUNI-JH',
        institutionName: 'University Innovation Cell',
        title: p.title,
        projectTitle: p.title,
        projectName: p.title,
        sector: p.domain || 'Technology',
        district: p.district || 'Jharkhand',
        hei: 'University Innovation Cell',
        facultyLead: p.leadMentor || p.facultyMentor?.name || 'Faculty Lead',
        requestedGrant: formatBudget(p.budget),
        estimatedMonths: 6,
        status: p.status || 'Under Review',
        evaluationScore: 90
      }));

      this.csrProposals = projectsList.map((p, idx) => ({
        id: `PROP-${idx + 201}`,
        instCode: p.universityCode || 'RUNI-JH',
        institutionName: 'University Innovation Cell',
        projectTitle: p.title,
        projectName: p.title,
        title: p.title,
        district: p.district || 'Jharkhand',
        sourceScheme: 'State Innovation Pool',
        donor: 'Jharkhand Higher Education Grant',
        dueDiligence: 'Under Verification',
        dueDiligenceStatus: 'review',
        boardApproval: `Sanctioned (${formatBudget(p.budget)})`,
        mouExecution: 'Active MoU',
        mouStatus: 'Active',
        facultyLead: p.leadMentor || p.facultyMentor?.name || 'Faculty Lead',
        budgetRequested: formatBudget(p.budget),
        budgetSanctioned: formatBudget(p.budget),
        budgetBreakdown: []
      }));

      this.csrLedger = [];
      this.hasInitialized = true;
      this.notify('DATA_SYNCED', {
        updatedProjects: this.activeProjects,
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

  getFinancials() {
    const totalDisbursed = this.csrLedger.reduce((acc, t) => acc + (t.rawAmount || 0), 0);
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
      id: payment.id || `PAY-${Date.now()}`,
      txId: `LED-${this.csrLedger.length + 1}`,
      project: payment.project || 'Innovation Challenge Pilot',
      tracking: payment.project || 'Grassroots Project',
      amount: formatBudget(payment.amount),
      rawAmount: Number(payment.amount) || 0,
      mode: payment.mode || 'PFMS Direct Node',
      utr: payment.utrNumber || `UTR-${Date.now()}`,
      payer: payment.source || 'State Innovation Council',
      payee: payment.hei || 'University R&D Node',
      timestamp: new Date().toLocaleDateString('en-GB'),
      makerCheckerStatus: 'pending',
      makerChecker: 'Pending Board Clearance',
      bankStatus: 'pending',
      bankAck: 'Awaiting Bank Node'
    };
    this.csrLedger = [newEntry, ...this.csrLedger];
    this.notify('LEDGER_UPDATED', { updatedCsrLedger: this.csrLedger });
    return this.csrLedger;
  }

  getActiveProjects() { return this.activeProjects; }
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

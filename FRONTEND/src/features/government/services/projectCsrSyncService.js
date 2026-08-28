import apiClient from '../../../infrastructure/api/client.js';

class ProjectCsrSyncService {
  constructor() {
    this.listeners = new Set();
    this.activeProjects = [];
    this.solutionProposals = [];
    this.csrProposals = [];
    this.csrLedger = [];
    this.totalCorpus = 1500000; // ₹ 15.00 Lakhs total pool
    this.govtAllocation = 500000; // ₹ 5.00 Lakhs Govt State Grant
    this.corporateAllocation = 1000000; // ₹ 10.00 Lakhs Corporate CSR (Tata + CCL)
    this.hasInitialized = false;
    this.initializeFromBackend();
  }

  async initializeFromBackend() {
    try {
      const res = await apiClient.get('/university/projects?universityCode=RU001');
      const data = res.data?.data || res.data || [];
      const projectsList = Array.isArray(data) ? data : [];

      this.activeProjects = projectsList.map((p) => ({
        id: p.projectId || 'PRJ-101',
        title: p.title,
        sector: p.domain,
        district: 'Ranchi',
        hei: p.leadMentor ? `${p.leadMentor} (RU)` : 'Ranchi University',
        progress: p.progressPercentage || 60,
        status: p.status || 'On Track',
        stage: 'Field Pilot & Telemetry',
        sanctionedGrant: p.budget || '₹ 75,000',
        disbursedGrant: '₹ 50,000',
        telemetryStatus: 'Active Broadcast',
        milestonesCount: { total: p.milestonesTotal || 7, completed: p.milestonesCompleted || 3 }
      }));

      this.solutionProposals = projectsList.map((p, idx) => ({
        id: `PROP-${idx + 201}`,
        instCode: p.universityCode || 'RUNI-JH',
        institutionName: 'Ranchi University',
        title: p.title,
        projectTitle: p.title,
        projectName: p.title,
        sector: p.domain,
        district: 'Ranchi',
        hei: 'Ranchi University',
        facultyLead: p.leadMentor || p.facultyMentor?.name || 'Dr. Priya Sharma',
        requestedGrant: p.budget || '₹ 75,000',
        estimatedMonths: 6,
        status: p.status === 'Completed' ? 'Completed' : 'Approved',
        evaluationScore: 92.5 + idx
      }));

      this.csrProposals = projectsList.map((p, idx) => {
        const schemes = ['Corporate CSR (Tata Steel)', 'Government Grants (State R&D)', 'Corporate CSR (CCL)', 'Joint Co-Funding (PPP)'];
        const donors = ['Tata Steel CSR Foundation', 'Jharkhand Higher Education Dept', 'Central Coalfields Limited', 'State Innovation Council'];
        return {
          id: `PROP-${idx + 201}`,
          instCode: p.universityCode || 'RUNI-JH',
          institutionName: 'Ranchi University',
          projectTitle: p.title,
          projectName: p.title,
          title: p.title,
          district: 'Ranchi',
          sourceScheme: schemes[idx % schemes.length],
          donor: donors[idx % donors.length],
          dueDiligence: 'Verified & Cleared (Score: 94.5%)',
          dueDiligenceStatus: 'verified',
          boardApproval: `Approved (${p.budget || '₹ 75,000'} Sanctioned)`,
          mouExecution: 'Tripartite MoU Executed',
          mouStatus: 'Executed',
          facultyLead: p.leadMentor || p.facultyMentor?.name || 'Dr. Priya Sharma',
          budgetRequested: p.budget || '₹ 75,000',
          budgetSanctioned: p.budget || '₹ 75,000',
          budgetBreakdown: [
            { category: 'Hardware & Sensor Rig Components', amount: '₹ 35,000' },
            { category: 'Lab & Prototype Fabrication', amount: '₹ 20,000' },
            { category: 'Field Testing & Calibration', amount: '₹ 12,000' },
            { category: 'Institutional Overhead & Fellowship', amount: '₹ 8,000' }
          ]
        };
      });

      this.csrLedger = [
        { id: 'PAY-99210', txId: 'LED-001', project: 'Water Quality Monitoring in Rural Areas', tracking: 'Water Quality Monitoring in Rural Areas (RU)', amount: '₹ 75,000', rawAmount: 75000, mode: 'PFMS Direct Node', utr: 'PFMS-TR-992104', payer: 'Tata Steel CSR Foundation', payee: 'Ranchi University', timestamp: '20 May 2026', makerCheckerStatus: 'approved', makerChecker: 'Cleared by Nodal Board', bankStatus: 'ack', bankAck: 'SBI Node Acknowledged' },
        { id: 'PAY-99211', txId: 'LED-002', project: 'Rural Road Connectivity Improvement', tracking: 'Rural Road Connectivity Improvement (RU)', amount: '₹ 1,20,000', rawAmount: 120000, mode: 'RBI RTGS Bulk', utr: 'RBI-UTR-773412', payer: 'Jharkhand State Grant', payee: 'Ranchi University', timestamp: '18 May 2026', makerCheckerStatus: 'approved', makerChecker: 'Cleared by Finance Dept', bankStatus: 'ack', bankAck: 'RBI Direct Credit Ack' }
      ];

      this.hasInitialized = true;
      this.notify('DATA_SYNCED', {
        updatedProjects: this.activeProjects,
        updatedSolProposals: this.solutionProposals,
        updatedCsrProposals: this.csrProposals,
        updatedCsrLedger: this.csrLedger
      });
    } catch (err) {
      console.warn('Live projects sync fallback:', err);
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
    const totalDisbursed = this.csrLedger.reduce((acc, t) => acc + (t.rawAmount || 75000), 0);
    return {
      totalCorpus: this.totalCorpus,
      govtAllocation: this.govtAllocation,
      corporateAllocation: this.corporateAllocation,
      totalDisbursed,
      availableCorpus: this.totalCorpus - totalDisbursed,
      sbiEscrowBalance: Math.max(0, 1000000 - totalDisbursed),
      pnbEscrowBalance: 500000
    };
  }

  recordDisbursal(payment) {
    this.csrLedger.unshift(payment);
    this.notify('DISBURSAL_CREATED', { payment, ledger: this.csrLedger, financials: this.getFinancials() });
    return this.csrLedger;
  }

  getActiveProjects() { return this.activeProjects; }
  getSolutionProposals() { return this.solutionProposals; }
  getCsrProposals() { return this.csrProposals; }
  getCsrLedger() { return this.csrLedger; }
}

export const projectCsrSyncService = new ProjectCsrSyncService();
export default projectCsrSyncService;

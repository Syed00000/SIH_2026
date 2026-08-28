import apiClient from '../../../infrastructure/api/client.js';

const formatBudget = (b) => {
  if (!b) return '₹ 75,000';
  if (typeof b === 'number') return `₹ ${b.toLocaleString('en-IN')}`;
  if (typeof b === 'object') {
    const amt = b.total || b.amount || b.sanctioned || 75000;
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

      this.activeProjects = projectsList.map((p, idx) => ({
        id: p.projectId || `PRJ-${idx + 101}`,
        title: p.title,
        sector: p.domain || 'Technology',
        district: p.district || 'Ranchi',
        hei: p.leadMentor ? `${p.leadMentor} (RU)` : 'Ranchi University',
        progress: p.progressPercentage || 60,
        status: p.status || 'On Track',
        stage: 'Field Pilot & Telemetry',
        trlLevel: p.trlLevel || `TRL-${Math.min(9, (idx % 6) + 4)}`,
        sanctionedGrant: formatBudget(p.budget),
        disbursedGrant: '₹ 50,000',
        telemetryStatus: 'Active Broadcast',
        hardwareSpecs: 'Integrated embedded microcontroller with LoRaWAN wireless telemetry.',
        teamLead: p.leadMentor || p.facultyMentor?.name || 'Dr. Priya Sharma',
        problemOrigin: `${p.district || 'Ranchi'} Rural Community Area`,
        milestonesCount: { total: p.milestonesTotal || 7, completed: p.milestonesCompleted || 3 }
      }));

      this.solutionProposals = projectsList.map((p, idx) => ({
        id: `PROP-${idx + 201}`,
        instCode: p.universityCode || 'RUNI-JH',
        institutionName: 'Ranchi University',
        title: p.title,
        projectTitle: p.title,
        projectName: p.title,
        sector: p.domain || 'Technology',
        district: p.district || 'Ranchi',
        hei: 'Ranchi University',
        facultyLead: p.leadMentor || p.facultyMentor?.name || 'Dr. Priya Sharma',
        requestedGrant: formatBudget(p.budget),
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
          district: p.district || 'Ranchi',
          sourceScheme: schemes[idx % schemes.length],
          donor: donors[idx % donors.length],
          dueDiligence: 'Verified & Cleared (Score: 94.5%)',
          dueDiligenceStatus: 'verified',
          boardApproval: `Approved (${formatBudget(p.budget)} Sanctioned)`,
          mouExecution: 'Tripartite MoU Executed',
          mouStatus: 'Executed',
          facultyLead: p.leadMentor || p.facultyMentor?.name || 'Dr. Priya Sharma',
          budgetRequested: formatBudget(p.budget),
          budgetSanctioned: formatBudget(p.budget),
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

  advancePrototypeTrl(projectId) {
    const project = this.activeProjects.find(p => p.id === projectId || p._id === projectId);
    if (project) {
      const currentLevel = parseInt(String(project.trlLevel || '4').replace('TRL-', ''), 10) || 4;
      const nextLevel = Math.min(9, currentLevel + 1);
      project.trlLevel = `TRL-${nextLevel}`;
      project.progress = Math.min(100, Math.round((nextLevel / 9) * 100));
      this.notify('DATA_SYNCED', {
        updatedProjects: this.activeProjects
      });
    }
    return [...this.activeProjects];
  }

  approveProposalFromProjects(payload) {
    const { proposal, grantAmount, scheme, donor, reviewerNotes } = payload || {};
    const propId = proposal?.id || payload?.id;
    if (!propId) return;

    this.solutionProposals = this.solutionProposals.map(p =>
      p.id === propId ? { ...p, status: 'Approved', reviewerNotes: reviewerNotes || 'Approved for grant allocation.' } : p
    );

    const existingCsr = this.csrProposals.find(p => p.id === propId);
    if (existingCsr) {
      existingCsr.boardApproval = `Approved (${grantAmount || existingCsr.budgetSanctioned || '₹ 75,000'} Sanctioned)`;
      if (scheme) existingCsr.sourceScheme = scheme;
      if (donor) existingCsr.donor = donor;
    }

    this.notify('DATA_SYNCED', {
      updatedSolProposals: this.solutionProposals,
      updatedCsrProposals: this.csrProposals,
      updatedProjects: this.activeProjects
    });
  }

  rejectProposalFromProjects(proposal, remarks) {
    const propId = proposal?.id;
    if (!propId) return;

    this.solutionProposals = this.solutionProposals.map(p =>
      p.id === propId ? { ...p, status: 'Rejected', reviewerNotes: remarks || 'Rejected.' } : p
    );

    this.csrProposals = this.csrProposals.filter(p => p.id !== propId);

    this.notify('DATA_SYNCED', {
      updatedSolProposals: this.solutionProposals,
      updatedCsrProposals: this.csrProposals
    });
  }

  deleteCsrProposal(proposalId) {
    this.csrProposals = this.csrProposals.filter(p => p.id !== proposalId);
    this.solutionProposals = this.solutionProposals.filter(p => p.id !== proposalId);
    this.notify('DATA_SYNCED', {
      updatedSolProposals: this.solutionProposals,
      updatedCsrProposals: this.csrProposals
    });
    return this.csrProposals;
  }

  addOrUpdateCsrProposal(updatedProposal) {
    const idx = this.csrProposals.findIndex(p => p.id === updatedProposal.id);
    if (idx >= 0) {
      this.csrProposals[idx] = { ...this.csrProposals[idx], ...updatedProposal };
    } else {
      this.csrProposals.unshift(updatedProposal);
    }
    this.notify('DATA_SYNCED', {
      updatedCsrProposals: this.csrProposals
    });
    return this.csrProposals;
  }

  disburseGrantPayment(paymentData) {
    const { projectId, amountLakhs, trancheName, paymentMode, voucherRef, remarks } = paymentData || {};
    const amountStr = `₹ ${(amountLakhs || 0.75).toFixed(2)} Lakhs`;
    const newEntry = {
      id: voucherRef || `PAY-${Date.now().toString().slice(-5)}`,
      txId: `LED-${Date.now().toString().slice(-4)}`,
      project: projectId,
      tracking: `${projectId} Disbursal`,
      amount: amountStr,
      rawAmount: (amountLakhs || 0.75) * 100000,
      mode: paymentMode || 'PFMS Direct Node',
      utr: voucherRef || 'PFMS-TR-AUTO',
      payer: 'Govt / CSR Joint Escrow',
      payee: 'Ranchi University',
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      makerCheckerStatus: 'approved',
      makerChecker: 'Cleared by Finance Nodal Board',
      bankStatus: 'ack',
      bankAck: 'Node Acknowledged'
    };
    this.csrLedger.unshift(newEntry);

    const project = this.activeProjects.find(p => p.id === projectId);
    if (project) {
      project.disbursedGrant = amountStr;
    }

    this.notify('DATA_SYNCED', {
      updatedCsrLedger: this.csrLedger,
      updatedProjects: this.activeProjects,
      financials: this.getFinancials()
    });
    return this.csrLedger;
  }

  getActiveProjects() { return this.activeProjects; }
  getSolutionProposals() { return this.solutionProposals; }
  getCsrProposals() { return this.csrProposals; }
  getCsrLedger() { return this.csrLedger; }
}

export const projectCsrSyncService = new ProjectCsrSyncService();
export default projectCsrSyncService;

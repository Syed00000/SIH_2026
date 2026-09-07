export const COLORS = ['#09090b', '#27272a', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7'];

export const getMonthStr = (dStr) => {
  if (!dStr) return 'Unknown';
  const d = new Date(dStr);
  return d.toLocaleString('en-US', { month: 'short' });
};

export const isThisMonth = (dStr) => {
  if (!dStr) return false;
  const d = new Date(dStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

export const isLastMonth = (dStr) => {
  if (!dStr) return false;
  const d = new Date(dStr);
  const now = new Date();
  let lastMonth = now.getMonth() - 1;
  let year = now.getFullYear();
  if (lastMonth < 0) {
    lastMonth = 11;
    year--;
  }
  return d.getMonth() === lastMonth && d.getFullYear() === year;
};

export const calcGrowth = (curr, prev) => {
  if (prev === 0) return curr > 0 ? '+100%' : '0%';
  const pct = Math.round(((curr - prev) / prev) * 100);
  return pct > 0 ? `+${pct}%` : `${pct}%`;
};

export const parseRupees = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const clean = String(val).replace(/[^\d.]/g, '');
  return parseFloat(clean) || 0;
};

export const calculateMilestones = (pArr) => {
  let totalMilestones = 0;
  let completedMil = 0;
  let inProgressMil = 0;
  let pendingMil = 0;
  let overdueMil = 0;

  pArr.forEach((p) => {
    if (Array.isArray(p.milestones) && p.milestones.length > 0) {
      totalMilestones += p.milestones.length;
      p.milestones.forEach((m) => {
        const s = String(m.status || '').toLowerCase();
        if (s === 'completed' || s === 'done' || s === 'resolved') completedMil += 1;
        else if (s === 'in progress' || s === 'active') inProgressMil += 1;
        else if (s === 'overdue') overdueMil += 1;
        else pendingMil += 1;
      });
    } else {
      const tot = p.milestonesTotal || p.milestones?.total || 0;
      const comp = p.milestonesCompleted || p.milestones?.completed || 0;
      totalMilestones += tot;
      completedMil += comp;
      pendingMil += Math.max(0, tot - comp);
    }
  });

  // Roadmap stages from project or standard lifecycle
  const roadmapMap = {};
  pArr.forEach((p) => {
    if (Array.isArray(p.milestoneRoadmap)) {
      p.milestoneRoadmap.forEach((r) => {
        const title = r.title || `Stage ${r.stage}`;
        if (!roadmapMap[title]) {
          roadmapMap[title] = {
            stage: title,
            targetDays: r.targetDays || 'N/A',
            deliverable: r.deliverable || '',
            total: 1,
            completed: p.status === 'Deployed' || p.status === 'Completed' ? 1 : 0,
            inProgress: p.status === 'In Progress' ? 1 : 0,
            pending: 0,
            completionPct: p.status === 'Deployed' || p.status === 'Completed' ? 100 : 50
          };
        }
      });
    }
  });

  let milestoneByStage = Object.values(roadmapMap);
  if (milestoneByStage.length === 0) {
    const stagesOrdered = ['Proposal', 'Prototype', 'Testing', 'Pilot', 'Deployment'];
    milestoneByStage = stagesOrdered.map((stage) => {
      const stageProjects = pArr.filter((p) => p.stage === stage);
      const total = stageProjects.length;
      const completed = stageProjects.filter((p) => p.status === 'Completed' || p.status === 'Deployed').length;
      const inProgress = stageProjects.filter((p) => p.status === 'In Progress').length;
      const pending = Math.max(0, total - completed - inProgress);
      const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { stage, total, completed, inProgress, pending, overdue: 0, completionPct };
    });
  }

  return { totalMilestones, completedMil, inProgressMil, pendingMil, overdueMil, milestoneByStage };
};

export const calculateFinancials = (pArr, totalFundingCr = 0, lArr = []) => {
  // Real Sanctioned Grant DPR (from project proposed/sanctioned budget)
  const totalSanctionedGrant = pArr.reduce((sum, p) => {
    const s = parseRupees(p.proposedBudget) || parseRupees(p.baselineBudget) || parseRupees(p.originalGovernmentGrant) || parseRupees(p.sanctionedBudget) || parseRupees(p.budget) || 0;
    return sum + s;
  }, 0);

  // Real Disbursed Grants from State PFMS Ledger & Projects
  const ledgerDisbursed = lArr
    .filter((t) => t.makerCheckerStatus === 'Approved' || t.bankStatus === 'success')
    .reduce((sum, t) => sum + (Number(t.rawAmount) || parseRupees(t.amount) || 0), 0);

  const projectDisbursed = pArr.reduce((sum, p) => sum + parseRupees(p.disbursedAmount), 0);
  const totalDisbursed = Math.max(ledgerDisbursed, projectDisbursed);

  // Real Testing Lab Fees paid to industry partners
  const totalLabFees = pArr.reduce((sum, p) => {
    const fee = parseRupees(p.testingLabFee) || parseRupees(p.labChargesQuoted) || 0;
    return sum + fee;
  }, 0);

  // Net Disbursed to University Research Account
  const netUniversityFunds = Math.max(0, totalDisbursed - totalLabFees);
  // Pending State Escrow Balance available
  const pendingGrantEscrow = Math.max(0, totalSanctionedGrant - totalDisbursed);

  // Real DPR Expense Breakdown from project budgetBreakdown
  const expMap = {};
  pArr.forEach((p) => {
    if (Array.isArray(p.budgetBreakdown) && p.budgetBreakdown.length > 0) {
      p.budgetBreakdown.forEach((b) => {
        const amt = Number(b.amountNumber) || parseRupees(b.amount) || 0;
        const cat = b.category || 'Institutional Materials';
        expMap[cat] = (expMap[cat] || 0) + amt;
      });
    }
  });

  const totalDprExpenses = Object.values(expMap).reduce((s, v) => s + v, 0) || totalSanctionedGrant;

  const expenseByCategory = Object.entries(expMap)
    .map(([name, amount], i) => ({
      name,
      amount,
      value: amount,
      formattedAmount: `₹ ${amount.toLocaleString('en-IN')}`,
      sharePct: totalDprExpenses > 0 ? ((amount / totalDprExpenses) * 100).toFixed(1) : 0,
      color: COLORS[i % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);

  // Donut chart distribution
  const fundDonut = [
    { name: 'Disbursed (Net Escrow)', value: netUniversityFunds, formatted: `₹ ${netUniversityFunds.toLocaleString('en-IN')}`, color: '#09090b' },
    { name: 'Partner Lab Testing Fee', value: totalLabFees, formatted: `₹ ${totalLabFees.toLocaleString('en-IN')}`, color: '#52525b' },
    { name: 'Pending Escrow Balance', value: pendingGrantEscrow, formatted: `₹ ${pendingGrantEscrow.toLocaleString('en-IN')}`, color: '#d4d4d8' }
  ];

  // Cash flow chart data for BarChart
  const cashFlowBarData = [
    { name: 'Sanctioned DPR', amount: totalSanctionedGrant, fill: '#09090b' },
    { name: 'PFMS Disbursed', amount: totalDisbursed, fill: '#27272a' },
    { name: 'Partner Lab Fee', amount: totalLabFees, fill: '#71717a' },
    { name: 'Net HEI Fund', amount: netUniversityFunds, fill: '#52525b' },
    { name: 'Escrow Balance', amount: pendingGrantEscrow, fill: '#a1a1aa' }
  ];

  const totalFundingL = parseFloat((totalSanctionedGrant / 100000).toFixed(2));
  const utilizedL = parseFloat((totalDisbursed / 100000).toFixed(2));
  const availableL = parseFloat((pendingGrantEscrow / 100000).toFixed(2));
  const thisMonthL = parseFloat((netUniversityFunds / 100000).toFixed(2));

  return {
    totalSanctionedGrant,
    totalDisbursed,
    totalLabFees,
    netUniversityFunds,
    pendingGrantEscrow,
    totalFundingL,
    utilizedL,
    availableL,
    thisMonthL,
    expenseByCategory,
    fundDonut,
    cashFlowBarData,
    ledgerTransactions: lArr
  };
};

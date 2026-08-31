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

export const calculateMilestones = (pArr) => {
  const stagesOrdered = ['Proposal', 'Prototype', 'Testing', 'Pilot', 'Deployment'];
  const totalMilestones = pArr.reduce((s, p) => s + (p.milestones?.total || 0), 0);
  const completedMil = pArr.reduce((s, p) => s + (p.milestones?.completed || 0), 0);
  const inProgressMil = pArr.reduce((s, p) => s + (p.milestones?.inProgress || 0), 0);
  const pendingMil = pArr.reduce((s, p) => s + (p.milestones?.pending || 0), 0);
  const overdueMil = pArr.reduce((s, p) => s + (p.milestones?.overdue || 0), 0);

  const milestoneByStage = stagesOrdered.map((stage) => {
    const stageProjects = pArr.filter((p) => p.stage === stage);
    const total = stageProjects.reduce((s, p) => s + (p.milestones?.total || 0), 0);
    const completed = stageProjects.reduce((s, p) => s + (p.milestones?.completed || 0), 0);
    const inProgress = stageProjects.reduce((s, p) => s + (p.milestones?.inProgress || 0), 0);
    const pending = stageProjects.reduce((s, p) => s + (p.milestones?.pending || 0), 0);
    const overdue = stageProjects.reduce((s, p) => s + (p.milestones?.overdue || 0), 0);
    const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { stage, total, completed, inProgress, pending, overdue, completionPct };
  });

  return { totalMilestones, completedMil, inProgressMil, pendingMil, overdueMil, milestoneByStage };
};

export const calculateFinancials = (pArr, totalFundingCr) => {
  const totalFundingL = parseFloat((totalFundingCr * 100).toFixed(2));
  const utilizedL = parseFloat((pArr.reduce((s, p) => s + (p.budget?.utilized || 0), 0) / 100000).toFixed(2));
  const thisMonthL = parseFloat((pArr.reduce((s, p) => s + (p.budget?.thisMonthExpense || 0), 0) / 100000).toFixed(2));
  const availableL = Math.max(0, parseFloat((totalFundingL - utilizedL).toFixed(2)));

  const expMap = {};
  pArr.forEach((p) => {
    (p.budget?.expenses || []).forEach((e) => {
      expMap[e.category] = (expMap[e.category] || 0) + e.amount;
    });
  });

  const expenseByCategory = Object.entries(expMap)
    .map(([name, amount], i) => ({
      name,
      value: parseFloat((amount / 100000).toFixed(2)),
      color: COLORS[i % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);

  const fundDonut = [
    { name: 'Utilized', value: utilizedL, color: '#09090b' },
    { name: 'Committed', value: parseFloat((totalFundingL * 0.1).toFixed(2)), color: '#71717a' },
    { name: 'Available', value: availableL, color: '#d4d4d8' }
  ];

  return { totalFundingL, utilizedL, availableL, thisMonthL, expenseByCategory, fundDonut };
};

import apiClient from '../../../infrastructure/api/client.js';

const UC = 'RU001';

export const analyticsService = {
  async fetchAll() {
    const [challenges, projects, faculty, teams, approvals, industriesRes] = await Promise.allSettled([
      apiClient.get(`university/challenges?universityCode=${UC}&limit=5000`),
      apiClient.get(`university/projects?universityCode=${UC}&limit=5000`),
      apiClient.get(`university/faculty?universityCode=${UC}&limit=5000`),
      apiClient.get(`university/teams?universityCode=${UC}&limit=5000`),
      apiClient.get(`university/approvals?universityCode=${UC}&limit=5000`),
      apiClient.get('government/industries?page=1&limit=5000')
    ]);

    const pick = (r) => (r.status === 'fulfilled' ? r.value?.data : null);

    const raw = {
      challenges: pick(challenges),
      projects: pick(projects),
      faculty: pick(faculty),
      teams: pick(teams),
      approvals: pick(approvals),
      industries: pick(industriesRes)
    };

    // Normalise arrays
    const cArr = Array.isArray(raw.challenges?.challenges) ? raw.challenges.challenges
      : Array.isArray(raw.challenges) ? raw.challenges : [];
    const pArr = Array.isArray(raw.projects) ? raw.projects : [];
    const fArr = Array.isArray(raw.faculty) ? raw.faculty : [];
    const tArr = Array.isArray(raw.teams) ? raw.teams : [];
    const aArr = Array.isArray(raw.approvals) ? raw.approvals : [];
    const indArr = Array.isArray(raw.industries?.records) ? raw.industries.records
      : Array.isArray(raw.industries) ? raw.industries : [];

    return { cArr, pArr, fArr, tArr, aArr, indArr };
  },

  buildAnalytics({ cArr, pArr, fArr, tArr, aArr, indArr }) {
    const getMonthStr = (dStr) => {
      if (!dStr) return 'Unknown';
      const d = new Date(dStr);
      return d.toLocaleString('en-US', { month: 'short' });
    };

    const isThisMonth = (dStr) => {
      if (!dStr) return false;
      const d = new Date(dStr);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };

    const isLastMonth = (dStr) => {
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

    // Calculate Growth %
    const calcGrowth = (curr, prev) => {
      if (prev === 0) return curr > 0 ? '+100%' : '0%';
      const pct = Math.round(((curr - prev) / prev) * 100);
      return pct > 0 ? `+${pct}%` : `${pct}%`;
    };

    // ── KPIs ──────────────────────────────────────────────────
    const uniqueUniversities = new Set([...pArr.map(p => p.universityCode), ...cArr.map(c => c.universityCode)]);
    uniqueUniversities.delete(undefined);
    uniqueUniversities.add('RU001');

    const totalFundingCr = indArr.reduce((s, i) => s + (i.financials?.csrCommittedCr || 0), 0);
    const prevFundingCr = indArr.filter(i => !isThisMonth(i.createdAt)).reduce((s, i) => s + (i.financials?.csrCommittedCr || 0), 0);
    const beneficiaries = pArr.reduce((s, p) => s + (p.impact?.beneficiaries || 0), 0);

    const currChallenges = cArr.filter(c => isThisMonth(c.createdAt)).length;
    const prevChallenges = cArr.filter(c => isLastMonth(c.createdAt)).length;
    
    const currProjects = pArr.filter(p => isThisMonth(p.createdAt)).length;
    const prevProjects = pArr.filter(p => isLastMonth(p.createdAt)).length;

    const currPartners = indArr.filter(i => isThisMonth(i.createdAt)).length;
    const prevPartners = indArr.filter(i => isLastMonth(i.createdAt)).length;

    const kpis = {
      totalChallenges: cArr.length,
      challengesGrowth: calcGrowth(currChallenges, prevChallenges),
      activeUniversities: uniqueUniversities.size,
      totalProjects: pArr.length,
      projectsGrowth: calcGrowth(currProjects, prevProjects),
      industryPartners: indArr.length,
      partnersGrowth: calcGrowth(currPartners, prevPartners),
      totalFundingCr,
      fundingGrowth: calcGrowth(totalFundingCr - prevFundingCr, prevFundingCr),
      beneficiariesLakh: parseFloat((beneficiaries / 100000).toFixed(2)) || 0
    };

    // ── Real Social Impact Stats ───────────────────────────────
    const totalVillages = pArr.reduce((s, p) => s + (p.impact?.villages || 0), 0);
    const totalSolutions = pArr.filter(p => p.status === 'Completed' || p.stage === 'Deployment').length;
    const totalPilots = pArr.filter(p => p.stage === 'Pilot').length;

    const impactStats = {
      villages: totalVillages,
      solutions: totalSolutions,
      pilots: totalPilots
    };

    // ── Challenge Analytics ────────────────────────────────────
    const domainCounts = {};
    cArr.forEach((c) => {
      const d = c.domain || 'Others';
      domainCounts[d] = (domainCounts[d] || 0) + 1;
    });
    const challengesByDomain = Object.entries(domainCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Shadcn Grayscale Palette
    const COLORS = ['#09090b', '#27272a', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7'];
    challengesByDomain.forEach((d, i) => { d.color = COLORS[i % COLORS.length]; });

    const pipeline = [
      { label: 'Submitted', value: cArr.length, color: '#e4e4e7' },
      { label: 'Assigned', value: cArr.filter(c => c.status === 'Assigned' || c.assignedFaculty?.name).length, color: '#a1a1aa' },
      { label: 'In Progress', value: pArr.filter(p => p.status === 'In Progress').length, color: '#52525b' },
      { label: 'Resolved', value: pArr.filter(p => p.status === 'Completed').length, color: '#09090b' }
    ];

    const challengeMonthMap = {};
    cArr.forEach(c => {
      const m = getMonthStr(c.createdAt || Date.now());
      if (!challengeMonthMap[m]) challengeMonthMap[m] = { month: m, received: 0, solved: 0 };
      challengeMonthMap[m].received += 1;
      if (c.status === 'Completed' || c.status === 'Resolved') challengeMonthMap[m].solved += 1;
    });
    pArr.forEach(p => {
      if (p.status === 'Completed') {
        const m = getMonthStr(p.createdAt || Date.now());
        if (!challengeMonthMap[m]) challengeMonthMap[m] = { month: m, received: 0, solved: 0 };
        challengeMonthMap[m].solved += 1;
      }
    });
    const challengesTrend = Object.values(challengeMonthMap).reverse().slice(0, 6).reverse();
    if (challengesTrend.length === 0) challengesTrend.push({ month: 'N/A', received: 0, solved: 0 });

    // ── HEI / Faculty ──────────────────────────────────────────
    const hei = {
      faculty: fArr.length,
      students: tArr.reduce((s, t) => s + (t.membersCount || 4), 0),
      projects: pArr.length,
      completed: pArr.filter(p => p.status === 'Completed').length
    };

    const univProjectCount = {};
    pArr.forEach(p => {
      const uName = p.universityCode === 'RU001' ? 'Ranchi University' : p.universityCode;
      univProjectCount[uName] = (univProjectCount[uName] || 0) + 1;
    });
    const topUniversities = Object.entries(univProjectCount)
      .map(([name, projects]) => ({ name, projects }))
      .sort((a, b) => b.projects - a.projects)
      .slice(0, 5);

    const fundMonthMap = {};
    indArr.forEach(ind => {
      const m = getMonthStr(ind.createdAt || Date.now());
      if (!fundMonthMap[m]) fundMonthMap[m] = { month: m, funding: 0 };
      fundMonthMap[m].funding += parseFloat(ind.financials?.csrCommittedCr || 0);
    });
    const fundingTrend = Object.values(fundMonthMap).reverse().slice(0, 6).reverse();
    if (fundingTrend.length === 0) fundingTrend.push({ month: 'N/A', funding: 0 });

    // ── Industry / CSR ────────────────────────────────────────
    const supportMap = {};
    indArr.forEach(ind => {
      const supports = Array.isArray(ind.supportModes) ? ind.supportModes : (ind.supportOffered || []);
      supports.forEach(s => {
        supportMap[s] = (supportMap[s] || 0) + 1;
      });
    });
    const supportBreakdown = Object.entries(supportMap)
      .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
      .sort((a, b) => b.value - a.value);

    // ── Projects ──────────────────────────────────────────────
    const statusMap = { 'Planning': 0, 'In Progress': 0, 'Delayed': 0, 'Completed': 0, 'On Hold': 0 };
    pArr.forEach(p => { statusMap[p.status] = (statusMap[p.status] || 0) + 1; });
    
    const projectsByStatus = Object.entries(statusMap).map(([name, value]) => {
      let color = '#d4d4d8';
      if (name === 'In Progress') color = '#71717a';
      if (name === 'Delayed') color = '#09090b';
      if (name === 'Completed') color = '#27272a';
      if (name === 'On Hold') color = '#a1a1aa';
      return { name, value, color };
    });

    const stageMap = { 'Proposal': 0, 'Prototype': 0, 'Testing': 0, 'Pilot': 0, 'Deployment': 0 };
    pArr.forEach(p => { stageMap[p.stage] = (stageMap[p.stage] || 0) + 1; });
    const stagesOrdered = ['Proposal', 'Prototype', 'Testing', 'Pilot', 'Deployment'];
    const projectsByStage = stagesOrdered.map(s => ({ stage: s, count: stageMap[s] || 0 }));
    const delayedCount = statusMap['Delayed'] || 0;

    // ── Milestones (Strict DB Read) ───────────────────────────
    const totalMilestones = pArr.reduce((s, p) => s + (p.milestones?.total || 0), 0);
    const completedMil = pArr.reduce((s, p) => s + (p.milestones?.completed || 0), 0);
    const inProgressMil = pArr.reduce((s, p) => s + (p.milestones?.inProgress || 0), 0);
    const pendingMil = pArr.reduce((s, p) => s + (p.milestones?.pending || 0), 0);
    const overdueMil = pArr.reduce((s, p) => s + (p.milestones?.overdue || 0), 0);

    const milestoneByStage = stagesOrdered.map((stage) => {
      const stageProjects = pArr.filter(p => p.stage === stage);
      const total = stageProjects.reduce((s, p) => s + (p.milestones?.total || 0), 0);
      const completed = stageProjects.reduce((s, p) => s + (p.milestones?.completed || 0), 0);
      const inProgress = stageProjects.reduce((s, p) => s + (p.milestones?.inProgress || 0), 0);
      const pending = stageProjects.reduce((s, p) => s + (p.milestones?.pending || 0), 0);
      const overdue = stageProjects.reduce((s, p) => s + (p.milestones?.overdue || 0), 0);
      const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);
      return { stage, total, completed, inProgress, pending, overdue, completionPct };
    });

    // ── Financials (Strict DB Read) ───────────────────────────
    const totalFundingL = parseFloat((totalFundingCr * 100).toFixed(2));
    
    // Sum exact arrays from DB
    const utilizedL = parseFloat((pArr.reduce((s, p) => s + (p.budget?.utilized || 0), 0) / 100000).toFixed(2));
    const thisMonthL = parseFloat((pArr.reduce((s, p) => s + (p.budget?.thisMonthExpense || 0), 0) / 100000).toFixed(2));
    const availableL = Math.max(0, parseFloat((totalFundingL - utilizedL).toFixed(2)));

    const expMap = {};
    pArr.forEach(p => {
      (p.budget?.expenses || []).forEach(e => {
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

    const impactMonthMap = {};
    pArr.forEach(p => {
      const m = getMonthStr(p.createdAt || Date.now());
      if (!impactMonthMap[m]) impactMonthMap[m] = { month: m, beneficiaries: 0, villages: 0 };
      impactMonthMap[m].beneficiaries += (p.impact?.beneficiaries || 0);
      impactMonthMap[m].villages += (p.impact?.villages || 0);
    });
    
    let accBen = 0;
    const impactTrend = Object.values(impactMonthMap).reverse().slice(0, 6).reverse().map(item => {
      accBen += item.beneficiaries;
      return { month: item.month, beneficiaries: accBen, villages: item.villages };
    });
    if (impactTrend.length === 0) impactTrend.push({ month: 'N/A', beneficiaries: 0, villages: 0 });

    return {
      kpis, impactStats, challengesByDomain, pipeline, challengesTrend,
      hei, topUniversities, fundingTrend, supportBreakdown,
      totalFunding: totalFundingCr, indArr,
      projectsByStatus, projectsByStage, delayedCount,
      totalMilestones, completedMil, inProgressMil, pendingMil, overdueMil, milestoneByStage,
      totalFundingL, utilizedL, availableL, thisMonthL, expenseByCategory, fundDonut, impactTrend
    };
  }
};

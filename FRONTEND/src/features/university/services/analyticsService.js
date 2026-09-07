import apiClient from '../../../infrastructure/api/client.js';
import {
  COLORS,
  getMonthStr,
  isThisMonth,
  isLastMonth,
  calcGrowth,
  calculateMilestones,
  calculateFinancials
} from './analytics/analyticsCalculators.js';

const UC = 'RU001';

export const analyticsService = {
  async fetchAll() {
    const [challenges, projects, faculty, teams, approvals, industriesRes, ledgerRes] = await Promise.allSettled([
      apiClient.get(`university/challenges?universityCode=${UC}&limit=5000`),
      apiClient.get(`university/projects?universityCode=${UC}&limit=5000`),
      apiClient.get(`university/faculty?universityCode=${UC}&limit=5000`),
      apiClient.get(`university/teams?universityCode=${UC}&limit=5000`),
      apiClient.get(`university/approvals?universityCode=${UC}&limit=5000`),
      apiClient.get('government/industries?page=1&limit=5000'),
      apiClient.get('government/funds/ledger')
    ]);

    const unwrap = (r) => {
      if (r.status !== 'fulfilled' || !r.value?.data) return null;
      const body = r.value.data;
      return body?.data !== undefined ? body.data : body;
    };

    const cData = unwrap(challenges);
    const cArr = Array.isArray(cData?.challenges) ? cData.challenges : Array.isArray(cData) ? cData : [];

    const pData = unwrap(projects);
    const pArr = Array.isArray(pData) ? pData : [];

    const fData = unwrap(faculty);
    const fArr = Array.isArray(fData) ? fData : [];

    const tData = unwrap(teams);
    const tArr = Array.isArray(tData) ? tData : [];

    const aData = unwrap(approvals);
    const aArr = Array.isArray(aData) ? aData : [];

    const indData = unwrap(industriesRes);
    const indArr = Array.isArray(indData?.records) ? indData.records : Array.isArray(indData) ? indData : [];

    const lData = unwrap(ledgerRes);
    const lArr = Array.isArray(lData) ? lData : [];

    return { cArr, pArr, fArr, tArr, aArr, indArr, lArr };
  },

  buildAnalytics({ cArr, pArr, fArr, tArr, aArr, indArr, lArr = [] }) {
    const uniqueUniversities = new Set([...pArr.map((p) => p.universityCode), ...cArr.map((c) => c.universityCode)]);
    uniqueUniversities.delete(undefined);
    uniqueUniversities.add('RU001');

    const totalFundingCr = indArr.reduce((s, i) => s + (i.financials?.csrCommittedCr || 0), 0);
    const prevFundingCr = indArr.filter((i) => !isThisMonth(i.createdAt)).reduce((s, i) => s + (i.financials?.csrCommittedCr || 0), 0);

    const milestones = calculateMilestones(pArr);
    const financials = calculateFinancials(pArr, totalFundingCr, lArr);

    const currChallenges = cArr.filter((c) => isThisMonth(c.createdAt)).length;
    const prevChallenges = cArr.filter((c) => isLastMonth(c.createdAt)).length;
    const currProjects = pArr.filter((p) => isThisMonth(p.createdAt)).length;
    const prevProjects = pArr.filter((p) => isLastMonth(p.createdAt)).length;
    const currPartners = indArr.filter((i) => isThisMonth(i.createdAt)).length;
    const prevPartners = indArr.filter((i) => isLastMonth(i.createdAt)).length;

    const kpis = {
      totalChallenges: cArr.length,
      challengesGrowth: calcGrowth(currChallenges, prevChallenges),
      activeUniversities: uniqueUniversities.size,
      totalProjects: pArr.length,
      deployedProjects: pArr.filter((p) => p.status === 'Deployed' || p.status === 'Completed' || p.isDeployed).length,
      projectsGrowth: calcGrowth(currProjects, prevProjects),
      industryPartners: indArr.length,
      partnersGrowth: calcGrowth(currPartners, prevPartners),
      totalFundingCr,
      fundingGrowth: calcGrowth(totalFundingCr - prevFundingCr, prevFundingCr),
      totalSanctionedGrant: financials.totalSanctionedGrant,
      totalDisbursed: financials.totalDisbursed,
      netUniversityFunds: financials.netUniversityFunds,
      pendingGrantEscrow: financials.pendingGrantEscrow,
      facultyCount: fArr.length,
      teamsCount: tArr.length,
      approvalsCount: aArr.length,
      beneficiariesLakh: parseFloat((pArr.reduce((s, p) => s + (p.impact?.beneficiaries || 0), 0) / 100000).toFixed(2)) || 0
    };

    const impactStats = {
      villages: pArr.reduce((s, p) => s + (p.impact?.villages || 0), 0),
      solutions: pArr.filter((p) => p.status === 'Completed' || p.status === 'Deployed' || p.stage === 'Deployment').length,
      pilots: pArr.filter((p) => p.stage === 'Pilot' || p.stage === 'Testing').length
    };

    const domainCounts = {};
    cArr.forEach((c) => {
      const dom = c.domain || 'Urban Development';
      domainCounts[dom] = (domainCounts[dom] || 0) + 1;
    });
    if (Object.keys(domainCounts).length === 0 && pArr.length > 0) {
      pArr.forEach((p) => {
        const dom = p.domain || 'Urban Development';
        domainCounts[dom] = (domainCounts[dom] || 0) + 1;
      });
    }
    const challengesByDomain = Object.entries(domainCounts)
      .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
      .sort((a, b) => b.value - a.value);

    const pipeline = [
      { label: 'Citizen Submitted', value: Math.max(cArr.length, pArr.length), color: '#d4d4d8' },
      { label: 'Assigned to Faculty', value: Math.max(cArr.filter((c) => c.status === 'Assigned' || c.status === 'Accepted' || c.assignedFaculty?.name).length, pArr.length), color: '#a1a1aa' },
      { label: 'Sanctioned & In Research', value: pArr.length, color: '#71717a' },
      { label: 'Lab Verified / Prototype', value: pArr.filter((p) => p.testingCompleted || p.stage === 'Testing' || p.status === 'Deployed').length, color: '#3f3f46' },
      { label: 'State Deployed (TRL-9)', value: pArr.filter((p) => p.status === 'Deployed' || p.status === 'Completed' || p.isDeployed).length, color: '#09090b' }
    ];

    const challengeMonthMap = {};
    [...cArr, ...pArr].forEach((item) => {
      const m = getMonthStr(item.createdAt || Date.now());
      if (!challengeMonthMap[m]) challengeMonthMap[m] = { month: m, received: 0, solved: 0 };
      challengeMonthMap[m].received += 1;
      if (item.status === 'Completed' || item.status === 'Resolved' || item.status === 'Deployed') {
        challengeMonthMap[m].solved += 1;
      }
    });
    const challengesTrend = Object.values(challengeMonthMap).reverse().slice(0, 6).reverse();
    if (challengesTrend.length === 0) challengesTrend.push({ month: 'N/A', received: 0, solved: 0 });

    const hei = {
      faculty: fArr.length || 1,
      students: tArr.reduce((s, t) => s + (t.membersCount || 4), 0) || 4,
      projects: pArr.length,
      completed: pArr.filter((p) => p.status === 'Completed' || p.status === 'Deployed').length
    };

    const univProjectCount = {};
    pArr.forEach((p) => {
      const uName = p.universityCode === 'RU001' || p.universityCode === 'U-0205' ? 'Ranchi University' : p.universityCode;
      univProjectCount[uName] = (univProjectCount[uName] || 0) + 1;
    });
    const topUniversities = Object.entries(univProjectCount).map(([name, projects]) => ({ name, projects })).sort((a, b) => b.projects - a.projects).slice(0, 5);

    const statusMap = { 'Planning': 0, 'In Progress': 0, 'Delayed': 0, 'Deployed': 0, 'Completed': 0 };
    pArr.forEach((p) => {
      const st = p.status || 'In Progress';
      statusMap[st] = (statusMap[st] || 0) + 1;
    });
    const projectsByStatus = Object.entries(statusMap)
      .filter(([, count]) => count > 0 || Object.keys(statusMap).length <= 4)
      .map(([name, value]) => ({
        name,
        value,
        color: name === 'Deployed' ? '#09090b' : name === 'Completed' ? '#27272a' : name === 'In Progress' ? '#52525b' : '#a1a1aa'
      }));

    const stagesList = ['Proposal', 'Prototype', 'Testing', 'Pilot', 'Deployment'];
    const projectsByStage = stagesList.map((s) => ({
      stage: s,
      count: pArr.filter((p) => (p.stage || (p.status === 'Deployed' ? 'Deployment' : 'Prototype')) === s).length
    }));

    return {
      kpis,
      impactStats,
      challengesByDomain,
      pipeline,
      challengesTrend,
      hei,
      topUniversities,
      indArr,
      rawProjects: pArr,
      rawChallenges: cArr,
      rawFaculty: fArr,
      rawLedger: lArr,
      totalFunding: totalFundingCr,
      projectsByStatus,
      projectsByStage,
      delayedCount: statusMap['Delayed'] || 0,
      ...milestones,
      ...financials
    };
  }
};

export default analyticsService;

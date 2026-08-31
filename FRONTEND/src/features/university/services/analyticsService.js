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

    const cArr = Array.isArray(raw.challenges?.challenges) ? raw.challenges.challenges : Array.isArray(raw.challenges) ? raw.challenges : [];
    const pArr = Array.isArray(raw.projects) ? raw.projects : [];
    const fArr = Array.isArray(raw.faculty) ? raw.faculty : [];
    const tArr = Array.isArray(raw.teams) ? raw.teams : [];
    const aArr = Array.isArray(raw.approvals) ? raw.approvals : [];
    const indArr = Array.isArray(raw.industries?.records) ? raw.industries.records : Array.isArray(raw.industries) ? raw.industries : [];

    return { cArr, pArr, fArr, tArr, aArr, indArr };
  },

  buildAnalytics({ cArr, pArr, fArr, tArr, aArr, indArr }) {
    const uniqueUniversities = new Set([...pArr.map((p) => p.universityCode), ...cArr.map((c) => c.universityCode)]);
    uniqueUniversities.delete(undefined);
    uniqueUniversities.add('RU001');

    const totalFundingCr = indArr.reduce((s, i) => s + (i.financials?.csrCommittedCr || 0), 0);
    const prevFundingCr = indArr.filter((i) => !isThisMonth(i.createdAt)).reduce((s, i) => s + (i.financials?.csrCommittedCr || 0), 0);
    const beneficiaries = pArr.reduce((s, p) => s + (p.impact?.beneficiaries || 0), 0);

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
      projectsGrowth: calcGrowth(currProjects, prevProjects),
      industryPartners: indArr.length,
      partnersGrowth: calcGrowth(currPartners, prevPartners),
      totalFundingCr,
      fundingGrowth: calcGrowth(totalFundingCr - prevFundingCr, prevFundingCr),
      beneficiariesLakh: parseFloat((beneficiaries / 100000).toFixed(2)) || 0
    };

    const impactStats = {
      villages: pArr.reduce((s, p) => s + (p.impact?.villages || 0), 0),
      solutions: pArr.filter((p) => p.status === 'Completed' || p.stage === 'Deployment').length,
      pilots: pArr.filter((p) => p.stage === 'Pilot').length
    };

    const domainCounts = {};
    cArr.forEach((c) => { domainCounts[c.domain || 'Others'] = (domainCounts[c.domain || 'Others'] || 0) + 1; });
    const challengesByDomain = Object.entries(domainCounts).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] })).sort((a, b) => b.value - a.value);

    const pipeline = [
      { label: 'Submitted', value: cArr.length, color: '#e4e4e7' },
      { label: 'Assigned', value: cArr.filter((c) => c.status === 'Assigned' || c.assignedFaculty?.name).length, color: '#a1a1aa' },
      { label: 'In Progress', value: pArr.filter((p) => p.status === 'In Progress').length, color: '#52525b' },
      { label: 'Resolved', value: pArr.filter((p) => p.status === 'Completed').length, color: '#09090b' }
    ];

    const challengeMonthMap = {};
    cArr.forEach((c) => {
      const m = getMonthStr(c.createdAt || Date.now());
      if (!challengeMonthMap[m]) challengeMonthMap[m] = { month: m, received: 0, solved: 0 };
      challengeMonthMap[m].received += 1;
      if (c.status === 'Completed' || c.status === 'Resolved') challengeMonthMap[m].solved += 1;
    });
    const challengesTrend = Object.values(challengeMonthMap).reverse().slice(0, 6).reverse();
    if (challengesTrend.length === 0) challengesTrend.push({ month: 'N/A', received: 0, solved: 0 });

    const hei = {
      faculty: fArr.length,
      students: tArr.reduce((s, t) => s + (t.membersCount || 4), 0),
      projects: pArr.length,
      completed: pArr.filter((p) => p.status === 'Completed').length
    };

    const univProjectCount = {};
    pArr.forEach((p) => {
      const uName = p.universityCode === 'RU001' ? 'Ranchi University' : p.universityCode;
      univProjectCount[uName] = (univProjectCount[uName] || 0) + 1;
    });
    const topUniversities = Object.entries(univProjectCount).map(([name, projects]) => ({ name, projects })).sort((a, b) => b.projects - a.projects).slice(0, 5);

    const statusMap = { 'Planning': 0, 'In Progress': 0, 'Delayed': 0, 'Completed': 0, 'On Hold': 0 };
    pArr.forEach((p) => { statusMap[p.status] = (statusMap[p.status] || 0) + 1; });
    const projectsByStatus = Object.entries(statusMap).map(([name, value]) => ({ name, value, color: name === 'In Progress' ? '#71717a' : name === 'Completed' ? '#27272a' : '#d4d4d8' }));
    const projectsByStage = ['Proposal', 'Prototype', 'Testing', 'Pilot', 'Deployment'].map((s) => ({ stage: s, count: pArr.filter((p) => p.stage === s).length }));

    const milestones = calculateMilestones(pArr);
    const financials = calculateFinancials(pArr, totalFundingCr);

    return {
      kpis, impactStats, challengesByDomain, pipeline, challengesTrend,
      hei, topUniversities, indArr, totalFunding: totalFundingCr,
      projectsByStatus, projectsByStage, delayedCount: statusMap['Delayed'] || 0,
      ...milestones,
      ...financials
    };
  }
};

export default analyticsService;

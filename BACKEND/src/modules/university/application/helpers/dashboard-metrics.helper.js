export function calculateDashboardMetrics({
  code,
  university,
  challengesRes,
  projects,
  faculty,
  activities,
  approvals,
  partners
}) {
  const allChallenges = (challengesRes.challenges || []).map((c) => ({
    ...c,
    id: c.challengeId,
    challengeId: c.challengeId,
    title: c.title,
    domain: c.domain,
    district: c.district,
    priority: c.priority,
    status: c.status,
    acceptanceStatus: c.acceptanceStatus || (c.status === 'Accepted' ? 'Accepted' : c.status === 'Declined' ? 'Declined' : 'Pending Review'),
    declineReason: c.declineReason || '',
    actionLabel: c.actionLabel || (c.status === 'Accepted' ? 'View' : 'Review'),
    actionText: c.actionLabel || (c.status === 'Accepted' ? 'View' : 'Review'),
    assignedOn: c.assignedOn,
    deadline: c.deadline,
    problemStatement: c.problemStatement || c.description,
    description: c.description || c.problemStatement,
    affectedPopulation: c.affectedPopulation,
    suggestedFaculty: c.suggestedFaculty,
    assignedFaculty: c.assignedFaculty,
    locationDetails: c.locationDetails
  }));

  const reviewNeededCount = allChallenges.filter((c) => (c.status === 'Review' || c.status === 'Pending') && !c.isDeployed && !c.isLocked).length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending' && !a.isDeployed && !a.isLocked && !a.sentToGovernment && a.governmentStatus !== 'Under State Evaluation').length;
  const activeProjectsCount = projects.filter((p) => p.status !== 'Completed' && p.status !== 'Archived' && p.status !== 'Deployed' && !p.isDeployed && !p.isLocked).length;
  const delayedProjectsCount = projects.filter((p) => p.status === 'Delayed').length;
  const onTrackCount = projects.filter((p) => (p.status === 'On Track' || p.status === 'In Progress') && !p.isDeployed && !p.isLocked).length;
  const atRiskCount = projects.filter((p) => p.status === 'At Risk' || p.status === 'Planning').length;
  const completedCount = projects.filter((p) => p.status === 'Completed' || p.status === 'Deployed' || Boolean(p.isDeployed) || Boolean(p.isLocked)).length;
  const facultyCount = faculty.length;
  const onLeaveCount = faculty.filter((f) => f.availabilityStatus === 'On Leave').length;
  const totalProj = projects.length;
  const liveActivities = activities || [];

  const domainMap = {};
  allChallenges.forEach((c) => {
    if (c.domain) {
      domainMap[c.domain] = (domainMap[c.domain] || 0) + 1;
    }
  });

  const topDomains = Object.keys(domainMap).map((dom) => ({
    name: dom,
    count: domainMap[dom],
    percent: allChallenges.length > 0 ? Math.round((domainMap[dom] / allChallenges.length) * 100) : 0
  }));

  let totalGrantsAmount = 0;
  projects.forEach((p) => {
    let amt = p.disbursedAmount || p.sanctionedBudget || p.budget || 0;
    if (typeof amt === 'string') {
      amt = parseFloat(amt.replace(/[^0-9.]/g, '')) || 0;
    }
    totalGrantsAmount += amt;
  });
  const formattedGrants = totalGrantsAmount > 0 ? `₹ ${totalGrantsAmount.toLocaleString('en-IN')}` : '₹ 0';

  return {
    name: university?.name || 'University Innovation Portal',
    shortName: university?.shortName || code,
    district: university?.district || '',
    university: {
      code,
      name: university?.name || 'University Innovation Portal',
      shortName: university?.shortName || code,
      district: university?.district || '',
      nodalOfficer: university?.nodalOfficer || null
    },
    challenges: allChallenges,
    kpis: {
      assignedChallenges: { total: challengesRes.total || allChallenges.length, reviewNeeded: reviewNeededCount },
      activeProjects: { total: activeProjectsCount, delayed: delayedProjectsCount, onTrack: onTrackCount },
      facultyMentors: { total: facultyCount, active: facultyCount - onLeaveCount, onLeave: onLeaveCount },
      totalGrants: { value: formattedGrants, note: 'Total Disbursed Grants' },
      pendingApprovals: { total: pendingApprovalsCount, note: 'Requires action' },
      industryPartners: { total: partners.length, note: 'Active collaborations' }
    },
    pendingActions: [
      ...(reviewNeededCount > 0
        ? [{ id: 'pa-1', title: 'Challenges need review', count: reviewNeededCount, actionText: 'Review Now', actionType: 'review_challenges', variant: 'blue' }]
        : []),
      ...(pendingApprovalsCount > 0
        ? [{ id: 'pa-2', title: 'Approvals pending action', count: pendingApprovalsCount, actionText: 'Review Approvals', actionType: 'pending_approvals', variant: 'amber' }]
        : [])
    ],
    projectProgressBreakdown: { onTrack: onTrackCount, atRisk: atRiskCount, delayed: delayedProjectsCount, completed: completedCount, total: totalProj },
    projectProgress: {
      totalProjects: totalProj,
      total: totalProj,
      breakdown: [
        { status: 'On Track', count: onTrackCount, percentage: totalProj > 0 ? Math.round((onTrackCount / totalProj) * 100) : 0, color: '#0f172a' },
        { status: 'At Risk', count: atRiskCount, percentage: totalProj > 0 ? Math.round((atRiskCount / totalProj) * 100) : 0, color: '#64748b' },
        { status: 'Delayed', count: delayedProjectsCount, percentage: totalProj > 0 ? Math.round((delayedProjectsCount / totalProj) * 100) : 0, color: '#e11d48' },
        { status: 'Completed', count: completedCount, percentage: totalProj > 0 ? Math.round((completedCount / totalProj) * 100) : 0, color: '#10b981' }
      ]
    },
    topDomains,
    recentActivity: liveActivities,
    recentActivities: liveActivities
  };
}

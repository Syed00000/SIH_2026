export function formatIncomingRequests(liveFunds, fallbackReqs = []) {
  const mapReq = (r) => {
    const parts = [];
    if (r.fundingRequested) parts.push('Funding');
    if (r.labAccessRequested) parts.push('Testing & Lab');
    if (r.mentorshipRequested) parts.push('Mentorship');
    return {
      id: r.requestId || r._id,
      requestId: r.requestId,
      title: r.projectTitle || 'N/A',
      problemStatement: r.problemStatement || r.executionOutcome || '',
      challengeId: r.challengeId || '',
      executionOutcome: r.executionOutcome || '',
      duration: r.duration || '3 Months',
      university: r.universityName || r.universityCode || 'Ranchi University',
      universityCode: r.universityCode,
      required: parts.join(' + ') || (r.fundingRequested ? 'Funding Support' : 'Research Collaboration'),
      budget: r.estimatedBudget || '₹ 0',
      amountNumber: r.amountNumber || 0,
      status: r.status || 'Pending',
      faculty: r.facultyName || 'Faculty Nodal Officer',
      studentTeam: r.studentTeam || 'Student Research Team',
      labChargesQuoted: r.labChargesQuoted || '',
      quoteTerms: r.quoteTerms || '',
      quoteStatus: r.quoteStatus || '',
      testingStages: r.testingStages || [],
      labAccessRequested: r.labAccessRequested,
      fundingRequested: r.fundingRequested,
      date: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN') : 'Recent'
    };
  };

  const allRaw = [];
  const seenIds = new Set();
  const pushIfNotSeen = (r) => {
    const id = r.requestId || r._id;
    if (id && !seenIds.has(String(id))) {
      seenIds.add(String(id));
      allRaw.push(r);
    }
  };

  (liveFunds?.incomingRequests || []).forEach(pushIfNotSeen);
  (Array.isArray(fallbackReqs) ? fallbackReqs : []).forEach(pushIfNotSeen);
  return allRaw.map(mapReq);
}

export function extractActiveProjectsList(liveFunds, formattedRequests = []) {
  let activeProjectsList = [];

  if (Array.isArray(liveFunds?.activeProjects) && liveFunds.activeProjects.length > 0) {
    activeProjectsList = liveFunds.activeProjects
      .filter((p) => !p.labChargesQuoted || p.quoteStatus === 'Accepted')
      .map((p) => ({
        id: p.id || p.projectId,
        projectId: p.projectId,
        requestId: p.requestId || p.id,
        universityCode: p.universityCode || 'RU001',
        title: p.title,
        university: p.university,
        stage: p.stage || 'In Progress',
        budget: p.labChargesQuoted || p.budget || '₹ 0',
        disbursed: p.disbursed || '₹ 0',
        status: p.status || 'Active',
        leadMentor: p.leadMentor,
        studentTeam: p.studentTeam,
        problemStatement: p.problemStatement,
        labChargesQuoted: p.labChargesQuoted,
        quoteStatus: p.quoteStatus,
        quoteTerms: p.quoteTerms,
        testingStages: p.testingStages || []
      }));
  } else if (liveFunds?.availableUniversities?.length > 0) {
    liveFunds.availableUniversities.forEach((uni) => {
      (uni.activeProjects || []).forEach((proj) => {
        activeProjectsList.push({
          id: proj.id,
          projectId: proj.id,
          title: proj.title,
          university: uni.name,
          universityCode: uni.code || 'RU001',
          stage: proj.status || 'In Progress',
          budget: proj.sanctionedBudget || '₹ 0',
          disbursed: proj.disbursedAmount || '₹ 0',
          status: proj.disbursedAmount && proj.disbursedAmount !== '₹ 0' ? 'Funded' : 'Active',
          testingStages: proj.testingStages || []
        });
      });
    });
  }

  // An approved request appears in active projects ONLY when university accepts the fee quote
  formattedRequests
    .filter((r) => r.status === 'Approved' && (!r.labChargesQuoted || r.quoteStatus === 'Accepted'))
    .forEach((r) => {
      const found = activeProjectsList.some(
        (p) => (r.projectId && p.id === r.projectId) || p.title?.toLowerCase() === r.title?.toLowerCase()
      );
      if (!found) {
        activeProjectsList.push({
          id: r.projectId || r.requestId || r.id,
          projectId: r.projectId || r.requestId,
          requestId: r.requestId,
          title: r.title,
          university: r.university,
          universityCode: r.universityCode || 'RU001',
          stage: 'In Progress',
          budget: r.labChargesQuoted || r.budget || '₹ 0',
          disbursed: '₹ 0',
          status: 'Active',
          leadMentor: r.faculty,
          studentTeam: r.studentTeam,
          required: r.required,
          problemStatement: r.problemStatement,
          labChargesQuoted: r.labChargesQuoted,
          quoteStatus: r.quoteStatus,
          quoteTerms: r.quoteTerms,
          testingStages: r.testingStages || []
        });
      }
    });

  return activeProjectsList;
}

export default {
  formatIncomingRequests,
  extractActiveProjectsList
};

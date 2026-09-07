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
      declineReason: r.declineReason || r.quoteDeclineReason || '',
      testingStages: r.testingStages || [],
      labAccessRequested: r.labAccessRequested,
      fundingRequested: r.fundingRequested,
      pdfUrl: r.pdfUrl || r.prototypeData?.pdfUrl || '',
      pdfName: r.pdfName || r.prototypeData?.pdfName || '',
      prototypeData: r.prototypeData || null,
      purpose: r.purpose || r.collaborationPurpose || '',
      collaborationPurpose: r.collaborationPurpose || r.purpose || '',
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
  const activeProjectsList = [];
  const seenIds = new Set();

  const addIfEligible = (item) => {
    if (!item) return;
    const isFeeRequested = Boolean(item.labChargesQuoted && item.labChargesQuoted !== '₹ 0');
    // ONLY show in active projects and testing lab when university accepts fee request
    if (isFeeRequested && item.quoteStatus !== 'Accepted') {
      return;
    }
    const isApprovedStatus = item.status === 'Approved' || item.status === 'Active' || item.status === 'In Progress';
    if (!isApprovedStatus) {
      return;
    }

    const key = item.projectId || item.id;
    if (key && !seenIds.has(key)) {
      seenIds.add(key);
      activeProjectsList.push({
        id: item.id || item.projectId,
        projectId: item.projectId || item.id,
        requestId: item.requestId || item.id,
        universityCode: item.universityCode || 'RU001',
        title: item.title,
        university: item.university || item.universityName || 'Ranchi University',
        stage: item.stage || 'In Progress',
        budget: item.labChargesQuoted || item.budget || '₹ 0',
        disbursed: item.disbursed || item.disbursedAmount || '₹ 0',
        status: 'Active',
        leadMentor: item.leadMentor || item.faculty,
        studentTeam: item.studentTeam,
        problemStatement: item.problemStatement,
        labChargesQuoted: item.labChargesQuoted,
        quoteStatus: item.quoteStatus,
        quoteTerms: item.quoteTerms,
        pdfUrl: item.pdfUrl || item.prototypeData?.pdfUrl || '',
        pdfName: item.pdfName || item.prototypeData?.pdfName || '',
        testingStages: item.testingStages || [],
        purpose: item.purpose || item.collaborationPurpose || '',
        collaborationPurpose: item.collaborationPurpose || item.purpose || '',
        labAccessRequested: Boolean(item.labAccessRequested === true && item.collaborationPurpose !== 'Mentorship' && item.purpose !== 'Mentorship'),
        mentorshipRequested: Boolean(item.mentorshipRequested === true || item.collaborationPurpose === 'Mentorship' || item.purpose === 'Mentorship')
      });
    }
  };

  (liveFunds?.activeProjects || []).forEach(addIfEligible);
  (formattedRequests || []).forEach(addIfEligible);

  return activeProjectsList;
}

export default {
  formatIncomingRequests,
  extractActiveProjectsList
};

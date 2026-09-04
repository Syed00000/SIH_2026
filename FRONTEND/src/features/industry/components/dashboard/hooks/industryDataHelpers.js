export function formatIncomingRequests(liveFunds, fallbackReqs = []) {
  if (liveFunds?.incomingRequests && liveFunds.incomingRequests.length > 0) {
    return liveFunds.incomingRequests.map((r) => {
      const parts = [];
      if (r.fundingRequested) parts.push('Funding');
      if (r.labAccessRequested) parts.push('Testing & Lab');
      if (r.mentorshipRequested) parts.push('Mentorship');
      return {
        id: r.requestId || r._id,
        requestId: r.requestId,
        title: r.projectTitle || 'N/A',
        university: r.universityName || r.universityCode || 'Ranchi University',
        universityCode: r.universityCode,
        required: parts.join(' + ') || (r.fundingRequested ? 'Funding Support' : 'Research Collaboration'),
        budget: r.estimatedBudget || '₹ 0',
        amountNumber: r.amountNumber || 0,
        status: r.status || 'Pending',
        faculty: r.facultyName || 'Faculty Nodal Officer',
        studentTeam: r.studentTeam || 'Student Research Team',
        date: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN') : 'Recent'
      };
    });
  }

  if (Array.isArray(fallbackReqs)) {
    return fallbackReqs.map((r) => ({
      id: r.requestId || r._id,
      requestId: r.requestId,
      title: r.projectTitle || 'N/A',
      university: r.universityName || r.universityCode || 'Ranchi University',
      universityCode: r.universityCode,
      required: r.fundingRequested ? 'Funding Support' : 'Research Collaboration',
      budget: r.estimatedBudget || '₹ 0',
      status: r.status || 'Pending',
      faculty: r.facultyName || 'Faculty Nodal Officer',
      studentTeam: r.studentTeam || 'Student Research Team',
      date: r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN') : 'Recent'
    }));
  }

  return [];
}

export function extractActiveProjectsList(liveFunds, formattedRequests = []) {
  let activeProjectsList = [];

  if (Array.isArray(liveFunds?.activeProjects) && liveFunds.activeProjects.length > 0) {
    activeProjectsList = liveFunds.activeProjects.map((p) => ({
      id: p.id || p.projectId,
      projectId: p.projectId,
      title: p.title,
      university: p.university,
      stage: p.stage || 'In Progress',
      budget: p.budget || '₹ 0',
      disbursed: p.disbursed || '₹ 0',
      status: p.status || 'Active',
      leadMentor: p.leadMentor,
      studentTeam: p.studentTeam,
      problemStatement: p.problemStatement
    }));
  } else if (liveFunds?.availableUniversities?.length > 0) {
    liveFunds.availableUniversities.forEach((uni) => {
      (uni.activeProjects || []).forEach((proj) => {
        activeProjectsList.push({
          id: proj.id,
          projectId: proj.id,
          title: proj.title,
          university: uni.name,
          stage: proj.status || 'In Progress',
          budget: proj.sanctionedBudget || '₹ 0',
          disbursed: proj.disbursedAmount || '₹ 0',
          status: proj.disbursedAmount && proj.disbursedAmount !== '₹ 0' ? 'Funded' : 'Active'
        });
      });
    });
  }

  // Ensure any approved collaboration request is instantly in active projects
  formattedRequests
    .filter((r) => r.status === 'Approved')
    .forEach((r) => {
      const found = activeProjectsList.some(
        (p) => (r.projectId && p.id === r.projectId) || p.title?.toLowerCase() === r.title?.toLowerCase()
      );
      if (!found) {
        activeProjectsList.push({
          id: r.projectId || r.requestId || r.id,
          projectId: r.projectId || r.requestId,
          title: r.title,
          university: r.university,
          stage: 'In Progress',
          budget: r.budget || '₹ 0',
          disbursed: '₹ 0',
          status: 'Active',
          leadMentor: r.faculty,
          studentTeam: r.studentTeam,
          required: r.required
        });
      }
    });

  return activeProjectsList;
}

export default {
  formatIncomingRequests,
  extractActiveProjectsList
};

export function buildProjectStubFromCitizenChallenge(chl, code) {
  const mentor = chl.assignedUniversity?.mentorName || chl.assignedFaculty?.name || null;
  const dept = chl.assignedUniversity?.department || chl.assignedFaculty?.department || 'Engineering & Technology';

  return {
    projectId: `PRJ-${chl.challengeId?.replace(/[^0-9]/g, '') || Math.floor(1000 + Math.random() * 9000)}`,
    challengeId: chl.challengeId,
    universityCode: code,
    title: chl.title,
    problemStatement: chl.description || chl.problemStatement || chl.title,
    domain: chl.domain || chl.category || 'General',
    estimatedCost: chl.estimatedCost || null,
    sanctionedBudget: chl.sanctionedBudget || null,
    budget: chl.sanctionedBudget ? (typeof chl.sanctionedBudget === 'number' ? `₹ ${chl.sanctionedBudget.toLocaleString('en-IN')}` : chl.sanctionedBudget) : 'N/A',
    budgetStatus: chl.budgetStatus || 'Pending Proposal',
    leadMentor: mentor || 'Unassigned',
    facultyMentor: mentor ? { name: mentor, department: dept, designation: 'Lead Faculty Mentor' } : null,
    status: chl.status === 'Resolved' ? 'Completed' : (chl.status === 'Active R&D' ? 'In Progress' : 'Proposal Stage'),
    milestonesCompleted: mentor ? 2 : 1,
    milestonesTotal: 7,
    progressPercentage: chl.status === 'Resolved' ? 100 : Math.round(((mentor ? 2 : 1) / 7) * 100),
    deadline: 'N/A',
    timeline: 'N/A',
    daysLeft: 'N/A',
    teamMembers: [],
    documents: [],
    recentActivity: [],
    isDeleted: false,
    milestones: [
      { id: 1, title: 'Problem Statement Allocated & Scoped', status: 'Completed', dueDate: 'N/A', completedAt: chl.createdAt || new Date() },
      { id: 2, title: mentor ? `Lead Faculty Mentor Assigned (${mentor})` : 'Lead Faculty Mentor Assignment', status: mentor ? 'Completed' : 'In Progress', dueDate: 'N/A', completedAt: mentor ? new Date() : null },
      { id: 3, title: 'Faculty Solution Analysis & Budget Proposal', status: mentor ? 'In Progress' : 'Pending', dueDate: 'N/A' },
      { id: 4, title: 'University Review & Submission to Government', status: 'Pending', dueDate: 'N/A' },
      { id: 5, title: 'Government Budget Sanction & Grant Disbursal', status: 'Pending', dueDate: 'N/A' },
      { id: 6, title: 'Prototype Development & Field Testing', status: 'Pending', dueDate: 'N/A' },
      { id: 7, title: 'Government Handover & Final Audit', status: 'Pending', dueDate: 'N/A' }
    ]
  };
}

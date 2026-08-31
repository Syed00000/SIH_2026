export function buildAssignedProjectMilestones(existingProj, facultyInfo) {
  const milestones = existingProj?.milestones?.length
    ? existingProj.milestones.map((m, idx) => {
      if (idx === 0) return { ...m, status: 'Completed', completedAt: m.completedAt || new Date() };
      if (idx === 1) return { ...m, status: 'Completed', title: `Lead Faculty Mentor Assigned (${facultyInfo.name})`, completedAt: new Date() };
      if (idx === 2 && m.status !== 'Completed') return { ...m, status: 'In Progress' };
      return m;
    })
    : [
      { id: 1, title: 'Problem Statement Allocated & Scoped', status: 'Completed', dueDate: 'N/A', completedAt: new Date() },
      { id: 2, title: `Lead Faculty Mentor Assigned (${facultyInfo.name})`, status: 'Completed', dueDate: 'N/A', completedAt: new Date() },
      { id: 3, title: 'Faculty Solution Analysis & Budget Proposal', status: 'In Progress', dueDate: 'N/A' },
      { id: 4, title: 'University Review & Submission to Government', status: 'Pending', dueDate: 'N/A' },
      { id: 5, title: 'Government Budget Sanction & Grant Disbursal', status: 'Pending', dueDate: 'N/A' },
      { id: 6, title: 'Prototype Development & Field Testing', status: 'Pending', dueDate: 'N/A' },
      { id: 7, title: 'Government Handover & Final Audit', status: 'Pending', dueDate: 'N/A' }
    ];

  const completedCount = milestones.filter((m) => m.status === 'Completed' || m.status === 'COMPLETED').length;
  const progressPercentage = Math.round((completedCount / (milestones.length || 7)) * 100);

  return { milestones, completedCount, progressPercentage };
}

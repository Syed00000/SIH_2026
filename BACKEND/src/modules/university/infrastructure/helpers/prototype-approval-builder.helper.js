export function buildPrototypeApprovalDocument({ code, project, prototypeData }) {
  return {
    approvalId: `APP-PROTO-${Date.now()}`,
    universityCode: code,
    title: 'Prototype Blueprint Review',
    type: 'Prototype Approval',
    project: project.title,
    projectId: project.projectId,
    challengeId: project.challengeId,
    requestedBy: prototypeData.facultyName || prototypeData.facultyEmail || project.leadMentor || 'Faculty Mentor',
    teamName: project.teamName || project.studentTeam || null,
    teamMembersCount: Array.isArray(project.teamMembers) ? project.teamMembers.length : null,
    faculty: project.facultyMentor || { name: prototypeData.facultyName, email: prototypeData.facultyEmail },
    team: {
      name: project.teamName || project.studentTeam || null,
      membersCount: Array.isArray(project.teamMembers) ? project.teamMembers.length : null,
      members: Array.isArray(project.teamMembers) ? project.teamMembers.map((m) => ({ name: m.name, role: m.role })) : []
    },
    date: new Date(),
    status: 'Pending',
    metadata: {
      prototypeContent: prototypeData.content,
      phases: prototypeData.phases || null,
      timeline: prototypeData.timeline
    },
    history: [{
      action: 'Prototype Submitted',
      performedBy: prototypeData.facultyName || prototypeData.facultyEmail || project.leadMentor || 'Faculty Mentor',
      timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      note: 'Prototype blueprint submitted for university technical evaluation.'
    }]
  };
}

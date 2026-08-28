// All mock and dummy data has been removed.
// The application now exclusively consumes live data from the MongoDB Atlas database via the backend API.

export const FALLBACK_FACULTY = [];
export const FALLBACK_PROJECTS = [];
export const FALLBACK_UNIVERSITY_DASHBOARD = {
  kpis: {
    assignedChallenges: { total: 0, reviewNeeded: 0 },
    activeProjects: { total: 0, delayed: 0 },
    facultyMentors: { total: 0, onLeave: 0 },
    pendingApprovals: { total: 0 },
    industryPartners: { total: 0 }
  },
  challenges: [],
  projects: [],
  faculty: []
};

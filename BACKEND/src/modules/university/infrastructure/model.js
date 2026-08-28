import mongoose from 'mongoose';

const universityChallengeSchema = new mongoose.Schema(
  {
    challengeId: { type: String, required: true, index: true },
    universityCode: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    domain: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    status: { type: String, default: 'Review', index: true },
    assignedOn: { type: Date, default: Date.now },
    deadline: { type: String, default: '27 May 2026 (7 days left)' },
    problemStatement: { type: String, default: '' },
    affectedPopulation: { type: String, default: '~ 12,500 People' },
    aiCategory: { type: String, default: 'Water Quality & Monitoring' },
    requiredSkills: [{ type: String }],
    governmentRemarks: { type: String, default: '' },
    suggestedFaculty: { name: String, department: String, matchScore: String },
    locationDetails: { block: String, villages: [String], coordinates: String },
    assignedFaculty: { id: String, name: String, department: String, email: String },
    actionLabel: { type: String, default: 'Review' },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedBy: { type: String, default: null },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true, collection: 'university_challenges' }
);

const universityProjectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, index: true },
    challengeId: { type: String, default: 'CHL-1024', index: true },
    universityCode: { type: String, required: true, index: true },
    title: { type: String, required: true },
    domain: { type: String, required: true, index: true },
    status: { type: String, default: 'In Progress', index: true },
    progressPercentage: { type: Number, default: 0 },
    leadMentor: { type: String, required: true },
    facultyMentor: {
      name: { type: String, default: 'Dr. Priya Sharma' },
      department: { type: String, default: 'Water Resources Engineering' },
      email: { type: String, default: 'priya.sharma@ru.ac.in' }
    },
    studentTeam: { type: String, default: 'Smart Aqua Innovators' },
    teamMembersCount: { type: Number, default: 5 },
    teamMembers: { type: Array, default: [] },
    problemStatement: { type: String, default: '' },
    budget: { type: String, default: '₹ 75,000' },
    startDate: { type: String, default: '20 May 2026' },
    deadline: { type: String, default: '30 Nov 2026' },
    daysLeft: { type: String, default: '192 days left' },
    milestonesTotal: { type: Number, default: 7 },
    milestonesCompleted: { type: Number, default: 3 },
    milestones: { type: Array, default: [] },
    documents: { type: Array, default: [] },
    recentActivity: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedBy: { type: String, default: null },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true, collection: 'university_projects' }
);

const universityFacultySchema = new mongoose.Schema(
  {
    universityCode: { type: String, required: true, index: true },
    name: { type: String, required: true },
    designation: { type: String, default: 'Professor' },
    department: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '+91 98765 43210' },
    specialization: [String],
    experience: { type: String, default: '10 Years' },
    qualification: { type: String, default: 'Ph.D. in Engineering' },
    researchAreas: [String],
    totalProjects: { active: { type: Number, default: 2 }, completed: { type: Number, default: 5 } },
    currentLoad: { type: Number, default: 2 },
    availabilityStatus: { type: String, enum: ['Available', 'In Project', 'On Leave'], default: 'Available' },
    bio: { type: String, default: '' },
    assignedChallenges: [{ challengeId: String, title: String, role: { type: String, default: 'Primary Mentor' } }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true, collection: 'university_faculty' }
);

const universityTeamSchema = new mongoose.Schema(
  {
    teamCode: { type: String, required: true, index: true },
    universityCode: { type: String, required: true, index: true },
    name: { type: String, required: true },
    leader: { type: String, required: true },
    membersCount: { type: Number, default: 4 },
    members: { type: Array, default: [] },
    project: { type: String, default: 'Unassigned' },
    mentor: { type: String, default: 'Unassigned' },
    nepCredits: { type: String, default: '4 Credits' },
    status: { type: String, enum: ['Active', 'Forming', 'Completed'], default: 'Active' }
  },
  { timestamps: true, collection: 'university_teams' }
);

const universityPartnerSchema = new mongoose.Schema(
  {
    partnerId: { type: String, required: true, index: true },
    universityCode: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, default: 'CSR Partner' },
    grantAmount: { type: String, default: '₹25.0 Lakhs' },
    committedGrant: { type: String, default: '₹25.0 Lakhs' },
    focusArea: { type: String, default: 'Water Management' },
    mouStatus: { type: String, default: 'Active' },
    activePilots: { type: Number, default: 1 }
  },
  { timestamps: true, collection: 'university_partners' }
);

const universityApprovalSchema = new mongoose.Schema(
  {
    approvalId: { type: String, required: true, index: true },
    universityCode: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, default: 'Project Approval' },
    project: { type: String, required: true },
    challengeId: { type: String, default: '' },
    requestedBy: { type: String, required: true },
    requestedByDept: { type: String, default: 'Water Resources Engineering' },
    requestedByAvatar: { type: String, default: '' },
    date: { type: String, default: '20 May 2026' },
    dateTime: { type: String, default: '10:30 AM' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Changes Required'], default: 'Pending' },
    faculty: { name: String, department: String },
    team: { name: String, membersCount: { type: Number, default: 5 } },
    startDate: { type: String, default: '20 May 2026' },
    estimatedBudget: { type: String, default: '₹ 75,000' },
    supportTypes: [{ type: String }],
    documentsCount: { type: Number, default: 4 },
    adminRemarks: { type: String, default: '' },
    history: [
      {
        action: String,
        performedBy: String,
        timestamp: String,
        note: String
      }
    ]
  },
  { timestamps: true, collection: 'university_approvals' }
);

const universityActivitySchema = new mongoose.Schema(
  {
    universityCode: { type: String, required: true, index: true },
    text: { type: String, required: true },
    type: { type: String, default: 'info' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true, collection: 'university_activities' }
);

export const UniversityChallenge = mongoose.models.UniversityChallenge || mongoose.model('UniversityChallenge', universityChallengeSchema);
export const UniversityProject = mongoose.models.UniversityProject || mongoose.model('UniversityProject', universityProjectSchema);
export const UniversityFaculty = mongoose.models.UniversityFaculty || mongoose.model('UniversityFaculty', universityFacultySchema);
export const UniversityTeam = mongoose.models.UniversityTeam || mongoose.model('UniversityTeam', universityTeamSchema);
export const UniversityPartner = mongoose.models.UniversityPartner || mongoose.model('UniversityPartner', universityPartnerSchema);
export const UniversityApproval = mongoose.models.UniversityApproval || mongoose.model('UniversityApproval', universityApprovalSchema);
export const UniversityActivity = mongoose.models.UniversityActivity || mongoose.model('UniversityActivity', universityActivitySchema);

export default {
  UniversityChallenge, UniversityProject, UniversityFaculty, UniversityTeam, UniversityPartner, UniversityApproval, UniversityActivity
};

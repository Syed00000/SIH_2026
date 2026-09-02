import mongoose from 'mongoose';

export const universityChallengeSchema = new mongoose.Schema(
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

export const universityProjectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true, index: true },
    challengeId: { type: String, default: 'CHL-1024', index: true },
    universityCode: { type: String, required: true, index: true },
    title: { type: String, required: true },
    domain: { type: String, required: true, index: true },
    status: { type: String, default: 'Proposal Stage', index: true },
    progressPercentage: { type: Number, default: 14 },
    leadMentor: { type: String, required: true },
    facultyMentor: {
      name: { type: String, default: 'Lead Faculty Mentor' },
      department: { type: String, default: 'Engineering' },
      email: { type: String, default: '' }
    },
    studentTeam: { type: String, default: 'Student Research Team' },
    studentLead: { type: String, default: '' },
    teamMembersCount: { type: Number, default: 0 },
    teamMembers: { type: Array, default: [] },
    problemStatement: { type: String, default: '' },
    methodology: { type: String, default: '' },
    budget: { type: String, default: 'N/A' },
    proposedBudget: { type: String, default: '' },
    budgetBreakdown: { type: Array, default: [] },
    budgetStatus: { type: String, default: 'Proposal Stage' },
    sanctionedBudget: { type: String, default: '' },
    startDate: { type: String, default: '20 May 2026' },
    deadline: { type: String, default: '30 Nov 2026' },
    daysLeft: { type: String, default: '192 days left' },
    milestonesTotal: { type: Number, default: 7 },
    milestonesCompleted: { type: Number, default: 1 },
    milestones: { type: Array, default: [] },
    documents: { type: Array, default: [] },
    recentActivity: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedBy: { type: String, default: null },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true, collection: 'university_projects', strict: false }
);

universityProjectSchema.index({ universityCode: 1, isDeleted: 1, updatedAt: -1 });

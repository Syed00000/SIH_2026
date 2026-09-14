import mongoose from 'mongoose';

export const universityFacultySchema = new mongoose.Schema(
  {
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', default: null, index: true },
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
    activeProjects: { type: Number, default: 1 },
    completedProjects: { type: Number, default: 3 },
    totalProjects: { active: { type: Number, default: 1 }, completed: { type: Number, default: 3 } },
    currentLoad: { type: Number, default: 1 },
    availabilityStatus: { type: String, enum: ['Available', 'In Project', 'On Leave', 'Inactive'], default: 'Available' },
    bio: { type: String, default: '' },
    passwordHash: { type: String, default: null },
    password: { type: String, default: null },
    generatedPassword: { type: String, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    assignedChallenges: [{ challengeId: String, title: String, role: { type: String, default: 'Primary Mentor' } }],
    status: { type: String, enum: ['Active', 'Inactive', 'Removed'], default: 'Active' },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true, collection: 'university_faculty' }
);

universityFacultySchema.index({ universityCode: 1, email: 1 }, { unique: true });
universityFacultySchema.index({ universityCode: 1, name: 1 }, { unique: true });

export const universityTeamSchema = new mongoose.Schema(
  {
    teamCode: { type: String, required: true, index: true },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', default: null, index: true },
    universityCode: { type: String, required: true, index: true },
    name: { type: String, required: true },
    leader: { type: String, default: 'Student Lead' },
    membersCount: { type: Number, default: 0 },
    members: { type: Array, default: [] },
    projectId: { type: String, default: '', index: true },
    challengeId: { type: String, default: '', index: true },
    projectTitle: { type: String, default: '' },
    project: { type: String, default: 'Unassigned' },
    mentor: { type: String, default: 'Unassigned' },
    facultyMentorName: { type: String, default: '' },
    mentorStatus: { type: String, default: 'Active' },
    mentorNotes: { type: String, default: '' },
    department: { type: String, default: 'Engineering' },
    nepCredits: { type: String, default: '4 Credits' },
    status: { type: String, enum: ['Active', 'Forming', 'Completed', 'Archived'], default: 'Active' },
    archiveReason: { type: String, default: '' }
  },
  { timestamps: true, collection: 'university_teams' }
);

universityTeamSchema.index({ universityCode: 1, projectId: 1 });

export default { universityFacultySchema, universityTeamSchema };

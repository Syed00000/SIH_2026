import mongoose from 'mongoose';

export const universityFacultySchema = new mongoose.Schema(
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
    activeProjects: { type: Number, default: 1 },
    completedProjects: { type: Number, default: 3 },
    totalProjects: { active: { type: Number, default: 1 }, completed: { type: Number, default: 3 } },
    currentLoad: { type: Number, default: 1 },
    availabilityStatus: { type: String, enum: ['Available', 'In Project', 'On Leave'], default: 'Available' },
    bio: { type: String, default: '' },
    passwordHash: { type: String, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedChallenges: [{ challengeId: String, title: String, role: { type: String, default: 'Primary Mentor' } }],
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true, collection: 'university_faculty' }
);

universityFacultySchema.index({ universityCode: 1, email: 1 }, { unique: true });
universityFacultySchema.index({ universityCode: 1, name: 1 }, { unique: true });

export const universityTeamSchema = new mongoose.Schema(
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

import mongoose from 'mongoose';

const assignedProblemSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true },
    projectId: { type: String, default: '' },
    challengeId: { type: String, default: '' },
    problemTitle: { type: String, required: true },
    problemStatement: { type: String, default: '' },
    universityCode: { type: String, default: 'RU001' },
    universityName: { type: String, default: 'Ranchi University' },
    studentTeam: { type: String, default: '' },
    leadMentor: { type: String, default: '' },
    assignedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const industryExpertSchema = new mongoose.Schema(
  {
    expertId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    industryId: { type: String, default: 'IND-DEFAULT', index: true },
    industryName: { type: String, default: 'Ariba Research Labs', index: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ['Available', 'Assigned', 'On Leave'],
      default: 'Available',
      index: true
    },
    bio: { type: String, default: '' },
    assignedProblems: { type: [assignedProblemSchema], default: [] }
  },
  {
    timestamps: true,
    collection: 'industry_experts'
  }
);

industryExpertSchema.index({ industryName: 1, status: 1 });

export const IndustryExpert =
  mongoose.models.IndustryExpert || mongoose.model('IndustryExpert', industryExpertSchema);

export default IndustryExpert;

import mongoose from 'mongoose';

export const universityActivitySchema = new mongoose.Schema(
  {
    universityCode: { type: String, required: true, index: true },
    text: { type: String, required: true },
    type: { type: String, default: 'info' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true, collection: 'university_activities' }
);

export const universityIndustryRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, index: true },
    universityCode: { type: String, required: true, index: true },
    projectTitle: { type: String, required: true },
    projectId: { type: String, default: '' },
    partnerId: { type: String, default: '' },
    partnerName: { type: String, required: true },
    partnerEmail: { type: String, default: '' },
    fundingRequested: { type: Boolean, default: true },
    labAccessRequested: { type: Boolean, default: false },
    mentorshipRequested: { type: Boolean, default: true },
    estimatedBudget: { type: String, default: '' },
    duration: { type: String, default: '3 Months' },
    executionOutcome: { type: String, default: '' },
    facultyName: { type: String, default: '' },
    studentTeam: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Under Evaluation'], default: 'Pending' },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, collection: 'university_industry_requests', strict: false }
);

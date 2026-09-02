import mongoose from 'mongoose';

export const universityPartnerSchema = new mongoose.Schema(
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

export const universityApprovalSchema = new mongoose.Schema(
  {
    approvalId: { type: String, required: true, index: true },
    universityId: { type: mongoose.Schema.Types.ObjectId, ref: 'University', default: null, index: true },
    universityCode: { type: String, required: true, index: true },
    title: { type: String, required: true },
    type: { type: String, default: 'R&D Grant Proposal' },
    project: { type: String, required: true },
    projectId: { type: String, default: '' },
    challengeId: { type: String, default: '' },
    requestedBy: { type: String, required: true },
    requestedByDept: { type: String, default: 'Engineering' },
    requestedByAvatar: { type: String, default: '' },
    date: { type: String, default: '20 May 2026' },
    dateTime: { type: String, default: '10:30 AM' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Changes Required'], default: 'Pending' },
    faculty: { name: String, department: String },
    team: { name: String, membersCount: { type: Number, default: 4 } },
    startDate: { type: String, default: '20 May 2026' },
    estimatedBudget: { type: String, default: 'N/A' },
    proposedBudget: { type: String, default: '' },
    methodology: { type: String, default: '' },
    budgetBreakdown: { type: Array, default: [] },
    supportTypes: [{ type: String }],
    documentsCount: { type: Number, default: 2 },
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
  { timestamps: true, collection: 'university_approvals', strict: false }
);

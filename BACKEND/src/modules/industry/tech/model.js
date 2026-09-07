import mongoose from 'mongoose';

const allocatedProjectSchema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    challengeId: { type: String, default: '' },
    projectTitle: { type: String, required: true },
    universityCode: { type: String, default: 'RU001' },
    universityName: { type: String, default: 'Ranchi University' },
    studentTeam: { type: String, default: '' },
    accessCredentials: { type: String, default: '' },
    validity: { type: String, default: '1 Year R&D Access' },
    grantedAt: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  },
  { _id: false }
);

const industryTechToolSchema = new mongoose.Schema(
  {
    toolId: {
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
    category: {
      type: String,
      default: 'Hardware & Simulation'
    },
    version: { type: String, default: 'v1.0 Enterprise' },
    techStackTags: [{ type: String, trim: true }],
    licenseType: {
      type: String,
      default: 'Commercial Lab License'
    },
    description: { type: String, default: '' },
    accessInstructions: { type: String, default: '' },
    supportLevel: { type: String, default: 'Dedicated Technical Assistance' },
    status: {
      type: String,
      enum: ['Available', 'Allocated', 'Maintenance'],
      default: 'Available',
      index: true
    },
    allocatedProjects: { type: [allocatedProjectSchema], default: [] }
  },
  {
    timestamps: true,
    collection: 'industry_tech_tools'
  }
);

industryTechToolSchema.index({ industryName: 1, status: 1 });

export const IndustryTechTool =
  mongoose.models.IndustryTechTool || mongoose.model('IndustryTechTool', industryTechToolSchema);

export default IndustryTechTool;

import mongoose from 'mongoose';

const industryFundSchema = new mongoose.Schema(
  {
    fundId: { type: String, required: true, unique: true, index: true },
    industryId: { type: String, default: 'IND-DEFAULT', index: true },
    industryName: { type: String, default: 'Ariba Research Labs' },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Research Funding', 'Prototype Funding', 'Lab & Equipment', 'Pilot Funding', 'CSR Support'],
      default: 'Research Funding'
    },
    allocatedAmount: { type: Number, required: true },
    utilizedAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, required: true },
    financialYear: { type: String, default: '2026-2027' },
    sanctionOrderNo: { type: String, default: '' },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Depleted', 'Closed'], default: 'Active', index: true }
  },
  { timestamps: true, collection: 'industry_funds' }
);

export const IndustryFund =
  mongoose.models.IndustryFund || mongoose.model('IndustryFund', industryFundSchema);

const industryDisbursementSchema = new mongoose.Schema(
  {
    disbursementId: { type: String, required: true, unique: true, index: true },
    fundId: { type: String, required: true, index: true },
    fundTitle: { type: String, required: true },
    category: { type: String, required: true },
    industryId: { type: String, default: 'IND-DEFAULT', index: true },
    industryName: { type: String, default: 'Ariba Research Labs' },
    universityCode: { type: String, required: true, index: true },
    universityName: { type: String, required: true },
    projectId: { type: String, default: '' },
    projectTitle: { type: String, required: true },
    requestId: { type: String, default: '', index: true },
    amount: { type: Number, required: true },
    mode: { type: String, default: 'Direct Corporate Escrow' },
    utrNumber: { type: String, required: true, index: true },
    purpose: { type: String, default: 'University R&D Project Funding' },
    status: { type: String, enum: ['Disbursed', 'Approved', 'Pending'], default: 'Disbursed' },
    disbursedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, collection: 'industry_disbursements' }
);

export const IndustryDisbursement =
  mongoose.models.IndustryDisbursement || mongoose.model('IndustryDisbursement', industryDisbursementSchema);

export default { IndustryFund, IndustryDisbursement };

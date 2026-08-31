import mongoose from 'mongoose';

const governmentGrantFundSchema = new mongoose.Schema(
  {
    fundId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    scheme: { type: String, default: 'Jharkhand State Innovation Council R&D Allocation' },
    department: { type: String, default: 'Department of Higher & Technical Education' },
    amount: { type: Number, required: true },
    sanctionOrderNo: { type: String, default: '' },
    financialYear: { type: String, default: '2026-2027' },
    allocationDate: { type: Date, default: Date.now },
    allocatedBy: { type: String, default: 'Principal Secretary, Govt of Jharkhand' },
    description: { type: String, default: '' },
    status: { type: String, default: 'Active', index: true }
  },
  { timestamps: true, collection: 'government_grant_funds' }
);

export const GovernmentGrantFund =
  mongoose.models.GovernmentGrantFund ||
  mongoose.model('GovernmentGrantFund', governmentGrantFundSchema);

export default GovernmentGrantFund;

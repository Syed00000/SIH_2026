import mongoose from 'mongoose';

const departmentGrantRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true, index: true },
    requesterDeptId: { type: String, required: true, index: true },
    requesterName: { type: String, required: true },
    requesterCategory: {
      type: String,
      required: true,
      enum: ['Ward Commissioner', 'Block / Tehsil Office', 'District Department']
    },
    targetDeptId: { type: String, required: true, index: true },
    targetName: { type: String, required: true },
    targetCategory: {
      type: String,
      required: true,
      enum: ['Block / Tehsil Office', 'District Department', 'State Ministry']
    },
    tier: {
      type: String,
      required: true,
      enum: ['WARD_TO_BLOCK', 'BLOCK_TO_DISTRICT', 'DISTRICT_TO_STATE', 'WARD_TO_DISTRICT', 'WARD_TO_STATE', 'BLOCK_TO_STATE']
    },
    district: { type: String, default: 'Ranchi' },
    block: { type: String, default: '' },
    wardId: { type: String, default: '' },
    requestedAmount: { type: Number, required: true },
    sanctionedAmount: { type: Number, default: 0 },
    purpose: { type: String, required: true },
    sector: { type: String, default: 'Civic Infrastructure' },
    justification: { type: String, default: '' },
    priority: { type: String, enum: ['Normal', 'High', 'Urgent', 'Emergency SOS'], default: 'Normal' },
    isEmergency: { type: Boolean, default: false, index: true },
    emergencyType: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Granted', 'Rejected'],
      default: 'Pending',
      index: true
    },
    utrNumber: { type: String, default: '' },
    grantedAt: { type: Date, default: null },
    grantedBy: { type: String, default: '' },
    grantRemarks: { type: String, default: '' },
    rejectionReason: { type: String, default: '' }
  },
  { timestamps: true, collection: 'department_grant_requests' }
);

export const DepartmentGrantRequest =
  mongoose.models.DepartmentGrantRequest ||
  mongoose.model('DepartmentGrantRequest', departmentGrantRequestSchema);

export default DepartmentGrantRequest;

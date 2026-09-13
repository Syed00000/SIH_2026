import mongoose from 'mongoose';

const departmentGrantRequestSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, unique: true, index: true },
    requesterDeptId: { type: String, required: true, index: true },
    requesterName: { type: String, required: true },
    requesterCategory: {
      type: String,
      required: true,
      default: 'State Ministry'
    },
    targetDeptId: { type: String, required: true, index: true },
    targetName: { type: String, required: true },
    targetCategory: {
      type: String,
      required: true,
      default: 'State Ministry'
    },
    tier: {
      type: String,
      default: 'DISTRICT_TO_STATE'
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

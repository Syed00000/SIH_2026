import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    module: { type: String, required: true, default: 'Department' },
    recordId: { type: String, required: true },
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String, default: 'unknown' },
    status: { type: String, default: 'Success' }
  },
  {
    timestamps: true,
    collection: 'audit_logs'
  }
);

auditSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditSchema);
export default AuditLog;

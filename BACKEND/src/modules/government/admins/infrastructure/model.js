import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, lowercase: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    passwordHash: { type: String, select: false },
    mobileNumber: { type: String, required: true, trim: true },
    role: { type: String, required: true, default: 'Nodal Officer' },
    primaryRole: { type: String, default: 'District Nodal Lead' },
    accessLevel: { type: String, default: 'District Level Access' },
    district: { type: String, required: true, default: 'Ranchi' },
    assignedDepartment: { type: String, default: 'Higher & Technical Education' },
    employeeId: { type: String, default: null, trim: true },
    dateOfJoining: { type: Date, default: Date.now },
    address: { type: String, default: null, trim: true },
    status: {
      type: String,
      enum: ['Active', 'Suspended', 'Restricted', 'Removed'],
      default: 'Active',
      index: true
    },
    avatarColor: { type: String, default: 'purple' },
    lastLogin: { type: String, default: 'Never logged in' }
  },
  {
    timestamps: true,
    collection: 'admins'
  }
);

adminSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
export const MongooseAdmin = Admin;
export default Admin;

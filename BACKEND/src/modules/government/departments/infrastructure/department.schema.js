import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    deptId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    category: {
      type: String,
      enum: ['State Ministry', 'District Department', 'Block / Tehsil Office', 'Gram Panchayat'],
      default: 'District Department',
      index: true
    },
    headName: {
      type: String,
      default: null,
      trim: true
    },
    headRole: {
      type: String,
      default: 'Department Head',
      trim: true
    },
    headEmail: {
      type: String,
      default: null,
      trim: true,
      lowercase: true
    },
    headPhone: {
      type: String,
      default: null,
      trim: true
    },
    district: {
      type: String,
      required: true,
      default: 'Ranchi',
      index: true
    },
    block: {
      type: String,
      default: '',
      trim: true
    },
    panchayat: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    credentials: {
      loginId: { type: String, trim: true },
      loginEmail: { type: String, lowercase: true, trim: true },
      password: { type: String, default: null },
      generatedPassword: { type: String, default: null }
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Archived'],
      default: 'Active',
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'departments'
  }
);

departmentSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
export default Department;

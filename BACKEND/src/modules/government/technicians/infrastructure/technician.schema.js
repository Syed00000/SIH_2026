import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema(
  {
    technicianId: {
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
    departmentId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    departmentName: {
      type: String,
      default: '',
      trim: true
    },
    specialization: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      default: '',
      trim: true
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true
    },
    district: {
      type: String,
      default: 'Ranchi',
      trim: true
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
    credentials: {
      loginId: { type: String, trim: true },
      loginEmail: { type: String, lowercase: true, trim: true },
      password: { type: String, default: null },
      generatedPassword: { type: String, default: null }
    },
    status: {
      type: String,
      enum: ['Active', 'On Field', 'Inactive'],
      default: 'Active',
      index: true
    },
    assignedChallengesCount: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    allocatedSalaryPool: {
      type: Number,
      default: 0,
      min: 0
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    collection: 'department_technicians'
  }
);

technicianSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const Technician = mongoose.models.Technician || mongoose.model('Technician', technicianSchema);
export default Technician;

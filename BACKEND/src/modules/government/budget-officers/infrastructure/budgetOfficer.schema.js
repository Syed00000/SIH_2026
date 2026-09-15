import mongoose from 'mongoose';

const budgetOfficerSchema = new mongoose.Schema(
  {
    officerId: {
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
    designation: {
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
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
      index: true
    },
    tasksCompleted: {
      type: Number,
      default: 0
    },
    pendingTasks: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'department_budget_officers'
  }
);

budgetOfficerSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const BudgetOfficer = mongoose.models.BudgetOfficer || mongoose.model('BudgetOfficer', budgetOfficerSchema);
export default BudgetOfficer;

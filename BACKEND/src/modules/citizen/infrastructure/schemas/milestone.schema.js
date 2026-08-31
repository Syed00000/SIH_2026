import mongoose from 'mongoose';

export const milestoneSchema = new mongoose.Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'CURRENT', 'COMPLETED', 'REJECTED'],
      default: 'PENDING'
    },
    updatedBy: { type: String, default: 'Department Admin' },
    remarks: { type: String, default: '' },
    completedAt: { type: Date, default: null }
  },
  { _id: false }
);

export default milestoneSchema;

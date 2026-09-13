import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    departmentId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: { type: String, enum: ['Unread', 'Read', 'Archived'], default: 'Unread' },
    actionUrl: { type: String, default: null }
  },
  {
    timestamps: true,
    collection: 'department_notifications'
  }
);

notificationSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const DepartmentNotification = mongoose.models.DepartmentNotification || mongoose.model('DepartmentNotification', notificationSchema);
export default DepartmentNotification;

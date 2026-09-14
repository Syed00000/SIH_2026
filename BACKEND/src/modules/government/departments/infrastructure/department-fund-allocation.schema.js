import mongoose from 'mongoose';

const departmentFundAllocationSchema = new mongoose.Schema(
  {
    allocationId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    deptId: {
      type: String,
      required: true,
      index: true
    },
    departmentName: {
      type: String,
      required: true,
      trim: true
    },
    departmentCategory: {
      type: String,
      enum: ['State Ministry', 'District Department', 'Block / Tehsil Office', 'Gram Panchayat', 'Ward Commissioner'],
      default: 'State Ministry',
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    allocationType: {
      type: String,
      enum: ['STATE_GRANT', 'INTER_DEPT_TRANSFER', 'GRANT_REQUISITION', 'DIRECT_TOPUP'],
      default: 'STATE_GRANT',
      index: true
    },
    sourceDeptId: {
      type: String,
      default: 'STATE_GOV',
      index: true
    },
    sourceDeptName: {
      type: String,
      default: 'Government of Jharkhand (State Treasury)'
    },
    sourceDeptCategory: {
      type: String,
      default: 'State Government'
    },
    previousBalance: {
      type: Number,
      default: 0
    },
    newBalance: {
      type: Number,
      default: 0
    },
    sanctionOrderNo: {
      type: String,
      default: ''
    },
    scheme: {
      type: String,
      default: 'Jharkhand State Innovation Council Grant'
    },
    purpose: {
      type: String,
      default: 'Departmental Civic & Innovation Fund'
    },
    allocatedBy: {
      type: String,
      default: 'State Authority'
    },
    status: {
      type: String,
      enum: ['Active', 'Reverted', 'Deleted'],
      default: 'Active',
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'department_fund_allocations'
  }
);

// Automatic hook: When an allocation document is deleted via Mongoose,
// deduct the allocated amount from the department's pool so the amount is reverted!
departmentFundAllocationSchema.pre('findOneAndDelete', async function () {
  try {
    const doc = await this.model.findOne(this.getQuery());
    if (doc && doc.deptId && doc.amount > 0) {
      const { Department } = await import('./department.schema.js');
      const dept = await Department.findOne({ deptId: doc.deptId });
      if (dept) {
        const cur = Number(dept.allocatedFundPool) || 0;
        dept.allocatedFundPool = Math.max(0, cur - Number(doc.amount));
        await dept.save();
        console.log(`[RevertOnDelete] Reverted ₹${doc.amount} from ${dept.name} (${dept.deptId}). New Pool: ₹${dept.allocatedFundPool}`);
      }
    }
  } catch (err) {
    console.warn('[RevertOnDelete Error]:', err.message);
  }
});

departmentFundAllocationSchema.pre('deleteOne', { document: true, query: false }, async function () {
  try {
    if (this.deptId && this.amount > 0) {
      const { Department } = await import('./department.schema.js');
      const dept = await Department.findOne({ deptId: this.deptId });
      if (dept) {
        const cur = Number(dept.allocatedFundPool) || 0;
        dept.allocatedFundPool = Math.max(0, cur - Number(this.amount));
        await dept.save();
        console.log(`[RevertOnDelete] Reverted ₹${this.amount} from ${dept.name} (${dept.deptId}). New Pool: ₹${dept.allocatedFundPool}`);
      }
    }
  } catch (err) {
    console.warn('[RevertOnDelete Error]:', err.message);
  }
});

export const DepartmentFundAllocation =
  mongoose.models.DepartmentFundAllocation ||
  mongoose.model('DepartmentFundAllocation', departmentFundAllocationSchema);

export default DepartmentFundAllocation;

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
      enum: ['State Ministry', 'District Department', 'Block / Tehsil Office', 'Gram Panchayat', 'Ward Commissioner'],
      default: 'State Ministry',
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
    parentMinistry: { type: String, default: null, trim: true },
    departmentType: { type: String, default: 'State Government Department', trim: true },
    parentAuthority: { type: String, default: 'Government of Jharkhand', trim: true },
    officialWebsite: { type: String, default: null, trim: true },
    helplineNumber: { type: String, default: null, trim: true },
    officeAddress: { type: String, default: null, trim: true },
    applicableJurisdiction: { type: String, default: 'State Wide', trim: true },
    headquartersLocation: { type: String, default: 'Ranchi', trim: true },
    operationalDistrictsType: { type: String, default: 'All Districts (State Wide)', trim: true },
    involvedLowerLevels: { type: [String], default: [] },
    nodalOfficerName: { type: String, default: null, trim: true },
    nodalOfficerDesignation: { type: String, default: null, trim: true },
    nodalOfficerEmail: { type: String, default: null, trim: true },
    nodalOfficerPhone: { type: String, default: null, trim: true },
    officeSecretariatLocation: { type: String, default: null, trim: true },
    effectiveFrom: { type: String, default: null, trim: true },
    remarks: { type: String, default: null, trim: true },
    keyFunctions: { type: [String], default: [] },
    powersApprovalAuthority: { type: String, default: null, trim: true },
    schemesManaged: { type: String, default: null, trim: true },
    departmentsCoordinated: { type: String, default: null, trim: true },
    problemCategoriesHandled: { type: String, default: null, trim: true },
    goNumber: { type: String, default: null, trim: true },
    goDate: { type: String, default: null, trim: true },
    verificationStatus: { type: String, default: 'Pending Verification', trim: true },
    approvalRequired: { type: Boolean, default: true },
    credentials: {
      loginId: { type: String, trim: true },
      loginEmail: { type: String, lowercase: true, trim: true },
      password: { type: String, default: null },
      passwordHash: { type: String, default: null },
      generatedPassword: { type: String, default: null },
      mfaRequired: { type: Boolean, default: false },
      firstLoginPasswordChange: { type: Boolean, default: true },
      credentialCreatedBy: { type: String, default: 'Super Admin', trim: true },
      credentialStatus: { type: String, default: 'Pending Activation', trim: true }
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Archived'],
      default: 'Active',
      index: true
    },
    allocatedFundPool: {
      type: Number,
      default: 0,
      min: 0
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

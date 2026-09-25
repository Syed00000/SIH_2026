export class User {
  constructor({
    id,
    fullName,
    mobileNumber,
    email,
    passwordHash,
    role = 'CITIZEN',
    profile = {},
    accountStatus = 'PENDING_VERIFICATION',
    emailVerification = { verified: false, verifiedAt: null },
    emailVerificationCode = null,
    emailVerificationExpires = null,
    passwordResetOTP = null,
    passwordResetExpires = null,
    lastLoginAt = null,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.fullName = fullName;
    this.mobileNumber = mobileNumber;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.profile = profile;
    this.accountStatus = accountStatus;
    this.emailVerification = emailVerification;
    this.emailVerificationCode = emailVerificationCode;
    this.emailVerificationExpires = emailVerificationExpires;
    this.passwordResetOTP = passwordResetOTP;
    this.passwordResetExpires = passwordResetExpires;
    this.lastLoginAt = lastLoginAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deptId = (profile && profile.deptId) || null;
    this.category = (profile && profile.category) || null;
    this.department = (profile && profile.department) || null;
    this.district = (profile && profile.district) || null;
    this.block = (profile && profile.block) || null;
    this.code = (profile && profile.code) || null;
    this.officerId = (profile && profile.officerId) || null;
    this.departmentId = (profile && profile.departmentId) || null;
    this.designation = (profile && profile.designation) || null;
  }

  get isEmailVerified() {
    return !!(this.emailVerification && this.emailVerification.verified);
  }

  toSafeObject() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      mobileNumber: this.mobileNumber,
      role: this.role,
      deptId: this.profile?.deptId || this.deptId || null,
      category: this.profile?.category || this.category || null,
      department: this.profile?.department || this.department || null,
      district: this.profile?.district || this.district || null,
      block: this.profile?.block || this.block || null,
      code: this.profile?.code || this.code || null,
      technicianId: this.profile?.technicianId || this.technicianId || null,
      officerId: this.profile?.officerId || this.officerId || null,
      departmentId: this.profile?.departmentId || this.departmentId || null,
      designation: this.profile?.designation || this.designation || null,
      profile: this.profile,
      emailVerified: this.isEmailVerified,
      accountStatus: this.accountStatus,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default User;

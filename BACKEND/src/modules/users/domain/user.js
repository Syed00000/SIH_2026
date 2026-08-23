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

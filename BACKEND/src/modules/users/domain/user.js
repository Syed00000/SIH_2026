export class User {
  constructor({
    id,
    email,
    passwordHash,
    firstName,
    lastName,
    role = 'customer',
    isEmailVerified = false,
    passwordResetToken = null,
    passwordResetExpires = null,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.isEmailVerified = isEmailVerified;
    this.passwordResetToken = passwordResetToken;
    this.passwordResetExpires = passwordResetExpires;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      role: this.role,
      isEmailVerified: this.isEmailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default User;

export class RefreshToken {
  constructor({
    id,
    token,
    userId,
    expiresAt,
    revoked = false,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.token = token;
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.revoked = revoked;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get isExpired() {
    return new Date() > this.expiresAt;
  }

  get isValid() {
    return !this.revoked && !this.isExpired;
  }

  revoke() {
    this.revoked = true;
    this.updatedAt = new Date();
  }
}

export default RefreshToken;

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import config from '../../../shared/config/index.js';
import { AuthenticationError, ConflictError, ValidationError } from '../../../shared/errors/AppError.js';
import RefreshToken from '../domain/token.js';
import logger from '../../../shared/logger/index.js';

export class AuthService {
  constructor(userService, tokenRepository, queue) {
    this.userService = userService;
    this.tokenRepository = tokenRepository;
    this.queue = queue;
  }

  async register({ fullName, mobileNumber, email, password, confirmPassword, role = 'CITIZEN', profile = {}, ...restBody }) {
    // 1. Password confirmation check
    if (password !== confirmPassword) {
      throw new ValidationError('Password and Confirm Password do not match');
    }

    // 2. Password security rules
    if (password === email || password === mobileNumber) {
      throw new ValidationError('Password cannot be the same as your email or mobile number');
    }

    // 3. Role restriction check (Only CITIZEN, UNIVERSITY, INDUSTRY allowed)
    const allowedRoles = ['CITIZEN', 'UNIVERSITY', 'INDUSTRY'];
    const formattedRole = (role || '').toUpperCase();
    if (!allowedRoles.includes(formattedRole)) {
      throw new ValidationError(`Invalid role '${role}'. Only CITIZEN, UNIVERSITY, or INDUSTRY are allowed.`);
    }

    // 4. Duplicate checks
    const normalizedEmail = email.toLowerCase().trim();
    const existingEmail = await this.userService.getUserByEmail(normalizedEmail);
    if (existingEmail) {
      throw new ConflictError('EMAIL_ALREADY_EXISTS');
    }

    const normalizedMobile = mobileNumber.trim();
    const existingMobile = await this.userService.getUserByMobile(normalizedMobile);
    if (existingMobile) {
      throw new ConflictError('MOBILE_ALREADY_EXISTS');
    }

    // 5. Password Hashing
    const passwordHash = await bcrypt.hash(password, 12);

    // 6. Build embedded profile sub-document from profile object or top-level role fields
    const embeddedProfile = {
      // Citizen fields
      preferredLanguage: profile.preferredLanguage || restBody.preferredLanguage || 'HINDI',
      location: profile.location || restBody.location || null,
      // University fields
      institutionName: profile.institutionName || restBody.institutionName || null,
      aisheCode: profile.aisheCode || restBody.aisheCode || null,
      registrationNumber: profile.registrationNumber || restBody.registrationNumber || null,
      institutionType: profile.institutionType || restBody.institutionType || null,
      nodalOfficerDesignation: profile.nodalOfficerDesignation || restBody.nodalOfficerDesignation || null,
      academicFocusDomains: profile.academicFocusDomains || restBody.academicFocusDomains || [],
      // Industry fields
      organizationName: profile.organizationName || restBody.organizationName || null,
      entityType: profile.entityType || restBody.entityType || null,
      cin: profile.cin || restBody.cin || null,
      gstin: profile.gstin || restBody.gstin || null,
      ngoDarpanId: profile.ngoDarpanId || restBody.ngoDarpanId || null,
      primaryContactDesignation: profile.primaryContactDesignation || restBody.primaryContactDesignation || null,
      supportSectors: profile.supportSectors || restBody.supportSectors || []
    };

    // 7. Generate 6-digit OTP (5-minute expiry)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 300 seconds TTL

    // 8. Create User document in PENDING_VERIFICATION state in single users collection
    const user = await this.userService.createUser({
      fullName: fullName.trim(),
      mobileNumber: normalizedMobile,
      email: normalizedEmail,
      passwordHash,
      role: formattedRole,
      profile: embeddedProfile,
      accountStatus: 'PENDING_VERIFICATION',
      emailVerification: { verified: false, verifiedAt: null },
      emailVerificationCode: otp,
      emailVerificationExpires: otpExpires
    });

    // 9. Enqueue background SMTP email dispatch
    await this.queue.add('sendEmailVerification', {
      userId: user.id,
      email: user.email,
      name: user.fullName,
      code: otp
    });

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      emailVerificationRequired: true,
      message: 'Registration successful. Please verify your email.'
    };
  }

  async verifyEmail({ email, otp, code }) {
    const targetOtp = otp || code;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userService.getUserByEmail(normalizedEmail);
    
    if (!user) {
      throw new AuthenticationError('USER_NOT_FOUND');
    }

    if (user.emailVerification && user.emailVerification.verified) {
      return { emailVerified: true, accountStatus: user.accountStatus, message: 'Email is already verified.' };
    }

    if (
      !user.emailVerificationCode ||
      user.emailVerificationCode !== targetOtp ||
      !user.emailVerificationExpires ||
      new Date(user.emailVerificationExpires) < new Date()
    ) {
      throw new AuthenticationError('INVALID_OTP');
    }

    await this.userService.updateResetCredentials(user.id, {
      accountStatus: 'ACTIVE',
      emailVerification: { verified: true, verifiedAt: new Date() },
      emailVerificationCode: null,
      emailVerificationExpires: null
    });

    return {
      emailVerified: true,
      accountStatus: 'ACTIVE',
      message: 'Email verified successfully. You can now login.'
    };
  }

  async resendVerificationOtp({ email }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userService.getUserByEmail(normalizedEmail);

    if (!user) {
      return { message: 'A new verification OTP has been sent.' };
    }

    if (user.accountStatus !== 'PENDING_VERIFICATION') {
      throw new ValidationError('Account is already verified or active.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.userService.updateResetCredentials(user.id, {
      emailVerificationCode: otp,
      emailVerificationExpires: otpExpires
    });

    await this.queue.add('sendEmailVerification', {
      userId: user.id,
      email: user.email,
      name: user.fullName,
      code: otp
    });

    return { message: 'A new verification OTP has been sent.' };
  }

  async login({ email, password }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userService.getUserByEmail(normalizedEmail);

    if (!user) {
      throw new AuthenticationError('INVALID_CREDENTIALS');
    }

    if (!user.emailVerification || !user.emailVerification.verified) {
      throw new AuthenticationError('EMAIL_NOT_VERIFIED');
    }

    if (user.accountStatus === 'SUSPENDED') {
      throw new AuthenticationError('ACCOUNT_SUSPENDED');
    }

    if (user.accountStatus === 'BLOCKED') {
      throw new AuthenticationError('ACCOUNT_BLOCKED');
    }

    if (user.accountStatus !== 'ACTIVE') {
      throw new AuthenticationError('ACCOUNT_NOT_ACTIVE');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AuthenticationError('INVALID_CREDENTIALS');
    }

    // Update lastLoginAt timestamp
    await this.userService.updateResetCredentials(user.id, {
      lastLoginAt: new Date()
    });

    const accessToken = this._generateAccessToken(user);
    const refreshToken = await this._generateAndSaveRefreshToken(user.id);

    return {
      user: user.toSafeObject(),
      accessToken,
      refreshToken: refreshToken.token
    };
  }

  async refresh(tokenString) {
    const storedToken = await this.tokenRepository.findByToken(tokenString);
    if (!storedToken) {
      throw new AuthenticationError('TOKEN_INVALID');
    }

    if (storedToken.revoked) {
      logger.warn({ userId: storedToken.userId }, 'Reused refresh token detected! Revoking all sessions.');
      await this.tokenRepository.revokeAllForUser(storedToken.userId);
      throw new AuthenticationError('Session expired. Please log in again.');
    }

    if (storedToken.isExpired) {
      throw new AuthenticationError('TOKEN_EXPIRED');
    }

    const user = await this.userService.getUserById(storedToken.userId);
    
    storedToken.revoke();
    await this.tokenRepository.update(storedToken);

    const accessToken = this._generateAccessToken(user);
    const newRefreshToken = await this._generateAndSaveRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: newRefreshToken.token
    };
  }

  async logout(tokenString) {
    const storedToken = await this.tokenRepository.findByToken(tokenString);
    if (storedToken) {
      storedToken.revoke();
      await this.tokenRepository.update(storedToken);
    }
  }

  async requestPasswordReset(email) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userService.getUserByEmail(normalizedEmail);
    if (!user) {
      return { message: 'If the email exists, a 6-digit password reset OTP has been sent.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await this.userService.updateResetCredentials(user.id, {
      passwordResetOTP: otp,
      passwordResetExpires: resetExpiry
    });

    await this.queue.add('sendPasswordReset', {
      email: user.email,
      name: user.fullName,
      otp,
      code: otp
    });

    return { message: 'If the email exists, a 6-digit password reset OTP has been sent.' };
  }

  async resetPassword({ email, otp, newPassword }) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userService.getUserByEmail(normalizedEmail);
    if (!user) {
      throw new AuthenticationError('USER_NOT_FOUND');
    }

    if (
      !user.passwordResetOTP ||
      user.passwordResetOTP !== otp ||
      !user.passwordResetExpires ||
      new Date(user.passwordResetExpires) < new Date()
    ) {
      throw new AuthenticationError('INVALID_OTP');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.userService.updateResetCredentials(user.id, {
      passwordHash,
      passwordResetOTP: null,
      passwordResetExpires: null
    });

    await this.tokenRepository.revokeAllForUser(user.id);

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  _generateAccessToken(user) {
    return jwt.sign(
      { sub: user.id, role: user.role },
      config.JWT_ACCESS_SECRET,
      {
        expiresIn: config.JWT_ACCESS_EXPIRY
      }
    );
  }

  async _generateAndSaveRefreshToken(userId) {
    const tokenString = randomBytes(40).toString('hex');
    const days = parseInt(config.JWT_REFRESH_EXPIRY) || 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const refreshToken = new RefreshToken({
      token: tokenString,
      userId,
      expiresAt
    });

    return this.tokenRepository.save(refreshToken);
  }
}

export default AuthService;

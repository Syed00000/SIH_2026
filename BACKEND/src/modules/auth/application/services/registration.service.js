import bcrypt from 'bcryptjs';
import { ConflictError, ValidationError } from '../../../../shared/errors/AppError.js';
import { buildEmbeddedProfile } from '../helpers/profile.helper.js';

export class RegistrationService {
  constructor(userService, queue) {
    this.userService = userService;
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
    if (existingEmail && (existingEmail.isEmailVerified || existingEmail.accountStatus === 'ACTIVE')) {
      throw new ConflictError('EMAIL_ALREADY_EXISTS');
    }

    const normalizedMobile = mobileNumber.trim();
    const existingMobile = await this.userService.getUserByMobile(normalizedMobile);
    if (existingMobile && existingMobile.id !== existingEmail?.id && (existingMobile.isEmailVerified || existingMobile.accountStatus === 'ACTIVE')) {
      throw new ConflictError('MOBILE_ALREADY_EXISTS');
    }

    // 5. Password Hashing
    const passwordHash = await bcrypt.hash(password, 12);

    // 6. Build embedded profile sub-document
    const embeddedProfile = buildEmbeddedProfile(profile, restBody);

    // 7. Generate 6-digit OTP (5-minute expiry)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 300 seconds TTL

    // 8. Create or Update User document in PENDING_VERIFICATION state in single users collection
    let user;
    if (existingEmail && existingEmail.accountStatus === 'PENDING_VERIFICATION') {
      user = await this.userService.updateResetCredentials(existingEmail.id, {
        fullName: fullName.trim(),
        mobileNumber: normalizedMobile,
        passwordHash,
        role: formattedRole,
        profile: embeddedProfile,
        accountStatus: 'PENDING_VERIFICATION',
        emailVerification: { verified: false, verifiedAt: null },
        emailVerificationCode: otp,
        emailVerificationExpires: otpExpires
      });
    } else {
      user = await this.userService.createUser({
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
    }

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
}

export default RegistrationService;

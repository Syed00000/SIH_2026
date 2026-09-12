import { AuthenticationError, ValidationError } from '../../../../shared/errors/AppError.js';

export class VerificationService {
  constructor(userService, tokenService, queue) {
    this.userService = userService;
    this.tokenService = tokenService;
    this.queue = queue;
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
      emailVerificationExpires: null,
      lastLoginAt: new Date()
    });

    user.accountStatus = 'ACTIVE';
    user.emailVerification = { verified: true, verifiedAt: new Date() };

    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateAndSaveRefreshToken(user.id);

    return {
      emailVerified: true,
      accountStatus: 'ACTIVE',
      message: 'Email verified successfully.',
      accessToken,
      refreshToken: refreshToken.token,
      user: user.toSafeObject()
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

    console.log(`\n========================================\n🔑 [VERIFICATION OTP] Email: ${user.email} | OTP: ${otp}\n========================================\n`);

    try {
      await this.queue.add('sendEmailVerification', {
        userId: user.id,
        email: user.email,
        name: user.fullName,
        code: otp
      });
    } catch (e) {
      console.warn('Could not enqueue email dispatch:', e.message);
    }

    return { message: 'A new verification OTP has been sent.', devOtp: otp };
  }
}

export default VerificationService;

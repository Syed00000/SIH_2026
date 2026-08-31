import bcrypt from 'bcryptjs';
import { AuthenticationError } from '../../../../shared/errors/AppError.js';

export class PasswordService {
  constructor(userService, tokenRepository, queue) {
    this.userService = userService;
    this.tokenRepository = tokenRepository;
    this.queue = queue;
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
}

export default PasswordService;

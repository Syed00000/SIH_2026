import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import config from '../../../shared/config/index.js';
import { AuthenticationError, ConflictError } from '../../../shared/errors/AppError.js';
import RefreshToken from '../domain/token.js';
import logger from '../../../shared/logger/index.js';

export class AuthService {
  constructor(userService, tokenRepository, queue) {
    this.userService = userService;
    this.tokenRepository = tokenRepository;
    this.queue = queue;
  }

  async register({ email, password, firstName, lastName }) {
    const existing = await this.userService.getUserByEmail(email);
    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userService.createUser({
      email,
      passwordHash,
      firstName,
      lastName
    });

    await this.queue.add('sendEmailVerification', {
      userId: user.id,
      email: user.email,
      name: user.fullName
    });

    return user.toSafeObject();
  }

  async login({ email, password }) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

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
      throw new AuthenticationError('Invalid refresh token');
    }

    if (storedToken.revoked) {
      logger.warn({ userId: storedToken.userId }, 'Reused refresh token detected! Revoking all sessions.');
      await this.tokenRepository.revokeAllForUser(storedToken.userId);
      throw new AuthenticationError('Session expired. Please log in again.');
    }

    if (storedToken.isExpired) {
      throw new AuthenticationError('Refresh token expired');
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
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    const resetToken = randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(resetToken, 10);
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

    await this.userService.updateResetCredentials(user.id, {
      tokenHash,
      expires: resetExpiry
    });

    await this.queue.add('sendPasswordReset', {
      email: user.email,
      name: user.fullName,
      resetToken
    });

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  _generateAccessToken(user) {
    return jwt.sign(
      { role: user.role },
      config.JWT_ACCESS_SECRET,
      {
        subject: user.id,
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

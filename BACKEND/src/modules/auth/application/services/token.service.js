import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import config from '../../../../shared/config/index.js';
import { AuthenticationError } from '../../../../shared/errors/AppError.js';
import RefreshToken from '../../domain/token.js';
import logger from '../../../../shared/logger/index.js';

export class TokenService {
  constructor(tokenRepository, userService) {
    this.tokenRepository = tokenRepository;
    this.userService = userService;
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        role: user.role,
        email: user.email,
        deptId: user.deptId || user.profile?.deptId || '',
        department: user.department || user.profile?.department || '',
        district: user.profile?.district || user.district || ''
      },
      config.JWT_ACCESS_SECRET,
      {
        expiresIn: config.JWT_ACCESS_EXPIRY
      }
    );
  }

  async generateAndSaveRefreshToken(userId) {
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
    if (!user || user.accountStatus === 'SUSPENDED' || user.accountStatus === 'BLOCKED') {
      await this.tokenRepository.revokeTokensByUserId(storedToken.userId);
      throw new AuthenticationError(
        user?.accountStatus === 'SUSPENDED' ? 'ACCOUNT_SUSPENDED' : user?.accountStatus === 'BLOCKED' ? 'ACCOUNT_BLOCKED' : 'USER_NOT_FOUND'
      );
    }

    storedToken.revoke();
    await this.tokenRepository.update(storedToken);

    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateAndSaveRefreshToken(user.id);

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

  async revokeTokensByUserId(userId) {
    return this.tokenRepository.revokeTokensByUserId(userId);
  }

  async deleteTokensByUserId(userId) {
    return this.tokenRepository.deleteTokensByUserId(userId);
  }

  async deleteTokensByUserIds(userIds) {
    return this.tokenRepository.deleteTokensByUserIds(userIds);
  }
}

export default TokenService;

import TokenService from './services/token.service.js';
import RegistrationService from './services/registration.service.js';
import VerificationService from './services/verification.service.js';
import LoginService from './services/login.service.js';
import PasswordService from './services/password.service.js';

export class AuthService {
  constructor(userService, tokenRepository, queue) {
    this.userService = userService;
    this.tokenRepository = tokenRepository;
    this.queue = queue;

    this.tokenService = new TokenService(tokenRepository, userService);
    this.registrationService = new RegistrationService(userService, queue);
    this.verificationService = new VerificationService(userService, this.tokenService, queue);
    this.loginService = new LoginService(userService, this.tokenService);
    this.passwordService = new PasswordService(userService, tokenRepository, queue);
  }

  async register(params) {
    return this.registrationService.register(params);
  }

  async verifyEmail(params) {
    return this.verificationService.verifyEmail(params);
  }

  async resendVerificationOtp(params) {
    return this.verificationService.resendVerificationOtp(params);
  }

  async login(credentials) {
    return this.loginService.login(credentials);
  }

  async refresh(tokenString) {
    return this.tokenService.refresh(tokenString);
  }

  async logout(tokenString) {
    return this.tokenService.logout(tokenString);
  }

  async requestPasswordReset(email) {
    return this.passwordService.requestPasswordReset(email);
  }

  async resetPassword(params) {
    return this.passwordService.resetPassword(params);
  }

  async revokeTokensByUserId(userId) {
    return this.tokenService.revokeTokensByUserId(userId);
  }

  async deleteTokensByUserId(userId) {
    return this.tokenService.deleteTokensByUserId(userId);
  }

  async deleteTokensByUserIds(userIds) {
    return this.tokenService.deleteTokensByUserIds(userIds);
  }

  _generateAccessToken(user) {
    return this.tokenService.generateAccessToken(user);
  }

  async _generateAndSaveRefreshToken(userId) {
    return this.tokenService.generateAndSaveRefreshToken(userId);
  }
}

export default AuthService;

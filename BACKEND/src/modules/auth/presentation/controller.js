import MongoUserRepository from '../../users/infrastructure/repository.js';
import UserService from '../../users/application/service.js';
import MongoTokenRepository from '../infrastructure/repository.js';
import AuthService from '../application/service.js';
import { queue } from '../../../infrastructure/queue/queue.js';

import { createRegistrationHandler } from './handlers/registration.handler.js';
import { createSessionHandler } from './handlers/session.handler.js';
import { createPasswordHandler } from './handlers/password.handler.js';
import { createUserHandler } from './handlers/user.handler.js';

export {
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  resetRequestSchema,
  resetPasswordSchema
} from './validation.js';

const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);
const tokenRepository = new MongoTokenRepository();
const authService = new AuthService(userService, tokenRepository, queue);

const registrationHandler = createRegistrationHandler(authService);
const sessionHandler = createSessionHandler(authService);
const passwordHandler = createPasswordHandler(authService);
const userHandler = createUserHandler(userService);

export const register = registrationHandler.register;
export const verifyEmail = registrationHandler.verifyEmail;
export const resendVerificationOtp = registrationHandler.resendVerificationOtp;

export const login = sessionHandler.login;
export const refresh = sessionHandler.refresh;
export const logout = sessionHandler.logout;

export const requestPasswordReset = passwordHandler.requestPasswordReset;
export const resetPassword = passwordHandler.resetPassword;

export const me = userHandler.me;

export default {
  register,
  verifyEmail,
  resendVerificationOtp,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  me
};

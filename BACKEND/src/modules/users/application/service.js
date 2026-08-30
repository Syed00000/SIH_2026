import { NotFoundError } from '../../../shared/errors/AppError.js';
import User from '../domain/user.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    return this.userRepository.findByEmail(email);
  }

  async getUserByIdentifier(identifier) {
    if (this.userRepository.findByIdentifier) {
      return this.userRepository.findByIdentifier(identifier);
    }
    return this.userRepository.findByEmail(identifier);
  }

  async getUserByMobile(mobileNumber) {
    return this.userRepository.findByMobile(mobileNumber);
  }

  async createUser({
    fullName,
    mobileNumber,
    email,
    passwordHash,
    role = 'CITIZEN',
    profile = {},
    accountStatus = 'PENDING_VERIFICATION',
    emailVerification = { verified: false, verifiedAt: null },
    emailVerificationCode = null,
    emailVerificationExpires = null
  }) {
    const user = new User({
      fullName,
      mobileNumber,
      email,
      passwordHash,
      role,
      profile,
      accountStatus,
      emailVerification,
      emailVerificationCode,
      emailVerificationExpires
    });
    return this.userRepository.save(user);
  }

  async updateResetCredentials(id, updateData) {
    return this.userRepository.update(id, updateData);
  }
}

export default UserService;

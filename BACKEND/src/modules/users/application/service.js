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

  async createUser({ email, passwordHash, firstName, lastName }) {
    const user = new User({
      email,
      passwordHash,
      firstName,
      lastName
    });
    return this.userRepository.save(user);
  }

  async updateResetCredentials(id, { tokenHash, expires }) {
    return this.userRepository.update(id, {
      passwordResetToken: tokenHash,
      passwordResetExpires: expires
    });
  }
}

export default UserService;

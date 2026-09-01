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

  async createUser(userData) {
    const user = new User(userData);
    return this.userRepository.save(user);
  }

  async updateResetCredentials(id, updateData) {
    return this.userRepository.update(id, updateData);
  }
}

export default UserService;

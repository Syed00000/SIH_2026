import { NotFoundError } from '../../../shared/errors/AppError.js';
import User from '../domain/user.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getUserById(id) {
    let user = null;
    try {
      user = await this.userRepository.findById(id);
    } catch {
      user = null;
    }

    if (!user && this.userRepository.findByIdentifier) {
      user = await this.userRepository.findByIdentifier(id);
    }

    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    let user = await this.userRepository.findByEmail(email);
    if (!user && this.userRepository.findByIdentifier) {
      user = await this.userRepository.findByIdentifier(email);
    }
    return user;
  }

  async getUserByIdentifier(identifier) {
    let user = null;
    if (this.userRepository.findByIdentifier) {
      user = await this.userRepository.findByIdentifier(identifier);
    } else {
      user = await this.userRepository.findByEmail(identifier);
    }
    return user;
  }

  async getUserByMobile(mobileNumber) {
    return this.userRepository.findByMobile(mobileNumber);
  }

  async createUser(userData) {
    const user = new User(userData);
    return this.userRepository.save(user);
  }

  async updateResetCredentials(id, updateData) {
    try {
      return await this.userRepository.update(id, updateData);
    } catch {
      return null;
    }
  }
}

export default UserService;


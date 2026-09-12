import { NotFoundError } from '../../../shared/errors/AppError.js';
import User from '../domain/user.js';
import {
  findDepartmentById,
  findDepartmentByIdentifier,
  toDepartmentUserEntity
} from '../../auth/application/services/department-auth.helper.js';
import {
  findBlockById,
  findBlockByIdentifier,
  toBlockUserEntity
} from '../../auth/application/services/block-auth.helper.js';
import {
  findTechnicianById,
  findTechnicianByIdentifier,
  toTechnicianUserEntity
} from '../../auth/application/services/technician-auth.helper.js';
import {
  findWardById,
  findWardByIdentifier,
  toWardUserEntity
} from '../../auth/application/services/ward-auth.helper.js';

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

    if (!user) {
      const dept = await findDepartmentById(id);
      if (dept) return toDepartmentUserEntity(dept);

      const block = await findBlockById(id);
      if (block) return toBlockUserEntity(block);

      const ward = await findWardById(id);
      if (ward) return toWardUserEntity(ward);

      const tech = await findTechnicianById(id);
      if (tech) return toTechnicianUserEntity(tech);

      throw new NotFoundError('User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const dept = await findDepartmentByIdentifier(email);
      if (dept) return toDepartmentUserEntity(dept);

      const block = await findBlockByIdentifier(email);
      if (block) return toBlockUserEntity(block);

      const ward = await findWardByIdentifier(email);
      if (ward) return toWardUserEntity(ward);

      const tech = await findTechnicianByIdentifier(email);
      if (tech) return toTechnicianUserEntity(tech);
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

    if (!user) {
      const dept = await findDepartmentByIdentifier(identifier);
      if (dept) return toDepartmentUserEntity(dept);

      const block = await findBlockByIdentifier(identifier);
      if (block) return toBlockUserEntity(block);

      const ward = await findWardByIdentifier(identifier);
      if (ward) return toWardUserEntity(ward);

      const tech = await findTechnicianByIdentifier(identifier);
      if (tech) return toTechnicianUserEntity(tech);
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

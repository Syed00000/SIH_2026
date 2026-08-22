export class UserRepository {
  async findById(id) {
    throw new Error('UserRepository.findById: Method not implemented');
  }

  async findByEmail(email) {
    throw new Error('UserRepository.findByEmail: Method not implemented');
  }

  async save(user) {
    throw new Error('UserRepository.save: Method not implemented');
  }

  async update(id, data) {
    throw new Error('UserRepository.update: Method not implemented');
  }
}

export default UserRepository;

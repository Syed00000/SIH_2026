export class TokenRepository {
  async findByToken(token) {
    throw new Error('TokenRepository.findByToken: Method not implemented');
  }

  async save(refreshToken) {
    throw new Error('TokenRepository.save: Method not implemented');
  }

  async update(refreshToken) {
    throw new Error('TokenRepository.update: Method not implemented');
  }

  async deleteByToken(token) {
    throw new Error('TokenRepository.deleteByToken: Method not implemented');
  }

  async revokeAllForUser(userId) {
    throw new Error('TokenRepository.revokeAllForUser: Method not implemented');
  }

  async revokeTokensByUserId(userId) {
    throw new Error('TokenRepository.revokeTokensByUserId: Method not implemented');
  }

  async deleteTokensByUserId(userId) {
    throw new Error('TokenRepository.deleteTokensByUserId: Method not implemented');
  }

  async deleteTokensByUserIds(userIds) {
    throw new Error('TokenRepository.deleteTokensByUserIds: Method not implemented');
  }
}

export default TokenRepository;

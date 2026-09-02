import logger from '../../../../shared/logger/index.js';

export class ChallengeTriageService {
  constructor(repository) {
    this.repository = repository;
  }

  async triageChallenge(challengeId, triageData, user = null) {
    if (!challengeId) throw new Error('Challenge ID is required');

    const existing = await this.repository.findById(challengeId);
    if (!existing) throw new Error(`Challenge with ID ${challengeId} not found`);
    if (existing.status === 'Withdrawn') {
      throw new Error('This problem has been withdrawn by the citizen and cannot be allocated or assigned to universities.');
    }

    const updated = await this.repository.triageChallenge(challengeId, triageData, user);
    if (!updated) throw new Error(`Challenge with ID ${challengeId} not found`);

    return updated;
  }

  async withdrawChallenge(challengeId, reason = '', user = null) {
    if (!challengeId) throw new Error('Challenge ID is required');

    const existing = await this.repository.findById(challengeId);
    if (!existing) throw new Error(`Challenge with ID ${challengeId} not found`);

    const isAlreadyAssigned =
      Boolean(existing.assignedUniversity?.id || existing.assignedUniversity?.name) ||
      existing.acceptanceStatus === 'Accepted' ||
      existing.status === 'In Progress';

    if (isAlreadyAssigned) {
      throw new Error('This problem has already been assigned to an institution and cannot be withdrawn.');
    }

    const updated = await this.repository.updateStatus(
      challengeId,
      'Withdrawn',
      reason || 'Withdrawn by citizen submitter',
      user?.fullName || 'Citizen'
    );
    if (!updated) throw new Error(`Challenge with ID ${challengeId} not found`);
    return updated;
  }

  async deleteChallenge(challengeId) {
    if (!challengeId) throw new Error('Challenge ID is required');
    const deleted = await this.repository.deleteById(challengeId);
    if (!deleted) throw new Error(`Challenge ${challengeId} not found`);
    return { success: true, message: `Challenge ${challengeId} deleted successfully` };
  }
}

export default ChallengeTriageService;

import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class UniversityChallengeService {
  constructor(repository) {
    this.repository = repository;
  }

  async getChallenges(universityCode, query) {
    const res = await this.repository.getChallengesByUniversity(universityCode, query);
    const mapped = (res.challenges || []).map((c) => ({
      ...c,
      id: c.challengeId,
      actionText: 'View'
    }));
    return { ...res, challenges: mapped };
  }

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata) {
    const updated = await this.repository.updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata);
    if (!updated) throw new NotFoundError('Challenge not found');
    return updated;
  }

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    const updated = await this.repository.assignFaculty(challengeId, universityCode, facultyInfo);
    if (!updated) throw new NotFoundError('Challenge not found');
    return updated;
  }
}

export default UniversityChallengeService;

export class ChallengeQueryService {
  constructor(repository) {
    this.repository = repository;
  }

  async getChallenges({ domain, status, district, search, page = 1, limit = 20, isPublic = true }) {
    const filter = {};
    if (isPublic) filter.isPublic = true;
    if (domain && domain !== 'All') filter.domain = domain;
    if (status && status !== 'All') filter.status = status;
    if (district && district !== 'All') filter['location.district'] = district;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { 'location.district': regex },
        { 'location.block': regex },
        { domain: regex },
        { challengeId: regex }
      ];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    return await this.repository.findWithFilter({ filter, skip, limit: Number(limit) });
  }

  async getMyChallenges(user, { status, search, page = 1, limit = 20 }) {
    const filter = {};
    if (user?.id) {
      filter.$or = [
        { citizenId: user.id },
        { 'submitter.email': user.email },
        { 'submitter.mobileNumber': user.mobileNumber }
      ];
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$and = [
        {
          $or: [
            { title: regex },
            { description: regex },
            { domain: regex },
            { challengeId: regex },
            { 'location.district': regex }
          ]
        }
      ];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    return await this.repository.findWithFilter({ filter, skip, limit: Number(limit) });
  }

  async getChallengeById(challengeId) {
    const challenge = await this.repository.findById(challengeId);
    if (!challenge) {
      throw new Error(`Challenge with ID ${challengeId} not found`);
    }
    return challenge;
  }
}

export default ChallengeQueryService;

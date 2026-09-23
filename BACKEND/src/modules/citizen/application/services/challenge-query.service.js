import mongoose from 'mongoose';

export class ChallengeQueryService {
  constructor(repository) {
    this.repository = repository;
  }

  async getChallenges({ domain, status, district, wardId, search, page = 1, limit = 20, isPublic = true }) {
    const filter = {};
    if (isPublic) filter.isPublic = true;
    if (domain && domain !== 'All' && domain !== 'All Domains') filter.domain = domain;
    if (status && status !== 'All' && status !== 'All Status') {
      const lower = status.trim().toLowerCase();
      if (lower === 'submitted' || lower === 'under review') {
        filter.status = { $in: ['Submitted', 'Under Review'] };
      } else if (lower === 'in progress') {
        filter.$or = [
          { status: { $in: ['In Progress', 'Accepted', 'Under Field Work'] } },
          { acceptanceStatus: 'Accepted' },
          { 'assignedUniversity.acceptanceStatus': 'Accepted' }
        ];
      } else if (lower === 'deployed') {
        filter.$or = [{ status: 'Deployed' }, { isDeployed: true }];
      } else {
        filter.status = new RegExp(`^${status.trim()}$`, 'i');
      }
    }
    if (wardId) {
      filter.$or = [
        { 'assignedWard.wardId': wardId.toUpperCase() },
        { 'assignedWard.id': wardId }
      ];
    }
    if (district && district !== 'All' && district !== 'All Districts') {
      const distRegex = new RegExp(`^${district.trim()}$`, 'i');
      filter.$or = [
        { 'location.district': distRegex },
        { district: distRegex },
        { 'assignedNodalOfficer.district': distRegex }
      ];
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      const searchConditions = [
        { title: regex },
        { description: regex },
        { 'location.district': regex },
        { 'location.block': regex },
        { domain: regex },
        { challengeId: regex }
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    return await this.repository.findWithFilter({ filter, skip, limit: Number(limit) });
  }

  async getMyChallenges(user, { status, search, page = 1, limit = 20 }) {
    const conditions = [];

    if (user?.id) {
      const emailRegex = user.email ? new RegExp(`^${user.email.trim()}$`, 'i') : null;
      const userMatch = [
        { citizenId: user.id },
        { citizenId: String(user.id) }
      ];
      if (emailRegex) {
        userMatch.push({ 'submitter.email': emailRegex });
      }
      if (user.mobileNumber) {
        userMatch.push({ 'submitter.mobileNumber': user.mobileNumber });
      }
      if (mongoose.isValidObjectId(user.id)) {
        userMatch.push({ citizenId: new mongoose.Types.ObjectId(user.id) });
      }

      const personalCheck = await this.repository.findWithFilter({
        filter: { $or: userMatch },
        skip: 0,
        limit: 1
      });

      if (personalCheck.total > 0) {
        conditions.push({ $or: userMatch });
      } else {
        conditions.push({
          $or: [
            { 'submitter.role': { $in: ['Citizen', 'CITIZEN', 'citizen'] } },
            { citizenId: { $ne: null } },
            { isDeleted: { $ne: true } }
          ]
        });
      }
    }

    if (status && status !== 'All' && status !== 'All Status') {
      const lower = status.trim().toLowerCase();
      if (lower === 'submitted' || lower === 'under review') {
        conditions.push({
          status: { $in: ['Submitted', 'Under Review'] }
        });
      } else if (lower === 'in progress') {
        conditions.push({
          $or: [
            { status: { $in: ['In Progress', 'Accepted', 'Under Field Work'] } },
            { acceptanceStatus: 'Accepted' },
            { 'assignedUniversity.acceptanceStatus': 'Accepted' }
          ]
        });
      } else if (lower === 'deployed') {
        conditions.push({
          $or: [
            { status: 'Deployed' },
            { isDeployed: true }
          ]
        });
      } else if (lower === 'resolved') {
        conditions.push({ status: 'Resolved' });
      } else if (lower === 'withdrawn') {
        conditions.push({ status: 'Withdrawn' });
      } else {
        conditions.push({ status: new RegExp(`^${status.trim()}$`, 'i') });
      }
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      conditions.push({
        $or: [
          { title: regex },
          { description: regex },
          { domain: regex },
          { challengeId: regex },
          { 'location.district': regex }
        ]
      });
    }

    const filter = conditions.length === 0 ? {} : (conditions.length === 1 ? conditions[0] : { $and: conditions });
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

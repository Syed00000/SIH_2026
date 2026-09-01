import mongoose from 'mongoose';
import { CitizenChallenge } from './model.js';
import { calculateActivityStats } from './helpers/stat-calculator.helper.js';
import { applyTriageChanges, updateMilestonesForStatus } from './helpers/triage-updater.helper.js';

export class CitizenRepository {
  async create(challengeData) {
    const challenge = new CitizenChallenge(challengeData);
    return await challenge.save();
  }

  async findById(challengeId) {
    const isObjId = mongoose.isValidObjectId(challengeId);
    return await CitizenChallenge.findOne(
      isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId }
    ).lean();
  }

  async findWithFilter({ filter = {}, sort = { submittedAt: -1 }, skip = 0, limit = 20 }) {
    const [challenges, total] = await Promise.all([
      CitizenChallenge.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      CitizenChallenge.countDocuments(filter)
    ]);

    return {
      challenges,
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  async getRecentChallenges(limit = 5) {
    return await CitizenChallenge.find({ isPublic: true })
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();
  }

  async getActivitiesStats(filter = {}) {
    const challenges = (await CitizenChallenge.find(filter).lean()) || [];
    return calculateActivityStats(challenges);
  }

  async getCategoryCounts() {
    return await CitizenChallenge.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  async updateStatus(challengeId, newStatus, remarks = '', updatedBy = 'Admin') {
    const isObjId = mongoose.isValidObjectId(challengeId);
    const challenge = await CitizenChallenge.findOne(
      isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId }
    );
    if (!challenge) return null;

    challenge.status = newStatus;
    if (newStatus === 'Resolved') {
      challenge.resolvedAt = new Date();
    }

    updateMilestonesForStatus(challenge, newStatus, remarks);

    await challenge.save();

    // If withdrawn, remove or update in UniversityChallenge queue
    if (newStatus === 'Withdrawn') {
      try {
        const { UniversityChallenge } = await import('../../university/infrastructure/model.js');
        await UniversityChallenge.findOneAndDelete({ challengeId: challenge.challengeId });
      } catch {
        // ignore
      }
    }

    return challenge.toObject();
  }

  async triageChallenge(challengeId, triageData, user = null) {
    const isObjId = mongoose.isValidObjectId(challengeId);
    const challenge = await CitizenChallenge.findOne(
      isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId }
    );
    if (!challenge) return null;

    applyTriageChanges(challenge, triageData, user);

    await challenge.save();
    return challenge.toObject();
  }

  async deleteById(challengeId) {
    const isObjId = mongoose.isValidObjectId(challengeId);
    const deleted = await CitizenChallenge.findOneAndDelete(
      isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId }
    );
    try {
      const { UniversityChallenge } = await import('../../university/infrastructure/model.js');
      await UniversityChallenge.findOneAndDelete({
        challengeId: deleted?.challengeId || challengeId
      });
    } catch {
      // ignore
    }
    return deleted;
  }

  async countAll() {
    return await CitizenChallenge.countDocuments();
  }
}

export const citizenRepository = new CitizenRepository();
export default citizenRepository;

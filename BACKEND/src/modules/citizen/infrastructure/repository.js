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
    const effectiveFilter = { isDeleted: { $ne: true }, ...filter };
    const [challenges, total] = await Promise.all([
      CitizenChallenge.find(effectiveFilter).sort(sort).skip(skip).limit(limit).lean(),
      CitizenChallenge.countDocuments(effectiveFilter)
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
    return await CitizenChallenge.find({ isPublic: true, isDeleted: { $ne: true } })
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();
  }

  async getActivitiesStats(filter = {}) {
    const query = {
      ...filter,
      $or: [{ isDeleted: { $ne: true } }, { status: 'Resolved' }]
    };
    const challenges = (await CitizenChallenge.find(query).lean()) || [];
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

    return challenge.toObject();
  }

  async triageChallenge(challengeId, triageData, user = null) {
    const isObjId = mongoose.isValidObjectId(challengeId);
    const challenge = await CitizenChallenge.findOne(
      isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId }
    );
    if (!challenge) return null;

    const oldUniId = challenge.assignedUniversity?.id;
    const isReassignment =
      oldUniId &&
      triageData.assignedUniversity?.id &&
      oldUniId.toUpperCase() !== triageData.assignedUniversity.id.toUpperCase();

    applyTriageChanges(challenge, triageData, user);
    if (typeof challenge.markModified === 'function') {
      challenge.markModified('assignedWard');
      challenge.markModified('assignedBlock');
      challenge.markModified('assignedDepartment');
      challenge.markModified('assignedTechnician');
      challenge.markModified('escalationEvidence');
    }
    await challenge.save();

    if (isReassignment) {
      try {
        const { UniversityProject, UniversityTeam } = await import('../../university/infrastructure/model.js');
        const newUniId = triageData.assignedUniversity.id.toUpperCase();
        const newUniName = triageData.assignedUniversity.name || newUniId;

        // Soft-transfer old university project so it doesn't appear in old university active portfolio
        await UniversityProject.updateMany(
          {
            challengeId: challenge.challengeId,
            universityCode: oldUniId.toUpperCase(),
            isDeleted: { $ne: true }
          },
          {
            $set: {
              status: 'Transferred',
              isDeleted: true,
              transferredTo: newUniId,
              transferredAt: new Date(),
              adminRemarks: `Challenge reallocated by State Nodal Cell to ${newUniName}`
            }
          }
        );

        // Archive associated old university teams
        await UniversityTeam.updateMany(
          {
            challengeId: challenge.challengeId,
            universityCode: oldUniId.toUpperCase(),
            status: 'Active'
          },
          {
            $set: {
              status: 'Archived',
              archiveReason: `Challenge reallocated to ${newUniName}`
            }
          }
        );
      } catch (err) {
        console.warn('Error archiving old university project on reassignment:', err);
      }
    }

    return challenge.toObject();
  }

  async deleteById(challengeId, deletedBy = 'Citizen') {
    const isObjId = mongoose.isValidObjectId(challengeId);
    const query = isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId };
    return await CitizenChallenge.findOneAndUpdate(
      query,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy
        }
      },
      { new: true }
    );
  }

  async countAll() {
    return await CitizenChallenge.countDocuments({
      $or: [{ isDeleted: { $ne: true } }, { status: 'Resolved' }]
    });
  }
}

export const citizenRepository = new CitizenRepository();
export default citizenRepository;

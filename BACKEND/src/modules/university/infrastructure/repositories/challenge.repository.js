import { UniversityChallenge, UniversityFaculty } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import User from '../../../users/infrastructure/model.js';
import MongooseUniversity from '../../../government/heis/infrastructure/model.js';
import { findUniversityByCodeOrId } from '../helpers/lookup.helper.js';
import { formatChallengeItem } from '../helpers/challenge-formatter.helper.js';
import { buildChallengeStatusUpdatePayload } from '../helpers/challenge-status-builder.helper.js';

export class ChallengeRepository {
  async getChallengesByUniversity(universityCode, { status, domain, district, search, page = 1, limit = 100 } = {}) {
    const rawCode = (universityCode || '').trim();
    const uniDoc = await findUniversityByCodeOrId(rawCode);
    const code = (uniDoc?.code || rawCode).toUpperCase();
    const aishe = (uniDoc?.aisheCode || '').toUpperCase();
    const uniName = uniDoc?.name || uniDoc?.legalName || '';

    const validUniIdentifiers = Array.from(new Set([code, rawCode.toUpperCase(), aishe, uniDoc?.shortName].filter(Boolean)));
    const citizenOrConditions = [{ 'assignedUniversity.id': { $in: validUniIdentifiers } }];
    if (uniName) citizenOrConditions.push({ 'assignedUniversity.name': { $regex: new RegExp(uniName, 'i') } });

    const query = { universityCode: { $in: validUniIdentifiers }, isDeleted: { $ne: true } };
    if (status && status !== 'All Status' && status !== 'All') query.status = status;
    if (domain && domain !== 'All Domains' && domain !== 'All') query.domain = domain;
    if (district && district !== 'All Districts' && district !== 'All') query.district = district;
    if (search?.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$and = [{ $or: [{ challengeId: regex }, { title: regex }, { domain: regex }, { district: regex }] }];
    }
    const skip = (Number(page) - 1) * Number(limit);

    try {
      const [uniChallenges, total, citizenChallenges, defaultNodalUser] = await Promise.all([
        UniversityChallenge.find(query).sort({ assignedOn: -1 }).skip(skip).limit(Number(limit)).lean(),
        UniversityChallenge.countDocuments(query),
        CitizenChallenge.find({ $or: citizenOrConditions }).sort({ submittedAt: -1 }).limit(Number(limit)).lean(),
        User.findOne({ role: { $in: ['NODAL', 'GOVERNMENT'] } }).lean()
      ]);

      const format = (c) => formatChallengeItem(c, { code, uniName, defaultNodalUser });
      const seenIds = new Set((uniChallenges || []).map((c) => c.challengeId));
      const mappedCitizen = (citizenChallenges || []).filter((cit) => !seenIds.has(cit.challengeId)).map(format);
      const mappedUni = (uniChallenges || []).map(format);
      const combined = [...mappedUni, ...mappedCitizen];

      return {
        challenges: combined,
        total: (total || 0) + mappedCitizen.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(((total || 0) + mappedCitizen.length) / Number(limit)) || 1
      };
    } catch {
      return { challenges: [], total: 0, page: Number(page), limit: Number(limit), totalPages: 1 };
    }
  }

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata = {}) {
    try {
      const rawCode = (universityCode || '').trim();
      const uniDoc = await findUniversityByCodeOrId(rawCode);
      const resolvedUniName = uniDoc?.name || uniDoc?.legalName || rawCode || 'Assigned University';

      const res = await UniversityChallenge.findOneAndUpdate(
        { challengeId },
        { $set: { status, actionLabel: actionLabel || status, ...metadata } },
        { new: true }
      );

      const updatePayload = buildChallengeStatusUpdatePayload(status, resolvedUniName, metadata);
      await CitizenChallenge.findOneAndUpdate({ challengeId }, { $set: updatePayload });

      if (res) return res;
    } catch (err) {
      console.warn('Error updating challenge status in DB:', err);
    }
    return { challengeId, status, actionLabel };
  }

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    try {
      const res = await UniversityChallenge.findOneAndUpdate(
        { challengeId },
        { $set: { assignedFaculty: facultyInfo, status: 'Accepted', actionLabel: 'View' } },
        { new: true }
      );
      if (facultyInfo?.email || facultyInfo?.name) {
        await UniversityFaculty.findOneAndUpdate(
          { $or: [{ email: facultyInfo.email }, { name: facultyInfo.name }] },
          { $set: { availabilityStatus: 'In Project' }, $inc: { activeProjects: 1 } }
        );
      }

      const uniDoc = await MongooseUniversity.findOne({ code: (universityCode || '').toUpperCase() }).lean();
      const resolvedUniName = uniDoc?.name || uniDoc?.legalName || universityCode || 'Assigned University';

      await CitizenChallenge.findOneAndUpdate(
        { challengeId },
        {
          $set: {
            status: 'In Progress',
            'assignedUniversity.id': universityCode,
            'assignedUniversity.name': resolvedUniName,
            'assignedUniversity.department': facultyInfo.department || 'Engineering & Technology',
            'assignedUniversity.mentorName': facultyInfo.name,
            'assignedUniversity.assignedAt': new Date(),
            'assignedUniversity.acceptanceStatus': 'Accepted',
            acceptanceStatus: 'Accepted',
            'milestones.2.status': 'COMPLETED',
            'milestones.2.completedAt': new Date(),
            'milestones.2.remarks': `Assigned to Lead Faculty Mentor: ${facultyInfo.name} (${facultyInfo.department || 'Innovation Lab'}) at ${resolvedUniName}`,
            'milestones.3.status': 'CURRENT',
            'milestones.3.remarks': `Faculty Mentor ${facultyInfo.name} leading solution execution.`
          }
        }
      );

      if (res) return res;
    } catch (err) {
      console.warn('Error assigning faculty in DB:', err);
    }
    return { challengeId, assignedFaculty: facultyInfo, status: 'Accepted' };
  }
}

export const challengeRepository = new ChallengeRepository();
export default challengeRepository;

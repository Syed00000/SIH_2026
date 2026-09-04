import { UniversityFaculty, UniversityProject, UniversityApproval, UniversityActivity } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import User from '../../../users/infrastructure/model.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';
import { formatChallengeItem } from '../helpers/challenge-formatter.helper.js';
import { buildChallengeStatusUpdatePayload } from '../helpers/challenge-status-builder.helper.js';
import { cascadeDeleteProblemOrProject } from '../helpers/cascade-delete.helper.js';

export class ChallengeRepository {
  async getChallengesByUniversity(universityCode, { status, domain, district, search, page = 1, limit = 100 } = {}) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) {
      // Fail closed
      return { challenges: [], total: 0, page: 1, totalPages: 1 };
    }

    const code = identity.code;
    const uniName = identity.name;
    const validUniIdentifiers = identity.validIdentifiers;

    const citizenOrConditions = [
      { 'assignedUniversity.id': { $in: validUniIdentifiers } }
    ];
    if (uniName) {
      const escapedName = uniName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      citizenOrConditions.push({ 'assignedUniversity.name': { $regex: new RegExp(`^${escapedName}$`, 'i') } });
    }

    const query = {
      $or: citizenOrConditions,
      isDeleted: { $ne: true }
    };
    if (status && status !== 'All Status' && status !== 'All') {
      if (status === 'Accepted') {
        query.$and = [{
          $or: [
            { 'assignedUniversity.acceptanceStatus': 'Accepted' },
            { acceptanceStatus: 'Accepted' },
            { status: 'In Progress' }
          ]
        }];
      } else {
        query.status = status;
      }
    }
    if (domain && domain !== 'All Domains' && domain !== 'All') query.domain = domain;
    if (district && district !== 'All Districts' && district !== 'All') {
      query.$or = [
        { 'location.district': district },
        { 'locationDetails.district': district }
      ];
    }
    if (search?.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      const searchOr = [
        { challengeId: regex },
        { title: regex },
        { domain: regex },
        { 'location.district': regex }
      ];
      query.$and = query.$and ? [...query.$and, { $or: searchOr }] : [{ $or: searchOr }];
    }
    const skip = (Number(page) - 1) * Number(limit);

    try {
      const [citizenChallenges, total, defaultNodalUser] = await Promise.all([
        CitizenChallenge.find(query).sort({ submittedAt: -1 }).skip(skip).limit(Number(limit)).lean(),
        CitizenChallenge.countDocuments(query),
        User.findOne({ role: { $in: ['NODAL', 'GOVERNMENT'] } }).lean()
      ]);

      const format = (c) => formatChallengeItem(c, { code, uniName, defaultNodalUser });
      const mappedCitizen = (citizenChallenges || []).map(format);

      return {
        challenges: mappedCitizen,
        total: total || 0,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil((total || 0) / Number(limit)) || 1
      };
    } catch {
      return { challenges: [], total: 0, page: Number(page), limit: Number(limit), totalPages: 1 };
    }
  }

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata = {}) {
    try {
      const rawCode = (universityCode || '').trim();
      const identity = await findUniversityIdentity(rawCode);
      const resolvedUniName = identity?.name || rawCode || 'Assigned University';

      const updatePayload = buildChallengeStatusUpdatePayload(status, resolvedUniName, metadata);
      await CitizenChallenge.findOneAndUpdate({ challengeId }, { $set: updatePayload });

      return { challengeId, status, actionLabel: actionLabel || status, ...metadata };
    } catch (err) {
      console.warn('Error updating challenge status in DB:', err);
    }
    return { challengeId, status, actionLabel };
  }

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    try {
      let resolvedFaculty = { ...facultyInfo };
      const searchConditions = [];
      if (facultyInfo?.email) searchConditions.push({ email: facultyInfo.email.toLowerCase().trim() });
      if (facultyInfo?.name) searchConditions.push({ name: new RegExp('^' + facultyInfo.name.trim() + '$', 'i') });

      if (searchConditions.length > 0) {
        const foundFac = await UniversityFaculty.findOne({ $or: searchConditions }).lean();
        if (foundFac) {
          resolvedFaculty = {
            name: foundFac.name,
            email: foundFac.email,
            department: foundFac.department || facultyInfo.department || 'Engineering & Technology',
            designation: foundFac.designation || facultyInfo.designation || 'Lead Faculty Mentor',
            phone: foundFac.phone || facultyInfo.phone
          };
        }
      }

      // Fetch challenge title from canonical CitizenChallenge
      const chlDoc = await CitizenChallenge.findOne({ challengeId }).lean();
      const chlTitle = chlDoc?.title || 'Grassroots Innovation Challenge';

      if (resolvedFaculty?.email || resolvedFaculty?.name) {
        await UniversityFaculty.findOneAndUpdate(
          { $or: [{ email: resolvedFaculty.email }, { name: resolvedFaculty.name }] },
          {
            $set: { availabilityStatus: 'In Project' },
            $inc: { activeProjects: 1 },
            $addToSet: {
              assignedChallenges: {
                challengeId,
                title: chlTitle,
                role: 'Lead Mentor'
              }
            }
          }
        );
      }

      const identity = await findUniversityIdentity(universityCode);
      const resolvedUniName = identity?.name || universityCode || 'Assigned University';

      await CitizenChallenge.findOneAndUpdate(
        { challengeId },
        {
          $set: {
            status: 'In Progress',
            'assignedUniversity.id': universityCode,
            'assignedUniversity.name': resolvedUniName,
            'assignedUniversity.department': resolvedFaculty.department || 'Engineering & Technology',
            'assignedUniversity.mentorName': resolvedFaculty.name,
            'assignedUniversity.mentorEmail': resolvedFaculty.email,
            'assignedUniversity.assignedAt': new Date(),
            'assignedUniversity.acceptanceStatus': 'Accepted',
            acceptanceStatus: 'Accepted',
            'milestones.2.status': 'COMPLETED',
            'milestones.2.completedAt': new Date(),
            'milestones.2.remarks': `Assigned to Lead Faculty Mentor: ${resolvedFaculty.name} (${resolvedFaculty.department || 'Innovation Lab'}) at ${resolvedUniName}`,
            'milestones.3.status': 'CURRENT',
            'milestones.3.remarks': `Faculty Mentor ${resolvedFaculty.name} leading solution execution.`
          }
        }
      );

      const projId = challengeId.replace('CHL-JH-2026-', 'PRJ-');
      const pMatch = { $or: [{ challengeId }, { projectId: challengeId }, { projectId: projId }] };
      await Promise.all([
        UniversityProject.updateMany(pMatch, { $set: { leadMentor: resolvedFaculty.name, facultyMentor: resolvedFaculty } }),
        UniversityApproval.updateMany(pMatch, { $set: { requestedBy: resolvedFaculty.name, requestedByEmail: resolvedFaculty.email, faculty: resolvedFaculty } }),
        UniversityActivity.create({
          universityCode: (universityCode || 'RU001').toUpperCase(),
          text: `New Challenge Allocated: "${chlTitle || challengeId}" assigned to Lead Faculty Mentor ${resolvedFaculty.name} (${resolvedFaculty.department || 'Engineering'}).`,
          type: 'CHALLENGE_ASSIGNED',
          timestamp: new Date()
        }).catch(() => {})
      ]);

      return { challengeId, assignedFaculty: resolvedFaculty, status: 'Accepted', actionLabel: 'View' };
    } catch (err) {
      console.warn('Error assigning faculty in DB:', err);
    }
    return { challengeId, assignedFaculty: facultyInfo, status: 'Accepted', actionLabel: 'View' };
  }

  async deleteChallenge(universityCode, challengeId, deletedBy = 'University Admin') {
    return await cascadeDeleteProblemOrProject(universityCode, challengeId, deletedBy);
  }
}

export const challengeRepository = new ChallengeRepository();
export default challengeRepository;

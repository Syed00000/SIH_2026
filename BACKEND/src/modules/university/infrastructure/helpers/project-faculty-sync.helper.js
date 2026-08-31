import { UniversityFaculty, UniversityChallenge } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import MongooseUniversity from '../../../government/heis/infrastructure/model.js';

export async function syncProjectFacultyAssignment({
  facultyInfo,
  existingProj,
  projectId,
  chlId,
  universityCode
}) {
  if (facultyInfo?.email || facultyInfo?.name) {
    await UniversityFaculty.findOneAndUpdate(
      { $or: [{ email: facultyInfo.email }, { name: facultyInfo.name }] },
      {
        $set: { availabilityStatus: 'In Project' },
        $inc: { activeProjects: 1 },
        $addToSet: {
          assignedChallenges: {
            challengeId: chlId || existingProj?.projectId || projectId,
            title: existingProj?.title || 'R&D Innovation Project',
            role: 'Lead Project Mentor'
          }
        }
      }
    );
  }

  if (chlId) {
    await UniversityChallenge.findOneAndUpdate(
      { challengeId: chlId },
      {
        $set: {
          assignedFaculty: {
            name: facultyInfo.name,
            department: facultyInfo.department || 'Engineering',
            email: facultyInfo.email || ''
          },
          status: 'Accepted'
        }
      }
    );

    const uniDoc = await MongooseUniversity.findOne({ code: (universityCode || '').toUpperCase() }).lean();
    const resolvedUniName = uniDoc?.name || uniDoc?.legalName || universityCode || 'Assigned University';

    await CitizenChallenge.findOneAndUpdate(
      { challengeId: chlId },
      {
        $set: {
          status: 'In Progress',
          'assignedUniversity.id': universityCode,
          'assignedUniversity.name': resolvedUniName,
          'assignedUniversity.department': facultyInfo.department || 'Engineering',
          'assignedUniversity.mentorName': facultyInfo.name,
          'assignedUniversity.acceptanceStatus': 'Accepted',
          'milestones.2.status': 'COMPLETED',
          'milestones.2.completedAt': new Date(),
          'milestones.2.remarks': `Assigned to Lead Faculty Mentor: ${facultyInfo.name} (${facultyInfo.department || 'R&D Lab'}) at ${resolvedUniName}`,
          'milestones.3.status': 'CURRENT',
          'milestones.3.remarks': `Faculty Mentor ${facultyInfo.name} leading solution execution and prototyping.`
        }
      }
    );
  }
}

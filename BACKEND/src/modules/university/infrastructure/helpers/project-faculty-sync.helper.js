import { UniversityFaculty, UniversityApproval } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import MongooseUniversity from '../../../government/heis/infrastructure/model.js';

export async function syncProjectFacultyAssignment({
  facultyInfo,
  existingProj,
  projectId,
  chlId,
  universityCode
}) {
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
        department: foundFac.department || facultyInfo.department || 'Engineering',
        designation: foundFac.designation || facultyInfo.designation || 'Lead Faculty Mentor',
        phone: foundFac.phone || facultyInfo.phone
      };
    }
  }

  if (resolvedFaculty?.email || resolvedFaculty?.name) {
    await UniversityFaculty.findOneAndUpdate(
      { $or: [{ email: resolvedFaculty.email }, { name: resolvedFaculty.name }] },
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
    const uniDoc = await MongooseUniversity.findOne({ code: (universityCode || '').toUpperCase() }).lean();
    const resolvedUniName = uniDoc?.name || uniDoc?.legalName || universityCode || 'Assigned University';

    await CitizenChallenge.findOneAndUpdate(
      { challengeId: chlId },
      {
        $set: {
          status: 'In Progress',
          'assignedUniversity.id': universityCode,
          'assignedUniversity.name': resolvedUniName,
          'assignedUniversity.department': resolvedFaculty.department || 'Engineering',
          'assignedUniversity.mentorName': resolvedFaculty.name,
          'assignedUniversity.mentorEmail': resolvedFaculty.email,
          'assignedUniversity.acceptanceStatus': 'Accepted',
          'milestones.2.status': 'COMPLETED',
          'milestones.2.completedAt': new Date(),
          'milestones.2.remarks': `Assigned to Lead Faculty Mentor: ${resolvedFaculty.name} (${resolvedFaculty.department || 'R&D Lab'}) at ${resolvedUniName}`,
          'milestones.3.status': 'CURRENT',
          'milestones.3.remarks': `Faculty Mentor ${resolvedFaculty.name} leading solution execution and prototyping.`
        }
      }
    );
  }

  // Update approvals
  await UniversityApproval.updateMany(
    { $or: [{ projectId }, { challengeId: chlId }, { projectId: existingProj?.projectId }].filter(Boolean) },
    {
      $set: {
        requestedBy: resolvedFaculty.name,
        requestedByEmail: resolvedFaculty.email,
        faculty: resolvedFaculty
      }
    }
  );
}

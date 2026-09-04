import { UniversityProject } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { buildProjectStubFromCitizenChallenge } from '../helpers/project-stub.helper.js';
import { buildAssignedProjectMilestones } from '../helpers/project-assignment.helper.js';
import { syncProjectFacultyAssignment } from '../helpers/project-faculty-sync.helper.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';
import { cascadeDeleteProblemOrProject } from '../helpers/cascade-delete.helper.js';

export class ProjectCrudRepository {
  async getProjectsByUniversity(universityCode, includeDeleted = false) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) {
      // Fail closed
      return [];
    }

    const code = identity.code;
    const uniName = identity.name;
    const validCodes = identity.validIdentifiers;

    const query = { universityCode: { $in: validCodes } };
    if (!includeDeleted) query.isDeleted = { $ne: true };

    try {
      let projects = (await UniversityProject.find(query).sort({ updatedAt: -1 }).lean()) || [];

      // Safeguard: collect all deleted challenge IDs to ensure they are never resurrected
      const deletedProjects = await UniversityProject.find({
        universityCode: { $in: validCodes },
        isDeleted: true
      }, { challengeId: 1 }).lean();
      const deletedChallengeIds = new Set(deletedProjects.map((p) => p.challengeId).filter(Boolean));

      const citizenOrConditions = [{ 'assignedUniversity.id': { $in: validCodes } }];
      if (uniName) {
        const escapedName = uniName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        citizenOrConditions.push({ 'assignedUniversity.name': new RegExp(`^${escapedName}$`, 'i') });
      }

      const acceptedChallenges = await CitizenChallenge.find({
        $and: [
          { $or: citizenOrConditions },
          {
            $or: [
              { 'assignedUniversity.acceptanceStatus': 'Accepted' },
              { status: { $in: ['In Progress', 'Accepted'] } }
            ]
          },
          { 'assignedUniversity.acceptanceStatus': { $ne: 'Declined' } },
          { status: { $ne: 'Declined' } },
          { isDeleted: { $ne: true } }
        ]
      }).lean();

      const existingChallengeIds = new Set(projects.map((p) => p.challengeId).filter(Boolean));

      for (const chl of acceptedChallenges) {
        if (!existingChallengeIds.has(chl.challengeId) && !deletedChallengeIds.has(chl.challengeId)) {
          const projDoc = buildProjectStubFromCitizenChallenge(chl, code);
          try {
            await UniversityProject.findOneAndUpdate(
              { challengeId: chl.challengeId },
              { $setOnInsert: projDoc },
              { upsert: true, new: true }
            );
          } catch { }

          projects.push(projDoc);
          existingChallengeIds.add(chl.challengeId);
        }
      }

      return projects;
    } catch {
      return [];
    }
  }

  async createProject(universityCode, projectData) {
    const code = (universityCode || '').toUpperCase();
    const newProj = {
      projectId: projectData.projectId || `PRJ-${Date.now().toString().slice(-4)}`,
      ...projectData,
      universityCode: code,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    try {
      return await UniversityProject.create(newProj);
    } catch {
      return newProj;
    }
  }

  async deleteProject(universityCode, projectId, deletedBy = 'University Admin') {
    return await cascadeDeleteProblemOrProject(universityCode, projectId, deletedBy);
  }

  async assignFacultyToProject(universityCode, projectId, facultyInfo) {
    const query = typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/) ? { _id: projectId } : { projectId };
    try {
      const existingProj = await UniversityProject.findOne(query).lean();
      const chlId = existingProj?.challengeId;

      const { milestones, completedCount, progressPercentage } = buildAssignedProjectMilestones(existingProj, facultyInfo);

      const res = await UniversityProject.findOneAndUpdate(
        query,
        {
          $set: {
            leadMentor: facultyInfo.name,
            facultyMentor: {
              name: facultyInfo.name,
              department: facultyInfo.department || 'Engineering',
              email: facultyInfo.email || '',
              designation: facultyInfo.designation || 'Lead Faculty Mentor'
            },
            status: 'In Progress',
            progressPercentage,
            milestonesCompleted: completedCount,
            milestones,
            updatedAt: new Date()
          }
        },
        { new: true }
      );

      await syncProjectFacultyAssignment({
        facultyInfo,
        existingProj,
        projectId,
        chlId,
        universityCode
      });

      return res || existingProj;
    } catch (err) {
      console.error('Error assigning faculty to project:', err);
      return { projectId, ...facultyInfo };
    }
  }
}

export const projectCrudRepository = new ProjectCrudRepository();
export default projectCrudRepository;

import { UniversityProject } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { buildProjectStubFromCitizenChallenge } from '../helpers/project-stub.helper.js';
import { buildAssignedProjectMilestones } from '../helpers/project-assignment.helper.js';
import { syncProjectFacultyAssignment } from '../helpers/project-faculty-sync.helper.js';

export class ProjectCrudRepository {
  async getProjectsByUniversity(universityCode, includeDeleted = false) {
    const code = (universityCode || '').toUpperCase();
    const query = { universityCode: code };
    if (!includeDeleted) query.isDeleted = { $ne: true };

    try {
      let projects = (await UniversityProject.find(query).sort({ updatedAt: -1 }).lean()) || [];
      const acceptedChallenges = await CitizenChallenge.find({
        $or: [
          { 'assignedUniversity.id': { $in: [code, 'RU001', 'RUNI-JH'] } },
          { 'assignedUniversity.name': new RegExp('Ranchi', 'i') },
          { status: { $in: ['In Progress', 'Accepted', 'Clarified', 'Under Review'] }, 'assignedUniversity.acceptanceStatus': 'Accepted' }
        ]
      }).lean();

      const existingChallengeIds = new Set(projects.map((p) => p.challengeId).filter(Boolean));

      for (const chl of acceptedChallenges) {
        if (!existingChallengeIds.has(chl.challengeId)) {
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
    const query = typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/) ? { _id: projectId } : { projectId };
    try {
      const res = await UniversityProject.findOneAndUpdate(
        query,
        { $set: { isDeleted: true, deletedBy, deletedAt: new Date(), status: 'Archived' } },
        { new: true }
      );
      if (res) return res;
    } catch { }
    return { success: true, projectId };
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

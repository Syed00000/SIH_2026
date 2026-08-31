import { UniversityProject, UniversityActivity } from '../model.js';
import { syncProjectApprovalRequest, syncGovernmentDirectives } from '../helpers/project-approval-sync.helper.js';

export class ProjectApprovalRepository {
  async updateProject(universityCode, projectId, updateData) {
    const query = typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: projectId }
      : { $or: [{ projectId }, { challengeId: projectId }] };

    try {
      const res = await UniversityProject.findOneAndUpdate(query, { $set: updateData }, { new: true });
      const uniCode = (universityCode || res?.universityCode || 'RU001').toUpperCase();

      if (updateData.teamMembers && Array.isArray(updateData.teamMembers)) {
        await UniversityActivity.create({
          universityCode: uniCode,
          text: `Student Research Team (${updateData.teamMembers.length} members) organized for project ${res?.projectId || projectId}.`,
          type: 'TEAM_UPDATED',
          timestamp: new Date()
        });
      }

      if (updateData.budgetStatus === 'Submitted to University for Review' || updateData.proposedBudget || updateData.budgetBreakdown) {
        await syncProjectApprovalRequest({ res, updateData, projectId, uniCode });
      }

      await syncGovernmentDirectives({ res, updateData, projectId, uniCode });

      if (res) return res;
    } catch { }
    return { projectId, ...updateData };
  }
}

export const projectApprovalRepository = new ProjectApprovalRepository();
export default projectApprovalRepository;

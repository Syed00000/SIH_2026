import { UniversityProject, UniversityActivity } from '../model.js';
import { syncProjectApprovalRequest, syncGovernmentDirectives } from '../helpers/project-approval-sync.helper.js';

export class ProjectApprovalRepository {
  async updateProject(universityCode, projectId, updateData) {
    const query = typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: projectId }
      : { $or: [{ projectId }, { challengeId: projectId }] };

    const cleanUpdate = { ...updateData };
    delete cleanUpdate._id;
    delete cleanUpdate.__v;
    delete cleanUpdate.createdAt;
    delete cleanUpdate.updatedAt;

    try {
      const res = await UniversityProject.findOneAndUpdate(query, { $set: cleanUpdate }, { new: true });
      const uniCode = (universityCode || res?.universityCode || 'RU001').toUpperCase();

      if (cleanUpdate.teamMembers && Array.isArray(cleanUpdate.teamMembers)) {
        await UniversityActivity.create({
          universityCode: uniCode,
          text: `Student Research Team (${cleanUpdate.teamMembers.length} members) organized for project ${res?.projectId || projectId}.`,
          type: 'TEAM_UPDATED',
          timestamp: new Date()
        });
      }

      if (cleanUpdate.budgetStatus === 'Submitted to University for Review' || cleanUpdate.proposedBudget || cleanUpdate.budgetBreakdown) {
        await syncProjectApprovalRequest({ res, updateData: cleanUpdate, projectId, uniCode });
      }

      await syncGovernmentDirectives({ res, updateData: cleanUpdate, projectId, uniCode });

      if (res) return res;
    } catch (err) {
      console.error('ProjectApprovalRepository updateProject error:', err);
    }
    return { projectId, ...cleanUpdate };
  }
}

export const projectApprovalRepository = new ProjectApprovalRepository();
export default projectApprovalRepository;

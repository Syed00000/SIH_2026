import { UniversityProject, UniversityActivity } from '../model.js';
import { syncProjectApprovalRequest, syncGovernmentDirectives } from '../helpers/project-approval-sync.helper.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';

export class ProjectApprovalRepository {
  async updateProject(universityCode, projectId, updateData) {
    const identity = await findUniversityIdentity(universityCode);
    if (!identity) {
      throw new Error('Unauthorized: Invalid or unknown university identity');
    }

    const baseQuery = typeof projectId === 'string' && projectId.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: projectId }
      : { $or: [{ projectId }, { challengeId: projectId }] };

    // Strictly enforce tenant boundary: project MUST belong to the calling university
    const query = {
      ...baseQuery,
      universityCode: { $in: identity.validIdentifiers }
    };

    const cleanUpdate = { ...updateData };
    delete cleanUpdate._id;
    delete cleanUpdate.__v;
    delete cleanUpdate.createdAt;
    delete cleanUpdate.updatedAt;

    try {
      const res = await UniversityProject.findOneAndUpdate(query, { $set: cleanUpdate }, { new: true });
      if (!res) {
        return null;
      }

      const uniCode = identity.code;

      if (cleanUpdate.teamMembers && Array.isArray(cleanUpdate.teamMembers)) {
        const { UniversityTeam } = await import('../model.js');
        const teamCode = cleanUpdate.teamCode || res?.teamCode || `TEAM-${(res?.projectId || projectId).replace(/[^a-zA-Z0-9]/g, '')}`;
        const teamName = cleanUpdate.studentTeam || cleanUpdate.teamName || res?.studentTeam || `${res?.title || 'Innovation'} Research Team`;
        const leadMember = cleanUpdate.teamMembers.find((m) => m.isLead) || cleanUpdate.teamMembers[0];
        const leaderName = cleanUpdate.studentLead || leadMember?.name || 'Student Team Lead';
        const mentorName = res?.leadMentor || res?.facultyMentor?.name || 'Faculty Mentor';
        const department = leadMember?.department || res?.facultyMentor?.department || 'Engineering';

        // Authoritative write path for UniversityTeam, strictly tenant-scoped
        await UniversityTeam.findOneAndUpdate(
          {
            $or: [
              { projectId: res.projectId, teamCode },
              { teamCode, universityCode: { $in: identity.validIdentifiers } },
              { projectId: res.projectId, universityCode: { $in: identity.validIdentifiers } }
            ]
          },
          {
            $set: {
              teamCode,
              universityCode: uniCode,
              projectId: res.projectId,
              challengeId: res.challengeId || '',
              projectTitle: res.title || '',
              project: res.title || res.projectId,
              name: teamName,
              leader: leaderName,
              mentor: mentorName,
              facultyMentorName: mentorName,
              department,
              membersCount: cleanUpdate.teamMembers.length,
              members: cleanUpdate.teamMembers,
              status: 'Active',
              nepCredits: '4 Credits'
            }
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        ).catch((err) => console.warn('UniversityTeam upsert error:', err.message));

        await UniversityActivity.create({
          universityCode: uniCode,
          text: `Student Research Team "${teamName}" (${cleanUpdate.teamMembers.length} members) organized for project ${res.projectId}.`,
          type: 'TEAM_UPDATED',
          timestamp: new Date()
        });
      }

      if (cleanUpdate.budgetStatus === 'Submitted to University for Review' || cleanUpdate.proposedBudget || cleanUpdate.budgetBreakdown || cleanUpdate.milestoneRoadmap) {
        await syncProjectApprovalRequest({ res, updateData: cleanUpdate, projectId, uniCode });
      }

      if (cleanUpdate.milestoneRoadmap && Array.isArray(cleanUpdate.milestoneRoadmap)) {
        const { UniversityApproval } = await import('../model.js');
        await UniversityApproval.updateMany(
          {
            $or: [
              { projectId: res?.projectId || projectId },
              { challengeId: res?.challengeId || projectId },
              { approvalId: `APP-${res?.projectId || projectId}` }
            ]
          },
          { $set: { milestoneRoadmap: cleanUpdate.milestoneRoadmap } }
        ).catch((err) => console.warn('Milestone roadmap sync to approval warning:', err.message));
      }

      await syncGovernmentDirectives({ res, updateData: cleanUpdate, projectId, uniCode });

      return res;
    } catch (err) {
      console.error('ProjectApprovalRepository updateProject error:', err);
      throw err;
    }
  }

  async updateBudgetBreakdown(universityCode, projectId, budgetData) {
    return this.updateProject(universityCode, projectId, {
      proposedBudget: budgetData.total || budgetData.proposedBudget,
      budgetBreakdown: budgetData.items || budgetData.breakdown || budgetData,
      budgetStatus: 'Submitted to University for Review',
      budgetSubmittedAt: new Date()
    });
  }
}

export const projectApprovalRepository = new ProjectApprovalRepository();
export default projectApprovalRepository;

import { UniversityApproval, UniversityProject, UniversityActivity } from '../model.js';

export class ApprovalActivityRepository {
  async getApprovalsByUniversity(universityCode) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityApproval.find({ universityCode: code }).sort({ date: -1 }).lean()) || [];
    } catch {
      return [];
    }
  }

  async updateApprovalStatus(approvalId, universityCode, status, remarks = '') {
    try {
      const res = await UniversityApproval.findOneAndUpdate(
        { approvalId },
        {
          $set: {
            status,
            adminRemarks: remarks,
            ...(status === 'Approved' ? { sentToGovernment: true, governmentStatus: 'Under State Evaluation' } : {})
          },
          $push: {
            history: {
              action: status === 'Approved' ? 'Approved by University Authority' : status === 'Changes Required' ? 'Changes Requested' : 'Rejected',
              performedBy: 'University Nodal Officer',
              timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
              note: remarks || (status === 'Approved' ? 'Proposal approved and forwarded to Government for grant sanction.' : 'Review decision updated.')
            }
          }
        },
        { new: true }
      );

      if (res) {
        const projId = res.projectId || approvalId.replace('APP-', '');
        const isPrototype = res.type === 'Prototype Approval' || res.type === 'PROTOTYPE_SUBMISSION';

        let newBudgetStatus = 'Submitted to University for Review';
        let progressPct = 43;
        let milestonesDone = 3;

        if (status === 'Approved' || status === 'APPROVED') {
          newBudgetStatus = isPrototype ? 'Prototype Approved & Shipped to Government' : 'Forwarded to Government for Grant Sanction';
          progressPct = isPrototype ? 85 : 57;
          milestonesDone = isPrototype ? 6 : 4;
        } else if (status === 'Changes Required') {
          newBudgetStatus = isPrototype ? 'Prototype Changes Required by University' : 'Changes Required by University';
        } else if (status === 'Rejected') {
          newBudgetStatus = isPrototype ? 'Prototype Rejected by University' : 'Rejected by University';
        }

        const projectUpdate = {
          budgetStatus: newBudgetStatus,
          adminRemarks: remarks,
          progressPercentage: progressPct,
          milestonesCompleted: milestonesDone
        };

        if (isPrototype) {
          projectUpdate.prototypeStatus = status;
          if (status === 'Approved') {
            projectUpdate.sentToGovernment = true;
            projectUpdate.governmentStatus = 'Under State Evaluation';
            projectUpdate.forwardedToGovAt = new Date();
            projectUpdate.trlLevel = 'TRL-4';
          }
        }

        await UniversityProject.findOneAndUpdate(
          { $or: [{ projectId: projId }, { challengeId: projId }] },
          { $set: projectUpdate }
        );

        await UniversityActivity.create({
          universityCode: (universityCode || 'RU001').toUpperCase(),
          text: `${isPrototype ? 'Prototype Blueprint' : 'R&D Proposal'} for "${res.project}" review decision: ${status.toUpperCase()} by University Authority.${remarks ? ` Remarks: "${remarks}"` : ''}${status === 'Approved' ? ' Forwarded to Government (DHTE) for state evaluation.' : ''}`,
          type: status === 'Approved' ? 'PROTOTYPE_APPROVED' : 'PROPOSAL_REVIEWED',
          timestamp: new Date()
        });
      }

      if (res) return res;
    } catch (err) {
      console.error('updateApprovalStatus error:', err);
    }
    return { approvalId, status };
  }

  async deleteApproval(approvalId) {
    try {
      await UniversityApproval.findOneAndDelete({
        $or: [{ approvalId }, { _id: approvalId }]
      });
      return { success: true };
    } catch (err) {
      console.warn('Error deleting approval in DB:', err);
      return { success: false };
    }
  }

  async getActivitiesByUniversity(universityCode, limit = 10) {
    const code = (universityCode || '').toUpperCase();
    try {
      return (await UniversityActivity.find({ universityCode: code }).sort({ timestamp: -1 }).limit(limit).lean()) || [];
    } catch {
      return [];
    }
  }

  async clearActivities(universityCode) {
    const code = (universityCode || 'RU001').toUpperCase();
    try {
      await UniversityActivity.deleteMany({ universityCode: code });
      return { success: true, message: 'All activities cleared' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const approvalActivityRepository = new ApprovalActivityRepository();
export default approvalActivityRepository;

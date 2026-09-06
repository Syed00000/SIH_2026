import mongoose from 'mongoose';
import { UniversityApproval, UniversityProject, UniversityActivity } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';
import { syncBidirectionalProjectApprovals } from '../helpers/project-approval-sync.helper.js';
import { isApprovalEligible, formatApprovalRecord } from '../helpers/approval-filter.helper.js';

export class ApprovalActivityRepository {
  async getApprovalsByUniversity(universityCode) {
    const code = (universityCode || 'RU001').toUpperCase();
    try {
      await syncBidirectionalProjectApprovals(code);
      const identity = await findUniversityIdentity(code);
      const validCodes = identity?.validIdentifiers || [code];
      const approvals = (await UniversityApproval.find({ universityCode: { $in: validCodes } }).sort({ date: -1 }).lean()) || [];
      if (!approvals.length) return [];
      const pids = approvals.map((a) => a.projectId || a.challengeId).filter(Boolean);
      const cids = approvals.map((a) => a.challengeId).filter(Boolean);

      const [projects, challenges] = await Promise.all([
        UniversityProject.find({
          $or: [{ projectId: { $in: pids } }, { challengeId: { $in: pids } }]
        }).select('projectId challengeId milestoneRoadmap methodology sanctionedBudget disbursedAmount budgetStatus trancheRequest isDeleted status leadMentor facultyMentor budgetBreakdown testingCompleted').lean(),
        CitizenChallenge.find({ challengeId: { $in: cids } }).select('challengeId acceptanceStatus assignedUniversity status isDeleted').lean()
      ]);

      const projMap = new Map();
      projects.forEach((p) => {
        if (p.projectId) projMap.set(p.projectId, p);
        if (p.challengeId) projMap.set(p.challengeId, p);
      });

      const challengeMap = new Map();
      challenges.forEach((c) => {
        if (c.challengeId) challengeMap.set(c.challengeId, c);
      });

      return approvals
        .filter((a) => {
          const proj = projMap.get(a.projectId) || projMap.get(a.challengeId);
          const chl = challengeMap.get(a.challengeId) || challengeMap.get(proj?.challengeId);
          return isApprovalEligible({ a, proj, chl });
        })
        .map((a) => {
          const proj = projMap.get(a.projectId) || projMap.get(a.challengeId);
          return formatApprovalRecord(a, proj);
        });
    } catch { return []; }
  }

  async updateApprovalStatus(approvalId, universityCode, status, remarks = '', extraData = {}) {
    try {
      const setFields = {
        status, adminRemarks: remarks,
        ...(status === 'Approved' ? { sentToGovernment: true, governmentStatus: 'Under State Evaluation' } : {}),
        ...extraData
      };
      if (extraData.proposedBudget || extraData.budget) {
        setFields.proposedBudget = extraData.proposedBudget || extraData.budget;
        setFields.estimatedBudget = setFields.proposedBudget;
      }

      const res = await UniversityApproval.findOneAndUpdate(
        {
          $or: [
            { approvalId },
            { projectId: approvalId },
            { challengeId: approvalId },
            ...(mongoose.Types.ObjectId.isValid(approvalId) ? [{ _id: approvalId }] : [])
          ]
        },
        {
          $set: setFields,
          $push: {
            history: {
              action: `Status marked ${status} by University Authority`,
              performedBy: 'University Review Board',
              timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
              note: remarks || `Proposal evaluated and status set to ${status}.`
            }
          }
        },
        { new: true }
      );

      if (res?.projectId || res?.challengeId || approvalId) {
        const projId = res?.projectId || res?.challengeId || approvalId;
        const isPrototype = res?.type?.includes('Prototype');
        const projectUpdate = { universityRemarks: remarks };
        if (isPrototype) {
          projectUpdate.prototypeStatus = status === 'Approved' ? 'Ready for Deployment' : status === 'Changes Required' ? 'Changes Required by University' : 'Under Review';
          if (status === 'Approved') {
            projectUpdate.sentToGovernment = true;
            projectUpdate.governmentStatus = 'Under State Evaluation';
            projectUpdate.milestonesCompleted = 6;
            projectUpdate.progressPercentage = 86;
          }
        } else {
          projectUpdate.adminRemarks = remarks;
          if (status === 'Approved') {
            projectUpdate.budgetStatus = 'Forwarded to CSR Grants Pipeline';
            projectUpdate.sentToGovernment = true;
            projectUpdate.governmentStatus = 'Under State Evaluation';
            projectUpdate.milestonesCompleted = 4;
            projectUpdate.progressPercentage = 57;
            projectUpdate.forwardedToGovAt = new Date();
            projectUpdate['milestones.3.status'] = 'Completed';
            projectUpdate['milestones.3.completedAt'] = new Date();
            projectUpdate['milestones.4.status'] = 'In Progress';
            if (setFields.proposedBudget) { projectUpdate.proposedBudget = setFields.proposedBudget; projectUpdate.budget = setFields.proposedBudget; }
          } else if (status === 'Changes Required') {
            projectUpdate.budgetStatus = 'Changes Required by University';
          }
        }

        await UniversityProject.findOneAndUpdate(
          {
            $or: [
              { projectId: projId }, { challengeId: projId }, { projectId: res.projectId }, { challengeId: res.challengeId },
              { challengeId: res.approvalId?.replace('APP-PRJ-', 'CHL-JH-2026-') }, { projectId: res.approvalId?.replace('APP-', '') }
            ].filter(Boolean)
          },
          { $set: projectUpdate }
        );

        if (status === 'Approved') {
          const { CitizenChallenge } = await import('../../../citizen/infrastructure/model.js');
          const targetCid = res?.challengeId || projId;
          await CitizenChallenge.findOneAndUpdate(
            { $or: [{ challengeId: targetCid }, { challengeId: res?.approvalId?.replace('APP-PRJ-', 'CHL-JH-2026-') }].filter(Boolean) },
            {
              $set: {
                'milestones.3.status': 'COMPLETED',
                'milestones.3.completedAt': new Date(),
                'milestones.3.remarks': `R&D Proposal Approved by University Review Board. Forwarded to Government (DHTE) for state grant sanction.`,
                'milestones.4.status': 'CURRENT',
                'milestones.4.remarks': 'Under Government (DHTE) State Grant Evaluation.'
              }
            }
          ).catch(() => {});
        }

        const stStr = String(status || 'Approved');
        const activityText = stStr === 'Changes Required'
          ? `University Authority requested revision for "${res.project}". Feedback: "${remarks || 'Please revise methodology and line-item budget.'}"`
          : `${isPrototype ? 'Prototype Blueprint' : 'R&D Proposal'} for "${res.project}" review decision: ${stStr.toUpperCase()} by University Authority.${remarks ? ` Remarks: "${remarks}"` : ''}${stStr === 'Approved' ? ' Forwarded to Government (DHTE) for state evaluation.' : ''}`;

        await UniversityActivity.create({
          universityCode: (universityCode || 'RU001').toUpperCase(),
          text: activityText,
          type: stStr === 'Changes Required' ? 'directive' : stStr === 'Approved' ? 'PROTOTYPE_APPROVED' : 'PROPOSAL_REVIEWED',
          timestamp: new Date()
        }).catch(() => {});
      }
      if (res) return res;
    } catch (err) { console.error('updateApprovalStatus error:', err); }
    return { approvalId, status };
  }

  async deleteApproval(approvalId) {
    try {
      await UniversityApproval.deleteMany({
        $or: [{ approvalId }, { projectId: approvalId }, { challengeId: approvalId }, ...(mongoose.Types.ObjectId.isValid(approvalId) ? [{ _id: approvalId }] : [])]
      });
      return { success: true };
    } catch (err) { return { success: false, error: err.message }; }
  }

  async getActivitiesByUniversity(code, limit = 100) {
    try { return (await UniversityActivity.find({ universityCode: (code || '').toUpperCase() }).sort({ timestamp: -1 }).limit(limit).lean()) || []; } catch { return []; }
  }

  async clearActivities(universityCode) {
    try {
      const identity = await findUniversityIdentity((universityCode || 'RU001').trim());
      const codePatterns = Array.from(new Set([(universityCode || 'RU001').toUpperCase(), 'RU001', 'U-0205', 'RUNI-JH', ...(identity?.validIdentifiers || [])])).filter(Boolean).map((c) => new RegExp(`^${c}$`, 'i'));
      const q = { $or: [{ universityCode: { $in: codePatterns } }, { universityCode: null }, { universityCode: '' }] };
      await Promise.all([
        UniversityActivity.deleteMany({ $or: [{ universityCode: { $in: codePatterns } }, { universityCode: null }, { universityCode: '' }, { universityCode: { $exists: false } }] }),
        UniversityProject.updateMany(q, { $set: { adminRemarks: '', universityRemarks: '', budgetStatus: 'Submitted to University for Review' } }),
        UniversityApproval.deleteMany(q)
      ]);
      return { success: true, message: 'All activities and approval records deleted from database' };
    } catch (err) { return { success: false, error: err.message }; }
  }
}

export const approvalActivityRepository = new ApprovalActivityRepository();
export default approvalActivityRepository;

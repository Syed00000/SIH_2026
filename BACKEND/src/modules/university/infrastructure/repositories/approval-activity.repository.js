import mongoose from 'mongoose';
import { UniversityApproval, UniversityProject, UniversityActivity } from '../model.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';
export class ApprovalActivityRepository {
  async getApprovalsByUniversity(universityCode) {
    const code = (universityCode || '').toUpperCase();
    try {
      const approvals = (await UniversityApproval.find({ universityCode: code }).sort({ date: -1 }).lean()) || [];
      if (!approvals.length) return [];

      const pids = approvals.map((a) => a.projectId || a.challengeId).filter(Boolean);
      if (!pids.length) return approvals;

      const projects = await UniversityProject.find({
        $or: [{ projectId: { $in: pids } }, { challengeId: { $in: pids } }]
      }).select('projectId challengeId milestoneRoadmap methodology').lean();

      const projMap = new Map();
      projects.forEach((p) => {
        if (p.projectId) projMap.set(p.projectId, p);
        if (p.challengeId) projMap.set(p.challengeId, p);
      });
      return approvals.map((a) => {
        const proj = projMap.get(a.projectId) || projMap.get(a.challengeId);
        const roadmap = (a.milestoneRoadmap?.length) ? a.milestoneRoadmap : (proj?.milestoneRoadmap?.length ? proj.milestoneRoadmap : []);
        const bBreakdown = (a.budgetBreakdown?.length) ? a.budgetBreakdown : (proj?.budgetBreakdown || []);
        const bSum = bBreakdown.reduce((s, it) => s + (typeof it.amount === 'number' ? it.amount : Number(String(it.amount || '0').replace(/[^\d]/g, '')) || 0), 0);
        const bTotal = bSum > 0 ? `₹ ${bSum.toLocaleString('en-IN')}` : (a.proposedBudget || a.estimatedBudget || proj?.proposedBudget || '₹ 80,000');
        const bExtra = bSum > 0 ? Math.max(0, bSum - 80000) : (a.additionalAmount || proj?.additionalAmount || 0);
        return {
          ...a,
          budgetBreakdown: bBreakdown,
          proposedBudget: bTotal,
          estimatedBudget: bTotal,
          additionalAmount: bExtra,
          milestoneRoadmap: roadmap,
          methodology: a.methodology || proj?.methodology || ''
        };
      });
    } catch {
      return [];
    }
  }

  async updateApprovalStatus(approvalId, universityCode, status, remarks = '', extraData = {}) {
    try {
      const setFields = {
        status,
        adminRemarks: remarks,
        ...(status === 'Approved' ? { sentToGovernment: true, governmentStatus: 'Under State Evaluation' } : {})
      };
      if (extraData.additionalAmount) setFields.additionalAmount = extraData.additionalAmount;
      if (extraData.proposedBudget || extraData.budget) {
        setFields.proposedBudget = extraData.proposedBudget || extraData.budget;
        setFields.estimatedBudget = extraData.proposedBudget || extraData.budget;
      }
      if (extraData.budgetBreakdown?.length) setFields.budgetBreakdown = extraData.budgetBreakdown;

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
          universityRemarks: remarks,
          progressPercentage: progressPct,
          milestonesCompleted: milestonesDone
        };

        if (status === 'Approved' || status === 'APPROVED') {
          if (!isPrototype) {
            projectUpdate.sentToGovernment = true;
            projectUpdate.governmentStatus = 'Under State Evaluation';
            projectUpdate.forwardedToGovAt = new Date();
            const bVal = res.proposedBudget || res.estimatedBudget || res.budget;
            if (bVal) { projectUpdate.budget = bVal; projectUpdate.proposedBudget = bVal; projectUpdate.sanctionedBudget = bVal; }
            if (res.budgetBreakdown?.length) projectUpdate.budgetBreakdown = res.budgetBreakdown;
            if (res.additionalAmount) projectUpdate.additionalAmount = res.additionalAmount;
            if (res.methodology) projectUpdate.methodology = res.methodology;
            if (res.milestoneRoadmap?.length) projectUpdate.milestoneRoadmap = res.milestoneRoadmap;
          }
        }

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
          {
            $or: [
              { projectId: projId },
              { challengeId: projId },
              { projectId: res.projectId },
              { challengeId: res.challengeId },
              { challengeId: res.approvalId?.replace('APP-PRJ-', 'CHL-JH-2026-') },
              { projectId: res.approvalId?.replace('APP-', '') }
            ].filter(Boolean)
          },
          { $set: projectUpdate }
        );

        const activityText = status === 'Changes Required'
          ? `University Authority requested revision for "${res.project}". Feedback: "${remarks || 'Please revise methodology and line-item budget.'}"`
          : `${isPrototype ? 'Prototype Blueprint' : 'R&D Proposal'} for "${res.project}" review decision: ${status.toUpperCase()} by University Authority.${remarks ? ` Remarks: "${remarks}"` : ''}${status === 'Approved' ? ' Forwarded to Government (DHTE) for state evaluation.' : ''}`;

        await UniversityActivity.create({
          universityCode: (universityCode || 'RU001').toUpperCase(),
          text: activityText,
          type: status === 'Changes Required' ? 'directive' : status === 'Approved' ? 'PROTOTYPE_APPROVED' : 'PROPOSAL_REVIEWED',
          timestamp: new Date()
        }).catch(() => {});
      }
      if (res) return res;
    } catch (err) {
      console.error('updateApprovalStatus error:', err);
    }
    return { approvalId, status };
  }

  async deleteApproval(approvalId) {
    try {
      await UniversityApproval.deleteMany({
        $or: [{ approvalId }, { projectId: approvalId }, { challengeId: approvalId }, ...(mongoose.Types.ObjectId.isValid(approvalId) ? [{ _id: approvalId }] : [])]
      });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  async getActivitiesByUniversity(code, limit = 100) {
    try { return (await UniversityActivity.find({ universityCode: (code || '').toUpperCase() }).sort({ timestamp: -1 }).limit(limit).lean()) || []; }
    catch { return []; }
  }

  async clearActivities(universityCode) {
    try {
      const identity = await findUniversityIdentity((universityCode || 'RU001').trim());
      const allCodes = Array.from(new Set([(universityCode || 'RU001').toUpperCase(), 'RU001', 'U-0205', 'RUNI-JH', ...(identity?.validIdentifiers || [])])).filter(Boolean);
      const codePatterns = allCodes.map((c) => new RegExp(`^${c}$`, 'i'));
      const q = { $or: [{ universityCode: { $in: codePatterns } }, { universityCode: null }, { universityCode: '' }] };
      const actQ = { $or: [{ universityCode: { $in: codePatterns } }, { universityCode: null }, { universityCode: '' }, { universityCode: { $exists: false } }] };
      await Promise.all([
        UniversityActivity.deleteMany(actQ),
        UniversityProject.updateMany(q, { $set: { adminRemarks: '', universityRemarks: '', budgetStatus: 'Submitted to University for Review' } }),
        UniversityApproval.deleteMany(q)
      ]);
      return { success: true, message: 'All activities and approval records deleted from database' };
    } catch (err) { return { success: false, error: err.message }; }
  }
}

export const approvalActivityRepository = new ApprovalActivityRepository();
export default approvalActivityRepository;

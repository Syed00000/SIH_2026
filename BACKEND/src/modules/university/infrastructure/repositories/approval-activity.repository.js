import mongoose from 'mongoose';
import { UniversityApproval, UniversityProject, UniversityActivity } from '../model.js';
import { findUniversityIdentity } from '../helpers/lookup.helper.js';
import { syncBidirectionalProjectApprovals } from '../helpers/project-approval-sync.helper.js';

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
      if (!pids.length) return approvals;

      const projects = await UniversityProject.find({
        $or: [{ projectId: { $in: pids } }, { challengeId: { $in: pids } }]
      }).select('projectId challengeId milestoneRoadmap methodology sanctionedBudget disbursedAmount budgetStatus trancheRequest isDeleted status leadMentor facultyMentor budgetBreakdown').lean();

      const projMap = new Map();
      projects.forEach((p) => {
        if (p.projectId) projMap.set(p.projectId, p);
        if (p.challengeId) projMap.set(p.challengeId, p);
      });

      return approvals
        .filter((a) => {
          if (a.type?.includes('Prototype')) return true;
          const proj = projMap.get(a.projectId) || projMap.get(a.challengeId);
          if (proj && (proj.isDeleted || proj.status === 'Transferred')) return false;
          const hasFaculty = Boolean(a.requestedBy || a.faculty?.name || proj?.leadMentor || proj?.facultyMentor?.name);
          const isSubmitted = (
            a.budgetStatus === 'Submitted to University for Review' ||
            a.budgetStatus === 'Grant Sanctioned by Government' ||
            a.budgetStatus === 'Grant Disbursed' ||
            a.budgetStatus === 'Changes Required by Government' ||
            proj?.budgetStatus === 'Submitted to University for Review' ||
            proj?.budgetStatus === 'Grant Sanctioned by Government' ||
            proj?.budgetStatus === 'Grant Disbursed' ||
            proj?.budgetStatus === 'Changes Required by Government' ||
            a.isRevised || proj?.isRevised ||
            (a.milestoneRoadmap?.length > 0 && a.budgetBreakdown?.length > 0) ||
            (proj?.milestoneRoadmap?.length > 0 && proj?.budgetBreakdown?.length > 0)
          );
          return hasFaculty && isSubmitted;
        })
        .map((a) => {
          const proj = projMap.get(a.projectId) || projMap.get(a.challengeId);
          const roadmap = (a.milestoneRoadmap?.length) ? a.milestoneRoadmap : (proj?.milestoneRoadmap?.length ? proj.milestoneRoadmap : []);
          const bBreakdown = (a.budgetBreakdown?.length) ? a.budgetBreakdown : (proj?.budgetBreakdown || []);
          const bSum = bBreakdown.reduce((s, it) => s + (typeof it.amount === 'number' ? it.amount : Number(String(it.amount || '0').replace(/[^\d]/g, '')) || 0), 0);
          const bTotal = bSum > 0 ? `₹ ${bSum.toLocaleString('en-IN')}` : (a.proposedBudget || a.estimatedBudget || proj?.proposedBudget || '₹ 80,000');
          const bExtra = bSum > 0 ? Math.max(0, bSum - 80000) : (a.additionalAmount || proj?.additionalAmount || 0);
          const isSanctioned = proj?.budgetStatus === 'Grant Sanctioned by Government' || proj?.budgetStatus === 'Grant Disbursed' || a.budgetStatus === 'Grant Sanctioned by Government' || a.budgetStatus === 'Grant Disbursed' || Boolean(a.sanctionOrderNo || proj?.sanctionOrderNo);
          const isChanges = proj?.budgetStatus === 'Changes Required by Government' || a.budgetStatus === 'Changes Required by Government' || a.status === 'Changes Required';
          const isRejected = proj?.status === 'Rejected' || proj?.budgetStatus === 'Rejected' || a.status === 'Rejected';
          const realStatus = isSanctioned ? 'Approved' : isChanges ? 'Changes Required' : isRejected ? 'Rejected' : 'Pending';

          return {
            ...a,
            status: realStatus,
            budgetBreakdown: bBreakdown,
            proposedBudget: bTotal,
            estimatedBudget: bTotal,
            sanctionedBudget: isSanctioned ? (a.sanctionedBudget || proj?.sanctionedBudget || bTotal) : null,
            disbursedAmount: a.disbursedAmount || proj?.disbursedAmount || '₹ 0',
            budgetStatus: isSanctioned ? (a.budgetStatus || proj?.budgetStatus || 'Grant Sanctioned by Government') : (proj?.budgetStatus || a.budgetStatus || 'Pending Review'),
            trancheRequest: a.trancheRequest || proj?.trancheRequest || null,
            additionalAmount: bExtra,
            milestoneRoadmap: roadmap,
            methodology: a.methodology || proj?.methodology || ''
          };
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
            projectUpdate.governmentStatus = 'Approved';
            projectUpdate.milestonesCompleted = 4;
            projectUpdate.progressPercentage = 57;
            projectUpdate.forwardedToGovAt = new Date();
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

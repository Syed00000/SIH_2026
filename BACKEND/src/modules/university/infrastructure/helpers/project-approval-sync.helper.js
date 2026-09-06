import { UniversityApproval, UniversityActivity } from '../model.js';

export async function syncProjectApprovalRequest({ res, updateData, projectId, uniCode }) {
  const approvalId = `APP-${res?.projectId || projectId || Date.now().toString().slice(-4)}`;
  const isRevision = updateData.isRevised || updateData.revisionCount > 0;
  const approvalType = isRevision ? `Re-Proposal (Revised v${updateData.revisionCount || 2})` : 'R&D Grant Proposal';

  await UniversityApproval.findOneAndUpdate(
    { approvalId },
    {
      $set: {
        approvalId, universityCode: uniCode,
        title: `${isRevision ? 'Revised ' : ''}R&D Grant Proposal & Line-Item Budget: ${res?.title || updateData.title || 'Innovation Project'}`,
        type: approvalType, isRevised: isRevision, revisionCount: updateData.revisionCount || (isRevision ? 2 : 1),
        project: res?.title || updateData.title || 'Innovation Project', projectId: res?.projectId || projectId, challengeId: res?.challengeId || '',
        requestedBy: res?.leadMentor || updateData.leadMentor || res?.facultyMentor?.name || 'Faculty Mentor',
        requestedByDept: res?.facultyMentor?.department || 'Engineering',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        dateTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending', adminRemarks: '', universityRemarks: '',
        faculty: { name: res?.leadMentor || res?.facultyMentor?.name || 'Faculty Mentor', department: res?.facultyMentor?.department || 'Engineering' },
        team: { name: res?.studentTeam || 'Student Research Team', membersCount: res?.teamMembers?.length || 4 },
        startDate: res?.startDate || '20 May 2026', estimatedBudget: updateData.proposedBudget || updateData.budget || '₹ 80,000',
        proposedBudget: updateData.proposedBudget || updateData.budget || '₹ 80,000',
        additionalAmount: updateData.additionalAmount || 0, baselineBudget: updateData.baselineBudget || '₹ 80,000',
        methodology: updateData.methodology || res?.methodology || '', milestoneRoadmap: updateData.milestoneRoadmap || res?.milestoneRoadmap || [],
        budgetBreakdown: updateData.budgetBreakdown || res?.budgetBreakdown || [], supportTypes: ['Government Grant Funding', 'Lab Testing Bench'], documentsCount: 3
      },
      $push: {
        history: {
          action: isRevision ? `Re-Proposal Submitted (v${updateData.revisionCount || 2})` : 'Proposal Submitted by Faculty',
          performedBy: res?.leadMentor || 'Faculty Mentor',
          timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
          note: isRevision ? 'Faculty submitted revised research proposal & budget.' : `Itemized R&D Budget of ${updateData.proposedBudget || updateData.budget || '₹ 80,000'} submitted for review.`
        }
      }
    },
    { upsert: true, new: true }
  );

  await UniversityActivity.create({
    universityCode: uniCode,
    text: isRevision
      ? `Re-Proposal (Revised v${updateData.revisionCount || 2}) submitted by Faculty for "${res?.title || projectId}". Action required by University Authority.`
      : `R&D Grant Proposal & Line-Item Budget (${updateData.proposedBudget || updateData.budget || 'Submitted'}) formulated for project ${res?.projectId || projectId}.`,
    type: isRevision ? 'RE_PROPOSAL_SUBMITTED' : 'PROPOSAL_SUBMITTED', timestamp: new Date()
  });
}

export async function syncGovernmentDirectives({ res, updateData, projectId, uniCode }) {
  if (updateData.budgetStatus === 'Changes Required by Government') {
    const approvalId = `APP-${res?.projectId || projectId || ''}`;
    const note = updateData.governmentRemarks || updateData.adminRemarks || 'Government Authority requested line-item revision.';
    await UniversityApproval.findOneAndUpdate(
      { approvalId },
      {
        $set: { status: 'Changes Required', adminRemarks: `Government Directive: ${note}`, governmentRemarks: note },
        $push: {
          history: {
            action: 'Clarification Requested by Government', performedBy: 'Government Authority',
            timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
            note
          }
        }
      }
    );
    await UniversityActivity.create({
      universityCode: uniCode, text: `⚠️ Government Authority requested proposal revision for "${res?.title || projectId}": ${note}`,
      type: 'GOVERNMENT_REVISION_REQUESTED', timestamp: new Date()
    });
  }

  const isGrantDisbursed = updateData.budgetStatus === 'Grant Sanctioned by Government' ||
    updateData.budgetStatus === 'Grant Disbursed' ||
    (typeof updateData.budgetStatus === 'string' && updateData.budgetStatus.includes('Grant Disbursed'));
  if (isGrantDisbursed) {
    try {
      const { syncGrantSanctionAndDisbursal } = await import('../../../government/grants/grant-stage-sync.helper.js');
      await syncGrantSanctionAndDisbursal({
        projectId: res?.projectId || projectId,
        challengeId: res?.challengeId,
        rawAmount: Number(String(updateData.disbursedAmount || '0').replace(/[^\d]/g, '')) || 40000,
        formattedAmount: updateData.disbursedAmount,
        sanctionOrderNo: updateData.sanctionOrderNo,
        universityCode: uniCode
      });
    } catch (e) {
      console.warn('syncGrantSanctionAndDisbursal warning:', e);
    }
  }
}

export async function syncBidirectionalProjectApprovals(uniCode = 'RU001') {
  try {
    const code = (uniCode || 'RU001').toUpperCase();
    const { UniversityProject } = await import('../model.js');
    const { CitizenChallenge } = await import('../../../citizen/infrastructure/model.js');
    const { GovernmentGrantPayment } = await import('../../../government/grants/model.js');
    const { findUniversityIdentity } = await import('./lookup.helper.js');
    const { isChallengeAcceptedByUniversity } = await import('./approval-filter.helper.js');
    const identity = await findUniversityIdentity(code);
    const validCodes = identity?.validIdentifiers || [code];

    const [projects, approvals, payments, rawChallenges] = await Promise.all([
      UniversityProject.find({ universityCode: { $in: validCodes } }).lean(),
      UniversityApproval.find({ universityCode: { $in: validCodes } }).lean(),
      GovernmentGrantPayment.find({ bankStatus: 'success' }).lean().catch(() => []),
      CitizenChallenge.find({ $or: [{ 'assignedUniversity.id': { $in: validCodes } }, { 'assignedUniversity.name': new RegExp(`^${identity?.name || code}$`, 'i') }] }).select('challengeId acceptanceStatus assignedUniversity status isDeleted').lean().catch(() => [])
    ]);

    const acceptedChallengeIds = new Set(rawChallenges.filter(isChallengeAcceptedByUniversity).map((c) => c.challengeId).filter(Boolean));
    const validProjectIds = new Set(projects.filter((p) => !p.isDeleted && p.status !== 'Transferred').map((p) => p.projectId).filter(Boolean));

    for (const a of approvals) {
      if (a.type?.includes('Prototype')) continue;
      const hasAcceptedChallenge = a.challengeId && acceptedChallengeIds.has(a.challengeId);
      const hasValidProject = a.projectId && validProjectIds.has(a.projectId);
      if (!hasAcceptedChallenge && !hasValidProject) {
        await UniversityApproval.deleteOne({ _id: a._id }).catch(() => {});
      }
    }

    for (const p of projects) {
      if (p.isDeleted || p.status === 'Transferred' || (p.challengeId && !acceptedChallengeIds.has(p.challengeId))) {
        await UniversityApproval.deleteMany({ $or: [{ projectId: p.projectId }, { challengeId: p.challengeId }] }).catch(() => {});
        continue;
      }

      const hasFaculty = Boolean(p.leadMentor || p.facultyMentor?.name);
      const isProposalSubmitted = hasFaculty && (
        p.budgetStatus === 'Submitted to University for Review' ||
        p.budgetStatus === 'Grant Sanctioned by Government' ||
        p.budgetStatus === 'Grant Disbursed' ||
        p.budgetStatus === 'Changes Required by Government' ||
        p.isRevised === true ||
        (Array.isArray(p.budgetBreakdown) && p.budgetBreakdown.length > 0) ||
        (Array.isArray(p.milestoneRoadmap) && p.milestoneRoadmap.length > 0)
      );

      if (!isProposalSubmitted) {
        await UniversityApproval.deleteMany({
          $or: [{ projectId: p.projectId }, { challengeId: p.challengeId }],
          type: { $ne: 'Prototype Approval' }
        });
        continue;
      }

      const paySum = payments.filter((t) => t.projectRef === p.projectId || t.challengeId === p.challengeId).reduce((s, t) => s + (t.rawAmount || 0), 0);
      const disbStr = paySum > 0 ? `₹ ${paySum.toLocaleString('en-IN')}` : (p.disbursedAmount || '₹ 0');
      const isGovtApproved = paySum > 0 || p.budgetStatus === 'Grant Sanctioned by Government' || p.budgetStatus === 'Grant Disbursed' || Boolean(p.sanctionOrderNo);
      const isChangesReq = p.budgetStatus === 'Changes Required by Government';
      const isRejected = p.status === 'Rejected' || p.budgetStatus === 'Rejected';
      const realStatus = isGovtApproved ? 'Approved' : isChangesReq ? 'Changes Required' : isRejected ? 'Rejected' : 'Pending';

      await UniversityApproval.findOneAndUpdate(
        { $or: [{ projectId: p.projectId }, { challengeId: p.challengeId }] },
        {
          $setOnInsert: {
            approvalId: `APP-${p.projectId}`, universityCode: code, project: p.title || 'Grassroots Innovation Solution',
            projectId: p.projectId, challengeId: p.challengeId || '', title: `R&D Grant Proposal: ${p.title || p.projectId}`,
            type: 'R&D Grant Proposal', proposedBudget: p.proposedBudget || '₹ 80,000',
            estimatedBudget: p.proposedBudget || '₹ 80,000', trancheRequest: p.trancheRequest || null,
            requestedBy: p.leadMentor || 'Faculty Lead', faculty: { name: p.leadMentor || 'Faculty Lead', department: 'Engineering' },
            sentToGovernment: Boolean(isGovtApproved), governmentStatus: isGovtApproved ? 'Grant Sanctioned' : 'Pending University Review',
            date: new Date(p.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            documentsCount: 3
          },
          $set: {
            status: realStatus,
            budgetStatus: isGovtApproved ? (paySum > 0 ? 'Grant Disbursed' : 'Grant Sanctioned by Government') : (p.budgetStatus || 'Pending Review'),
            sanctionedBudget: isGovtApproved ? (p.sanctionedBudget || p.proposedBudget || '₹ 80,000') : null,
            disbursedAmount: disbStr
          }
        },
        { upsert: true }
      ).catch(() => {});
    }

    for (const a of approvals) {
      if (a.status === 'Approved' && a.projectId && (a.sanctionOrderNo || a.budgetStatus === 'Grant Sanctioned by Government')) {
        await UniversityProject.findOneAndUpdate(
          { $or: [{ projectId: a.projectId }, { challengeId: a.challengeId }] },
          {
            $setOnInsert: {
              projectId: a.projectId, challengeId: a.challengeId || '', title: a.project || a.title || 'Grassroots Innovation Solution',
              domain: 'Urban Development', status: 'In Progress', budgetStatus: a.budgetStatus || 'Grant Disbursed',
              sanctionedBudget: a.sanctionedBudget || a.proposedBudget || '₹ 80,000', proposedBudget: a.proposedBudget || '₹ 80,000',
              budget: a.sanctionedBudget || a.proposedBudget || '₹ 80,000', disbursedAmount: a.disbursedAmount || '₹ 80,000',
              sentToGovernment: true, governmentStatus: 'Under State Evaluation', leadMentor: a.requestedBy || a.faculty?.name || 'Faculty Lead',
              universityCode: code, trancheRequest: a.trancheRequest || null, progressPercentage: 100, milestonesCompleted: 7, milestonesTotal: 7
            }
          },
          { upsert: true }
        ).catch(() => {});
      }
    }
  } catch (err) { console.warn('Bidirectional sync warning:', err.message); }
}

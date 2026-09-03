import { UniversityApproval, UniversityActivity } from '../model.js';

export async function syncProjectApprovalRequest({ res, updateData, projectId, uniCode }) {
  const approvalId = `APP-${res?.projectId || projectId || Date.now().toString().slice(-4)}`;
  const isRevision = updateData.isRevised || updateData.revisionCount > 0;
  const approvalType = isRevision ? `Re-Proposal (Revised v${updateData.revisionCount || 2})` : 'R&D Grant Proposal';

  await UniversityApproval.findOneAndUpdate(
    { approvalId },
    {
      $set: {
        approvalId,
        universityCode: uniCode,
        title: `${isRevision ? 'Revised ' : ''}R&D Grant Proposal & Line-Item Budget: ${res?.title || updateData.title || 'Innovation Project'}`,
        type: approvalType,
        isRevised: isRevision,
        revisionCount: updateData.revisionCount || (isRevision ? 2 : 1),
        project: res?.title || updateData.title || 'Innovation Project',
        projectId: res?.projectId || projectId,
        challengeId: res?.challengeId || '',
        requestedBy: res?.leadMentor || updateData.leadMentor || res?.facultyMentor?.name || 'Faculty Mentor',
        requestedByDept: res?.facultyMentor?.department || 'Engineering',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        dateTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        adminRemarks: '',
        universityRemarks: '',
        faculty: { name: res?.leadMentor || res?.facultyMentor?.name || 'Faculty Mentor', department: res?.facultyMentor?.department || 'Engineering' },
        team: { name: res?.studentTeam || 'Student Research Team', membersCount: res?.teamMembers?.length || 4 },
        startDate: res?.startDate || '20 May 2026',
        estimatedBudget: updateData.proposedBudget || updateData.budget || '₹ 80,000',
        proposedBudget: updateData.proposedBudget || updateData.budget || '₹ 80,000',
        additionalAmount: updateData.additionalAmount || 0,
        baselineBudget: updateData.baselineBudget || '₹ 80,000',
        methodology: updateData.methodology || res?.methodology || '',
        milestoneRoadmap: updateData.milestoneRoadmap || res?.milestoneRoadmap || [],
        budgetBreakdown: updateData.budgetBreakdown || res?.budgetBreakdown || [],
        supportTypes: ['Government Grant Funding', 'Lab Testing Bench'],
        documentsCount: 3
      },
      $push: {
        history: {
          action: isRevision ? `Re-Proposal Submitted (v${updateData.revisionCount || 2})` : 'Proposal Submitted by Faculty',
          performedBy: res?.leadMentor || 'Faculty Mentor',
          timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
          note: isRevision
            ? 'Faculty submitted revised research proposal & budget in response to University Authority feedback.'
            : `Itemized R&D Budget of ${updateData.proposedBudget || updateData.budget || '₹ 80,000'} submitted for review.`
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
    type: isRevision ? 'RE_PROPOSAL_SUBMITTED' : 'PROPOSAL_SUBMITTED',
    timestamp: new Date()
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
            action: 'Clarification Requested by Government',
            performedBy: 'Government Authority',
            timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
            note
          }
        }
      }
    );

    await UniversityActivity.create({
      universityCode: uniCode,
      text: `⚠️ Government Authority requested proposal revision for "${res?.title || projectId}": ${note}`,
      type: 'GOVERNMENT_REVISION_REQUESTED',
      timestamp: new Date()
    });
  }

  if (updateData.budgetStatus === 'Grant Sanctioned by Government') {
    const approvalId = `APP-${res?.projectId || projectId || ''}`;
    const orderNo = updateData.sanctionOrderNo || 'JH-GOV-RD-2026-8842';
    const grantAmt = updateData.sanctionedBudget || updateData.budget || '₹ 75,000';

    await UniversityApproval.findOneAndUpdate(
      { approvalId },
      {
        $set: { status: 'Approved', sanctionOrderNo: orderNo, sanctionedBudget: grantAmt, adminRemarks: `Grant Sanctioned under Sanction Order ${orderNo}` },
        $push: {
          history: {
            action: 'Grant Sanctioned & Disbursed by Government',
            performedBy: 'State Innovation Council (Govt of Jharkhand)',
            timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
            note: `Sanction Order ${orderNo} approved for ${grantAmt}. Escrow funds active.`
          }
        }
      }
    );

    await UniversityActivity.create({
      universityCode: uniCode,
      text: `🏛️ Grant sanctioned and funds released under Order ${orderNo} for "${res?.title || projectId}" (${grantAmt}).`,
      type: 'GRANT_SANCTIONED_BY_GOVERNMENT',
      timestamp: new Date()
    });
  }
}

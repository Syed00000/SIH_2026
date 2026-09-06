import { UniversityProject, UniversityApproval, UniversityActivity } from '../../university/infrastructure/model.js';
import { CitizenChallenge } from '../../citizen/infrastructure/model.js';

function getUpdatedProjectMilestones(currentMilestones = [], orderNo, cumFormatted) {
  const defaultMilestones = [
    { id: 1, title: 'Problem Statement Allocated & Scoped', status: 'Completed' },
    { id: 2, title: 'Lead Faculty Mentor Assigned', status: 'Completed' },
    { id: 3, title: 'Faculty Solution Analysis & Budget Proposal', status: 'Completed' },
    { id: 4, title: 'University Review & Submission to Government', status: 'Completed' },
    { id: 5, title: 'Government Budget Sanction & Grant Disbursal', status: 'In Progress' },
    { id: 6, title: 'Prototype Development & Field Testing', status: 'Pending' },
    { id: 7, title: 'Government Handover & Final Audit', status: 'Pending' }
  ];

  const source = currentMilestones.length >= 5 ? currentMilestones : defaultMilestones;
  return source.map((m) => {
    const id = m.id || m.step;
    if (id <= 4) {
      return { ...m, status: 'Completed', completedAt: m.completedAt || new Date() };
    }
    if (id === 5) {
      return {
        ...m,
        status: 'Completed',
        completedAt: new Date(),
        remarks: `Grant sanctioned (Order ${orderNo}). Released ${cumFormatted} via PFMS.`
      };
    }
    if (id === 6) {
      return { ...m, status: 'In Progress' };
    }
    return { ...m, status: m.status === 'Completed' ? 'Completed' : 'Pending' };
  });
}

function updateChallengeMilestones(challenge, sancFormatted, cumFormatted) {
  if (!challenge.milestones || challenge.milestones.length === 0) return;
  challenge.milestones.forEach((m) => {
    if (m.step <= 3) {
      m.status = 'COMPLETED';
      if (!m.completedAt) m.completedAt = new Date();
    } else if (m.step === 4) {
      m.status = 'COMPLETED';
      m.completedAt = m.completedAt || new Date();
      m.remarks = `R&D Proposal Approved & Grant Sanctioned by Govt (${sancFormatted}).`;
    } else if (m.step === 5) {
      m.status = 'CURRENT';
      m.remarks = `Grant Sanctioned and ${cumFormatted} Disbursed via PFMS. Active Prototype Development in progress.`;
    }
  });
}

export async function syncGrantSanctionAndDisbursal({
  projectId,
  challengeId,
  rawAmount = 40000,
  formattedAmount = '',
  utrNumber = '',
  sanctionOrderNo = '',
  universityCode = 'RU001'
}) {
  const pRef = projectId || challengeId || '';
  if (!pRef) return null;

  const project = await UniversityProject.findOne({
    $or: [
      { projectId: pRef },
      { challengeId: pRef },
      { projectId: pRef.replace('PROP-', '') },
      { _id: pRef.match(/^[0-9a-fA-F]{24}$/) ? pRef : null }
    ]
  });

  if (!project) return null;

  const uniCode = project.universityCode || universityCode || 'RU001';
  const prevDisb = Number(String(project.disbursedAmount || '0').replace(/[^\d]/g, '')) || 0;
  const newDisb = prevDisb > 0 && formattedAmount && formattedAmount.includes(String(prevDisb))
    ? prevDisb
    : prevDisb + Number(rawAmount || 0);
  const cumFormatted = formattedAmount || `₹ ${newDisb.toLocaleString('en-IN')}`;
  const totalBudget = Number(String(project.sanctionedBudget || project.proposedBudget || project.budget || '80000').replace(/[^\d]/g, '')) || 80000;
  const sancFormatted = project.sanctionedBudget || `₹ ${totalBudget.toLocaleString('en-IN')}`;
  const orderNo = sanctionOrderNo || project.sanctionOrderNo || `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const utr = utrNumber || `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

  const updatedMilestones = getUpdatedProjectMilestones(project.milestones, orderNo, cumFormatted);

  await UniversityProject.findByIdAndUpdate(project._id, {
    $set: {
      status: 'In Progress',
      budgetStatus: 'Grant Disbursed',
      sanctionedBudget: sancFormatted,
      disbursedAmount: cumFormatted,
      sanctionOrderNo: orderNo,
      milestonesCompleted: 5,
      milestonesTotal: 7,
      progressPercentage: 71,
      milestones: updatedMilestones,
      'trancheRequest.status': 'Disbursed',
      'trancheRequest.disbursedAt': new Date()
    }
  });

  const chalId = project.challengeId || challengeId;
  if (chalId) {
    const challenge = await CitizenChallenge.findOne({ challengeId: chalId });
    if (challenge) {
      challenge.status = 'In Progress';
      updateChallengeMilestones(challenge, sancFormatted, cumFormatted);
      await challenge.save();
    }
  }

  const approvalQuery = {
    $or: [
      { projectId: project.projectId },
      { challengeId: project.challengeId },
      { approvalId: `APP-${project.projectId}` }
    ]
  };

  const historyEntry = {
    action: 'Government Grant Sanctioned & 1st Tranche Disbursed',
    performedBy: 'State Innovation Council (Govt of Jharkhand)',
    timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
    note: `Sanction Order ${orderNo} approved for ${sancFormatted}. Disbursed ${cumFormatted} via PFMS (UTR: ${utr}).`
  };

  await UniversityApproval.updateMany(approvalQuery, {
    $set: {
      status: 'Approved',
      governmentStatus: 'Approved',
      budgetStatus: 'Grant Disbursed',
      sanctionOrderNo: orderNo,
      sanctionedBudget: sancFormatted,
      disbursedAmount: cumFormatted,
      adminRemarks: `Grant Sanctioned under Sanction Order ${orderNo}`
    },
    $push: { history: historyEntry }
  }).catch(() => {});

  await UniversityActivity.create({
    universityCode: uniCode,
    title: 'Government Grant Sanctioned & 1st Tranche Released',
    text: `🏛️ Govt (DHTE) sanctioned grant of ${sancFormatted} and released 1st tranche of ${cumFormatted} (UTR: ${utr}) for "${project.title}". Prototype Development stage is now active!`,
    description: `Sanction Order: ${orderNo}. Funds credited to university escrow.`,
    projectId: project.projectId,
    challengeId: project.challengeId || '',
    type: 'GRANT_SANCTIONED',
    timestamp: new Date()
  }).catch(() => {});

  return { project, orderNo, utr, cumFormatted, sancFormatted };
}

export default { syncGrantSanctionAndDisbursal };

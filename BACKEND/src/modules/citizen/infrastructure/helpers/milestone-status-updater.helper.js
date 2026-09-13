export function updateMilestonesForStatus(challenge, newStatus, remarks = '') {
  if (!challenge.milestones || challenge.milestones.length === 0) return;
  if (newStatus === 'Under Review') {
    challenge.milestones[0].status = 'COMPLETED';
    challenge.milestones[1].status = 'CURRENT';
    challenge.milestones[1].remarks = remarks || 'Under review by innovation cell';
  } else if (newStatus === 'In Progress') {
    challenge.milestones[0].status = 'COMPLETED';
    challenge.milestones[1].status = 'COMPLETED';
    challenge.milestones[2].status = 'COMPLETED';
    challenge.milestones[3].status = 'CURRENT';
    challenge.milestones[3].remarks = remarks || 'Assigned and solution in progress';
  } else if (newStatus === 'Resolved') {
    challenge.milestones.forEach((m) => {
      m.status = 'COMPLETED';
      if (!m.completedAt) m.completedAt = new Date();
    });
    if (challenge.milestones[4]) challenge.milestones[4].remarks = remarks || 'Successfully resolved and verified';
  } else if (newStatus === 'Withdrawn') {
    challenge.milestones[0].status = 'COMPLETED';
    if (challenge.milestones[1]) {
      challenge.milestones[1].status = 'CANCELLED';
      challenge.milestones[1].remarks = remarks || 'Problem statement withdrawn by citizen';
      challenge.milestones[1].completedAt = new Date();
    }
  }
}

export function applyMilestones(challenge, triageData, user) {
  if (!challenge.milestones || challenge.milestones.length < 4) return;
  challenge.milestones[0].status = 'COMPLETED';
  if (!challenge.milestones[0].completedAt) challenge.milestones[0].completedAt = new Date();

  challenge.milestones[1].status = 'COMPLETED';
  challenge.milestones[1].completedAt = new Date();
  challenge.milestones[1].remarks = triageData.remarks || 'Ground problem verified by State Nodal Cell.';
  challenge.milestones[1].updatedBy = user?.fullName || 'State Nodal Officer';

  if (triageData.assignedWard || challenge.assignedWard) {
    const wrd = triageData.assignedWard || challenge.assignedWard;
    challenge.milestones[1].title = 'Ward Assigned';
    challenge.milestones[1].remarks = `Assigned to ${wrd.name || 'Ward'} for local municipal resolution.`;
    challenge.milestones[2].title = 'Ward Action Initiated';
    challenge.milestones[2].status = 'CURRENT';
    challenge.milestones[2].remarks = `In charge: ${wrd.councillorName || 'Ward Councillor'}.`;
  } else if (triageData.assignedBlock || challenge.assignedBlock) {
    const blk = triageData.assignedBlock || challenge.assignedBlock;
    challenge.milestones[1].title = 'Block Assigned';
    challenge.milestones[1].remarks = `Assigned to ${blk.name || 'Block'} for local body administration.`;
    challenge.milestones[2].title = 'Block Action Initiated';
    challenge.milestones[2].status = 'CURRENT';
    challenge.milestones[2].remarks = `In charge: ${blk.bdoName || 'Block Development Officer'}.`;
  } else if (triageData.assignedDepartment || challenge.assignedDepartment) {
    const dept = triageData.assignedDepartment || challenge.assignedDepartment;
    challenge.milestones[1].title = `${dept.category || 'Department'} Assigned`;
    challenge.milestones[1].remarks = `Assigned to ${dept.name || 'Department'}`;
    challenge.milestones[2].title = 'Department Action Initiated';
    challenge.milestones[2].status = 'CURRENT';
    challenge.milestones[2].remarks = `In charge: ${dept.headName || 'Department Head'}.`;
  } else if (triageData.assignedUniversity?.id || challenge.assignedUniversity?.id) {
    const uni = triageData.assignedUniversity || challenge.assignedUniversity;
    challenge.milestones[2].title = 'HEI Assignment';
    challenge.milestones[2].status = 'CURRENT';
    challenge.milestones[2].remarks = `Allocated to ${uni.name || 'University'}.`;
  }
}

export default updateMilestonesForStatus;

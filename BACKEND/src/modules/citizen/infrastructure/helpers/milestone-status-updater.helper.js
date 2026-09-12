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

export default updateMilestonesForStatus;

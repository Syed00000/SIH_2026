/**
 * Calculates aggregated challenge statistics across multiple status dimensions
 */
export function calculateActivityStats(challenges = []) {
  const statMap = {
    submitted: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    clarificationRequested: 0,
    clarified: 0,
    total: 0
  };

  challenges.forEach((c) => {
    // If a problem was soft-deleted and was NOT resolved, omit from active stats.
    // If it was resolved, ALWAYS preserve and count it in resolved statistics and charts!
    if (c.isDeleted && c.status !== 'Resolved') {
      return;
    }

    statMap.total += 1;

    const isClarification =
      c.status === 'Clarification Requested' ||
      c.acceptanceStatus === 'Clarification Requested' ||
      c.assignedUniversity?.acceptanceStatus === 'Clarification Requested' ||
      Boolean(c.clarificationQuery && c.clarificationStatus === 'PENDING');
    const isClarified =
      c.status === 'Clarified' ||
      c.acceptanceStatus === 'Clarified' ||
      c.assignedUniversity?.acceptanceStatus === 'Clarified' ||
      c.clarificationStatus === 'RESOLVED';
    const isAccepted =
      c.status === 'Accepted' ||
      c.acceptanceStatus === 'Accepted' ||
      c.assignedUniversity?.acceptanceStatus === 'Accepted' ||
      (c.status === 'In Progress' && !isClarification);

    if (c.status === 'Resolved') {
      statMap.resolved += 1;
    } else if (isClarification) {
      statMap.clarificationRequested += 1;
    } else if (c.status === 'Rejected' || c.status === 'Declined' || c.acceptanceStatus === 'Declined') {
      statMap.rejected += 1;
    } else if (isAccepted) {
      statMap.inProgress += 1;
    } else {
      statMap.underReview += 1;
    }

    if (isClarified) {
      statMap.clarified += 1;
    }
  });

  return statMap;
}

export default calculateActivityStats;

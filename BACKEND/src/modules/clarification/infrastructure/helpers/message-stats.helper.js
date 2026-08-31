/**
 * Computes unread message count for a university or nodal officer
 */
export async function computeUnreadCount(ClarificationMessage, universityCode = null, isNodal = false) {
  if (isNodal) {
    const count = await ClarificationMessage.countDocuments({
      senderRole: 'UNIVERSITY',
      isReadByNodal: false
    });
    return { unreadTotal: count };
  } else if (universityCode) {
    const count = await ClarificationMessage.countDocuments({
      universityCode: universityCode.toUpperCase(),
      senderRole: { $in: ['NODAL', 'ADMIN'] },
      isReadByUniversity: false
    });
    return { unreadTotal: count };
  }
  return { unreadTotal: 0 };
}

/**
 * Aggregates per-challenge unread stats for Nodal and University dashboards
 */
export async function computeChallengeStats(ClarificationMessage) {
  const unreadNodal = await ClarificationMessage.aggregate([
    { $match: { senderRole: 'UNIVERSITY', isReadByNodal: false } },
    { $group: { _id: '$challengeId', unreadCount: { $sum: 1 } } }
  ]);

  const unreadUniversity = await ClarificationMessage.aggregate([
    { $match: { senderRole: { $in: ['NODAL', 'ADMIN'] }, isReadByUniversity: false } },
    { $group: { _id: '$challengeId', unreadCount: { $sum: 1 } } }
  ]);

  const statsMap = {};
  unreadNodal.forEach((item) => {
    statsMap[item._id] = { ...(statsMap[item._id] || {}), unreadForNodal: item.unreadCount };
  });
  unreadUniversity.forEach((item) => {
    statsMap[item._id] = { ...(statsMap[item._id] || {}), unreadForUniversity: item.unreadCount };
  });

  return statsMap;
}

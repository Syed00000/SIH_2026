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
  const [unreadNodal, unreadUniversity, totalCounts] = await Promise.all([
    ClarificationMessage.aggregate([
      { $match: { senderRole: 'UNIVERSITY', isReadByNodal: false, isDeletedForEveryone: { $ne: true } } },
      { $group: { _id: '$challengeId', unreadCount: { $sum: 1 } } }
    ]),
    ClarificationMessage.aggregate([
      { $match: { senderRole: { $in: ['NODAL', 'ADMIN'] }, isReadByUniversity: false, isDeletedForEveryone: { $ne: true } } },
      { $group: { _id: '$challengeId', unreadCount: { $sum: 1 } } }
    ]),
    ClarificationMessage.aggregate([
      { $match: { isDeletedForEveryone: { $ne: true } } },
      { $group: { _id: '$challengeId', totalCount: { $sum: 1 } } }
    ])
  ]);

  const statsMap = {};
  totalCounts.forEach((item) => {
    statsMap[item._id] = { totalMessages: item.totalCount, unreadForNodal: 0, unreadForUniversity: 0 };
  });
  unreadNodal.forEach((item) => {
    statsMap[item._id] = { ...(statsMap[item._id] || {}), unreadForNodal: item.unreadCount };
  });
  unreadUniversity.forEach((item) => {
    statsMap[item._id] = { ...(statsMap[item._id] || {}), unreadForUniversity: item.unreadCount };
  });

  return statsMap;
}

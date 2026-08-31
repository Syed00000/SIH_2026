/**
 * Purges messages seen by both parties older than 12 hours
 */
export async function purgeOldSeenMessages(ClarificationMessage, challengeId) {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  try {
    await ClarificationMessage.deleteMany({
      challengeId,
      isReadByNodal: true,
      isReadByUniversity: true,
      seenAt: { $ne: null, $lt: twelveHoursAgo }
    });
  } catch (e) {
    // background cleanup error can be ignored safely
  }
}

/**
 * Builds MongoDB query for retrieving messages in a challenge room
 */
export function buildMessageRoomQuery(challengeId, role = null) {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  const query = {
    challengeId,
    $or: [
      { seenAt: null },
      { seenAt: { $gte: twelveHoursAgo } },
      { isReadByNodal: false },
      { isReadByUniversity: false }
    ]
  };

  if (role) {
    query.deletedByRoles = { $ne: role };
  }

  return query;
}

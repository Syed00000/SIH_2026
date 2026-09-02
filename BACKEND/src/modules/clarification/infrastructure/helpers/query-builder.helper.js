/**
 * Soft-archives messages seen by both parties older than 12 hours to preserve audit trail
 */
export async function purgeOldSeenMessages(ClarificationMessage, challengeId) {
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  try {
    await ClarificationMessage.updateMany(
      {
        challengeId,
        isReadByNodal: true,
        isReadByUniversity: true,
        seenAt: { $ne: null, $lt: twelveHoursAgo },
        isArchived: { $ne: true }
      },
      {
        $set: {
          isArchived: true,
          archivedAt: new Date()
        }
      }
    );
  } catch (e) {
    // background cleanup error can be ignored safely
  }
}

/**
 * Builds MongoDB query for retrieving messages in a challenge room
 */
export function buildMessageRoomQuery(challengeId, role = null) {
  const query = {
    challengeId,
    isCleared: { $ne: true }
  };

  if (role) {
    query.deletedByRoles = { $ne: role };
  }

  return query;
}

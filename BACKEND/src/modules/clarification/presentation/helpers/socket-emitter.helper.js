import { getSocketIO } from '../../../../infrastructure/socket/socketServer.js';

export function emitNewMessage(challengeId, savedMessage) {
  try {
    const io = getSocketIO();
    if (!io) return;

    io.to(`challenge_${challengeId}`).emit('new_message', savedMessage);

    if (savedMessage.senderRole === 'UNIVERSITY') {
      io.to('nodal_desk').emit('clarification_notification', {
        type: 'NEW_INQUIRY',
        challengeId,
        universityName: savedMessage.universityName,
        message: savedMessage
      });
    } else {
      const uniCode = savedMessage.universityCode || '';
      if (uniCode) {
        io.to(`university_${uniCode.toUpperCase()}`).emit('clarification_notification', {
          type: 'NEW_RESOLUTION',
          challengeId,
          nodalName: savedMessage.nodalName,
          message: savedMessage
        });
      }
    }
  } catch (err) {
    console.warn('Socket broadcast warning (new_message):', err?.message);
  }
}

export function emitMessageDeleted(challengeId, messageId, mode, message) {
  try {
    const io = getSocketIO();
    if (io && mode === 'EVERYONE') {
      io.to(`challenge_${challengeId}`).emit('message_deleted', {
        challengeId,
        messageId,
        mode: 'EVERYONE',
        message
      });
    }
  } catch (err) {
    console.warn('Socket broadcast warning (message_deleted):', err?.message);
  }
}

export function emitChatCleared(challengeId, clearedByRole) {
  try {
    const io = getSocketIO();
    if (io) {
      io.to(`challenge_${challengeId}`).emit('chat_cleared', {
        challengeId,
        clearedBy: clearedByRole
      });
    }
  } catch (err) {
    console.warn('Socket broadcast warning (chat_cleared):', err?.message);
  }
}

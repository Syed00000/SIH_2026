import { Server } from 'socket.io';
import logger from '../../shared/logger/index.js';
import clarificationRepository from '../../modules/clarification/infrastructure/repository.js';

let io = null;

export const initializeSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Socket client connected: ${socket.id}`);

    // Register user/role channel
    socket.on('register_user', (userData) => {
      if (!userData) return;
      const { role, universityCode, userId } = userData;

      if (role === 'NODAL' || role === 'ADMIN') {
        socket.join('nodal_desk');
        logger.info(`Socket ${socket.id} joined nodal_desk channel`);
      } else if (universityCode) {
        socket.join(`university_${String(universityCode).toUpperCase()}`);
        logger.info(`Socket ${socket.id} joined university_${String(universityCode).toUpperCase()} channel`);
      }

      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    // Join a specific challenge clarification discussion room with tenant authorization
    socket.on('join_challenge', async (data, callback) => {
      const { challengeId, user, universityCode } = data || {};
      if (!challengeId) {
        if (typeof callback === 'function') callback({ success: false, error: 'Challenge ID is required' });
        return;
      }

      // Validate tenant authorization before joining challenge room
      try {
        const { CitizenChallenge } = await import('../../modules/citizen/infrastructure/model.js');
        const chl = await CitizenChallenge.findOne({ challengeId }).lean();
        if (chl) {
          const userRole = (user?.role || '').toUpperCase();
          const isGov = ['NODAL', 'GOVERNMENT', 'ADMIN', 'SUPER_ADMIN'].includes(userRole);
          const callingUni = (universityCode || user?.universityCode || user?.code || '').toUpperCase();
          const assignedUni = (chl.assignedUniversity?.id || '').toUpperCase();

          if (!isGov && assignedUni) {
            const { findUniversityIdentity } = await import('../../modules/university/infrastructure/helpers/lookup.helper.js');
            const callingIdentity = await findUniversityIdentity(callingUni);
            const isAuthorized = callingIdentity && (
              callingIdentity.validIdentifiers.includes(assignedUni) ||
              callingIdentity.code === assignedUni ||
              callingIdentity.aisheCode === assignedUni
            );

            if (!isAuthorized) {
              logger.warn(`🚫 Unauthorized socket join attempt for challenge ${challengeId} by university "${callingUni}"`);
              socket.emit('join_challenge_unauthorized', {
                challengeId,
                error: 'Access denied: You are not the assigned institution for this challenge.'
              });
              if (typeof callback === 'function') callback({ success: false, error: 'Unauthorized university' });
              return;
            }
          }
        }
      } catch (authErr) {
        logger.warn(`Challenge room auth check warning: ${authErr.message}`);
      }

      const roomName = `challenge_${challengeId}`;
      socket.join(roomName);
      logger.info(`Socket ${socket.id} (${user?.fullName || 'User'}) joined ${roomName}`);

      // Mark unread messages as read for this role
      try {
        if (user?.role) {
          await clarificationRepository.markRead(challengeId, user.role);
          io.to(roomName).emit('messages_read', { challengeId, readByRole: user.role });
        }
      } catch (err) {
        logger.warn(`Error marking messages read on join: ${err.message}`);
      }

      socket.emit('joined_challenge_success', {
        room: roomName,
        challengeId,
        timestamp: new Date().toISOString()
      });

      if (typeof callback === 'function') callback({ success: true, room: roomName });
    });

    // Leave a challenge room
    socket.on('leave_challenge', (data) => {
      const { challengeId } = data || {};
      if (!challengeId) return;
      const roomName = `challenge_${challengeId}`;
      socket.leave(roomName);
      logger.info(`Socket ${socket.id} left ${roomName}`);
    });

    // Send a real-time message
    socket.on('send_message', async (messagePayload, callback) => {
      try {
        const { challengeId, message, senderName, senderRole, universityCode, universityName, nodalName, messageType } = messagePayload || {};

        if (!challengeId || !message?.trim()) {
          if (typeof callback === 'function') callback({ success: false, error: 'Invalid payload' });
          return;
        }

        // Save to Database
        const savedMessage = await clarificationRepository.createMessage({
          challengeId,
          senderId: socket.id,
          senderName: senderName || 'Officer',
          senderRole: senderRole || 'UNIVERSITY',
          universityCode,
          universityName,
          nodalName: nodalName || 'State Nodal Officer',
          message: message.trim(),
          messageType: messageType || 'TEXT'
        });

        const roomName = `challenge_${challengeId}`;

        // Broadcast to everyone in this challenge room (including sender)
        io.to(roomName).emit('new_message', savedMessage);

        // Send push notification event to the other party's general channel
        if (savedMessage.senderRole === 'UNIVERSITY') {
          io.to('nodal_desk').emit('clarification_notification', {
            type: 'NEW_INQUIRY',
            challengeId,
            universityName: savedMessage.universityName,
            message: savedMessage
          });
        } else {
          const uCode = savedMessage.universityCode || universityCode;
          if (uCode) {
            io.to(`university_${String(uCode).toUpperCase()}`).emit('clarification_notification', {
              type: 'NEW_RESOLUTION',
              challengeId,
              nodalName: savedMessage.nodalName,
              message: savedMessage
            });
          }
        }

        if (typeof callback === 'function') {
          callback({ success: true, data: savedMessage });
        }
      } catch (err) {
        logger.error('Error saving socket clarification message:', err);
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // Delete Message event (Delete for me / Delete for everyone)
    socket.on('delete_message', async (data, callback) => {
      try {
        const { challengeId, messageId, role, mode } = data || {};
        if (!challengeId || !messageId) return;

        const result = await clarificationRepository.deleteMessage(messageId, role, mode);

        if (mode === 'EVERYONE') {
          io.to(`challenge_${challengeId}`).emit('message_deleted', {
            challengeId,
            messageId,
            mode: 'EVERYONE',
            message: result.message
          });
        } else {
          socket.emit('message_deleted', {
            challengeId,
            messageId,
            mode: 'FOR_ME'
          });
        }

        if (typeof callback === 'function') callback({ success: true, result });
      } catch (err) {
        logger.error('Error deleting message via socket:', err);
        if (typeof callback === 'function') callback({ success: false, error: err.message });
      }
    });

    // User typing indicators
    socket.on('typing', (data) => {
      const { challengeId, senderName, senderRole } = data || {};
      if (!challengeId) return;
      socket.to(`challenge_${challengeId}`).emit('user_typing', {
        challengeId,
        senderName,
        senderRole
      });
    });

    socket.on('stop_typing', (data) => {
      const { challengeId, senderName } = data || {};
      if (!challengeId) return;
      socket.to(`challenge_${challengeId}`).emit('user_stop_typing', {
        challengeId,
        senderName
      });
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket client disconnected: ${socket.id}`);
    });
  });

  logger.info('🚀 Socket.IO Server initialized successfully on HTTP server');
  return io;
};

export const getSocketIO = () => {
  return io;
};

export default { initializeSocketServer, getSocketIO };

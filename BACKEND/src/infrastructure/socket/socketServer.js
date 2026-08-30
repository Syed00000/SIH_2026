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

    // Join a specific challenge clarification discussion room
    socket.on('join_challenge', async (data) => {
      const { challengeId, user } = data || {};
      if (!challengeId) return;

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

import { io } from 'socket.io-client';
import { config } from '../config.js';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const apiOrigin = config?.api?.baseUrl
      ? config.api.baseUrl.replace(/\/api\/v1\/?$/, '')
      : 'http://127.0.0.1:3000';
    const serverUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_SOCKET_URL || apiOrigin || 'http://127.0.0.1:3000';

    console.log('🔌 Connecting Socket.IO to:', serverUrl);

    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 500,
      timeout: 10000
    });

    socket.on('connect', () => {
      console.log('⚡ Socket.IO client connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO client disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('Socket connection warning (will retry):', error.message);
    });
  }

  return socket;
};

export const registerUserSocket = (user) => {
  const s = getSocket();
  if (!s || !user) return;

  const payload = {
    userId: user.id || user._id,
    role: user.role || 'UNIVERSITY',
    universityCode: user.profile?.code || user.universityCode || ''
  };

  s.emit('register_user', payload);
};

export const joinChallengeRoom = (challengeId, user) => {
  const s = getSocket();
  if (!s || !challengeId) return;

  s.emit('join_challenge', {
    challengeId,
    user: {
      id: user?.id || user?._id,
      fullName: user?.fullName || user?.name || 'User',
      role: user?.role || 'UNIVERSITY',
      designation: user?.designation || user?.profile?.designation || ''
    }
  });
};

export const leaveChallengeRoom = (challengeId) => {
  const s = getSocket();
  if (!s || !challengeId) return;
  s.emit('leave_challenge', { challengeId });
};

export const sendSocketMessage = (messagePayload, callback) => {
  const s = getSocket();
  if (!s) return;
  s.emit('send_message', messagePayload, callback);
};

export const emitTyping = (challengeId, senderName, senderRole) => {
  const s = getSocket();
  if (!s || !challengeId) return;
  s.emit('typing', { challengeId, senderName, senderRole });
};

export const emitStopTyping = (challengeId, senderName) => {
  const s = getSocket();
  if (!s || !challengeId) return;
  s.emit('stop_typing', { challengeId, senderName });
};

export const deleteSocketMessage = (data, callback) => {
  const s = getSocket();
  if (!s) return;
  s.emit('delete_message', data, callback);
};

export default {
  getSocket,
  registerUserSocket,
  joinChallengeRoom,
  leaveChallengeRoom,
  sendSocketMessage,
  deleteSocketMessage,
  emitTyping,
  emitStopTyping
};

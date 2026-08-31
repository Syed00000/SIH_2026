import { useState, useEffect } from 'react';
import {
  getSocket,
  joinChallengeRoom,
  leaveChallengeRoom
} from '../../../infrastructure/socket/socketClient.js';
import { clarificationChatService } from '../services/clarificationChatService.js';
import { registerChatSocketListeners } from '../helpers/socketEventHandlers.js';

export const deduplicateMessages = (msgList) => {
  if (!Array.isArray(msgList)) return [];
  const seen = new Set();
  return msgList.filter((m) => {
    const id = m._id || m.id || `${m.createdAt}_${m.message}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

export const useClarificationChatSocket = ({
  isOpen,
  challengeId,
  userRole,
  userName,
  soundEnabled,
  isUniversityView,
  nodalAdminName,
  uniName,
  scrollToBottom
}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(true);
  const [isTypingRemote, setIsTypingRemote] = useState(false);
  const [remoteTyperName, setRemoteTyperName] = useState('');

  useEffect(() => {
    if (!isOpen || !challengeId) return;

    let isMounted = true;
    setLoading(true);

    clarificationChatService.getMessages(challengeId).then((data) => {
      if (isMounted) {
        setMessages(deduplicateMessages(Array.isArray(data) ? data : []));
        setLoading(false);
        if (scrollToBottom) setTimeout(scrollToBottom, 100);
      }
    });

    const socket = getSocket();
    setIsSocketConnected(socket.connected);

    const onConnect = () => {
      setIsSocketConnected(true);
      joinChallengeRoom(challengeId, { fullName: userName, role: userRole });
    };
    const onDisconnect = () => setIsSocketConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    joinChallengeRoom(challengeId, { fullName: userName, role: userRole });
    clarificationChatService.markRead(challengeId, userRole);

    const cleanupSocketListeners = registerChatSocketListeners({
      socket,
      challengeId,
      userRole,
      userName,
      isUniversityView,
      nodalAdminName,
      uniName,
      soundEnabled,
      setMessages,
      setIsTypingRemote,
      setRemoteTyperName,
      deduplicateMessages,
      scrollToBottom
    });

    return () => {
      isMounted = false;
      leaveChallengeRoom(challengeId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      cleanupSocketListeners();
    };
  }, [isOpen, challengeId, userRole, userName, soundEnabled]);

  return {
    messages,
    setMessages,
    loading,
    isSocketConnected,
    isTypingRemote,
    remoteTyperName,
    deduplicateMessages
  };
};

export default useClarificationChatSocket;

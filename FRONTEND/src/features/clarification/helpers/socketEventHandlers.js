import { playIncomingChime } from './audioChime.js';
import { clarificationChatService } from '../services/clarificationChatService.js';

export const registerChatSocketListeners = ({
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
}) => {
  const handleNewMessage = (newMsg) => {
    if (!newMsg || (newMsg.challengeId && newMsg.challengeId !== challengeId)) return;
    setMessages((prev) => {
      if (prev.some((m) => m._id === newMsg._id)) return prev;
      const optIdx = prev.findIndex((m) => String(m._id).startsWith('msg_') && m.message === newMsg.message && m.senderRole === newMsg.senderRole);
      if (optIdx !== -1) {
        const updated = [...prev];
        updated[optIdx] = newMsg;
        return deduplicateMessages(updated);
      }
      return deduplicateMessages([...prev, newMsg]);
    });

    if (newMsg.senderRole !== userRole) {
      clarificationChatService.markRead(challengeId, userRole);
      if (soundEnabled) playIncomingChime();
    }
    if (scrollToBottom) setTimeout(scrollToBottom, 50);
  };

  const handleRemoteTyping = (data) => {
    if (data && data.challengeId === challengeId && data.senderRole !== userRole) {
      setIsTypingRemote(true);
      setRemoteTyperName(data.senderName || (isUniversityView ? nodalAdminName : uniName));
      if (scrollToBottom) setTimeout(scrollToBottom, 50);
    }
  };

  const handleRemoteStopTyping = (data) => {
    if (data && data.challengeId === challengeId) setIsTypingRemote(false);
  };

  const handleMessagesRead = (data) => {
    if (data && data.challengeId === challengeId) {
      setMessages((prev) =>
        prev.map((m) => {
          if (data.readByRole === 'NODAL' || data.readByRole === 'ADMIN') return { ...m, isReadByNodal: true };
          if (data.readByRole === 'UNIVERSITY') return { ...m, isReadByUniversity: true };
          return { ...m, isReadByNodal: true, isReadByUniversity: true };
        })
      );
    }
  };

  const handleMessageDeleted = (data) => {
    if (data && data.challengeId === challengeId) {
      if (data.mode === 'EVERYONE') {
        setMessages((prev) => prev.map((m) => (m._id === data.messageId ? { ...m, isDeletedForEveryone: true, message: 'This message was deleted', attachments: [] } : m)));
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== data.messageId));
      }
    }
  };

  const handleChatCleared = (data) => {
    if (data && data.challengeId === challengeId) setMessages([]);
  };

  socket.on('new_message', handleNewMessage);
  socket.on('user_typing', handleRemoteTyping);
  socket.on('user_stop_typing', handleRemoteStopTyping);
  socket.on('messages_read', handleMessagesRead);
  socket.on('message_deleted', handleMessageDeleted);
  socket.on('chat_cleared', handleChatCleared);

  return () => {
    socket.off('new_message', handleNewMessage);
    socket.off('user_typing', handleRemoteTyping);
    socket.off('user_stop_typing', handleRemoteStopTyping);
    socket.off('messages_read', handleMessagesRead);
    socket.off('message_deleted', handleMessageDeleted);
    socket.off('chat_cleared', handleChatCleared);
  };
};

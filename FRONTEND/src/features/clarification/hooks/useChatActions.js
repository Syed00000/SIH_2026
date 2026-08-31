import { useState, useRef } from 'react';
import { emitTyping, emitStopTyping, sendSocketMessage } from '../../../infrastructure/socket/socketClient.js';
import { clarificationChatService } from '../services/clarificationChatService.js';
import { buildMessagePayload, executeMessageDelete } from '../helpers/chatActionHandlers.js';

export const useChatActions = ({
  challengeId,
  userRole,
  userName,
  isUniversityView,
  uniLeadDesignation,
  nodalDesignation,
  uniCode,
  uniName,
  nodalAdminName,
  setMessages,
  deduplicateMessages,
  scrollToBottom
}) => {
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [deleteModalMsg, setDeleteModalMsg] = useState(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    emitTyping(challengeId, userName, userRole);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => emitStopTyping(challengeId, userName), 1500);
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    setSending(true);
    emitStopTyping(challengeId, userName);

    const tempId = 'msg_' + Date.now();
    const payload = buildMessagePayload({
      challengeId, text, userName, userRole, isUniversityView, uniLeadDesignation,
      nodalDesignation, uniCode, uniName, nodalAdminName, replyingTo
    });

    setMessages((prev) => deduplicateMessages([...prev, { ...payload, _id: tempId, createdAt: new Date().toISOString() }]));
    setInputText('');
    setReplyingTo(null);
    if (scrollToBottom) setTimeout(scrollToBottom, 30);

    try {
      const saved = await clarificationChatService.sendMessage(challengeId, payload);
      if (saved && saved._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === saved._id)) return deduplicateMessages(prev.filter((m) => m._id !== tempId));
          return deduplicateMessages(prev.map((m) => (m._id === tempId ? saved : m)));
        });
      }
    } catch {
      sendSocketMessage(payload);
    } finally {
      setSending(false);
      if (scrollToBottom) setTimeout(scrollToBottom, 50);
    }
  };

  const handleInitiateReply = (msg, e) => {
    if (e) e.stopPropagation();
    setActiveMenuMsgId(null);
    setReplyingTo(msg);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCopyText = (msg, e) => {
    if (e) e.stopPropagation();
    setActiveMenuMsgId(null);
    if (msg.message) {
      navigator.clipboard.writeText(msg.message);
      setCopiedMsgId(msg._id);
      setTimeout(() => setCopiedMsgId(null), 1500);
    }
  };

  const handleExecuteDelete = async (mode) => {
    if (!deleteModalMsg) return;
    const msgId = deleteModalMsg._id;
    try {
      await executeMessageDelete({ challengeId, msgId, userRole, mode });
      if (mode === 'EVERYONE') {
        setMessages((prev) => prev.map((m) => (m._id === msgId ? { ...m, isDeletedForEveryone: true, message: 'This message was deleted', attachments: [] } : m)));
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== msgId));
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setDeleteModalMsg(null);
    }
  };

  const handleClearEntireChat = async () => {
    setClearing(true);
    try {
      await clarificationChatService.clearChat(challengeId, userRole);
      setMessages([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    } finally {
      setClearing(false);
    }
  };

  return {
    inputText, sending, replyingTo, setReplyingTo, activeMenuMsgId, setActiveMenuMsgId,
    deleteModalMsg, setDeleteModalMsg, highlightedMsgId, setHighlightedMsgId, copiedMsgId,
    showClearConfirm, setShowClearConfirm, clearing, inputRef,
    handleInputChange, handleSendMessage, handleInitiateReply, handleCopyText,
    handleExecuteDelete, handleClearEntireChat
  };
};

export default useChatActions;

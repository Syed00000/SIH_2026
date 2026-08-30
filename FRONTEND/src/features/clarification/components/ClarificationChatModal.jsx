import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Phone,
  Mail,
  Shield,
  GraduationCap,
  CheckCircle2,
  Clock,
  Lock,
  FileText,
  Check,
  CheckCheck,
  Building,
  MapPin,
  MessageSquare,
  Volume2,
  VolumeX,
  Trash2,
  AlertTriangle,
  Reply,
  Copy,
  CornerDownRight,
  Ban,
  ChevronDown
} from 'lucide-react';
import {
  getSocket,
  joinChallengeRoom,
  leaveChallengeRoom,
  sendSocketMessage,
  deleteSocketMessage,
  emitTyping,
  emitStopTyping
} from '../../../infrastructure/socket/socketClient.js';
import { clarificationChatService } from '../services/clarificationChatService.js';

// Web Audio API soft chime for instant incoming message feedback
const playIncomingChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
    gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // AudioContext policy
  }
};

export const ClarificationChatModal = ({
  isOpen,
  onClose,
  challenge,
  currentUser,
  isUniversityView = true,
  onAcceptChallenge,
  onDeclineChallenge
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTypingRemote, setIsTypingRemote] = useState(false);
  const [remoteTyperName, setRemoteTyperName] = useState('');
  const [showStatement, setShowStatement] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  // WhatsApp Features State
  const [replyingTo, setReplyingTo] = useState(null);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState(null);
  const [deleteModalMsg, setDeleteModalMsg] = useState(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);
  const [copiedMsgId, setCopiedMsgId] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const challengeId = challenge?.challengeId || challenge?.id || 'NA';

  // 1. Dynamic University Information
  const uniCode = challenge?.assignedUniversity?.id || challenge?.universityCode || currentUser?.profile?.code || 'RU001';
  const uniName = challenge?.assignedUniversity?.name || challenge?.universityName || currentUser?.profile?.institutionName || currentUser?.profile?.universityName || 'Ranchi University';
  const uniDepartment = challenge?.assignedUniversity?.department || `${uniName} Innovation Desk`;
  const uniLeadDesignation = 'University Administration';

  // 2. State Nodal Desk Information
  const nodalAdminName = 'State Nodal Officer';
  const nodalDesignation = 'State Nodal Officer';
  const nodalDepartment = 'Dept. of Higher & Technical Education, Govt. of Jharkhand';
  const nodalPhone = challenge?.allocatedBy?.phone || challenge?.allocatedBy?.mobileNumber || '+91 9876543210';
  const nodalEmail = 'nodal@joharsetu.gov.in';

  const userRole = isUniversityView ? 'UNIVERSITY' : 'NODAL';
  const userName = isUniversityView ? uniName : 'State Nodal Officer';

  const s = String(challenge?.status || '').toLowerCase();
  const acc = String(challenge?.assignedUniversity?.acceptanceStatus || challenge?.acceptanceStatus || '').toLowerCase();
  const isAccepted = s.includes('accept') || acc === 'accepted' || s === 'in progress' || s === 'active' || s === 'completed';
  const isDeclined = s.includes('reject') || s.includes('decline') || acc === 'declined';

  // Helper to deduplicate messages array
  const deduplicateMessages = (msgList) => {
    if (!Array.isArray(msgList)) return [];
    const seen = new Set();
    return msgList.filter((m) => {
      const id = m._id || m.id || `${m.createdAt}_${m.message}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  // Auto-scroll firmly to the bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  // Scroll to a specific message when clicking its quote
  const scrollToMessage = (msgId) => {
    if (!msgId) return;
    const elem = document.getElementById(`msg-${msgId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMsgId(msgId);
      setTimeout(() => setHighlightedMsgId(null), 2000);
    }
  };

  // 1. Initial Load of Messages & Socket Room Joining
  useEffect(() => {
    if (!isOpen || !challengeId) return;

    let isMounted = true;
    setLoading(true);

    // Fetch initial chat history via REST API from MongoDB
    clarificationChatService.getMessages(challengeId).then((data) => {
      if (isMounted) {
        setMessages(deduplicateMessages(Array.isArray(data) ? data : []));
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    });

    // Connect & Join Socket Room
    const socket = getSocket();
    setIsSocketConnected(socket.connected);

    const onConnect = () => {
      setIsSocketConnected(true);
      joinChallengeRoom(challengeId, {
        fullName: userName,
        role: userRole
      });
    };
    const onDisconnect = () => setIsSocketConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    joinChallengeRoom(challengeId, {
      fullName: userName,
      role: userRole
    });

    // Mark unread messages as read in DB and trigger read receipts
    clarificationChatService.markRead(challengeId, userRole);

    // Socket Event: New incoming message
    const handleNewMessage = (newMsg) => {
      if (!newMsg || (newMsg.challengeId && newMsg.challengeId !== challengeId)) return;

      setMessages((prev) => {
        // 1. If message already exists by permanent MongoDB _id, ignore
        if (prev.some((m) => m._id === newMsg._id)) {
          return prev;
        }

        // 2. If this is our own message that was added optimistically, replace it with confirmed server message
        const optimisticIndex = prev.findIndex(
          (m) =>
            String(m._id).startsWith('msg_') &&
            m.message === newMsg.message &&
            m.senderRole === newMsg.senderRole
        );

        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = newMsg;
          return deduplicateMessages(updated);
        }

        return deduplicateMessages([...prev, newMsg]);
      });

      // Auto mark as read if room is open
      if (newMsg.senderRole !== userRole) {
        clarificationChatService.markRead(challengeId, userRole);
      }

      // Play chime ONLY if message came from other party
      if (newMsg.senderRole !== userRole && soundEnabled) {
        playIncomingChime();
      }

      // Auto scroll immediately on new message
      setTimeout(scrollToBottom, 50);
    };

    // Socket Event: Remote party typing
    const handleRemoteTyping = (data) => {
      if (data && data.challengeId === challengeId && data.senderRole !== userRole) {
        setIsTypingRemote(true);
        setRemoteTyperName(data.senderName || (isUniversityView ? nodalAdminName : uniLeadRep));
        setTimeout(scrollToBottom, 50);
      }
    };

    const handleRemoteStopTyping = (data) => {
      if (data && data.challengeId === challengeId) {
        setIsTypingRemote(false);
      }
    };

    // Socket Event: Messages read by counterparty -> Turn ticks into Double Blue Ticks
    const handleMessagesRead = (data) => {
      if (data && data.challengeId === challengeId) {
        setMessages((prev) =>
          prev.map((m) => {
            if (data.readByRole === 'NODAL' || data.readByRole === 'ADMIN') {
              return { ...m, isReadByNodal: true };
            }
            if (data.readByRole === 'UNIVERSITY') {
              return { ...m, isReadByUniversity: true };
            }
            return { ...m, isReadByNodal: true, isReadByUniversity: true };
          })
        );
      }
    };

    // Socket Event: Single Message Deleted (Everyone / For Me)
    const handleMessageDeleted = (data) => {
      if (data && data.challengeId === challengeId) {
        if (data.mode === 'EVERYONE') {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === data.messageId
                ? { ...m, isDeletedForEveryone: true, message: 'This message was deleted', attachments: [] }
                : m
            )
          );
        } else {
          setMessages((prev) => prev.filter((m) => m._id !== data.messageId));
        }
      }
    };

    // Socket Event: Chat cleared
    const handleChatCleared = (data) => {
      if (data && data.challengeId === challengeId) {
        setMessages([]);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleRemoteTyping);
    socket.on('user_stop_typing', handleRemoteStopTyping);
    socket.on('messages_read', handleMessagesRead);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('chat_cleared', handleChatCleared);

    return () => {
      isMounted = false;
      leaveChallengeRoom(challengeId);
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleRemoteTyping);
      socket.off('user_stop_typing', handleRemoteStopTyping);
      socket.off('messages_read', handleMessagesRead);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('chat_cleared', handleChatCleared);
    };
  }, [isOpen, challengeId, userRole, userName, soundEnabled]);

  // Auto-scroll on any change in messages or typing state
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTypingRemote]);

  // Dismiss message action dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuMsgId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  if (!isOpen || !challenge) return null;

  // 2. Handle Text Change & Real-Time Typing Broadcast
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    emitTyping(challengeId, userName, userRole);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(challengeId, userName);
    }, 1500);
  };

  // 3. Send Message Handler (with replyTo quote support)
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    setSending(true);
    emitStopTyping(challengeId, userName);

    const tempId = 'msg_' + Date.now();
    const replyPayload = replyingTo
      ? {
        messageId: replyingTo._id,
        senderName: replyingTo.senderName,
        senderRole: replyingTo.senderRole,
        message: replyingTo.message
      }
      : null;

    const optimisticMessage = {
      _id: tempId,
      challengeId,
      message: text,
      senderName: userName,
      senderRole: userRole,
      senderDesignation: isUniversityView ? uniLeadDesignation : nodalDesignation,
      universityCode: uniCode,
      universityName: uniName,
      nodalName: nodalAdminName,
      messageType: 'TEXT',
      replyTo: replyPayload,
      createdAt: new Date().toISOString(),
      isReadByNodal: userRole === 'NODAL' || userRole === 'ADMIN',
      isReadByUniversity: userRole === 'UNIVERSITY'
    };

    // Optimistic UI update
    setMessages((prev) => deduplicateMessages([...prev, optimisticMessage]));
    setInputText('');
    setReplyingTo(null);
    setTimeout(scrollToBottom, 30);

    const payload = {
      challengeId,
      message: text,
      senderName: userName,
      senderRole: userRole,
      senderDesignation: isUniversityView ? uniLeadDesignation : nodalDesignation,
      universityCode: uniCode,
      universityName: uniName,
      nodalName: nodalAdminName,
      messageType: 'TEXT',
      replyTo: replyPayload
    };

    try {
      const saved = await clarificationChatService.sendMessage(challengeId, payload);
      if (saved && saved._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === saved._id)) {
            return deduplicateMessages(prev.filter((m) => m._id !== tempId));
          }
          return deduplicateMessages(prev.map((m) => (m._id === tempId ? saved : m)));
        });
      }
    } catch (err) {
      console.warn('REST send fallback to socket:', err);
      sendSocketMessage(payload);
    } finally {
      setSending(false);
      setTimeout(scrollToBottom, 50);
    }
  };

  // 4. Trigger Reply to a Message (WhatsApp Tag & Quote)
  const handleInitiateReply = (msg, e) => {
    if (e) e.stopPropagation();
    setActiveMenuMsgId(null);
    setReplyingTo(msg);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 5. Copy Message Text
  const handleCopyText = (msg, e) => {
    if (e) e.stopPropagation();
    setActiveMenuMsgId(null);
    if (msg.message) {
      navigator.clipboard.writeText(msg.message);
      setCopiedMsgId(msg._id);
      setTimeout(() => setCopiedMsgId(null), 1500);
    }
  };

  // 6. Delete Single Message Execution (FOR_ME vs EVERYONE)
  const handleExecuteDelete = async (mode) => {
    if (!deleteModalMsg) return;
    const msgId = deleteModalMsg._id;

    try {
      // Direct REST API Delete
      await clarificationChatService.deleteMessage(challengeId, msgId, userRole, mode);

      // Emit over Socket.IO for real-time propagation
      deleteSocketMessage({
        challengeId,
        messageId: msgId,
        role: userRole,
        mode
      });

      if (mode === 'EVERYONE') {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === msgId
              ? { ...m, isDeletedForEveryone: true, message: ' This message was deleted', attachments: [] }
              : m
          )
        );
      } else {
        setMessages((prev) => prev.filter((m) => m._id !== msgId));
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    } finally {
      setDeleteModalMsg(null);
    }
  };

  // 7. Clear Entire Chat Room
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 border border-slate-200/90 rounded-2xl w-full max-w-2xl h-[90vh] max-h-[760px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">

        {/* 1. Top Clean White Header Bar */}
        <div className="p-3.5 border-b border-slate-200/90 bg-[#f8fafc] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#007A61] text-white flex items-center justify-center font-extrabold shadow-sm border border-emerald-600/30">
                {isUniversityView ? <Shield className="w-5 h-5 text-white" /> : <GraduationCap className="w-5 h-5 text-white" />}
              </div>
              {/* Online Presence Indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-[11px] text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {challengeId}
                </span>
                <div className="text-xs font-bold text-slate-900">
                  {isUniversityView ? (
                    <span className="text-slate-900 font-bold">State Nodal Officer</span>
                  ) : (
                    <span className="text-slate-900 font-bold">{uniName}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[10.5px] text-slate-500 font-medium mt-0.5">
                {isTypingRemote ? (
                  <span className="flex items-center space-x-1 text-emerald-600 font-bold animate-pulse">
                    <span>typing...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-emerald-700 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online &bull; Live WebSocket</span>
                  </span>
                )}
                <span className="text-slate-300">&bull;</span>
                <span className="text-slate-500 truncate max-w-[260px]">
                  {isUniversityView ? nodalDepartment : `${uniName} Innovation Desk`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Clear Entire Chat History */}
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full cursor-pointer transition-colors"
              title="Clear Room Conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-slate-400 hover:text-[#007A61] hover:bg-emerald-50 rounded-full cursor-pointer transition-colors"
              title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#007A61]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Direct Phone Call Link */}
            {isUniversityView && (
              <a
                href={`tel:${nodalPhone}`}
                className="hidden sm:flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-300 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs"
                title="Direct Hotline with State Nodal Admin"
              >
                <Phone className="w-3.5 h-3.5 text-[#007A61]" />
                <span>Call Desk: {nodalPhone}</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Sub-Header: 12-Hour Auto Delete Notice with Pure Lucide Icons */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-500 truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Messages auto-delete 12 hours after being viewed by both parties</span>
          </div>

          <button
            type="button"
            onClick={() => setShowStatement(!showStatement)}
            className="flex items-center space-x-1 text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer shrink-0 ml-2"
          >
            <FileText className="w-3.5 h-3.5 text-[#007A61]" />
            <span>{showStatement ? 'Hide Brief' : 'Problem Brief'}</span>
          </button>
        </div>

        {showStatement && (
          <div className="bg-amber-50/60 px-4 py-2.5 border-b border-amber-200/80 text-xs text-slate-800 italic flex-shrink-0 animate-in slide-in-from-top-1 duration-150">
            <strong className="text-amber-900">Problem Statement:</strong> "{challenge.problemStatement || challenge.description || challenge.title}"
          </div>
        )}

        {/* Clear Entire Chat Confirmation Prompt */}
        {showClearConfirm && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-xs flex items-center justify-between flex-shrink-0 animate-in fade-in">
            <div className="flex items-center space-x-2 text-rose-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Are you sure you want to clear all messages in this room?</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleClearEntireChat}
                disabled={clearing}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
              >
                {clearing ? 'Clearing...' : 'Clear All'}
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 3. Messages Stream (Clean White WhatsApp Canvas) */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#efeae2]/40 text-xs custom-scrollbar relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-2 text-slate-400">
              <Clock className="w-6 h-6 animate-spin text-[#007A61]" />
              <span className="font-bold">Syncing encrypted chat history...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2.5 text-slate-400 p-6">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A61]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Direct Clarification Channel</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                  End-to-end synchronized communications between <strong>{uniLeadRep}</strong> ({uniName}) and <strong>{nodalAdminName}</strong> ({nodalDesignation}).
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.senderRole === userRole;
              const isNodalMsg = msg.senderRole === 'NODAL' || msg.senderRole === 'ADMIN';
              const formattedTime = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now';
              const isHighlighted = highlightedMsgId === msg._id;
              const isDeleted = Boolean(msg.isDeletedForEveryone);

              return (
                <div
                  id={`msg-${msg._id}`}
                  key={`msg_${msg._id || ''}_${index}`}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group relative transition-all duration-300 ${isHighlighted ? 'scale-[1.02] ring-2 ring-emerald-500 rounded-2xl' : ''
                    }`}
                >
                  {/* Sender Name & Role header on bubble */}
                  <div className="flex items-center space-x-1.5 text-[10.5px] px-1 font-semibold text-slate-500 mb-0.5">
                    {isMine ? (
                      <span className="text-emerald-800 font-bold">You</span>
                    ) : isNodalMsg ? (
                      <span className="flex items-center space-x-1 text-emerald-800 font-bold">
                        <Shield className="w-3 h-3 text-[#047857]" />
                        <span>State Nodal Officer</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-teal-800 font-bold">
                        <GraduationCap className="w-3 h-3 text-[#007A61]" />
                        <span>{msg.universityName || uniName}</span>
                      </span>
                    )}
                  </div>

                  {/* Message Bubble Container */}
                  <div
                    className={`relative max-w-[85%] sm:max-w-[75%] p-2.5 sm:p-3 rounded-2xl text-xs leading-relaxed shadow-xs group ${isMine
                      ? 'bg-[#d9fdd3] text-slate-900 border border-emerald-200/80 rounded-tr-xs'
                      : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs'
                      }`}
                  >
                    {/* Hover WhatsApp 3-Dot / Action Trigger */}
                    {!isDeleted && (
                      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuMsgId(activeMenuMsgId === msg._id ? null : msg._id);
                          }}
                          className="p-1 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 cursor-pointer transition-colors shadow-2xs"
                          title="Message Options"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp Dropdown Menu */}
                        {activeMenuMsgId === msg._id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-6 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 text-slate-800 text-xs"
                          >
                            <button
                              type="button"
                              onClick={(e) => handleInitiateReply(msg, e)}
                              className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-[#007A61] flex items-center space-x-2 cursor-pointer transition-colors"
                            >
                              <Reply className="w-3.5 h-3.5 text-[#007A61]" />
                              <span>Reply</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleCopyText(msg, e)}
                              className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-600" />
                              <span>{copiedMsgId === msg._id ? 'Copied!' : 'Copy Text'}</span>
                            </button>

                            <div className="h-px bg-slate-100 my-1"></div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuMsgId(null);
                                setDeleteModalMsg(msg);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-700 flex items-center space-x-2 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete Message...</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* WhatsApp Quoted Reply Preview (Inside Bubble) */}
                    {msg.replyTo && msg.replyTo.message && (
                      <div
                        onClick={() => scrollToMessage(msg.replyTo.messageId)}
                        className={`mb-2 p-2 rounded-lg border-l-4 cursor-pointer text-[11px] transition-colors ${isMine
                          ? 'bg-emerald-50/80 border-[#007A61] hover:bg-emerald-100/80'
                          : 'bg-slate-100/90 border-[#007A61] hover:bg-slate-200/80'
                          }`}
                        title="Click to view quoted message"
                      >
                        <div className="font-bold flex items-center space-x-1 mb-0.5 text-[#007A61]">
                          <CornerDownRight className="w-2.5 h-2.5 opacity-70" />
                          <span>{msg.replyTo.senderName || 'Original Message'}</span>
                        </div>
                        <p className="line-clamp-2 text-slate-700 italic">
                          "{msg.replyTo.message}"
                        </p>
                      </div>
                    )}

                    {/* Message Body Content */}
                    {isDeleted ? (
                      <div className="flex items-center space-x-1.5 text-slate-400 italic py-0.5">
                        <Ban className="w-3.5 h-3.5 text-slate-400" />
                        <span>This message was deleted</span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap pr-4 text-slate-900">{msg.message}</p>
                    )}

                    {/* Timestamp & WhatsApp Double Cyan Checkmarks */}
                    <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-500 font-mono">
                      <span>{formattedTime}</span>
                      {isMine && !isDeleted && (
                        msg.isReadByNodal || msg.isReadByUniversity ? (
                          <span title="Read by counterparty" className="text-cyan-600 font-bold flex items-center">
                            <CheckCheck className="w-3.5 h-3.5 text-cyan-600 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span title="Delivered to server" className="text-slate-400 flex items-center">
                            <Check className="w-3 h-3 text-slate-400" />
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Real-time Typing Indicator with Wave Animation */}
          {isTypingRemote && (
            <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium py-1.5 px-3 bg-white rounded-2xl border border-emerald-200/80 shadow-2xs w-fit animate-in fade-in slide-in-from-bottom-1">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-[#007A61] rounded-full animate-bounce [animation-delay:0s]"></span>
                <span className="w-1.5 h-1.5 bg-[#007A61] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#007A61] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
              <span className="italic text-slate-600 font-medium">typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. In-Chat Action Decision Bar (Accept & Decline for University) */}
        {isUniversityView && (
          <div className="px-4 py-2 bg-[#f8fafc] border-t border-slate-200 flex items-center justify-between gap-2 flex-shrink-0">
            {isAccepted ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Challenge Allocation Accepted by University &bull; Solution Prototyping Active</span>
                </div>
                <span className="text-[10.5px] font-mono text-[#007A61] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 font-extrabold">
                  ✓ Allocation Accepted
                </span>
              </div>
            ) : isDeclined ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-900">
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center">
                    <X className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>Challenge Allocation Declined by University</span>
                </div>
                <span className="text-[10.5px] font-mono text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300 font-extrabold">
                  ✕ Declined
                </span>
              </div>
            ) : (
              <>
                <span className="text-[11px] font-bold text-slate-600">
                  Ready to take action on this challenge allocation?
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onAcceptChallenge && onAcceptChallenge(challenge)}
                    className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>✓ Accept Challenge</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeclineChallenge && onDeclineChallenge(challenge)}
                    className="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline Allocation</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 5. WhatsApp Replying-To Banner (Appears above Input) */}
        {replyingTo && (
          <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between flex-shrink-0 animate-in slide-in-from-bottom-2">
            <div className="flex items-start space-x-2 border-l-4 border-[#007A61] pl-2.5 truncate">
              <Reply className="w-4 h-4 text-[#007A61] shrink-0 mt-0.5" />
              <div className="truncate text-xs">
                <div className="font-bold text-emerald-950">
                  Replying to {replyingTo.senderName}
                </div>
                <div className="text-slate-600 truncate italic text-[11px]">
                  "{replyingTo.message}"
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="p-1 text-slate-400 hover:text-slate-800 rounded-full cursor-pointer ml-2"
              title="Cancel Reply"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 6. Message Input Footer */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-slate-200 bg-[#f0f2f5] flex items-center space-x-2 flex-shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder={
              replyingTo
                ? `Replying to message...`
                : isUniversityView
                  ? `Message State Nodal Officer...`
                  : `Message ${uniName}...`
            }
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] transition-all shadow-xs"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="px-4 py-2.5 bg-[#007A61] hover:bg-[#006650] disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{sending ? 'Sending...' : 'Send'}</span>
          </button>
        </form>

        {/* 7. WhatsApp Per-Message Delete Confirmation Modal */}
        {deleteModalMsg && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Delete message?</h4>
                  <p className="text-[11px] text-slate-500">Choose how you want to remove this message</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-200 line-clamp-2">
                "{deleteModalMsg.message}"
              </div>

              <div className="space-y-2 pt-1">
                {/* Delete for Everyone (Available if I am the author of the message) */}
                {deleteModalMsg.senderRole === userRole && !deleteModalMsg.isDeletedForEveryone && (
                  <button
                    type="button"
                    onClick={() => handleExecuteDelete('EVERYONE')}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Delete for everyone</span>
                  </button>
                )}

                {/* Delete for Me */}
                <button
                  type="button"
                  onClick={() => handleExecuteDelete('FOR_ME')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Delete for me</span>
                </button>

                {/* Cancel */}
                <button
                  type="button"
                  onClick={() => setDeleteModalMsg(null)}
                  className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ClarificationChatModal;

import React, { useState, useEffect, useRef } from 'react';
import { useClarificationChatSocket } from '../hooks/useClarificationChatSocket.js';
import { useChatActions } from '../hooks/useChatActions.js';
import { resolveChatParticipants } from '../helpers/chatParticipantMeta.js';
import { ChatHeader } from './chat/ChatHeader.jsx';
import { ProblemBriefBanner } from './chat/ProblemBriefBanner.jsx';
import { ClearChatPrompt } from './chat/ClearChatPrompt.jsx';
import { MessageList } from './chat/MessageList.jsx';
import { ChallengeActionBar } from './chat/ChallengeActionBar.jsx';
import { ReplyingToBanner } from './chat/ReplyingToBanner.jsx';
import { ChatInputFooter } from './chat/ChatInputFooter.jsx';
import { DeleteMessageModal } from './chat/DeleteMessageModal.jsx';

export const ClarificationChatModal = ({
  isOpen,
  onClose,
  challenge,
  currentUser,
  isUniversityView = true,
  onAcceptChallenge,
  onDeclineChallenge
}) => {
  const [showStatement, setShowStatement] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  const {
    challengeId, uniCode, uniName, uniLeadDesignation,
    nodalAdminName, nodalDesignation, nodalDepartment, nodalPhone,
    userRole, userName, isAccepted, isDeclined
  } = resolveChatParticipants(challenge, currentUser, isUniversityView);

  const scrollToBottom = () => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const { messages, setMessages, loading, isTypingRemote, deduplicateMessages } = useClarificationChatSocket({
    isOpen, challengeId, userRole, userName, soundEnabled, isUniversityView, nodalAdminName, uniName, scrollToBottom
  });

  const {
    inputText, sending, replyingTo, setReplyingTo, activeMenuMsgId, setActiveMenuMsgId,
    deleteModalMsg, setDeleteModalMsg, highlightedMsgId, setHighlightedMsgId, copiedMsgId,
    showClearConfirm, setShowClearConfirm, clearing, inputRef,
    handleInputChange, handleSendMessage, handleInitiateReply, handleCopyText,
    handleExecuteDelete, handleClearEntireChat
  } = useChatActions({
    challengeId, userRole, userName, isUniversityView, uniLeadDesignation, nodalDesignation,
    uniCode, uniName, nodalAdminName, setMessages, deduplicateMessages, scrollToBottom
  });

  const scrollToMessage = (msgId) => {
    if (!msgId) return;
    const elem = document.getElementById(`msg-${msgId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMsgId(msgId);
      setTimeout(() => setHighlightedMsgId(null), 2000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTypingRemote]);

  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuMsgId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [setActiveMenuMsgId]);

  if (!isOpen || !challenge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 border border-slate-200/90 rounded-2xl w-full max-w-2xl h-[90vh] max-h-[760px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        <ChatHeader
          isUniversityView={isUniversityView}
          challengeId={challengeId}
          uniName={uniName}
          nodalDepartment={nodalDepartment}
          nodalPhone={nodalPhone}
          isTypingRemote={isTypingRemote}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onShowClearConfirm={() => setShowClearConfirm(true)}
          onClose={onClose}
        />

        <ProblemBriefBanner showStatement={showStatement} setShowStatement={setShowStatement} challenge={challenge} />

        {showClearConfirm && (
          <ClearChatPrompt clearing={clearing} onConfirmClear={handleClearEntireChat} onCancel={() => setShowClearConfirm(false)} />
        )}

        <MessageList
          messages={messages}
          loading={loading}
          uniName={uniName}
          userRole={userRole}
          isTypingRemote={isTypingRemote}
          messagesEndRef={messagesEndRef}
          highlightedMsgId={highlightedMsgId}
          activeMenuMsgId={activeMenuMsgId}
          setActiveMenuMsgId={setActiveMenuMsgId}
          copiedMsgId={copiedMsgId}
          onInitiateReply={handleInitiateReply}
          onCopyText={handleCopyText}
          onOpenDeleteModal={(msg) => setDeleteModalMsg(msg)}
          onScrollToMessage={scrollToMessage}
        />

        <ChallengeActionBar
          isUniversityView={isUniversityView}
          isAccepted={isAccepted}
          isDeclined={isDeclined}
          challenge={challenge}
          onAcceptChallenge={onAcceptChallenge}
          onDeclineChallenge={onDeclineChallenge}
        />

        <ReplyingToBanner replyingTo={replyingTo} onCancelReply={() => setReplyingTo(null)} />

        <ChatInputFooter
          inputRef={inputRef}
          inputText={inputText}
          onInputChange={handleInputChange}
          onSendMessage={handleSendMessage}
          sending={sending}
          replyingTo={replyingTo}
          isUniversityView={isUniversityView}
          uniName={uniName}
        />

        <DeleteMessageModal
          deleteModalMsg={deleteModalMsg}
          userRole={userRole}
          onExecuteDelete={handleExecuteDelete}
          onCancel={() => setDeleteModalMsg(null)}
        />
      </div>
    </div>
  );
};

export default ClarificationChatModal;

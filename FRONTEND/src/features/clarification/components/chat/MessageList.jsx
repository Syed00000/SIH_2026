import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import { MessageItem } from './MessageItem.jsx';

export const MessageList = ({
  messages,
  loading,
  uniName,
  hasAssignedUni,
  userRole,
  isTypingRemote,
  messagesEndRef,
  highlightedMsgId,
  activeMenuMsgId,
  setActiveMenuMsgId,
  copiedMsgId,
  onInitiateReply,
  onCopyText,
  onOpenDeleteModal,
  onScrollToMessage
}) => {
  return (
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
              End-to-end synchronized communications between <strong>{hasAssignedUni ? uniName : 'University (Not Assigned)'}</strong> and <strong>State Nodal Officer</strong>.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageItem
            key={`msg_${msg._id || ''}_${index}`}
            msg={msg}
            userRole={userRole}
            uniName={uniName}
            highlightedMsgId={highlightedMsgId}
            activeMenuMsgId={activeMenuMsgId}
            setActiveMenuMsgId={setActiveMenuMsgId}
            copiedMsgId={copiedMsgId}
            onInitiateReply={onInitiateReply}
            onCopyText={onCopyText}
            onOpenDeleteModal={onOpenDeleteModal}
            onScrollToMessage={onScrollToMessage}
          />
        ))
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
  );
};

export default MessageList;

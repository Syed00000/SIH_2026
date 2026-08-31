import React from 'react';
import {
  Shield,
  GraduationCap,
  ChevronDown,
  CornerDownRight,
  Ban,
  Check,
  CheckCheck
} from 'lucide-react';
import { MessageActionMenu } from './MessageActionMenu.jsx';

export const MessageItem = ({
  msg,
  userRole,
  uniName,
  highlightedMsgId,
  activeMenuMsgId,
  setActiveMenuMsgId,
  copiedMsgId,
  onInitiateReply,
  onCopyText,
  onOpenDeleteModal,
  onScrollToMessage
}) => {
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
      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group relative transition-all duration-300 ${isHighlighted ? 'scale-[1.02] ring-2 ring-emerald-500 rounded-2xl' : ''
        }`}
    >
      {/* Sender Header */}
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

      {/* Bubble */}
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] p-2.5 sm:p-3 rounded-2xl text-xs leading-relaxed shadow-xs group ${isMine
          ? 'bg-[#d9fdd3] text-slate-900 border border-emerald-200/80 rounded-tr-xs'
          : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs'
          }`}
      >
        {/* Dropdown Menu Trigger */}
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

            {activeMenuMsgId === msg._id && (
              <MessageActionMenu
                msg={msg}
                copiedMsgId={copiedMsgId}
                onInitiateReply={onInitiateReply}
                onCopyText={onCopyText}
                onOpenDeleteModal={onOpenDeleteModal}
              />
            )}
          </div>
        )}

        {/* Quoted Reply */}
        {msg.replyTo && msg.replyTo.message && (
          <div
            onClick={() => onScrollToMessage(msg.replyTo.messageId)}
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

        {/* Text */}
        {isDeleted ? (
          <div className="flex items-center space-x-1.5 text-slate-400 italic py-0.5">
            <Ban className="w-3.5 h-3.5 text-slate-400" />
            <span>This message was deleted</span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap pr-4 text-slate-900">{msg.message}</p>
        )}

        {/* Timestamp & Ticks */}
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
};

export default MessageItem;

import React from 'react';
import { Reply, Copy, Trash2 } from 'lucide-react';

export const MessageActionMenu = ({
  msg,
  copiedMsgId,
  onInitiateReply,
  onCopyText,
  onOpenDeleteModal
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-6 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 z-30 animate-in fade-in zoom-in-95 text-slate-800 text-xs"
    >
      <button
        type="button"
        onClick={(e) => onInitiateReply(msg, e)}
        className="w-full px-3 py-2 text-left hover:bg-emerald-50 hover:text-[#007A61] flex items-center space-x-2 cursor-pointer transition-colors"
      >
        <Reply className="w-3.5 h-3.5 text-[#007A61]" />
        <span>Reply</span>
      </button>

      <button
        type="button"
        onClick={(e) => onCopyText(msg, e)}
        className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2 cursor-pointer transition-colors"
      >
        <Copy className="w-3.5 h-3.5 text-slate-600" />
        <span>{copiedMsgId === msg._id ? 'Copied!' : 'Copy Text'}</span>
      </button>

      <div className="h-px bg-slate-100 my-1"></div>

      <button
        type="button"
        onClick={(e) => onOpenDeleteModal(msg, e)}
        className="w-full px-3 py-2 text-left hover:bg-rose-50 text-rose-700 flex items-center space-x-2 cursor-pointer transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
        <span>Delete Message...</span>
      </button>
    </div>
  );
};

export default MessageActionMenu;

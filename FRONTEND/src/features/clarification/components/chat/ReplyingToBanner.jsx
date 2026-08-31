import React from 'react';
import { Reply, X } from 'lucide-react';

export const ReplyingToBanner = ({
  replyingTo,
  onCancelReply
}) => {
  if (!replyingTo) return null;

  return (
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
        onClick={onCancelReply}
        className="p-1 text-slate-400 hover:text-slate-800 rounded-full cursor-pointer ml-2"
        title="Cancel Reply"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ReplyingToBanner;

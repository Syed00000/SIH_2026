import React from 'react';
import { MessageSquare, Check, UserPlus, HelpCircle, AlertOctagon } from 'lucide-react';

export const InspectorActionFooter = ({
  norm,
  isMentorAssigned,
  onOpenChat,
  hasUnread = false,
  unreadCount = 0,
  hasMessages = false,
  onAccept,
  onAssignFaculty,
  onRequestClarification,
  onDecline
}) => {
  return (
    <div className="p-3.5 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
      <button
        onClick={onOpenChat}
        className="relative flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-200 text-xs font-extrabold transition-colors cursor-pointer shadow-2xs group"
      >
        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-[#007A61]" />
          {(hasUnread || hasMessages) && (
            <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 border-2 border-white shadow-xs"></span>
            </span>
          )}
        </div>
        <span>Clarification Room</span>
        {hasUnread && unreadCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-[9.5px] font-black bg-rose-600 text-white rounded-full leading-none shadow-2xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <div className="flex items-center space-x-2">
        {norm !== 'Accepted' && onAccept && (
          <button
            onClick={onAccept}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#007A61] hover:bg-[#006650] text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
          >
            <Check className="w-4 h-4" />
            <span>Accept Challenge</span>
          </button>
        )}

        {norm === 'Accepted' && onAssignFaculty && (
          <button
            onClick={onAssignFaculty}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isMentorAssigned ? 'Reassign Mentor' : 'Assign Faculty Mentor'}</span>
          </button>
        )}

        {norm !== 'Accepted' && onRequestClarification && (
          <button
            onClick={onRequestClarification}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Request Info</span>
          </button>
        )}

        {norm !== 'Accepted' && onDecline && (
          <button
            onClick={onDecline}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-rose-500" />
            <span>Decline</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InspectorActionFooter;

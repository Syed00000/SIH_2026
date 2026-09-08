import React from 'react';
import { Send, MessageSquare, Check, HelpCircle, GraduationCap, Building2 } from 'lucide-react';

export const DossierActionFooter = ({
  isUniversityView,
  isAccepted,
  isDeclined,
  onAccept,
  onDecline,
  onRequestClarification,
  onAssignFaculty,
  onOpenChat,
  onOpenTriage,
  onOpenAssignBlock,
  problemScope = 'big',
  onClose,
  challenge = {}
}) => {
  return (
    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        {onOpenChat && (
          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md border border-slate-300 hover:bg-[#047857] text-slate-700 hover:text-white hover:border-[#047857] text-xs font-bold transition-all cursor-pointer shadow-3xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat / Clarify</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {isUniversityView ? (
          <>
            {!isAccepted && !isDeclined && onAccept && (
              <button
                type="button"
                onClick={onAccept}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept Challenge</span>
              </button>
            )}

            {onRequestClarification && (
              <button
                type="button"
                onClick={onRequestClarification}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer shadow-3xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need Info</span>
              </button>
            )}

            {isAccepted && onAssignFaculty && (
              <button
                type="button"
                onClick={onAssignFaculty}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md bg-[#047857] hover:bg-[#064e3b] text-white text-xs font-bold cursor-pointer shadow-xs border border-emerald-700 transition-all"
              >
                <GraduationCap className="w-4 h-4 text-emerald-200" />
                <span>Assign to Faculty</span>
              </button>
            )}
          </>
        ) : (
          <>
            {/* Small Problems ONLY: Assign to Administrative Block */}
            {problemScope === 'small' && onOpenAssignBlock && (
              <button
                type="button"
                onClick={onOpenAssignBlock}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#007A61] hover:bg-[#006651] text-white text-xs font-bold cursor-pointer shadow-xs transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Assign to Block</span>
              </button>
            )}

            {/* Big Problems ONLY: Allocate to University */}
            {problemScope !== 'small' && onOpenTriage && (
              challenge?.status === 'Withdrawn' ? (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-md border border-slate-200 cursor-not-allowed">
                  Withdrawn (Cannot Allocate)
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenTriage}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#047857] hover:bg-[#064e3b] text-white text-xs font-bold cursor-pointer shadow-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{challenge?.assignedUniversity?.id ? 'Reassign Problem' : 'Allocate to University'}</span>
                </button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DossierActionFooter;

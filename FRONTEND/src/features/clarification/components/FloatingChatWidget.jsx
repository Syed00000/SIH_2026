import React, { useState } from 'react';
import { MessageSquare, X, ChevronUp } from 'lucide-react';

export const FloatingChatWidget = ({
  onOpenChat,
  challenges = [],
  isUniversityView = true
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter challenges that have active clarification or are pending acceptance
  const activeChatChallenges = challenges.filter(
    (c) =>
      c.clarificationQuery ||
      c.clarificationResponse ||
      c.status === 'Clarification Requested' ||
      c.status === 'Clarified' ||
      c.assignedUniversity?.clarificationQuery ||
      c.clarificationStatus === 'REQUESTED' ||
      c.clarificationStatus === 'RESOLVED' ||
      !c.assignedUniversity?.acceptanceStatus ||
      c.assignedUniversity?.acceptanceStatus === 'Pending Review'
  );

  const displayList = activeChatChallenges.length > 0 ? activeChatChallenges : challenges.slice(0, 5);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end select-none">
      {/* Expanded Quick Selector Popup */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <MessageSquare className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wide uppercase">
                  {isUniversityView ? 'Nodal Clarification Intercom' : 'HEI Clarification Desk'}
                </h4>
                <p className="text-[10px] text-emerald-200 font-medium flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Socket.IO Real-time Channels</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-emerald-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Problem Statement List */}
          <div className="max-h-72 overflow-y-auto p-2 space-y-1.5 bg-slate-50/60 custom-scrollbar text-xs">
            {displayList.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-1">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-1" />
                <p className="font-bold text-xs text-slate-600">No Active Problem Statements</p>
                <p className="text-[11px] text-slate-400">Allocated challenges will appear here for live chat.</p>
              </div>
            ) : (
              displayList.map((ch) => {
                const chlId = ch.challengeId || ch.id || 'CHL-JH-2026';
                const hasQuery = ch.clarificationQuery || ch.assignedUniversity?.clarificationQuery;
                const hasResponse = ch.clarificationResponse;

                return (
                  <button
                    key={chlId}
                    onClick={() => {
                      setIsOpen(false);
                      if (onOpenChat) onOpenChat(ch);
                    }}
                    className="w-full text-left p-2.5 bg-white hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 rounded-xl transition-all cursor-pointer shadow-2xs group flex flex-col space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10.5px] font-black text-[#007A61]">
                        {chlId}
                      </span>
                      {hasResponse ? (
                        <span className="text-[9.5px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Clarified ✓
                        </span>
                      ) : hasQuery ? (
                        <span className="text-[9.5px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded animate-pulse">
                          Query Active
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          Open Room
                        </span>
                      )}
                    </div>
                    <p className="font-extrabold text-slate-900 group-hover:text-emerald-900 truncate text-xs">
                      {ch.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{ch.domain || 'Field Challenge'}</span>
                      <span className="text-[#007A61] font-bold group-hover:underline">Start Chat &rarr;</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button with Animated Indicator */}
      <button
        onClick={() => {
          if (challenges.length === 1 && onOpenChat) {
            onOpenChat(challenges[0]);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className="group relative flex items-center space-x-2.5 bg-[#007A61] hover:bg-[#006650] text-white px-4 py-3 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/20"
        title="Open Real-time Clarification Room"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#007A61] animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#007A61]"></span>
        </div>

        <div className="text-left leading-tight hidden sm:block">
          <div className="text-xs font-black tracking-wide">
            {isUniversityView ? 'Clarification Desk' : 'HEI Real-Time Chat'}
          </div>
          <div className="text-[10px] text-emerald-200 font-semibold">
            Socket.IO Live &bull; Click to Chat
          </div>
        </div>

        <ChevronUp className={`w-4 h-4 text-emerald-200 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
};

export default FloatingChatWidget;

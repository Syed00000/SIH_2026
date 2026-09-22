import React from 'react';
import { User, Loader2 } from 'lucide-react';
import { JoharSetuIcon } from './JoharSetuIcon.jsx';

/**
 * Message list showing conversation bubbles, Johar Setu avatars, timestamps, and loading state.
 */
export const AssistantMessageList = ({ messages, loading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar bg-slate-50/40">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
          >
            <div className={`flex items-start gap-2.5 max-w-[86%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              {!isUser ? (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-emerald-600/30 shadow-2xs mt-0.5">
                  <JoharSetuIcon className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs shadow-2xs mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#015a3a] text-white rounded-2xl rounded-tr-xs font-medium'
                    : 'bg-[#eaf6ef] border border-emerald-100/60 text-slate-800 rounded-2xl rounded-tl-xs font-normal'
                }`}
              >
                {/* Optional attached file preview */}
                {msg.attachment && (
                  <div className="mb-2 p-1.5 bg-black/5 rounded-lg text-[11px] flex items-center space-x-1.5 overflow-hidden">
                    <span className="font-semibold">📎 Attached:</span>
                    <span className="truncate">{msg.attachment.name}</span>
                  </div>
                )}
                <div className="whitespace-pre-line break-words">{msg.content}</div>
              </div>
            </div>

            {/* Timestamp below the bubble */}
            <span
              className={`text-[10px] text-slate-400 font-medium mt-1 ${
                isUser ? 'mr-1' : 'ml-10.5'
              }`}
            >
              {msg.time || 'Just now'}
            </span>
          </div>
        );
      })}

      {/* Loading / Thinking State */}
      {loading && (
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-emerald-600/30 shadow-2xs">
            <JoharSetuIcon className="w-6 h-6" />
          </div>
          <div className="p-3 bg-[#eaf6ef] border border-emerald-100/60 rounded-2xl rounded-tl-xs text-xs flex items-center space-x-2 shadow-2xs text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin text-[#015a3a]" />
            <span className="font-medium">Johar Setu Assistant is typing...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default AssistantMessageList;

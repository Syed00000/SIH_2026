import React from 'react';
import { Send } from 'lucide-react';

export const ChatInputFooter = ({
  inputRef,
  inputText,
  onInputChange,
  onSendMessage,
  sending,
  replyingTo,
  isUniversityView,
  uniName,
  hasAssignedUni
}) => {
  return (
    <form
      onSubmit={onSendMessage}
      className="p-3 border-t border-slate-200 bg-slate-50 flex items-center space-x-2 flex-shrink-0"
    >
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={onInputChange}
        placeholder={
          replyingTo
            ? 'Replying to message...'
            : isUniversityView
              ? 'Message State Nodal Officer...'
              : hasAssignedUni
                ? `Message ${uniName}...`
                : 'Message University (Not Assigned)...'
        }
        className="flex-1 bg-white border border-slate-200 rounded-md px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#047857] focus:ring-1 focus:ring-[#047857] transition-all shadow-2xs"
      />

      <button
        type="submit"
        disabled={!inputText.trim() || sending}
        className="px-4 py-2.5 bg-[#047857] hover:bg-[#064e3b] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-md text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs shrink-0"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{sending ? 'Sending...' : 'Send'}</span>
      </button>
    </form>
  );
};

export default ChatInputFooter;

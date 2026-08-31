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
  uniName
}) => {
  return (
    <form
      onSubmit={onSendMessage}
      className="p-3 border-t border-slate-200 bg-[#f0f2f5] flex items-center space-x-2 flex-shrink-0"
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
              : `Message ${uniName}...`
        }
        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] transition-all shadow-xs"
      />

      <button
        type="submit"
        disabled={!inputText.trim() || sending}
        className="px-4 py-2.5 bg-[#007A61] hover:bg-[#006650] disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{sending ? 'Sending...' : 'Send'}</span>
      </button>
    </form>
  );
};

export default ChatInputFooter;

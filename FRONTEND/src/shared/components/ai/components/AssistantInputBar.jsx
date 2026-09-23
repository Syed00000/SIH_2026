import React, { useRef, useState } from 'react';
import { Paperclip, Mic, MicOff, Send, X } from 'lucide-react';

/**
 * Bottom Input Bar matching reference screenshot:
 * Pill container with Paperclip, Text input, Mic button, and circular Green Send button.
 */
export const AssistantInputBar = ({
  input,
  setInput,
  onSend,
  loading,
  placeholder = 'Type your message here...',
  onVoiceInput
}) => {
  const fileInputRef = useRef(null);
  const [attachment, setAttachment] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isMedia = file.type.startsWith('image/') || file.type.startsWith('video/');
      const previewUrl = isMedia ? URL.createObjectURL(file) : null;
      setAttachment({
        name: file.name,
        size: file.size,
        type: file.type,
        rawFile: file,
        previewUrl
      });
    }
  };

  const clearAttachment = () => {
    if (attachment?.previewUrl) {
      try { URL.revokeObjectURL(attachment.previewUrl); } catch (_) {}
    }
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Default to Indian English / Hindi recognition
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          if (onVoiceInput) onVoiceInput(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!input.trim() && !attachment) || loading) return;
    onSend(input, attachment);
    clearAttachment();
  };

  return (
    <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
      {/* Attached file chip */}
      {attachment && (
        <div className="mb-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800 animate-fade-in">
          <div className="flex items-center space-x-1.5 truncate">
            {attachment.type?.startsWith('video/') ? (
              <span className="text-[10px] font-bold bg-emerald-700 text-white px-1.5 py-0.5 rounded">VIDEO</span>
            ) : attachment.type?.startsWith('image/') ? (
              <span className="text-[10px] font-bold bg-[#015a3a] text-white px-1.5 py-0.5 rounded">PHOTO</span>
            ) : (
              <Paperclip className="w-3.5 h-3.5 text-[#015a3a]" />
            )}
            <span className="truncate font-medium">{attachment.name}</span>
          </div>
          <button
            type="button"
            onClick={clearAttachment}
            className="p-0.5 hover:bg-emerald-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        {/* Pill Box */}
        <div className="flex-1 flex items-center bg-white border border-slate-200/90 rounded-full px-3 py-1.5 shadow-2xs focus-within:border-[#015a3a] focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*,.pdf"
            className="hidden"
          />

          {/* Paperclip Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Evidence / File"
            className="p-1.5 text-slate-400 hover:text-[#015a3a] rounded-full transition-colors cursor-pointer shrink-0"
          >
            <Paperclip className="w-4 h-4 rotate-45 stroke-[2.2]" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 px-2.5 py-1.5 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
          />

          {/* Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            title={isListening ? 'Listening...' : 'Voice Search'}
            className={`p-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'text-red-500 bg-red-50 animate-pulse'
                : 'text-slate-500 hover:text-[#015a3a] hover:bg-slate-100'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 stroke-[2]" />}
          </button>
        </div>

        {/* Circular Send Button */}
        <button
          type="submit"
          disabled={(!input.trim() && !attachment) || loading}
          title="Send Message"
          className="w-11 h-11 bg-[#015a3a] hover:bg-[#01482e] active:scale-95 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-emerald-900/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 group"
        >
          <Send className="w-4 h-4 text-white -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default AssistantInputBar;

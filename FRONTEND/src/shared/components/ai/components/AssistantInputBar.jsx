import React, { useRef, useState, useEffect } from 'react';
import { Paperclip, Mic, MicOff, Send, X } from 'lucide-react';

/**
 * Bottom Input Bar matching reference screenshot:
 * Pill container with Paperclip, Text input, Mic button, and circular Green Send button.
 * Supports Voice Input (Web Speech API) with Indian locale / Hinglish support.
 */
export const AssistantInputBar = ({
  input,
  setInput,
  onSend,
  loading,
  placeholder = 'Type your message here...',
  onVoiceInput,
  currentLang = 'en'
}) => {
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const latestTranscriptRef = useRef(input);
  const autoSendTimerRef = useRef(null);

  const [attachment, setAttachment] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');

  // Keep latestTranscriptRef synchronized with input prop
  useEffect(() => {
    latestTranscriptRef.current = input;
  }, [input]);

  // Clean up any active speech recognition and pending timer on unmount
  useEffect(() => {
    const handleTriggerAttachment = () => {
      fileInputRef.current?.click();
    };
    window.addEventListener('joharsetu:trigger-evidence-attachment', handleTriggerAttachment);

    return () => {
      window.removeEventListener('joharsetu:trigger-evidence-attachment', handleTriggerAttachment);
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, []);

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

  const showVoiceNotice = (msg) => {
    setVoiceNotice(msg);
    setTimeout(() => {
      setVoiceNotice((prev) => (prev === msg ? '' : prev));
    }, 4500);
  };

  const getSpeechLang = (lang) => {
    switch (lang) {
      case 'bn':
        return 'bn-IN';
      case 'sat':
        return 'hi-IN'; // Hindi acoustic model works best for regional Santhali accents
      case 'hi':
      case 'en':
      default:
        return 'hi-IN'; // hi-IN accurately captures Hindi, Bhojpuri, Magahi, Hinglish and English civic words
    }
  };

  const scheduleAutoSend = (delay = 350) => {
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
    }
    autoSendTimerRef.current = setTimeout(() => {
      const finalMsg = (latestTranscriptRef.current || input || '').trim();
      if (finalMsg && !loading) {
        onSend(finalMsg, null);
        latestTranscriptRef.current = '';
        setInput('');
      }
    }, delay);
  };

  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showVoiceNotice('Voice input is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    // If already listening, stop recording cleanly and auto-send
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
      scheduleAutoSend(300);
      return;
    }

    try {
      setVoiceNotice('');
      const recognition = new SpeechRecognition();
      recognition.lang = getSpeechLang(currentLang);
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Preserve existing typed text before voice starts
      const initialText = input ? input.trim() : '';
      baseTextRef.current = initialText;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let fullFinal = '';
        let fullInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          const transcriptChunk = item[0]?.transcript || '';
          if (item.isFinal) {
            fullFinal += (fullFinal ? ' ' : '') + transcriptChunk.trim();
          } else {
            fullInterim += (fullInterim ? ' ' : '') + transcriptChunk.trim();
          }
        }

        let spokenText = fullFinal.trim();
        if (fullInterim.trim()) {
          spokenText = spokenText ? `${spokenText} ${fullInterim.trim()}` : fullInterim.trim();
        }

        spokenText = spokenText.replace(/\s+/g, ' ').trim();

        if (spokenText) {
          const fullMessage = baseTextRef.current
            ? `${baseTextRef.current} ${spokenText}`
            : spokenText;
          setInput(fullMessage);
          latestTranscriptRef.current = fullMessage;
          if (onVoiceInput) onVoiceInput(fullMessage);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        const err = event.error;
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          showVoiceNotice('Microphone permission is required. Please allow microphone access.');
        } else if (err === 'audio-capture') {
          showVoiceNotice('No microphone was found or microphone is busy.');
        } else if (err === 'network') {
          showVoiceNotice('Network error during voice recognition.');
        } else if (err === 'no-speech') {
          // Graceful handling on silence timeout
        } else if (err !== 'aborted') {
          showVoiceNotice('Could not recognize voice. Please speak clearly and try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-send when recognition naturally ends (e.g. user pauses speaking)
        scheduleAutoSend(400);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
      showVoiceNotice('Voice input could not be started.');
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    // Cancel pending auto-send timer if user submits manually
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }

    // If currently listening when user submits, stop recognition cleanly
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    }

    const messageToSend = (latestTranscriptRef.current || input || '').trim();
    if (!messageToSend && !attachment) return;
    if (loading) return;

    onSend(messageToSend, attachment);
    latestTranscriptRef.current = '';
    clearAttachment();
  };

  const activePlaceholder = isListening
    ? (currentLang === 'hi' ? 'सुन रहा हूँ... बोलिए...' : 'Listening... Speak now...')
    : placeholder;

  return (
    <div className="p-3 bg-white border-t border-slate-100 rounded-b-2xl">
      {/* Voice notice / friendly status message */}
      {voiceNotice && (
        <div className="mb-2 px-2.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-lg text-xs text-amber-800 flex items-center justify-between animate-fade-in shadow-2xs">
          <span>{voiceNotice}</span>
          <button
            type="button"
            onClick={() => setVoiceNotice('')}
            className="p-0.5 hover:bg-amber-200/60 rounded text-amber-700 ml-2 cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
            aria-label="Remove attachment"
          >
            <X className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </div>
      )}

      {/* Active Listening Audio Wave Banner */}
      {isListening && (
        <div className="mb-2 px-3 py-2 bg-red-50/90 border border-red-200/80 rounded-xl flex items-center justify-between animate-fade-in shadow-2xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-xs font-semibold text-red-700">
              {currentLang === 'hi' ? '🎙️ माइक चालू है... बोलिए' : '🎙️ Mic is listening... Speak now'}
            </span>
            {/* Animated Audio Wave Bars */}
            <div className="flex items-center space-x-0.5 ml-2">
              <span className="w-0.5 h-3 bg-red-500 animate-pulse"></span>
              <span className="w-0.5 h-4 bg-red-600 animate-pulse [animation-delay:150ms]"></span>
              <span className="w-0.5 h-2 bg-red-400 animate-pulse [animation-delay:300ms]"></span>
              <span className="w-0.5 h-5 bg-red-600 animate-pulse [animation-delay:75ms]"></span>
              <span className="w-0.5 h-3 bg-red-500 animate-pulse [animation-delay:200ms]"></span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleVoice}
            className="text-[11px] font-bold text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
          >
            Done / Stop
          </button>
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        {/* Pill Box */}
        <div className={`flex-1 flex items-center bg-white border rounded-full px-3 py-1.5 shadow-2xs transition-all ${
          isListening
            ? 'border-red-400 ring-2 ring-red-400/20'
            : 'border-slate-200/90 focus-within:border-[#015a3a] focus-within:ring-2 focus-within:ring-emerald-600/20'
        }`}>
          {/* Hidden File Input */}
          <input
            type="file"
            id="ai-chat-evidence-file-input"
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
            aria-label="Attach Evidence / File"
            className="p-1.5 text-slate-400 hover:text-[#015a3a] rounded-full transition-colors cursor-pointer shrink-0"
          >
            <Paperclip className="w-4 h-4 rotate-45 stroke-[2.2]" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            id="ai-assistant-text-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activePlaceholder}
            disabled={loading}
            aria-label="Chat input message"
            className="flex-1 px-2.5 py-1.5 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
          />

          {/* Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            title={isListening ? 'Listening... Click to stop' : 'Voice Input (Click to speak)'}
            aria-label={isListening ? 'Listening... Click to stop' : 'Start voice input'}
            className={`relative p-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'text-red-600 bg-red-50 ring-2 ring-red-400/40 animate-pulse'
                : 'text-slate-500 hover:text-[#015a3a] hover:bg-slate-100'
            }`}
          >
            {isListening ? (
              <>
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <MicOff className="w-4 h-4" />
              </>
            ) : (
              <Mic className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>

        {/* Circular Send Button */}
        <button
          type="submit"
          disabled={(!input.trim() && !attachment) || loading}
          title="Send Message"
          aria-label="Send Message"
          className="w-11 h-11 bg-[#015a3a] hover:bg-[#01482e] active:scale-95 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-emerald-900/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 group"
        >
          <Send className="w-4 h-4 text-white -translate-x-0.5 translate-y-0.5 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default AssistantInputBar;


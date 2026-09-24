import { useState, useRef, useEffect, useCallback } from 'react';
import { apiClient } from '../../../../infrastructure/api/client.js';
import { config } from '../../../../infrastructure/config.js';
import { citizenService } from '../../../../features/citizen/services/citizenService.js';
import { useAuth } from '../../../../features/auth/AuthContext.jsx';
import { SUPPORTED_LANGUAGES } from '../components/AssistantLanguageModal.jsx';

const formatTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Strips markdown, delimiters, bullet points, URLs, and table artifacts for natural human-like voice synthesis
 */
const cleanTextForSpeech = (rawText) => {
  if (!rawText) return '';
  return String(rawText)
    .replace(/---BUBBLE---/g, '. ')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/[`*#_~[\]]/g, '')
    .replace(/•/g, '')
    .replace(/[|]/g, ' ')
    .replace(/📞/g, 'Call: ')
    .replace(/[^\w\s\u0900-\u097F\u0980-\u09FF\u1C50-\u1C7F.,!?-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const useAiAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return localStorage.getItem('joharsetu_ai_lang') || 'en';
    } catch (_) {
      return 'en';
    }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const [messages, setMessages] = useState(() => {
    const savedLang = (() => {
      try { return localStorage.getItem('joharsetu_ai_lang') || 'en'; } catch (_) { return 'en'; }
    })();
    let greeting = "Namaste! Welcome to JoharSetu Assistant. 👋\nI can help you report civic issues, track progress, or find department helplines.\nHow can I help you today?";
    if (savedLang === 'hi') greeting = "नमस्ते भाई जी! 🙏\nमैं आपका जोहारसेतु सहायक हूँ।\nबताइए, आज आपकी क्या सहायता करूँ?";
    else if (savedLang === 'bn') greeting = "নমস্কার ভাই! 🙏\nআমি আপনার জোহার সেতু সহায়ক।\nবলুন, আজ কীভাবে সাহায্য করতে পারি?";
    else if (savedLang === 'sat') greeting = "ᱡᱚᱦᱟᱨ gate! 🙏\nᱤᱧ ᱡᱚᱦᱟᱨ ᱥᱮᱛᱩ ᱜᱚᱲᱚᱭᱤᱡ ᱠᱟᱹᱱᱟᱹᱧ᱾\nᱞᱟᱹᱭ ᱢᱮ, ᱪᱮᱫ ᱜᱚᱲᱚ ᱞᱟᱹᱠᱛᱤ?";
    return [{ id: 'welcome', role: 'assistant', content: greeting, time: formatTime() }];
  });

  const messagesEndRef = useRef(null);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    setSpeakingMessageId(null);
  }, []);

  const speakText = useCallback((rawText, langCode = 'en', messageId = null) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const textToSpeak = cleanTextForSpeech(rawText);
      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Determine voice locale
      let targetLocale = 'en-IN';
      if (langCode === 'en') targetLocale = 'en-IN';
      else if (langCode === 'hi') targetLocale = 'hi-IN';
      else if (langCode === 'bn') targetLocale = 'bn-IN';
      else if (langCode === 'sat') targetLocale = 'hi-IN';

      utterance.lang = targetLocale;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Match available voices
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let preferredVoice = null;
        if (langCode === 'en') {
          preferredVoice = voices.find(v => /english \(india\)|indian|ravi|priya|neerja|george|zira|david/i.test(v.name)) ||
                           voices.find(v => v.lang.startsWith('en')) ||
                           voices[0];
        } else if (langCode === 'hi' || langCode === 'sat') {
          preferredVoice = voices.find(v => /hindi|heera|hemant|kalpana|swara/i.test(v.name)) ||
                           voices.find(v => v.lang.startsWith('hi')) ||
                           voices[0];
        } else if (langCode === 'bn') {
          preferredVoice = voices.find(v => /bengali|bangla/i.test(v.name)) ||
                           voices.find(v => v.lang.startsWith('bn')) ||
                           voices[0];
        } else {
          preferredVoice = voices.find(v => v.lang.startsWith(targetLocale.slice(0, 2))) || voices[0];
        }

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => {
        setSpeakingMessageId(messageId);
      };

      utterance.onend = () => {
        setSpeakingMessageId(null);
      };

      utterance.onerror = () => {
        setSpeakingMessageId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Text-to-speech error:', err);
      setSpeakingMessageId(null);
    }
  }, []);

  // Stop speaking if drawer is closed or unmounted
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
    }
  }, [isOpen, stopSpeaking]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = async (textToSend, attachment = null) => {
    const query = (typeof textToSend === 'string' ? textToSend : input).trim();
    if (!query && !attachment) return;
    if (loading) return;

    // Stop previous voice output when a new message is sent
    stopSpeaking();

    console.log('[JoharSetu AI Chat] FINAL MESSAGE SENT TO AI:', query);

    // 1. Upload media file to storage if attached
    let uploadedMedia = [];
    let processedAttachment = attachment;

    if (attachment?.rawFile) {
      try {
        const uploadRes = await citizenService.uploadEvidence(attachment.rawFile, {
          caption: query || attachment.name
        });
        const mediaObj = uploadRes?.data || uploadRes;
        const mediaUrl = mediaObj?.accessUrl || mediaObj?.url || '';
        if (mediaUrl) {
          const mediaItem = {
            url: mediaUrl,
            accessUrl: mediaUrl,
            mediaId: mediaObj.mediaId || mediaObj.publicId || `MED-${Date.now()}`,
            publicId: mediaObj.providerPublicId || mediaObj.publicId || mediaObj.mediaId || '',
            resourceType: attachment.type?.startsWith('video/') ? 'video' : (attachment.type?.startsWith('image/') ? 'image' : (mediaObj.fileType || 'image')),
            fileType: attachment.type?.startsWith('video/') ? 'video' : (attachment.type?.startsWith('image/') ? 'image' : (mediaObj.fileType || 'image')),
            fileName: mediaObj.fileName || attachment.name || 'Evidence Asset',
            caption: query || attachment.name
          };
          uploadedMedia.push(mediaItem);
          processedAttachment = {
            ...attachment,
            url: mediaUrl
          };
        }
      } catch (uploadErr) {
        console.warn('Media upload warning, passing local fallback:', uploadErr.message);
      }
    }

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query || (attachment ? `Sent attachment: ${attachment.name}` : ''),
      attachment: processedAttachment,
      media: uploadedMedia,
      time: formatTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome' && m.id !== 'welcome-reset')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
          draftReport: m.draftReport || null,
          media: m.media || (m.draftReport?.media || [])
        }));

      const requestBody = {
        message: query || (attachment ? `Uploaded evidence: ${attachment.name}` : ''),
        history: historyPayload,
        media: uploadedMedia,
        currentLang,
        user: user
          ? {
              id: user._id || user.id,
              fullName: user.fullName || user.name || 'Citizen',
              email: user.email,
              mobileNumber: user.mobileNumber || user.phone,
              district: user.profile?.district || user.district || ''
            }
          : null
      };

      console.log('[JoharSetu AI Chat] Request payload to citizen/ai-chat:', requestBody);

      // 2. Call AI chat with user session, media, and language context — minimum 700ms thinking delay
      //    so the bouncing dots typing indicator is visibly appreciated by the user
      let res;
      try {
        [res] = await Promise.all([
          apiClient.post('citizen/ai-chat', requestBody),
          new Promise((resolve) => setTimeout(resolve, 700))
        ]);
      } catch (apiErr) {
        // If we got a 401 (expired session), retry without auth token — ai-chat works without auth
        if (apiErr?.status === 401 || apiErr?.response?.status === 401) {
          console.warn('[JoharSetu AI Chat] 401 received, retrying as guest (ai-chat is optionalAuth)');
          const baseUrl = config.api.baseUrl.endsWith('/') ? config.api.baseUrl : `${config.api.baseUrl}/`;
          const guestRes = await fetch(`${baseUrl}citizen/ai-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });
          res = await guestRes.json();
        } else {
          throw apiErr;
        }
      }

      const d = res.data?.data || res.data || {};
      const replyText = d.reply || 'Aapka sandesh prapt hua.';
      const { draftReport = null, createdChallenge = null, trackingData = null, challengesList = null, withdrawnChallenge = null, deletedChallengeId = null, actionTarget = null, showEditChips = false } = d;

      if (createdChallenge || withdrawnChallenge || deletedChallengeId) {
        try {
          window.dispatchEvent(new CustomEvent('joharsetu:challenge-submitted', { detail: { createdChallenge, withdrawnChallenge, deletedChallengeId } }));
        } catch (_) {}
      }

      const assistantMsgId = `a-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: 'assistant', content: replyText, draftReport, createdChallenge, trackingData, challengesList, withdrawnChallenge, deletedChallengeId, actionTarget, showEditChips, time: formatTime() }
      ]);

      // Automatically speak assistant response if voice output is enabled
      if (isVoiceEnabled) {
        speakText(replyText, currentLang, assistantMsgId);
      }
    } catch (err) {
      const serverErrMsg =
        err?.status === 401
          ? 'Aapka session expire ho gaya hai. Kripya login karein aur dobara try karein.'
          : (err.response?.data?.message || err.response?.data?.error?.message || err.message || 'Kshama karein, thodi takneeki samasya aayi.');
      const errorMsgId = `err-${Date.now()}`;
      setMessages((prev) => [...prev, { id: errorMsgId, role: 'assistant', content: `⚠️ ${serverErrMsg}`, time: formatTime() }]);
      if (isVoiceEnabled) {
        speakText(serverErrMsg, currentLang, errorMsgId);
      }
    } finally {
      setLoading(false);
    }

  };

  const handleSelectLanguage = (langObj) => {
    setCurrentLang(langObj.code);
    const langMsgId = `lang-${Date.now()}`;
    setMessages((prev) => [...prev, { id: langMsgId, role: 'assistant', content: langObj.greeting, time: formatTime() }]);
    if (isVoiceEnabled) {
      speakText(langObj.greeting, langObj.code, langMsgId);
    }
  };

  const handleSubmitChallenge = () => {
    let q = 'Hey buddy, how do I submit a new problem on JoharSetu?';
    if (currentLang === 'hi') q = 'भाई नई समस्या कैसे दर्ज करूँ?';
    else if (currentLang === 'bn') q = 'ভাই নতুন সমস্যা কীভাবে জমা করব?';
    else if (currentLang === 'sat') q = 'ᱜᱟᱛᱮ ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱪᱮᱫ ᱞᱮᱠᱟᱛᱮ ᱮᱢ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ?';
    handleSendMessage(q);
  };

  const handleTrackChallenge = () => {
    let q = 'Hey friend, how can I track the live status of my problem?';
    if (currentLang === 'hi') q = 'भाई मेरी समस्या का स्टेटस कैसे ट्रैक करें?';
    else if (currentLang === 'bn') q = 'ভাই আমার সমস্যার স্ট্যাটাস কীভাবে ট্র্যাক করব?';
    else if (currentLang === 'sat') q = 'ᱜᱟᱛᱮ ᱤᱧᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮᱱᱟᱜ ᱥᱴᱮᱴᱟᱥ ᱪᱮᱠ ᱢᱮ';
    handleSendMessage(q);
  };

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: "Hey there! 👏\nI'm your Johar Setu AI buddy.\nTell me, how can I help you today?",
        time: formatTime()
      }
    ]);
  };

  return {
    isOpen,
    setIsOpen,
    isLanguageModalOpen,
    setIsLanguageModalOpen,
    currentLang,
    input,
    setInput,
    loading,
    messages,
    messagesEndRef,
    isVoiceEnabled,
    setIsVoiceEnabled,
    speakingMessageId,
    speakText,
    stopSpeaking,
    handleSendMessage,
    handleSelectLanguage,
    handleSubmitChallenge,
    handleTrackChallenge,
    handleClearChat
  };
};

export default useAiAssistant;

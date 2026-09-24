import { useState, useRef, useEffect, useCallback } from 'react';
import { apiClient } from '../../../../infrastructure/api/client.js';
import { config } from '../../../../infrastructure/config.js';
import { citizenService } from '../../../../features/citizen/services/citizenService.js';
import { useAuth } from '../../../../features/auth/AuthContext.jsx';
import { SUPPORTED_LANGUAGES } from '../components/AssistantLanguageModal.jsx';

const formatTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const useAiAssistant = ({ mode = 'citizen' } = {}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const initialWelcomeMessage = mode === 'info'
    ? "Namaste! 👏\nI'm JoharSetu Information Assistant.\nHow can I help you with information about JoharSetu public services today?"
    : "Namaste! 👏\nI'm Johar Setu Assistant.\nHow can I help you today?";

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: initialWelcomeMessage,
      time: formatTime()
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = async (textToSend, attachmentOrOptions = null) => {
    let attachment = null;
    let displayLabel = null;
    if (attachmentOrOptions && (attachmentOrOptions.rawFile || attachmentOrOptions.name || attachmentOrOptions.previewUrl)) {
      attachment = attachmentOrOptions;
    } else if (attachmentOrOptions && typeof attachmentOrOptions === 'object') {
      attachment = attachmentOrOptions.attachment || null;
      displayLabel = attachmentOrOptions.displayLabel || null;
    }

    const query = (typeof textToSend === 'string' ? textToSend : input).trim();
    if (!query && !attachment) return;
    if (loading) return;

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

    // Friendly human-like display text for citizen's chat bubble
    let bubbleContent = displayLabel;
    if (!bubbleContent) {
      if (query.startsWith('CONFIRM_SUBMIT:')) {
        bubbleContent = currentLang === 'hi'
          ? '✓ पुष्टि करें और सबमिट करें'
          : currentLang === 'en'
          ? '✓ Confirm & Submit'
          : '✓ Haan, submit kar do';
      } else if (query.startsWith('CONFIRM_WITHDRAW:')) {
        const id = query.replace('CONFIRM_WITHDRAW:', '').trim();
        bubbleContent = currentLang === 'hi'
          ? `✓ वापस लेने की पुष्टि करें ${id ? `(${id})` : ''}`
          : currentLang === 'en'
          ? `✓ Confirm Withdrawal ${id ? `(${id})` : ''}`
          : `✓ Haan, wapas le lo ${id ? `(${id})` : ''}`;
      } else if (query.startsWith('CONFIRM_DELETE:')) {
        const id = query.replace('CONFIRM_DELETE:', '').trim();
        bubbleContent = currentLang === 'hi'
          ? `✓ हटाने की पुष्टि करें ${id ? `(${id})` : ''}`
          : currentLang === 'en'
          ? `✓ Confirm Delete ${id ? `(${id})` : ''}`
          : `✓ Haan, delete kar do ${id ? `(${id})` : ''}`;
      } else {
        bubbleContent = query || (attachment ? `Sent attachment: ${attachment.name}` : '');
      }
    }

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: bubbleContent,
      rawQuery: query, // preserve exact command for backend wire transport
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
        .slice(-8)
        .map((m) => ({
          role: m.role,
          content: m.rawQuery || m.content,
          draftReport: m.draftReport || null,
          media: m.media || (m.draftReport?.media || [])
        }));

      const requestBody = {
        message: query || (attachment ? `Uploaded evidence: ${attachment.name}` : ''),
        history: historyPayload,
        media: uploadedMedia,
        selectedLanguage: currentLang,
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
      const { draftReport = null, createdChallenge = null, trackingData = null, challengesList = null, withdrawnChallenge = null, deletedChallengeId = null, actionTarget = null, showEditChips = false, selectedLanguage = null } = d;

      if (selectedLanguage && selectedLanguage !== currentLang) {
        setCurrentLang(selectedLanguage);
      }

      if (createdChallenge || withdrawnChallenge || deletedChallengeId) {
        try {
          window.dispatchEvent(new CustomEvent('joharsetu:challenge-submitted', { detail: { createdChallenge, withdrawnChallenge, deletedChallengeId } }));
        } catch (_) {}
      }

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: replyText, draftReport, createdChallenge, trackingData, challengesList, withdrawnChallenge, deletedChallengeId, actionTarget, showEditChips, time: formatTime() }
      ]);
    } catch (err) {
      const serverErrMsg =
        err?.status === 401
          ? 'Aapka session expire ho gaya hai. Kripya login karein aur dobara try karein.'
          : (err.response?.data?.message || err.response?.data?.error?.message || err.message || 'Kshama karein, thodi takneeki samasya aayi.');
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, role: 'assistant', content: `⚠️ ${serverErrMsg}`, time: formatTime() }]);
    } finally {
      setLoading(false);
    }

  };

  const handleSelectLanguage = (langObj) => {
    setCurrentLang(langObj.code);
    setMessages((prev) => [...prev, { id: `lang-${Date.now()}`, role: 'assistant', content: langObj.greeting, time: formatTime() }]);
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
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: initialWelcomeMessage,
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
    handleSendMessage,
    handleSelectLanguage,
    handleSubmitChallenge,
    handleTrackChallenge,
    handleClearChat
  };
};

export default useAiAssistant;

import { useState, useRef, useEffect, useCallback } from 'react';
import { apiClient } from '../../../../infrastructure/api/client.js';
import { citizenService } from '../../../../features/citizen/services/citizenService.js';
import { useAuth } from '../../../../features/auth/AuthContext.jsx';
import { SUPPORTED_LANGUAGES } from '../components/AssistantLanguageModal.jsx';

const formatTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const useAiAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Namaste! 👏\nI'm Johar Setu Assistant.\nHow can I help you today?",
      time: '10:24 AM'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = async (textToSend, attachment = null) => {
    const query = (textToSend || input).trim();
    if (!query && !attachment) return;
    if (loading) return;

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
        .slice(-8)
        .map((m) => ({
          role: m.role,
          content: m.content,
          draftReport: m.draftReport || null,
          media: m.media || (m.draftReport?.media || [])
        }));

      // 2. Call AI chat with user session, media, and language context — minimum 700ms thinking delay
      //    so the bouncing dots typing indicator is visibly appreciated by the user
      const [res] = await Promise.all([
        apiClient.post('citizen/ai-chat', {
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
        }),
        new Promise((resolve) => setTimeout(resolve, 700))
      ]);

      const d = res.data?.data || res.data || {};
      const replyText = d.reply || 'Aapka sandesh prapt hua.';
      const { draftReport = null, createdChallenge = null, trackingData = null, challengesList = null, withdrawnChallenge = null, deletedChallengeId = null, actionTarget = null } = d;

      if (createdChallenge || withdrawnChallenge || deletedChallengeId) {
        try {
          window.dispatchEvent(new CustomEvent('joharsetu:challenge-submitted', { detail: { createdChallenge, withdrawnChallenge, deletedChallengeId } }));
        } catch (_) {}
      }

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: replyText, draftReport, createdChallenge, trackingData, challengesList, withdrawnChallenge, deletedChallengeId, actionTarget, time: formatTime() }
      ]);
    } catch (err) {
      const serverErrMsg = err.response?.data?.message || err.response?.data?.error?.message || err.message || 'Kshama karein, thodi takneeki samasya aayi.';
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
    handleSendMessage,
    handleSelectLanguage,
    handleSubmitChallenge,
    handleTrackChallenge,
    handleClearChat
  };
};

export default useAiAssistant;

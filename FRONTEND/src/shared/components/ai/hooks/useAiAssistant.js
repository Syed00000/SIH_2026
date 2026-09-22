import { useState, useRef, useEffect, useCallback } from 'react';
import { apiClient } from '../../../../infrastructure/api/client.js';
import { SUPPORTED_LANGUAGES } from '../components/AssistantLanguageModal.jsx';

const formatTime = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const useAiAssistant = () => {
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

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  const handleSendMessage = async (textToSend, attachment = null) => {
    const query = (textToSend || input).trim();
    if (!query && !attachment) return;
    if (loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query || (attachment ? `Sent attachment: ${attachment.name}` : ''),
      attachment,
      time: formatTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-4)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await apiClient.post('citizen/ai-chat', {
        message: query || (attachment ? `Uploaded document: ${attachment.name}` : ''),
        history: historyPayload
      });

      const replyText =
        res.data?.data?.reply ||
        res.data?.reply ||
        'Aapka sandesh prapt hua. Johar Setu portal se jude kisi bhi vishay par aap pooch sakte hain.';

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: replyText,
          time: formatTime()
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Kshama karein, network connection me samasya aayi. Kripya punah prayas karein.',
          time: formatTime()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLanguage = (langObj) => {
    setCurrentLang(langObj.code);
    setMessages((prev) => [
      ...prev,
      {
        id: `lang-${Date.now()}`,
        role: 'assistant',
        content: langObj.greeting,
        time: formatTime()
      }
    ]);
  };

  const handleSubmitChallenge = () => {
    handleSendMessage(
      currentLang === 'hi'
        ? 'मैं नई समस्या (Grievance/Challenge) कैसे दर्ज करूँ?'
        : 'How do I submit a new civic challenge or problem on Johar Setu?'
    );
  };

  const handleTrackChallenge = () => {
    handleSendMessage(
      currentLang === 'hi'
        ? 'अपनी दर्ज समस्या का स्टेटस कैसे ट्रैक करें?'
        : 'How can I track the live status of my submitted challenge?'
    );
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: "Namaste! 👏\nI'm Johar Setu Assistant.\nHow can I help you today?",
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

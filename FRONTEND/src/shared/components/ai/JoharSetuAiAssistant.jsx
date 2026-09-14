import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  User,
  Bot,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { apiClient } from '../../../infrastructure/api/client.js';

const QUICK_PROMPTS = [
  'JoharSetu par problem kaise submit karein?',
  'Apni samasya ka live status kaise track karein?',
  'Kaun-kaun se departments aur universities connected hain?',
  'University students aur researchers ko grants kaise milti hain?'
];

export const JoharSetuAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Namaste! Main **JoharSetu AI Sahayak** hoon. Aap Jharkhand me civic samasyaon ke nivaaran, problem tracking, ya university innovation grants ke bare me pooch sakte hain.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-4)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await apiClient.post('citizen/ai-chat', {
        message: query,
        history: historyPayload
      });

      const replyText =
        res.data?.reply ||
        'Aapka prashna prapt hua. JoharSetu portal par jaakar aap aur jaankari prapt kar sakte hain.';

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: replyText }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Kshama karein, connection me samasya aayi hai. Kripya thodi der baad prayas karein.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          'Chat reset ho gaya hai. Main JoharSetu se jude prashno me aapki sahayata ke liye taiyar hoon.'
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2.5 px-4 py-3 bg-[#007A61] hover:bg-[#00634f] text-white rounded-full shadow-xl hover:shadow-2xl transition-all cursor-pointer border border-emerald-400/40 group"
        >
          <div className="p-1 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
            <Sparkles className="w-4 h-4 text-emerald-100" />
          </div>
          <span className="text-xs font-bold tracking-wide">JoharSetu AI Sahayak</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </motion.button>
      )}

      {/* Expanded Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-[360px] sm:w-[400px] h-[540px] max-h-[85vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-[#007A61] text-white flex items-center justify-between border-b border-[#00634f]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-white/15 rounded-xl">
                  <Bot className="w-5 h-5 text-emerald-100" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-xs font-bold tracking-wide">JoharSetu AI Sahayak</h3>
                    <span className="text-[9.5px] font-medium px-1.5 py-0.2 bg-emerald-800/80 rounded-full text-emerald-200">
                      Official Helpdesk
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-[10.5px] text-emerald-100/80 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" />
                    <span>Cryptographic Firewall Active</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Reset Conversation"
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${
                    msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-white'
                        : 'bg-emerald-100 text-[#007A61] border border-emerald-200'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-3 rounded-xl text-xs leading-relaxed max-w-[82%] shadow-2xs ${
                      msg.role === 'user'
                        ? 'bg-[#007A61] text-white rounded-tr-none font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none font-normal'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#007A61] border border-emerald-200 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl rounded-tl-none text-xs flex items-center space-x-2 shadow-2xs">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#007A61]" />
                    <span className="text-slate-500 font-medium">Sahayak soch raha hai...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto custom-scrollbar">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[10px] font-semibold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-[#007A61] border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="JoharSetu samasya ya helpline ke bare me poochiye..."
                disabled={loading}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#007A61] bg-slate-50 text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-[#007A61] hover:bg-[#00634f] text-white rounded-xl shadow-xs transition-all disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JoharSetuAiAssistant;

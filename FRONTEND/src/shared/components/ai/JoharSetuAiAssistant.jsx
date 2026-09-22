import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantTrigger } from './components/AssistantTrigger.jsx';
import { AssistantHeader } from './components/AssistantHeader.jsx';
import { AssistantMessageList } from './components/AssistantMessageList.jsx';
import { AssistantQuickActions } from './components/AssistantQuickActions.jsx';
import { AssistantInputBar } from './components/AssistantInputBar.jsx';
import { AssistantLanguageModal } from './components/AssistantLanguageModal.jsx';
import { useAiAssistant } from './hooks/useAiAssistant.js';

/**
 * Official Johar Setu AI Assistant with Floating Circle Trigger.
 * Fully Mobile-Responsive & Elevated above Mobile Bottom Navigation.
 */
export const JoharSetuAiAssistant = () => {
  const {
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
  } = useAiAssistant();

  return (
    <div className="select-none font-sans">
      {/* Floating Trigger Circle Button (Positioned above mobile bottom nav) */}
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50">
            <AssistantTrigger onClick={() => setIsOpen(true)} />
          </div>
        )}
      </AnimatePresence>

      {/* Expanded Assistant Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs sm:hidden z-50"
            />

            {/* Main Assistant Modal / Drawer */}
            <div className="fixed inset-x-3 bottom-3 top-14 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex items-end sm:items-auto justify-center sm:justify-end pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="pointer-events-auto w-full sm:w-[390px] h-full sm:h-[580px] sm:max-h-[88vh] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800"
              >
                {/* Header */}
                <AssistantHeader
                  onMinimize={() => setIsOpen(false)}
                  onClose={() => setIsOpen(false)}
                  onClearChat={handleClearChat}
                />

                {/* Language Selector Overlay */}
                <AssistantLanguageModal
                  isOpen={isLanguageModalOpen}
                  onClose={() => setIsLanguageModalOpen(false)}
                  currentLanguage={currentLang}
                  onSelectLanguage={handleSelectLanguage}
                />

                {/* Chat Message Stream */}
                <AssistantMessageList
                  messages={messages}
                  loading={loading}
                  messagesEndRef={messagesEndRef}
                />

                {/* 3 Quick Action Tiles (Submit, Track, Language) */}
                <AssistantQuickActions
                  onSubmitChallenge={handleSubmitChallenge}
                  onTrackChallenge={handleTrackChallenge}
                  onChangeLanguage={() => setIsLanguageModalOpen(true)}
                />

                {/* Pill-shaped Input Bar */}
                <AssistantInputBar
                  input={input}
                  setInput={setInput}
                  onSend={handleSendMessage}
                  loading={loading}
                  placeholder={
                    currentLang === 'hi'
                      ? 'अपना संदेश यहाँ लिखें...'
                      : 'Type your message here...'
                  }
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JoharSetuAiAssistant;

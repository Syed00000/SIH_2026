import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantTrigger } from './components/AssistantTrigger.jsx';
import { AssistantHeader } from './components/AssistantHeader.jsx';
import { AssistantMessageList } from './components/AssistantMessageList.jsx';
import { AssistantInputBar } from './components/AssistantInputBar.jsx';
import { AssistantLanguageModal } from './components/AssistantLanguageModal.jsx';
import { useAiAssistant } from './hooks/useAiAssistant.js';

/**
 * Official Johar Setu AI Assistant with Floating Circle Trigger & Voice Output.
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
                  isVoiceEnabled={isVoiceEnabled}
                  onToggleVoice={() => {
                    if (isVoiceEnabled) {
                      stopSpeaking();
                      setIsVoiceEnabled(false);
                    } else {
                      setIsVoiceEnabled(true);
                      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
                      if (lastAssistantMsg) {
                        speakText(lastAssistantMsg.content, currentLang, lastAssistantMsg.id);
                      }
                    }
                  }}
                />

                {/* Language Selector Overlay */}
                <AssistantLanguageModal
                  isOpen={isLanguageModalOpen}
                  onClose={() => setIsLanguageModalOpen(false)}
                  currentLanguage={currentLang}
                  onSelectLanguage={handleSelectLanguage}
                />

                {/* Chat Message Stream with Voice Output & Quick Actions */}
                <AssistantMessageList
                  messages={messages}
                  loading={loading}
                  messagesEndRef={messagesEndRef}
                  currentLang={currentLang}
                  speakingMessageId={speakingMessageId}
                  onSpeak={(text, lang, msgId) => speakText(text, lang, msgId)}
                  onStopSpeaking={stopSpeaking}
                  onTrackId={(id) => handleSendMessage(id)}
                  onSubmitChallenge={handleSubmitChallenge}
                  onTrackChallenge={handleTrackChallenge}
                  onChangeLanguage={() => setIsLanguageModalOpen(true)}
                  onAction={(actionType, payload) => {
                    if (actionType === 'TRIGGER_ATTACHMENT') {
                      const fileInput = document.getElementById('ai-chat-evidence-file-input');
                      if (fileInput) fileInput.click();
                      else window.dispatchEvent(new CustomEvent('joharsetu:trigger-evidence-attachment'));
                    } else if (actionType === 'EDIT_DRAFT') {
                      handleSendMessage('Mujhe is draft report mein kuch badalna/edit karna hai');
                    } else if (actionType === 'EDIT_FIELD_LOCATION') {
                      const prefix = 'Location badal kar yeh kar do: ';
                      setInput(prefix);
                      setTimeout(() => {
                        const el = document.getElementById('ai-assistant-text-input');
                        if (el) {
                          el.focus();
                          el.setSelectionRange(prefix.length, prefix.length);
                        }
                      }, 60);
                    } else if (actionType === 'EDIT_FIELD_DESCRIPTION') {
                      const prefix = 'Samasya me yeh likho: ';
                      setInput(prefix);
                      setTimeout(() => {
                        const el = document.getElementById('ai-assistant-text-input');
                        if (el) {
                          el.focus();
                          el.setSelectionRange(prefix.length, prefix.length);
                        }
                      }, 60);
                    } else if (actionType === 'CONFIRM_SUBMIT') {
                      handleSendMessage(`CONFIRM_SUBMIT: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}`);
                    } else if (actionType === 'CHANGE_LOCATION') {
                      setInput('Mera zila aur area yeh hai: ');
                    } else if (actionType === 'CONFIRM_WITHDRAW') {
                      handleSendMessage(`CONFIRM_WITHDRAW: ${payload}`);
                    } else if (actionType === 'CONFIRM_DELETE') {
                      handleSendMessage(`CONFIRM_DELETE: ${payload}`);
                    } else if (actionType === 'CANCEL_ACTION') {
                      handleSendMessage('Rehne do, cancel karo');
                    } else if (actionType === 'WITHDRAW') {
                      // From tracking card — sends a natural message that triggers AI confirm flow
                      handleSendMessage(`Withdraw karna hai ${payload}`);
                    } else if (actionType === 'DELETE') {
                      // From tracking card — sends a natural message that triggers AI confirm flow
                      handleSendMessage(`Delete karna hai ${payload}`);
                    }
                  }}
                />
                {/* Pill-shaped Input Bar */}
                <AssistantInputBar
                  input={input}
                  setInput={setInput}
                  onSend={handleSendMessage}
                  loading={loading}
                  currentLang={currentLang}
                  placeholder={
                    currentLang === 'hi'
                      ? 'अपना संदेश यहाँ लिखें या बोलें...'
                      : currentLang === 'bn'
                      ? 'আপনার বার্তা এখানে লিখুন বা বলুন...'
                      : currentLang === 'sat'
                      ? 'ᱟᱢᱟᱜ ᱠᱟᱛᱷᱟ ᱱᱚᱸᱰᱮ ᱚᱞ ᱢᱮ ᱥᱮ ᱞᱟᱹᱭ ᱢᱮ...'
                      : 'Type your message or speak...'
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

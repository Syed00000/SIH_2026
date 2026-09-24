import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AssistantTrigger } from './components/AssistantTrigger.jsx';
import { AssistantHeader } from './components/AssistantHeader.jsx';
import { AssistantMessageList } from './components/AssistantMessageList.jsx';
import { AssistantInputBar } from './components/AssistantInputBar.jsx';
import { AssistantLanguageModal } from './components/AssistantLanguageModal.jsx';
import { useAiAssistant } from './hooks/useAiAssistant.js';

/**
 * Official Johar Setu AI Assistant with Floating Circle Trigger.
 * Fully Mobile-Responsive & Elevated above Mobile Bottom Navigation.
 */
export const JoharSetuAiAssistant = ({ mode = 'citizen' }) => {
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
  } = useAiAssistant({ mode });

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

                {/* Chat Message Stream with contextual initial quick actions */}
                <AssistantMessageList
                  mode={mode}
                  lang={currentLang}
                  messages={messages}
                  loading={loading}
                  messagesEndRef={messagesEndRef}
                  onTrackId={(id) => handleSendMessage(id)}
                  onSubmitChallenge={handleSubmitChallenge}
                  onTrackChallenge={handleTrackChallenge}
                  onChangeLanguage={() => setIsLanguageModalOpen(true)}
                  onInfoQuery={(queryText) => handleSendMessage(queryText)}
                  onAction={(actionType, payload) => {
                    if (actionType === 'TRIGGER_ATTACHMENT') {
                      const fileInput = document.getElementById('ai-chat-evidence-file-input');
                      if (fileInput) fileInput.click();
                      else window.dispatchEvent(new CustomEvent('joharsetu:trigger-evidence-attachment'));
                    } else if (actionType === 'EDIT_DRAFT') {
                      const msg = currentLang === 'hi'
                        ? 'मुझे इस ड्राफ्ट रिपोर्ट में कुछ सुधार/बदलना है'
                        : currentLang === 'en'
                        ? 'I want to edit this draft report'
                        : 'Mujhe is draft report mein kuch badalna/edit karna hai';
                      handleSendMessage(msg);
                    } else if (actionType === 'EDIT_FIELD_LOCATION') {
                      const prefix = currentLang === 'hi'
                        ? 'लोकेशन बदलकर यह करें: '
                        : currentLang === 'en'
                        ? 'Change location to: '
                        : 'Location badal kar yeh kar do: ';
                      setInput(prefix);
                      setTimeout(() => {
                        const el = document.getElementById('ai-assistant-text-input');
                        if (el) {
                          el.focus();
                          el.setSelectionRange(prefix.length, prefix.length);
                        }
                      }, 60);
                    } else if (actionType === 'EDIT_FIELD_DESCRIPTION') {
                      const prefix = currentLang === 'hi'
                        ? 'समस्या में यह लिखें: '
                        : currentLang === 'en'
                        ? 'Change issue description to: '
                        : 'Samasya me yeh likho: ';
                      setInput(prefix);
                      setTimeout(() => {
                        const el = document.getElementById('ai-assistant-text-input');
                        if (el) {
                          el.focus();
                          el.setSelectionRange(prefix.length, prefix.length);
                        }
                      }, 60);
                    } else if (actionType === 'CONFIRM_SUBMIT') {
                      const label = currentLang === 'hi'
                        ? '✓ पुष्टि करें और सबमिट करें'
                        : currentLang === 'en'
                        ? '✓ Confirm & Submit'
                        : '✓ Haan, submit kar do';
                      handleSendMessage(`CONFIRM_SUBMIT: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}`, { displayLabel: label });
                    } else if (actionType === 'CHANGE_LOCATION') {
                      const prefix = currentLang === 'hi'
                        ? 'मेरा ज़िला और इलाका यह है: '
                        : currentLang === 'en'
                        ? 'My district and area is: '
                        : 'Mera zila aur area yeh hai: ';
                      setInput(prefix);
                    } else if (actionType === 'CONFIRM_WITHDRAW') {
                      const label = currentLang === 'hi'
                        ? `✓ वापस लेने की पुष्टि करें ${payload ? `(${payload})` : ''}`
                        : currentLang === 'en'
                        ? `✓ Confirm Withdrawal ${payload ? `(${payload})` : ''}`
                        : `✓ Haan, wapas le lo ${payload ? `(${payload})` : ''}`;
                      handleSendMessage(`CONFIRM_WITHDRAW: ${payload}`, { displayLabel: label });
                    } else if (actionType === 'CONFIRM_DELETE') {
                      const label = currentLang === 'hi'
                        ? `✓ हटाने की पुष्टि करें ${payload ? `(${payload})` : ''}`
                        : currentLang === 'en'
                        ? `✓ Confirm Delete ${payload ? `(${payload})` : ''}`
                        : `✓ Haan, delete kar do ${payload ? `(${payload})` : ''}`;
                      handleSendMessage(`CONFIRM_DELETE: ${payload}`, { displayLabel: label });
                    } else if (actionType === 'CANCEL_ACTION') {
                      const msg = currentLang === 'hi'
                        ? 'रहने दो, रद्द करो'
                        : currentLang === 'en'
                        ? 'Cancel this action'
                        : 'Rehne do, cancel karo';
                      handleSendMessage(msg);
                    } else if (actionType === 'WITHDRAW') {
                      // From tracking card — sends a message that triggers AI confirm flow
                      const msg = currentLang === 'hi'
                        ? `वापस लेना है ${payload}`
                        : currentLang === 'en'
                        ? `Withdraw ${payload}`
                        : `Withdraw karna hai ${payload}`;
                      handleSendMessage(msg);
                    } else if (actionType === 'DELETE') {
                      // From tracking card — sends a message that triggers AI confirm flow
                      const msg = currentLang === 'hi'
                        ? `हटाना है ${payload}`
                        : currentLang === 'en'
                        ? `Delete ${payload}`
                        : `Delete karna hai ${payload}`;
                      handleSendMessage(msg);
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

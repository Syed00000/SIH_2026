import React from 'react';
import { Check, X, Globe } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', greeting: "Hey there, friend! 👋\nI'm your JoharSetu AI buddy.\nTell me, what's going on? How can I help you out today?" },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', greeting: 'नमस्ते भाई! 🙏\nमैं तुम्हारा जोहार सेतु दोस्त हूँ।\nबताओ आज क्या दिक्कत है, क्या मदद करूँ?' },
  { code: 'sat', label: 'Santhali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', greeting: 'ᱡᱚᱦᱟᱨ ᱜᱟᱛᱮ! 🙏\nᱤᱧ ᱡᱚᱦᱟᱨ ᱥᱮᱛᱩ ᱨᱮ ᱟᱢᱤᱡ ᱜᱟᱛᱮ ᱠᱟᱹᱱᱟᱹᱧ᱾\nᱞᱟᱹᱭ ᱢᱮ, ᱛᱮᱦᱮᱧ ᱪᱮᱫ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱢᱮᱱᱟᱜᱼᱟ?' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', greeting: 'নমস্কার ভাই! 🙏\nআমি তোমার জোহার সেতু বন্ধু।\nবলো আজ কী সমস্যা, কীভাবে সাহায্য করতে পারি?' }
];

/**
 * Language selection modal / popover.
 */
export const AssistantLanguageModal = ({ isOpen, onClose, currentLanguage, onSelectLanguage }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 rounded-2xl animate-fade-in">
      <div className="w-full max-w-[290px] bg-white rounded-2xl shadow-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-800">
            <Globe className="w-4 h-4 text-[#015a3a]" />
            <h3 className="text-xs font-bold">Select Language / भाषा चुनें</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelectLanguage(lang);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-[#015a3a] font-semibold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span>{lang.native}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{lang.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#015a3a]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { SUPPORTED_LANGUAGES };
export default AssistantLanguageModal;

import React from 'react';
import { FileText, Search, Globe, HelpCircle, Info } from 'lucide-react';

/**
 * Quick Action tiles matching AI Assistant mode:
 * Mode 'citizen': Submit a Challenge, Track Your Challenge, Change Language
 * Mode 'info': What is JoharSetu?, How to File Issue?, Change Language
 */
export const AssistantQuickActions = ({
  onSubmitChallenge,
  onTrackChallenge,
  onChangeLanguage,
  onInfoQuery,
  mode = 'citizen',
  lang = 'en',
  labels = null
}) => {
  const isInfo = mode === 'info';
  const defaultLabels = lang === 'hi' ? {
    submit: 'समस्या दर्ज करें',
    track: 'शिकायत ट्रैक करें',
    language: 'भाषा बदलें',
    about: 'जोहारसेतु क्या है?',
    howTo: 'शिकायत कैसे करें?'
  } : {
    submit: 'Submit a Challenge',
    track: 'Track Your Challenge',
    language: 'Change Language',
    about: 'What is JoharSetu?',
    howTo: 'How to File Issue?'
  };

  const activeLabels = labels || defaultLabels;

  return (
    <div className="w-full my-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden shrink-0">
      <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
        {/* Tile 1: Submit Challenge (Citizen) or What is JoharSetu (Info) */}
        <button
          type="button"
          onClick={isInfo ? () => onInfoQuery?.('What is JoharSetu and how does it work?') : onSubmitChallenge}
          className="group p-2 sm:p-3 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 hover:bg-emerald-50/60 transition-all cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            {isInfo ? (
              <Info className="w-4 h-4 sm:w-6 sm:h-6 text-[#015a3a] stroke-[2]" />
            ) : (
              <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-[#015a3a] stroke-[2]" />
            )}
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-800 group-hover:text-[#015a3a] leading-tight line-clamp-2">
            {isInfo ? activeLabels.about : activeLabels.submit}
          </span>
        </button>

        {/* Tile 2: Track Challenge (Citizen) or How to File Issue (Info) */}
        <button
          type="button"
          onClick={isInfo ? () => onInfoQuery?.('How can citizens file a complaint on JoharSetu?') : onTrackChallenge}
          className="group p-2 sm:p-3 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 hover:bg-amber-50/60 transition-all cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            {isInfo ? (
              <HelpCircle className="w-4 h-4 sm:w-6 sm:h-6 text-[#ea580c] stroke-[2]" />
            ) : (
              <Search className="w-4 h-4 sm:w-6 sm:h-6 text-[#ea580c] stroke-[2.2]" />
            )}
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-800 group-hover:text-[#ea580c] leading-tight line-clamp-2">
            {isInfo ? activeLabels.howTo : activeLabels.track}
          </span>
        </button>

        {/* Tile 3: Change Language */}
        <button
          type="button"
          onClick={onChangeLanguage}
          className="group p-2 sm:p-3 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 hover:bg-teal-50/60 transition-all cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Globe className="w-4 h-4 sm:w-6 sm:h-6 text-[#0d9488] stroke-[2]" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-800 group-hover:text-[#0d9488] leading-tight line-clamp-2">
            {activeLabels.language}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AssistantQuickActions;

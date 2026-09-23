import React from 'react';
import { FileText, Search, Globe } from 'lucide-react';

/**
 * 3 Quick Action tiles matching reference screenshot:
 * 1. Submit a Challenge (Green Document)
 * 2. Track Your Challenge (Orange Search)
 * 3. Change Language (Teal Globe)
 */
export const AssistantQuickActions = ({
  onSubmitChallenge,
  onTrackChallenge,
  onChangeLanguage,
  labels = {
    submit: 'Submit a Challenge',
    track: 'Track Your Challenge',
    language: 'Change Language'
  }
}) => {
  return (
    <div className="w-full my-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden shrink-0">
      <div className="grid grid-cols-3 divide-x divide-slate-100 text-center">
        {/* Submit a Challenge */}
        <button
          type="button"
          onClick={onSubmitChallenge}
          className="group p-2 sm:p-3 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 hover:bg-emerald-50/60 transition-all cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-[#015a3a] stroke-[2]" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-800 group-hover:text-[#015a3a] leading-tight line-clamp-2">
            {labels.submit}
          </span>
        </button>

        {/* Track Your Challenge */}
        <button
          type="button"
          onClick={onTrackChallenge}
          className="group p-2 sm:p-3 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 hover:bg-amber-50/60 transition-all cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="w-4 h-4 sm:w-6 sm:h-6 text-[#ea580c] stroke-[2.2]" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-800 group-hover:text-[#ea580c] leading-tight line-clamp-2">
            {labels.track}
          </span>
        </button>

        {/* Change Language */}
        <button
          type="button"
          onClick={onChangeLanguage}
          className="group p-2 sm:p-3 flex flex-col items-center justify-center space-y-1.5 sm:space-y-2 hover:bg-teal-50/60 transition-all cursor-pointer focus:outline-hidden"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Globe className="w-4 h-4 sm:w-6 sm:h-6 text-[#0d9488] stroke-[2]" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-800 group-hover:text-[#0d9488] leading-tight line-clamp-2">
            {labels.language}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AssistantQuickActions;

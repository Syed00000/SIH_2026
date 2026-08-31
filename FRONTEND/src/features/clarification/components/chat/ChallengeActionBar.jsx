import React from 'react';
import { Check, X } from 'lucide-react';

export const ChallengeActionBar = ({
  isUniversityView,
  isAccepted,
  isDeclined,
  challenge,
  onAcceptChallenge,
  onDeclineChallenge
}) => {
  if (!isUniversityView) return null;

  return (
    <div className="px-4 py-2 bg-[#f8fafc] border-t border-slate-200 flex items-center justify-between gap-2 flex-shrink-0">
      {isAccepted ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>Challenge Allocation Accepted by University &bull; Solution Prototyping Active</span>
          </div>
          <span className="text-[10.5px] font-mono text-[#007A61] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 font-extrabold">
            ✓ Allocation Accepted
          </span>
        </div>
      ) : isDeclined ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-900">
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center">
              <X className="w-2.5 h-2.5 stroke-[3]" />
            </span>
            <span>Challenge Allocation Declined by University</span>
          </div>
          <span className="text-[10.5px] font-mono text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300 font-extrabold">
            ✕ Declined
          </span>
        </div>
      ) : (
        <>
          <span className="text-[11px] font-bold text-slate-600">
            Ready to take action on this challenge allocation?
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onAcceptChallenge && onAcceptChallenge(challenge)}
              className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>✓ Accept Challenge</span>
            </button>
            <button
              type="button"
              onClick={() => onDeclineChallenge && onDeclineChallenge(challenge)}
              className="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Decline Allocation</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChallengeActionBar;

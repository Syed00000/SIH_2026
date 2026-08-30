import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const SubmitChallengeSuccessView = ({ challenge, defaultDomain, onClose }) => {
  if (!challenge) return null;

  return (
    <div className="text-center py-8 space-y-4">
      <div className="w-14 h-14 bg-emerald-50 border-2 border-emerald-600 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-2xs">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-black text-slate-900">
          Challenge Submitted Successfully!
        </h4>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Your problem statement has been filed under Jharkhand Societal Innovation Hub.
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2 shadow-2xs">
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-600">Challenge Reference ID:</span>
          <span className="font-bold text-slate-900 tracking-tight">
            {challenge.challengeId}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-600">Current Status:</span>
          <span className="font-bold text-amber-700">
            {challenge.status || 'Under Review'}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-slate-600">Assigned Area:</span>
          <span className="font-bold text-slate-900">
            {challenge.domain || defaultDomain}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={onClose}
          className="w-full bg-[#064e3b] hover:bg-[#047857] text-white text-xs font-bold py-2.5 rounded-xl shadow-2xs transition-all cursor-pointer max-w-sm mx-auto block"
        >
          View My Challenges
        </button>
      </div>
    </div>
  );
};

export default SubmitChallengeSuccessView;

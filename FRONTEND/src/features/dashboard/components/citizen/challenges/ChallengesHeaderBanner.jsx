import React from 'react';
import { Plus } from 'lucide-react';

export const ChallengesHeaderBanner = ({ onOpenSubmitModal }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-md p-3.5 shadow-2xs">
      <div>
        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
          My Challenges
        </h2>
        <p className="text-slate-500 text-xs mt-0.5 font-medium">
          Track and manage the challenges you have submitted to JOHARSETU.
        </p>
      </div>

      <button
        onClick={onOpenSubmitModal}
        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-md shadow-xs flex items-center transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Submit New Challenge
      </button>
    </div>
  );
};

export default ChallengesHeaderBanner;

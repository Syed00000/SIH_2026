import React from 'react';
import { MapPin, User, Calendar } from 'lucide-react';

export const ChallengeSelectorCard = ({
  allChallenges = [],
  selectedChallengeId,
  onSelectChallengeChange,
  activeChallenge
}) => {
  return (
    <div className="space-y-2 p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
        Select Problem Statement to Allocate
      </label>
      <select
        value={selectedChallengeId}
        onChange={onSelectChallengeChange}
        className="w-full border border-slate-200 rounded-md p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
      >
        {allChallenges.map((c) => (
          <option key={c.challengeId || c.id} value={c.challengeId || c.id}>
            [{c.challengeId || c.id}] {c.title} ({c.location?.district || c.district || 'Jharkhand'})
          </option>
        ))}
      </select>

      {activeChallenge && (
        <div className="pt-2 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-900 line-clamp-1">{activeChallenge.title}</p>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{activeChallenge.location?.district || activeChallenge.district || 'Jharkhand'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{activeChallenge.submitter?.name || activeChallenge.submittedBy || 'Citizen'}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeSelectorCard;

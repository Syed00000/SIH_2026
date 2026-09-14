import React from 'react';
import { X, Layers } from 'lucide-react';

export const AssignModalHeader = ({
  isUniversityTargetMode,
  activeChallenge,
  onClose
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
      <div className="flex items-center space-x-2">
        <Layers className="w-4 h-4 text-[#047857]" />
        <h3 className="text-sm font-bold text-slate-900">
          {isUniversityTargetMode ? 'Triage & University Allocation' : 'Triage & Institutional Allocation'}
        </h3>
        {activeChallenge && (
          <span className="font-mono text-xs font-bold text-[#047857]">
            {activeChallenge.challengeId || activeChallenge.id}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AssignModalHeader;

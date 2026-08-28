import React, { useState } from 'react';
import { X, Check, HelpCircle, AlertOctagon, Info } from 'lucide-react';
import { ChallengeInspectorLocationTab, ChallengeInspectorEvidenceTab, ChallengeInspectorSimilarTab } from './ChallengeInspectorTabs.jsx';

export const ChallengeInspector = ({
  challenge,
  onClose,
  onAccept,
  onRequestClarification,
  onDecline
}) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [showFullStatement, setShowFullStatement] = useState(false);

  if (!challenge) return null;

  return (
    <div className="bg-white rounded-xl flex flex-col justify-between h-full overflow-hidden select-none">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-100 space-y-2 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{challenge.id || challenge.challengeId}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              challenge.priority === 'High' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {challenge.priority || 'Medium'} Priority
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-200/50 rounded-md transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-snug">{challenge.title}</h2>
          <p className="text-[10.5px] text-slate-500 mt-0.5 font-mono">Assigned: {typeof challenge.assignedOn === 'string' ? challenge.assignedOn.slice(0, 10) : '2026-05-20'}</p>
        </div>

        {/* Sub Tabs */}
        <div className="flex border-b border-slate-200 pt-1 text-xs">
          {['overview', 'location', 'evidence', 'similar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-1.5 px-2 font-bold capitalize transition-colors cursor-pointer border-b-2 ${
                activeSubTab === tab ? 'border-b-slate-900 text-slate-900' : 'border-b-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'similar' ? 'Similar Problems' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Body Tab Content */}
      <div className="p-3.5 flex-1 overflow-y-auto space-y-3 text-xs text-slate-700">
        {activeSubTab === 'overview' && (
          <div className="space-y-3">
            {/* Problem Statement */}
            <div>
              <div className="font-bold text-slate-900 text-[10.5px] uppercase tracking-wider mb-1">Problem Statement</div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {showFullStatement ? challenge.problemStatement : `${challenge.problemStatement?.slice(0, 110)}...`}
                <button
                  onClick={() => setShowFullStatement(!showFullStatement)}
                  className="text-slate-900 font-bold ml-1 hover:underline cursor-pointer"
                >
                  {showFullStatement ? 'Show less' : 'Show more'}
                </button>
              </p>
            </div>

            {/* Grid Attributes */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-500 font-semibold block">Affected Population</span>
                <span className="font-bold text-slate-900">{challenge.affectedPopulation || '~ 12,500 People'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">AI Category</span>
                <span className="font-bold text-slate-900">{challenge.aiCategory || challenge.domain}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Domain</span>
                <span className="font-bold text-slate-900">{challenge.domain}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">District</span>
                <span className="font-bold text-slate-900">{challenge.district}, Jharkhand</span>
              </div>
            </div>

            {/* Required Skills */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10.5px] font-bold text-slate-900 uppercase block mb-1">Required Skills</span>
              <div className="flex flex-wrap gap-1">
                {(challenge.requiredSkills || ['Water Testing', 'IoT', 'Data Analysis', 'Mobile App']).map((skill, i) => (
                  <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-900 border border-slate-200 rounded-none text-[10px] font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Government Remarks */}
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Government Remarks</span>
              <p className="text-xs text-slate-800 mt-0.5 italic">
                "{challenge.governmentRemarks || 'This challenge is critical for public health. University support is required for solution.'}"
              </p>
            </div>

            {/* Deadlines */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-500">Deadline for Response:</span>
              <span className="font-bold text-rose-700 font-mono">{challenge.deadline || '27 May 2026 (7 days left)'}</span>
            </div>
          </div>
        )}

        {activeSubTab === 'location' && <ChallengeInspectorLocationTab challenge={challenge} />}
        {activeSubTab === 'evidence' && <ChallengeInspectorEvidenceTab challenge={challenge} />}
        {activeSubTab === 'similar' && <ChallengeInspectorSimilarTab challenge={challenge} />}
      </div>

      {/* 3. Footer Action Buttons */}
      <div className="p-3.5 border-t border-slate-100 space-y-2 bg-slate-50/70">
        {(() => {
          const norm = (() => {
            if (!challenge.status) return 'Pending';
            const s = String(challenge.status).toLowerCase();
            if (s.includes('accept') || s === 'completed') return 'Accepted';
            if (s.includes('reject') || s.includes('decline')) return 'Rejected';
            return 'Pending';
          })();

          if (norm === 'Accepted') {
            return (
              <div className="py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Challenge Officially Accepted</span>
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">Accepted</span>
              </div>
            );
          }

          if (norm === 'Rejected') {
            return (
              <div className="py-2.5 px-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center justify-between text-xs font-bold">
                <span className="flex items-center space-x-1.5">
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Challenge Rejected / Declined</span>
                </span>
                <span className="text-[10px] font-mono bg-rose-100 px-2 py-0.5 rounded border border-rose-300">Rejected</span>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onAccept && onAccept(challenge)}
                className="py-2 px-3 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => onRequestClarification && onRequestClarification(challenge)}
                className="py-2 px-3 bg-white hover:bg-slate-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Clarify</span>
              </button>
              <button
                onClick={() => onDecline && onDecline(challenge)}
                className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          );
        })()}

        <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-500 justify-center">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Synced directly with State AI Engine & Government Triage.</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeInspector;

import React, { useState } from 'react';
import { X, Check, HelpCircle, User, Info, Building, MapPin } from 'lucide-react';
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

  const rawStatement = challenge.problemStatement || challenge.description || 'Problem statement registered in the Jharkhand Innovation Hub.';
  const displayedStatement = showFullStatement || rawStatement.length <= 160 ? rawStatement : `${rawStatement.slice(0, 160)}...`;

  return (
    <div className="bg-white rounded-xl flex flex-col justify-between h-full overflow-hidden select-none">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-100 space-y-2 bg-[#f8fafc]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              {challenge.id || challenge.challengeId}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              challenge.priority === 'High'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : challenge.priority === 'Low'
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {challenge.priority || 'Medium'} Priority
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900 leading-snug tracking-tight">{challenge.title}</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            District: <strong className="text-slate-700">{challenge.district || 'Ranchi'}</strong> &bull; Domain: <strong className="text-slate-700">{challenge.domain}</strong>
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex border-b border-slate-200/80 pt-1 text-xs gap-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'location', label: 'Ground Location' },
            { id: 'evidence', label: 'Citizen Testimony' },
            { id: 'similar', label: 'Milestone Progress' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-1.5 px-2.5 font-bold transition-all cursor-pointer border-b-2 rounded-t-md ${
                activeSubTab === tab.id
                  ? 'border-b-slate-900 text-slate-900 bg-white/60'
                  : 'border-b-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Body Tab Content */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-700 bg-slate-50/30">
        {activeSubTab === 'overview' && (
          <div className="space-y-3">
            {/* Problem Statement Card */}
            <div className="bg-white p-3.5 border border-slate-200/90 rounded-xl shadow-2xs space-y-1.5">
              <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                Ground Problem Statement
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {displayedStatement}
                {rawStatement.length > 160 && (
                  <button
                    onClick={() => setShowFullStatement(!showFullStatement)}
                    className="text-emerald-800 font-bold ml-1.5 hover:underline cursor-pointer"
                  >
                    {showFullStatement ? 'Show less' : 'Read full statement'}
                  </button>
                )}
              </p>
            </div>

            {/* Grid Attributes */}
            <div className="grid grid-cols-2 gap-2.5 bg-white p-3.5 border border-slate-200/90 rounded-xl shadow-2xs text-[11.5px]">
              <div>
                <span className="text-slate-400 font-semibold block text-[10.5px]">Citizen Submitter</span>
                <span className="font-bold text-slate-900">{challenge.submitter?.name || challenge.submittedBy || 'Citizen Beneficiary'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10.5px]">Beneficiaries Impact</span>
                <span className="font-bold text-slate-900">{challenge.affectedPopulation || challenge.impactMetrics?.affectedPopulation || '~ 5,000 People'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10.5px]">Category Domain</span>
                <span className="font-bold text-slate-900">{challenge.domain}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[10.5px]">Location / District</span>
                <span className="font-bold text-slate-900">{challenge.district || 'Jharkhand'}</span>
              </div>
            </div>

            {/* Faculty Mentor Allocation Status */}
            <div className="bg-white p-3.5 border border-slate-200/90 rounded-xl shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Faculty Mentor</span>
                <span className="font-bold text-slate-900 text-xs">
                  {challenge.assignedFaculty?.name || <span className="text-slate-400 italic">No faculty assigned yet</span>}
                </span>
                {challenge.assignedFaculty?.department && (
                  <span className="text-[11px] text-slate-500 block">{challenge.assignedFaculty.department}</span>
                )}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                challenge.assignedFaculty?.name ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {challenge.assignedFaculty?.name ? 'Allocated' : 'Pending Allocation'}
              </span>
            </div>
          </div>
        )}

        {activeSubTab === 'location' && <ChallengeInspectorLocationTab challenge={challenge} />}
        {activeSubTab === 'evidence' && <ChallengeInspectorEvidenceTab challenge={challenge} />}
        {activeSubTab === 'similar' && <ChallengeInspectorSimilarTab challenge={challenge} />}
      </div>

      {/* 3. Footer Action Buttons */}
      <div className="p-3.5 border-t border-slate-100 space-y-2 bg-white">
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
              <div className="py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between text-xs font-bold shadow-2xs">
                <span className="flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Challenge Accepted by Nodal Authority</span>
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">Accepted</span>
              </div>
            );
          }

          if (norm === 'Rejected') {
            return (
              <div className="py-2.5 px-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between text-xs font-bold shadow-2xs">
                <span className="flex items-center space-x-1.5">
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Challenge Declined</span>
                </span>
                <span className="text-[10px] font-mono bg-rose-100 px-2 py-0.5 rounded border border-rose-300">Rejected</span>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onAccept && onAccept(challenge)}
                className="py-2 px-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => onRequestClarification && onRequestClarification(challenge)}
                className="py-2 px-3 bg-white hover:bg-slate-50 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Clarify</span>
              </button>
              <button
                onClick={() => onDecline && onDecline(challenge)}
                className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          );
        })()}

        <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-500 justify-center">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Real-time synchronized with Jharkhand State Higher Education Cell.</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeInspector;

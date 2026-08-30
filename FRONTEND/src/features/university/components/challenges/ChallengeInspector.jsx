import React, { useState } from 'react';
import {
  X,
  Check,
  HelpCircle,
  User,
  Info,
  Building,
  MapPin,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  UserPlus,
  Compass,
  Shield,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  RotateCcw,
  MessageSquare
} from 'lucide-react';
import {
  ChallengeInspectorLocationTab,
  ChallengeInspectorEvidenceTab,
  ChallengeInspectorSimilarTab
} from './ChallengeInspectorTabs.jsx';
import { ClarificationChatModal } from '../../../clarification/components/ClarificationChatModal.jsx';

export const ChallengeInspector = ({
  challenge,
  onClose,
  onAccept,
  onRequestClarification,
  onDecline,
  onAssignFaculty
}) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [showFullStatement, setShowFullStatement] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!challenge) return null;

  const rawStatement = challenge.problemStatement || challenge.description || 'Problem statement registered in the Jharkhand Innovation Hub.';
  const displayedStatement = showFullStatement || rawStatement.length <= 180 ? rawStatement : `${rawStatement.slice(0, 180)}...`;

  const loc = challenge.location || challenge.locationDetails || {};
  const district = loc.district || challenge.district || 'Ranchi';
  const subDivision = loc.subDivision || loc.block || `${district} Sub-Division`;
  const panchayat = loc.panchayatOrWard || loc.gramPanchayat || loc.ward || 'Gram Panchayat Ward 4';
  const landmark = loc.landmark || 'Near Primary Health Centre / High School';
  const assignedUni = challenge.assignedUniversity?.name || challenge.universityName || 'Ranchi University';
  const assignedDept = challenge.assignedUniversity?.department || challenge.assignedFaculty?.department || 'Department of Applied Sciences & Engineering';
  const mentorName = challenge.assignedFaculty?.name || challenge.assignedUniversity?.mentorName;
  const isMentorAssigned = Boolean(mentorName);

  const norm = (() => {
    if (!challenge.status && !challenge.acceptanceStatus) return 'Pending';
    const s = String(challenge.status || '').toLowerCase();
    const acc = String(challenge.acceptanceStatus || '').toLowerCase();
    if (s.includes('accept') || acc === 'accepted' || s === 'completed') return 'Accepted';
    if (s.includes('reject') || s.includes('decline') || acc === 'declined') return 'Rejected';
    if (s === 'clarified' || acc === 'clarified' || Boolean(challenge.clarificationResponse)) return 'Clarified';
    if (s.includes('clarif') || acc.includes('clarif') || Boolean(challenge.clarificationQuery)) return 'Clarification Requested';
    return 'Pending';
  })();

  return (
    <div className="bg-white rounded-2xl flex flex-col justify-between h-full overflow-hidden select-none shadow-2xl">
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-100 space-y-2.5 bg-gradient-to-b from-emerald-50/40 to-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-extrabold text-[#007A61] bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
              {challenge.id || challenge.challengeId}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              challenge.priority === 'High' || challenge.priority === 'Critical'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : challenge.priority === 'Low'
                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                : 'bg-emerald-50 text-[#007A61] border border-emerald-200'
            }`}>
              {challenge.priority || 'Medium'} Priority
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {challenge.domain || 'Innovation'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-base font-black text-slate-900 leading-snug tracking-tight">
            {challenge.title}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 mt-1">
            <span className="flex items-center space-x-1 text-slate-700 font-semibold">
              <MapPin className="w-3 h-3 text-[#007A61]" />
              <span>{district}, Jharkhand</span>
            </span>
            <span>&bull;</span>
            <span className="text-slate-500">Allocated to: <strong className="text-slate-800">{assignedUni}</strong></span>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex border-b border-slate-200/80 pt-1 text-xs gap-1.5">
          {[
            { id: 'overview', label: 'Ground Overview' },
            { id: 'location', label: 'Full Location & GPS' },
            { id: 'evidence', label: 'Citizen Testimony' },
            { id: 'similar', label: 'Milestones & Allocation' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-1.5 px-3 font-bold transition-all cursor-pointer border-b-2 rounded-t-lg ${
                activeSubTab === tab.id
                  ? 'border-b-[#007A61] text-[#007A61] bg-emerald-50/60'
                  : 'border-b-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Body Tab Content */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-700 bg-slate-50/40">
        {activeSubTab === 'overview' && (
          <div className="space-y-3">
            {/* Problem Statement Card */}
            <div className="bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs space-y-1.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                  Ground Problem Statement
                </span>
                <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Citizen Verified
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-normal pt-1">
                {displayedStatement}
                {rawStatement.length > 180 && (
                  <button
                    onClick={() => setShowFullStatement(!showFullStatement)}
                    className="text-[#007A61] font-extrabold ml-1.5 hover:underline cursor-pointer"
                  >
                    {showFullStatement ? 'Show less' : 'Read full statement'}
                  </button>
                )}
              </p>
            </div>

            {/* Ground Location & Submitter Grid */}
            <div className="grid grid-cols-2 gap-2.5 bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs text-xs">
              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Gram Panchayat & Block</span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">{panchayat} • {subDivision}</span>
              </div>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Ground Landmark</span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">{landmark}</span>
              </div>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Citizen Submitter</span>
                <span className="font-bold text-[#007A61] text-xs mt-0.5 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Citizen</span>
                </span>
              </div>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Beneficiaries Impact</span>
                <span className="font-bold text-slate-900 text-xs mt-0.5 block">
                  {challenge.affectedPopulation || challenge.impactMetrics?.affectedPopulation || '~ 5,000 People'}
                </span>
              </div>
            </div>

            {/* Institutional Allocation Card */}
            <div className="bg-white p-4 border border-slate-200/90 rounded-2xl shadow-xs space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-[#007A61]" />
                  <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">
                    Institutional Allocation & Mentorship
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  isMentorAssigned ? 'bg-emerald-50 text-[#007A61] border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {isMentorAssigned ? 'Mentor Assigned' : 'Pending Mentor Assignment'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold text-[10px] block uppercase tracking-wider">Allocated University</span>
                  <span className="font-extrabold text-slate-900 text-xs">{assignedUni}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold text-[10px] block uppercase tracking-wider">Department</span>
                  <span className="font-bold text-slate-800 text-xs">{assignedDept}</span>
                </div>

                <div className="sm:col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-bold text-[10px] block uppercase tracking-wider">Lead Faculty Mentor</span>
                    <span className="font-extrabold text-slate-900 text-xs">
                      {isMentorAssigned ? mentorName : <span className="text-amber-800 italic">Not Assigned Yet</span>}
                    </span>
                  </div>

                  {!isMentorAssigned && onAssignFaculty && (
                    <button
                      type="button"
                      onClick={() => onAssignFaculty(challenge)}
                      className="px-3 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Assign Faculty Mentor</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'location' && <ChallengeInspectorLocationTab challenge={challenge} />}
        {activeSubTab === 'evidence' && <ChallengeInspectorEvidenceTab challenge={challenge} />}
        {activeSubTab === 'similar' && (
          <ChallengeInspectorSimilarTab
            challenge={challenge}
            onAssignClick={() => onAssignFaculty && onAssignFaculty(challenge)}
          />
        )}
      </div>

      {/* 3. Footer Action Buttons */}
      <div className="p-4 border-t border-slate-100 space-y-2.5 bg-white flex-shrink-0">
        {(() => {
          if (norm === 'Accepted') {
            return (
              <div className="py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-[#007A61] rounded-xl flex items-center justify-between text-xs font-bold shadow-2xs">
                <span className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#007A61]" />
                  <span>Challenge Accepted for University R&D</span>
                </span>
                <div className="flex items-center space-x-2">
                  {!isMentorAssigned && onAssignFaculty && (
                    <button
                      onClick={() => onAssignFaculty(challenge)}
                      className="px-3 py-1 bg-[#007A61] hover:bg-[#006650] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Assign Mentor
                    </button>
                  )}
                  <span className="text-[10px] font-mono bg-emerald-100 text-[#007A61] px-2 py-0.5 rounded-md border border-emerald-300 font-bold">
                    Accepted
                  </span>
                </div>
              </div>
            );
          }

          if (norm === 'Rejected') {
            return (
              <div className="py-2.5 px-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between text-xs font-bold shadow-2xs">
                <span className="flex items-center space-x-2">
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Challenge Declined & Returned to Nodal</span>
                </span>
                <span className="text-[10px] font-mono bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                  Declined
                </span>
              </div>
            );
          }

          return (
            <div className="space-y-2.5">
              {/* Real-time Live Chat Ribbon with Red Unread Badge */}
              <div className="p-3 bg-gradient-to-r from-emerald-50 via-white to-slate-50 border border-emerald-200/90 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center space-x-2">
                  {norm === 'Clarification Requested' ? (
                    <span className="flex items-center space-x-1.5 bg-rose-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full shadow-xs animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      <span>🔴 Live Discussion Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Direct Intercom Ready</span>
                    </span>
                  )}
                  <span className="text-slate-600 font-medium hidden sm:inline">
                    State Nodal Desk: <strong>{challenge.allocatedBy?.name || challenge.nodalOfficer?.name || 'Dr. Ritu Verma'}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>💬 Open Live Chat</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onAccept && onAccept(challenge)}
                  className="py-2.5 px-2.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center space-x-1 shadow-2xs"
                >
                  <Check className="w-4 h-4" />
                  <span>✓ Accept</span>
                </button>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="py-2.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-300 rounded-xl text-xs font-extrabold transition-colors cursor-pointer flex items-center justify-center space-x-1 shadow-2xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>💬 Chat</span>
                </button>
                <button
                  onClick={() => onDecline && onDecline(challenge)}
                  className="py-2.5 px-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-1 shadow-2xs"
                >
                  <X className="w-4 h-4" />
                  <span>Decline</span>
                </button>
              </div>
            </div>
          );
        })()}

        <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-500 justify-center">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Real-time synchronized with Department of Higher & Technical Education, Government of Jharkhand.</span>
        </div>
      </div>

      {/* Real-time Socket.IO Clarification Chat Dialog */}
      {isChatOpen && (
        <ClarificationChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          challenge={challenge}
          isUniversityView={true}
          onAcceptChallenge={(c) => {
            setIsChatOpen(false);
            if (onAccept) onAccept(c);
          }}
          onDeclineChallenge={(c) => {
            setIsChatOpen(false);
            if (onDecline) onDecline(c);
          }}
        />
      )}
    </div>
  );
};

export default ChallengeInspector;

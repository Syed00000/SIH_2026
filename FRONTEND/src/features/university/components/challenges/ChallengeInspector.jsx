import React, { useState } from 'react';
import {
  ChallengeInspectorLocationTab,
  ChallengeInspectorEvidenceTab,
  ChallengeInspectorSimilarTab
} from './ChallengeInspectorTabs.jsx';
import { ClarificationChatModal } from '../../../clarification/components/ClarificationChatModal.jsx';
import { InspectorModalHeader } from './inspector/InspectorModalHeader.jsx';
import { InspectorOverviewTab } from './inspector/InspectorOverviewTab.jsx';
import { InspectorActionFooter } from './inspector/InspectorActionFooter.jsx';

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
  const assignedUni = challenge.assignedUniversity?.name || challenge.universityName || challenge.assignedUniversity?.id || 'Unassigned';
  const assignedDept = challenge.assignedUniversity?.department || challenge.assignedFaculty?.department || 'Unassigned';
  const mentorName = challenge.assignedFaculty?.name || challenge.assignedUniversity?.mentorName || '';
  const isMentorAssigned = Boolean(mentorName && mentorName !== 'Unassigned' && mentorName !== 'Not Assigned');

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
    <div className="bg-white rounded-2xl flex flex-col justify-between h-full overflow-hidden select-none shadow-2xl text-left">
      <InspectorModalHeader
        challenge={challenge}
        district={district}
        assignedUni={assignedUni}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        onClose={onClose}
      />

      <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-700 bg-slate-50/40">
        {activeSubTab === 'overview' && (
          <InspectorOverviewTab
            displayedStatement={displayedStatement}
            rawStatement={rawStatement}
            showFullStatement={showFullStatement}
            setShowFullStatement={setShowFullStatement}
            assignedUni={assignedUni}
            assignedDept={assignedDept}
            challenge={challenge}
          />
        )}
        {activeSubTab === 'location' && <ChallengeInspectorLocationTab challenge={challenge} />}
        {activeSubTab === 'evidence' && <ChallengeInspectorEvidenceTab challenge={challenge} />}
        {activeSubTab === 'similar' && <ChallengeInspectorSimilarTab challenge={challenge} />}
      </div>

      <InspectorActionFooter
        norm={norm}
        isMentorAssigned={isMentorAssigned}
        onOpenChat={() => setIsChatOpen(true)}
        onAccept={onAccept ? () => onAccept(challenge) : null}
        onAssignFaculty={onAssignFaculty ? () => onAssignFaculty(challenge) : null}
        onRequestClarification={onRequestClarification ? () => onRequestClarification(challenge) : null}
        onDecline={onDecline ? () => onDecline(challenge) : null}
      />

      {isChatOpen && (
        <ClarificationChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          challenge={challenge}
          userRole="university"
        />
      )}
    </div>
  );
};

export default ChallengeInspector;

import React, { useState, useEffect } from 'react';
import {
  ChallengeInspectorLocationTab,
  ChallengeInspectorEvidenceTab,
  ChallengeInspectorSimilarTab
} from './ChallengeInspectorTabs.jsx';
import { ClarificationChatModal } from '../../../clarification/components/ClarificationChatModal.jsx';
import { clarificationChatService } from '../../../clarification/services/clarificationChatService.js';
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
  const [chatStats, setChatStats] = useState({ hasUnread: false, unreadCount: 0, hasMessages: false });

  const challengeId = challenge?.id || challenge?.challengeId;

  const fetchChatStats = async () => {
    if (!challengeId) return;
    try {
      const messages = await clarificationChatService.getMessages(challengeId);
      if (Array.isArray(messages) && messages.length > 0) {
        const unread = messages.filter(
          (m) => !m.isReadByUniversity && m.senderRole !== 'UNIVERSITY' && !m.isDeletedForEveryone
        ).length;
        setChatStats({
          hasUnread: unread > 0,
          unreadCount: unread,
          hasMessages: true
        });
      } else {
        setChatStats({ hasUnread: false, unreadCount: 0, hasMessages: false });
      }
    } catch (err) {
      console.warn('Failed to load clarification messages for inspector:', err);
    }
  };

  useEffect(() => {
    fetchChatStats();
    const interval = setInterval(fetchChatStats, 4000);
    return () => clearInterval(interval);
  }, [challengeId]);

  if (!challenge) return null;

  const rawStatement = challenge.problemStatement || challenge.description || 'Problem statement registered in the Jharkhand Innovation Hub.';
  const displayedStatement = showFullStatement || rawStatement.length <= 180 ? rawStatement : `${rawStatement.slice(0, 180)}...`;

  const loc = challenge.location || challenge.locationDetails || {};
  const district = loc.district || challenge.district || 'Ranchi';
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-left">
        <InspectorModalHeader
          challenge={challenge}
          district={district}
          assignedUni={assignedUni}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          onClose={onClose}
        />

        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-700 bg-slate-50/40 custom-scrollbar">
          {activeSubTab === 'overview' && (
            <InspectorOverviewTab
              displayedStatement={displayedStatement}
              rawStatement={rawStatement}
              showFullStatement={showFullStatement}
              setShowFullStatement={setShowFullStatement}
              assignedUni={assignedUni}
              assignedDept={assignedDept}
              mentorName={mentorName}
              isMentorAssigned={isMentorAssigned}
              challenge={challenge}
              onViewEvidence={() => setActiveSubTab('evidence')}
            />
          )}
          {activeSubTab === 'evidence' && <ChallengeInspectorEvidenceTab challenge={challenge} />}
          {activeSubTab === 'location' && <ChallengeInspectorLocationTab challenge={challenge} />}
          {activeSubTab === 'similar' && <ChallengeInspectorSimilarTab challenge={challenge} />}
        </div>

        <InspectorActionFooter
          norm={norm}
          isMentorAssigned={isMentorAssigned}
          onOpenChat={() => setIsChatOpen(true)}
          hasUnread={chatStats.hasUnread}
          unreadCount={chatStats.unreadCount}
          hasMessages={chatStats.hasMessages}
          onAccept={onAccept ? () => onAccept(challenge) : null}
          onAssignFaculty={onAssignFaculty ? () => onAssignFaculty(challenge) : null}
          onRequestClarification={onRequestClarification ? () => onRequestClarification(challenge) : null}
          onDecline={onDecline ? () => onDecline(challenge) : null}
        />

        {isChatOpen && (
          <ClarificationChatModal
            isOpen={isChatOpen}
            onClose={() => {
              setIsChatOpen(false);
              fetchChatStats();
            }}
            challenge={challenge}
            userRole="university"
          />
        )}
      </div>
    </div>
  );
};

export default ChallengeInspector;

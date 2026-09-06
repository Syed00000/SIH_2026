import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import {
  ChallengeInspectorLocationTab,
  ChallengeInspectorEvidenceTab,
  ChallengeInspectorSimilarTab
} from './ChallengeInspectorTabs.jsx';
import { ClarificationChatModal } from '../../../clarification/components/ClarificationChatModal.jsx';
import { clarificationChatService } from '../../../clarification/services/clarificationChatService.js';
import { InspectorOverviewTab } from './inspector/InspectorOverviewTab.jsx';
import { InspectorActionFooter } from './inspector/InspectorActionFooter.jsx';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { Info, Image, MapPin, Layers } from 'lucide-react';

const INSPECTOR_TABS = [
  { id: 'overview', label: 'Overview & Problem Statement', icon: Info },
  { id: 'evidence', label: 'Citizen Evidence & Photos', icon: Image },
  { id: 'location', label: 'Location & Geo-Coordinates', icon: MapPin },
  { id: 'similar', label: 'Similar State Challenges', icon: Layers }
];

export const ChallengeInspectorPanel = ({
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
  const [localAccepted, setLocalAccepted] = useState(false);

  const challengeId = challenge?.id || challenge?.challengeId;

  useEffect(() => {
    setLocalAccepted(false);
  }, [challengeId]);

  const fetchChatStats = async () => {
    if (!challengeId) return;
    try {
      const messages = await clarificationChatService.getMessages(challengeId);
      if (Array.isArray(messages) && messages.length > 0) {
        const unread = messages.filter(
          (m) => !m.isReadByUniversity && m.senderRole !== 'UNIVERSITY' && !m.isDeletedForEveryone
        ).length;
        setChatStats({ hasUnread: unread > 0, unreadCount: unread, hasMessages: true });
      } else {
        setChatStats({ hasUnread: false, unreadCount: 0, hasMessages: false });
      }
    } catch {
      // ignore
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
  const assignedUni = challenge.assignedUniversity?.name || challenge.universityName || challenge.assignedUniversity?.id || 'Unassigned';
  const assignedDept = challenge.assignedUniversity?.department || challenge.assignedFaculty?.department || 'Unassigned';
  const mentorName = challenge.assignedFaculty?.name || challenge.assignedUniversity?.mentorName || '';
  const isMentorAssigned = Boolean(mentorName && mentorName !== 'Unassigned' && mentorName !== 'Not Assigned');

  const norm = (() => {
    const s = String(challenge.status || '').toLowerCase();
    if (s === 'resolved' || s === 'completed' || Boolean(challenge.isDeployed)) return 'Deployed';
    if (localAccepted) return 'Accepted';
    const acc = String(challenge.assignedUniversity?.acceptanceStatus || challenge.acceptanceStatus || '').toLowerCase();
    if (s.includes('accept') || acc === 'accepted') return 'Accepted';
    if (s.includes('reject') || s.includes('decline') || acc === 'declined') return 'Rejected';
    if (s === 'clarified' || acc === 'clarified' || Boolean(challenge.clarificationResponse)) return 'Clarified';
    if (s.includes('clarif') || acc.includes('clarif') || Boolean(challenge.clarificationQuery)) return 'Clarification Requested';
    return 'Pending';
  })();

  const handleAcceptClick = () => {
    setLocalAccepted(true);
    if (onAccept) onAccept(challenge);
  };

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to Assigned Challenges Queue"
      breadcrumbs={['Higher Education R&D', 'Assigned Challenges', challengeId]}
      idBadge={challengeId}
      statusBadge={
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center space-x-1 ${
          norm === 'Deployed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : norm === 'Accepted' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
        }`}>
          {norm === 'Deployed' ? (
            <>
              <Lock className="w-3 h-3 text-emerald-700" />
              <span>✓ Deployed (TRL-9) · Locked</span>
            </>
          ) : (
            <span>{norm}</span>
          )}
        </span>
      }
      title={challenge.title}
      subtitle={`Submitted in ${district} District · Target HEI: ${assignedUni} (${assignedDept})`}
      tabs={INSPECTOR_TABS}
      activeTab={activeSubTab}
      onTabChange={(tabId) => setActiveSubTab(tabId)}
      stickyFooter={
        <InspectorActionFooter
          norm={norm}
          isMentorAssigned={isMentorAssigned}
          onOpenChat={() => setIsChatOpen(true)}
          hasUnread={chatStats.hasUnread}
          unreadCount={chatStats.unreadCount}
          hasMessages={chatStats.hasMessages}
          onAccept={onAccept ? handleAcceptClick : null}
          onAssignFaculty={onAssignFaculty ? () => onAssignFaculty(challenge) : null}
          onRequestClarification={onRequestClarification ? () => onRequestClarification(challenge) : null}
          onDecline={onDecline ? () => onDecline(challenge) : null}
        />
      }
    >
      <div className="space-y-4">
        {activeSubTab === 'overview' && (
          <InspectorOverviewTab
            displayedStatement={displayedStatement}
            rawStatement={rawStatement}
            showFullStatement={showFullStatement}
            setShowFullStatement={setShowFullStatement}
            assignedUni={assignedUni}
            assignedDept={assignedDept}
            challenge={challenge}
            onViewEvidence={() => setActiveSubTab('evidence')}
          />
        )}
        {activeSubTab === 'evidence' && <ChallengeInspectorEvidenceTab challenge={challenge} />}
        {activeSubTab === 'location' && <ChallengeInspectorLocationTab challenge={challenge} />}
        {activeSubTab === 'similar' && <ChallengeInspectorSimilarTab challenge={challenge} />}
      </div>

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
    </FullPageDetailPanel>
  );
};

export default ChallengeInspectorPanel;

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ClarificationChatModal } from '../../../clarification/components/ClarificationChatModal.jsx';
import { ClarificationDeskHeader } from './ClarificationDeskHeader.jsx';
import { ClarificationFilterBar } from './ClarificationFilterBar.jsx';
import { ClarificationThreadCard } from './ClarificationThreadCard.jsx';

export const ClarificationDeskPanel = ({
  challenges = [],
  universityCode = 'RU001',
  universityName = 'Ranchi University',
  onUpdateChallengeStatus,
  onAssignFaculty
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedChatChallenge, setSelectedChatChallenge] = useState(null);

  const filteredChallenges = challenges.filter((c) => {
    const queryMatch =
      !searchTerm ||
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.challengeId || c.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.domain || '').toLowerCase().includes(searchTerm.toLowerCase());

    const hasQuery = c.clarificationQuery || c.assignedUniversity?.clarificationQuery;
    const isClarified = c.clarificationResponse || c.status === 'Clarified';
    const isAccepted = c.assignedUniversity?.acceptanceStatus === 'Accepted' || c.status === 'In Progress';

    if (statusFilter === 'ACTIVE') return queryMatch && hasQuery && !isClarified;
    if (statusFilter === 'CLARIFIED') return queryMatch && isClarified && !isAccepted;
    if (statusFilter === 'ACCEPTED') return queryMatch && isAccepted;
    return queryMatch;
  });

  const activeRoomsCount = challenges.filter((c) => c.clarificationQuery || c.clarificationResponse).length || challenges.length;

  return (
    <div className="space-y-4 select-none animate-in fade-in duration-200 text-left">
      <ClarificationDeskHeader
        universityName={universityName}
        totalCount={challenges.length}
        activeRoomsCount={activeRoomsCount}
      />

      <ClarificationFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {filteredChallenges.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-sm font-extrabold text-slate-700">No Clarification Threads Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filter or inspect assigned challenges to initiate a new clarification room.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredChallenges.map((ch) => (
            <ClarificationThreadCard
              key={ch.challengeId || ch.id || 'CHL-JH-2026'}
              ch={ch}
              onOpenChat={setSelectedChatChallenge}
              onUpdateChallengeStatus={onUpdateChallengeStatus}
              onAssignFaculty={onAssignFaculty}
            />
          ))}
        </div>
      )}

      {selectedChatChallenge && (
        <ClarificationChatModal
          isOpen={Boolean(selectedChatChallenge)}
          onClose={() => setSelectedChatChallenge(null)}
          challenge={selectedChatChallenge}
          userRole="university"
        />
      )}
    </div>
  );
};

export default ClarificationDeskPanel;

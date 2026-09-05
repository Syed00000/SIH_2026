import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { ChallengesTableHeader } from './table/ChallengesTableHeader.jsx';
import { ChallengesTableRow } from './table/ChallengesTableRow.jsx';
import { ChallengesTablePagination } from './table/ChallengesTablePagination.jsx';

export const getNormalizedStatus = (challenge) => {
  if (!challenge) return 'Pending';
  if (typeof challenge === 'string') {
    const s = challenge.toLowerCase();
    if (s.includes('resolve') || s.includes('deploy')) return 'Resolved & Deployed';
    if (s.includes('accept') || s === 'completed') return 'Accepted';
    if (s.includes('reject') || s.includes('decline')) return 'Rejected';
    if (s === 'clarified') return 'Clarified';
    if (s.includes('clarif')) return 'Clarification Requested';
    return 'Pending';
  }
  const status = challenge.status;
  const acceptance = challenge.acceptanceStatus || challenge.assignedUniversity?.acceptanceStatus;
  const s = String(status || '').toLowerCase();
  const acc = String(acceptance || '').toLowerCase();
  if (s.includes('resolve') || s.includes('deploy') || challenge.isDeployed) return 'Resolved & Deployed';
  if (s.includes('accept') || acc === 'accepted' || s === 'completed') return 'Accepted';
  if (s.includes('reject') || s.includes('decline') || acc === 'declined') return 'Rejected';
  if (s === 'clarified' || acc === 'clarified' || Boolean(challenge.clarificationResponse)) return 'Clarified';
  if (s.includes('clarif') || acc.includes('clarif') || Boolean(challenge.clarificationQuery)) return 'Clarification Requested';
  return 'Pending';
};

export const ChallengesTable = ({
  challenges = [],
  selectedChallengeId,
  chatStatsMap = {},
  onSelectChallenge,
  onActionClick,
  onAcceptChallenge,
  onDeclineChallenge,
  onViewDossier,
  onOpenChat,
  onDeleteChallenge,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalRecords = challenges.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedItems = challenges.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col w-full shadow-xs select-none bg-white">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <ChallengesTableHeader />
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="font-bold text-slate-600">Loading challenges from database...</div>
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-bold text-slate-600">No challenges found</div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((c, index) => {
                const cid = c.id || c.challengeId;
                const chatInfo = chatStatsMap[cid];
                const hasUnreadChat = Boolean(chatInfo && (chatInfo.unreadForUniversity > 0 || chatInfo.totalMessages > 0));
                return (
                  <ChallengesTableRow
                    key={cid || index}
                    c={c}
                    globalIndex={startIndex + index + 1}
                    isSelected={selectedChallengeId === cid}
                    normStatus={getNormalizedStatus(c)}
                    hasUnreadChat={hasUnreadChat}
                    onSelectChallenge={onSelectChallenge}
                    onActionClick={onActionClick}
                    onOpenChat={onOpenChat}
                    onDeleteChallenge={onDeleteChallenge}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ChallengesTablePagination
        filteredCount={challenges.length}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        activePage={activePage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ChallengesTable;

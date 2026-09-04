import React from 'react';
import { ChallengesFilterBar } from './ChallengesFilterBar.jsx';
import { ChallengesTable } from './ChallengesTable.jsx';
import { ChallengeInspector } from './ChallengeInspector.jsx';
import { ChallengeActionModal } from './ChallengeActionModal.jsx';
import { ProblemEvidenceDossierModal } from '../../../nodal/components/ProblemEvidenceDossierModal.jsx';
import { ClarificationChatModal } from '../../../clarification/components/ClarificationChatModal.jsx';
import { useAssignedChallenges } from './hooks/useAssignedChallenges.js';

export const AssignedChallengesPanel = ({
  challenges: initialChallenges = [],
  universityCode = 'RU001',
  onUpdateChallengeStatus,
  onAssignFaculty
}) => {
  const {
    statusFilter, setStatusFilter,
    domainFilter, setDomainFilter,
    districtFilter, setDistrictFilter,
    priorityFilter, setPriorityFilter,
    dateRange, setDateRange,
    searchTerm, setSearchTerm,
    filtered, challengeList,
    selectedChallenge, setSelectedChallenge,
    dossierChallenge, setDossierChallenge,
    chatChallenge, setChatChallenge,
    chatStatsMap, fetchChatStats,
    loading, modalConfig, setModalConfig,
    handleModalSubmit,
    handleDeleteChallenge
  } = useAssignedChallenges({ initialChallenges, universityCode, onUpdateChallengeStatus, onAssignFaculty });

  const activeCount = challengeList.filter((c) => c.status === 'Accepted' || c.acceptanceStatus === 'Accepted').length;

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto select-none text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 font-mono">
              Higher Education R&D Node
            </span>
          </div>
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
            Grassroots Problem Statements & Challenge Queue
          </h1>
          <p className="text-xs text-slate-500">
            Assigned problem statements allocated by State Higher Education Cell for laboratory research and student prototyping.
          </p>
        </div>
      </div>

      <ChallengesFilterBar
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        domainFilter={domainFilter} setDomainFilter={setDomainFilter}
        districtFilter={districtFilter} setDistrictFilter={setDistrictFilter}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
        dateRange={dateRange} setDateRange={setDateRange}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        totalCount={challengeList.length} activeCount={activeCount}
      />

      <div className="w-full">
        <ChallengesTable
          challenges={filtered}
          loading={loading}
          chatStatsMap={chatStatsMap}
          selectedChallengeId={selectedChallenge?.id || selectedChallenge?.challengeId}
          onSelectChallenge={(c) => setSelectedChallenge(c)}
          onActionClick={(c) => setSelectedChallenge(c)}
          onOpenChat={(c) => setChatChallenge(c)}
          onDeleteChallenge={handleDeleteChallenge}
        />
      </div>

      {selectedChallenge && (
        <ChallengeInspector
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onAccept={(c) => setModalConfig({ isOpen: true, type: 'accept', challenge: c })}
          onDecline={(c) => setModalConfig({ isOpen: true, type: 'decline', challenge: c })}
          onRequestClarification={(c) => setModalConfig({ isOpen: true, type: 'clarify', challenge: c })}
          onAssignFaculty={(c) => setModalConfig({ isOpen: true, type: 'assign', challenge: c })}
        />
      )}

      {modalConfig.isOpen && (
        <ChallengeActionModal
          isOpen={modalConfig.isOpen}
          type={modalConfig.type}
          challenge={modalConfig.challenge}
          universityCode={universityCode}
          onClose={() => setModalConfig({ isOpen: false, type: 'accept', challenge: null })}
          onSubmit={handleModalSubmit}
        />
      )}

      {chatChallenge && (
        <ClarificationChatModal
          isOpen={Boolean(chatChallenge)}
          onClose={() => setChatChallenge(null)}
          challenge={chatChallenge}
          userRole="university"
        />
      )}
    </div>
  );
};

export default AssignedChallengesPanel;

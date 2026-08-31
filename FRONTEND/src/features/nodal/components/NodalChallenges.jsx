import React from 'react';
import { NodalFilterBar } from './NodalFilterBar.jsx';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { ProblemEvidenceDossierModal } from './ProblemEvidenceDossierModal.jsx';
import { ClarificationChatModal } from '../../clarification/components/ClarificationChatModal.jsx';
import { useNodalChallenges } from './challenges/hooks/useNodalChallenges.js';
import { NodalChallengesHeader } from './challenges/NodalChallengesHeader.jsx';
import { NodalChallengesGrid } from './challenges/NodalChallengesGrid.jsx';

export const NodalChallenges = ({ initialStatusFilter = 'All Status' }) => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    domainFilter,
    setDomainFilter,
    districtFilter,
    setDistrictFilter,
    priorityFilter,
    setPriorityFilter,
    chatChallenge,
    setChatChallenge,
    loading,
    selectedChallenge,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedDossierChallenge,
    setSelectedDossierChallenge,
    toastMsg,
    deletingId,
    loadChallenges,
    handleOpenTriage,
    handleQuickReject,
    handleQuickDelete,
    handleTriageSuccess,
    filteredChallenges
  } = useNodalChallenges({ initialStatusFilter });

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* 1. Header Toolbar with Live Sync */}
      <NodalChallengesHeader
        onReload={loadChallenges}
        loading={loading}
        toastMsg={toastMsg}
      />

      {/* 2. Comprehensive Filter Toolbar */}
      <NodalFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* 3. Problem Cards Grid */}
      <NodalChallengesGrid
        loading={loading}
        challenges={filteredChallenges}
        deletingId={deletingId}
        onOpenDossier={setSelectedDossierChallenge}
        onOpenChat={setChatChallenge}
        onQuickReject={handleQuickReject}
        onQuickDelete={handleQuickDelete}
        onOpenTriage={handleOpenTriage}
      />

      {/* Triage / Institutional Assignment Modal */}
      {isAssignModalOpen && (
        <NodalAssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          challenge={selectedChallenge}
          onSuccess={handleTriageSuccess}
        />
      )}

      {/* Ground Truth Evidence Dossier Modal */}
      {selectedDossierChallenge && (
        <ProblemEvidenceDossierModal
          isOpen={Boolean(selectedDossierChallenge)}
          onClose={() => setSelectedDossierChallenge(null)}
          challenge={selectedDossierChallenge}
          onOpenTriage={() => {
            setSelectedChallenge(selectedDossierChallenge);
            setSelectedDossierChallenge(null);
            setIsAssignModalOpen(true);
          }}
          onOpenChat={() => {
            setChatChallenge(selectedDossierChallenge);
            setSelectedDossierChallenge(null);
          }}
        />
      )}

      {/* Direct Citizen / University Clarification Chat */}
      {chatChallenge && (
        <ClarificationChatModal
          isOpen={Boolean(chatChallenge)}
          onClose={() => setChatChallenge(null)}
          challenge={chatChallenge}
        />
      )}
    </div>
  );
};

export default NodalChallenges;

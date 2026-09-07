import React from 'react';
import { NodalFilterBar } from './NodalFilterBar.jsx';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { ProblemEvidenceDossierPanel } from './ProblemEvidenceDossierPanel.jsx';
import { ClarificationChatModal } from '../../clarification/components/ClarificationChatModal.jsx';
import { useNodalChallenges } from './challenges/hooks/useNodalChallenges.js';
import { NodalChallengesHeader } from './challenges/NodalChallengesHeader.jsx';
import { NodalChallengesGrid } from './challenges/NodalChallengesGrid.jsx';
import { NodalChallengesList } from './challenges/NodalChallengesList.jsx';

export const NodalChallenges = ({ initialStatusFilter = 'All Status', nodalDistrict = '' }) => {
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
    viewMode,
    setViewMode,
    loadChallenges,
    handleOpenTriage,
    handleQuickReject,
    handleQuickDelete,
    handleTriageSuccess,
    filteredChallenges
  } = useNodalChallenges({ initialStatusFilter, nodalDistrict });

  if (selectedDossierChallenge) {
    return (
      <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
        <ProblemEvidenceDossierPanel
          challenge={selectedDossierChallenge}
          onClose={() => setSelectedDossierChallenge(null)}
          onOpenTriage={() => {
            setSelectedChallenge(selectedDossierChallenge);
            setIsAssignModalOpen(true);
          }}
          onOpenChat={() => {
            setChatChallenge(selectedDossierChallenge);
          }}
        />

        {/* Triage / Institutional Assignment Modal */}
        {isAssignModalOpen && (
          <NodalAssignModal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            challenge={selectedChallenge}
            onSuccess={(updated) => {
              handleTriageSuccess(updated);
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
            isUniversityView={false}
          />
        )}
      </div>
    );
  }

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
        totalCount={filteredChallenges.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* 3. Problem Cards Grid or List */}
      {viewMode === 'list' ? (
        <NodalChallengesList
          loading={loading}
          challenges={filteredChallenges}
          deletingId={deletingId}
          onOpenDossier={setSelectedDossierChallenge}
          onOpenChat={setChatChallenge}
          onQuickDelete={handleQuickDelete}
          onOpenTriage={handleOpenTriage}
        />
      ) : (
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
      )}

      {/* Triage / Institutional Assignment Modal */}
      {isAssignModalOpen && (
        <NodalAssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          challenge={selectedChallenge}
          onSuccess={handleTriageSuccess}
        />
      )}

      {/* Direct Citizen / University Clarification Chat */}
      {chatChallenge && (
        <ClarificationChatModal
          isOpen={Boolean(chatChallenge)}
          onClose={() => setChatChallenge(null)}
          challenge={chatChallenge}
          isUniversityView={false}
        />
      )}
    </div>
  );
};

export default NodalChallenges;

import React from 'react';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { ProblemEvidenceDossierModal } from './ProblemEvidenceDossierModal.jsx';
import { ClarificationChatModal } from '../../clarification/components/ClarificationChatModal.jsx';
import { useUniversityProblemsView } from './universityDetail/hooks/useUniversityProblemsView.js';
import { UniversityProblemsDetailHeader } from './universityDetail/UniversityProblemsDetailHeader.jsx';
import { UniversityCapacityProfileDrawer } from './universityDetail/UniversityCapacityProfileDrawer.jsx';
import { UniversityProblemsFilterBar } from './universityDetail/UniversityProblemsFilterBar.jsx';
import { UniversityProblemsList } from './universityDetail/UniversityProblemsList.jsx';

export const UniversityProblemsDetailView = ({
  university,
  assignedChallenges = [],
  allChallenges = [],
  onBack,
  onReload
}) => {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    showProfileDrawer,
    setShowProfileDrawer,
    selectedChallenge,
    targetUniForAllocation,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedDossierChallenge,
    setSelectedDossierChallenge,
    chatChallenge,
    setChatChallenge,
    toastMsg,
    deletingId,
    handleOpenEditOrReassign,
    handleOpenAssignNew,
    handleQuickReject,
    handleQuickDelete,
    handleTriageSuccess,
    filteredChallenges
  } = useUniversityProblemsView({
    university,
    assignedChallenges,
    onReload
  });

  if (!university) return null;

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* 1. Header with Institution Info & Navigation */}
      <UniversityProblemsDetailHeader
        university={university}
        showProfileDrawer={showProfileDrawer}
        setShowProfileDrawer={setShowProfileDrawer}
        onOpenAssignNew={handleOpenAssignNew}
        onBack={onBack}
        toastMsg={toastMsg}
      />

      {/* 2. Collapsible Research Capacity & Accreditation Drawer */}
      {showProfileDrawer && (
        <UniversityCapacityProfileDrawer
          university={university}
          assignedChallenges={assignedChallenges}
        />
      )}

      {/* 3. Search & Filter Bar */}
      <UniversityProblemsFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* 4. Problems List */}
      <UniversityProblemsList
        challenges={filteredChallenges}
        deletingId={deletingId}
        onOpenDossier={setSelectedDossierChallenge}
        onOpenChat={setChatChallenge}
        onQuickReject={handleQuickReject}
        onQuickDelete={handleQuickDelete}
        onOpenEditOrReassign={handleOpenEditOrReassign}
      />

      {/* Triage / Assignment Modal */}
      {isAssignModalOpen && (
        <NodalAssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          challenge={selectedChallenge}
          targetUniversity={targetUniForAllocation}
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
            handleOpenEditOrReassign(selectedDossierChallenge);
            setSelectedDossierChallenge(null);
          }}
          onOpenChat={() => {
            setChatChallenge(selectedDossierChallenge);
            setSelectedDossierChallenge(null);
          }}
        />
      )}

      {/* Direct Clarification Chat Modal */}
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

export default UniversityProblemsDetailView;

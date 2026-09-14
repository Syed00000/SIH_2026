import React, { useState } from 'react';
import { NodalFilterBar } from './NodalFilterBar.jsx';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { ProblemEvidenceDossierPanel } from './ProblemEvidenceDossierPanel.jsx';
import { ClarificationChatModal } from '../../clarification/components/ClarificationChatModal.jsx';
import { useNodalChallenges } from './challenges/hooks/useNodalChallenges.js';
import { NodalChallengesHeader } from './challenges/NodalChallengesHeader.jsx';
import { ProblemScopeTabs } from './challenges/ProblemScopeTabs.jsx';
import { AssignProblemToWardModal } from './ward-directory/AssignProblemToWardModal.jsx';
import { NodalChallengesGrid } from './challenges/NodalChallengesGrid.jsx';
import { NodalChallengesTable } from './challenges/NodalChallengesTable.jsx';

export const NodalChallenges = ({ initialStatusFilter = 'All Status', nodalDistrict = '' }) => {
  const [viewMode, setViewMode] = useState('table');
  const [isAssignWardOpen, setIsAssignWardOpen] = useState(false);
  const [wardAssignChallenge, setWardAssignChallenge] = useState(null);
  const [dossierInitialTab, setDossierInitialTab] = useState('dossier');

  const {
    searchTerm, setSearchTerm, statusFilter, setStatusFilter, domainFilter, setDomainFilter,
    districtFilter, setDistrictFilter, priorityFilter, setPriorityFilter,
    chatChallenge, setChatChallenge, loading, selectedChallenge, setSelectedChallenge,
    isAssignModalOpen, setIsAssignModalOpen, selectedDossierChallenge, setSelectedDossierChallenge,
    toastMsg, deletingId, loadChallenges, handleOpenTriage, handleQuickReject, handleQuickDelete,
    handleTriageSuccess, filteredChallenges
  } = useNodalChallenges({ initialStatusFilter, nodalDistrict });

  const handleOpenDossier = (chl, tab = 'dossier') => {
    setDossierInitialTab(tab);
    setSelectedDossierChallenge(chl);
  };

  const handleOpenAssignWard = (chl) => {
    setWardAssignChallenge(chl);
    setIsAssignWardOpen(true);
  };

  const handleWardAssignedSuccess = (updated) => {
    handleTriageSuccess(updated);
    setSelectedDossierChallenge(null);
    setIsAssignWardOpen(false);
    setWardAssignChallenge(null);
  };

  if (selectedDossierChallenge) {
    return (
      <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
        <ProblemEvidenceDossierPanel
          challenge={selectedDossierChallenge}
          initialTab={dossierInitialTab}
          onTriageSuccess={(updated) => {
            handleTriageSuccess(updated);
            setSelectedDossierChallenge(updated);
          }}
          onClose={() => setSelectedDossierChallenge(null)}
          onOpenTriage={() => {
            setSelectedChallenge(selectedDossierChallenge);
            setIsAssignModalOpen(true);
          }}
          onOpenAssignBlock={() => handleOpenAssignWard(selectedDossierChallenge)}
          onOpenChat={() => setChatChallenge(selectedDossierChallenge)}
        />

        {isAssignWardOpen && (
          <AssignProblemToWardModal
            isOpen={isAssignWardOpen}
            onClose={() => { setIsAssignWardOpen(false); setWardAssignChallenge(null); }}
            challenge={wardAssignChallenge || selectedDossierChallenge}
            onAssigned={handleWardAssignedSuccess}
          />
        )}

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
      <NodalChallengesHeader onReload={loadChallenges} loading={loading} toastMsg={toastMsg} />

      <ProblemScopeTabs totalCount={filteredChallenges.length} />

      <NodalFilterBar
        searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        domainFilter={domainFilter} setDomainFilter={setDomainFilter} districtFilter={districtFilter} setDistrictFilter={setDistrictFilter}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} totalCount={filteredChallenges.length}
        viewMode={viewMode} setViewMode={setViewMode}
      />

      {viewMode === 'table' ? (
        <NodalChallengesTable
          loading={loading} challenges={filteredChallenges} deletingId={deletingId}
          onOpenDossier={handleOpenDossier} onOpenChat={setChatChallenge}
          onQuickReject={handleQuickReject} onQuickDelete={handleQuickDelete}
          onOpenTriage={handleOpenTriage}
        />
      ) : (
        <NodalChallengesGrid
          loading={loading} challenges={filteredChallenges} deletingId={deletingId}
          onOpenDossier={handleOpenDossier} onOpenChat={setChatChallenge}
          onQuickReject={handleQuickReject} onQuickDelete={handleQuickDelete}
          onOpenTriage={handleOpenTriage}
        />
      )}

      {/* Assign Problem to Ward Modal */}
      {isAssignWardOpen && (
        <AssignProblemToWardModal
          isOpen={isAssignWardOpen}
          onClose={() => { setIsAssignWardOpen(false); setWardAssignChallenge(null); }}
          challenge={wardAssignChallenge}
          onAssigned={handleWardAssignedSuccess}
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

      {/* Direct Clarification Chat */}
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

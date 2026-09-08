import React, { useState } from 'react';
import { NodalFilterBar } from './NodalFilterBar.jsx';
import { NodalAssignModal } from './NodalAssignModal.jsx';
import { ProblemEvidenceDossierPanel } from './ProblemEvidenceDossierPanel.jsx';
import { ClarificationChatModal } from '../../clarification/components/ClarificationChatModal.jsx';
import { useNodalChallenges } from './challenges/hooks/useNodalChallenges.js';
import { NodalChallengesHeader } from './challenges/NodalChallengesHeader.jsx';
import { ProblemScopeTabs } from './challenges/ProblemScopeTabs.jsx';
import { AssignProblemToBlockModal } from './challenges/AssignProblemToBlockModal.jsx';
import { NodalChallengesGrid } from './challenges/NodalChallengesGrid.jsx';
import { NodalChallengesTable } from './challenges/NodalChallengesTable.jsx';

export const NodalChallenges = ({ initialStatusFilter = 'All Status', nodalDistrict = '' }) => {
  const [viewMode, setViewMode] = useState('table');
  const [problemScopeTab, setProblemScopeTab] = useState('big'); // 'big' | 'small'
  const [isAssignBlockOpen, setIsAssignBlockOpen] = useState(false);
  const [blockAssignChallenge, setBlockAssignChallenge] = useState(null);

  const {
    searchTerm, setSearchTerm, statusFilter, setStatusFilter, domainFilter, setDomainFilter,
    districtFilter, setDistrictFilter, priorityFilter, setPriorityFilter,
    chatChallenge, setChatChallenge, loading, selectedChallenge, setSelectedChallenge,
    isAssignModalOpen, setIsAssignModalOpen, selectedDossierChallenge, setSelectedDossierChallenge,
    toastMsg, deletingId, loadChallenges, handleOpenTriage, handleQuickReject, handleQuickDelete,
    handleTriageSuccess, filteredChallenges
  } = useNodalChallenges({ initialStatusFilter, nodalDistrict });

  const handleOpenAssignBlock = (chl) => {
    setBlockAssignChallenge(chl);
    setIsAssignBlockOpen(true);
  };

  const handleBlockAssignedSuccess = (updated) => {
    handleTriageSuccess(updated);
    setSelectedDossierChallenge(null);
    setIsAssignBlockOpen(false);
    setBlockAssignChallenge(null);
  };

  if (selectedDossierChallenge) {
    return (
      <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
        <ProblemEvidenceDossierPanel
          challenge={selectedDossierChallenge}
          problemScope={problemScopeTab}
          onClose={() => setSelectedDossierChallenge(null)}
          onOpenTriage={problemScopeTab === 'big' ? () => {
            setSelectedChallenge(selectedDossierChallenge);
            setIsAssignModalOpen(true);
          } : null}
          onOpenAssignBlock={problemScopeTab === 'small' ? () => handleOpenAssignBlock(selectedDossierChallenge) : null}
          onOpenChat={() => setChatChallenge(selectedDossierChallenge)}
        />

        {isAssignBlockOpen && (
          <AssignProblemToBlockModal
            isOpen={isAssignBlockOpen}
            onClose={() => { setIsAssignBlockOpen(false); setBlockAssignChallenge(null); }}
            challenge={blockAssignChallenge || selectedDossierChallenge}
            onAssigned={handleBlockAssignedSuccess}
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

      <ProblemScopeTabs activeTab={problemScopeTab} onTabChange={setProblemScopeTab} totalCount={filteredChallenges.length} />

      <NodalFilterBar
        searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        domainFilter={domainFilter} setDomainFilter={setDomainFilter} districtFilter={districtFilter} setDistrictFilter={setDistrictFilter}
        priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} totalCount={filteredChallenges.length}
        viewMode={viewMode} setViewMode={setViewMode}
      />

      {viewMode === 'table' ? (
        <NodalChallengesTable
          loading={loading} challenges={filteredChallenges} deletingId={deletingId}
          onOpenDossier={setSelectedDossierChallenge} onOpenChat={setChatChallenge}
          onQuickReject={handleQuickReject} onQuickDelete={handleQuickDelete}
          problemScope={problemScopeTab}
          onOpenTriage={(chl) => (problemScopeTab === 'small' ? handleOpenAssignBlock(chl) : handleOpenTriage(chl))}
        />
      ) : (
        <NodalChallengesGrid
          loading={loading} challenges={filteredChallenges} deletingId={deletingId}
          onOpenDossier={setSelectedDossierChallenge} onOpenChat={setChatChallenge}
          onQuickReject={handleQuickReject} onQuickDelete={handleQuickDelete}
          problemScope={problemScopeTab}
          onOpenTriage={(chl) => (problemScopeTab === 'small' ? handleOpenAssignBlock(chl) : handleOpenTriage(chl))}
        />
      )}

      {/* Assign Problem to Block Modal */}
      {isAssignBlockOpen && (
        <AssignProblemToBlockModal
          isOpen={isAssignBlockOpen}
          onClose={() => { setIsAssignBlockOpen(false); setBlockAssignChallenge(null); }}
          challenge={blockAssignChallenge}
          onAssigned={handleBlockAssignedSuccess}
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

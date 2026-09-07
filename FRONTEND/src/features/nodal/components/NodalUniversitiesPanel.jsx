import React from 'react';
import { useNodalUniversities } from './universities/hooks/useNodalUniversities.js';
import { UniversitiesPanelHeader } from './universities/UniversitiesPanelHeader.jsx';
import { UniversitiesFilterBar } from './universities/UniversitiesFilterBar.jsx';
import { UniversitiesGrid } from './universities/UniversitiesGrid.jsx';
import { UniversityProblemsDetailView } from './UniversityProblemsDetailView.jsx';
import { NodalAssignModal } from './NodalAssignModal.jsx';

export const NodalUniversitiesPanel = ({ onNavigateChallenges }) => {
  const {
    universities,
    challenges,
    loading,
    searchTerm,
    setSearchTerm,
    filterAllocationStatus,
    setFilterAllocationStatus,
    filterDistrict,
    setFilterDistrict,
    selectedUniForDetails,
    setSelectedUniForDetails,
    selectedChallenge,
    selectedUniForAllocation,
    isAssignModalOpen,
    setIsAssignModalOpen,
    toastMsg,
    viewMode,
    setViewMode,
    loadData,
    getAssignedChallengesForUni,
    handleAllocateNewToUni,
    handleTriageSuccess,
    filteredUniversities
  } = useNodalUniversities();

  if (selectedUniForDetails) {
    return (
      <UniversityProblemsDetailView
        university={selectedUniForDetails}
        assignedChallenges={getAssignedChallengesForUni(selectedUniForDetails)}
        allChallenges={challenges}
        onBack={() => setSelectedUniForDetails(null)}
        onReload={loadData}
      />
    );
  }

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      <UniversitiesPanelHeader
        onReload={loadData}
        loading={loading}
        toastMsg={toastMsg}
      />

      <UniversitiesFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterAllocationStatus={filterAllocationStatus}
        setFilterAllocationStatus={setFilterAllocationStatus}
        filterDistrict={filterDistrict}
        setFilterDistrict={setFilterDistrict}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <UniversitiesGrid
        loading={loading}
        universities={filteredUniversities}
        getAssignedChallengesForUni={getAssignedChallengesForUni}
        onSelectUniversity={setSelectedUniForDetails}
        onAllocateNew={handleAllocateNewToUni}
        viewMode={viewMode}
      />

      {isAssignModalOpen && (
        <NodalAssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          challenge={selectedChallenge}
          targetUniversity={selectedUniForAllocation}
          onSuccess={handleTriageSuccess}
        />
      )}
    </div>
  );
};

export default NodalUniversitiesPanel;

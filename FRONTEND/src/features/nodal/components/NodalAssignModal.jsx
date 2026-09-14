import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNodalAssignForm } from './assign/hooks/useNodalAssignForm.js';
import { AssignModalHeader } from './assign/AssignModalHeader.jsx';
import { ChallengeSelectorCard } from './assign/ChallengeSelectorCard.jsx';
import { TriageVerificationCard } from './assign/TriageVerificationCard.jsx';
import { DepartmentTargetingCard } from './assign/DepartmentTargetingCard.jsx';
import { NodalNotesAndClarificationCard } from './assign/NodalNotesAndClarificationCard.jsx';
import { AssignModalActions } from './assign/AssignModalActions.jsx';
import { SkeletonModalForm } from './common/NodalSkeletonLoaders.jsx';

export const NodalAssignModal = ({
  isOpen,
  onClose,
  challenge: initialChallenge,
  targetUniversity,
  onSuccess
}) => {
  const {
    departments,
    universities,
    allChallenges,
    loadingData,
    submitting,
    activeChallenge,
    selectedChallengeId,
    verificationStatus,
    setVerificationStatus,
    selectedDomain,
    setSelectedDomain,
    selectedPriority,
    setSelectedPriority,
    departmentLevel,
    setDepartmentLevel,
    selectedDeptId,
    setSelectedDeptId,
    nodalRemarks,
    setNodalRemarks,
    clarificationResponse,
    setClarificationResponse,
    errorMsg,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleting,
    handleSelectChallengeChange,
    handleDeleteChallenge,
    handleFormSubmit
  } = useNodalAssignForm({
    initialChallenge,
    targetUniversity,
    onClose,
    onSuccess
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-md max-w-xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-left">
        <AssignModalHeader
          isUniversityTargetMode={Boolean(targetUniversity || departmentLevel === 'University / HEI')}
          activeChallenge={activeChallenge}
          onClose={onClose}
        />

        {loadingData ? (
          <SkeletonModalForm />
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-center space-x-2 text-rose-700 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {!initialChallenge && (
                <ChallengeSelectorCard
                  allChallenges={allChallenges}
                  selectedChallengeId={selectedChallengeId}
                  onSelectChallengeChange={handleSelectChallengeChange}
                  activeChallenge={activeChallenge}
                />
              )}

              <TriageVerificationCard
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                selectedPriority={selectedPriority}
                setSelectedPriority={setSelectedPriority}
              />

              <DepartmentTargetingCard
                departments={departments}
                universities={universities}
                departmentLevel={departmentLevel}
                setDepartmentLevel={setDepartmentLevel}
                selectedDeptId={selectedDeptId}
                setSelectedDeptId={setSelectedDeptId}
              />

              <NodalNotesAndClarificationCard
                nodalRemarks={nodalRemarks}
                setNodalRemarks={setNodalRemarks}
              />
            </div>

            <AssignModalActions
              onClose={onClose}
              submitting={submitting}
              verificationStatus={verificationStatus}
              isConfirmingDelete={isConfirmingDelete}
              setIsConfirmingDelete={setIsConfirmingDelete}
              handleDeleteChallenge={handleDeleteChallenge}
              deleting={deleting}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default NodalAssignModal;

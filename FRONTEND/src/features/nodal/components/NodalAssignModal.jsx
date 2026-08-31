import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNodalAssignForm } from './assign/hooks/useNodalAssignForm.js';
import { AssignModalHeader } from './assign/AssignModalHeader.jsx';
import { ChallengeSelectorCard } from './assign/ChallengeSelectorCard.jsx';
import { TriageVerificationCard } from './assign/TriageVerificationCard.jsx';
import { InstitutionalTargetingCard } from './assign/InstitutionalTargetingCard.jsx';
import { NodalNotesAndClarificationCard } from './assign/NodalNotesAndClarificationCard.jsx';
import { AssignModalActions } from './assign/AssignModalActions.jsx';

export const NodalAssignModal = ({
  isOpen,
  onClose,
  challenge: initialChallenge,
  targetUniversity,
  onSuccess
}) => {
  const {
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
    selectedUniCode,
    setSelectedUniCode,
    targetDepartment,
    setTargetDepartment,
    nodalRemarks,
    setNodalRemarks,
    clarificationResponse,
    setClarificationResponse,
    acceptanceStatus,
    setAcceptanceStatus,
    errorMsg,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleting,
    isUniversityTargetMode,
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
      <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200/90 shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 text-left">
        <AssignModalHeader
          isUniversityTargetMode={isUniversityTargetMode}
          targetUniversity={targetUniversity}
          activeChallenge={activeChallenge}
          onClose={onClose}
        />

        <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 overflow-y-auto space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center space-x-2 text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isUniversityTargetMode && (
              <ChallengeSelectorCard
                allChallenges={allChallenges}
                selectedChallengeId={selectedChallengeId}
                onSelectChallengeChange={handleSelectChallengeChange}
                activeChallenge={activeChallenge}
              />
            )}

            <TriageVerificationCard
              verificationStatus={verificationStatus}
              setVerificationStatus={setVerificationStatus}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
            />

            <InstitutionalTargetingCard
              verificationStatus={verificationStatus}
              isUniversityTargetMode={isUniversityTargetMode}
              universities={universities}
              selectedUniCode={selectedUniCode}
              setSelectedUniCode={setSelectedUniCode}
              targetDepartment={targetDepartment}
              setTargetDepartment={setTargetDepartment}
              acceptanceStatus={acceptanceStatus}
              setAcceptanceStatus={setAcceptanceStatus}
            />

            <NodalNotesAndClarificationCard
              verificationStatus={verificationStatus}
              nodalRemarks={nodalRemarks}
              setNodalRemarks={setNodalRemarks}
              clarificationResponse={clarificationResponse}
              setClarificationResponse={setClarificationResponse}
            />
          </div>

          <AssignModalActions
            onClose={onClose}
            submitting={submitting}
            activeChallenge={activeChallenge}
            isConfirmingDelete={isConfirmingDelete}
            setIsConfirmingDelete={setIsConfirmingDelete}
            onDeleteChallenge={handleDeleteChallenge}
            deleting={deleting}
          />
        </form>
      </div>
    </div>
  );
};

export default NodalAssignModal;

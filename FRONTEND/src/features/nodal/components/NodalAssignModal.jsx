import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
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

              {activeChallenge?.aiIntelligence?.recommendedDepartment?.name && (
                <div className="bg-gradient-to-r from-emerald-50/90 via-white to-slate-50 text-slate-900 border border-emerald-200/90 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-start space-x-2.5">
                    <div className="p-1.5 bg-[#007A61] text-white rounded-md shrink-0 mt-0.5 shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                    </div>
                    <div>
                      <div className="text-[11.5px] font-bold flex items-center space-x-1.5 flex-wrap">
                        <span className="text-slate-900">AI Routing: {activeChallenge.aiIntelligence.recommendedDepartment.name}</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-mono text-[10px] font-bold">
                          {activeChallenge.aiIntelligence.recommendedDepartment.confidence || 88}% Match
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {activeChallenge.aiIntelligence.recommendedDepartment.reasoning}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const aiDeptName = (activeChallenge.aiIntelligence.recommendedDepartment.name || '').toLowerCase();
                      const matched = departments.find(
                        (d) =>
                          (d.name || '').toLowerCase().includes(aiDeptName) ||
                          aiDeptName.includes((d.name || '').toLowerCase())
                      );
                      if (matched) setSelectedDeptId(matched._id || matched.id);
                      if (activeChallenge.aiIntelligence.classifiedDomain) {
                        setSelectedDomain(activeChallenge.aiIntelligence.classifiedDomain);
                      }
                      if (activeChallenge.aiIntelligence.priorityAssessment?.priority) {
                        setSelectedPriority(activeChallenge.aiIntelligence.priorityAssessment.priority);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00634f] text-white rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    Apply AI Routing
                  </button>
                </div>
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
                aiRecommendedDept={activeChallenge?.aiIntelligence?.recommendedDepartment}
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

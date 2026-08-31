import React, { useState, useEffect } from 'react';
import { Check, AlertOctagon, Loader2 } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { UniversityActionModalHeader } from './actions/UniversityActionModalHeader.jsx';
import { ActionGroundDetailsCard } from './actions/ActionGroundDetailsCard.jsx';
import { ActionDeclineForm } from './actions/ActionDeclineForm.jsx';
import { ActionAssignMentorForm } from './actions/ActionAssignMentorForm.jsx';

export const UniversityActionModal = ({
  isOpen,
  onClose,
  challenge,
  universityCode = 'RU001',
  onAccept,
  onDecline,
  onAssignFaculty,
  onViewDossier
}) => {
  const [activeMode, setActiveMode] = useState('decision');
  const [declineReason, setDeclineReason] = useState('Laboratory instrumentation outside institute scope');
  const [customReason, setCustomReason] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadFaculty = async () => {
        setLoadingFaculty(true);
        try {
          const list = await universityApiService.getFaculty(universityCode);
          if (Array.isArray(list) && list.length > 0) {
            setFacultyList(list);
            setSelectedFaculty(list[0].name);
            setDepartment(list[0].department || 'Civil & Environmental Engineering');
          } else {
            const fallback = [{
              name: 'Prof. Rajesh Chandra',
              department: 'Civil & Environmental Engineering',
              designation: 'Professor & HOD',
              email: 'rajesh.chandra@university.ac.in'
            }];
            setFacultyList(fallback);
            setSelectedFaculty(fallback[0].name);
            setDepartment(fallback[0].department);
          }
        } catch (err) {
          console.warn('Error loading faculty for modal:', err);
        }
        setLoadingFaculty(false);
      };
      loadFaculty();
    }
  }, [isOpen, universityCode]);

  if (!isOpen || !challenge) return null;

  const isAccepted = challenge.status === 'Accepted' || challenge.acceptanceStatus === 'Accepted';
  const isDeclined = challenge.status === 'Declined' || challenge.status === 'Rejected' || challenge.acceptanceStatus === 'Declined';
  const isPending = !isAccepted && !isDeclined;
  const currentMentor = challenge.assignedFaculty?.name || challenge.assignedUniversity?.mentorName;

  const handleConfirmAccept = async () => {
    setSubmitting(true);
    if (onAccept) await onAccept(challenge);
    setSubmitting(false);
    onClose();
  };

  const handleConfirmDecline = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const finalReason = declineReason === 'Other' ? (customReason || 'Outside departmental research scope') : declineReason;
    if (onDecline) await onDecline(challenge, finalReason);
    setSubmitting(false);
    onClose();
  };

  const handleSubmitAssignMentor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const chosen = facultyList.find((f) => f.name === selectedFaculty) || { name: selectedFaculty, department };
    if (onAssignFaculty) {
      await onAssignFaculty({
        challengeId: challenge.id || challenge.challengeId,
        facultyName: chosen.name,
        department: chosen.department || department,
        email: chosen.email || ''
      });
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150 text-left">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
        <UniversityActionModalHeader
          challengeId={challenge.id || challenge.challengeId}
          isAccepted={isAccepted}
          isDeclined={isDeclined}
          onClose={onClose}
        />

        <div className="p-5 space-y-3.5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto bg-slate-50/30">
          <ActionGroundDetailsCard challenge={challenge} />

          {isPending && activeMode === 'decision' && (
            <div className="space-y-3 pt-1">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold">
                This problem was allocated to your university by the State Nodal Cell. Please review and accept to initiate faculty mentorship and R&D prototyping.
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmAccept}
                  className="py-2.5 px-3 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Accept Challenge</span>
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setActiveMode('decline_reason')}
                  className="py-2.5 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>Decline Allocation</span>
                </button>
              </div>
            </div>
          )}

          {activeMode === 'decline_reason' && (
            <ActionDeclineForm
              declineReason={declineReason}
              setDeclineReason={setDeclineReason}
              customReason={customReason}
              setCustomReason={setCustomReason}
              submitting={submitting}
              onBack={() => setActiveMode('decision')}
              onSubmit={handleConfirmDecline}
            />
          )}

          {isAccepted && (
            <ActionAssignMentorForm
              challenge={challenge}
              facultyList={facultyList}
              selectedFaculty={selectedFaculty}
              setSelectedFaculty={setSelectedFaculty}
              department={department}
              setDepartment={setDepartment}
              currentMentor={currentMentor}
              loadingFaculty={loadingFaculty}
              submitting={submitting}
              onViewDossier={onViewDossier}
              onSubmit={handleSubmitAssignMentor}
              onClose={onClose}
            />
          )}

          {isDeclined && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 text-rose-900">
              <span className="font-extrabold text-xs block">Challenge Returned to State Nodal Cell</span>
              <p className="text-[11px]">Reason: <strong>{challenge.declineReason || 'Outside departmental research scope'}</strong></p>
              <p className="text-[10.5px] text-rose-700">State Nodal Authority is reviewing this challenge for reallocation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityActionModal;

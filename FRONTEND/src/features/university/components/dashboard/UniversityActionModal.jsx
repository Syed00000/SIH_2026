import React, { useState } from 'react';
import { X, Check, AlertOctagon, UserPlus, FileText, Loader2, HelpCircle } from 'lucide-react';

export const UniversityActionModal = ({
  isOpen,
  onClose,
  challenge,
  onAccept,
  onDecline,
  onAssignFaculty,
  onViewDossier
}) => {
  const [activeMode, setActiveMode] = useState('decision'); // 'decision' | 'decline_reason' | 'assign_mentor'
  const [declineReason, setDeclineReason] = useState('Laboratory instrumentation outside institute scope');
  const [customReason, setCustomReason] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('Dr. Priya Sharma');
  const [department, setDepartment] = useState('Environmental Sciences');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !challenge) return null;

  const isAccepted = challenge.status === 'Accepted' || challenge.acceptanceStatus === 'Accepted';
  const isDeclined = challenge.status === 'Declined' || challenge.status === 'Rejected' || challenge.acceptanceStatus === 'Declined';
  const isPending = !isAccepted && !isDeclined;

  const handleConfirmAccept = async () => {
    setSubmitting(true);
    if (onAccept) {
      await onAccept(challenge);
    }
    setSubmitting(false);
    onClose();
  };

  const handleConfirmDecline = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const finalReason = declineReason === 'Other' ? (customReason || 'Outside departmental research scope') : declineReason;
    if (onDecline) {
      await onDecline(challenge, finalReason);
    }
    setSubmitting(false);
    onClose();
  };

  const handleSubmitAssignMentor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (onAssignFaculty) {
      await onAssignFaculty({
        challengeId: challenge.id || challenge.challengeId,
        facultyName: selectedFaculty,
        department
      });
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {challenge.id || challenge.challengeId}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              isAccepted
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : isDeclined
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
            }`}>
              {isAccepted ? 'Accepted & Active R&D' : isDeclined ? 'Declined' : 'Pending Institutional Acceptance'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 rounded-md hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 text-xs text-slate-700">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{challenge.title}</h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              District: <strong className="text-slate-700">{challenge.district || 'Ranchi'}</strong> &bull; Domain: <strong className="text-slate-700">{challenge.domain}</strong>
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Ground Problem Statement</span>
            <p className="text-xs text-slate-800 leading-relaxed font-normal">
              {challenge.problemStatement || challenge.description || 'Ground issue logged by citizen under Jharkhand State Innovation Hub.'}
            </p>
          </div>

          {/* MODE 1: PENDING ACCEPTANCE (Action Decision) */}
          {isPending && activeMode === 'decision' && (
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-lg text-emerald-900 text-xs">
                <p className="font-semibold">
                  This problem was allocated to your university by the State Nodal Cell. Please review and decide whether to accept or decline for R&D prototyping.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmAccept}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Accept Challenge</span>
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setActiveMode('decline_reason')}
                  className="py-2.5 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>Decline Challenge</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: DECLINE REASON FORM */}
          {activeMode === 'decline_reason' && (
            <form onSubmit={handleConfirmDecline} className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900">
                  Select Reason for Declining Allocation:
                </label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                >
                  <option value="Laboratory instrumentation outside institute scope">Laboratory instrumentation outside institute scope</option>
                  <option value="Faculty mentoring capacity currently saturated">Faculty mentoring capacity currently saturated</option>
                  <option value="Request re-routing to agricultural university (BAU)">Request re-routing to agricultural university (BAU)</option>
                  <option value="Outside domain of registered faculties">Outside domain of registered faculties</option>
                  <option value="Duplicate problem already addressed in district">Duplicate problem already addressed in district</option>
                  <option value="Other">Other (Specify below)</option>
                </select>
              </div>

              {declineReason === 'Other' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Detailed Reason:</label>
                  <textarea
                    required
                    rows={2}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Provide justification for State Nodal Cell reallocation..."
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveMode('decision')}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Decline & Notify Nodal</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: ALREADY ACCEPTED -> ASSIGN FACULTY MENTOR */}
          {isAccepted && (
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-emerald-900 font-bold text-xs block">Challenge Accepted by University</span>
                  <span className="text-emerald-700 text-[11px]">
                    {challenge.assignedFaculty?.name ? `Lead Mentor: ${challenge.assignedFaculty.name}` : 'Ready for Faculty Mentor Assignment'}
                  </span>
                </div>
                <Check className="w-5 h-5 text-emerald-600" />
              </div>

              <form onSubmit={handleSubmitAssignMentor} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">
                    Assign Faculty Mentor to Lead Execution:
                  </label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => {
                      setSelectedFaculty(e.target.value);
                      if (e.target.value.includes('Priya')) setDepartment('Environmental Sciences & Water');
                      else if (e.target.value.includes('Arvind')) setDepartment('Computer Science & AI');
                      else if (e.target.value.includes('Soren')) setDepartment('Civil & Rural Engineering');
                      else setDepartment('Renewable Energy');
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                  >
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma &bull; Environmental Sciences & Water</option>
                    <option value="Dr. Arvind Kumar">Dr. Arvind Kumar &bull; Computer Science & AI</option>
                    <option value="Prof. S. Soren">Prof. S. Soren &bull; Civil & Rural Engineering</option>
                    <option value="Dr. Neha Verma">Dr. Neha Verma &bull; Renewable Energy & Solar PV</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {onViewDossier && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onViewDossier(challenge); }}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center space-x-1 cursor-pointer underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full Investigation Dossier & PDF</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ml-auto shadow-2xs"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Mentor</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODE 4: ALREADY DECLINED */}
          {isDeclined && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1.5 text-rose-900">
              <span className="font-bold text-xs block">Challenge Returned to State Nodal Cell</span>
              <p className="text-[11px]">
                Reason: <strong>{challenge.declineReason || 'Outside departmental research scope'}</strong>
              </p>
              <p className="text-[10.5px] text-rose-700">
                State Nodal Authority is reviewing this challenge for reallocation to another Higher Education Institution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityActionModal;

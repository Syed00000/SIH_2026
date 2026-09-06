import React, { useState } from 'react';
import { X, CheckCircle2, UserCheck, FolderGit2, FileText, AlertCircle, Building2, Users, Trash2 } from 'lucide-react';
import { industryExpertService } from '../../services/industryExpertService.js';

export const AssignProblemModal = ({ isOpen, onClose, expert, eligibleProblems = [], onSuccess }) => {
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !expert) return null;

  const assignedList = expert.assignedProblems || [];
  const assignedRequestIds = new Set(assignedList.map((p) => p.requestId));
  const availableToAssign = eligibleProblems.filter((p) => !assignedRequestIds.has(p.requestId));

  const activeProblem = availableToAssign.find((p) => p.requestId === selectedProblemId) || availableToAssign[0] || null;

  const handleAssign = async () => {
    if (!activeProblem) return;
    setIsSubmitting(true);
    setError('');
    try {
      await industryExpertService.assignProblem(expert.expertId, {
        requestId: activeProblem.requestId,
        projectId: activeProblem.projectId,
        challengeId: activeProblem.challengeId,
        problemTitle: activeProblem.title,
        problemStatement: activeProblem.problemStatement,
        universityCode: activeProblem.universityCode,
        universityName: activeProblem.universityName,
        studentTeam: activeProblem.studentTeam,
        leadMentor: activeProblem.leadMentor
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to assign problem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnassign = async (requestId) => {
    setIsSubmitting(true);
    setError('');
    try {
      await industryExpertService.unassignProblem(expert.expertId, requestId);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to unassign problem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#004D3D] via-[#007A61] to-[#004D3D] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-black text-[10px] tracking-wider text-emerald-200">MENTORSHIP ALLOCATION</span>
              <h2 className="text-sm font-black text-white">Assign Problem Statement to Mentor</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 bg-[#fafafa] overflow-y-auto flex-1 text-left">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-xs font-bold text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          {/* Expert Card */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#007A61] font-black text-sm flex items-center justify-center">
                {expert.name?.charAt(0) || 'E'}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">{expert.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{expert.designation} • <span className="text-[#007A61] font-bold">{expert.specialization}</span></p>
                <div className="text-[10px] text-slate-400 mt-0.5">{expert.email} | {expert.phone}</div>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${expert.assignedProblems?.length > 0 ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-[#007A61] border border-emerald-200'}`}>
              {expert.assignedProblems?.length > 0 ? `${expert.assignedProblems.length} Active` : 'Available'}
            </span>
          </div>

          {/* Available Problems for Mentorship */}
          <div className="space-y-2">
            <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Select Sanctioned Problem Statement for Mentorship *</span>
            </label>

            {availableToAssign.length === 0 ? (
              <div className="p-4 bg-slate-100/70 border border-dashed border-slate-300 rounded-2xl text-center space-y-1">
                <p className="text-xs font-bold text-slate-700">No New Problem Statements Awaiting Assignment</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  When a university sends a Mentorship request and accepts the fee proposal, problem statements will unlock here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <select
                  value={selectedProblemId || activeProblem?.requestId}
                  onChange={(e) => setSelectedProblemId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
                >
                  {availableToAssign.map((prob) => (
                    <option key={prob.requestId} value={prob.requestId}>
                      [{prob.requestId}] {prob.title} ({prob.universityName})
                    </option>
                  ))}
                </select>

                {activeProblem && (
                  <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span className="flex items-center space-x-1"><Building2 className="w-3.5 h-3.5 text-[#007A61]" /><span>{activeProblem.universityName}</span></span>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-extrabold">Fee: {activeProblem.feeAmount}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 italic bg-white p-2 rounded-lg border border-emerald-100 leading-relaxed font-medium">
                      "{activeProblem.problemStatement || activeProblem.title}"
                    </p>
                    <div className="flex items-center space-x-2 text-[10.5px] text-slate-600 font-semibold pt-1 border-t border-emerald-100">
                      <Users className="w-3.5 h-3.5 text-[#007A61]" />
                      <span>Squad: <strong>{activeProblem.studentTeam}</strong> (Lead Mentor: {activeProblem.leadMentor})</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Existing Assignments on this Expert */}
          {assignedList.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Currently Assigned Problems ({assignedList.length})
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {assignedList.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div className="min-w-0 pr-2">
                      <h5 className="text-xs font-bold text-slate-900 truncate">{item.problemTitle}</h5>
                      <span className="text-[10px] text-slate-500">{item.universityName} • Squad: {item.studentTeam || 'Assigned'}</span>
                    </div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleUnassign(item.requestId)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Unassign Problem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-end space-x-2.5 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Close
          </button>
          {availableToAssign.length > 0 && (
            <button
              type="button"
              disabled={isSubmitting || !activeProblem}
              onClick={handleAssign}
              className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Assigning...' : 'Confirm & Assign Mentorship'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignProblemModal;

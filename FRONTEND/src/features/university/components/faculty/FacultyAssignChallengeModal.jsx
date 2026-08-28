import React, { useState, useEffect } from 'react';
import { X, Loader2, Check, AlertCircle } from 'lucide-react';

export const FacultyAssignChallengeModal = ({
  isOpen,
  onClose,
  faculty,
  openChallenges = [],
  onConfirmAssign
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [role, setRole] = useState('Primary Mentor');
  const [submitting, setSubmitting] = useState(false);

  // Filter out challenges that are already assigned to this faculty
  const availableChallenges = openChallenges.filter(
    (c) => c.status === 'Faculty Pending' || c.status === 'Review' || !c.assignedFaculty?.name || c.assignedFaculty?.name === 'Unassigned'
  );

  useEffect(() => {
    if (availableChallenges.length > 0) {
      setSelectedChallengeId(availableChallenges[0].id || availableChallenges[0].challengeId);
    } else {
      setSelectedChallengeId('');
    }
  }, [isOpen, openChallenges]);

  if (!isOpen || !faculty) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedChallengeId) return;
    setSubmitting(true);
    await onConfirmAssign({
      faculty,
      challengeId: selectedChallengeId,
      role
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200 rounded-none shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 border border-slate-200">
              FACULTY ALLOCATION
            </span>
            <h3 className="text-xs font-bold text-slate-900 mt-1">Assign {faculty.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs text-slate-700">
          <div>
            <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">
              Select Unallocated Grassroots Challenge
            </label>
            {availableChallenges.length > 0 ? (
              <select
                value={selectedChallengeId}
                onChange={(e) => setSelectedChallengeId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 focus:outline-none"
              >
                {availableChallenges.map((c) => (
                  <option key={c.id || c.challengeId} value={c.id || c.challengeId}>
                    {c.id || c.challengeId} • {c.title} ({c.district})
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>All active challenges are currently assigned. No open unallocated challenges available.</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-900 uppercase mb-1">Mentorship Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-none text-xs text-slate-900 focus:outline-none"
            >
              <option value="Primary Mentor">Primary Lead Mentor</option>
              <option value="Co-mentor">Co-Mentor / Domain Specialist</option>
              <option value="Technical Advisor">Technical Advisor</option>
            </select>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <span>
              Assigning this professor will increment active project load and sync milestones directly to the Government Triage Portal.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 rounded-none text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || availableChallenges.length === 0}
              className={`px-4 py-1.5 text-white rounded-none text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                availableChallenges.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black cursor-pointer'
              }`}
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>{submitting ? 'Allocating...' : 'Confirm Allocation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyAssignChallengeModal;

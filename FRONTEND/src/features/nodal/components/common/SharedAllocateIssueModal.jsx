import React, { useState } from 'react';
import { X, Landmark, AlertCircle, Send, Search, Building2 } from 'lucide-react';

export const SharedAllocateIssueModal = ({
  isOpen,
  onClose,
  target,
  targetType = 'Authority',
  challenges = [],
  onAllocate,
  onProblemAllocated
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !target) return null;

  const targetId = target.blockId || target.deptId || target.id || target._id;
  const targetName = target.name || targetId;

  const availableChallenges = challenges.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (c.title || '').toLowerCase().includes(term) ||
      (c.challengeId || c.id || '').toLowerCase().includes(term) ||
      (c.category || c.domain || '').toLowerCase().includes(term)
    );
  });

  const activeChallenge = challenges.find((c) => (c.challengeId || c.id || c._id) === selectedChallengeId);
  const isAlreadyAllocatedHere =
    activeChallenge?.assignedBlock?.blockId === targetId ||
    activeChallenge?.assignedDepartment?.deptId === targetId ||
    activeChallenge?.assignedDepartment?.name === targetName;

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedChallengeId) return setError('Please select a civic issue to allocate.');

    try {
      setSubmitting(true);
      setError('');
      const updated = await onAllocate(selectedChallengeId, target, instructions);
      if (onProblemAllocated) onProblemAllocated(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to allocate problem to ${targetType}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Allocate Issue to {targetType}</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target: <span className="font-bold text-slate-800">{targetName}</span> ({targetId})
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAllocate} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700">Select Civic Issue ({availableChallenges.length} total) *</label>
              <span className="text-[10px] text-slate-400 font-semibold">All Challenges</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search issues by ID, title, or domain..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
            {availableChallenges.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No civic issues found.</div>
            ) : (
              availableChallenges.map((c) => {
                const cId = c.challengeId || c.id || c._id;
                const isSelected = selectedChallengeId === cId;
                const currentHolder = c.assignedWard?.name || c.assignedBlock?.name || c.assignedDepartment?.name;

                return (
                  <div
                    key={cId}
                    onClick={() => setSelectedChallengeId(cId)}
                    className={`p-3 text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                      isSelected ? 'bg-emerald-50/70 border-l-4 border-l-[#007A61]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sharedChallengeSelection"
                      checked={isSelected}
                      onChange={() => setSelectedChallengeId(cId)}
                      className="mt-0.5 text-[#007A61] focus:ring-[#007A61]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                          {c.challengeId || c.id}
                        </span>
                        <span className="font-bold text-slate-900 truncate">{c.title}</span>
                        {isAlreadyAllocatedHere ? (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Assigned Here
                          </span>
                        ) : currentHolder ? (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            {currentHolder}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-slate-100 text-slate-600">
                            Unassigned
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>{c.category || c.domain || 'Civic Problem'}</span>
                        <span>•</span>
                        <span>Status: {c.status || 'Submitted'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Directives / Remediation Instructions for {targetType}
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Conduct field inspection, mobilize local engineers, and resolve within timeline."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedChallengeId}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Allocating...' : (isAlreadyAllocatedHere ? 'Re-assign Directives' : `Allocate to ${targetType}`)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharedAllocateIssueModal;

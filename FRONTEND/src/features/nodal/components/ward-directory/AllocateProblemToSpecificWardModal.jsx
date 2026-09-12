import React, { useState } from 'react';
import { X, Landmark, AlertCircle, Send, Search } from 'lucide-react';
import { wardService } from '../../../government/services/wardService.js';

export const AllocateProblemToSpecificWardModal = ({
  isOpen,
  onClose,
  ward,
  challenges = [],
  onProblemAllocated
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !ward) return null;

  // Show all challenges across wards so nodal officer can assign/re-assign any problem
  const availableChallenges = challenges.filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (c.title || '').toLowerCase().includes(term) || (c.challengeId || c.id || '').toLowerCase().includes(term) || (c.category || c.domain || '').toLowerCase().includes(term);
  });

  const activeChallenge = challenges.find((c) => (c.challengeId || c.id || c._id) === selectedChallengeId);
  const isAlreadyThisWard = activeChallenge?.assignedWard?.wardId === ward.wardId;

  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!selectedChallengeId) return setError('Please select a civic issue to allocate.');

    try {
      setSubmitting(true);
      setError('');
      const updated = await wardService.assignProblemToWard(selectedChallengeId, ward, instructions);
      if (onProblemAllocated) onProblemAllocated(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to allocate problem to ward');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Allocate Issue to Ward</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target: <span className="font-bold text-slate-800">{ward.name}</span> ({ward.wardId})
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleAllocate} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search Civic Issues */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700">Select Civic Issue to Allocate ({availableChallenges.length} total) *</label>
              <span className="text-[10px] text-slate-400 font-semibold">All Ward Problems</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search all problems by ID, title, or category..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
          </div>

          {/* Issues List Container */}
          <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
            {availableChallenges.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No civic issues found matching filter.</div>
            ) : (
              availableChallenges.map((c) => {
                const cId = c.challengeId || c.id || c._id;
                const isSelected = selectedChallengeId === cId;
                const assignedWardId = c.assignedWard?.wardId || c.assignedWard?.id;
                const isThisWard = assignedWardId === ward.wardId;

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
                      name="challengeSelection"
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
                        {isThisWard ? (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Assigned Here
                          </span>
                        ) : assignedWardId ? (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            {c.assignedWard?.name || assignedWardId}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-slate-100 text-slate-600">
                            Unassigned
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>{c.category || c.domain || 'General Civic'}</span>
                        <span>•</span>
                        <span>Status: {c.status || 'Submitted'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Allocation Directives */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Directives / Remediation Instructions for Ward Councillor
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Conduct on-ground inspection and expedite drain cleaning within 48 hours."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61] resize-none"
            />
          </div>

          {/* Actions */}
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
              <span>{submitting ? 'Allocating...' : (isAlreadyThisWard ? 'Re-assign Directives' : 'Allocate to Ward')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocateProblemToSpecificWardModal;

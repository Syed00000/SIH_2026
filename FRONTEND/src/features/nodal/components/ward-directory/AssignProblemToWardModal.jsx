import React, { useState, useEffect } from 'react';
import { X, Landmark, AlertCircle, Send } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';
import { wardService } from '../../../government/services/wardService.js';

export const AssignProblemToWardModal = ({ isOpen, onClose, challenge, onAssigned }) => {
  const [wards, setWards] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      wardService
        .getWards({ district: challenge?.location?.district || 'Ranchi' })
        .then((res) => {
          setWards(res || []);
          if (res && res.length > 0) {
            setSelectedWardId(res[0].wardId || res[0].id);
          }
        })
        .catch((err) => console.warn('Failed to load wards for assignment:', err));
    }
  }, [isOpen, challenge]);

  if (!isOpen || !challenge) return null;

  const activeWard = wards.find((w) => (w.wardId || w.id) === selectedWardId) || wards[0];

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!activeWard) return setError('Please select an administrative ward.');

    try {
      setSubmitting(true);
      setError('');
      const targetChlId = challenge.challengeId || challenge.id || challenge._id;
      const wardPayload = {
        id: activeWard.id || activeWard._id,
        wardId: activeWard.wardId,
        wardNumber: activeWard.wardNumber,
        name: activeWard.name,
        councillorName: activeWard.councillorName || '',
        councillorEmail: activeWard.councillorEmail || '',
        councillorPhone: activeWard.councillorPhone || '',
        district: activeWard.district || 'Ranchi',
        instructions: instructions.trim() || 'Assigned by District Nodal Officer for municipal resolution.',
        status: 'Assigned'
      };

      const res = await apiClient.patch(`citizen/challenges/${targetChlId}/triage`, {
        assignedWard: wardPayload,
        status: 'In Progress'
      });
      const updated = res?.data?.data || res?.data;
      if (onAssigned) onAssigned(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to assign problem to ward');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Assign Problem to Ward</h2>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">
                [{challenge.challengeId || challenge.id}] {challenge.title}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleConfirmAssign} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Target Ward *</label>
            {wards.length === 0 ? (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl">
                No registered wards found. Please create a Ward first in the Ward Directory.
              </p>
            ) : (
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:border-[#007A61]"
              >
                {wards.map((w) => (
                  <option key={w.wardId || w.id} value={w.wardId || w.id}>
                    {w.name} ({w.wardId}) — {w.councillorName || 'No Councillor'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {activeWard && (
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 space-y-1 text-xs">
              <p className="font-extrabold text-[#007A61]">{activeWard.name}</p>
              <p className="text-slate-600 text-[11px]">
                In-charge: {activeWard.councillorName || 'N/A'} • {activeWard.councillorPhone || 'No Phone'}
              </p>
              {activeWard.localities && activeWard.localities.length > 0 && (
                <p className="text-[10px] text-slate-500">
                  Localities covered: {activeWard.localities.join(', ')}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Nodal Directives & Priority Instructions</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please inspect localized drainage issue in Doranda bazaar and initiate remediation."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || wards.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Assigning...' : 'Assign to Ward'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignProblemToWardModal;

import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Clock, MapPin, User, Send, Save } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const WardProblemDetailModal = ({ isOpen, challenge, onClose, onUpdated }) => {
  const [status, setStatus] = useState('In Progress');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !challenge) return null;

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const targetId = challenge.challengeId || challenge.id || challenge._id;
      const res = await apiClient.patch(`citizen/challenges/${targetId}/triage`, {
        status,
        remarks: remarks.trim() || `Status updated to ${status} by Ward Councillor/In-charge.`
      });
      const updated = res?.data?.data || res?.data;
      if (onUpdated) onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update problem status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">[{challenge.challengeId}]</span>
              <h2 className="text-sm font-black text-slate-900 leading-none">{challenge.title}</h2>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{challenge.domain} • Priority: {challenge.priority || 'Medium'}</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Problem Description</span>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {challenge.location?.address || challenge.location?.district || 'Ward Area'}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Citizen Submitter</span>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {challenge.submitter?.name || 'Local Citizen'}
              </p>
            </div>
          </div>

          {challenge.assignedWard && (
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 space-y-1">
              <span className="text-[10px] font-bold text-[#007A61] uppercase">Nodal Officer Instructions</span>
              <p className="text-slate-700 font-semibold">
                {challenge.assignedWard.instructions || 'Assigned for priority ground action.'}
              </p>
              <p className="text-[10px] text-slate-400">
                Assigned by {challenge.assignedWard.assignedBy || 'Nodal Authority'}
              </p>
            </div>
          )}

          <form onSubmit={handleUpdateStatus} className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
              Update Ward Remediation Status
            </span>

            <div className="grid grid-cols-2 gap-2">
              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                status === 'In Progress' ? 'border-blue-500 bg-blue-50/50 text-blue-800 font-bold' : 'border-slate-200 text-slate-600'
              }`}>
                <input
                  type="radio"
                  name="status"
                  value="In Progress"
                  checked={status === 'In Progress'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Under Remediation (In Progress)</span>
              </label>

              <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                status === 'Resolved' ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold' : 'border-slate-200 text-slate-600'
              }`}>
                <input
                  type="radio"
                  name="status"
                  value="Resolved"
                  checked={status === 'Resolved'}
                  onChange={(e) => setStatus(e.target.value)}
                  className="hidden"
                />
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resolved & Fixed</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Ward Action Remarks</label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Sanitation workers dispatched; drainage cleaned and verified."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{submitting ? 'Saving...' : 'Update Status'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WardProblemDetailModal;

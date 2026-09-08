import React, { useState } from 'react';
import { X, CheckCircle, Clock, MapPin, User, FileText, Send, Building2, AlertCircle } from 'lucide-react';
import apiClient from '../../../infrastructure/api/client.js';

export const BlockIssueDetailModal = ({ problem, onClose, onUpdateProblem }) => {
  const [actionNotes, setActionNotes] = useState('');
  const [newStatus, setNewStatus] = useState(problem?.status || 'In Progress');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!problem) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const targetId = problem.challengeId || problem.id || problem._id;
      const res = await apiClient.patch(`citizen/challenges/${targetId}/status`, {
        status: newStatus,
        remarks: actionNotes.trim() || 'Action taken by Block Administration Office.'
      });
      const updated = res?.data?.data || res?.data || { ...problem, status: newStatus };
      if (onUpdateProblem) onUpdateProblem(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update problem status');
    } finally {
      setSubmitting(false);
    }
  };

  const images = problem.mediaUrls || problem.media?.map((m) => m.url) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#007A61]/10 text-[#007A61]">
              {problem.challengeId}
            </span>
            <span className="text-xs font-black text-slate-900 truncate max-w-md">{problem.title}</span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1">Grievance Statement</h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {problem.description}
            </p>
          </div>

          {/* Location & Citizen Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Gram Panchayat Location</span>
              <p className="font-extrabold text-slate-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{problem.location?.panchayatOrWard || problem.assignedDepartment?.panchayat || 'Block Area'}</span>
              </p>
              <p className="text-[11px] text-slate-500">{problem.location?.fullAddress || problem.district || 'Ranchi'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Citizen Submitter</span>
              <p className="font-extrabold text-slate-900 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{problem.submitter?.name || 'Citizen'}</span>
              </p>
              <p className="text-[11px] text-slate-500">{problem.submitter?.mobileNumber || 'Contact verified'}</p>
            </div>
          </div>

          {/* Photos / Evidence */}
          {images.length > 0 && (
            <div>
              <h4 className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Evidence Photos</h4>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <a key={idx} href={img} target="_blank" rel="noreferrer" className="shrink-0">
                    <img src={img} alt="Evidence" className="w-24 h-24 object-cover rounded-xl border border-slate-200 hover:opacity-90" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Directive Instructions */}
          {problem.assignedDepartment?.instructions && (
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Nodal Directive Instructions:</span>
              <p className="text-blue-900 font-medium">{problem.assignedDepartment.instructions}</p>
            </div>
          )}

          {/* Action Update Form */}
          <form onSubmit={handleUpdate} className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase">Record Block Remedial Action</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="In Progress">In Progress (Field Work Ongoing)</option>
                  <option value="Resolved">Resolved (Completed on Ground)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-500 uppercase block mb-1">Action Notes / Completion Report</label>
              <textarea
                rows={2}
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Details of remedial action executed at the gram panchayat..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#007A61]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">Cancel</button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Saving...' : 'Update Action'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlockIssueDetailModal;

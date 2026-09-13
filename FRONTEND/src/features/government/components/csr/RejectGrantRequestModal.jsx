import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

export const RejectGrantRequestModal = ({ isOpen, onClose, request, onRejected }) => {
  if (!isOpen || !request) return null;

  const [reason, setReason] = useState('Insufficient funds or documentation');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReject = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return setError('Please specify a rejection reason.');

    setLoading(true);
    setError('');
    try {
      const id = request._id || request.requestId;
      const res = await apiClient.patch(`government/grant-requests/${id}/reject`, {
        reason: reason.trim()
      });
      if (onRejected) onRejected(res?.data?.data || res?.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to reject request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-rose-700 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-200" />
            <span className="font-black text-sm uppercase tracking-wide">Reject Fund Requisition</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-xs text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleReject} className="p-5 space-y-4 text-xs">
          {error && <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-xs">{error}</div>}

          <div className="text-slate-600">
            Are you sure you want to reject fund requisition <strong className="text-slate-900 font-mono">{request.requestId}</strong> from <strong className="text-slate-900">{request.requesterName}</strong> for <strong className="text-slate-900">₹ {(Number(request.requestedAmount) || 0).toLocaleString('en-IN')}</strong>?
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Rejection Reason / Remarks *</label>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="Provide clear audit justification for rejection..." className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-800 focus:bg-white focus:outline-none" />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xs cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xs flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
              <span>Confirm Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectGrantRequestModal;

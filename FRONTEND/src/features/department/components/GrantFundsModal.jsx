import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, IndianRupee, ShieldCheck, Ban } from 'lucide-react';
import grantRequestService from '../../government/services/grantRequestService.js';

export const GrantFundsModal = ({ request, isOpen, onClose, onGranted, onRejected }) => {
  const [sanctionedAmount, setSanctionedAmount] = useState(request?.requestedAmount || 0);
  const [utrNumber, setUtrNumber] = useState(() => `UTR-JH-CSR-${Date.now().toString().slice(-8)}`);
  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !request) return null;

  const handleGrant = async (e) => {
    e.preventDefault();
    const amt = Number(sanctionedAmount);
    if (!amt || amt <= 0) return setError('Please enter a valid sanctioned amount');
    if (!utrNumber.trim()) return setError('Please specify a transaction UTR reference');

    try {
      setSubmitting(true);
      setError('');
      const updated = await grantRequestService.grantRequest(request.requestId || request._id, {
        sanctionedAmount: amt,
        utrNumber: utrNumber.trim(),
        remarks: remarks.trim() || 'Sanctioned via CSR Municipal Development Pool'
      });
      if (onGranted) onGranted(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to grant funds');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return setError('Please specify reason for rejecting requisition');
    try {
      setSubmitting(true);
      setError('');
      const updated = await grantRequestService.rejectRequest(request.requestId || request._id, { reason: rejectionReason.trim() });
      if (onRejected) onRejected(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to reject requisition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-teal-800 to-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-300"><ShieldCheck className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-black">Sanction & Grant Fund Requisition</h3>
              <p className="text-[11px] text-teal-200">Review request from {request.requesterName}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2 font-medium"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

          {/* Requisition Summary Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900">{request.requesterName}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {request.tier === 'WARD_TO_BLOCK' ? 'Ward Requisition' : (request.tier === 'BLOCK_TO_DISTRICT' ? 'Block Requisition' : 'District Requisition')}
              </span>
            </div>
            <div className="text-slate-700 font-medium">
              <span className="font-bold text-slate-900">Purpose:</span> {request.purpose}
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 text-[11px]">
              <span className="text-slate-500 font-bold">Requested: ₹ {Number(request.requestedAmount).toLocaleString('en-IN')}</span>
              <span className="text-slate-500 font-bold">Sector: {request.sector}</span>
            </div>
          </div>

          {!isRejecting ? (
            <form onSubmit={handleGrant} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Sanctioned Grant (₹) *</label>
                  <input
                    type="number"
                    value={sanctionedAmount}
                    onChange={(e) => setSanctionedAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black text-emerald-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">UTR / PFMS Ref *</label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Grant Sanction Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Sanctioned for immediate field execution under Phase 1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="text-rose-600 hover:text-rose-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Reject Request</span>
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={onClose} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Granting...' : 'Approve & Disburse'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Rejection Reason *</label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Specify why requisition cannot be sanctioned at this time..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsRejecting(false)} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer">
                  Back
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleReject}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrantFundsModal;

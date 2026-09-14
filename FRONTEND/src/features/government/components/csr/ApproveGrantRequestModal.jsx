import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Landmark, Send } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

export const ApproveGrantRequestModal = ({ isOpen, onClose, request, onApproved }) => {
  if (!isOpen || !request) return null;

  const defaultAmount = Number(request.requestedAmount) || 0;
  const [sanctionedAmount, setSanctionedAmount] = useState(defaultAmount);
  const [utrNumber, setUtrNumber] = useState(`JH-CSR-DISB-${Date.now().toString().slice(-6)}`);
  const [remarks, setRemarks] = useState('Sanctioned & Disbursed via State Innovation Pool');
  const [availablePool, setAvailablePool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchPool = async () => {
      try {
        const res = await apiClient.get('government/grants');
        const poolData = res?.data?.data || res?.data || {};
        setAvailablePool(Number(poolData.stateGrantsTotal) || 0);
      } catch {
        // safe fallback
      }
    };
    fetchPool();
  }, [isOpen]);

  const isZero = availablePool !== null && availablePool <= 0;
  const isExceeded = availablePool !== null && Number(sanctionedAmount) > availablePool;
  const cannotAllocate = isZero || isExceeded;

  const handleApprove = async (e) => {
    e.preventDefault();
    const num = Number(sanctionedAmount);
    if (!num || num <= 0) return setError('Please enter a valid sanctioned amount greater than ₹0.');
    if (isZero) return setError('Yeh state pool fund allocate nahi kar sakta kyunki iske paas ₹0 fund hai (Sufficient fund nahi hai).');
    if (isExceeded) return setError(`Yeh state pool fund allocate nahi kar sakta kyunki iske paas sufficient fund nahi hai (Available: ₹${availablePool.toLocaleString('en-IN')}).`);

    setLoading(true);
    setError('');
    try {
      const id = request._id || request.requestId;
      const res = await apiClient.patch(`government/grant-requests/${id}/grant`, {
        sanctionedAmount: num,
        utrNumber: utrNumber.trim(),
        remarks: remarks.trim(),
        grantedBy: 'Super Admin, Govt of Jharkhand'
      });
      if (onApproved) onApproved(res?.data?.data || res?.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to approve request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white rounded-xs border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="bg-[#007A61] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span className="font-black text-sm uppercase tracking-wide">Approve & Transfer Grant Fund</span>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded-xs text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleApprove} className="p-5 space-y-4 text-xs">
          {isZero ? (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xs flex items-center space-x-2 text-rose-700 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Yeh state pool fund allocate nahi kar sakta kyunki iske paas ₹0 fund hai (Sufficient fund nahi hai).</span>
            </div>
          ) : isExceeded ? (
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xs flex items-center space-x-2 text-amber-800 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Yeh state pool fund allocate nahi kar sakta kyunki iske paas sufficient fund nahi hai (Available: ₹{availablePool.toLocaleString('en-IN')}).</span>
            </div>
          ) : null}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xs flex items-center space-x-2 text-rose-700 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 p-3.5 rounded-xs border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Requisition ID</span>
              <span className="font-mono font-bold text-slate-800">{request.requestId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Beneficiary Department</span>
              <span className="font-bold text-slate-900">{request.requesterName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-400">Category & District</span>
              <span className="text-slate-600 font-medium">{request.requesterCategory} • {request.district || 'Ranchi'}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">Requested Amount</span>
              <span className="text-sm font-black font-mono text-slate-900">₹ {defaultAmount.toLocaleString('en-IN')}</span>
            </div>
            {availablePool !== null && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-[11px]">
                <span className="text-slate-400 font-bold">Treasury Balance:</span>
                <span className={`font-mono font-bold ${isZero ? 'text-rose-600' : 'text-emerald-700'}`}>₹ {availablePool.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Sanctioned Transfer Amount (₹) *</label>
            <input type="number" min="1" step="any" disabled={isZero} value={sanctionedAmount} onChange={(e) => setSanctionedAmount(e.target.value)} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xs text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61] disabled:opacity-50" />
            <span className="text-[10px] text-slate-400 mt-1 block">This amount will be directly credited to {request.requesterName}'s live allocated fund pool.</span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Sanction / UTR Reference *</label>
            <input type="text" value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} required disabled={cannotAllocate} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-[11px] font-mono font-bold text-slate-800 disabled:opacity-50" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Sanction Remarks</label>
            <textarea rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} disabled={cannotAllocate} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-800 disabled:opacity-50" />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xs cursor-pointer">Cancel</button>
            <button
              type="submit"
              disabled={loading || cannotAllocate}
              className="px-4 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white font-bold rounded-xs flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{cannotAllocate ? 'Insufficient Fund to Authorize' : 'Authorize & Transfer Funds'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApproveGrantRequestModal;

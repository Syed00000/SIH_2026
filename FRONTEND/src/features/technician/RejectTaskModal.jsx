import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export const RejectTaskModal = ({
  challenge,
  isOpen,
  onClose,
  onConfirm,
  rejecting
}) => {
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRemarks('');
    }
  }, [isOpen]);

  if (!isOpen || !challenge) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert('Please provide a reason for rejecting this assignment.');
      return;
    }
    onConfirm(challenge, remarks);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertCircle className="w-5 h-5" />
            <h2 className="font-extrabold text-sm uppercase tracking-wider">Reject Assignment</h2>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-5 space-y-4">
          <div className="text-xs text-slate-600 mb-2">
            You are about to reject the problem <strong>{challenge.challengeId || challenge.id}</strong>. 
            This will mark it as <strong>Not Solved</strong> and escalate it back to the Ward Commissioner.
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Rejection <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g. Issue requires heavy machinery not available at ward level, or location is unreachable..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-rose-500 outline-none transition-all"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={rejecting}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rejecting || !remarks.trim()}
              className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

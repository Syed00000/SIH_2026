import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Wrench, FileText } from 'lucide-react';

export const CompleteTaskModal = ({ challenge, isOpen, onClose, onConfirm, completing }) => {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !challenge) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Please enter field remediation details / work summary before completing.');
      return;
    }
    setError('');
    onConfirm(challenge, remarks.trim());
  };

  const setQuickRemark = (text) => {
    setRemarks((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black leading-tight">Mark Assignment as Completed</h3>
              <p className="text-[11px] text-slate-500 font-medium">Record ground action to resolve citizen problem</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={completing} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Task Snapshot */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] font-bold text-[#007A61] bg-[#007A61]/10 px-1.5 py-0.5 rounded">
                {challenge.challengeId || challenge.id}
              </span>
              <span className="font-bold text-slate-900 truncate">{challenge.title}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Location: <strong className="text-slate-700">{challenge.location?.panchayatOrWard || challenge.location?.panchayat || challenge.district || 'Field Area'}</strong>
            </p>
          </div>

          {/* Quick Remarks */}
          <div>
            <span className="block text-[11px] font-bold text-slate-600 mb-1.5">Quick Action Tags:</span>
            <div className="flex flex-wrap gap-1.5">
              {['Ground inspection completed', 'Defective wiring repaired', 'Service supply restored', 'Safety hazard cleared', 'Component replaced'].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setQuickRemark(tag)}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 text-[10.5px] font-semibold text-slate-700 transition cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Remediation / Work Completion Summary *
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Describe work performed on site, parts repaired/replaced, and final ground status..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-xs resize-none"
              disabled={completing}
              required
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              This summary will be published to the citizen portal and department administration.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={completing}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={completing}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completing ? 'Resolving Task...' : 'Confirm Work Completed'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, IndianRupee, Save, Send, AlertCircle, Loader2, FileSpreadsheet } from 'lucide-react';

const PRESETS = [
  { label: '+ ₹ 10L', val: 1000000 },
  { label: '+ ₹ 50L', val: 5000000 },
  { label: '+ ₹ 1 Cr', val: 10000000 },
  { label: '+ ₹ 5 Cr', val: 50000000 }
];

export const EditDepartmentBudgetModal = ({ isOpen, onClose, task, onSave }) => {
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setAmount(task.actualBudget?.amount || '');
      setDetails(task.actualBudget?.details || task.purpose || '');
      setError('');
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (resubmitToGov = false) => {
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return setError('Please enter a valid requisition budget amount greater than ₹0.');
    }
    if (!details.trim()) {
      return setError('Please provide the purpose and required resources for this budget.');
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSave({
        amount: numAmount,
        details: details.trim(),
        resubmitToGov
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to update budget requisition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLakhsCr = (val) => {
    const n = Number(val) || 0;
    if (n >= 10000000) return `(₹ ${(n / 10000000).toFixed(2)} Crores)`;
    if (n >= 100000) return `(₹ ${(n / 100000).toFixed(2)} Lakhs)`;
    return '';
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">Edit Budget Requisition & Purpose</h2>
              <p className="text-[11px] font-mono text-emerald-400 font-bold">{task.challengeId || 'PRJ'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-1.5"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">{task.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{task.description || task.problemStatement}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700">Requested Budget Amount (₹ INR) *</label>
              {amount > 0 && <span className="text-xs font-bold text-[#007A61]">{formatLakhsCr(amount)}</span>}
            </div>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number" required min={1} value={amount}
                onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 10000000"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61]"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESETS.map((p, i) => (
                <button key={i} type="button" onClick={() => setAmount((Number(amount) || 0) + p.val)} className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 rounded-lg text-[11px] font-bold cursor-pointer transition-all">
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Purpose of Requisition & Required Resources *
            </label>
            <textarea
              rows={4} required value={details} onChange={(e) => setDetails(e.target.value)}
              placeholder="Specify the exact resources, machinery, materials, labor, testing rigs, and on-ground deployment overheads for this project..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:border-[#007A61] resize-none"
            />
            <p className="text-[10.5px] text-slate-400">
              Explain why these funds are needed and what resources will be procured or deployed.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button type="button" onClick={onClose} className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer">
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button" disabled={isSubmitting} onClick={() => handleSubmit(false)}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-slate-600" />}
              <span>Save Requisition</span>
            </button>
            <button
              type="button" disabled={isSubmitting} onClick={() => handleSubmit(true)}
              className="px-4 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Submit to Government</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentBudgetModal;

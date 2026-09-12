import React, { useState } from 'react';
import { X, Plus, MinusCircle, RotateCcw, Landmark, CheckCircle2, Loader2 } from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

const PRESETS = [
  { label: '+ ₹ 10L', value: 1000000 },
  { label: '+ ₹ 25L', value: 2500000 },
  { label: '+ ₹ 50L', value: 5000000 },
  { label: '+ ₹ 1 Cr', value: 10000000 }
];

export const AddStateGrantModal = ({ isOpen, onClose, onFundAdded }) => {
  const [mode, setMode] = useState('add'); // 'add' | 'deduct'
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('Jharkhand State Innovation Council R&D Allocation');
  const [scheme, setScheme] = useState('State Innovation & Problem Resolution Fund');
  const [departmentId, setDepartmentId] = useState('DEPT-JH-STATE');
  const [department, setDepartment] = useState('State Department');
  const [sanctionOrderNo, setSanctionOrderNo] = useState(`JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('Budgetary state allocation for university lab prototyping and civic problem resolution.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleResetToZero = async () => {
    if (!window.confirm('Are you sure you want to reset the State R&D Grant Pool to ₹0?')) return;
    setLoading(true);
    try {
      await apiClient.post('government/funds', { amount: 1, action: 'reset', departmentId, department, title: 'State Pool Reset to ₹0' });
      setSuccess(true);
      if (onFundAdded) onFundAdded();
      setTimeout(() => { setSuccess(false); onClose(); }, 700);
    } catch (e) { setError(e.message || 'Failed to reset pool'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return setError('Please enter a valid amount greater than ₹0.');

    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('government/funds', {
        action: mode,
        amount: numAmount,
        title: mode === 'deduct' ? `Deduction: ${title}` : title,
        scheme,
        departmentId,
        department,
        sanctionOrderNo,
        description
      });
      setSuccess(true);
      if (onFundAdded) onFundAdded(res?.data?.data);
      setTimeout(() => { setSuccess(false); onClose(); }, 1000);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to adjust state grant fund');
    } finally {
      setLoading(false);
    }
  };

  const formatCr = (val) => {
    const n = Number(val) || 0;
    if (n >= 10000000) return `(₹ ${(n / 10000000).toFixed(2)} Cr)`;
    if (n >= 100000) return `(₹ ${(n / 100000).toFixed(2)} Lakhs)`;
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300"><Landmark className="w-4 h-4" /></div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">Government of Jharkhand</span>
              <h2 className="text-sm font-extrabold text-white">{mode === 'add' ? 'Allocate State R&D Grant Fund' : 'Cancel / Deduct State Grant'}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto max-h-[75vh]">
          {error && <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">{error}</div>}
          {success && (
            <div className="p-2 bg-emerald-50 border border-emerald-300 text-[#007A61] text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#007A61]" />
              <span>State Department Grant Pool Adjusted Successfully!</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setMode('add'); setError(''); }}
              className={`py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${mode === 'add' ? 'bg-[#007A61] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Allocate Grant</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('deduct'); setError(''); }}
              className={`py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${mode === 'deduct' ? 'bg-rose-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <MinusCircle className="w-3.5 h-3.5" />
              <span>- Cancel / Deduct</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{mode === 'add' ? 'Grant Allocation Amount (₹ INR) *' : 'Amount to Deduct / Cancel (₹ INR) *'}</span>
              <div className="flex items-center gap-2">
                {amount > 0 && <span className="text-[#007A61]">{formatCr(amount)}</span>}
                <button type="button" onClick={handleResetToZero} disabled={loading} className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold rounded flex items-center gap-0.5 cursor-pointer">
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset State Pool to ₹0</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
              <input type="number" required min={1} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 2500000" className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 focus:bg-white focus:outline-none" />
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {PRESETS.map((p, i) => (
                <button key={i} type="button" onClick={() => setAmount((Number(amount) || 0) + p.value)} className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] rounded text-[11px] font-semibold transition cursor-pointer">
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Target State Department *</label>
            <select value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); setDepartment(e.target.selectedOptions[0]?.text || 'State Department'); }} className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white">
              <option value="DEPT-JH-STATE">State Department (Higher & Technical Education) — DEPT-JH-STATE</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Corpus Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Sanction Order No.</label>
              <input type="text" value={sanctionOrderNo} onChange={(e) => setSanctionOrderNo(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900" />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">{mode === 'add' ? 'Fund Purpose & Scope' : 'Deduction Reason'}</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 resize-none" />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
            <button
              type="submit"
              disabled={loading || success}
              className={`px-4 py-1.5 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm ${mode === 'add' ? 'bg-[#007A61] hover:bg-[#006650]' : 'bg-rose-700 hover:bg-rose-800'}`}
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{mode === 'add' ? 'Commit State Grant' : 'Confirm Deduction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStateGrantModal;

import React, { useState } from 'react';
import {
  X,
  Plus,
  Landmark,
  CheckCircle2,
  Loader2,
  Calendar,
  FileText,
  DollarSign,
  Building2,
  Sparkles
} from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

const PRESET_AMOUNTS = [
  { label: '+ ₹ 10 Lakhs', value: 1000000 },
  { label: '+ ₹ 25 Lakhs', value: 2500000 },
  { label: '+ ₹ 50 Lakhs', value: 5000000 },
  { label: '+ ₹ 1 Crore', value: 10000000 },
  { label: '+ ₹ 5 Crores', value: 50000000 }
];

export const AddStateGrantModal = ({ isOpen, onClose, onFundAdded }) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('Jharkhand State Innovation Council R&D Allocation');
  const [scheme, setScheme] = useState('State Innovation & Problem Resolution Fund');
  const [department, setDepartment] = useState('Department of Higher & Technical Education');
  const [sanctionOrderNo, setSanctionOrderNo] = useState(`JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('Budgetary state allocation for university lab prototyping and civic problem resolution.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePresetClick = (val) => {
    const current = Number(amount) || 0;
    setAmount(current + val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid grant allocation amount greater than ₹0.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('government/funds', {
        amount: numAmount,
        title,
        scheme,
        department,
        sanctionOrderNo,
        description
      });

      setSuccess(true);
      if (onFundAdded) onFundAdded(res?.data?.data);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to add state grant fund');
    } finally {
      setLoading(false);
    }
  };

  const formatLakhsCr = (val) => {
    const n = Number(val) || 0;
    if (n >= 10000000) return `(₹ ${(n / 10000000).toFixed(2)} Crores)`;
    if (n >= 100000) return `(₹ ${(n / 100000).toFixed(2)} Lakhs)`;
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-300">
                  Government of Jharkhand
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-white">
                Allocate State R&D Grant Fund
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-[#007A61] text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#007A61]" />
              <span>State Grant Fund Allocated Successfully!</span>
            </div>
          )}

          {/* Amount in INR */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Grant Allocation Amount (in ₹ INR) *
              </label>
              {amount > 0 && (
                <span className="text-xs font-bold text-[#007A61]">
                  {formatLakhsCr(amount)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                required
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000000 for 50 Lakhs"
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_AMOUNTS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(preset.value)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title / Scheme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Grant Corpus Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Sanction G.O. / Order No.
              </label>
              <input
                type="text"
                value={sanctionOrderNo}
                onChange={(e) => setSanctionOrderNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
              />
            </div>
          </div>

          {/* Department */}
          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Sanctioning State Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
            >
              <option value="Department of Higher & Technical Education">Department of Higher & Technical Education</option>
              <option value="Jharkhand State Innovation Council">Jharkhand State Innovation Council</option>
              <option value="Department of Planning & Development">Department of Planning & Development</option>
              <option value="Department of Rural Development">Department of Rural Development</option>
            </select>
          </div>

          {/* Description */}
          <div className="text-xs">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Fund Purpose & Scope
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || success}
              className="px-5 py-2.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Commit State Grant Fund</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStateGrantModal;

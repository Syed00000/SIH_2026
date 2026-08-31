import React, { useState, useEffect } from 'react';
import {
  X,
  Edit3,
  Landmark,
  CheckCircle2,
  Loader2,
  Calendar,
  FileText,
  DollarSign,
  Building2,
  Trash2
} from 'lucide-react';
import apiClient from '../../../../infrastructure/api/client.js';

const PRESET_AMOUNTS = [
  { label: '+ ₹ 10 Lakhs', value: 1000000 },
  { label: '+ ₹ 25 Lakhs', value: 2500000 },
  { label: '+ ₹ 50 Lakhs', value: 5000000 },
  { label: '+ ₹ 1 Crore', value: 10000000 },
  { label: '+ ₹ 5 Crores', value: 50000000 }
];

export const EditStateGrantModal = ({ isOpen, onClose, fund, onFundUpdated, onFundDeleted }) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [scheme, setScheme] = useState('');
  const [department, setDepartment] = useState('');
  const [sanctionOrderNo, setSanctionOrderNo] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (fund) {
      setAmount(fund.amount || '');
      setTitle(fund.title || 'Jharkhand State Innovation Council R&D Allocation');
      setScheme(fund.scheme || 'State Innovation & Problem Resolution Fund');
      setDepartment(fund.department || 'Department of Higher & Technical Education');
      setSanctionOrderNo(fund.sanctionOrderNo || '');
      setDescription(fund.description || '');
      setError('');
      setSuccess(false);
    }
  }, [fund]);

  if (!isOpen || !fund) return null;

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
      const fundKey = fund.fundId || fund._id;
      const res = await apiClient.put(`government/funds/${fundKey}`, {
        amount: numAmount,
        title,
        scheme,
        department,
        sanctionOrderNo,
        description
      });

      setSuccess(true);
      if (onFundUpdated) onFundUpdated(res?.data?.data);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update state grant fund');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete allocation "${fund.title}" of ₹ ${Number(fund.amount || 0).toLocaleString('en-IN')}?`)) {
      return;
    }
    setDeleting(true);
    setError('');
    try {
      const fundKey = fund.fundId || fund._id;
      await apiClient.delete(`government/funds/${fundKey}`);
      if (onFundDeleted) onFundDeleted(fundKey);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete state grant fund');
    } finally {
      setDeleting(false);
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
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-emerald-300">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-300">
                  Fund ID: {fund.fundId || 'GGF-001'}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-white">
                Edit State Grant Allocation
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
              <span>State Grant Allocation Updated Successfully!</span>
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
                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-black font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
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
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || loading}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
            >
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Delete Fund</span>
            </button>

            <div className="flex items-center space-x-2">
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
                className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStateGrantModal;

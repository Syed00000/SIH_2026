import React, { useState } from 'react';
import { X, Plus, Building2, Landmark, CheckCircle2, AlertCircle, Coins, FileText } from 'lucide-react';
import industryFundService from '../../services/industryFundService.js';

const CATEGORIES = [
  'Research Funding',
  'Prototype Funding',
  'Lab & Equipment',
  'Pilot Funding',
  'CSR Support'
];

export const AddIndustryFundModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Prototype Funding',
    amount: '',
    financialYear: '2026-2027',
    sanctionOrderNo: `ARL-GRANT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleQuickAmount = (lakhs) => {
    setFormData(prev => ({ ...prev, amount: (lakhs * 100000).toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const val = Number(formData.amount);
    if (!val || val <= 0) {
      setError('Please enter a valid grant allocation amount greater than ₹0.');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please specify a fund title.');
      return;
    }

    setLoading(true);
    try {
      await industryFundService.createFund({
        ...formData,
        amount: val,
        industryName: user?.organizationName || 'Ariba Research Labs'
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to allocate fund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">Capital Allocation</span>
              <h2 className="text-base font-black text-white">Allocate New Industry Fund</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center text-xs text-rose-700 font-semibold space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fund Pool Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Advanced Drone & Robotics Prototype Fund"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Funding Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none font-semibold text-slate-800"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Financial Year</label>
              <input
                type="text"
                value={formData.financialYear}
                onChange={(e) => setFormData(prev => ({ ...prev, financialYear: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Allocation Amount (₹) *</label>
              <span className="text-[11px] font-bold text-emerald-600">
                {formData.amount ? `₹ ${(Number(formData.amount) / 100000).toFixed(2)} Lakhs` : '₹ 0.00'}
              </span>
            </div>
            <input
              type="number"
              required
              min="1"
              step="any"
              placeholder="e.g. 2500000"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition-all"
            />
            {/* Quick shortcuts */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Quick Add:</span>
              {[10, 25, 50, 100].map((lakh) => (
                <button
                  key={lakh}
                  type="button"
                  onClick={() => handleQuickAmount(lakh)}
                  className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-md transition-all cursor-pointer"
                >
                  +{lakh >= 100 ? '1 Cr' : `${lakh}L`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Sanction / Approval Ref</label>
            <input
              type="text"
              value={formData.sanctionOrderNo}
              onChange={(e) => setFormData(prev => ({ ...prev, sanctionOrderNo: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Purpose</label>
            <textarea
              rows="2"
              placeholder="Describe what university projects or technologies this fund intends to support..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 outline-none resize-none"
            />
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
            <span className="font-bold">Notice:</span> Allocating this fund commits it into your corporate grant pool. Universities can request funding from this pool, and you can disburse grants directly to university projects.
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Commit & Allocate Fund</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIndustryFundModal;

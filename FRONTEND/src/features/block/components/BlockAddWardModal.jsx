import React, { useState } from 'react';
import { X, Landmark, AlertCircle, Plus, KeyRound } from 'lucide-react';
import { wardService } from '../../government/services/wardService.js';

export const BlockAddWardModal = ({ isOpen, onClose, onCreated, block }) => {
  const [formData, setFormData] = useState({
    wardNumber: '',
    name: '',
    councillorName: '',
    councillorEmail: '',
    councillorPhone: '',
    localities: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Ward Name is required.');
    if (!formData.wardNumber) return setError('Ward Number is required.');

    try {
      setLoading(true);
      setError('');
      const payload = {
        name: formData.name.trim(),
        wardNumber: Number(formData.wardNumber),
        district: block?.district || 'Ranchi',
        blockId: block?.blockId || '',
        blockName: block?.name || '',
        councillorName: formData.councillorName.trim(),
        councillorEmail: formData.councillorEmail.trim(),
        councillorPhone: formData.councillorPhone.trim(),
        localities: formData.localities.split(',').map((l) => l.trim()).filter(Boolean),
        password: formData.password.trim() || undefined
      };

      const res = await wardService.createWard(payload);
      const created = res?.data || res;
      if (onCreated) onCreated(created);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create ward');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Register New Ward</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Local Body: <span className="font-bold text-slate-800">{block?.name || 'Block Administration'}</span>
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Ward Number *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.wardNumber}
                onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                placeholder="e.g. 2"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Ward Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ward 02 - Morabadi"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Councillor / In-Charge Name</label>
              <input
                type="text"
                value={formData.councillorName}
                onChange={(e) => setFormData({ ...formData, councillorName: e.target.value })}
                placeholder="e.g. Smt. Sunita Verma"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.councillorPhone}
                onChange={(e) => setFormData({ ...formData, councillorPhone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Councillor / Portal Login Email</label>
            <input
              type="email"
              value={formData.councillorEmail}
              onChange={(e) => setFormData({ ...formData, councillorEmail: e.target.value })}
              placeholder="e.g. ward02.ranchi@jharkhand.gov.in"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Localities / Mohallas (comma separated)</label>
            <input
              type="text"
              value={formData.localities}
              onChange={(e) => setFormData({ ...formData, localities: e.target.value })}
              placeholder="e.g. Morabadi, Tagore Hill, Bariatu Basti"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Custom Password (Optional - defaults to Ward@&lt;No&gt;2026)
            </label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Leave blank to auto-generate secure password"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{loading ? 'Creating Ward...' : 'Create Ward & Generate ID'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockAddWardModal;

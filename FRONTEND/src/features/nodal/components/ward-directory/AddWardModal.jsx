import React, { useState } from 'react';
import { X, Landmark, AlertCircle, Save } from 'lucide-react';
import { wardService } from '../../../government/services/wardService.js';

export const AddWardModal = ({ isOpen, onClose, onWardCreated, defaultDistrict = 'Ranchi' }) => {
  const [formData, setFormData] = useState({
    wardNumber: '',
    name: '',
    district: defaultDistrict,
    councillorName: '',
    councillorEmail: '',
    councillorPhone: '',
    population: '',
    localities: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.wardNumber) return setError('Ward number is required.');
    if (!formData.name.trim()) return setError('Ward name is required.');

    try {
      setSubmitting(true);
      setError('');
      const payload = {
        ...formData,
        wardNumber: Number(formData.wardNumber),
        population: Number(formData.population) || 0,
        localities: formData.localities.split(',').map((l) => l.trim()).filter(Boolean)
      };
      const created = await wardService.createWard(payload);
      if (onWardCreated) onWardCreated(created);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create ward');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left max-h-[90vh] flex flex-col">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Register New Ward</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">{defaultDistrict} District Administration</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto custom-scrollbar flex-1">
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
                name="wardNumber"
                value={formData.wardNumber}
                onChange={handleChange}
                placeholder="e.g. 1"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                readOnly
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Ward Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ward 1 - Doranda Central"
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">In-charge / Councillor</label>
              <input
                type="text"
                name="councillorName"
                value={formData.councillorName}
                onChange={handleChange}
                placeholder="Councillor full name"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                name="councillorEmail"
                value={formData.councillorEmail}
                onChange={handleChange}
                placeholder="councillor@jharkhand.gov.in"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="councillorPhone"
                value={formData.councillorPhone}
                onChange={handleChange}
                placeholder="+91 94311 XXXXX"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Estimated Population</label>
              <input
                type="number"
                name="population"
                value={formData.population}
                onChange={handleChange}
                placeholder="e.g. 25000"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Localities / Mohallas (comma separated)</label>
            <input
              type="text"
              name="localities"
              value={formData.localities}
              onChange={handleChange}
              placeholder="Doranda Bazaar, Hinoo Chowk, North Enclave"
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Creating...' : 'Register Ward'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWardModal;

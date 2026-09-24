import React, { useState, useEffect } from 'react';
import { X, Landmark, AlertCircle, Save, Key, RefreshCw } from 'lucide-react';
import { wardService } from '../../../government/services/wardService.js';

export const EditWardModal = ({ isOpen, ward, onClose, onWardUpdated }) => {
  const [formData, setFormData] = useState({
    name: '', councillorName: '', councillorEmail: '', councillorPhone: '',
    population: '', localities: '', password: '', status: 'Active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ward) {
      const code = String(ward.wardNumber || '01').padStart(2, '0');
      setFormData({
        name: ward.name || '',
        councillorName: ward.councillorName || '',
        councillorEmail: ward.councillorEmail || ward.credentials?.loginEmail || '',
        councillorPhone: ward.councillorPhone || '',
        population: ward.population || '',
        localities: Array.isArray(ward.localities) ? ward.localities.join(', ') : (ward.localities || ''),
        password: ward.credentials?.password || `Ward@${code}2026`,
        status: ward.status || 'Active'
      });
      setError('');
    }
  }, [ward]);

  if (!isOpen || !ward) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateAutoPassword = () => {
    const code = String(ward.wardNumber || '01').padStart(2, '0');
    setFormData((prev) => ({ ...prev, password: `Ward@${code}2026` }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Ward name is required.');

    try {
      setSubmitting(true);
      setError('');
      const targetId = ward.wardId || ward.id || ward._id;
      const payload = {
        ...formData,
        population: Number(formData.population) || 0,
        localities: formData.localities.split(',').map((l) => l.trim()).filter(Boolean),
        password: formData.password.trim(),
        loginEmail: formData.councillorEmail.trim()
      };
      const updated = await wardService.updateWard(targetId, payload);
      if (onWardUpdated) onWardUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update ward');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left max-h-[90vh] flex flex-col">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Edit Ward Details</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">{ward.wardId} • Ward #{ward.wardNumber}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto custom-scrollbar flex-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Ward Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">In-charge / Councillor</label>
              <input type="text" name="councillorName" value={formData.councillorName} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone</label>
              <input type="text" name="councillorPhone" value={formData.councillorPhone} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Email</label>
              <input type="email" name="councillorEmail" value={formData.councillorEmail} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Population</label>
              <input type="number" name="population" value={formData.population} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Localities (comma separated)</label>
            <input type="text" name="localities" value={formData.localities} onChange={handleChange} className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">Ward Portal Password</label>
              <button type="button" onClick={generateAutoPassword} className="text-[10px] text-[#007A61] hover:underline font-bold flex items-center gap-1 cursor-pointer">
                <RefreshCw className="w-2.5 h-2.5" /> Auto-generate
              </button>
            </div>
            <div className="relative">
              <Key className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input type="text" name="password" value={formData.password} onChange={handleChange} placeholder="e.g. Ward@012026" className="w-full pl-8 pr-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#007A61] hover:bg-[#006651] text-white rounded-xl shadow-xs cursor-pointer disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWardModal;

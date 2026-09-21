import React, { useState, useEffect } from 'react';
import { X, Building2, Plus, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { blockService } from '../../../government/services/blockService.js';

export const EditBlockModal = ({ isOpen, onClose, block, onBlockUpdated }) => {
  const [form, setForm] = useState({
    name: '', district: 'Ranchi', bdoName: '', bdoEmail: '', bdoPhone: '',
    loginId: '', password: ''
  });
  const [panchayatInput, setPanchayatInput] = useState('');
  const [panchayats, setPanchayats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (block) {
      setForm({
        name: block.name || '',
        district: block.district || 'Ranchi',
        bdoName: block.bdoName || '',
        bdoEmail: block.bdoEmail || '',
        bdoPhone: block.bdoPhone || '',
        loginId: block.credentials?.loginId || block.credentials?.loginEmail || block.bdoEmail || '',
        password: block.credentials?.password || ''
      });
      setPanchayats(block.panchayats || []);
    }
  }, [block]);

  if (!isOpen || !block) return null;

  const handleAddPanchayat = (e) => {
    e.preventDefault();
    const clean = panchayatInput.trim();
    if (!clean) return;
    const parts = clean.split(',').map((p) => p.trim()).filter(Boolean);
    setPanchayats((prev) => [...new Set([...prev, ...parts])]);
    setPanchayatInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter a Block name.');
    try {
      setLoading(true);
      setError('');
      const targetId = block.blockId || block.id || block._id;
      const updated = await blockService.updateBlock(targetId, { ...form, panchayats });
      if (onBlockUpdated) onBlockUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update block');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-left">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-none">Edit Block Details</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Update {block.name} ({block.blockId})</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Block Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-[#007A61] focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">District</label>
              <input type="text" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 font-semibold focus:border-[#007A61] focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">BDO Officer</label>
              <input type="text" value={form.bdoName} onChange={(e) => setForm({ ...form, bdoName: e.target.value })} className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">BDO Email</label>
              <input type="email" value={form.bdoEmail} onChange={(e) => setForm({ ...form, bdoEmail: e.target.value })} className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">BDO Phone</label>
              <input type="text" value={form.bdoPhone} onChange={(e) => setForm({ ...form, bdoPhone: e.target.value })} className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50" />
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-emerald-900 uppercase block mb-1">Login ID / Official Email</label>
              <input type="text" value={form.loginId} onChange={(e) => setForm({ ...form, loginId: e.target.value })} className="w-full px-2 py-1 text-xs border border-emerald-200 rounded-xl bg-white font-mono" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-emerald-900 uppercase block mb-1">Portal Password</label>
              <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-2 py-1 text-xs border border-emerald-200 rounded-xl bg-white font-mono" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Add Gram Panchayats</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Panchayat name (comma-separated)" value={panchayatInput} onChange={(e) => setPanchayatInput(e.target.value)} className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:border-[#007A61] focus:outline-none" />
              <button type="button" onClick={handleAddPanchayat} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"><Plus className="w-3.5 h-3.5" /><span>Add</span></button>
            </div>
          </div>

          <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {panchayats.map((p) => (
              <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <MapPin className="w-2.5 h-2.5" /><span>{p}</span>
                <button type="button" onClick={() => setPanchayats((prev) => prev.filter((i) => i !== p))} className="text-emerald-700 hover:text-rose-600 ml-0.5 font-bold cursor-pointer">×</button>
              </span>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-1.5 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs">
              <CheckCircle className="w-3.5 h-3.5" /><span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlockModal;

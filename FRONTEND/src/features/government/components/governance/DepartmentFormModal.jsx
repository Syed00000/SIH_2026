import React, { useState, useEffect } from 'react';
import { X, Landmark, ShieldCheck, AlertCircle } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/adminConstants.js';

const CATEGORIES = ['State Ministry', 'District Department', 'Block / Tehsil Office', 'Gram Panchayat'];
const HEAD_ROLES = [
  'Gram Panchayat Head (Mukhiya)',
  'Panchayat Secretary',
  'Block Development Officer (BDO)',
  'District Nodal Officer',
  'District Collector (DC)',
  'Director',
  'Secretary / Principal Secretary',
  'Department Head'
];

export const DepartmentFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'District Department',
    headName: '',
    headRole: 'Department Head',
    headEmail: '',
    headPhone: '',
    district: 'Ranchi',
    block: '',
    panchayat: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        code: initialData.code || '',
        category: initialData.category || 'District Department',
        headName: initialData.headName || '',
        headRole: initialData.headRole || 'Department Head',
        headEmail: initialData.headEmail || '',
        headPhone: initialData.headPhone || '',
        district: initialData.district || 'Ranchi',
        block: initialData.block || '',
        panchayat: initialData.panchayat || '',
        description: initialData.description || '',
        status: initialData.status || 'Active'
      });
    } else {
      setForm({
        name: '',
        code: '',
        category: 'District Department',
        headName: '',
        headRole: 'Department Head',
        headEmail: '',
        headPhone: '',
        district: 'Ranchi',
        block: '',
        panchayat: '',
        description: '',
        status: 'Active'
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Please enter department name');
    const payload = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim() || form.name.split(' ').map((w) => w[0] || '').join('').toUpperCase()
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-[#007A61]" />
            <h3 className="text-sm font-extrabold text-slate-900">
              {initialData ? `Edit Department (${initialData.deptId || initialData.code})` : 'Add New Line Department / Gram Panchayat'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {error && <div className="p-2.5 bg-red-50 text-red-700 rounded-xl font-bold border border-red-200">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Department / Office Name *</label>
              <input
                type="text"
                placeholder="e.g. Gram Panchayat Ormanjhi Governance Cell"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#007A61] font-medium text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Code</label>
              <input
                type="text"
                placeholder="e.g. GPO-ORM"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#007A61] font-medium text-xs uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Administrative Category / Tier</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs outline-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Jurisdiction District</label>
              <select
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs outline-none"
              >
                {JHARKHAND_DISTRICTS_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Gram Panchayat / Block Details if applicable */}
          {form.category === 'Gram Panchayat' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Block / Tehsil</label>
                <input
                  type="text"
                  placeholder="e.g. Ormanjhi"
                  value={form.block}
                  onChange={(e) => setForm({ ...form, block: e.target.value })}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Gram Panchayat Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ormanjhi Gram Panchayat"
                  value={form.panchayat}
                  onChange={(e) => setForm({ ...form, panchayat: e.target.value })}
                  className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* Head Officer Details */}
          <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Department Head / Gram Panchayat Head (Mukhiya) Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Officer / Head Name</label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Mahato"
                  value={form.headName}
                  onChange={(e) => setForm({ ...form, headName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Designation / Role</label>
                <input
                  type="text"
                  list="roles-list"
                  placeholder="e.g. Gram Panchayat Head (Mukhiya)"
                  value={form.headRole}
                  onChange={(e) => setForm({ ...form, headRole: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <datalist id="roles-list">
                  {HEAD_ROLES.map((r) => <option key={r} value={r} />)}
                </datalist>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="mukhiya@jharkhand.gov.in"
                  value={form.headEmail}
                  onChange={(e) => setForm({ ...form, headEmail: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="9835123456"
                  value={form.headPhone}
                  onChange={(e) => setForm({ ...form, headPhone: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Description / Mandate</label>
            <textarea
              rows={2}
              placeholder="Brief summary of department responsibilities and civic jurisdiction..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-xs outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white rounded-xl font-bold transition-colors cursor-pointer text-xs shadow-xs"
            >
              {initialData ? 'Update Department' : 'Save Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentFormModal;

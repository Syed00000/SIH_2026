import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, KeyRound } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/governmentConstants.js';

export const DepartmentEditPanel = ({ department, onBack, onSave }) => {
  const isEditing = Boolean(department);

  const [formData, setFormData] = useState({
    name: '', code: '', category: 'District Department', district: 'Ranchi',
    block: '', panchayat: '', headName: '', headRole: 'District Officer',
    headEmail: '', headPhone: '', password: '', description: '', status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (department) {
      const digits = (department.deptId || department.code || '2026').replace(/\D/g, '') || '2026';
      setFormData({
        name: department.name || '',
        code: department.code || department.deptId || '',
        category: department.category || 'District Department',
        district: department.district || 'Ranchi',
        block: department.block || '',
        panchayat: department.panchayat || '',
        headName: department.headName || '',
        headRole: department.headRole || (department.category === 'Gram Panchayat' ? 'Mukhiya' : 'Head of Department'),
        headEmail: department.headEmail || '',
        headPhone: department.headPhone || '',
        password: department.credentials?.password || department.credentials?.generatedPassword || `Dept@JH${digits}!`,
        description: department.description || '',
        status: department.status || 'Active'
      });
    } else {
      setFormData((prev) => ({ ...prev, password: 'Dept@JH2026!' }));
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Department name is required';
    if (!formData.code.trim()) errs.code = 'Department code is required';
    if (!formData.headName.trim()) errs.headName = 'Head/Mukhiya name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGramPanchayat = formData.category === 'Gram Panchayat';

  return (
    <div className="space-y-4 select-none max-w-[1200px] mx-auto pb-10">
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer" title="Back"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">{isEditing ? `Edit: ${department?.name || 'Department'}` : 'Register New Department'}</h1>
            <p className="text-xs text-slate-500 font-medium">Configure credentials (ID & password), jurisdiction, and leadership</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer">Cancel</button>
          <button type="submit" form="department-edit-form" disabled={isSubmitting} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#007A61] hover:bg-[#00624e] text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50">
            <Save className="w-3.5 h-3.5" /><span>{isSubmitting ? 'Saving...' : 'Save Department'}</span>
          </button>
        </div>
      </div>

      <form id="department-edit-form" onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5 text-xs">
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Jurisdiction & Classification</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none">
                <option value="State Ministry">State Ministry</option>
                <option value="District Department">District Department</option>
                <option value="Gram Panchayat">Gram Panchayat</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">District *</label>
              <select name="district" value={formData.district} onChange={handleChange} className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none">
                {JHARKHAND_DISTRICTS_LIST.map((dist) => (<option key={dist} value={dist}>{dist}</option>))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Block / Mandal</label>
              <input type="text" name="block" placeholder="e.g. Kanke" value={formData.block} onChange={handleChange} className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Gram Panchayat</label>
              <input type="text" name="panchayat" placeholder="e.g. Boreya" value={formData.panchayat} onChange={handleChange} className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Department Identification</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department / Office Name *</label>
              <input type="text" name="name" placeholder="e.g. Gram Panchayat Boreya Desk" value={formData.name} onChange={handleChange} className={`w-full p-2 bg-slate-50 rounded-xl border focus:outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`} />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Code / Department ID *</label>
              <input type="text" name="code" placeholder="e.g. GP-RNC-01" value={formData.code} onChange={handleChange} className={`w-full p-2 bg-slate-50 rounded-xl border font-mono focus:outline-none ${errors.code ? 'border-red-500' : 'border-slate-200'}`} />
              {errors.code && <p className="text-[11px] text-red-500 mt-1">{errors.code}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{isGramPanchayat ? 'Mukhiya / Head Official' : 'Department Leadership'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Head Name *</label>
              <input type="text" name="headName" placeholder="e.g. Ramesh Mahto" value={formData.headName} onChange={handleChange} className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Designation</label>
              <input type="text" name="headRole" placeholder="e.g. Mukhiya" value={formData.headRole} onChange={handleChange} className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Email</label>
              <input type="email" name="headEmail" placeholder="gp@jharkhand.gov.in" value={formData.headEmail} onChange={handleChange} className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
              <input type="text" name="headPhone" placeholder="+91 9876543210" value={formData.headPhone} onChange={handleChange} className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Credentials Section (ID & Password) */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 bg-slate-50/50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Portal Access Key & Credentials (ID & Password)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Login Identity (ID / Email)</label>
              <input type="text" disabled value={formData.headEmail || `${(formData.code || 'dept').toLowerCase()}@jharkhand.gov.in`} className="w-full p-2 bg-slate-100 font-mono rounded-xl border border-slate-200 text-slate-500" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Access Password *</label>
              <input type="text" name="password" placeholder="e.g. Dept@JH2026!" value={formData.password} onChange={handleChange} className="w-full p-2 bg-white font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61]" />
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Mandate & Status</h2>
          <textarea name="description" rows={2} placeholder="Mandate and scope..." value={formData.description} onChange={handleChange} className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none" />
          <div className="flex items-center gap-4 pt-1">
            <span className="font-bold text-slate-700">Status:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="status" value="Active" checked={formData.status === 'Active'} onChange={handleChange} />
              <span className="text-emerald-700 font-bold">Active</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" name="status" value="Inactive" checked={formData.status === 'Inactive'} onChange={handleChange} />
              <span className="text-slate-600 font-medium">Inactive</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DepartmentEditPanel;

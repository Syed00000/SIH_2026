import React, { useState } from 'react';
import { X, Building2, ShieldCheck, Mail, Phone, Lock, AlertCircle, Plus } from 'lucide-react';
import departmentService from '../../government/services/departmentService.js';

export const AddBlockDepartmentModal = ({ block, isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [headName, setHeadName] = useState('');
  const [headEmail, setHeadEmail] = useState('');
  const [headPhone, setHeadPhone] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !headEmail.trim()) {
      setError('Please provide Department Name, Code, and Official Email.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const cleanEmail = headEmail.trim().toLowerCase();
      const payload = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        headName: headName.trim() || 'Department Officer',
        headRole: 'Block Officer',
        headEmail: cleanEmail,
        headPhone: headPhone.trim() || '0651-2450000',
        district: block?.district || 'Ranchi',
        block: block?.name || 'Kanke Block',
        category: 'Block / Tehsil Office',
        description: description.trim() || `${name.trim()} wing for ${block?.name || 'Kanke Block'}`,
        credentials: {
          loginId: cleanEmail,
          loginEmail: cleanEmail,
          password: password.trim(),
          generatedPassword: password.trim()
        }
      };

      const res = await departmentService.createDepartment(payload);
      const createdDept = res?.data?.data || res?.data || res;
      if (onCreated) onCreated(createdDept);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[92vh]">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#007A61]" />
            <h3 className="text-sm font-black text-slate-900">Add Block Department</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electricity & Power"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Dept Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. KNK-ELEC"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl uppercase font-mono text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">In-charge Officer</label>
              <input
                type="text"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                placeholder="Officer Name"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={headPhone}
                onChange={(e) => setHeadPhone(e.target.value)}
                placeholder="0651-XXXXXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#007A61] font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Department Portal Login Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Login Email / User ID *</label>
                <input
                  type="email"
                  required
                  value={headEmail}
                  onChange={(e) => setHeadEmail(e.target.value)}
                  placeholder="dept.kanke@jharkhand.gov.in"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Access Password *</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61]"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              Department officer can login via standard login portal using this email & password.
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Department Mandate / Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Responsibilities for gram panchayats..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#007A61] hover:bg-[#006651] disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{submitting ? 'Creating...' : 'Create Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlockDepartmentModal;

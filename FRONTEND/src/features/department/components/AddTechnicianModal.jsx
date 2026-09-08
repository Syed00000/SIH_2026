import React, { useState } from 'react';
import { X, Wrench, ShieldCheck, AlertCircle, Plus } from 'lucide-react';
import technicianService from '../../government/services/technicianService.js';

export const AddTechnicianModal = ({ department, isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Tech@JH2026!');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !specialization.trim() || !email.trim()) {
      setError('Please provide Technician Name, Trade/Specialization, and Login Email.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const cleanEmail = email.trim().toLowerCase();
      const payload = {
        name: name.trim(),
        departmentId: department?.deptId || department?.id || 'DEPT-01',
        departmentName: department?.name || 'Department Office',
        specialization: specialization.trim(),
        phone: phone.trim() || '9431100000',
        email: cleanEmail,
        district: department?.district || 'Ranchi',
        block: department?.block || '',
        notes: notes.trim(),
        credentials: {
          loginId: cleanEmail,
          loginEmail: cleanEmail,
          password: password.trim() || 'Tech@JH2026!',
          generatedPassword: password.trim() || 'Tech@JH2026!'
        },
        status: 'Active'
      };

      const res = await technicianService.createTechnician(payload);
      const created = res?.data?.data || res?.data || res;
      if (onCreated) onCreated(created);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to register technician');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[92vh]">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#007A61]" />
            <h3 className="text-sm font-black text-slate-900">Register Field Technician</h3>
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
              <label className="font-bold text-slate-700 block mb-1">Technician Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Mahto"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Trade / Specialization *</label>
              <input
                type="text"
                required
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g. Pump Mechanic / Lineman"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Contact Mobile Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9431100000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
            />
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#007A61] font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Technician Portal Login Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Login Email / User ID *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tech.ramesh@jharkhand.gov.in"
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
              Technician can log into field portal with these credentials to track ground repairs.
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Designation & Field Scope</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Assigned wards or gram panchayat jurisdiction..."
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
              <span>{submitting ? 'Registering...' : 'Register Technician'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTechnicianModal;

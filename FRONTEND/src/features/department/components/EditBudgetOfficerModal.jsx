import React, { useState, useEffect } from 'react';
import { X, Calculator, Save, AlertCircle } from 'lucide-react';
import { budgetOfficerService } from '../../government/services/budgetOfficerService.js';

export const EditBudgetOfficerModal = ({ officer, isOpen, onClose, onUpdated }) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Active');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (officer) {
      setName(officer.name || officer.fullName || '');
      setDesignation(officer.designation || '');
      setPhone(officer.phone || '');
      setPassword(officer.credentials?.password || officer.credentials?.generatedPassword || '');
      setStatus(officer.status || 'Active');
      setNotes(officer.notes || '');
    }
  }, [officer]);

  if (!isOpen || !officer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      const targetId = officer.officerId || officer.id || officer._id;
      const payload = {
        name: name.trim(),
        designation: designation.trim(),
        phone: phone.trim(),
        status,
        notes: notes.trim(),
        credentials: {
          ...officer.credentials,
          password: password.trim(),
          generatedPassword: password.trim()
        }
      };

      const res = await budgetOfficerService.updateOfficer(targetId, payload);
      const updated = res?.data?.data || res?.data || { ...officer, ...payload };
      if (onUpdated) onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update budget officer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#007A61]" />
            <h3 className="text-sm font-black text-slate-900">Edit Budget Officer — {officer.officerId || officer.id}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Officer Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Designation</label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold focus:outline-none focus:border-[#007A61] focus:bg-white"
              >
                <option value="Active">Active (Ready for Assignment)</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Portal Login Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#007A61] focus:bg-white"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Role Description & Scope</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              <Save className="w-3.5 h-3.5" />
              <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBudgetOfficerModal;

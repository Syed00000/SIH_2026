import React, { useState } from 'react';
import { X, Building2, ShieldCheck, AlertCircle, Plus } from 'lucide-react';
import departmentService from '../../government/services/departmentService.js';

export const AddDistrictModal = ({ isOpen, onClose, onCreated, isDistrictDept, isBlockDept }) => {
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [headName, setHeadName] = useState('');
  const [headEmail, setHeadEmail] = useState('');
  const [headPhone, setHeadPhone] = useState('');
  const [password, setPassword] = useState(isBlockDept ? 'Ward@JH2026!' : (isDistrictDept ? 'Block@JH2026!' : 'Dist@JH2026!'));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !district.trim() || !headEmail.trim()) {
      setError(`Please provide Department Name, ${isBlockDept ? 'Ward' : (isDistrictDept ? 'Block' : 'District')}, and Login Email.`);
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const cleanEmail = headEmail.trim().toLowerCase();
      
      let code;
      if (isBlockDept) {
        code = `WARD-${district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      } else if (isDistrictDept) {
        code = `BLK-${district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      } else {
        code = `DIST-${district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      }
      
      const payload = {
        name: name.trim(),
        code: code,
        category: isBlockDept ? 'Ward Commissioner' : (isDistrictDept ? 'Block / Tehsil Office' : 'District Department'),
        district: district.trim(),
        headName: headName.trim(),
        headEmail: cleanEmail,
        headPhone: headPhone.trim() || '9431100000',
        credentials: {
          loginId: cleanEmail,
          loginEmail: cleanEmail,
          password: password.trim() || (isBlockDept ? 'Ward@JH2026!' : (isDistrictDept ? 'Block@JH2026!' : 'Dist@JH2026!')),
          generatedPassword: password.trim() || (isBlockDept ? 'Ward@JH2026!' : (isDistrictDept ? 'Block@JH2026!' : 'Dist@JH2026!'))
        },
        status: 'Active'
      };

      const res = await departmentService.createDepartment(payload);
      const created = res?.data?.data || res?.data || res;
      if (onCreated) onCreated(created);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || `Failed to create ${isDistrictDept ? 'block' : 'district'} department`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col max-h-[92vh]">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0f4b3a]" />
            <h3 className="text-sm font-black text-slate-900">{isBlockDept ? 'Appoint Ward Commissioner' : (isDistrictDept ? 'Appoint Block / Tehsil Office' : 'Appoint District Department')}</h3>
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
                placeholder={isBlockDept ? "e.g. Ward 12 Commissioner" : "e.g. District Education Office"}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#0f4b3a] focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">{isBlockDept ? 'Ward *' : (isDistrictDept ? 'Block / Jurisdiction *' : 'District *')}</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder={isBlockDept ? "e.g. Ward 12" : (isDistrictDept ? "e.g. Kanke Block" : "e.g. Ranchi")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#0f4b3a] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nodal Officer Name</label>
              <input
                type="text"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                placeholder="e.g. Amit Kumar"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#0f4b3a] focus:bg-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Mobile Number</label>
              <input
                type="text"
                value={headPhone}
                onChange={(e) => setHeadPhone(e.target.value)}
                placeholder="9431100000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#0f4b3a] focus:bg-white"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-[#0f4b3a] font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Department Login Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Login Email / User ID *</label>
                <input
                  type="email"
                  required
                  value={headEmail}
                  onChange={(e) => setHeadEmail(e.target.value)}
                  placeholder="deo.ranchi@jharkhand.gov.in"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#0f4b3a]"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Access Password *</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs text-black font-semibold placeholder:text-slate-400 focus:outline-none focus:border-[#0f4b3a]"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              District Department can log into the universal dashboard with these credentials to track ground repairs.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#0f4b3a] hover:bg-[#0a3a2c] disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
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

export default AddDistrictModal;

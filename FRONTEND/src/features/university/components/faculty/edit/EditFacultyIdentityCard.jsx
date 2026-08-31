import React from 'react';
import { UserCheck, Mail, Phone, Building2, GraduationCap } from 'lucide-react';

export const EditFacultyIdentityCard = ({ formData, setFormData, initials }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 text-left">
      <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-black text-base flex items-center justify-center shrink-0">
          {initials}
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-slate-900">Identity & Institutional Contact</h3>
          <p className="text-xs text-slate-500 font-medium">Personal name, official designation, and contact details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Faculty Full Name <span className="text-rose-600 font-bold">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Academic Designation <span className="text-rose-600 font-bold">*</span>
          </label>
          <select
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="Professor & Head">Professor & Head</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Dean of R&D">Dean of R&D</option>
            <option value="Lead Research Scientist">Lead Research Scientist</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Department Affiliation <span className="text-rose-600 font-bold">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Institutional Email ID <span className="text-rose-600 font-bold">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Direct Contact Mobile
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98351 22334"
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>
    </div>
  );
};

export default EditFacultyIdentityCard;

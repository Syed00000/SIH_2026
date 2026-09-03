import React from 'react';
import { CitizenThemedSelect } from '../CitizenThemedSelect.jsx';

const SUBMITTER_ROLES = [
  'Citizen', 'Student / Youth', 'Farmer', 'Social Worker', 'NGO Representative',
  'Local Resident', 'Other'
];

export const SubmitterInfoSection = ({ formData, setFormData, handleChange }) => {
  return (
    <div className="space-y-4 pb-5 border-b border-slate-100">
      <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">
        3. Submitter Information
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Your Role <span className="text-rose-500">*</span></label>
          <CitizenThemedSelect
            value={formData.submitterRole}
            onChange={(val) => setFormData((prev) => ({ ...prev, submitterRole: val }))}
            options={SUBMITTER_ROLES}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Full Name <span className="text-rose-500">*</span></label>
          <input
            type="text"
            name="submitterName"
            value={formData.submitterName}
            onChange={handleChange}
            placeholder="e.g., Ramesh Kumar"
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Mobile Number <span className="text-rose-500">*</span></label>
          <input
            type="tel"
            name="submitterPhone"
            value={formData.submitterPhone}
            onChange={handleChange}
            placeholder="e.g., 9876543210"
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Email Address</label>
          <input
            type="email"
            name="submitterEmail"
            value={formData.submitterEmail}
            onChange={handleChange}
            placeholder="e.g., ramesh@example.com"
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

export default SubmitterInfoSection;

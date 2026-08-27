import React from 'react';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { INSTITUTION_TYPES, ACADEMIC_FOCUS_DOMAINS } from './registerConstants.js';

export const RegisterUniversityFields = ({
  formData,
  onChange,
  onCheckboxListChange
}) => {
  return (
    <div className="space-y-4 select-none">
      <Input
        label="Institution Name *"
        type="text"
        required
        value={formData.institutionName}
        onChange={(e) => onChange('institutionName', e.target.value)}
        placeholder="e.g. BIT Mesra"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="AISHE Code *"
          type="text"
          required
          value={formData.aisheCode}
          onChange={(e) => onChange('aisheCode', e.target.value)}
          placeholder="e.g. U-0205"
        />
        <Input
          label="Registration Number"
          type="text"
          value={formData.registrationNumber}
          onChange={(e) => onChange('registrationNumber', e.target.value)}
          placeholder="University Registration No"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Institution Type
          </label>
          <select
            value={formData.institutionType}
            onChange={(e) => onChange('institutionType', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900"
          >
            {INSTITUTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Nodal Officer Designation"
          type="text"
          value={formData.nodalOfficerDesignation}
          onChange={(e) => onChange('nodalOfficerDesignation', e.target.value)}
          placeholder="e.g. Dean R&D"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Academic Focus Domains (Choose all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ACADEMIC_FOCUS_DOMAINS.map((domain) => (
            <label
              key={domain}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.academicFocusDomains.includes(domain)}
                onChange={() => onCheckboxListChange('academicFocusDomains', domain)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>{domain}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterUniversityFields;

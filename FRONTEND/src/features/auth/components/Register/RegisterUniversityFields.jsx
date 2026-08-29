import React from 'react';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { INSTITUTION_TYPES, ACADEMIC_FOCUS_DOMAINS } from './registerConstants.js';
import { School, Award, Hash, Layers, UserCheck } from 'lucide-react';

export const RegisterUniversityFields = ({
  formData,
  onChange,
  onCheckboxListChange
}) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          University & Higher Education Profile
        </span>
        <span className="text-[11px] font-semibold text-slate-500">AISHE Verified</span>
      </div>

      <Input
        label="Institution Name *"
        type="text"
        required
        icon={School}
        value={formData.institutionName}
        onChange={(e) => onChange('institutionName', e.target.value)}
        placeholder="e.g. BIT Mesra / Ranchi University"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="AISHE Code *"
          type="text"
          required
          icon={Award}
          value={formData.aisheCode}
          onChange={(e) => onChange('aisheCode', e.target.value)}
          placeholder="e.g. U-0205 / C-12345"
        />
        <Input
          label="Registration / Affiliation Number"
          type="text"
          icon={Hash}
          value={formData.registrationNumber}
          onChange={(e) => onChange('registrationNumber', e.target.value)}
          placeholder="State Univ Reg No (Optional)"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Institution Type
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Layers className="w-4 h-4 stroke-[2]" />
            </div>
            <select
              value={formData.institutionType}
              onChange={(e) => onChange('institutionType', e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007A61]/15 focus:border-[#007A61] shadow-2xs cursor-pointer"
            >
              {INSTITUTION_TYPES.map((type) => (
                <option key={type.value} value={type.value} className="text-slate-900 font-semibold">
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Nodal Officer Designation"
          type="text"
          icon={UserCheck}
          value={formData.nodalOfficerDesignation}
          onChange={(e) => onChange('nodalOfficerDesignation', e.target.value)}
          placeholder="e.g. Dean R&D / Principal"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Academic Focus Domains (Choose all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ACADEMIC_FOCUS_DOMAINS.map((domain) => (
            <label
              key={domain}
              className={`flex items-center space-x-2.5 text-xs font-semibold p-2.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                formData.academicFocusDomains.includes(domain)
                  ? 'bg-[#007A61] text-white border-[#007A61]'
                  : 'bg-slate-50/80 text-slate-800 border-slate-300 hover:bg-slate-100 hover:border-[#007A61]'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.academicFocusDomains.includes(domain)}
                onChange={() => onCheckboxListChange('academicFocusDomains', domain)}
                className="w-4 h-4 rounded border-slate-300 text-[#007A61] focus:ring-[#007A61] cursor-pointer"
              />
              <span className="truncate">{domain}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterUniversityFields;

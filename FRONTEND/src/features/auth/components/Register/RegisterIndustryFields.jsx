import React from 'react';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { ENTITY_TYPES, CSR_SUPPORT_SECTORS } from './registerConstants.js';
import { Building2, Briefcase, UserCheck, FileText, Receipt, Award } from 'lucide-react';

export const RegisterIndustryFields = ({
  formData,
  onChange,
  onCheckboxListChange
}) => {
  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Industry & Corporate CSR Profile
        </span>
        <span className="text-[11px] font-semibold text-slate-500">Corporate Verified</span>
      </div>

      <Input
        label="Organization Name *"
        type="text"
        required
        icon={Building2}
        value={formData.organizationName}
        onChange={(e) => onChange('organizationName', e.target.value)}
        placeholder="Company / Enterprise / CSR Wing Name"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Entity Type
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Briefcase className="w-4 h-4 stroke-[2]" />
            </div>
            <select
              value={formData.entityType}
              onChange={(e) => onChange('entityType', e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007A61]/15 focus:border-[#007A61] shadow-2xs cursor-pointer"
            >
              {ENTITY_TYPES.map((type) => (
                <option key={type.value} value={type.value} className="text-slate-900 font-semibold">
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          label="Primary Contact Designation"
          type="text"
          icon={UserCheck}
          value={formData.primaryContactDesignation}
          onChange={(e) => onChange('primaryContactDesignation', e.target.value)}
          placeholder="e.g. Head of CSR / Director"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="CIN (Corporate ID)"
          type="text"
          icon={FileText}
          value={formData.cin}
          onChange={(e) => onChange('cin', e.target.value)}
          placeholder="U12345JH2020PTC..."
        />
        <Input
          label="GSTIN"
          type="text"
          icon={Receipt}
          value={formData.gstin}
          onChange={(e) => onChange('gstin', e.target.value)}
          placeholder="20AAAAA0000A1Z..."
        />
        <Input
          label="NGO Darpan ID"
          type="text"
          icon={Award}
          value={formData.ngoDarpanId}
          onChange={(e) => onChange('ngoDarpanId', e.target.value)}
          placeholder="JH/2021/000000"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          CSR Support Sectors (Choose all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CSR_SUPPORT_SECTORS.map((sector) => (
            <label
              key={sector}
              className={`flex items-center space-x-2.5 text-xs font-semibold p-2.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                formData.supportSectors.includes(sector)
                  ? 'bg-[#007A61] text-white border-[#007A61]'
                  : 'bg-slate-50/80 text-slate-800 border-slate-300 hover:bg-slate-100 hover:border-[#007A61]'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.supportSectors.includes(sector)}
                onChange={() => onCheckboxListChange('supportSectors', sector)}
                className="w-4 h-4 rounded border-slate-300 text-[#007A61] focus:ring-[#007A61] cursor-pointer"
              />
              <span className="truncate">{sector}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterIndustryFields;

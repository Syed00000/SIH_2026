import React from 'react';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { ENTITY_TYPES, CSR_SUPPORT_SECTORS } from './registerConstants.js';

export const RegisterIndustryFields = ({
  formData,
  onChange,
  onCheckboxListChange
}) => {
  return (
    <div className="space-y-4 select-none">
      <Input
        label="Organization Name *"
        type="text"
        required
        value={formData.organizationName}
        onChange={(e) => onChange('organizationName', e.target.value)}
        placeholder="Company or Corporate CSR Name"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Entity Type
          </label>
          <select
            value={formData.entityType}
            onChange={(e) => onChange('entityType', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900"
          >
            {ENTITY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Primary Contact Designation"
          type="text"
          value={formData.primaryContactDesignation}
          onChange={(e) => onChange('primaryContactDesignation', e.target.value)}
          placeholder="e.g. Head of CSR"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="CIN (Corporate ID)"
          type="text"
          value={formData.cin}
          onChange={(e) => onChange('cin', e.target.value)}
          placeholder="U12345JH2020PTC..."
        />
        <Input
          label="GSTIN"
          type="text"
          value={formData.gstin}
          onChange={(e) => onChange('gstin', e.target.value)}
          placeholder="20AAAAA0000A1Z..."
        />
        <Input
          label="NGO Darpan ID"
          type="text"
          value={formData.ngoDarpanId}
          onChange={(e) => onChange('ngoDarpanId', e.target.value)}
          placeholder="JH/2021/000000"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          CSR Support Sectors (Choose all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CSR_SUPPORT_SECTORS.map((sector) => (
            <label
              key={sector}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.supportSectors.includes(sector)}
                onChange={() => onCheckboxListChange('supportSectors', sector)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>{sector}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterIndustryFields;

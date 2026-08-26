import React from 'react';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { JHARKHAND_DISTRICTS } from './registerConstants.js';

export const RegisterCitizenFields = ({ formData, onChange }) => {
  return (
    <div className="space-y-4 select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* District */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            District *
          </label>
          <select
            value={formData.district}
            onChange={(e) => {
              onChange('district', e.target.value);
              onChange('blockOrULB', '');
            }}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900"
          >
            <option value="">Select District</option>
            {Object.keys(JHARKHAND_DISTRICTS).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Block / ULB */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Block / ULB *
          </label>
          <select
            value={formData.blockOrULB}
            disabled={!formData.district}
            onChange={(e) => onChange('blockOrULB', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900 disabled:opacity-50"
          >
            <option value="">Select Block</option>
            {formData.district &&
              JHARKHAND_DISTRICTS[formData.district].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Panchayat / Ward */}
      <Input
        label="Panchayat / Ward"
        type="text"
        value={formData.panchayatOrWard}
        onChange={(e) => onChange('panchayatOrWard', e.target.value)}
        placeholder="Enter Panchayat or Ward name"
      />

      {/* Preferred Language */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Preferred Language
        </label>
        <select
          value={formData.preferredLanguage}
          onChange={(e) => onChange('preferredLanguage', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md transition-all focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900"
        >
          <option value="HINDI">Hindi</option>
          <option value="ENGLISH">English</option>
          <option value="SANTHALI">Santhali</option>
        </select>
      </div>
    </div>
  );
};

export default RegisterCitizenFields;

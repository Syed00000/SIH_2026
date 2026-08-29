import React from 'react';
import { Input } from '../../../../shared/components/ui/input.jsx';
import { JHARKHAND_DISTRICTS } from './registerConstants.js';
import { MapPin, Building2, Home, Languages } from 'lucide-react';

export const RegisterCitizenFields = ({ formData, onChange }) => {
  const districtNames = Object.keys(JHARKHAND_DISTRICTS).sort();
  const currentDistrictBlocks = formData.district ? JHARKHAND_DISTRICTS[formData.district] || [] : [];

  const selectStyle = 'w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-white border border-slate-300 hover:border-[#007A61] rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007A61]/20 focus:border-[#007A61] shadow-2xs cursor-pointer';

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Citizen Profile &amp; Location Details
        </span>
        <span className="text-[11px] font-semibold text-slate-500">Jharkhand Jurisdiction</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* District */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            District <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <MapPin className="w-4 h-4 stroke-[2]" />
            </div>
            <select
              value={formData.district}
              onChange={(e) => {
                onChange('district', e.target.value);
                onChange('blockOrULB', '');
              }}
              className={selectStyle}
            >
              <option value="">— Select District —</option>
              {districtNames.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {formData.district && (
            <p className="text-[10.5px] text-[#007A61] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007A61] inline-block" />
              {currentDistrictBlocks.length} blocks available in {formData.district}
            </p>
          )}
        </div>

        {/* Block / ULB */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className={`text-xs font-bold uppercase tracking-wider ${formData.district ? 'text-slate-700' : 'text-slate-400'}`}>
            Block / ULB <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${formData.district ? 'text-slate-500' : 'text-slate-300'}`}>
              <Building2 className="w-4 h-4 stroke-[2]" />
            </div>
            <select
              value={formData.blockOrULB}
              disabled={!formData.district}
              onChange={(e) => onChange('blockOrULB', e.target.value)}
              className={
                !formData.district
                  ? 'w-full pl-10 pr-3.5 py-2.5 text-sm font-semibold rounded-lg border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60 shadow-2xs'
                  : `${selectStyle}`
              }
            >
              <option value="">
                {formData.district ? `— Select Block / ULB in ${formData.district} —` : '— First select a District —'}
              </option>
              {currentDistrictBlocks.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          {!formData.district && (
            <p className="text-[10.5px] text-slate-400 font-medium">Select a district first to load blocks</p>
          )}
          {formData.blockOrULB && (
            <p className="text-[10.5px] text-[#007A61] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007A61] inline-block" />
              Selected: {formData.blockOrULB}
            </p>
          )}
        </div>
      </div>

      {/* Panchayat / Ward */}
      <Input
        label="Panchayat / Ward"
        type="text"
        icon={Home}
        value={formData.panchayatOrWard}
        onChange={(e) => onChange('panchayatOrWard', e.target.value)}
        placeholder="Enter Panchayat or Ward name (Optional)"
      />

      {/* Preferred Language */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Preferred Language
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Languages className="w-4 h-4 stroke-[2]" />
          </div>
          <select
            value={formData.preferredLanguage}
            onChange={(e) => onChange('preferredLanguage', e.target.value)}
            className={selectStyle}
          >
            <option value="HINDI">Hindi (हिन्दी)</option>
            <option value="ENGLISH">English</option>
            <option value="SANTHALI">Santhali (ᱥᱟᱱᱛᱟᱲᱤ)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RegisterCitizenFields;

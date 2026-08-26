import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../data/mockGovernmentData.js';

export const SUPPORT_MODES_LIST = [
  'Funding',
  'Mentorship',
  'Prototyping',
  'Tech Transfer',
  'Research',
  'Incubation',
  'CSR Support',
  'Skill Development'
];

export const AddIndustryAddressFields = ({
  formData,
  onChange,
  onToggleSupportMode,
  errors = {}
}) => {
  return (
    <div className="space-y-3.5 select-none">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1.5">
        3. Operating Address in Jharkhand
      </h4>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => onChange('addressLine1', e.target.value)}
          placeholder="Plot/Building, Industrial Area"
          className={`w-full bg-slate-50/60 border ${
            errors.addressLine1 ? 'border-red-500' : 'border-slate-200'
          } rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
        {errors.addressLine1 && (
          <p className="text-[11px] text-red-500 mt-0.5">{errors.addressLine1}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            District <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.district}
              onChange={(e) => onChange('district', e.target.value)}
              className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {JHARKHAND_DISTRICTS_LIST.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pincode <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => onChange('pincode', e.target.value)}
            placeholder="834001"
            className={`w-full bg-slate-50/60 border ${
              errors.pincode ? 'border-red-500' : 'border-slate-200'
            } rounded-md px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500`}
          />
          {errors.pincode && <p className="text-[11px] text-red-500 mt-0.5">{errors.pincode}</p>}
        </div>
      </div>

      {/* Support Modes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Available Support Modes <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SUPPORT_MODES_LIST.map((mode) => {
            const isSelected = formData.supportModes?.includes(mode);
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onToggleSupportMode(mode)}
                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors text-left cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <span>{mode}</span>
              </button>
            );
          })}
        </div>
        {errors.supportModes && (
          <p className="text-[11px] text-red-500 mt-0.5">{errors.supportModes}</p>
        )}
      </div>
    </div>
  );
};

export default AddIndustryAddressFields;

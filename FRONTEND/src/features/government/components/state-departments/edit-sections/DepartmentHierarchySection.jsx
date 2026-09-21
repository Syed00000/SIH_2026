import React from 'react';
import { Network } from 'lucide-react';
import { JHARKHAND_DISTRICTS_LIST } from '../../../data/governmentConstants.js';

const HIERARCHY_LEVELS = [
  'State Department',
  'District Department',
  'Division / Zone',
  'Sub-Division',
  'Block / Tehsil Office',
  'Municipality',
  'Municipal Corporation',
  'Gram Panchayat',
  'Ward / Field Office'
];

export const DepartmentHierarchySection = ({
  formData,
  handleChange,
  handleDistrictCoverageToggle,
  handleHierarchyToggle
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Network className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">2. Administrative Hierarchy & Jurisdiction</h3>
        </div>
      </div>
      
      <div className="p-5 space-y-5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            District Coverage
          </label>
          <select
            name="operationalDistrictsType"
            value={formData.operationalDistrictsType}
            onChange={handleChange}
            className="w-full md:w-1/2 px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium mb-3"
          >
            <option value="All Districts">All Districts (Entire State)</option>
            <option value="Selected Districts">Selected Districts Only</option>
          </select>

          {formData.operationalDistrictsType === 'Selected Districts' && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {JHARKHAND_DISTRICTS_LIST.map((dist) => (
                  <label key={dist} className="flex items-center space-x-2 cursor-pointer p-1.5 hover:bg-slate-100 rounded">
                    <input
                      type="checkbox"
                      checked={formData.districtCoverage.includes(dist)}
                      onChange={() => handleDistrictCoverageToggle(dist)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-[11px] font-medium text-slate-700">{dist}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-2">
            Configurable Department Hierarchy (Select Applicable Lower Levels)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {HIERARCHY_LEVELS.map((level) => (
              <label
                key={level}
                className={`flex items-start space-x-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  formData.hierarchyConfig.includes(level)
                    ? 'border-[#007A61] bg-[#007A61]/5'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  disabled={level === 'State Department'}
                  checked={formData.hierarchyConfig.includes(level)}
                  onChange={() => handleHierarchyToggle(level)}
                  className="mt-0.5 rounded border-slate-300 text-[#007A61] focus:ring-[#007A61]"
                />
                <span className={`text-[11px] font-bold ${formData.hierarchyConfig.includes(level) ? 'text-[#007A61]' : 'text-slate-600'}`}>
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

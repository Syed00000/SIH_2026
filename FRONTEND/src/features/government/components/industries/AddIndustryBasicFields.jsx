import React from 'react';
import { ChevronDown } from 'lucide-react';

export const INDUSTRY_CATEGORIES = [
  'Private Industry',
  'MSME',
  'Govt Dept',
  'Research Lab',
  'Startup',
  'CSR',
  'PSU',
  'Industry Association',
  'Other'
];

export const THEMATIC_DOMAINS = [
  'Agriculture, Livelihoods',
  'Agriculture, Agri-tech',
  'AI / ML, Education',
  'AI / ML, IoT',
  'Healthcare, MedTech',
  'Healthcare, Mental Health',
  'Water Management',
  'Rural Livelihoods',
  'Education, Skill Dev.',
  'Innovation Ecosystem',
  'Clean Energy, Environment',
  'Infrastructure, Smart Cities',
  'Mining, Heavy Industry'
];

export const AddIndustryBasicFields = ({ formData, onChange, errors = {} }) => {
  return (
    <div className="space-y-3.5 select-none">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1.5">
        1. Organization Details
      </h4>

      {/* Category Dropdown */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Industry Category <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value)}
            className={`w-full bg-slate-50/60 border ${
              errors.category ? 'border-red-500' : 'border-slate-200'
            } rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 appearance-none cursor-pointer`}
          >
            <option value="">Select Category</option>
            {INDUSTRY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.category && <p className="text-[11px] text-red-500 mt-0.5">{errors.category}</p>}
      </div>

      {/* Legal Entity Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Legal Entity Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.legalName}
          onChange={(e) => onChange('legalName', e.target.value)}
          placeholder="e.g., Tata Steel Foundation"
          className={`w-full bg-slate-50/60 border ${
            errors.legalName ? 'border-red-500' : 'border-slate-200'
          } rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900`}
        />
        {errors.legalName && <p className="text-[11px] text-red-500 mt-0.5">{errors.legalName}</p>}
      </div>

      {/* Short Name & Reg Number */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Short Name / Brand</label>
          <input
            type="text"
            value={formData.shortName}
            onChange={(e) => onChange('shortName', e.target.value)}
            placeholder="e.g., TSF"
            className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            CIN / Reg Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => onChange('registrationNumber', e.target.value)}
            placeholder="e.g., U12345JH2020PTC..."
            className={`w-full bg-slate-50/60 border ${
              errors.registrationNumber ? 'border-red-500' : 'border-slate-200'
            } rounded-md px-3 py-2 text-xs font-mono font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900`}
          />
          {errors.registrationNumber && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.registrationNumber}</p>
          )}
        </div>
      </div>

      {/* Thematic Domain & Website */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Thematic Focus <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.thematicDomain}
              onChange={(e) => onChange('thematicDomain', e.target.value)}
              className={`w-full bg-slate-50/60 border ${
                errors.thematicDomain ? 'border-red-500' : 'border-slate-200'
              } rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 appearance-none cursor-pointer`}
            >
              <option value="">Select Domain</option>
              {THEMATIC_DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.thematicDomain && (
            <p className="text-[11px] text-red-500 mt-0.5">{errors.thematicDomain}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => onChange('website', e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-slate-50/60 border border-slate-200 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>
    </div>
  );
};

export default AddIndustryBasicFields;

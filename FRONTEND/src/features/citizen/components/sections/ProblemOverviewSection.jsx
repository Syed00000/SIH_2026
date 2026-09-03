import React from 'react';
import { Users } from 'lucide-react';
import { CitizenThemedSelect } from '../CitizenThemedSelect.jsx';

const DOMAINS = [
  'Education', 'Healthcare', 'Agriculture', 'Water Resources', 'Environment',
  'Energy', 'Urban Development', 'Accessibility', 'Public Administration',
  'Rural Livelihoods', 'Other'
];

const AFFECTED_POPULATION_OPTIONS = [
  'Less than 100 people (< 100)',
  '100 - 500 people (Street / Neighborhood)',
  '500 - 2,000 people (Village / Ward)',
  '2,000 - 10,000 people (Panchayat / Community)',
  '10,000 - 50,000 people (Block / Town)',
  '50,000+ people (Large Region / Widespread)'
];

export const ProblemOverviewSection = ({
  formData,
  setFormData,
  handleChange,
  customDomain,
  setCustomDomain,
  isCustomMode,
  setIsCustomMode
}) => {
  return (
    <div className="space-y-4 pb-5 border-b border-slate-100">
      <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">1. Problem Overview</span>
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">Problem Title / Heading <span className="text-rose-500">*</span></label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Poor Drainage and Waterlogging in Community Roads"
          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-800">Challenge Area / Domain <span className="text-rose-500">*</span></label>
            <button
              type="button"
              onClick={() => {
                const next = !isCustomMode;
                setIsCustomMode(next);
                setFormData((prev) => ({ ...prev, domain: next ? 'Other' : 'Urban Development' }));
              }}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
            >
              {isCustomMode ? '← Standard' : '+ Custom'}
            </button>
          </div>
          {isCustomMode ? (
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="Type custom domain..."
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-emerald-500 text-slate-900 focus:outline-none shadow-2xs"
              required
              autoFocus
            />
          ) : (
            <CitizenThemedSelect
              value={formData.domain}
              onChange={(val) => {
                if (val === 'Other') {
                  setIsCustomMode(true);
                  setFormData((prev) => ({ ...prev, domain: 'Other' }));
                } else {
                  setFormData((prev) => ({ ...prev, domain: val }));
                }
              }}
              options={DOMAINS.map((dom) => (dom === 'Other' ? { value: 'Other', label: '+ Other / Custom Domain' } : dom))}
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Severity / Priority</label>
          <CitizenThemedSelect
            value={formData.priority}
            onChange={(val) => setFormData((prev) => ({ ...prev, priority: val }))}
            options={['Low', 'Medium', 'High', 'Critical']}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-700 inline" />
            <span>Estimated People Affected <span className="text-rose-500">*</span></span>
          </span>
          <span className="text-[10.5px] font-medium text-slate-400">Scale of impact</span>
        </label>
        <CitizenThemedSelect
          value={formData.affectedPopulation || '500 - 2,000 people (Village / Ward)'}
          onChange={(val) => setFormData((prev) => ({ ...prev, affectedPopulation: val }))}
          options={AFFECTED_POPULATION_OPTIONS}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5">Detailed Problem Statement <span className="text-rose-500">*</span></label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue in detail..."
          className="w-full text-xs font-normal p-3 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
          required
          minLength={5}
        />
      </div>
    </div>
  );
};

export default ProblemOverviewSection;

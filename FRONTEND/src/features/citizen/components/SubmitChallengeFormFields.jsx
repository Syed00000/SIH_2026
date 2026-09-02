import React, { useState, useRef } from 'react';
import { MapPin, User, Loader2, ShieldCheck, Users, AlertCircle, X } from 'lucide-react';
import { CitizenThemedSelect } from './CitizenThemedSelect.jsx';

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Dhanbad', 'Bokaro', 'East Singhbhum', 'West Singhbhum', 'Palamu',
  'Hazaribagh', 'Deoghar', 'Dumka', 'Giridih', 'Ramgarh', 'Khunti', 'Gumla',
  'Simdega', 'Lohardaga', 'Latehar', 'Garhwa', 'Chatra', 'Koderma', 'Jamtara',
  'Godda', 'Pakur', 'Sahibganj', 'Seraikela Kharsawan'
];

const DOMAINS = [
  'Education', 'Healthcare', 'Agriculture', 'Water Resources', 'Environment',
  'Energy', 'Urban Development', 'Accessibility', 'Public Administration',
  'Rural Livelihoods', 'Other'
];

const SUBMITTER_ROLES = [
  'Citizen', 'Student / Youth', 'Farmer', 'Social Worker', 'NGO Representative',
  'Local Resident', 'Other'
];

const AFFECTED_POPULATION_OPTIONS = [
  'Less than 100 people (< 100)',
  '100 - 500 people (Street / Neighborhood)',
  '500 - 2,000 people (Village / Ward)',
  '2,000 - 10,000 people (Panchayat / Community)',
  '10,000 - 50,000 people (Block / Town)',
  '50,000+ people (Large Region / Widespread)'
];

export const SubmitChallengeFormFields = ({
  formData,
  setFormData,
  handleChange,
  handlePresetPhoto,
  customDomain,
  setCustomDomain,
  isCustomMode,
  setIsCustomMode,
  loading,
  onClose,
  error
}) => {
  return (
    <>
      {/* 1. Problem Overview */}
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
                {isCustomMode ? '← Choose Standard' : '+ Add Custom Domain'}
              </button>
            </div>
            {isCustomMode ? (
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="Type custom domain (e.g., Solar Energy...)"
                className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-emerald-500 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-2xs"
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
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Detailed Problem Statement (Paragraph) <span className="text-rose-500">*</span></label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail: what is happening, where exactly is the problem, how long has it persisted, and how it impacts people..."
            className="w-full text-xs font-normal p-3 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            required
            minLength={5}
          />
        </div>
      </div>

      {/* 2. Location Details */}
      <div className="space-y-4 pb-5 border-b border-slate-100">
        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">2. Location Details</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">District <span className="text-rose-500">*</span></label>
            <CitizenThemedSelect
              value={formData.district}
              onChange={(val) => setFormData((prev) => ({ ...prev, district: val }))}
              options={JHARKHAND_DISTRICTS}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Block / Tehsil</label>
            <input
              type="text"
              name="block"
              value={formData.block}
              onChange={handleChange}
              placeholder="e.g., Kanke / Namkum / Sadar"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Panchayat / Ward / Colony</label>
            <input
              type="text"
              name="panchayatOrWard"
              value={formData.panchayatOrWard}
              onChange={handleChange}
              placeholder="e.g., Ward No. 12 / Mesra Panchayat"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g., 834001"
              maxLength={6}
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">Landmark / Specific Spot</label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            placeholder="e.g., Near Primary Health Centre / Main Chowk"
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
          />
        </div>
      </div>

      {/* 3. Submitter Information */}
      <div className="space-y-4 pb-5 border-b border-slate-100">
        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider block">3. Submitter Information (Who Are You?)</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Your Role / Designation <span className="text-rose-500">*</span></label>
            <CitizenThemedSelect
              value={formData.submitterRole}
              onChange={(val) => setFormData((prev) => ({ ...prev, submitterRole: val }))}
              options={SUBMITTER_ROLES}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Full Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              name="submitterName"
              value={formData.submitterName}
              onChange={handleChange}
              placeholder="e.g., Ramesh Kumar"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Mobile Number</label>
            <input
              type="tel"
              name="submitterPhone"
              value={formData.submitterPhone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Email Address</label>
            <input
              type="email"
              name="submitterEmail"
              value={formData.submitterEmail}
              onChange={handleChange}
              placeholder="name@domain.com"
              className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Bottom Error Notification if present */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2 shadow-2xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="pt-4 flex items-center justify-end space-x-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="py-2.5 px-6 rounded-xl bg-white text-slate-900 border-2 border-slate-200 hover:bg-[#064e3b] hover:border-[#064e3b] hover:text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70 active:scale-95 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting to Portal...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Problem Statement</span>
            </>
          )}
        </button>
      </div>

    </>
  );
};

export default SubmitChallengeFormFields;

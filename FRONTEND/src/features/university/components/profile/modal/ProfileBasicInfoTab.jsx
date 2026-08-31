import React from 'react';
import { JHARKHAND_DISTRICTS_LIST } from '../../../../government/data/jharkhandDistrictsMeta.js';

export const ProfileBasicInfoTab = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">University Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Short Name / Code</label>
          <input
            type="text"
            value={formData.shortName}
            onChange={(e) => handleInputChange('shortName', e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Type</label>
          <select
            value={formData.universityType}
            onChange={(e) => handleInputChange('universityType', e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="State University">State University</option>
            <option value="Central University">Central University</option>
            <option value="Deemed University">Deemed University</option>
            <option value="Private University">Private University</option>
            <option value="Institute of National Importance">Institute of National Importance</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Est. Year</label>
          <input
            type="number"
            value={formData.establishmentYear}
            onChange={(e) => handleInputChange('establishmentYear', e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Accreditation</label>
          <input
            type="text"
            value={formData.accreditationGrade}
            onChange={(e) => handleInputChange('accreditationGrade', e.target.value)}
            placeholder="e.g. NAAC A+"
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Tagline</label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => handleInputChange('tagline', e.target.value)}
          className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">About Institution</label>
        <textarea
          rows={3}
          value={formData.about}
          onChange={(e) => handleInputChange('about', e.target.value)}
          className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900 leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Official Website</label>
          <input
            type="text"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Contact Phone</label>
          <input
            type="text"
            value={formData.universityPhone}
            onChange={(e) => handleInputChange('universityPhone', e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Campus Address</label>
          <input
            type="text"
            value={formData.campusAddress}
            onChange={(e) => handleInputChange('campusAddress', e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">District</label>
          <select
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            {JHARKHAND_DISTRICTS_LIST.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProfileBasicInfoTab;

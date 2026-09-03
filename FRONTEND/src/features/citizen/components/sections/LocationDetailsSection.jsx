import React from 'react';
import { CitizenThemedSelect } from '../CitizenThemedSelect.jsx';

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Dhanbad', 'Bokaro', 'East Singhbhum', 'West Singhbhum', 'Palamu',
  'Hazaribagh', 'Deoghar', 'Dumka', 'Giridih', 'Ramgarh', 'Khunti', 'Gumla',
  'Simdega', 'Lohardaga', 'Latehar', 'Garhwa', 'Chatra', 'Koderma', 'Jamtara',
  'Godda', 'Pakur', 'Sahibganj', 'Seraikela Kharsawan'
];

export const LocationDetailsSection = ({ formData, setFormData, handleChange }) => {
  return (
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
            placeholder="e.g., Kanke / Namkum"
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
            placeholder="e.g., Ward No. 12"
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
          placeholder="e.g., Near Primary Health Centre"
          className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
        />
      </div>
    </div>
  );
};

export default LocationDetailsSection;

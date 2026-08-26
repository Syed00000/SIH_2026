import React from 'react';
import { Building2 } from 'lucide-react';

export const EditUniversityBasicSection = ({
  formData,
  onInputChange,
  districtOptions = []
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3.5 select-none">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
        <Building2 className="w-3.5 h-3.5 text-blue-600" />
        <span>1. Basic Institutional Information</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">University Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Short Name</label>
          <input
            type="text"
            value={formData.shortName}
            onChange={(e) => onInputChange('shortName', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">University Code *</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => onInputChange('code', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">University Type</label>
          <select
            value={formData.universityType}
            onChange={(e) => onInputChange('universityType', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="Central University">Central University</option>
            <option value="State University">State University</option>
            <option value="Private University">Private University</option>
            <option value="Deemed">Deemed University</option>
            <option value="Autonomous">Autonomous Institute</option>
            <option value="Institute of National Importance">Institute of National Importance</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">District *</label>
          <select
            value={formData.district}
            onChange={(e) => onInputChange('district', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            {districtOptions.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Status</label>
          <select
            value={formData.status}
            onChange={(e) => onInputChange('status', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Review</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Establishment Year</label>
          <input
            type="number"
            value={formData.establishmentYear}
            onChange={(e) => onInputChange('establishmentYear', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Official Website URL</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

export default EditUniversityBasicSection;

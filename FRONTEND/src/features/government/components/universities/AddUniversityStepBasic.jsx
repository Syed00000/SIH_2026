import React from 'react';
import { Building2 } from 'lucide-react';

export const AddUniversityStepBasic = ({
  formData,
  onInputChange,
  districtOptions = []
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-4 select-none">
      <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
        <Building2 className="w-4 h-4 text-blue-600" />
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 1: Institutional Identification</h2>
          <p className="text-[10px] text-slate-400 font-medium">Provide official university recognition details and jurisdiction.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        {/* University Name */}
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
            University / Institution Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="e.g. Central University of Jharkhand"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
            autoFocus
          />
        </div>

        {/* Short Name */}
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Short Name / Acronym</label>
          <input
            type="text"
            value={formData.shortName}
            onChange={(e) => onInputChange('shortName', e.target.value)}
            placeholder="e.g. CUJ"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        {/* University Code */}
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
            University Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => onInputChange('code', e.target.value)}
            placeholder="e.g. CUJ-2026"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        {/* University Type */}
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
            University Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.universityType}
            onChange={(e) => onInputChange('universityType', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-2xs"
          >
            <option value="Central University">Central University</option>
            <option value="State University">State University</option>
            <option value="Private University">Private University</option>
            <option value="Deemed">Deemed University</option>
            <option value="Autonomous">Autonomous Institute</option>
            <option value="Institute of National Importance">Institute of National Importance</option>
          </select>
        </div>

        {/* Institution Category */}
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.institutionCategory}
            onChange={(e) => onInputChange('institutionCategory', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-2xs"
          >
            <option value="University">University</option>
            <option value="Institute of National Importance">Institute of National Importance</option>
            <option value="Engineering College">Engineering College</option>
            <option value="Medical College">Medical College</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">
            District Jurisdiction <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.district}
            onChange={(e) => onInputChange('district', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-2xs"
          >
            {districtOptions.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Establishment Year */}
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Establishment Year</label>
          <input
            type="number"
            value={formData.establishmentYear}
            onChange={(e) => onInputChange('establishmentYear', e.target.value)}
            placeholder="2012"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>

        {/* Official Website */}
        <div>
          <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Official Website URL</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder="https://www.university.ac.in"
            className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

export default AddUniversityStepBasic;

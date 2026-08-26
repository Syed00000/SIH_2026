import React from 'react';
import { GraduationCap } from 'lucide-react';

export const AddUniversityStepCapacity = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-4 select-none">
      <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
        <GraduationCap className="w-4 h-4 text-blue-600" />
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 5: Institutional Capacity & Resources</h2>
          <p className="text-[10px] text-slate-400 font-medium">Provide faculty strength, laboratory facilities, and current capacity.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-3 text-center">
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Departments</label>
          <input
            type="number"
            value={formData.departments}
            onChange={(e) => onInputChange('departments', e.target.value)}
            className="w-20 mx-auto text-center font-bold text-base text-slate-900 bg-white border border-slate-200 rounded-md py-1 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-3 text-center">
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Total Faculty Count</label>
          <input
            type="number"
            value={formData.totalFaculty}
            onChange={(e) => onInputChange('totalFaculty', e.target.value)}
            className="w-20 mx-auto text-center font-bold text-base text-slate-900 bg-white border border-slate-200 rounded-md py-1 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-3 text-center">
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Available Faculty</label>
          <input
            type="number"
            value={formData.availableFaculty}
            onChange={(e) => onInputChange('availableFaculty', e.target.value)}
            className="w-20 mx-auto text-center font-bold text-base text-slate-900 bg-white border border-slate-200 rounded-md py-1 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-3 text-center">
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Labs & Facilities</label>
          <input
            type="number"
            value={formData.labsAndFacilities}
            onChange={(e) => onInputChange('labsAndFacilities', e.target.value)}
            className="w-20 mx-auto text-center font-bold text-base text-slate-900 bg-white border border-slate-200 rounded-md py-1 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-3 text-center">
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Active Projects</label>
          <input
            type="number"
            value={formData.activeProjects}
            onChange={(e) => onInputChange('activeProjects', e.target.value)}
            className="w-20 mx-auto text-center font-bold text-base text-slate-900 bg-white border border-slate-200 rounded-md py-1 focus:ring-1 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="bg-slate-50/60 border border-slate-200/80 rounded-md p-3 text-center">
          <label className="block text-[10px] font-medium text-slate-500 mb-1">Capacity Status</label>
          <select
            value={formData.capacityStatus}
            onChange={(e) => onInputChange('capacityStatus', e.target.value)}
            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="Available">Available</option>
            <option value="Limited">Limited</option>
            <option value="Full">Full</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AddUniversityStepCapacity;

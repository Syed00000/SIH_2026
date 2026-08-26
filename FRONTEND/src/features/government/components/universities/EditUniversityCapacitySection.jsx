import React, { useState } from 'react';
import { GraduationCap, KeyRound, Eye, EyeOff } from 'lucide-react';

export const EditUniversityCapacitySection = ({
  formData,
  onInputChange
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4 select-none">
      {/* 5. Capacity & Resource Statistics */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200/90 shadow-2xs space-y-3.5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>5. Capacity & Faculty Resources</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Departments</label>
            <input
              type="number"
              value={formData.departments}
              onChange={(e) => onInputChange('departments', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Total Faculty</label>
            <input
              type="number"
              value={formData.totalFaculty}
              onChange={(e) => onInputChange('totalFaculty', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Available R&D Faculty</label>
            <input
              type="number"
              value={formData.availableFaculty}
              onChange={(e) => onInputChange('availableFaculty', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Labs & Facilities</label>
            <input
              type="number"
              value={formData.labsAndFacilities}
              onChange={(e) => onInputChange('labsAndFacilities', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Active Projects</label>
            <input
              type="number"
              value={formData.activeProjects}
              onChange={(e) => onInputChange('activeProjects', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-0.5">Capacity Status</label>
            <select
              value={formData.capacityStatus}
              onChange={(e) => onInputChange('capacityStatus', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:bg-white focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
            >
              <option value="Available">Available</option>
              <option value="Limited">Limited</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>
      </div>

      {/* 6. Credentials Card */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">HEI Login Password Override</h3>
            <p className="text-[10px] text-slate-400 font-medium">Modify the active login password for this university portal user.</p>
          </div>
        </div>

        <div className="max-w-md">
          <label className="block text-[10px] text-slate-400 font-medium mb-1">Account Password</label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.loginPassword}
              onChange={(e) => onInputChange('loginPassword', e.target.value)}
              placeholder="Enter password"
              className="w-full px-2.5 py-1.5 pr-9 bg-slate-50/60 border border-slate-200 rounded-md text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-2xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUniversityCapacitySection;

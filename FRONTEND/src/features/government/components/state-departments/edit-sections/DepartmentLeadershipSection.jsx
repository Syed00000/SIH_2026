import React from 'react';
import { Users } from 'lucide-react';

export const DepartmentLeadershipSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">4. Department Leadership</h3>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Head of Department (HOD) Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="headName"
            placeholder="e.g. Shri Ramesh Kumar, IAS"
            value={formData.headName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Designation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="headRole"
            placeholder="e.g. Principal Secretary"
            value={formData.headRole}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-50/60 border border-slate-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-xs text-slate-900 font-medium"
          />
        </div>
      </div>
    </div>
  );
};

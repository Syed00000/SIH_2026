import React from 'react';
import { Award, Lock, Eye, EyeOff } from 'lucide-react';

export const EditFacultyCapacityCard = ({
  formData,
  setFormData,
  showPassword,
  setShowPassword
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4 text-left">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
        <Award className="w-4 h-4 text-slate-700" />
        <h3 className="text-sm font-extrabold text-slate-900">Mentorship Capacity & Access Security</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Max Active Projects
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={formData.maxProjects}
            onChange={(e) => setFormData({ ...formData, maxProjects: Number(e.target.value) })}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Mentorship Availability
          </label>
          <select
            value={formData.availabilityStatus}
            onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="Available">Available (Open for Allocation)</option>
            <option value="Busy">Busy (At Capacity)</option>
            <option value="On Sabbatical">On Sabbatical / Leave</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Account Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900 cursor-pointer"
          >
            <option value="Active">Active Credentials</option>
            <option value="Inactive">Suspended / Inactive</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Reset Portal Access Password (Optional)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Leave blank to keep existing password unchanged"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-slate-900 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFacultyCapacityCard;

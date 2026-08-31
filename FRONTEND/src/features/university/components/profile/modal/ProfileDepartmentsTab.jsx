import React from 'react';
import { Plus, Trash2, BookOpen } from 'lucide-react';

export const ProfileDepartmentsTab = ({
  formData,
  newDeptName,
  setNewDeptName,
  newDeptFaculty,
  setNewDeptFaculty,
  handleAddDepartment,
  handleRemoveDepartment
}) => {
  return (
    <div className="space-y-4 text-xs">
      <form onSubmit={handleAddDepartment} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-end gap-2.5">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Add Academic Department</label>
          <input
            type="text"
            placeholder="e.g. Department of Mechanical Engineering"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <div className="w-full sm:w-28">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Faculty Count</label>
          <input
            type="number"
            min={1}
            value={newDeptFaculty}
            onChange={(e) => setNewDeptFaculty(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-slate-900"
          />
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          Configured Departments ({formData.departments.length})
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {formData.departments.map((dept, idx) => (
            <div
              key={idx}
              className="p-3 bg-white border border-slate-200/90 rounded-lg flex items-center justify-between shadow-2xs group hover:border-slate-300"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 block">{dept.name}</span>
                <span className="text-[11px] text-slate-500 font-medium">{dept.facultyCount} Registered Faculty</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveDepartment(idx)}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDepartmentsTab;

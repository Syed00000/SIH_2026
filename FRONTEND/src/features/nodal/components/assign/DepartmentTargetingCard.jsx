import React from 'react';
import { Landmark, Briefcase } from 'lucide-react';

export const DepartmentTargetingCard = ({
  departments = [],
  universities = [],
  departmentLevel,
  setDepartmentLevel,
  selectedDeptId,
  setSelectedDeptId
}) => {
  const isUniversity = departmentLevel === 'University / HEI';
  const filteredDepartments = isUniversity ? [] : departments.filter(d => d.category === departmentLevel);

  return (
    <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-4">
      <div className="flex items-center space-x-2">
        <Landmark className="w-4 h-4 text-[#007A61]" />
        <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
          Target Department & Institutional Allocation
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10.5px] font-bold text-slate-600 mb-1.5">
            Administrative Level
          </label>
          <select
            value={departmentLevel}
            onChange={(e) => {
              setDepartmentLevel(e.target.value);
              setSelectedDeptId(''); // Reset selection on level change
            }}
            className="w-full border border-slate-200 rounded-md p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-[#007A61] cursor-pointer"
          >
            <option value="State Ministry">State Ministry</option>
            <option value="District Department">District Department</option>
            <option value="Block / Tehsil Office">Block / Tehsil Office</option>
            <option value="Ward Commissioner">Ward Commissioner</option>
            <option value="Gram Panchayat">Gram Panchayat</option>
            <option value="University / HEI">University / Higher Education Institute (HEI)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10.5px] font-bold text-slate-600 mb-1.5">
            {isUniversity ? 'Assign Specific University / HEI' : 'Assign Specific Department'}
          </label>
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="w-full border border-slate-200 rounded-md p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:border-[#007A61] cursor-pointer"
          >
            <option value="">— Select {isUniversity ? 'University / HEI' : departmentLevel} —</option>
            {isUniversity
              ? universities.map((u) => {
                  const id = u.code || u.aisheCode || u._id || u.id;
                  const location = u.district ? `(${u.district})` : '';
                  return (
                    <option key={id} value={id}>
                      {u.name} {location}
                    </option>
                  );
                })
              : filteredDepartments.map((d) => {
                  const id = d.deptId || d.id || d._id;
                  const location = d.district ? `(${d.district})` : '';
                  return (
                    <option key={id} value={id}>
                      {d.name} {location}
                    </option>
                  );
                })}
          </select>
          {isUniversity && universities.length === 0 && (
            <p className="text-[10px] text-amber-600 mt-1 font-medium">
              No registered universities found.
            </p>
          )}
          {!isUniversity && filteredDepartments.length === 0 && (
            <p className="text-[10px] text-amber-600 mt-1 font-medium">
              No departments found for this level.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentTargetingCard;

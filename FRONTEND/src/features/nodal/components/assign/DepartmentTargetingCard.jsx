import React from 'react';
import { Landmark, CheckCircle2, Info } from 'lucide-react';

export const DepartmentTargetingCard = ({
  departments = [],
  universities = [],
  departmentLevel,
  setDepartmentLevel,
  selectedDeptId,
  setSelectedDeptId,
  aiRecommendedDept
}) => {
  const isUniversity = departmentLevel === 'University / HEI';
  const filteredDepartments = isUniversity ? [] : departments.filter(d => d.category === departmentLevel);

  const selectedDeptObj = departments.find(d => (d.deptId || d.id || d._id) === selectedDeptId);
  const selectedDeptName = (selectedDeptObj?.name || '').toLowerCase();
  const aiDeptName = (aiRecommendedDept?.name || '').toLowerCase();

  const isAligned = selectedDeptName && aiDeptName &&
    (selectedDeptName.includes(aiDeptName) || aiDeptName.includes(selectedDeptName));

  const isOverridden = selectedDeptId && aiDeptName && !isAligned;

  return (
    <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Landmark className="w-4 h-4 text-[#007A61]" />
          <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            Target Department & Institutional Allocation
          </label>
        </div>
        {aiRecommendedDept?.name && (
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center space-x-1">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>Recommended: {aiRecommendedDept.name}</span>
          </span>
        )}
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
            className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-hidden focus:border-[#007A61] cursor-pointer"
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
            className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 bg-white focus:outline-hidden focus:border-[#007A61] cursor-pointer"
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
                  const isRecommended = aiDeptName && (d.name || '').toLowerCase().includes(aiDeptName);
                  return (
                    <option key={id} value={id}>
                      {isRecommended ? '[Recommended] ' : ''}{d.name} {location}
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
              No departments registered for this level.
            </p>
          )}

          {/* Live AI Validation Status */}
          {isAligned && (
            <div className="mt-1.5 flex items-center space-x-1.5 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200 px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Selection aligned with AI recommendation ({aiRecommendedDept.confidence || 88}% match)</span>
            </div>
          )}

          {isOverridden && (
            <div className="mt-1.5 flex items-center space-x-1.5 text-[10.5px] font-medium text-amber-800 bg-amber-50/90 border border-amber-200 px-2 py-1 rounded-md">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Manual Override: AI recommended {aiRecommendedDept.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentTargetingCard;

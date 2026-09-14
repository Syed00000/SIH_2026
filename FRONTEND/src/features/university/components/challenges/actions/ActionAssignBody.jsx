import React from 'react';

export const ActionAssignBody = ({ facultyList, selectedFaculty, setSelectedFaculty }) => {
  return (
    <div className="space-y-2 text-left">
      <label className="font-extrabold text-slate-900 block text-xs">
        Select Registered Faculty Mentor:
      </label>
      {facultyList && facultyList.length > 0 ? (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
          {facultyList.map((f, idx) => (
            <label
              key={idx}
              className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition-all ${
                selectedFaculty === f.name
                  ? 'border-[#007A61] bg-emerald-50/50 shadow-2xs'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <input
                  type="radio"
                  name="faculty_modal"
                  checked={selectedFaculty === f.name}
                  onChange={() => setSelectedFaculty(f.name)}
                  className="text-[#007A61] focus:ring-[#007A61]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{f.name}</div>
                  <div className="text-[10.5px] text-slate-500">{f.department || 'Faculty Mentor'}</div>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-[#007A61] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {f.designation || 'Active'}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-center">
          <p className="text-xs text-amber-900 font-extrabold mb-1.5">No Faculty Mentors Found</p>
          <p className="text-[11px] text-amber-700/90 leading-relaxed font-medium">
            Please register faculty members in the <strong className="text-amber-900">Faculty Mentors</strong> tab before assigning challenges.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionAssignBody;

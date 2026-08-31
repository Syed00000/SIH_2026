import React from 'react';

export const FacultyTableHeader = () => {
  return (
    <thead>
      <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider select-none text-left">
        <th className="py-3 px-3 w-[45px] text-center">#</th>
        <th className="py-3 px-3 min-w-[210px]">Faculty Mentor</th>
        <th className="py-3 px-3 w-[150px]">Department</th>
        <th className="py-3 px-3 w-[160px]">Contact Info</th>
        <th className="py-3 px-3 w-[150px]">Specialization</th>
        <th className="py-3 px-3 w-[105px]">Availability</th>
        <th className="py-3 px-3 w-[90px]">Status</th>
        <th className="py-3 px-3 w-[80px] text-right">Actions</th>
      </tr>
    </thead>
  );
};

export default FacultyTableHeader;

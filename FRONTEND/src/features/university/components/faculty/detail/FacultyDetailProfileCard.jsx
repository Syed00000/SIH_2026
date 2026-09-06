import React from 'react';
import { GraduationCap, Mail, Phone, Clock, Award } from 'lucide-react';

export const FacultyDetailProfileCard = ({ faculty, initials, isAvailable, isAssigned, specs }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-4 text-left">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            {initials}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-0.5">
              <h2 className="text-base font-bold text-slate-900">{faculty.name}</h2>
              <span className="text-[11px] text-slate-500 font-medium">({faculty.designation || 'Professor'})</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center space-x-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span>{faculty.department}</span>
            </div>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            faculty.availabilityStatus === 'In Project'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : faculty.availabilityStatus === 'On Leave'
              ? 'bg-purple-50 text-purple-800 border border-purple-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {faculty.availabilityStatus === 'In Project'
            ? 'Active Mentor (In Project)'
            : faculty.availabilityStatus === 'On Leave'
            ? 'On Leave'
            : 'Available for Allocation'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Official Email</span>
          <span className="font-mono font-bold text-slate-800 text-xs block mt-0.5 truncate">{faculty.email}</span>
        </div>
        <div>
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Phone Contact</span>
          <span className="font-mono font-bold text-slate-800 text-xs block mt-0.5">{faculty.phone || '+91 98351 22334'}</span>
        </div>
        <div>
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
          <span className="font-bold text-slate-800 text-xs block mt-0.5">{faculty.experience || '8 Years'}</span>
        </div>
        <div>
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Qualification</span>
          <span className="font-bold text-slate-800 text-xs block mt-0.5 truncate">{faculty.qualification || 'Ph.D.'}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 space-y-1.5">
        <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Technical Specializations</span>
        <div className="flex flex-wrap gap-1.5">
          {specs.map((s, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-bold">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyDetailProfileCard;

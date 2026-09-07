import React from 'react';
import { GraduationCap, Mail, Phone, Globe, Award } from 'lucide-react';

export const UniversityCapacityProfileDrawer = ({ university, assignedChallenges = [] }) => {
  const acceptedCount = assignedChallenges.filter(
    (c) => c.assignedUniversity?.acceptanceStatus === 'Accepted' || c.status === 'In Progress' || c.status === 'Resolved'
  ).length;

  const pendingCount = assignedChallenges.filter(
    (c) => !c.assignedUniversity?.acceptanceStatus || c.assignedUniversity?.acceptanceStatus === 'Pending Review'
  ).length;

  const resolvedCount = assignedChallenges.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-[#047857]" />
          <h3 className="text-sm font-extrabold text-slate-900">Institution Profile & Research Capacity</h3>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
          Verified HEI Record
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          <span className="text-[11px] text-slate-500 block font-medium">Assigned Problems</span>
          <span className="text-base font-extrabold text-slate-900">{assignedChallenges.length}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          <span className="text-[11px] text-slate-500 block font-medium">Accepted by HEI</span>
          <span className="text-base font-extrabold text-[#047857]">{acceptedCount}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          <span className="text-[11px] text-slate-500 block font-medium">Pending Review</span>
          <span className="text-base font-extrabold text-amber-700">{pendingCount}</span>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
          <span className="text-[11px] text-slate-500 block font-medium">Resolved / Completed</span>
          <span className="text-base font-extrabold text-emerald-800">{resolvedCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 border-t border-slate-100">
        <div className="space-y-2">
          <span className="font-bold text-slate-800 block">Institution Nodal Point of Contact:</span>
          <div className="text-slate-600 space-y-1">
            <p className="font-extrabold text-slate-900">{university.nodalOfficer?.name || 'Dr. Nodal Coordinator'}</p>
            <p className="text-slate-500">{university.nodalOfficer?.designation || 'Dean of Research & Innovation'}</p>
            <div className="flex items-center space-x-3 text-[11px] pt-1">
              <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5 text-slate-400" /><span>{university.nodalOfficer?.email || university.email || 'nodal@univ.ac.in'}</span></span>
              <span className="flex items-center space-x-1"><Phone className="w-3.5 h-3.5 text-slate-400" /><span>{university.nodalOfficer?.phone || university.phone || '+91 94311 XXXXX'}</span></span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-bold text-slate-800 block">Institutional Specialization & Accreditation:</span>
          <div className="text-slate-600 space-y-1">
            <p><span className="text-slate-400 font-medium">NAAC Grade:</span> <span className="font-bold text-slate-900">{university.naacGrade || university.accreditationGrade || 'A+ (NAAC)'}</span></p>
            <p><span className="text-slate-400 font-medium">NIRF Rank Range:</span> {university.nirfRank || 'Rank 50-100'}</p>
            <p><span className="text-slate-400 font-medium">Official Website:</span> <a href={`https://${university.website || 'ranchiuniversity.ac.in'}`} target="_blank" rel="noreferrer" className="text-slate-900 font-bold hover:underline">{university.website || 'univ.ac.in'}</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCapacityProfileDrawer;

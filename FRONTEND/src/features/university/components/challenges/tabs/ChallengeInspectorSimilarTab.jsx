import React from 'react';
import { Building, GraduationCap, CheckCircle2, Clock } from 'lucide-react';

export const ChallengeInspectorSimilarTab = ({ challenge }) => {
  const assignedUni = challenge.assignedUniversity?.name || challenge.universityName || 'Ranchi University';
  const assignedDept = challenge.assignedUniversity?.department || challenge.assignedFaculty?.department || 'Department of Applied Sciences & Engineering';
  const mentorName = challenge.assignedFaculty?.name || challenge.assignedUniversity?.mentorName;
  const isMentorAssigned = Boolean(mentorName);

  const milestones = [
    { title: 'Ground Challenge Verification & AI Dossier', status: 'Completed', date: 'Initiated', by: 'State Nodal Cell' },
    { title: 'Institutional Allocation to R&D University Node', status: 'Completed', date: 'Allocated', by: 'Nodal Officer' },
    { title: 'Academic Mentor Guidance & Team Formation', status: isMentorAssigned ? 'Completed' : 'Pending', date: 'Action Needed', by: assignedUni },
    { title: 'Field Prototyping & Student Lab Development', status: 'Pending', date: 'Phase 2', by: 'Student Team' },
    { title: 'Live Citizen Deployment & Pilot Testing', status: 'Pending', date: 'Phase 3', by: 'Local Panchayat' }
  ];

  return (
    <div className="space-y-3 text-xs text-slate-700 text-left">
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-xs">
            <Building className="w-4 h-4 text-[#007A61]" />
            <span>State Allocation Metadata</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-[#007A61] border border-emerald-200 px-2 py-0.5 rounded-full">
            Government of Jharkhand
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Assigned Node</span>
            <span className="font-extrabold text-slate-900 text-xs block mt-0.5">{assignedUni}</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">R&D Department</span>
            <span className="font-extrabold text-slate-900 text-xs block mt-0.5 truncate">{assignedDept}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
        <span className="font-extrabold text-slate-900 text-xs block pb-1 border-b border-slate-100">
          State R&D Milestone Trajectory
        </span>

        <div className="space-y-2.5">
          {milestones.map((m, idx) => (
            <div key={idx} className="flex items-start space-x-2.5">
              <div className="mt-0.5">
                {m.status === 'Completed' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#007A61]" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs ${m.status === 'Completed' ? 'text-slate-900' : 'text-slate-500'}`}>
                    {m.title}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                    m.status === 'Completed' ? 'bg-emerald-50 text-[#007A61]' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <div className="text-[10.5px] text-slate-400 mt-0.5">
                  Authority: {m.by} &bull; {m.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengeInspectorSimilarTab;

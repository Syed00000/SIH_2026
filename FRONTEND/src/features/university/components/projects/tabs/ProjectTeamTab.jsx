import React from 'react';
import { Users } from 'lucide-react';

export const ProjectTeamTab = ({ project, hasMentor, facultyName, facultyDept, initials, onAssignMentor }) => {
  const hasStudentTeam = Array.isArray(project.teamMembers) && project.teamMembers.length > 0;

  return (
    <div className="space-y-3">
      {/* Principal Investigator / Lead Mentor */}
      <div className="p-3.5 bg-white border border-emerald-200/90 rounded-xl space-y-1.5 shadow-2xs">
        <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">
          Principal Investigator / Lead Mentor
        </span>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                hasMentor ? 'bg-[#007A61] text-white shadow-2xs' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {initials}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs">{facultyName}</div>
              <div className="text-[10.5px] text-slate-500">{facultyDept}</div>
            </div>
          </div>
          {hasMentor ? (
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              Lead Mentor
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onAssignMentor && onAssignMentor(project)}
              className="text-[10.5px] font-bold text-[#007A61] hover:underline cursor-pointer bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
            >
              + Assign Mentor
            </button>
          )}
        </div>
      </div>

      {/* Student Team Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold text-slate-900 uppercase">Student Research Team</span>
          <span className="text-[10px] font-mono text-slate-500">
            {hasStudentTeam ? `${project.teamMembers.length} Members Assigned` : 'Formation Pending'}
          </span>
        </div>

        {hasStudentTeam ? (
          project.teamMembers.map((tm, idx) => (
            <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
              <div>
                <div className="font-bold text-slate-900 text-xs">{tm.name}</div>
                <div className="text-[10.5px] text-slate-500">{tm.department}</div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                {tm.role}
              </span>
            </div>
          ))
        ) : (
          <div className="p-5 bg-slate-50/70 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
            <Users className="w-6 h-6 text-slate-300 mx-auto" />
            <div className="text-xs font-bold text-slate-700">Student Team Not Assigned</div>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
              Student researchers will be onboarded by{' '}
              <strong className="text-slate-800">{facultyName}</strong> once the project methodology is formulated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTeamTab;

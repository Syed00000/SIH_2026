import React from 'react';
import { Briefcase, UserMinus } from 'lucide-react';

export const DrawerTabBody = ({
  activeTab,
  faculty,
  specs,
  facultyProjects,
  onUnassignProject
}) => {
  return (
    <div className="p-3.5 flex-1 overflow-y-auto space-y-3.5 text-xs text-slate-700 text-left">
      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 border border-slate-200">
            <div><span className="text-slate-500 block font-semibold">Department</span><strong className="text-slate-900">{faculty.department}</strong></div>
            <div><span className="text-slate-500 block font-semibold">Experience</span><strong className="text-slate-900">{faculty.experience || '10+ Years'}</strong></div>
            <div><span className="text-slate-500 block font-semibold">Qualification</span><strong className="text-slate-900">{faculty.qualification || 'Ph.D.'}</strong></div>
            <div><span className="text-slate-500 block font-semibold">Allocated Projects</span><strong className="text-slate-900">{facultyProjects.length} Active</strong></div>
          </div>

          <div>
            <span className="text-[10.5px] font-bold text-slate-900 uppercase block mb-1">Research Areas</span>
            <div className="flex flex-wrap gap-1">
              {specs.map((r, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-semibold">{r}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expertise' && (
        <div className="space-y-2">
          <span className="text-[10.5px] font-bold text-slate-900 uppercase block">Verified Domain Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {specs.map((s, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-900 border border-slate-200 font-bold text-xs">{s}</span>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-2">
          <span className="text-[10.5px] font-bold text-slate-900 uppercase block">Assigned Research Projects</span>
          {facultyProjects.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">No active projects currently mentored.</div>
          ) : (
            <div className="space-y-2">
              {facultyProjects.map((p, i) => (
                <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">{p.title}</span>
                    <span className="text-[10px] text-slate-500">{p.domain} &bull; Team: {p.teamName || p.studentTeam}</span>
                  </div>
                  {onUnassignProject && (
                    <button
                      type="button"
                      onClick={() => onUnassignProject(p.projectId || p.id, faculty.name)}
                      className="text-rose-600 hover:bg-rose-50 p-1 rounded text-[11px] font-bold cursor-pointer"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'availability' && (
        <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="font-bold text-slate-900 block text-xs">Capacity & Availability</span>
          <p className="text-[11px] text-slate-600">
            Current Status: <strong>{faculty.availabilityStatus || 'Available'}</strong>. Faculty member can mentor up to {faculty.maxProjects || 4} projects simultaneously.
          </p>
        </div>
      )}
    </div>
  );
};

export default DrawerTabBody;

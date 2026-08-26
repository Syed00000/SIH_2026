import React from 'react';
import {
  PlayCircle,
  Building2,
  Sliders,
  CheckCircle2,
  Clock,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';

export const ProjectsInProgressTable = ({ projects = [], onManageProject }) => {
  const getDeploymentStatusBadge = (status) => {
    switch (status) {
      case 'Validated ✓':
      case 'Active ✓':
      case 'Validated':
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Pending Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Initial Stage':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTrlBadge = (trlLevel, prototypeType) => {
    return 'bg-slate-100 text-slate-800 border-slate-200';
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-2xs">
        <PlayCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-800">No Projects Found</h3>
        <p className="text-xs text-slate-500 mt-1">No in-progress innovation projects match your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Projects in Progress - Extensive Tracking Table
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time stage gates, milestone compliance, and TRL verification across funded projects
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          {projects.length} Active Tracked Projects
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Project Title & ID</th>
                <th className="py-3 px-4">Milestone Phase</th>
                <th className="py-3 px-4">Prototype & TRL</th>
                <th className="py-3 px-4">Deployment Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {projects.map((prj) => {
                return (
                  <tr
                    key={prj.id}
                    className="hover:bg-slate-50/60 transition-colors group cursor-default"
                  >
                    {/* 1. Project Title & ID */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-black">
                        {prj.title}{' '}
                        <span className="font-mono text-slate-500 font-semibold text-[11px]">
                          ({prj.id})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span className="font-medium text-slate-700 flex items-center space-x-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{prj.hei}</span>
                        </span>
                        <span>•</span>
                        <span>{prj.sector}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800">{prj.district}</span>
                      </div>
                    </td>

                    {/* 2. Milestone Phase & Progress */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{prj.milestonePhase}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-900 h-full rounded-full transition-all duration-300"
                            style={{ width: `${prj.milestoneProgress || 50}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">
                          {prj.milestoneProgress || 50}%
                        </span>
                      </div>
                    </td>

                    {/* 3. Prototype & TRL */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 inline-flex items-center space-x-1">
                        <span>{prj.prototypeType}</span>
                        <span className="text-slate-400">|</span>
                        <span className="font-black text-slate-900">{prj.trlLevel}</span>
                      </span>
                    </td>

                    {/* 4. Deployment Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getDeploymentStatusBadge(
                          prj.deploymentStatus
                        )}`}
                      >
                        {prj.deploymentStatus}
                      </span>
                    </td>

                    {/* 5. Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onManageProject && onManageProject(prj)}
                        className="px-3.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsInProgressTable;

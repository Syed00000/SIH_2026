import { Briefcase, UserMinus, Lock } from 'lucide-react';

export const FacultyDetailProjectsCard = ({
  faculty,
  facultyProjects,
  onUnassignProject
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs p-4.5 space-y-3 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-extrabold text-slate-900">Mentored Student Projects & Prototypes</h3>
        </div>
        <span className="text-xs font-bold text-slate-500">{facultyProjects.length} Projects</span>
      </div>

      {facultyProjects.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs font-medium bg-slate-50 rounded-xl">
          No active student projects assigned to this faculty mentor yet.
        </div>
      ) : (
        <div className="space-y-2">
          {facultyProjects.map((p, idx) => {
            const isProjDeployed = p.status === 'Deployed' || Boolean(p.isDeployed) || Boolean(p.isLocked);
            return (
              <div
                key={idx}
                className={`p-3 border rounded-xl flex items-center justify-between gap-3 ${
                  isProjDeployed ? 'bg-teal-50/40 border-teal-200' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {p.projectId || p.id}
                    </span>
                    <span className="font-bold text-slate-900 text-xs truncate">{p.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Domain: <strong className="text-slate-700">{p.domain}</strong> &bull; Student Team: <strong className="text-slate-700">{p.teamName || p.studentTeam}</strong>
                  </div>
                </div>

                {isProjDeployed ? (
                  <span className="text-xs font-bold text-[#007A61] shrink-0 flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Deployed &bull; Locked</span>
                  </span>
                ) : onUnassignProject ? (
                  <button
                    type="button"
                    onClick={() => onUnassignProject(p.projectId || p.id, faculty.name)}
                    className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg shrink-0 cursor-pointer flex items-center space-x-1"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Unassign</span>
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FacultyDetailProjectsCard;

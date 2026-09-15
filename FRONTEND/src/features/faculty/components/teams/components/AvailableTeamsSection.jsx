import React from 'react';
import { Users, UserCheck, CheckCircle2, Crown, Sparkles, PlusCircle } from 'lucide-react';

export const AvailableTeamsSection = ({
  allTeams = [],
  currentTeamCode,
  currentProjectId,
  onAssignTeam
}) => {
  if (!allTeams || allTeams.length === 0) {
    return (
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 text-center space-y-1">
        <p className="text-xs font-bold text-slate-700">No Student Teams Configured Yet</p>
        <p className="text-[11px] text-slate-400">
          Use the 'Student Teams' sidebar option to recruit and configure research squads.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200 space-y-3 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-[#007A61]" />
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Available Student Teams ({allTeams.length})
          </h4>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-[#007A61] rounded-xs border border-emerald-300">
            Roster Pool
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Select a student research team from your configured roster pool to assign to this challenge problem statement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {allTeams.map((team) => {
          const tCode = team.teamCode || team.id;
          const isAssigned =
            (tCode && currentTeamCode && tCode === currentTeamCode) ||
            (team.projectId && currentProjectId && (team.projectId === currentProjectId || team.id === currentProjectId));
          const members = team.members || team.teamMembers || [];
          const leader = team.studentLead || team.leader || members.find((m) => m.isLead)?.name || 'Unassigned';

          return (
            <div
              key={tCode || team.name}
              className={`p-3 rounded-md border transition-all space-y-2.5 flex flex-col justify-between ${
                isAssigned
                  ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300/60 shadow-xs'
                  : 'bg-white border-slate-300 hover:border-emerald-400 hover:shadow-xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-mono text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-xs">
                    {tCode || 'TEAM'}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-xs">
                    {members.length} Members
                  </span>
                </div>
                <h5 className="text-xs font-black text-slate-900 truncate" title={team.name}>
                  {team.name}
                </h5>
                <div className="flex items-center space-x-1 text-[11px] text-slate-600">
                  <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>Lead: <strong className="text-slate-800">{leader}</strong></span>
                </div>
              </div>

              {members.length > 0 && (
                <div className="pt-1.5 border-t border-slate-100 flex flex-wrap gap-1">
                  {members.slice(0, 3).map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded-xs text-[9.5px] text-slate-600 truncate max-w-[120px]"
                    >
                      {m.name}
                    </span>
                  ))}
                  {members.length > 3 && (
                    <span className="px-1 py-0.5 text-[9px] text-slate-400 font-bold">
                      +{members.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="pt-1">
                {isAssigned ? (
                  <div className="w-full py-1.5 text-center text-[11px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-md flex items-center justify-center space-x-1.5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>✓ Assigned to Challenge</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAssignTeam && onAssignTeam(team)}
                    className="w-full py-1.5 text-[11px] font-black text-white bg-[#007A61] hover:bg-[#00604c] rounded-md transition-all cursor-pointer shadow-2xs flex items-center justify-center space-x-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Assign to this Challenge</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableTeamsSection;

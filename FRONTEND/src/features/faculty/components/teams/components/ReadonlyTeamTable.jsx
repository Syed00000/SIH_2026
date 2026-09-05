import React from 'react';
import { Users, Crown, Mail, ChevronDown, Table as TableIcon, CheckCircle2 } from 'lucide-react';

export const ReadonlyTeamTable = ({
  teamName,
  teamMembers = [],
  teamCode,
  studentLead,
  faculty,
  allTeams = [],
  onAssignTeam
}) => {
  const leader = studentLead || teamMembers.find((m) => m.isLead)?.name;

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden select-none space-y-0">
      {/* Spreadsheet Title Bar */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#007A61] flex items-center justify-center shrink-0 shadow-2xs">
            <TableIcon className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Assigned Student Research Team Roster
              </h3>
              {teamCode && (
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {teamCode}
                </span>
              )}
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 bg-emerald-100 text-[#007A61] rounded-full">
                Active Squad
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center flex-wrap gap-2">
              <span>Team: <strong className="text-slate-800">{teamName || 'Innovation Lab'}</strong></span>
              {leader && (
                <span className="text-amber-800 font-bold flex items-center space-x-1">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span>Leader: {leader}</span>
                </span>
              )}
              <span>&bull; Faculty Mentor: {faculty?.name || 'Dr. Binod Kumar'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {allTeams.length > 1 && onAssignTeam && (
            <div className="relative">
              <select
                onChange={(e) => {
                  const found = allTeams.find((t) => (t.teamCode || t.id) === e.target.value);
                  if (found) onAssignTeam(found);
                }}
                defaultValue={teamCode || ''}
                className="text-[11px] font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl appearance-none pr-7 cursor-pointer focus:outline-none shadow-2xs"
              >
                {allTeams.map((t) => (
                  <option key={t.id || t.teamCode} value={t.teamCode || t.id}>
                    {t.name} ({t.membersCount || t.members?.length || 0} members)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
          <div className="text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-[#007A61]" />
            <span>{teamMembers.length} Members</span>
          </div>
        </div>
      </div>

      {/* Horizontal Spreadsheet View */}
      {teamMembers.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Users className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-xs font-bold text-slate-700">No student team roster assigned yet.</p>
          <p className="text-[11px] text-slate-400">Use the 'Student Teams' sidebar option to recruit and configure research members.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse divide-y divide-slate-200">
            <thead className="bg-slate-100/90 text-slate-600 font-extrabold uppercase tracking-wider text-[10px] divide-x divide-slate-200 border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 w-12 text-center">#</th>
                <th className="px-4 py-3 min-w-[190px]">Student Researcher</th>
                <th className="px-4 py-3 min-w-[130px]">Roll No</th>
                <th className="px-4 py-3 min-w-[200px]">Institutional Email</th>
                <th className="px-4 py-3 min-w-[170px]">Academic Department</th>
                <th className="px-4 py-3 min-w-[110px]">Year</th>
                <th className="px-4 py-3 min-w-[160px]">Assigned Project Role</th>
                <th className="px-3 py-3 text-center min-w-[90px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {teamMembers.map((m, idx) => (
                <tr key={idx} className="divide-x divide-slate-100 hover:bg-emerald-50/50 transition-colors">
                  <td className="px-3 py-3 font-mono text-[10.5px] font-bold text-slate-400 text-center">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 border ${
                        m.isLead ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {m.isLead ? <Crown className="w-3.5 h-3.5 text-amber-600" /> : (m.name || 'S').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex items-center space-x-1.5 whitespace-nowrap">
                        <span className="font-extrabold text-slate-900">{m.name}</span>
                        {m.isLead && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-tight">
                            Leader
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                    {m.rollNo}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5 text-slate-600 font-medium text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{m.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">
                    {m.department}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10.5px] font-bold border border-slate-200">
                      {m.year}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-bold text-slate-800">{m.role}</span>
                  </td>
                  <td className="px-3 py-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Active</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Spreadsheet Footer Summary Bar */}
      {teamMembers.length > 0 && (
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center space-x-3">
            <span>Total Roster Size: <strong className="text-slate-800 font-bold">{teamMembers.length} Students</strong></span>
            <span>&bull;</span>
            <span>Lead: <strong className="text-slate-800 font-bold">{leader || 'Unassigned'}</strong></span>
          </div>
          <span className="text-[10px] font-bold text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Ranchi University R&D Cell &bull; Verified Roster
          </span>
        </div>
      )}
    </div>
  );
};

export default ReadonlyTeamTable;

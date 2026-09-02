import React from 'react';
import { Users, Crown, Mail } from 'lucide-react';

export const ReadonlyTeamTable = ({ teamName, teamMembers = [], faculty }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#007A61]" />
            <span>Assigned Student Team Roster</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Team: <strong>{teamName || 'Innovation Lab'}</strong> • Mentor: {faculty?.name || 'Assigned Faculty'}
          </p>
        </div>
        <div className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
          {teamMembers.length} Members
        </div>
      </div>

      {teamMembers.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-600">No student team assigned yet.</p>
          <p className="text-[10.5px]">Use the Global 'Student Teams' sidebar option to recruit members.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 uppercase tracking-wider">Student Details</th>
                <th className="px-4 py-3 uppercase tracking-wider">Roll No</th>
                <th className="px-4 py-3 uppercase tracking-wider">Department / Year</th>
                <th className="px-4 py-3 uppercase tracking-wider">Project Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 border ${m.isLead ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {m.isLead ? <Crown className="w-3.5 h-3.5" /> : m.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{m.name}</div>
                        <div className="flex items-center space-x-1 text-[10px] text-slate-500 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{m.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">
                    {m.rollNo}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-700">{m.department}</div>
                    <div className="text-[10px] text-slate-500">{m.year}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col items-start gap-1">
                      {m.isLead && (
                        <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Team Leader
                        </span>
                      )}
                      <span className="font-semibold text-slate-600">{m.role}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReadonlyTeamTable;

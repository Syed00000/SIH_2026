import React from 'react';
import { Users, Crown, ArrowRight, FileText, Plus } from 'lucide-react';

export const FacultyTeamsListTable = ({ projects = [], onSelectProject, onAddNewTeam }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#007A61]" />
            <span>All Mentored Teams</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            Overview of all your R&D projects and their assigned student teams.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-[10.5px] font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
            {projects.length} Total Projects
          </div>
          <button
            onClick={onAddNewTeam}
            className="flex items-center space-x-1.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Team</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-5 py-3">Project / Problem Statement</th>
              <th className="px-5 py-3">Team Identity</th>
              <th className="px-5 py-3">Student Leader</th>
              <th className="px-5 py-3 text-center">Roster</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((proj) => {
              const projectId = proj.projectId || proj.challengeId || proj._id;
              const hasTeam = Array.isArray(proj.teamMembers) && proj.teamMembers.length > 0;
              const lead = hasTeam
                ? proj.teamMembers.find((m) => m.isLead) || proj.teamMembers[0]
                : proj.studentLead && proj.studentLead !== 'Unassigned'
                ? { name: proj.studentLead, rollNo: 'Lead Innovator' }
                : null;

              return (
                <tr 
                  key={projectId} 
                  onClick={() => onSelectProject(projectId)}
                  className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-4 w-1/3">
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#007A61] transition-colors">
                          {proj.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          <span>{projectId}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-5 py-4">
                    <div className="font-extrabold text-slate-800">
                      {proj.studentTeam || proj.teamName || 'Innovation Lab'}
                    </div>
                    {!hasTeam && (
                      <span className="inline-block mt-1 text-[9.5px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200/50">
                        Formation Pending
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {lead ? (
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[9px] font-black shrink-0 border border-amber-300">
                          <Crown className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{lead.name}</div>
                          <div className="text-[10px] text-slate-500">{lead.rollNo}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-center">
                    {hasTeam ? (
                      <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full font-bold">
                        <Users className="w-3.5 h-3.5" />
                        <span>{proj.teamMembers.length}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 font-bold">-</span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] font-bold group-hover:border-[#007A61] group-hover:text-[#007A61] group-hover:bg-emerald-50 transition-all shadow-2xs">
                      <span>{hasTeam ? 'Manage Team' : 'Assign Team'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyTeamsListTable;

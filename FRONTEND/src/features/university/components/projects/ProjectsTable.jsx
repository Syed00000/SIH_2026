import React, { useState } from 'react';
import { Droplet, Compass, Leaf, HeartPulse, Sun, Users, MoreVertical, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const getDomainIcon = (domain = '') => {
  const d = domain.toLowerCase();
  if (d.includes('water')) return <Droplet className="w-4 h-4 text-slate-800" />;
  if (d.includes('infra') || d.includes('road')) return <Compass className="w-4 h-4 text-slate-800" />;
  if (d.includes('environ') || d.includes('waste')) return <Leaf className="w-4 h-4 text-slate-800" />;
  if (d.includes('health')) return <HeartPulse className="w-4 h-4 text-slate-800" />;
  if (d.includes('energy') || d.includes('solar')) return <Sun className="w-4 h-4 text-slate-800" />;
  return <Droplet className="w-4 h-4 text-slate-800" />;
};

const getDomainBadge = (domain = '') => {
  const d = domain.toLowerCase();
  if (d.includes('water')) return 'bg-slate-100 text-slate-900 border-slate-300';
  if (d.includes('infra') || d.includes('road')) return 'bg-slate-100 text-slate-900 border-slate-300';
  if (d.includes('environ') || d.includes('waste')) return 'bg-slate-100 text-slate-900 border-slate-300';
  if (d.includes('health')) return 'bg-slate-100 text-slate-900 border-slate-300';
  if (d.includes('energy') || d.includes('solar')) return 'bg-slate-100 text-slate-900 border-slate-300';
  return 'bg-slate-100 text-slate-900 border-slate-300';
};

const getStatusBadge = (status = '') => {
  if (status === 'In Progress') return 'bg-emerald-50 text-emerald-900 border-emerald-300';
  if (status === 'Planning') return 'bg-slate-100 text-slate-900 border-slate-300';
  if (status === 'Completed') return 'bg-purple-50 text-purple-900 border-purple-300';
  return 'bg-rose-50 text-rose-900 border-rose-300';
};

export const ProjectsTable = ({
  projects = [],
  selectedProjectId,
  onSelectProject,
  onSoftDeleteProject,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedItems = projects.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-slate-200 shadow-2xs select-none rounded-none overflow-hidden flex flex-col justify-between">
      <div>
        <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h2 className="text-xs font-bold text-slate-900 tracking-tight uppercase">
            Project List ({projects.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="py-2.5 px-3">Project Details</th>
                <th className="py-2.5 px-3">Challenge ID</th>
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">Faculty Mentor</th>
                <th className="py-2.5 px-3">Team</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={9} className="py-3 px-3">
                      <div className="h-4 bg-slate-100 w-full" />
                    </td>
                  </tr>
                ))
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-medium text-xs">
                    No projects match your selected filters.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((p) => {
                  const isSelected = selectedProjectId === (p.projectId || p._id);
                  const facultyName = p.facultyMentor?.name || p.leadMentor || 'Dr. Priya Sharma';
                  const initials = facultyName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

                  return (
                    <tr
                      key={p.projectId || p._id}
                      onClick={() => onSelectProject(p)}
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-100 border-l-4 border-l-slate-900' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            {getDomainIcon(p.domain)}
                          </div>
                          <div className="font-bold text-slate-900 leading-tight max-w-[200px] truncate" title={p.title}>
                            {p.title}
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{p.challengeId || 'CHL-1024'}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 text-[10.5px] font-bold border rounded-none ${getDomainBadge(p.domain)}`}>
                          {p.domain}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {initials}
                          </div>
                          <span className="font-semibold text-slate-900 text-[11.5px]">{facultyName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="flex items-center space-x-1 text-slate-700 font-mono text-xs">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{p.teamMembersCount || 5}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="w-24">
                          <div className="flex justify-between items-center text-[10px] font-bold font-mono mb-0.5">
                            <span>{p.progressPercentage || 50}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 border border-slate-200">
                            <div className="bg-slate-900 h-1.5" style={{ width: `${p.progressPercentage || 50}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${getStatusBadge(p.status)}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-[11px] font-medium text-slate-900">{p.deadline || '30 Nov 2026'}</div>
                        <div className="text-[10px] text-rose-600 font-bold">{p.daysLeft || '192 days left'}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectProject(p)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-none cursor-pointer transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => onSoftDeleteProject && onSoftDeleteProject(p)}
                            title="Soft Delete / Archive Project"
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-3.5 py-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
        <div>Showing {projects.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, projects.length)} of {projects.length} projects</div>
        <div className="flex items-center space-x-1">
          <button
            disabled={activePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 border border-slate-200 rounded-none hover:bg-slate-100 disabled:opacity-40 text-slate-600 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
            <button
              key={pNum}
              onClick={() => setCurrentPage(pNum)}
              className={`w-6 h-6 rounded-none font-bold text-xs flex items-center justify-center cursor-pointer ${
                activePage === pNum ? 'bg-slate-900 text-white' : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {pNum}
            </button>
          ))}

          <button
            disabled={activePage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 border border-slate-200 rounded-none hover:bg-slate-100 disabled:opacity-40 text-slate-600 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;

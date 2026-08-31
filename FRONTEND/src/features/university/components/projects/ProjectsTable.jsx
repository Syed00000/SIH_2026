import React, { useState } from 'react';
import { Eye, Trash2, ChevronLeft, ChevronRight, ChevronDown, FolderGit2, UserCheck } from 'lucide-react';

export const ProjectsTable = ({
  projects = [],
  selectedProjectId,
  onSelectProject,
  onAssignMentor,
  onSoftDeleteProject,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalRecords = projects.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedItems = projects.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('progress') || s.includes('track') || s.includes('active')) {
      return { text: 'text-emerald-600', dot: 'bg-emerald-500' };
    }
    if (s.includes('complete')) {
      return { text: 'text-purple-600', dot: 'bg-purple-500' };
    }
    if (s.includes('delay') || s.includes('risk') || s.includes('review')) {
      return { text: 'text-amber-600', dot: 'bg-amber-500 animate-pulse' };
    }
    return { text: 'text-slate-600', dot: 'bg-slate-400' };
  };

  return (
    <div className="border border-slate-200/90 rounded-lg overflow-hidden flex flex-col w-full shadow-2xs select-none bg-white">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-2.5 px-2.5 w-[45px] text-center">#</th>
              <th className="py-2.5 px-3 min-w-[210px]">Project / Innovation</th>
              <th className="py-2.5 px-2.5 w-[140px]">Domain & Budget</th>
              <th className="py-2.5 px-2.5 w-[160px]">Lead Mentor</th>
              <th className="py-2.5 px-2.5 w-[140px]">Student Team</th>
              <th className="py-2.5 px-2.5 w-[120px]">Timeline</th>
              <th className="py-2.5 px-2.5 w-[95px]">Status</th>
              <th className="py-2.5 px-3 w-[80px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="font-semibold text-slate-600">Loading projects from database...</div>
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <FolderGit2 className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-600">No projects found</div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((p, index) => {
                const isSelected = selectedProjectId === (p.projectId || p._id);
                const title = p.title || 'Project';
                const firstLetter = title.charAt(0).toUpperCase();
                const globalIndex = startIndex + index + 1;
                const hasMentor = Boolean(p.facultyMentor?.name || (p.leadMentor && p.leadMentor !== 'Unassigned'));
                const facultyName = p.facultyMentor?.name || p.leadMentor;
                const facultyDept = p.facultyMentor?.department || (p.facultyMentor?.name ? 'Department of Engineering' : '');
                const hasStudentTeam = Array.isArray(p.teamMembers) && p.teamMembers.length > 0;
                const statusStyle = getStatusColor(p.status || 'In Progress');

                return (
                  <tr
                    key={p.projectId || p._id || index}
                    onClick={() => onSelectProject(p)}
                    className={`hover:bg-slate-50/80 transition-colors group select-none cursor-pointer ${
                      isSelected ? 'bg-emerald-50/60 border-l-4 border-l-[#007A61]' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-2.5 px-2.5 text-center font-mono text-[11px] font-semibold text-slate-400">
                      {globalIndex}
                    </td>

                    {/* Main Entity Tile */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-md bg-emerald-50 text-[#007A61] font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-200">
                          {firstLetter}
                        </div>
                        <div className="min-w-0 max-w-[210px]">
                          <div
                            className="font-bold text-slate-900 hover:text-[#007A61] text-xs truncate leading-tight"
                            title={title}
                          >
                            {title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            ID: {p.projectId} {p.challengeId ? `• Ref: ${p.challengeId}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Domain & Budget */}
                    <td className="py-2.5 px-2.5">
                      <div className="font-semibold text-slate-800 text-xs truncate max-w-[130px]" title={p.domain}>
                        {p.domain}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0'
                          ? <span className="text-emerald-600 font-bold">{p.disbursedAmount} (Disbursed)</span>
                          : p.budget || 'N/A'}
                      </div>
                    </td>

                    {/* Lead Mentor */}
                    <td className="py-2.5 px-2.5">
                      {hasMentor ? (
                        <>
                          <div className="font-bold text-slate-900 text-xs leading-tight truncate max-w-[150px]">
                            {facultyName}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                            {facultyDept || 'Engineering Mentor'}
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-amber-800 font-bold text-[10.5px] bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                            Unassigned
                          </span>
                          <div className="text-[9.5px] text-slate-400 mt-0.5 font-mono">Needs Lead Mentor</div>
                        </>
                      )}
                    </td>

                    {/* Student Team */}
                    <td className="py-2.5 px-2.5">
                      {hasStudentTeam ? (
                        <>
                          <div className="font-semibold text-slate-800 text-xs truncate max-w-[130px]" title={p.studentTeam}>
                            {p.studentTeam || 'Innovation Team'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {p.teamMembers.length} Members
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-[11px] text-slate-400 italic font-medium">Not Assigned</div>
                          <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">Team pending</div>
                        </>
                      )}
                    </td>

                    {/* Timeline / Deadline */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 text-xs">{p.timeline || p.deadline || '6 Months (Target: Nov 2026)'}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.daysLeft || 'Govt Schedule'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${statusStyle.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        <span>{p.status || 'In Progress'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {onAssignMentor && (
                          <button
                            type="button"
                            onClick={() => onAssignMentor(p)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-300 rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                            title="Assign / Change Lead Faculty Mentor"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{p.facultyMentor?.name || p.leadMentor ? 'Change Mentor' : 'Assign Mentor'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectProject(p)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onSoftDeleteProject && (
                          <button
                            type="button"
                            onClick={() => onSoftDeleteProject(p)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Archive Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/30">
        <div>
          Showing <span className="font-bold text-slate-800">{projects.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, totalRecords)}</span> of{' '}
          <span className="font-bold text-slate-800">{totalRecords}</span> projects
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-200 rounded-md px-2 py-1 pr-6 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center space-x-1">
            <button
              disabled={activePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  activePage === pageNum
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              disabled={activePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-md border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;

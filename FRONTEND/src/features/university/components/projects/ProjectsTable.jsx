import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, FolderGit2 } from 'lucide-react';
import { ProjectsTableRow } from './ProjectsTableRow.jsx';

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

  return (
    <div className="border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col w-full shadow-2xs select-none bg-white">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-2.5 px-2.5 w-[45px] text-center">#</th>
              <th className="py-2.5 px-3 min-w-[210px]">Project / Innovation</th>
              <th className="py-2.5 px-2.5 w-[140px]">Domain &amp; Budget</th>
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
              paginatedItems.map((p, index) => (
                <ProjectsTableRow
                  key={p.projectId || p._id || index}
                  project={p}
                  globalIndex={startIndex + index + 1}
                  isSelected={selectedProjectId === (p.projectId || p._id)}
                  onSelectProject={onSelectProject}
                  onSoftDeleteProject={onSoftDeleteProject}
                />
              ))
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
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 pr-6 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none cursor-pointer appearance-none shadow-2xs"
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
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
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
              className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-2xs"
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

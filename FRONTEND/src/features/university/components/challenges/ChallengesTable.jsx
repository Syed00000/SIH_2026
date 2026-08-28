import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, ChevronDown, Award } from 'lucide-react';

const getNormalizedStatus = (status) => {
  if (!status) return 'Pending';
  const s = String(status).toLowerCase();
  if (s.includes('accept') || s === 'completed') return 'Accepted';
  if (s.includes('reject') || s.includes('decline')) return 'Rejected';
  return 'Pending';
};

export const ChallengesTable = ({
  challenges = [],
  selectedChallengeId,
  onSelectChallenge,
  onActionClick,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalRecords = challenges.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedItems = challenges.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="border border-slate-200/90 rounded-lg overflow-hidden flex flex-col w-full shadow-2xs select-none bg-white">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-2.5 px-2.5 w-[45px] text-center">#</th>
              <th className="py-2.5 px-3 min-w-[210px]">Challenge / Problem</th>
              <th className="py-2.5 px-2.5 w-[140px]">Domain & District</th>
              <th className="py-2.5 px-2.5 w-[160px]">Faculty Mentor</th>
              <th className="py-2.5 px-2.5 w-[150px]">Required Skills</th>
              <th className="py-2.5 px-2.5 w-[90px]">Priority</th>
              <th className="py-2.5 px-2.5 w-[95px]">Status</th>
              <th className="py-2.5 px-3 w-[70px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="font-semibold text-slate-600">Loading challenges from database...</div>
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <Award className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                  <div className="font-semibold text-slate-600">No challenges found</div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((c, index) => {
                const isSelected = selectedChallengeId === (c.id || c.challengeId);
                const normStatus = getNormalizedStatus(c.status);
                const title = c.title || 'Challenge';
                const firstLetter = title.charAt(0).toUpperCase();
                const globalIndex = startIndex + index + 1;
                const skills = Array.isArray(c.requiredSkills)
                  ? c.requiredSkills
                  : typeof c.requiredSkills === 'string'
                  ? c.requiredSkills.split(',').map((s) => s.trim())
                  : ['IoT Sensors', 'Telemetry'];

                return (
                  <tr
                    key={c.id || c.challengeId || index}
                    onClick={() => onSelectChallenge(c)}
                    className={`hover:bg-slate-50/70 transition-colors group select-none cursor-pointer ${
                      isSelected ? 'bg-slate-100/60 border-l-4 border-l-slate-900' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-2.5 px-2.5 text-center font-mono text-[11px] font-semibold text-slate-400">
                      {globalIndex}
                    </td>

                    {/* Main Entity Tile */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-slate-200/60">
                          {firstLetter}
                        </div>
                        <div className="min-w-0 max-w-[210px]">
                          <div
                            className="font-bold text-slate-900 hover:text-slate-600 text-xs truncate leading-tight"
                            title={title}
                          >
                            {title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            ID: {c.id || c.challengeId} &bull; {c.aiCategory || c.domain}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Domain & District */}
                    <td className="py-2.5 px-2.5">
                      <div className="font-semibold text-slate-800 text-xs truncate max-w-[130px]" title={c.domain}>
                        {c.domain}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{c.district || 'Ranchi'}, JH</div>
                    </td>

                    {/* Faculty Mentor */}
                    <td className="py-2.5 px-2.5">
                      {c.assignedFaculty?.name ? (
                        <div>
                          <div className="font-bold text-slate-900 text-xs leading-tight truncate max-w-[150px]">
                            {c.assignedFaculty.name}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                            {c.assignedFaculty.department || 'Assigned Mentor'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-slate-400 text-xs italic">Unassigned</div>
                          {c.suggestedFaculty?.name && (
                            <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                              Sug: {c.suggestedFaculty.name.split(' ')[1] || c.suggestedFaculty.name}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Required Skills */}
                    <td className="py-2.5 px-2.5">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {skills.slice(0, 2).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 2 && (
                          <span className="text-[10px] font-medium text-slate-400 self-center">
                            +{skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${
                        c.priority === 'High' ? 'text-rose-600' : c.priority === 'Medium' ? 'text-amber-600' : 'text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.priority === 'High' ? 'bg-rose-500' : c.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        <span>{c.priority || 'Medium'}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1.5 text-[11px] font-semibold ${
                          normStatus === 'Accepted'
                            ? 'text-emerald-600'
                            : normStatus === 'Pending'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            normStatus === 'Accepted'
                              ? 'bg-emerald-500'
                              : normStatus === 'Pending'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-red-500'
                          }`}
                        />
                        <span>{normStatus}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => onActionClick(c)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/30">
        <div>
          Showing <span className="font-bold text-slate-800">{challenges.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, totalRecords)}</span> of{' '}
          <span className="font-bold text-slate-800">{totalRecords}</span> challenges
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

export default ChallengesTable;

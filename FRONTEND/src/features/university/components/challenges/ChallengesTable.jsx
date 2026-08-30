import React, { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, ChevronDown, Award, MessageSquare } from 'lucide-react';

const getNormalizedStatus = (challenge) => {
  if (!challenge) return 'Pending';
  if (typeof challenge === 'string') {
    const s = challenge.toLowerCase();
    if (s.includes('accept') || s === 'completed') return 'Accepted';
    if (s.includes('reject') || s.includes('decline')) return 'Rejected';
    if (s === 'clarified') return 'Clarified';
    if (s.includes('clarif')) return 'Clarification Requested';
    return 'Pending';
  }
  const status = challenge.status;
  const acceptance = challenge.acceptanceStatus || challenge.assignedUniversity?.acceptanceStatus;
  const s = String(status || '').toLowerCase();
  const acc = String(acceptance || '').toLowerCase();
  if (s.includes('accept') || acc === 'accepted' || s === 'completed') return 'Accepted';
  if (s.includes('reject') || s.includes('decline') || acc === 'declined') return 'Rejected';
  if (s === 'clarified' || acc === 'clarified' || Boolean(challenge.clarificationResponse)) return 'Clarified';
  if (s.includes('clarif') || acc.includes('clarif') || Boolean(challenge.clarificationQuery)) return 'Clarification Requested';
  return 'Pending';
};

export const ChallengesTable = ({
  challenges = [],
  selectedChallengeId,
  onSelectChallenge,
  onActionClick,
  onAcceptChallenge,
  onDeclineChallenge,
  onViewDossier,
  onOpenChat,
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
    <div className="border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col w-full shadow-xs select-none bg-white">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-3 px-3 w-[45px] text-center">#</th>
              <th className="py-3 px-3 min-w-[210px]">Challenge / Problem</th>
              <th className="py-3 px-3 w-[150px]">Domain & Location</th>
              <th className="py-3 px-3 w-[160px]">Faculty Mentor</th>
              <th className="py-3 px-3 w-[140px]">Required Skills</th>
              <th className="py-3 px-3 w-[90px]">Priority</th>
              <th className="py-3 px-3 w-[105px]">Status</th>
              <th className="py-3 px-3 w-[80px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <div className="font-bold text-slate-600">Loading challenges from database...</div>
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-bold text-slate-600">No challenges found</div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((c, index) => {
                const isSelected = selectedChallengeId === (c.id || c.challengeId);
                const normStatus = getNormalizedStatus(c);
                const title = c.title || 'Challenge';
                const firstLetter = title.charAt(0).toUpperCase();
                const globalIndex = startIndex + index + 1;
                const loc = c.location || c.locationDetails || {};
                const panchayat = loc.panchayatOrWard || loc.gramPanchayat || 'Gram Panchayat';
                const skills = Array.isArray(c.requiredSkills) && c.requiredSkills.length > 0
                  ? c.requiredSkills
                  : typeof c.requiredSkills === 'string' && c.requiredSkills.trim()
                  ? c.requiredSkills.split(',').map((s) => s.trim())
                  : [c.domain || 'Field Research', 'Ground Innovation'];

                return (
                  <tr
                    key={c.id || c.challengeId || index}
                    onClick={() => onSelectChallenge(c)}
                    className={`hover:bg-emerald-50/30 transition-colors group select-none cursor-pointer ${
                      isSelected ? 'bg-emerald-50/60 border-l-4 border-l-[#007A61]' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3 px-3 text-center font-mono text-[11px] font-bold text-slate-400">
                      {globalIndex}
                    </td>

                    {/* Main Entity Tile */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
                          {firstLetter}
                        </div>
                        <div className="min-w-0 max-w-[210px]">
                          <div
                            className="font-extrabold text-slate-900 group-hover:text-[#007A61] text-xs truncate leading-tight transition-colors"
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
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800 text-xs truncate max-w-[140px]" title={c.domain}>
                        {c.domain}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                        {panchayat}, {c.district || 'Ranchi'}
                      </div>
                    </td>

                    {/* Faculty Mentor */}
                    <td className="py-3 px-3">
                      {c.assignedFaculty?.name ? (
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs leading-tight truncate max-w-[150px]">
                            {c.assignedFaculty.name}
                          </div>
                          <div className="text-[10px] text-emerald-800 font-semibold mt-0.5 truncate max-w-[150px]">
                            {c.assignedFaculty.department || 'Lead Faculty Mentor'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-amber-800 text-xs italic">Not Assigned Yet</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Ready for Mentor</div>
                        </div>
                      )}
                    </td>

                    {/* Required Skills */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {skills.slice(0, 2).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-[10px] font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 2 && (
                          <span className="text-[10px] font-bold text-[#007A61] self-center">
                            +{skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1.5 text-[11px] font-bold ${
                        c.priority === 'High' || c.priority === 'Critical' ? 'text-rose-600' : c.priority === 'Low' ? 'text-slate-600' : 'text-amber-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          c.priority === 'High' || c.priority === 'Critical' ? 'bg-rose-500' : c.priority === 'Low' ? 'bg-slate-400' : 'bg-amber-500'
                        }`} />
                        <span>{c.priority || 'Medium'}</span>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {normStatus === 'Accepted' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#007A61] border border-emerald-200 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#007A61] mr-1.5"></span>
                          Accepted (Active R&D)
                        </span>
                      ) : normStatus === 'Rejected' ? (
                        <span 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs"
                          title={c.declineReason || 'Declined by University'}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                          Declined
                        </span>
                      ) : normStatus === 'Clarified' ? (
                        <span 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-[#007A61] border border-emerald-300 shadow-2xs"
                          title={c.clarificationResponse ? `Clarified: ${c.clarificationResponse}` : 'Clarification provided by State Nodal Cell'}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#007A61] mr-1.5"></span>
                          Clarified by Nodal
                        </span>
                      ) : normStatus === 'Clarification Requested' ? (
                        <span 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs"
                          title={c.clarificationQuery || 'Clarification active with State Nodal Cell'}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                          Clarification Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5 animate-pulse"></span>
                          Pending Review
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {(normStatus === 'Pending' || normStatus === 'Clarified') && (
                          <>
                            <button
                              type="button"
                              onClick={() => onAcceptChallenge && onAcceptChallenge(c)}
                              className="px-2.5 py-1 bg-[#007A61] hover:bg-[#006650] text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                              title="Accept Challenge for Institutional R&D"
                            >
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeclineChallenge && onDeclineChallenge(c)}
                              className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                              title="Decline / Return Challenge"
                            >
                              <span>Decline</span>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => onOpenChat ? onOpenChat(c) : (onViewDossier ? onViewDossier(c) : onSelectChallenge(c))}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer flex items-center space-x-1 shadow-2xs border ${
                            normStatus === 'Clarification Requested'
                              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700 animate-pulse'
                              : normStatus === 'Clarified'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                          title="Open Real-time Clarification Chat with State Nodal Officer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{normStatus === 'Clarification Requested' ? '🔴 Chat' : 'Chat'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewDossier ? onViewDossier(c) : onSelectChallenge(c)}
                          className="p-1.5 text-[#007A61] hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer border border-emerald-200 shadow-2xs"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
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

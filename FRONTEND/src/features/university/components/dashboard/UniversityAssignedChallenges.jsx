import React, { useState } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, ChevronDown, Award } from 'lucide-react';

const getNormalizedStatus = (status) => {
  if (!status) return 'Pending';
  const s = String(status).toLowerCase();
  if (s.includes('accept') || s === 'completed') return 'Accepted';
  if (s.includes('reject') || s.includes('decline')) return 'Rejected';
  if (s.includes('clarif')) return 'Clarification Requested';
  return 'Pending';
};

export const UniversityAssignedChallenges = ({
  challenges = [],
  totalCount = 0,
  onActionClick,
  onViewAll
}) => {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filtered = challenges.filter((item) => {
    if (statusFilter !== 'All Status' && getNormalizedStatus(item.status) !== statusFilter) return false;
    if (domainFilter !== 'All Domains' && item.domain !== domainFilter) return false;
    if (districtFilter !== 'All Districts' && item.district !== districtFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const id = item.id || item.challengeId || '';
      return (
        item.title?.toLowerCase().includes(q) ||
        id.toLowerCase().includes(q) ||
        (item.district || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalRecords = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="border border-slate-200/90 rounded-2xl overflow-hidden flex flex-col w-full shadow-xs select-none bg-white">
      {/* Header bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#007A61]"></span>
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Assigned Grassroots Challenges
          </h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#007A61] hover:underline cursor-pointer"
        >
          View All ({filtered.length})
        </button>
      </div>

      {/* Filter bar */}
      <div className="p-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-white">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#007A61] focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value="All Status">All Status</option>
              <option value="Pending">Pending Review</option>
              <option value="Clarification Requested">Clarification Active</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Declined</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={domainFilter}
              onChange={(e) => { setDomainFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#007A61] focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value="All Domains">All Domains</option>
              <option value="Water Resources">Water Resources</option>
              <option value="Education">Education</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Environment">Environment</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Healthcare">Healthcare</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={districtFilter}
              onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-700 hover:border-[#007A61] focus:outline-none cursor-pointer appearance-none shadow-2xs"
            >
              <option value="All Districts">All Districts</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Dumka">Dumka</option>
              <option value="Gumla">Gumla</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="Jamshedpur">Jamshedpur</option>
              <option value="Hazaribagh">Hazaribagh</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search challenges..."
            className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 w-48 shadow-2xs focus:outline-none focus:border-[#007A61]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[10.5px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
              <th className="py-3 px-3 w-[45px] text-center">#</th>
              <th className="py-3 px-3 min-w-[220px]">Challenge / Problem</th>
              <th className="py-3 px-3 w-[160px]">Domain & Ground Location</th>
              <th className="py-3 px-3 w-[160px]">Faculty Mentor</th>
              <th className="py-3 px-3 w-[90px]">Priority</th>
              <th className="py-3 px-3 w-[95px]">Status</th>
              <th className="py-3 px-3 w-[70px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-bold text-slate-600">No challenges found matching filters</div>
                </td>
              </tr>
            ) : (
              paginatedItems.map((c, index) => {
                const normStatus = getNormalizedStatus(c.status);
                const title = c.title || 'Challenge';
                const firstLetter = title.charAt(0).toUpperCase();
                const globalIndex = startIndex + index + 1;
                const loc = c.location || c.locationDetails || {};
                const panchayat = loc.panchayatOrWard || loc.gramPanchayat || 'Gram Panchayat';

                return (
                  <tr
                    key={c.id || c.challengeId || index}
                    onClick={() => onActionClick && onActionClick(c)}
                    className="hover:bg-emerald-50/30 transition-colors group select-none cursor-pointer"
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
                        <div className="min-w-0 max-w-[220px]">
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

                    {/* Domain & Ground Location */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-800 text-xs truncate max-w-[150px]" title={c.domain}>
                        {c.domain}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[150px]">
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
                          <div className="text-[10px] text-slate-400 mt-0.5">Click to Assign</div>
                        </div>
                      )}
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

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1.5 text-[11px] font-extrabold ${
                          normStatus === 'Accepted'
                            ? 'text-[#007A61]'
                            : normStatus === 'Clarification Requested'
                            ? 'text-amber-700'
                            : normStatus === 'Pending'
                            ? 'text-slate-600'
                            : 'text-rose-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            normStatus === 'Accepted'
                              ? 'bg-[#007A61]'
                              : normStatus === 'Clarification Requested'
                              ? 'bg-amber-500'
                              : normStatus === 'Pending'
                              ? 'bg-slate-400 animate-pulse'
                              : 'bg-rose-500'
                          }`}
                        />
                        <span>{normStatus === 'Clarification Requested' ? 'Clarification Active' : normStatus}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => onActionClick && onActionClick(c)}
                          className="px-2.5 py-1 text-xs font-bold text-[#007A61] bg-emerald-50 hover:bg-emerald-100/80 rounded-lg border border-emerald-200 transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
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
          Showing <span className="font-bold text-slate-800">{filtered.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-800">{Math.min(startIndex + itemsPerPage, filtered.length)}</span> of{' '}
          <span className="font-bold text-slate-800">{filtered.length}</span> challenges
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

export default UniversityAssignedChallenges;

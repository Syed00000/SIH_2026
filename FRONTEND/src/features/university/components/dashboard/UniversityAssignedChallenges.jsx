import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { DashboardChallengesFilters } from './challenges/DashboardChallengesFilters.jsx';
import { DashboardChallengeRow } from './challenges/DashboardChallengeRow.jsx';
import { DashboardChallengesPagination } from './challenges/DashboardChallengesPagination.jsx';

export const getNormalizedStatus = (status) => {
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

      <DashboardChallengesFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        domainFilter={domainFilter}
        setDomainFilter={setDomainFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onFilterChange={() => setCurrentPage(1)}
      />

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
              paginatedItems.map((c, index) => (
                <DashboardChallengeRow
                  key={c.id || c.challengeId || index}
                  c={c}
                  globalIndex={startIndex + index + 1}
                  normStatus={getNormalizedStatus(c.status)}
                  onActionClick={onActionClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <DashboardChallengesPagination
        filteredCount={filtered.length}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        activePage={activePage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default UniversityAssignedChallenges;

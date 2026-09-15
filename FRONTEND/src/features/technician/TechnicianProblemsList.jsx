import React, { useState, useMemo } from 'react';
import { Search, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import { TechnicianProblemRow } from './TechnicianProblemRow.jsx';

export const TechnicianProblemsList = ({ tasks, loading, onSelectChallenge }) => {
  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filterTabs = [
    { key: 'All', label: 'All Problems' },
    { key: 'Pending', label: 'Pending Acceptance' },
    { key: 'Active', label: 'Active on Field' },
    { key: 'PendingApproval', label: 'Pending Approval' },
    { key: 'Completed', label: 'Completed & Done' }
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const isAcc = t.assignedTechnician?.status === 'Accepted';
      const isDone = t.status === 'Resolved';
      const isPendingApproval = t.assignedTechnician?.status === 'Completed' && !isDone;
      const isActive = isAcc && !isPendingApproval && !isDone;
      const isPending = !isActive && !isPendingApproval && !isDone;

      if (activeStatus === 'Pending' && !isPending) return false;
      if (activeStatus === 'Active' && !isActive) return false;
      if (activeStatus === 'PendingApproval' && !isPendingApproval) return false;
      if (activeStatus === 'Completed' && !isDone) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (t.title || '').toLowerCase().includes(q);
        const matchId = (t.challengeId || t.id || '').toLowerCase().includes(q);
        const matchLoc = (t.location?.panchayatOrWard || '').toLowerCase().includes(q);
        if (!matchTitle && !matchId && !matchLoc) return false;
      }
      return true;
    });
  }, [tasks, activeStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPriorityBadge = (p) => {
    const pr = (p || 'Medium').toLowerCase();
    if (pr === 'urgent' || pr === 'high') return 'text-rose-600 font-black uppercase tracking-wider';
    if (pr === 'medium') return 'text-amber-600 font-black uppercase tracking-wider';
    return 'text-blue-600 font-black uppercase tracking-wider';
  };

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      {/* Top Search & Filter Bar */}
      <div className="p-3 sm:p-4 bg-white rounded-none border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => { setActiveStatus(tab.key); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-none text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeStatus === tab.key ? 'bg-[#064e3b] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search problems, IDs..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-none focus:outline-hidden focus:ring-2 focus:ring-[#007A61]"
          />
        </div>
      </div>

      {/* Proper Problem List / Table View */}
      <div className="bg-white border border-slate-200 rounded-none shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold">
            Loading assigned problems...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">No problems found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeStatus === 'All'
                ? 'No civic problems currently assigned to your technician ID.'
                : `No problem statements currently in "${activeStatus}" state.`}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-3 px-3.5 font-bold w-12 text-center">#</th>
                    <th className="py-3 px-3.5 font-bold min-w-[200px]">Problem Statement</th>
                    <th className="py-3 px-3.5 font-bold">Location</th>
                    <th className="py-3 px-3.5 font-bold">Domain</th>
                    <th className="py-3 px-3.5 font-bold">Priority</th>
                    <th className="py-3 px-3.5 font-bold">Status</th>
                    <th className="py-3 px-3.5 font-bold text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedTasks.map((t, idx) => (
                    <TechnicianProblemRow
                      key={t.challengeId || t.id || t._id}
                      task={t}
                      rowNumber={(currentPage - 1) * itemsPerPage + idx + 1}
                      onSelect={onSelectChallenge}
                      getPriorityBadge={getPriorityBadge}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-slate-100">
              {paginatedTasks.map((t, idx) => (
                <TechnicianProblemRow
                  key={t.challengeId || t.id || t._id}
                  task={t}
                  rowNumber={(currentPage - 1) * itemsPerPage + idx + 1}
                  onSelect={onSelectChallenge}
                  getPriorityBadge={getPriorityBadge}
                  isMobile
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1 px-1 text-xs text-slate-500">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-none border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-none border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianProblemsList;

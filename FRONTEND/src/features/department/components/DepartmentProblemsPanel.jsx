import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, ArrowRight, MapPin, Wrench } from 'lucide-react';
import { DepartmentProblemCard } from './DepartmentProblemCard.jsx';

export const DepartmentProblemsPanel = ({ problems = [], onSelectProblem, onAssignToTech, onAssignToBudgetOfficer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const mTitle = (p.title || '').toLowerCase().includes(q);
        const mDesc = (p.description || '').toLowerCase().includes(q);
        const mId = (p.challengeId || p.id || '').toLowerCase().includes(q);
        const mSub = (p.submitter?.fullName || p.submitter?.name || '').toLowerCase().includes(q);
        if (!mTitle && !mDesc && !mId && !mSub) return false;
      }
      if (statusFilter !== 'All Status') {
        if (statusFilter === 'Resolved' && p.status !== 'Resolved') return false;
        if (statusFilter === 'In Progress' && p.status !== 'In Progress' && p.status !== 'Assigned') return false;
      }
      if (priorityFilter !== 'All Priority' && p.priority !== priorityFilter) return false;
      return true;
    });
  }, [problems, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="space-y-4 select-none text-left animate-in fade-in duration-150">
      {/* Search and Filters Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search problems by title, ID, citizen..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#007A61]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex-1 md:flex-none px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold">
            <option value="All Status">All Status</option>
            <option value="In Progress">In Progress / Active</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="flex-1 md:flex-none px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold">
            <option value="All Priority">All Priority</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {(searchTerm || statusFilter !== 'All Status' || priorityFilter !== 'All Priority') && (
            <button type="button" onClick={() => { setSearchTerm(''); setStatusFilter('All Status'); setPriorityFilter('All Priority'); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100" title="Reset Filters">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Problems List: Mobile Cards + Desktop Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-10 text-center text-slate-400 font-medium text-xs">
            No assigned civic issues match your search criteria.
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden p-3 space-y-2.5 bg-slate-50/50">
              {filtered.map((p, idx) => (
                <DepartmentProblemCard key={p.challengeId || p.id || p._id} problem={p} rowNumber={idx + 1} onSelect={onSelectProblem} onAssignTech={onAssignToTech} />
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3">Tracking ID</th>
                    <th className="py-3 px-3">Problem Statement & Domain</th>
                    <th className="py-3 px-3">Citizen & Location</th>
                    <th className="py-3 px-3 text-center">Priority</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p, idx) => {
                    const idKey = p.challengeId || p.id || p._id;
                    const locStr = [p.location?.panchayat || p.panchayat, p.location?.district || p.district || 'Ranchi'].filter(Boolean).join(', ');
                    const submitterName = p.submitter?.fullName || p.submitter?.name || 'Citizen';
                    return (
                      <tr key={idKey} onClick={() => onSelectProblem && onSelectProblem(p)} className="hover:bg-slate-50/70 transition-colors group cursor-pointer">
                        <td className="py-3 px-3 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-mono font-bold text-slate-800 text-[11px] group-hover:text-[#007A61] transition-colors">{idKey}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Assigned Problem</div>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <div className="font-bold text-slate-900 group-hover:text-[#007A61] transition-colors truncate">{p.title}</div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                            <span>{p.domain || 'Civic Infrastructure'}</span>
                            {p.assignedTechnician?.name && (
                              <span className="text-[#007A61] font-semibold bg-[#007A61]/10 px-1.5 py-0.2 rounded text-[9.5px]">Tech: {p.assignedTechnician.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 truncate">{submitterName}</div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                            <span className="truncate">{locStr}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            p.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            p.priority === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>{p.priority || 'Medium'}</span>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            p.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            p.status === 'Escalated' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>{p.status || 'Assigned'}</span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {onAssignToTech && (
                              <button type="button" onClick={(e) => { e.stopPropagation(); onAssignToTech(p); }} className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-[#007A61] text-[#007A61] hover:text-white rounded-lg font-bold text-xs transition cursor-pointer border border-teal-200">
                                <Wrench className="w-3 h-3" />
                                <span>{p.assignedTechnician?.name ? 'Reassign' : 'Assign Tech'}</span>
                              </button>
                            )}
                            <button type="button" onClick={(e) => { e.stopPropagation(); onSelectProblem && onSelectProblem(p); }} className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#007A61] text-white hover:bg-[#006651] rounded-lg font-bold text-xs transition cursor-pointer">
                              <span>Action</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentProblemsPanel;

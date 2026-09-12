import React, { useState } from 'react';
import { Search, Filter, AlertCircle, Eye, Clock, CheckCircle2, MapPin } from 'lucide-react';

export const WardProblemsPanel = ({
  challenges = [],
  loading = false,
  onSelectChallenge
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = challenges.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.challengeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'In Progress' && (c.status === 'In Progress' || c.status === 'Assigned')) ||
      c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 text-left select-none animate-in fade-in duration-150">
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-900 leading-none">Assigned Civic Grievances</h2>
          <p className="text-xs text-slate-500 mt-1">
            Ground issues escalated and assigned to this Ward by State/District Nodal Cell.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#007A61] w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['All', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st ? 'bg-white text-[#007A61] shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          Loading assigned problems...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-700">No Problems Found</p>
          <p className="text-[11px] text-slate-400">No civic issues match your current filters or have been assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((chl) => {
            const id = chl.challengeId || chl.id || chl._id;
            const isResolved = chl.status === 'Resolved';
            const isInProgress = chl.status === 'In Progress' || chl.status === 'Assigned';

            return (
              <div
                key={id}
                className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#007A61]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-left"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-900">[{chl.challengeId}]</span>
                    <h3 className="text-xs font-bold text-slate-800 hover:text-[#007A61] truncate cursor-pointer" onClick={() => onSelectChallenge(chl)}>
                      {chl.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {chl.domain}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        chl.priority === 'Critical'
                          ? 'bg-rose-50 text-rose-700'
                          : chl.priority === 'High'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {chl.priority || 'Medium'} Priority
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {chl.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap pt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {chl.location?.address || chl.location?.district || 'Ward Jurisdiction'}
                    </span>
                    {chl.assignedWard?.instructions && (
                      <span className="text-[#007A61] font-bold">
                        Nodal Directive: {chl.assignedWard.instructions}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                      isResolved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isInProgress
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {isResolved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span>{chl.status || 'Assigned'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectChallenge(chl)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View & Update</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WardProblemsPanel;

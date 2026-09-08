import React, { useState, useMemo } from 'react';
import { MapPin, Search, Eye, AlertCircle, CheckCircle2, Clock, Building2 } from 'lucide-react';

export const BlockIssuesTable = ({ challenges = [], panchayats = [], onSelectProblem, onAssign }) => {
  const [selectedPanchayat, setSelectedPanchayat] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      if (selectedPanchayat !== 'All') {
        const p = (c.location?.panchayatOrWard || c.assignedDepartment?.panchayat || '').toLowerCase();
        if (!p.includes(selectedPanchayat.toLowerCase())) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const matchTitle = (c.title || '').toLowerCase().includes(q);
        const matchDesc = (c.description || '').toLowerCase().includes(q);
        const matchId = (c.challengeId || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchId) return false;
      }
      return true;
    });
  }, [challenges, selectedPanchayat, search]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none">
      {/* Table Toolbar */}
      <div className="p-3.5 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems, keywords, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#007A61]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Gram Panchayat:</span>
          <select
            value={selectedPanchayat}
            onChange={(e) => setSelectedPanchayat(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-[#007A61]"
          >
            <option value="All">All Panchayats ({panchayats.length})</option>
            {panchayats.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Body */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <Clock className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No Civic Issues Found</h4>
          <p className="text-xs text-slate-500">No citizen grievances currently match the selected department and filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Tracking ID / Date</th>
                <th className="px-4 py-3">Problem Statement</th>
                <th className="px-4 py-3">Gram Panchayat</th>
                <th className="px-4 py-3">Submitter</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const panchayatName = c.location?.panchayatOrWard || c.assignedDepartment?.panchayat || 'Block General';
                return (
                  <tr key={c.challengeId || c._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {c.challengeId}
                      <span className="block text-[10px] font-normal text-slate-400 font-sans">
                        {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString('en-IN') : 'Recent'}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-extrabold text-slate-900 truncate">{c.title}</p>
                      <p className="text-[10.5px] text-slate-500 truncate">{c.description}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{panchayatName}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{c.submitter?.name || 'Citizen'}</span>
                      <span className="block text-[10px] text-slate-400">{c.submitter?.mobileNumber || ''}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.priority === 'Critical' ? 'bg-rose-50 text-rose-700' : c.priority === 'High' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {c.status || 'Assigned'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {onAssign && (
                          <button
                            type="button"
                            onClick={() => onAssign(c)}
                            className="px-2.5 py-1.5 bg-[#007A61] hover:bg-[#006651] text-white rounded-xl font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                          >
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Assign</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelectProblem(c)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlockIssuesTable;

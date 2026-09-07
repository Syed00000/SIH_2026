import React from 'react';
import { Eye, ArrowRight, Building2, MapPin, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export const DistrictIssuesTable = ({ challenges = [], onSelectProblem }) => {
  const getPriorityBadge = (priority = 'Medium') => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadge = (status = 'Under Review', hasDept = false) => {
    if (status === 'Resolved' || status === 'Deployed') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (hasDept || status === 'In Progress' || status === 'Assigned') {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden select-none text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3 text-center w-12">#</th>
              <th className="py-3 px-3">ID / Date</th>
              <th className="py-3 px-3">Problem Statement & Domain</th>
              <th className="py-3 px-3">Citizen / Location</th>
              <th className="py-3 px-3">Assigned Department</th>
              <th className="py-3 px-3 text-center">Priority</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {challenges.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-400 font-medium">
                  No district citizen issues found matching current criteria.
                </td>
              </tr>
            ) : (
              challenges.map((c, idx) => {
                const idKey = c.challengeId || c.id || c._id;
                const dateStr = c.submittedAt
                  ? new Date(c.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Recent';
                const submitterName = c.submitter?.fullName || c.submitter?.name || 'Local Citizen';
                const locationStr = [
                  c.location?.panchayat || c.panchayat,
                  c.location?.block || c.block,
                  c.location?.district || c.district || 'Ranchi'
                ].filter(Boolean).join(', ');
                const dept = c.assignedDepartment;

                return (
                  <tr
                    key={idKey}
                    onClick={() => onSelectProblem && onSelectProblem(c)}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-400 font-bold">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-800 text-[11px] group-hover:text-[#007A61] transition-colors">
                        {c.challengeId || idKey}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{dateStr}</div>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-bold text-slate-900 group-hover:text-[#007A61] transition-colors truncate">
                        {c.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                        <span className="font-semibold text-slate-600">{c.domain || 'Civic Infrastructure'}</span>
                        {c.description && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[150px]">{c.description}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 truncate">{submitterName}</div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                        <span className="truncate">{locationStr}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {dept?.name ? (
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 flex items-center gap-1 truncate text-[11px]">
                            <Building2 className="w-3 h-3 text-[#007A61] shrink-0" />
                            <span className="truncate">{dept.name}</span>
                          </div>
                          <span className="text-[9.5px] px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded font-medium border border-blue-100 mt-0.5 inline-block">
                            {dept.category || 'Department'}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Unassigned</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getPriorityBadge(c.priority)}`}>
                        {c.priority || 'Medium'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(c.status, Boolean(dept?.name))}`}>
                        {dept?.name ? 'Assigned' : c.status || 'Under Review'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectProblem) onSelectProblem(c);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#007A61] hover:bg-[#007A61]/10 transition-colors cursor-pointer border border-[#007A61]/20"
                      >
                        <span>View & Assign</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistrictIssuesTable;

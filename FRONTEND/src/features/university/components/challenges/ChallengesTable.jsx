import React, { useState } from 'react';
import { Droplet, GraduationCap, Route, Trash2, Leaf, HeartPulse, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { DOMAIN_BADGE_STYLES, STATUS_PILL_STYLES, PRIORITY_BADGE_STYLES } from '../../../../shared/config/designSystem.js';

const DOMAIN_ICONS = {
  Water: Droplet, Education: GraduationCap, Infrastructure: Route,
  Environment: Trash2, Agriculture: Leaf, Healthcare: HeartPulse, Energy: Sun
};

export const ChallengesTable = ({
  challenges = [],
  selectedChallengeId,
  onSelectChallenge,
  onActionClick,
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.max(1, Math.ceil(challenges.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedItems = challenges.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-slate-200 rounded-none overflow-hidden flex flex-col justify-between select-none">
      <div className="px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Challenges Roster <span className="font-mono">({challenges.length})</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10.5px]">
            <tr>
              <th className="py-2.5 px-3">Challenge ID</th>
              <th className="py-2.5 px-3">Title</th>
              <th className="py-2.5 px-3">Domain</th>
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Assigned On</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 text-xs font-bold">
                  Loading Live Challenges from Database...
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 text-xs font-bold">
                  No challenges match the active filters.
                </td>
              </tr>
            ) : (
              paginatedItems.map((c) => {
                const Icon = DOMAIN_ICONS[c.domain] || Droplet;
                const isSelected = selectedChallengeId === (c.id || c.challengeId);

                return (
                  <tr
                    key={c.id || c.challengeId}
                    onClick={() => onSelectChallenge(c)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-100 border-l-4 border-l-slate-900' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 rounded-none">
                          <Icon className="w-3 h-3" />
                        </div>
                        <span className="font-mono font-bold text-slate-900">{c.id || c.challengeId}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 max-w-[200px] truncate" title={c.title}>
                      {c.title}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-none text-[10.5px] font-semibold ${DOMAIN_BADGE_STYLES[c.domain] || 'bg-slate-100 text-slate-800'}`}>
                        {c.domain}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{c.district}</td>
                    <td className={`py-2.5 px-3 ${PRIORITY_BADGE_STYLES[c.priority] || 'text-slate-600'}`}>{c.priority}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-none text-[10.5px] font-bold ${STATUS_PILL_STYLES[c.status] || 'bg-slate-100 text-slate-800'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap font-mono">{typeof c.assignedOn === 'string' ? c.assignedOn.slice(0, 10) : '2026-05-20'}</td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick(c);
                        }}
                        className="px-2.5 py-1 rounded-none text-xs font-bold transition-colors cursor-pointer bg-slate-900 hover:bg-black text-white"
                      >
                        {c.actionText || (c.status === 'Review' ? 'Review' : 'View')}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-3.5 py-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
        <div>Showing {challenges.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, challenges.length)} of {challenges.length}</div>
        <div className="flex items-center space-x-1">
          <button
            disabled={activePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 border border-slate-200 rounded-none hover:bg-slate-100 disabled:opacity-40 text-slate-600 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
            <button
              key={pNum}
              onClick={() => setCurrentPage(pNum)}
              className={`w-5 h-5 rounded-none font-bold text-xs flex items-center justify-center cursor-pointer ${
                activePage === pNum ? 'bg-slate-900 text-white' : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {pNum}
            </button>
          ))}

          <button
            disabled={activePage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 border border-slate-200 rounded-none hover:bg-slate-100 disabled:opacity-40 text-slate-600 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengesTable;

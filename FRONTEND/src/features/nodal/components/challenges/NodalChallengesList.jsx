import React from 'react';
import { Layers, MapPin, User, Building, Eye, MessageSquare, Trash2, Send, CheckCircle2 } from 'lucide-react';

export const NodalChallengesList = ({
  loading,
  challenges = [],
  deletingId,
  onOpenDossier,
  onOpenChat,
  onQuickDelete,
  onOpenTriage
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-2xs">
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="p-4 flex items-center justify-between space-x-4 animate-pulse">
              <div className="flex items-center space-x-3 w-1/3">
                <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 bg-slate-100 rounded w-24" />
              <div className="h-4 bg-slate-100 rounded w-32" />
              <div className="h-8 bg-slate-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-lg p-12 text-center text-slate-500 space-y-2 shadow-2xs">
        <Layers className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No problem statements match criteria</h3>
        <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-2xs">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Problem Statement & ID</th>
              <th className="py-3 px-4">District & Submitter</th>
              <th className="py-3 px-4">Status & Assigned HEI</th>
              <th className="py-3 px-4 text-center">Priority</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {challenges.map((chl) => {
              const chlId = chl.challengeId || chl.id;
              const isDeleting = deletingId === chlId;
              const isDeployed = chl.status === 'Deployed' || Boolean(chl.isDeployed) || Boolean(chl.isLocked);

              return (
                <tr
                  key={chl.id || chl._id || chl.challengeId}
                  onClick={() => onOpenDossier(chl)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="space-y-1 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {chlId}
                        </span>
                        <span className="text-[9.5px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                          {chl.domain || 'General Need'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-950">
                        {chl.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {chl.description}
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{chl.location?.district || chl.district || 'Jharkhand'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{chl.submitter?.name || chl.submittedBy || 'Citizen'}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-1.5">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        isDeployed
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : chl.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : chl.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : chl.status === 'Clarification Requested'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : chl.status === 'Withdrawn'
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : chl.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {isDeployed ? '🔒 Deployed & Locked' : (chl.status || 'Under Review')}
                      </span>

                      {chl.assignedUniversity?.name && (
                        <div className="flex items-center space-x-1 text-slate-700 font-semibold text-[11px] truncate max-w-xs">
                          <Building className="w-3 h-3 text-[#047857] shrink-0" />
                          <span className="truncate">{chl.assignedUniversity.name}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <span className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-md border ${
                      chl.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : chl.priority === 'High'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : chl.priority === 'Medium'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {chl.priority || 'Medium'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenDossier(chl)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Inspect Evidence Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenChat(chl)}
                        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Direct Citizen Chat"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => onQuickDelete(e, chl)}
                        disabled={isDeleting || isDeployed}
                        className={`p-1.5 rounded-md transition-colors ${
                          isDeployed
                            ? 'text-slate-200 cursor-not-allowed'
                            : 'hover:bg-rose-50 text-slate-400 hover:text-rose-600'
                        }`}
                        title={isDeployed ? 'Deployed & Locked — Cannot delete' : 'Delete Problem'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {chl.status === 'Resolved' || chl.isDeployed ? (
                        <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-1.5 rounded-md shadow-3xs cursor-default">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Locked</span>
                        </div>
                      ) : chl.status === 'Withdrawn' ? (
                        <button
                          type="button"
                          disabled
                          className="bg-slate-100 text-slate-400 border border-slate-200 text-[11px] font-bold px-2.5 py-1.5 rounded-md cursor-not-allowed"
                        >
                          Withdrawn
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenTriage(chl)}
                          className="flex items-center space-x-1 bg-white hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-200/90 text-xs font-bold px-2.5 py-1.5 rounded-md shadow-3xs transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>{chl.assignedUniversity?.id ? 'Reassign' : 'Allocate'}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NodalChallengesList;

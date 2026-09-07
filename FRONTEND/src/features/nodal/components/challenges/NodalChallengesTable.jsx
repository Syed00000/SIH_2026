import React from 'react';
import { MapPin, User, Building, Eye, MessageSquare, Trash2, Send, CheckCircle2, Lock, AlertCircle, Layers } from 'lucide-react';
import { SkeletonTable } from '../common/NodalSkeletonLoaders.jsx';

export const NodalChallengesTable = ({
  loading,
  challenges = [],
  deletingId,
  onOpenDossier,
  onOpenChat,
  onQuickReject,
  onQuickDelete,
  onOpenTriage
}) => {
  if (loading) {
    return <SkeletonTable rows={6} cols={6} />;
  }

  if (challenges.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-12 text-center text-slate-500 space-y-2 shadow-2xs">
        <Layers className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-sm font-bold text-slate-900">No problem statements found</h3>
        <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-2xs overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar w-full">
        <table className="w-full min-w-[950px] text-left text-xs text-slate-800 divide-y divide-slate-200">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-3.5 py-3">ID / Code</th>
              <th scope="col" className="px-3.5 py-3">Problem Title & Domain</th>
              <th scope="col" className="px-3.5 py-3">Submitter / District</th>
              <th scope="col" className="px-3.5 py-3">Assigned Institution</th>
              <th scope="col" className="px-3.5 py-3">Status</th>
              <th scope="col" className="px-3.5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-medium">
            {challenges.map((chl) => {
              const chlId = chl.challengeId || chl.id;
              const isDeleting = deletingId === chlId;
              const isDeployed = chl.status === 'Deployed' || Boolean(chl.isDeployed) || Boolean(chl.isLocked);

              return (
                <tr
                  key={chlId}
                  onClick={() => onOpenDossier(chl)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* ID / Code */}
                  <td className="px-3.5 py-3 whitespace-nowrap font-mono text-[11px] font-bold text-slate-700">
                    {chl.challengeId || chl.id}
                  </td>

                  {/* Problem Title & Domain */}
                  <td className="px-3.5 py-3 max-w-xs sm:max-w-sm">
                    <div className="font-bold text-slate-900 line-clamp-1 group-hover:text-[#047857] transition-colors">
                      {chl.title}
                    </div>
                    <div className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5">
                      <span className="font-semibold text-slate-600">{chl.domain || 'General Need'}</span>
                      {chl.description && ` • ${chl.description}`}
                    </div>
                  </td>

                  {/* Submitter & District */}
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1 text-slate-800 font-semibold">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{chl.location?.district || chl.district || 'Jharkhand'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[10.5px] text-slate-500">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{chl.submitter?.name || chl.submittedBy || 'Citizen'}</span>
                    </div>
                  </td>

                  {/* Assigned Institution */}
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    {chl.assignedUniversity?.name ? (
                      <div className="flex items-center space-x-1.5 text-slate-900 font-bold">
                        <Building className="w-3.5 h-3.5 text-[#047857] shrink-0" />
                        <span className="line-clamp-1">{chl.assignedUniversity.name}</span>
                      </div>
                    ) : (
                      <span className="text-[10.5px] font-medium text-slate-400 italic">
                        Unassigned
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-3.5 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded-md border ${
                        isDeployed
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
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
                      }`}
                    >
                      {isDeployed && <Lock className="w-3 h-3 text-emerald-700" />}
                      <span>{isDeployed ? 'Deployed & Locked' : (chl.status || 'Under Review')}</span>
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td 
                    className="px-3.5 py-3 whitespace-nowrap text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => onOpenDossier(chl)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="View Details & Evidence Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenChat(chl)}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Direct Clarification Channel"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>

                      {chl.status === 'Resolved' || isDeployed ? (
                        <span className="text-[10.5px] font-bold text-emerald-700 px-2 py-1 bg-emerald-50 rounded-md border border-emerald-200">
                          ✓ Deployed
                        </span>
                      ) : chl.status === 'Withdrawn' ? (
                        <span className="text-[10.5px] font-medium text-slate-400 px-2 py-1 bg-slate-100 rounded-md border border-slate-200">
                          Withdrawn
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenTriage(chl)}
                          className="bg-[#047857] hover:bg-[#064e3b] text-white text-[10.5px] font-bold px-2.5 py-1 rounded-md transition-all shadow-2xs flex items-center space-x-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Allocate</span>
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

export default NodalChallengesTable;

import React from 'react';
import { MapPin, User, Building, Eye, MessageSquare, Trash2, Send, CheckCircle2 } from 'lucide-react';

export const NodalChallengeCard = ({
  chl,
  deletingId,
  onOpenDossier,
  onOpenChat,
  onQuickReject,
  onQuickDelete,
  onOpenTriage
}) => {
  const chlId = chl.challengeId || chl.id;
  const isDeleting = deletingId === chlId;

  return (
    <div
      onClick={() => onOpenDossier(chl)}
      className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group text-left"
    >
      <div className="space-y-2.5">
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {chl.challengeId || chl.id}
            </span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {chl.domain || 'General Need'}
            </span>
          </div>

          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
            chl.status === 'Resolved'
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
            {chl.status || 'Under Review'}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-slate-800">
            {chl.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {chl.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{chl.location?.district || chl.district || 'Jharkhand'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{chl.submitter?.name || chl.submittedBy || 'Citizen'}</span>
          </div>
        </div>

        {/* Assigned HEI Info */}
        {chl.assignedUniversity?.name && (
          <div className="p-2.5 bg-slate-50 rounded-md border border-slate-200/80 flex items-center space-x-2 text-xs">
            <Building className="w-3.5 h-3.5 text-[#047857] shrink-0" />
            <span className="font-bold text-slate-900 line-clamp-1">
              {chl.assignedUniversity.name}
            </span>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDossier(chl);
            }}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="Inspect Ground Evidence Dossier"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenChat(chl);
            }}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="Message Citizen / University"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => onQuickDelete(e, chl)}
            disabled={isDeleting}
            className="p-1.5 rounded-md hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            title="Delete Problem"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {chl.status === 'Resolved' || chl.isDeployed ? (
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-md shadow-3xs cursor-default">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>✓ Resolved & Deployed (Locked)</span>
          </div>
        ) : chl.status === 'Withdrawn' ? (
          <button
            type="button"
            disabled
            className="flex items-center space-x-1.5 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-md cursor-not-allowed shadow-3xs"
            title="Withdrawn problem statements cannot be allocated to universities"
          >
            <span>Withdrawn (Cannot Allocate)</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTriage(chl);
            }}
            className="flex items-center space-x-1.5 bg-white hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-200/90 text-xs font-bold px-3 py-1.5 rounded-md shadow-3xs transition-all"
          >
            <Send className="w-3 h-3" />
            <span>{chl.assignedUniversity?.id ? 'Reassign' : 'Allocate HEI'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NodalChallengeCard;

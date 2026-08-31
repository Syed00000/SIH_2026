import React from 'react';
import { MapPin, User, Calendar, Eye, MessageSquare, Trash2, RotateCcw, Send, CheckCircle2, Clock } from 'lucide-react';

export const UniversityProblemCard = ({
  chl,
  deletingId,
  onOpenDossier,
  onOpenChat,
  onQuickReject,
  onQuickDelete,
  onOpenEditOrReassign
}) => {
  const chlId = chl.challengeId || chl.id;
  const isDeleting = deletingId === chlId;
  const acceptance = chl.assignedUniversity?.acceptanceStatus || 'Pending Review';

  return (
    <div
      onClick={() => onOpenDossier(chl)}
      className="bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group text-left"
    >
      <div className="space-y-2.5">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {chlId}
            </span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {chl.domain || 'General Need'}
            </span>
          </div>

          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
            acceptance === 'Accepted'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : acceptance === 'Declined'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {acceptance}
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

        {/* Location & Submitter */}
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
      </div>

      {/* Action Footer */}
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
            title="Clarification Channel"
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenEditOrReassign(chl);
          }}
          className="flex items-center space-x-1.5 bg-white hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-200/90 text-xs font-bold px-3 py-1.5 rounded-md shadow-3xs transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Edit / Reassign</span>
        </button>
      </div>
    </div>
  );
};

export default UniversityProblemCard;

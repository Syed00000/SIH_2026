import React from 'react';
import { MapPin, FileText, CheckCircle2, ArrowUpRight, UserCheck, Trash2 } from 'lucide-react';

export const FacultyChallengeCard = ({
  challenge: c,
  status,
  isDeployed,
  onOpenDossier,
  onOpenDelete,
  onDraftProposal
}) => {
  const domain = c.domain || c.category || 'Innovation';
  const loc = c.location?.district || c.district || 'Jharkhand';

  return (
    <div
      className={`bg-white border rounded-2xl p-4 shadow-2xs transition-all flex flex-col justify-between space-y-3 ${
        isDeployed
          ? 'border-teal-200 bg-teal-50/20'
          : status.isAssignedToMe
          ? 'border-emerald-200 hover:border-emerald-400'
          : 'border-slate-200/90 hover:border-blue-300'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
              {c.challengeId}
            </span>
            <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {domain}
            </span>
          </div>

          {isDeployed ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-300 whitespace-nowrap shadow-2xs">
              🔒 Deployed & Locked
            </span>
          ) : status.isAssignedToMe ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200 whitespace-nowrap shadow-2xs">
              ✓ Assigned to You
            </span>
          ) : (
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 whitespace-nowrap shadow-2xs flex items-center space-x-1">
              <UserCheck className="w-3 h-3 text-blue-600" />
              <span>Allocated: {status.mentorName}</span>
            </span>
          )}
        </div>

        <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
          {c.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {c.problemStatement || c.description || 'No detailed problem statement provided.'}
        </p>

        {!status.isAssignedToMe && (
          <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-0.5">
            <div className="text-[11px] font-bold text-blue-900 flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Lead Mentor: {status.mentorName}</span>
            </div>
            <div className="text-[10px] text-blue-700">
              {status.mentorDept} &bull; Reassigned by University Nodal Cell
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
          <span className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{loc}</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onOpenDossier(c)}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-slate-500" />
            <span>Evidence Dossier</span>
          </button>

          {!isDeployed && (
            <button
              type="button"
              onClick={() => onOpenDelete(c)}
              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 rounded-xl text-[11px] font-bold transition-colors flex items-center space-x-1 cursor-pointer"
              title="Delete Problem Statement"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
              <span>Delete</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isDeployed ? (
            <div className="px-3.5 py-1.5 bg-teal-50 text-teal-800 border border-teal-300 rounded-xl text-[11px] font-bold flex items-center space-x-1 shadow-2xs">
              <span>🔒 Deployed & Certified</span>
            </div>
          ) : c.status === 'Resolved' ? (
            <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-[11px] font-bold flex items-center space-x-1 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>✓ Publicly Deployed (Locked)</span>
            </div>
          ) : status.isAssignedToMe ? (
            <button
              type="button"
              onClick={() => onDraftProposal ? onDraftProposal(c) : null}
              className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
            >
              <span>Draft Proposal & Budget</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-slate-100 border border-slate-200/80 text-slate-500 rounded-xl text-[10.5px] font-bold">
              Allocated to {status.mentorName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyChallengeCard;

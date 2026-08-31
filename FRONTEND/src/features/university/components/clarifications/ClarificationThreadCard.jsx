import React from 'react';
import { MessageSquare, Phone, Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const ClarificationThreadCard = ({
  ch,
  onOpenChat,
  onUpdateChallengeStatus,
  onAssignFaculty
}) => {
  const chlId = ch.challengeId || ch.id || 'CHL-JH-2026';
  const nodalPhone = '+91 9876543210';
  const nodalEmail = 'nodal@joharsetu.gov.in';

  const hasQuery = ch.clarificationQuery || ch.assignedUniversity?.clarificationQuery;
  const hasResponse = ch.clarificationResponse;
  const isAccepted = ch.assignedUniversity?.acceptanceStatus === 'Accepted' || ch.status === 'In Progress';
  const isDeclined = ch.assignedUniversity?.acceptanceStatus === 'Declined' || ch.status === 'Rejected';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-5 space-y-4 flex flex-col justify-between text-left">
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {chlId}
            </span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {ch.domain || 'Civil Issue'}
            </span>
          </div>

          <span
            className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border ${
              isAccepted
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isDeclined
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : hasQuery
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            {isAccepted ? 'Accepted • In R&D' : isDeclined ? 'Declined' : hasResponse ? 'Clarification Provided' : 'Discussion Open'}
          </span>
        </div>

        {/* Title */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{ch.title}</h4>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {ch.description || ch.problemStatement}
          </p>
        </div>

        {/* Location & Nodal Contact */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{ch.location?.district || ch.district || 'Jharkhand'}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-500">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{nodalEmail}</span>
          </div>
        </div>

        {/* Active Clarification Query Callout */}
        {hasQuery && (
          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs space-y-1 text-amber-900">
            <span className="font-extrabold text-[11px] block">Query from State Nodal Cell:</span>
            <p className="leading-relaxed font-medium">{hasQuery}</p>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenChat(ch)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-200 text-xs font-bold transition-colors cursor-pointer shadow-3xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Open Chat Room</span>
        </button>

        <div className="flex items-center space-x-1.5">
          {!isAccepted && onUpdateChallengeStatus && (
            <button
              onClick={() => onUpdateChallengeStatus(ch, 'Accepted')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              Accept Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClarificationThreadCard;

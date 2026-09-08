import React from 'react';
import { CheckCircle2, Clock, MapPin, Phone, AlertCircle, Wrench, Eye, User } from 'lucide-react';

export const TechnicianTaskCard = ({ challenge, onAccept, onOpenComplete, onSelectChallenge, acceptingId }) => {
  if (!challenge) return null;

  const tech = challenge.assignedTechnician || {};
  const isAccepted = tech.status === 'Accepted' || tech.status === 'Completed';
  const isCompleted = tech.status === 'Completed' || challenge.status === 'Resolved';
  const isAccepting = acceptingId === (challenge.challengeId || challenge.id);

  const loc = challenge.location || {};
  const locationText = [loc.panchayatOrWard || loc.panchayat, loc.block, loc.district || 'Ranchi'].filter(Boolean).join(', ');

  const getPriorityBadge = (p) => {
    const pr = (p || 'Medium').toLowerCase();
    if (pr === 'urgent' || pr === 'high') return 'bg-rose-100 text-rose-800 border-rose-200';
    if (pr === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-150 shadow-xs text-left ${
      isCompleted
        ? 'border-emerald-200/90 bg-emerald-50/20'
        : isAccepted
        ? 'border-blue-200 bg-blue-50/15'
        : 'border-amber-200/90 bg-amber-50/25 hover:border-amber-300'
    }`}>
      {/* Top Header: ID, Priority, Domain, Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
            {challenge.challengeId || challenge.id}
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${getPriorityBadge(challenge.priority)}`}>
            {challenge.priority || 'Medium'} Priority
          </span>
          {challenge.domain && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {challenge.domain}
            </span>
          )}
        </div>

        {/* Live Workflow Status */}
        <div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Resolved & Completed
            </span>
          ) : isAccepted ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
              <Wrench className="w-3.5 h-3.5" /> Accepted • In Progress
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full animate-pulse">
              <Clock className="w-3.5 h-3.5" /> Pending Acceptance
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="pt-3 pb-2 cursor-pointer" onClick={() => onSelectChallenge && onSelectChallenge(challenge)}>
        <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug hover:text-[#007A61] transition">
          {challenge.title}
        </h3>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {challenge.description || 'No description provided.'}
        </p>
      </div>

      {/* Location & Citizen Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] text-slate-600 py-2 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#007A61] shrink-0" />
          <span className="truncate">{locationText || 'Block Jurisdiction'}</span>
        </div>
        {challenge.citizen?.name && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Citizen: <strong>{challenge.citizen.name}</strong></span>
            {challenge.citizen.phone && isAccepted && (
              <a href={`tel:${challenge.citizen.phone}`} className="ml-1 text-[#007A61] font-bold hover:underline">
                (Call: {challenge.citizen.phone})
              </a>
            )}
          </div>
        )}
      </div>

      {/* Department Directive */}
      {tech.instructions && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-700 my-2">
          <strong className="text-slate-900 block mb-0.5">Department Directive:</strong>
          <span>"{tech.instructions}"</span>
        </div>
      )}

      {/* Completed Remarks Banner */}
      {isCompleted && tech.completionRemarks && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 my-2">
          <strong className="block font-bold">Field Remediation Summary:</strong>
          <span>"{tech.completionRemarks}"</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          {!isAccepted && (
            <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              Accepting will unlock your contact phone number for the citizen.
            </p>
          )}
          {isAccepted && !isCompleted && (
            <p className="text-[11px] text-blue-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Direct phone unlocked for citizen. Mark as Done once field work is completed.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onSelectChallenge && (
            <button
              type="button"
              onClick={() => onSelectChallenge(challenge)}
              className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          )}

          {!isAccepted && (
            <button
              type="button"
              onClick={() => onAccept(challenge)}
              disabled={isAccepting}
              className="px-4 py-2 rounded-xl bg-[#007A61] hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAccepting ? 'Accepting...' : 'Accept Problem'}</span>
            </button>
          )}

          {isAccepted && !isCompleted && (
            <button
              type="button"
              onClick={() => onOpenComplete(challenge)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark as Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianTaskCard;

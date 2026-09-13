import React from 'react';
import { X, CheckCircle2, MapPin, Phone, User, Calendar, Wrench, AlertCircle } from 'lucide-react';

export const TechnicianProblemDetailModal = ({
  challenge,
  isOpen,
  onClose,
  onAccept,
  onOpenComplete,
  onOpenReject,
  acceptingId
}) => {
  if (!isOpen || !challenge) return null;

  const tech = challenge.assignedTechnician || {};
  const isAccepted = tech.status === 'Accepted' || tech.status === 'Completed';
  const isCompleted = tech.status === 'Completed' || challenge.status === 'Resolved';
  const isAccepting = acceptingId === (challenge.challengeId || challenge.id);
  const loc = challenge.location || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
              {challenge.challengeId || challenge.id}
            </span>
            <span className="text-xs font-bold text-slate-500">• {challenge.domain || 'Civic Infrastructure'}</span>
            {isCompleted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Done</span>
            ) : isAccepted ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Active</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Pending</span>
            )}
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-snug">{challenge.title}</h2>
            <p className="text-slate-600 mt-2 leading-relaxed text-xs whitespace-pre-wrap">
              {challenge.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Location & Reported Date */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#007A61] shrink-0" />
              <span>
                <strong>Location:</strong> {loc.panchayatOrWard || loc.panchayat || 'Block Area'}, {loc.block || 'Kanke'}, {loc.district || 'Ranchi'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Reported:</strong> {new Date(challenge.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Citizen Details */}
          {challenge.citizen?.name && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="text-slate-800">
                  Citizen: <strong>{challenge.citizen.name}</strong>
                </span>
              </div>
              {challenge.citizen.phone && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Contact:</span>
                  <a href={`tel:${challenge.citizen.phone}`} className="font-mono font-bold text-blue-700 hover:underline">
                    {challenge.citizen.phone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Department Directives */}
          {tech.instructions && (
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-amber-900">
              <strong className="block font-bold mb-0.5">Department Directives:</strong>
              <span>"{tech.instructions}"</span>
            </div>
          )}

          {/* Media attachment */}
          {challenge.media && challenge.media.length > 0 && (
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 block">Citizen Evidence / Photo:</span>
              <div className="flex gap-2 overflow-x-auto py-1">
                {challenge.media.map((m, idx) => (
                  <img
                    key={idx}
                    src={m.url || m}
                    alt="Evidence"
                    className="w-28 h-20 sm:w-32 sm:h-24 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Previous Rejected Attempts */}
          {tech?.workHistory?.length > 0 && (
            <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-700">Previous Rejected Attempts</h3>
              {tech.workHistory.map((hw, idx) => (
                <div key={idx} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/70 flex gap-3 text-xs">
                  {hw.mediaUrl && (
                    <img src={hw.mediaUrl} alt="Old Proof" className="w-16 h-16 shrink-0 object-cover rounded border border-rose-200" />
                  )}
                  <div>
                    <span className="font-extrabold text-rose-800">Attempt {idx + 1}</span>
                    <p className="text-rose-900 font-medium mb-0.5">{hw.completionRemarks || 'No remarks provided.'}</p>
                    <p className="text-[10px] text-rose-600 font-semibold mb-0.5">Rejected: {hw.rejectReason}</p>
                    {hw.completedAt && <p className="text-[9.5px] text-rose-500">Submitted on: {new Date(hw.completedAt).toLocaleString('en-IN')}</p>}
                  </div>
                </div>
              ))}
              {!isCompleted && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Your previous work was rejected. Please redo the work and submit new proof.</span>
                </div>
              )}
            </div>
          )}

          {/* Status Banners */}
          {!isAccepted && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Please accept this problem assignment to unlock your contact number for citizen coordination.</span>
            </div>
          )}
          {isAccepted && !isCompleted && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
              <span>Assignment accepted and active. Once ground repair is complete, click <strong>Mark as Done</strong>.</span>
            </div>
          )}
          {isCompleted && tech.completionRemarks && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
              <strong className="block font-bold">Field Work Completed:</strong>
              <p>"{tech.completionRemarks}"</p>
              {tech.completedAt && (
                <span className="block text-[10.5px] text-emerald-700">
                  Resolved on: {new Date(tech.completedAt).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions with Accept and Mark as Done */}
        <div className="px-3 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-200/70 font-bold cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {!isAccepted && (
              <button
                type="button"
                onClick={() => { onAccept(challenge); onClose(); }}
                disabled={isAccepting}
                className="px-4 py-2 rounded-xl bg-[#007A61] hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isAccepting ? 'Accepting...' : 'Accept Problem'}</span>
              </button>
            )}

            {isAccepted && !isCompleted && (
              <>
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenReject(challenge); }}
                  className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenComplete(challenge); }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Done</span>
                </button>
              </>
            )}

            {isCompleted && challenge.status !== 'Resolved' && challenge.status !== 'Escalated' && (
              <button
                type="button"
                onClick={() => { onClose(); onOpenComplete(challenge); }}
                className="px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>Edit Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianProblemDetailModal;

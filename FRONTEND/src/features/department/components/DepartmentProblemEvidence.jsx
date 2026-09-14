import React from 'react';
import { MapPin, User } from 'lucide-react';

const formatEvidenceLevel = (ev, idx, allList) => {
  const raw = (ev?.level || '').toUpperCase().trim();
  if (raw === 'MINISTRY' || raw.includes('MINISTR') || raw === 'APEX') return 'Ministry Level Verification';
  if (raw === 'STATE') return 'State Level Verification';
  if (raw === 'DISTRICT') return 'District Level Verification';
  if (raw === 'BLOCK') return 'Block Level Verification';

  // Fallback for legacy evidence items that were all labeled WARD due to previous escalation bug
  const allSavedAsWard = allList && allList.length > 1 && allList.every(e => !e.level || e.level.toUpperCase() === 'WARD');
  if (allSavedAsWard) {
    const tName = (ev?.technicianName || '').toLowerCase();
    if (tName.includes('immu2') || idx === 2) return 'State Level Verification';
    if (tName.includes('immu') || idx === 1) return 'Block Level Verification';
    return 'Ward Level Verification';
  }

  if (raw === 'WARD') return 'Ward Level Verification';
  return `${ev?.level || 'Authority'} Level Verification`;
};

export const DepartmentProblemEvidence = ({ problem, submitter, fullAddress, techUrls, tech }) => {
  const escalatedUrls = (problem.escalationEvidence || []).flatMap(e => e.mediaUrls || []);
  const currentTechUrls = techUrls.filter(url => !escalatedUrls.includes(url));

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-2.5">
        <h2 className="text-base font-black text-slate-900">{problem.title}</h2>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
          {problem.description || 'No detailed problem description.'}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Citizen: <strong>{submitter.fullName || submitter.name || 'Citizen'}</strong></span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{fullAddress}</span>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
          Evidence Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded">Reported Problem (Citizen)</h4>
            <div className="grid grid-cols-2 gap-2">
              {problem.media?.length > 0 ? problem.media.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noreferrer" className="aspect-video md:aspect-square rounded-lg border border-slate-200 overflow-hidden hover:border-[#007A61] transition-colors block bg-slate-50">
                  <img src={m.url} alt="Citizen Evidence" className="w-full h-full object-cover" />
                </a>
              )) : (
                <div className="col-span-2 p-4 text-center text-[10px] text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  No images uploaded by citizen.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#007A61] bg-[#007A61]/10 px-2 py-1 rounded">Field Resolution Proof (Technician)</h4>
            <div className="grid grid-cols-2 gap-2">
              {currentTechUrls.length > 0 ? currentTechUrls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="aspect-video md:aspect-square rounded-lg border border-slate-200 overflow-hidden hover:border-[#007A61] transition-colors block bg-slate-50">
                  <img src={url} alt="Technician Proof" className="w-full h-full object-cover" />
                </a>
              )) : (
                <div className="col-span-2 p-4 text-center text-[10px] text-amber-600 border border-dashed border-amber-200 rounded-xl bg-amber-50">
                  Pending resolution proof from field worker.
                </div>
              )}
            </div>
          </div>
        </div>

        {tech?.completionRemarks && (
          <div className="mt-4 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide block mb-1">Technician Work Summary</span>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium">{tech.completionRemarks}</p>
          </div>
        )}

        {tech?.workHistory?.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-1">Previous Rejected Attempts</h4>
            {tech.workHistory.map((hw, idx) => (
              <div key={idx} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex gap-3">
                {hw.mediaUrl && (
                  <a href={hw.mediaUrl} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-rose-200 hover:border-rose-300 block bg-white">
                    <img src={hw.mediaUrl} alt="Old Proof" className="w-full h-full object-cover" />
                  </a>
                )}
                <div>
                  <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wide block mb-0.5">Attempt {idx + 1}</span>
                  <p className="text-xs text-rose-950 leading-relaxed font-medium mb-1">{hw.completionRemarks || 'No remarks provided.'}</p>
                  <p className="text-[10px] text-rose-600 font-medium">Rejected: {hw.rejectReason}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {problem.escalationEvidence?.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-1">Previous Authority Evidence (Escalated)</h4>
            {problem.escalationEvidence.map((ev, idx) => (
              <div key={idx} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex gap-3">
                {ev.mediaUrls && ev.mediaUrls.length > 0 && (
                  <a href={ev.mediaUrls[0]} target="_blank" rel="noreferrer" className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-blue-200 hover:border-blue-300 block bg-white">
                    <img src={ev.mediaUrls[0]} alt="Escalated Proof" className="w-full h-full object-cover" />
                  </a>
                )}
                <div>
                  <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wide block mb-0.5">
                    {formatEvidenceLevel(ev, idx, problem.escalationEvidence)}
                  </span>
                  <p className="text-xs text-blue-950 leading-relaxed font-medium mb-1">{ev.remarks || 'No remarks provided.'}</p>
                  <p className="text-[10px] text-blue-600 font-medium">Verified by: {ev.technicianName} ({new Date(ev.date).toLocaleDateString()})</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DepartmentProblemEvidence;

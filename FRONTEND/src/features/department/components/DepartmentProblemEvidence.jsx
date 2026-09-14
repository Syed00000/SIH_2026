import React from 'react';
import { MapPin, User, ExternalLink, Image as ImageIcon, CheckCircle2, Clock } from 'lucide-react';

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
      {/* Problem Header Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-2.5">
        <h2 className="text-base font-black text-slate-900">{problem.title}</h2>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
          {problem.description || 'No detailed problem description.'}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Citizen: <strong className="text-slate-800">{submitter.fullName || submitter.name || 'Citizen'}</strong></span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-slate-700">{fullAddress}</span>
          </span>
        </div>
      </div>

      {/* Side-by-Side Evidence Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#007A61]" />
            <span>Evidence Comparison</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold">Before &amp; After Remediation Proof</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* 1. Citizen Uploaded Evidence */}
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-700">1. Reported Problem (Citizen)</span>
              <span className="text-[10px] font-semibold text-slate-500">{problem.media?.length || 0} File(s)</span>
            </div>
            
            <div className="flex-1 min-h-[180px] bg-slate-50/60 rounded-xl border border-slate-200/80 p-2 flex flex-col justify-center">
              {problem.media?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {problem.media.map((m, i) => (
                    <a 
                      key={i} 
                      href={m.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="group relative rounded-lg border border-slate-200 overflow-hidden hover:border-[#007A61] transition-all block bg-white shadow-2xs max-h-52"
                      title="Click to view full image"
                    >
                      <img src={m.url} alt="Citizen Evidence" className="w-full h-44 object-contain bg-slate-900/5 group-hover:scale-102 transition-transform duration-200" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Full</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-[11px] text-slate-400 font-medium flex flex-col items-center justify-center gap-1.5">
                  <ImageIcon className="w-6 h-6 text-slate-300" />
                  <span>No images uploaded by citizen.</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Technician Resolution Proof */}
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center justify-between bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200/80">
              <span className="text-[11px] font-bold text-[#007A61]">2. Field Resolution Proof (Technician)</span>
              <span className="text-[10px] font-semibold text-emerald-800">{currentTechUrls.length} File(s)</span>
            </div>

            <div className="flex-1 min-h-[180px] bg-emerald-50/20 rounded-xl border border-dashed border-emerald-200 p-2 flex flex-col justify-center">
              {currentTechUrls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTechUrls.map((url, i) => (
                    <a 
                      key={i} 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="group relative rounded-lg border border-emerald-200 overflow-hidden hover:border-[#007A61] transition-all block bg-white shadow-2xs max-h-52"
                      title="Click to view full image"
                    >
                      <img src={url} alt="Technician Proof" className="w-full h-44 object-contain bg-slate-900/5 group-hover:scale-102 transition-transform duration-200" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Full</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-amber-700 bg-amber-50/60 rounded-lg border border-amber-200/80 flex flex-col items-center justify-center gap-1.5 m-1">
                  <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                  <span className="text-xs font-bold text-amber-900">Pending Resolution Proof</span>
                  <span className="text-[10.5px] text-amber-700 font-medium max-w-xs leading-tight">
                    Field technician has not uploaded post-repair verification photos yet.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technician Work Summary (if available) */}
        {tech?.completionRemarks && (
          <div className="mt-3 p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/90 space-y-1">
            <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Technician Work Summary &amp; Remarks</span>
            </span>
            <p className="text-xs text-emerald-950 leading-relaxed font-medium pl-5">{tech.completionRemarks}</p>
          </div>
        )}

        {/* Previous Rejected Attempts */}
        {tech?.workHistory?.length > 0 && (
          <div className="mt-3 space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-1">Previous Rejected Attempts</h4>
            {tech.workHistory.map((hw, idx) => (
              <div key={idx} className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 flex gap-3">
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

        {/* Escalation Evidence */}
        {problem.escalationEvidence?.length > 0 && (
          <div className="mt-3 space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-100 pb-1">Previous Authority Evidence (Escalated)</h4>
            {problem.escalationEvidence.map((ev, idx) => (
              <div key={idx} className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex gap-3">
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

import React from 'react';
import { MapPin, User } from 'lucide-react';

export const DepartmentProblemEvidence = ({ problem, submitter, fullAddress, techUrls, tech }) => {
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
              {techUrls.length > 0 ? techUrls.map((url, i) => (
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
      </div>
    </>
  );
};

export default DepartmentProblemEvidence;

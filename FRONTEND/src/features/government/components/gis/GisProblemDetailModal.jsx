import React from 'react';
import { X, MapPin, Calendar, Layers, AlertCircle, ShieldCheck } from 'lucide-react';

export const GisProblemDetailModal = ({ problem, onClose }) => {
  if (!problem) return null;

  const sev = (problem.severity || 'MEDIUM').toUpperCase();
  const sevColor =
    sev === 'CRITICAL'
      ? 'text-red-700 bg-red-50 border-red-200'
      : sev === 'HIGH'
      ? 'text-orange-700 bg-orange-50 border-orange-200'
      : sev === 'LOW'
      ? 'text-green-700 bg-green-50 border-green-200'
      : 'text-amber-700 bg-amber-50 border-amber-200';

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-slate-900">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
              {problem.id}
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${sevColor}`}>
              {sev} SEVERITY
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 leading-snug">
              {problem.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-slate-500 mt-2 text-[11px]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#007A61]" />
                {problem.district}{problem.block ? `, ${problem.block}` : ''}
              </span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                {problem.category}
              </span>
              {problem.submittedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(problem.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
              <span className="font-bold text-[#007A61] mt-0.5 block">
                {problem.rawStatus || problem.status}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Geo-Coordinates</span>
              <span className="font-mono text-slate-700 font-semibold mt-0.5 block">
                {problem.latitude}, {problem.longitude}
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-800 text-[11px] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#007A61] shrink-0" />
            <span>Authorized GIS summary &mdash; citizen identity and private data are protected.</span>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GisProblemDetailModal;

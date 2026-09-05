import React from 'react';
import { FlaskConical, CheckCircle2, Building2, ShieldCheck, FileCheck } from 'lucide-react';

export const PrototypeLabTestingSection = ({ approval }) => {
  const testingStages = approval?.testingStages || approval?.metadata?.testingStages || [];
  const partnerName = approval?.partnerName || approval?.requestedBy || 'Industry Research Laboratory';
  const isCompleted = approval?.testingCompleted || testingStages.every((s) => s.status === 'Completed');

  if (!testingStages.length && !approval?.testingCompleted) {
    return null;
  }

  return (
    <div className="bg-white border border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-emerald-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A61] shrink-0">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Industry Laboratory Testing Dossier
              </h4>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-black flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-[#007A61]" />
                <span>{isCompleted ? '100% Completed & Lab Verified' : 'Testing in Progress'}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Verified by Specialized Testing Partner: <strong className="text-slate-800 font-bold">{partnerName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center space-x-1">
            <Building2 className="w-3 h-3 text-[#007A61]" />
            <span>Lab Fee: ₹ 25,000 Settled</span>
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-800 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-[#007A61]" />
            <span>NABL Calibrated</span>
          </span>
        </div>
      </div>

      {/* Testing Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {testingStages.map((stage, idx) => {
          const stageDone = stage.status === 'Completed';
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                stageDone
                  ? 'bg-emerald-50/40 border-emerald-200/90'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1.5">
                <span className="font-black text-[#007A61] uppercase tracking-wide">
                  Stage {stage.stageNumber || idx + 1}
                </span>
                <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {stage.expectedDays || 'Completed'}
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                {stage.title}
              </h5>
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-2">
                {stage.description}
              </p>
              {stage.notes && (
                <div className="text-[10.5px] font-mono text-slate-700 bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="font-bold text-[#007A61] block text-[9px] uppercase">Lab Observation:</span>
                  {stage.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer sign-off notice */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-emerald-900">
          <FileCheck className="w-4 h-4 text-[#007A61] shrink-0" />
          <span className="font-medium text-[11px]">
            Testing dossier cleared all quality tolerances. Ready for university evaluation & submission to State Government.
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold text-[#007A61] shrink-0 bg-white px-2 py-1 rounded border border-emerald-200">
          STATUS: VERIFIED
        </span>
      </div>
    </div>
  );
};

export default PrototypeLabTestingSection;

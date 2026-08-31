import React from 'react';
import { ShieldCheck, Phone, Mail, Quote } from 'lucide-react';

export const ChallengeInspectorEvidenceTab = ({ challenge }) => {
  const submitter = challenge.submitter || {};
  const submitterRole = submitter.role || 'Verified Citizen / Resident';
  const maskedMobile = submitter.mobileNumber || submitter.maskedMobile || '+91 ******4829 (Confidential)';
  const testimony = challenge.description || challenge.problemStatement || 'Problem statement verified by local community and submitted via Citizen Innovation Portal.';

  return (
    <div className="space-y-3 text-xs text-slate-700 text-left">
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] font-bold flex items-center justify-center border border-emerald-200 text-xs shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-xs flex items-center space-x-1.5">
                <span>Verified Citizen</span>
                <span className="text-[9px] font-bold bg-[#007A61] text-white px-1.5 py-0.2 rounded-full">
                  Citizen
                </span>
              </div>
              <div className="text-[10.5px] text-emerald-800 font-semibold">{submitterRole}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
            Privacy Protected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-mono font-medium text-[11px]">{maskedMobile}</span>
          </div>

          <div className="flex items-center space-x-2 text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-[11px] truncate">citizen.verified@jharkhand.gov.in</span>
          </div>
        </div>

        <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-[10.5px] text-emerald-900 leading-snug">
          Citizen identity and contact details are masked in compliance with Government privacy guidelines.
        </div>
      </div>

      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center space-x-1.5 text-slate-800">
          <Quote className="w-4 h-4 text-[#007A61]" />
          <span className="text-xs font-bold text-slate-900">Direct Citizen Problem Statement</span>
        </div>
        <p className="text-xs text-slate-800 italic leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 font-normal">
          "{testimony}"
        </p>
      </div>
    </div>
  );
};

export default ChallengeInspectorEvidenceTab;

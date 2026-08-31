import React from 'react';
import { User, MapPin, Building, Calendar, ShieldCheck, AlertCircle } from 'lucide-react';

export const DossierOverviewTab = ({ challenge, submitter, formattedDate, assignedUni, acceptance }) => {
  return (
    <div className="space-y-4">
      {/* 1. Problem Statement Core */}
      <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-lg space-y-2">
        <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
          {challenge.title}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* 2. Citizen Submitter & Ground Truth Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3.5 bg-white border border-slate-200/90 rounded-lg space-y-2">
          <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs">
            <User className="w-3.5 h-3.5 text-slate-700" />
            <span>Citizen Reporter Profile</span>
          </div>
          <div className="space-y-1 text-xs text-slate-600 font-medium">
            <p><span className="text-slate-400">Name:</span> <span className="font-bold text-slate-900">{submitter.name}</span></p>
            <p><span className="text-slate-400">Role:</span> {submitter.role || 'Local Resident'}</p>
            <p><span className="text-slate-400">Submission Date:</span> {formattedDate}</p>
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200/90 rounded-lg space-y-2">
          <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs">
            <Building className="w-3.5 h-3.5 text-[#047857]" />
            <span>Assigned HEI Research Node</span>
          </div>
          <div className="space-y-1 text-xs text-slate-600 font-medium">
            <p><span className="text-slate-400">Institution:</span> <span className="font-bold text-slate-900">{assignedUni.name || 'Not Yet Assigned'}</span></p>
            <p><span className="text-slate-400">Department:</span> {assignedUni.department || 'General R&D'}</p>
            <p><span className="text-slate-400">Acceptance:</span> <span className="font-bold text-[#047857]">{acceptance}</span></p>
          </div>
        </div>
      </div>

      {/* 3. Triage & Directives If Available */}
      {challenge.triageRemarks && (
        <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-lg space-y-1">
          <span className="text-[11px] font-bold text-amber-900 block">Nodal Triage Notes:</span>
          <p className="text-xs text-amber-800 leading-relaxed font-medium">{challenge.triageRemarks}</p>
        </div>
      )}
    </div>
  );
};

export default DossierOverviewTab;

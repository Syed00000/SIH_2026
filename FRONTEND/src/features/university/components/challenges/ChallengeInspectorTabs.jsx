import React from 'react';
import { MapPin, Quote, User, Phone, Mail, CheckCircle2, AlertCircle, Building, Check, Clock } from 'lucide-react';

export const ChallengeInspectorLocationTab = ({ challenge }) => {
  const loc = challenge.location || challenge.locationDetails || {};
  const district = loc.district || challenge.district || 'Ranchi';
  const block = loc.block || 'Sadar Block';
  const panchayat = loc.panchayatOrWard || loc.ward || '';
  const landmark = loc.landmark || '';
  const fullAddress = loc.fullAddress || '';
  const coordinates = loc.coordinates || '';
  const pincode = loc.pincode || '';

  return (
    <div className="space-y-3 text-xs text-slate-700">
      <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2.5">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{district}, Jharkhand</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">Administrative Block:</span>
            <span className="font-bold text-slate-800">{block}</span>
          </div>
          {panchayat && (
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Panchayat / Ward:</span>
              <span className="font-bold text-slate-800">{panchayat}</span>
            </div>
          )}
          {landmark && (
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Landmark:</span>
              <span className="font-bold text-slate-800">{landmark}</span>
            </div>
          )}
          {pincode && (
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">PIN Code:</span>
              <span className="font-mono font-bold text-slate-800">{pincode}</span>
            </div>
          )}
          {coordinates && (
            <div className="col-span-2">
              <span className="text-slate-400 font-semibold block text-[11px]">GPS Coordinates:</span>
              <span className="font-mono font-bold text-emerald-800 text-[11px]">{coordinates}</span>
            </div>
          )}
        </div>

        {fullAddress && (
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Ground Address</span>
            <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-medium">
              {fullAddress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChallengeInspectorEvidenceTab = ({ challenge }) => {
  const submitter = challenge.submitter || {};
  const submitterName = submitter.name || challenge.submittedBy || 'Citizen Beneficiary';
  const submitterRole = submitter.role || 'Citizen';
  const mobileNumber = submitter.mobileNumber || '';
  const email = submitter.email || '';
  const organization = submitter.organization || '';
  const testimony = challenge.description || challenge.problemStatement || 'Problem statement verified by local community and submitted via Citizen Innovation Portal.';

  return (
    <div className="space-y-3 text-xs text-slate-700">
      {/* Submitter Profile Info */}
      <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-xs leading-tight">{submitterName}</div>
              <div className="text-[10.5px] text-emerald-800 font-semibold">{submitterRole}</div>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
            Verified Submitter
          </span>
        </div>

        {(mobileNumber || email || organization) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 text-slate-600">
            {mobileNumber && (
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{mobileNumber}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center space-x-1.5">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>{email}</span>
              </div>
            )}
            {organization && (
              <div className="flex items-center space-x-1.5 sm:col-span-2">
                <Building className="w-3 h-3 text-slate-400" />
                <span>{organization}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recorded Citizen Testimony */}
      <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-1.5">
        <div className="flex items-center space-x-1.5 text-slate-800">
          <Quote className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-xs font-bold text-slate-900">Direct Citizen Problem Statement</span>
        </div>
        <p className="text-xs text-slate-700 italic leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
          "{testimony}"
        </p>
      </div>

      {/* Media Attachments if any */}
      {challenge.mediaUrls && challenge.mediaUrls.length > 0 && (
        <div className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2">
          <span className="text-xs font-bold text-slate-900 block">Citizen Attached Media</span>
          <div className="grid grid-cols-2 gap-2">
            {challenge.mediaUrls.map((m, idx) => (
              <a
                key={idx}
                href={typeof m === 'string' ? m : m.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-emerald-800 hover:underline truncate bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 block"
              >
                📎 Attachment {idx + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ChallengeInspectorSimilarTab = ({ challenge }) => {
  const milestones = challenge.milestones || [];
  const assignedFaculty = challenge.assignedFaculty?.name || 'Unassigned';

  return (
    <div className="space-y-3 text-xs text-slate-700">
      {/* Live Nodal Milestone Progress */}
      <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Official Milestone Pipeline</span>
          <span className="text-[10.5px] font-bold text-emerald-800">
            {challenge.status || 'Under Review'}
          </span>
        </div>

        {milestones.length > 0 ? (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            {milestones.map((m, idx) => {
              const isDone = m.status === 'COMPLETED';
              const isCurrent = m.status === 'CURRENT';

              return (
                <div key={idx} className="flex items-start space-x-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isDone ? <Check className="w-3 h-3" /> : isCurrent ? <Clock className="w-3 h-3" /> : m.step || idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-bold leading-tight ${isDone ? 'text-slate-900' : isCurrent ? 'text-blue-900' : 'text-slate-400'}`}>
                      {m.title}
                    </div>
                    {m.description && (
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{m.description}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-2 text-slate-500 text-xs italic">
            Challenge is actively under review by Nodal Innovation Team.
          </div>
        )}
      </div>

      {/* Allocation Summary Card */}
      <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-2xs space-y-1.5">
        <div className="text-xs font-bold text-slate-900">Institutional Faculty Allocation</div>
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-500">Assigned Mentor:</span>
          <span className="font-bold text-slate-800">{assignedFaculty}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Domain Area:</span>
          <span className="font-bold text-slate-800">{challenge.domain || 'Urban & Rural Development'}</span>
        </div>
      </div>
    </div>
  );
};

export default {
  ChallengeInspectorLocationTab,
  ChallengeInspectorEvidenceTab,
  ChallengeInspectorSimilarTab
};

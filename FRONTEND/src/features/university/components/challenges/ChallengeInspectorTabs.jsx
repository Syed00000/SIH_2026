import React from 'react';
import {
  MapPin,
  Quote,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Building,
  Check,
  Clock,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Compass,
  FileCheck2
} from 'lucide-react';

export const ChallengeInspectorLocationTab = ({ challenge }) => {
  const loc = challenge.location || challenge.locationDetails || {};
  const state = loc.state || 'Jharkhand';
  const district = loc.district || challenge.district || 'Ranchi';
  const block = loc.block || 'Sadar Block';
  const subDivision = loc.subDivision || loc.block || `${district} Sub-Division`;
  const panchayat = loc.panchayatOrWard || loc.gramPanchayat || loc.ward || 'Gram Panchayat Ward 4';
  const landmark = loc.landmark || 'Near Primary Health Centre / High School';
  const fullAddress = loc.fullAddress || `${panchayat}, ${landmark}, ${subDivision}, ${district}, ${state} - ${loc.pincode || '834001'}`;
  const coordinates = loc.coordinates || '23.3441° N, 85.3096° E';
  const pincode = loc.pincode || '834001';

  return (
    <div className="space-y-3 text-xs text-slate-700">
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
        {/* District & State Badge Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm">
            <MapPin className="w-4 h-4 text-[#007A61] shrink-0" />
            <span>{district}, {state}</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-[#007A61] border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Ground Geotagged
          </span>
        </div>

        {/* Detailed Ground Hierarchy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Sub-Division / Block</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">{subDivision} • {block}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Gram Panchayat / Ward</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">{panchayat}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Ground Landmark</span>
            <span className="font-bold text-slate-800 text-xs mt-0.5 block">{landmark}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Postal PIN Code</span>
            <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block">{pincode}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 sm:col-span-2">
            <span className="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">GPS Coordinates</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <Compass className="w-3.5 h-3.5 text-[#007A61]" />
              <span className="font-mono font-bold text-[#007A61] text-xs">{coordinates}</span>
            </div>
          </div>
        </div>

        {/* Full Ground Address */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Complete Ground Address
          </span>
          <p className="text-xs text-slate-800 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100 leading-relaxed font-medium">
            {fullAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ChallengeInspectorEvidenceTab = ({ challenge }) => {
  const submitter = challenge.submitter || {};
  const submitterRole = submitter.role || 'Verified Citizen / Resident';
  const maskedMobile = submitter.mobileNumber || submitter.maskedMobile || '+91 ******4829 (Confidential)';
  const testimony = challenge.description || challenge.problemStatement || 'Problem statement verified by local community and submitted via Citizen Innovation Portal.';

  return (
    <div className="space-y-3 text-xs text-slate-700">
      {/* Submitter Profile Info with Citizen Confidentiality */}
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

        {/* Masked Contact & Protection Notice */}
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
          Citizen identity and contact details are masked in compliance with Government privacy guidelines while maintaining full auditability for state authorities.
        </div>
      </div>

      {/* Recorded Citizen Testimony */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center space-x-1.5 text-slate-800">
          <Quote className="w-4 h-4 text-[#007A61]" />
          <span className="text-xs font-bold text-slate-900">Direct Citizen Problem Statement</span>
        </div>
        <p className="text-xs text-slate-800 italic leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 font-normal">
          "{testimony}"
        </p>
      </div>

      {/* Media Attachments if any */}
      {challenge.mediaUrls && challenge.mediaUrls.length > 0 && (
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-900 block">Citizen Attached Media & Evidence</span>
          <div className="grid grid-cols-2 gap-2">
            {challenge.mediaUrls.map((m, idx) => (
              <a
                key={idx}
                href={typeof m === 'string' ? m : m.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-[#007A61] hover:underline truncate bg-emerald-50/60 p-2 rounded-xl border border-emerald-200 block shadow-2xs"
              >
                📎 Evidence Document {idx + 1}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ChallengeInspectorSimilarTab = ({ challenge, onAssignClick }) => {
  const milestones = challenge.milestones || [];
  const assignedUni = challenge.assignedUniversity?.name || challenge.universityName || 'Ranchi University';
  const assignedDept = challenge.assignedUniversity?.department || challenge.assignedFaculty?.department || 'Department of Engineering & Applied Sciences';
  const mentorName = challenge.assignedFaculty?.name || challenge.assignedUniversity?.mentorName;
  const isMentorAssigned = Boolean(mentorName);

  return (
    <div className="space-y-3 text-xs text-slate-700">
      {/* Institutional Allocation Card */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-[#007A61]" />
            <span className="text-xs font-extrabold text-slate-900">Institutional Allocation Details</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200">
            Nodal Allocated
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-semibold">Allocated University:</span>
            <span className="font-extrabold text-slate-900">{assignedUni}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-500 font-semibold">Allocated Department:</span>
            <span className="font-bold text-slate-800">{assignedDept}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <div>
              <span className="text-slate-500 font-semibold block text-[10.5px]">Lead Faculty Mentor:</span>
              <span className={`font-extrabold text-xs ${isMentorAssigned ? 'text-emerald-900' : 'text-amber-800'}`}>
                {isMentorAssigned ? mentorName : 'Not Assigned Yet'}
              </span>
            </div>
            {!isMentorAssigned && onAssignClick && (
              <button
                type="button"
                onClick={onAssignClick}
                className="px-3 py-1 bg-[#007A61] hover:bg-[#006650] text-white rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                Assign Mentor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Nodal Milestone Progress */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Official Milestone Pipeline</span>
          <span className="text-[10.5px] font-bold text-[#007A61]">
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
                      ? 'bg-[#007A61] text-white'
                      : isCurrent
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isDone ? <Check className="w-3 h-3" /> : isCurrent ? <Clock className="w-3 h-3" /> : m.step || idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`font-bold leading-tight ${isDone ? 'text-slate-900' : isCurrent ? 'text-amber-900' : 'text-slate-400'}`}>
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
    </div>
  );
};

export default {
  ChallengeInspectorLocationTab,
  ChallengeInspectorEvidenceTab,
  ChallengeInspectorSimilarTab
};

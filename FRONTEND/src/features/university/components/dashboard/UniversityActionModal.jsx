import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  AlertOctagon,
  UserPlus,
  FileText,
  Loader2,
  HelpCircle,
  MapPin,
  Building,
  GraduationCap,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';

export const UniversityActionModal = ({
  isOpen,
  onClose,
  challenge,
  universityCode = 'RU001',
  onAccept,
  onDecline,
  onAssignFaculty,
  onViewDossier
}) => {
  const [activeMode, setActiveMode] = useState('decision'); // 'decision' | 'decline_reason' | 'assign_mentor'
  const [declineReason, setDeclineReason] = useState('Laboratory instrumentation outside institute scope');
  const [customReason, setCustomReason] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadFaculty = async () => {
        setLoadingFaculty(true);
        try {
          const list = await universityApiService.getFaculty(universityCode);
          if (Array.isArray(list) && list.length > 0) {
            setFacultyList(list);
            const first = list[0];
            setSelectedFaculty(first.name);
            setDepartment(first.department || 'Civil & Environmental Engineering');
          } else {
            const fallback = [{
              name: 'Prof. Rajesh Chandra',
              department: 'Civil & Environmental Engineering',
              designation: 'Professor & HOD',
              email: 'rajesh.chandra@university.ac.in'
            }];
            setFacultyList(fallback);
            setSelectedFaculty(fallback[0].name);
            setDepartment(fallback[0].department);
          }
        } catch (err) {
          console.warn('Error loading faculty for modal:', err);
        }
        setLoadingFaculty(false);
      };
      loadFaculty();
    }
  }, [isOpen, universityCode]);

  if (!isOpen || !challenge) return null;

  const isAccepted = challenge.status === 'Accepted' || challenge.acceptanceStatus === 'Accepted';
  const isDeclined = challenge.status === 'Declined' || challenge.status === 'Rejected' || challenge.acceptanceStatus === 'Declined';
  const isPending = !isAccepted && !isDeclined;

  const loc = challenge.location || challenge.locationDetails || {};
  const district = loc.district || challenge.district || 'Ranchi';
  const state = loc.state || 'Jharkhand';
  const subDivision = loc.subDivision || loc.block || `${district} Sub-Division`;
  const panchayat = loc.panchayatOrWard || loc.gramPanchayat || loc.ward || 'Gram Panchayat Ward 4';
  const landmark = loc.landmark || 'Near Primary Health Centre / High School';
  const pincode = loc.pincode || '834001';
  const coordinates = loc.coordinates || '23.3441° N, 85.3096° E';
  const assignedUni = challenge.assignedUniversity?.name || challenge.universityName || 'Ranchi University';
  const assignedDept = challenge.assignedUniversity?.department || challenge.assignedFaculty?.department || 'Department of Applied Sciences & Engineering';
  const currentMentor = challenge.assignedFaculty?.name || challenge.assignedUniversity?.mentorName;

  const handleConfirmAccept = async () => {
    setSubmitting(true);
    if (onAccept) {
      await onAccept(challenge);
    }
    setSubmitting(false);
    onClose();
  };

  const handleConfirmDecline = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const finalReason = declineReason === 'Other' ? (customReason || 'Outside departmental research scope') : declineReason;
    if (onDecline) {
      await onDecline(challenge, finalReason);
    }
    setSubmitting(false);
    onClose();
  };

  const handleSubmitAssignMentor = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const chosen = facultyList.find((f) => f.name === selectedFaculty) || { name: selectedFaculty, department };
    if (onAssignFaculty) {
      await onAssignFaculty({
        challengeId: challenge.id || challenge.challengeId,
        facultyName: chosen.name,
        department: chosen.department || department,
        email: chosen.email || ''
      });
    }
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-extrabold text-[#007A61] bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
              {challenge.id || challenge.challengeId}
            </span>
            <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${
              isAccepted
                ? 'bg-emerald-50 text-[#007A61] border border-emerald-200'
                : isDeclined
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {isAccepted ? 'Accepted & Active R&D' : isDeclined ? 'Declined' : 'Pending Institutional Action'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5 text-xs text-slate-700 max-h-[80vh] overflow-y-auto bg-slate-50/30">
          <div>
            <h3 className="text-base font-black text-slate-900 leading-snug">{challenge.title}</h3>
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
              <span className="flex items-center space-x-1 text-slate-700 font-semibold">
                <MapPin className="w-3 h-3 text-[#007A61]" />
                <span>{district}, {state}</span>
              </span>
              <span>&bull;</span>
              <span>Domain: <strong className="text-slate-700">{challenge.domain}</strong></span>
            </div>
          </div>

          {/* Complete Ground Details Box */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-2">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              Ground Location & Submitter
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Gram Panchayat / Block</span>
                <span className="font-bold text-slate-800 text-xs block mt-0.5">{panchayat} • {subDivision}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Ground Landmark</span>
                <span className="font-bold text-slate-800 text-xs block mt-0.5">{landmark}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Citizen Submitter</span>
                <span className="font-bold text-[#007A61] text-xs flex items-center space-x-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Citizen</span>
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">PIN Code & GPS</span>
                <span className="font-mono font-bold text-slate-800 text-xs block mt-0.5">{pincode} • {coordinates}</span>
              </div>
            </div>
          </div>

          {/* Problem Statement Card */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
              Ground Problem Statement
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-normal">
              {challenge.problemStatement || challenge.description || 'Ground issue logged by citizen under Jharkhand State Innovation Hub.'}
            </p>
          </div>

          {/* Institutional Allocation Metadata */}
          <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs">
              <GraduationCap className="w-4 h-4 text-[#007A61]" />
              <span>Allocated Institution: <strong className="text-[#007A61]">{assignedUni}</strong></span>
            </div>
            <div className="text-[11px] text-slate-600">
              Allocated Department: <strong className="text-slate-800">{assignedDept}</strong>
            </div>
          </div>

          {/* MODE 1: PENDING ACCEPTANCE (Action Decision) */}
          {isPending && activeMode === 'decision' && (
            <div className="space-y-3 pt-1">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                <p className="font-semibold">
                  This problem was allocated to your university by the State Nodal Cell. Please review and accept to initiate faculty mentorship and R&D prototyping.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmAccept}
                  className="py-2.5 px-3 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Accept Challenge</span>
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setActiveMode('decline_reason')}
                  className="py-2.5 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>Decline Allocation</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: DECLINE REASON FORM */}
          {activeMode === 'decline_reason' && (
            <form onSubmit={handleConfirmDecline} className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-900">
                  Select Reason for Declining Allocation:
                </label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#007A61]"
                >
                  <option value="Laboratory instrumentation outside institute scope">Laboratory instrumentation outside institute scope</option>
                  <option value="Faculty mentoring capacity currently saturated">Faculty mentoring capacity currently saturated</option>
                  <option value="Request re-routing to specialized agricultural university (BAU)">Request re-routing to specialized agricultural university (BAU)</option>
                  <option value="Outside domain of registered faculties">Outside domain of registered faculties</option>
                  <option value="Duplicate problem already addressed in district">Duplicate problem already addressed in district</option>
                  <option value="Other">Other (Specify below)</option>
                </select>
              </div>

              {declineReason === 'Other' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">Detailed Reason:</label>
                  <textarea
                    required
                    rows={2}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Provide justification for State Nodal Cell reallocation..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#007A61] resize-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveMode('decision')}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Decline & Notify Nodal</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: ALREADY ACCEPTED -> ASSIGN FACULTY MENTOR */}
          {isAccepted && (
            <div className="space-y-3 pt-1">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[#007A61] font-extrabold text-xs block">Challenge Accepted by University</span>
                  <span className="text-emerald-800 text-[11px]">
                    {currentMentor ? `Lead Faculty Mentor: ${currentMentor}` : 'Ready for Faculty Mentor Assignment'}
                  </span>
                </div>
                <Check className="w-5 h-5 text-[#007A61]" />
              </div>

              <form onSubmit={handleSubmitAssignMentor} className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-extrabold text-slate-900 mb-1.5">
                    Assign Registered Faculty Mentor to Lead Solution:
                  </label>
                  {loadingFaculty ? (
                    <div className="p-2.5 text-xs text-slate-500 bg-slate-50 rounded-xl">Loading registered faculty members...</div>
                  ) : (
                    <select
                      value={selectedFaculty}
                      onChange={(e) => {
                        setSelectedFaculty(e.target.value);
                        const matched = facultyList.find((f) => f.name === e.target.value);
                        if (matched && matched.department) {
                          setDepartment(matched.department);
                        }
                      }}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:border-[#007A61] shadow-2xs"
                    >
                      {facultyList.map((f, idx) => (
                        <option key={idx} value={f.name}>
                          {f.name} &bull; {f.department || 'Applied Engineering'} ({f.designation || 'Faculty Lead'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  {onViewDossier && (
                    <button
                      type="button"
                      onClick={() => { onClose(); onViewDossier(challenge); }}
                      className="text-xs font-bold text-[#007A61] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Full Investigation Dossier & PDF</span>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#007A61] hover:bg-[#006650] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ml-auto shadow-2xs"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Mentor</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODE 4: ALREADY DECLINED */}
          {isDeclined && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 text-rose-900">
              <span className="font-extrabold text-xs block">Challenge Returned to State Nodal Cell</span>
              <p className="text-[11px]">
                Reason: <strong>{challenge.declineReason || 'Outside departmental research scope'}</strong>
              </p>
              <p className="text-[10.5px] text-rose-700">
                State Nodal Authority is reviewing this challenge for reallocation to another Higher Education Institution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityActionModal;

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Building,
  User,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Check,
  Send,
  Trash2,
  RefreshCw,
  RotateCcw,
  Layers,
  GraduationCap
} from 'lucide-react';
import { universityService } from '../../government/services/universityService.js';
import { citizenService } from '../../citizen/services/citizenService.js';
import apiClient from '../../../infrastructure/api/client.js';

const DOMAIN_OPTIONS = [
  'Water Resources',
  'Agriculture',
  'Healthcare',
  'Education',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
  'Other'
];

const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];
const VERIFICATION_OPTIONS = [
  { value: 'Verified', label: 'Verified & Approved for HEI R&D', color: 'emerald' },
  { value: 'Under Review', label: 'Under Review / Initial Screening', color: 'amber' },
  { value: 'Needs Clarification', label: 'Needs Field Clarification', color: 'blue' },
  { value: 'Rejected', label: 'Reject Challenge (Out of Scope)', color: 'rose' }
];

export const NodalAssignModal = ({
  isOpen,
  onClose,
  challenge: initialChallenge,
  targetUniversity,
  onSuccess
}) => {
  const [universities, setUniversities] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Active Selected Challenge State
  const [activeChallenge, setActiveChallenge] = useState(initialChallenge || null);
  const [selectedChallengeId, setSelectedChallengeId] = useState('');

  // Form states
  const [verificationStatus, setVerificationStatus] = useState('Verified');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  const [selectedUniCode, setSelectedUniCode] = useState('');
  const [targetDepartment, setTargetDepartment] = useState('');
  const [nodalRemarks, setNodalRemarks] = useState('');
  const [clarificationResponse, setClarificationResponse] = useState('');
  const [acceptanceStatus, setAcceptanceStatus] = useState('Pending Review');
  const [errorMsg, setErrorMsg] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isUniversityTargetMode = Boolean(targetUniversity);

  // Load live universities & challenges from MongoDB
  const loadData = async () => {
    setLoadingData(true);
    try {
      const [uniRes, chlRes] = await Promise.all([
        universityService.getUniversities({ limit: 100 }),
        citizenService.fetchChallenges({ limit: 150 })
      ]);

      const unis = uniRes?.records || [];
      const chls = chlRes?.challenges || (Array.isArray(chlRes) ? chlRes : []) || [];

      setUniversities(unis);
      setAllChallenges(chls);

      if (isUniversityTargetMode) {
        // In University Target Mode, select the first available challenge or initial challenge
        const firstChl = initialChallenge || chls.find((c) => !c.assignedUniversity?.id && c.status !== 'Resolved') || chls[0];
        if (firstChl) {
          setActiveChallenge(firstChl);
          setSelectedChallengeId(firstChl.challengeId || firstChl.id);
        }
        setSelectedUniCode(targetUniversity.code || targetUniversity.aisheCode);
      } else if (initialChallenge) {
        setActiveChallenge(initialChallenge);
        setSelectedChallengeId(initialChallenge.challengeId || initialChallenge.id);
        setSelectedUniCode(initialChallenge.assignedUniversity?.id || (unis[0]?.code || ''));
      }
    } catch (err) {
      console.warn('Error loading modal data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, targetUniversity, initialChallenge]);

  // Sync state whenever activeChallenge changes
  useEffect(() => {
    if (activeChallenge) {
      setSelectedDomain(activeChallenge.domain || 'Water Resources');
      setSelectedPriority(activeChallenge.priority || 'Medium');
      if (!isUniversityTargetMode) {
        setSelectedUniCode(activeChallenge.assignedUniversity?.id || (universities[0]?.code || ''));
      }
      setTargetDepartment(activeChallenge.assignedUniversity?.department || '');
      setVerificationStatus(activeChallenge.status === 'Rejected' ? 'Rejected' : 'Verified');
      setAcceptanceStatus(
        activeChallenge.assignedUniversity?.acceptanceStatus ||
        activeChallenge.acceptanceStatus ||
        'Pending Review'
      );
      setNodalRemarks(
        activeChallenge.milestones?.[1]?.remarks ||
        activeChallenge.governmentRemarks ||
        ''
      );
      setClarificationResponse(activeChallenge.clarificationResponse || '');
      setErrorMsg('');
      setIsConfirmingDelete(false);
    }
  }, [activeChallenge, universities, isUniversityTargetMode]);

  if (!isOpen) return null;

  const handleChallengeChange = (chlId) => {
    setSelectedChallengeId(chlId);
    const found = allChallenges.find((c) => (c.challengeId || c.id) === chlId);
    if (found) {
      setActiveChallenge(found);
    }
  };

  const isReassignment = !isUniversityTargetMode && Boolean(activeChallenge?.assignedUniversity?.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      let targetUniObj = null;

      if (isUniversityTargetMode) {
        targetUniObj = targetUniversity;
      } else {
        targetUniObj = universities.find(
          (u) => (u.code || u.universityCode || u.aisheCode)?.toUpperCase() === selectedUniCode?.toUpperCase()
        );
      }

      if (!targetUniObj && verificationStatus !== 'Rejected') {
        throw new Error('Please select a valid Higher Education Institution.');
      }

      if (!activeChallenge) {
        throw new Error('Please select a citizen problem statement to allocate.');
      }

      const challengeId = activeChallenge.challengeId || activeChallenge.id;

      const payload = {
        domain: selectedDomain,
        priority: selectedPriority,
        status: verificationStatus === 'Rejected' ? 'Rejected' : 'In Progress',
        acceptanceStatus: acceptanceStatus === 'Declined' || verificationStatus === 'Rejected' ? 'Declined' : acceptanceStatus,
        assignedUniversity: targetUniObj
          ? {
              id: targetUniObj.code || targetUniObj.aisheCode,
              name: targetUniObj.name || targetUniObj.legalName,
              department: targetDepartment,
              mentorName: activeChallenge.assignedUniversity?.mentorName || activeChallenge.assignedFaculty?.name || '',
              acceptanceStatus: acceptanceStatus === 'Declined' ? 'Declined' : 'Pending Review'
            }
          : null,
        remarks: nodalRemarks
      };

      const res = await apiClient.patch(`citizen/challenges/${challengeId}/triage`, payload);

      if (onSuccess) {
        onSuccess(res?.data?.data || res?.data || payload);
      }
      onClose();
    } catch (err) {
      console.error('Nodal triage submission failed:', err);
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to save triage update.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!activeChallenge) return;
    setDeleting(true);
    try {
      const challengeId = activeChallenge.challengeId || activeChallenge.id;
      await citizenService.deleteChallenge(challengeId);
      if (onSuccess) {
        onSuccess({ deleted: true, challengeId });
      }
      onClose();
    } catch (err) {
      console.error('Delete challenge failed:', err);
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to delete problem statement.');
    } finally {
      setDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150 select-none overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#047857] flex items-center justify-center border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight flex items-center space-x-2">
                <span>
                  {isUniversityTargetMode
                    ? `Allocate Problem to ${targetUniversity.name}`
                    : isReassignment
                    ? 'Reassign / Triage Problem Statement'
                    : 'Triage & Allocate Problem Statement'}
                </span>
                {isUniversityTargetMode ? (
                  <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-200">
                    Target HEI Locked
                  </span>
                ) : isReassignment ? (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded border border-amber-200">
                    Reassignment Mode
                  </span>
                ) : null}
              </h2>
              <p className="text-[11.5px] text-slate-500 font-medium">
                State Nodal Authority &bull; Official Allocation Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Locked University Banner (when allocating from University view) */}
          {isUniversityTargetMode && (
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-950 flex items-start space-x-3">
              <GraduationCap className="w-5 h-5 text-[#047857] shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xs text-slate-900">
                    {targetUniversity.name} ({targetUniversity.code || targetUniversity.aisheCode})
                  </span>
                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100/70 px-2 py-0.2 rounded">
                    {targetUniversity.district || 'Jharkhand'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Select a citizen problem statement below to assign to this university's R&D department.
                </p>
              </div>
            </div>
          )}

          {/* Problem Statement Selector (Mode B: University View) */}
          {isUniversityTargetMode && (
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                1. Select Citizen Problem Statement to Allocate <span className="text-rose-600">*</span>
              </label>
              {loadingData ? (
                <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#047857]" />
                  <span>Loading live citizen problem statements from State Registry...</span>
                </div>
              ) : allChallenges.length === 0 ? (
                <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500">
                  No citizen problem statements found in database.
                </div>
              ) : (
                <select
                  value={selectedChallengeId}
                  onChange={(e) => handleChallengeChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#047857] shadow-2xs cursor-pointer"
                >
                  {allChallenges.map((c) => {
                    const id = c.challengeId || c.id;
                    const assigned = c.assignedUniversity?.name ? `[Assigned: ${c.assignedUniversity.name}]` : '[Unassigned]';
                    return (
                      <option key={id} value={id}>
                        {id} - {c.title} ({c.location?.district || c.district || 'Ranchi'}) {assigned}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>
          )}

          {/* Active Citizen Problem Preview Card */}
          {activeChallenge ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-800 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200">
                    {activeChallenge.challengeId || activeChallenge.id}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {activeChallenge.domain || 'Infrastructure'}
                  </span>
                </div>
                <span className="text-slate-500 font-bold flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-[#047857]" />
                  <span>{activeChallenge.location?.district || activeChallenge.district || 'Ranchi'}, Jharkhand</span>
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                {activeChallenge.title}
              </h4>
              <p className="text-slate-600 text-xs italic bg-white p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                "{activeChallenge.description || activeChallenge.problemStatement}"
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center space-x-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Submitter: <strong>{activeChallenge.submitter?.name || activeChallenge.submittedBy || 'Citizen'}</strong></span>
                </span>
                <span className="font-mono text-slate-400">&bull;</span>
                <span>Mobile: <strong>{activeChallenge.submitter?.mobileNumber || 'Verified Citizen'}</strong></span>
              </div>
            </div>
          ) : null}

          {/* 1. Verification & Screening Status */}
          <div>
            <label className="font-bold text-slate-900 block mb-1.5">
              {isUniversityTargetMode ? '2. Verification Status' : '1. Ground Problem Verification Status'}{' '}
              <span className="text-rose-600">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {VERIFICATION_OPTIONS.map((opt) => {
                const isSelected = verificationStatus === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => setVerificationStatus(opt.value)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#047857] bg-emerald-50/50 text-[#064e3b] font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-xs">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#047857]" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Domain & Priority Reclassification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                {isUniversityTargetMode ? '3. Domain Classification' : '2. Thematic Domain Classification'}{' '}
                <span className="text-rose-600">*</span>
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#047857] shadow-2xs cursor-pointer"
              >
                {DOMAIN_OPTIONS.map((dom) => (
                  <option key={dom} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">
                {isUniversityTargetMode ? '4. Severity Priority' : '3. Severity & Problem Priority'}{' '}
                <span className="text-rose-600">*</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {PRIORITY_OPTIONS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedPriority === p
                        ? p === 'Critical' || p === 'High'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-[#047857] text-white border-[#047857] shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. University Selection (Only in Challenge-first mode) */}
          {!isUniversityTargetMode && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  4. Select University / HEI for R&D <span className="text-rose-600">*</span>
                </label>
                {loadingData ? (
                  <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#047857]" />
                    <span>Loading live HEI directory from State Records...</span>
                  </div>
                ) : (
                  <select
                    value={selectedUniCode}
                    onChange={(e) => setSelectedUniCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#047857] shadow-2xs cursor-pointer font-sans"
                  >
                    {universities.length === 0 ? (
                      <option value="">No HEIs found in database (Add via Admin Portal)</option>
                    ) : (
                      universities.map((u) => (
                        <option key={u.code} value={u.code}>
                          {u.name} ({u.code}) - {u.district}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">
                  Target Department / Innovation Lab
                </label>
                <input
                  type="text"
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  placeholder="e.g. Water Resources Engineering / Agritech Lab"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#047857] shadow-2xs"
                />
              </div>
            </div>
          )}

          {/* If University Target Mode, show Target Department input directly */}
          {isUniversityTargetMode && (
            <div>
              <label className="font-bold text-slate-900 block mb-1">
                5. Target Department / Faculty Lab in {targetUniversity.shortName || targetUniversity.name}
              </label>
              <input
                type="text"
                value={targetDepartment}
                onChange={(e) => setTargetDepartment(e.target.value)}
                placeholder="e.g. Department of Civil Engineering / Water Lab"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#047857] shadow-2xs"
              />
            </div>
          )}

          {/* 4. University Acceptance Status Selection */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              HEI Initial Acceptance State
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setAcceptanceStatus('Pending Review')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  acceptanceStatus === 'Pending Review'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Pending HEI Review
              </button>
              <button
                type="button"
                onClick={() => setAcceptanceStatus('Accepted')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  acceptanceStatus === 'Accepted'
                    ? 'bg-emerald-50 border-emerald-300 text-[#064e3b] shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Mark Directly Accepted
              </button>
            </div>
          </div>

          {/* 4. State Nodal Directives & Remarks */}
          <div>
            <label className="font-bold text-slate-900 block mb-1">
              {isUniversityTargetMode ? '3. State Nodal Allocation Remarks' : '4. State Nodal Directives & Allocation Remarks'}
            </label>
            <textarea
              rows={2}
              value={nodalRemarks}
              onChange={(e) => setNodalRemarks(e.target.value)}
              placeholder="Enter directives, research instructions, or rationale for university R&D team and citizen update..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#047857] shadow-2xs"
            />
            <span className="text-[10.5px] text-slate-400 block mt-1">
              These remarks will be saved to official records and immediately updated on the citizen's live tracking milestone.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            {/* Left: Delete / Dismiss Problem Statement Button */}
            <div>
              {activeChallenge && (
                isConfirmingDelete ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-rose-700">Confirm permanent deletion?</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      {deleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer transition-colors flex items-center space-x-1"
                    title="Delete or dismiss rejected / invalid problem statement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete / Dismiss Problem</span>
                  </button>
                )
              )}
            </div>

            {/* Right: Cancel & Save Buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-5 py-2 rounded-xl text-white text-xs font-extrabold shadow-sm transition-all duration-150 cursor-pointer flex items-center space-x-1.5 disabled:opacity-50 ${
                  verificationStatus === 'Rejected'
                    ? 'bg-rose-700 hover:bg-rose-800'
                    : 'bg-[#047857] hover:bg-[#064e3b]'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {submitting
                    ? 'Saving...'
                    : verificationStatus === 'Rejected'
                    ? 'Confirm Rejection & Close'
                    : isUniversityTargetMode
                    ? `Allocate to ${targetUniversity.shortName || targetUniversity.name}`
                    : isReassignment
                    ? 'Confirm Problem Reassignment'
                    : 'Save Triage & Allocate Problem'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodalAssignModal;

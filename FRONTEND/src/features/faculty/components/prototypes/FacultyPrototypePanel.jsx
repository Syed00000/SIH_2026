import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, Lock, Send, CheckCircle2, Save, AlertCircle, Clock,
  FlaskConical, TestTube2, ShieldCheck, Rocket, ChevronRight, Sparkles,
  Trash2
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { facultyApiService } from '../../services/facultyApiService.js';

const PHASES = [
  { key: 'labDesign',    label: 'Lab Design',    icon: FlaskConical, color: 'amber' },
  { key: 'fieldTest',    label: 'Field Test',    icon: TestTube2,    color: 'blue' },
  { key: 'stateCert',    label: 'State Cert',    icon: ShieldCheck,  color: 'purple' },
  { key: 'publicDeploy', label: 'Public Deploy', icon: Rocket,       color: 'emerald' },
];

const PHASE_COLORS = {
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-700',   activeBg: 'bg-amber-500',   ring: 'ring-amber-500/30' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-700',    activeBg: 'bg-blue-500',    ring: 'ring-blue-500/30' },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-700',  activeBg: 'bg-purple-500',  ring: 'ring-purple-500/30' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200',text: 'text-emerald-700', activeBg: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
};

export const FacultyPrototypePanel = ({
  project,
  faculty,
  onRefresh
}) => {
  const [activePhase, setActivePhase] = useState(0);
  const [phaseData, setPhaseData] = useState({
    labDesign:    '',
    fieldTest:    '',
    stateCert:    '',
    publicDeploy: '',
  });
  const [timeline, setTimeline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize from project data
  useEffect(() => {
    if (project?.prototypeData?.phases) {
      setPhaseData(prev => ({ ...prev, ...project.prototypeData.phases }));
    } else if (project?.prototypeData?.content) {
      // Legacy: put old content into labDesign
      setPhaseData(prev => ({ ...prev, labDesign: project.prototypeData.content }));
    }
    if (project?.prototypeData?.timeline) {
      setTimeline(project.prototypeData.timeline);
    }
  }, [project?.prototypeData]);

  const isFunded = project && project.disbursedAmount && project.disbursedAmount !== '0' && project.disbursedAmount !== '₹ 0';
  const currentStatus = project?.prototypeStatus || 'Not Started';
  const isLocked = currentStatus === 'In Review' || currentStatus === 'Approved';
  const needsChanges = currentStatus === 'Changes Required';
  const isRejected = currentStatus === 'Rejected';

  const updatePhase = (key, value) => {
    setPhaseData(prev => ({ ...prev, [key]: value }));
  };

  const getCompletedPhases = () => {
    return PHASES.filter(p => {
      const val = phaseData[p.key];
      return val && val.replace(/<[^>]*>/g, '').trim().length > 0;
    }).length;
  };

  const hasAnyContent = () => {
    return Object.values(phaseData).some(v => v && v.replace(/<[^>]*>/g, '').trim().length > 0);
  };

  const handleSaveDraft = async () => {
    if (isLocked) return;
    setSaving(true);
    try {
      await facultyApiService.savePrototypeDraft(project.projectId || project.challengeId, {
        phases: phaseData,
        content: phaseData.labDesign,
        timeline,
        facultyEmail: faculty.email,
        facultyName: faculty.name
      });
      setSaveSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save prototype draft:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (isLocked) return;
    setSubmitting(true);
    try {
      await facultyApiService.submitPrototype(project.projectId || project.challengeId, {
        phases: phaseData,
        content: phaseData.labDesign,
        timeline,
        facultyEmail: faculty.email,
        facultyName: faculty.name
      });
      setSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to submit prototype:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (isLocked) return;
    setSaving(true);
    try {
      await facultyApiService.deletePrototypeDraft(project.projectId || project.challengeId);
      setPhaseData({ labDesign: '', fieldTest: '', stateCert: '', publicDeploy: '' });
      setTimeline('');
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Failed to delete prototype draft:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isFunded && currentStatus === 'Not Started') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Prototype Lab Locked</h2>
        <p className="text-sm text-slate-500 text-center max-w-md">
          Prototyping phase unlocks automatically once Government Sanctioned Funds are disbursed for this project.
        </p>
      </div>
    );
  }

  const phase = PHASES[activePhase];
  const colors = PHASE_COLORS[phase.color];
  const PhaseIcon = phase.icon;
  const completed = getCompletedPhases();

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      {/* Revision Required Alert */}
      {needsChanges && (
        <div className="flex items-center space-x-3 p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl shadow-2xs">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider">University Requested Revisions — Editor Unlocked</h3>
            <p className="text-[11px] font-medium opacity-90">
              Please update the 4 prototype phases below according to the university's evaluation and re-submit for review.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-amber-200 text-amber-900 rounded-lg text-[10px] font-extrabold uppercase">
            Editable
          </span>
        </div>
      )}

      {/* Rejected Alert */}
      {isRejected && (
        <div className="flex items-center space-x-3 p-4 bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl shadow-2xs">
          <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider">Prototype Submission Rejected — Editor Unlocked</h3>
            <p className="text-[11px] font-medium opacity-90">
              The previous submission was rejected. You can edit the 4 phases below and submit a fresh prototype blueprint.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-rose-200 text-rose-900 rounded-lg text-[10px] font-extrabold uppercase">
            Editable
          </span>
        </div>
      )}

      {/* State Certified / Approved Alert */}
      {(project.governmentStatus === 'Approved' || project.status === 'Completed') ? (
        <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl shadow-2xs">
          <CheckCircle2 className="w-6 h-6 text-[#007A61] shrink-0" />
          <div className="flex-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#007A61]">
              ✓ Official State Certified (TRL-9) & Publicly Deployed
            </h3>
            <p className="text-[11px] font-medium text-emerald-900">
              Department of Higher & Technical Education (DHTE) has validated all 4 stages. Originating citizen problem statement is now marked as <strong>RESOLVED</strong>.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-black">
            TRL-9 Certified
          </span>
        </div>
      ) : currentStatus === 'Approved' ? (
        <div className="flex items-center space-x-3 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl shadow-2xs">
          <CheckCircle2 className="w-6 h-6 text-[#007A61] shrink-0" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider">Prototype Blueprint Approved by University</h3>
            <p className="text-[11px] font-medium opacity-90">
              Your prototype has been successfully approved by the University Authority and forwarded to Government for State TRL-9 certification.
            </p>
          </div>
        </div>
      ) : null}

      {/* Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-[#007A61]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
              Prototype Blueprint Lab
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Document across 4 lifecycle phases for University Review and Industry matching.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-extrabold px-3 py-1.5 bg-emerald-50 text-[#007A61] border border-emerald-200 rounded-xl">
            Active: Phase {activePhase + 1} of 4 ({completed}/4 Documented)
          </span>
          <span className={`text-[10px] font-extrabold px-3 py-1.5 border rounded-xl shadow-xs uppercase ${
            currentStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            currentStatus === 'In Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            needsChanges ? 'bg-amber-50 text-amber-700 border-amber-200' :
            isRejected ? 'bg-rose-50 text-rose-700 border-rose-200' :
            'bg-slate-50 text-slate-700 border-slate-200'
          }`}>
            Status: {currentStatus === 'Not Started' ? 'Drafting' : currentStatus}
          </span>
        </div>
      </div>

      {/* ── 4-Phase Stepper Tabs ── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-200">
          {PHASES.map((p, i) => {
            const isActive = i === activePhase;
            const pColors = PHASE_COLORS[p.color];
            const phaseContent = phaseData[p.key];
            const isDone = phaseContent && phaseContent.replace(/<[^>]*>/g, '').trim().length > 0;

            return (
              <button
                key={p.key}
                onClick={() => setActivePhase(i)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${
                  isActive
                    ? `${pColors.bg} ${pColors.text} ${pColors.border} border-b-2`
                    : isDone
                    ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-b-2 border-transparent'
                    : 'bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-b-2 border-transparent'
                }`}
              >
                {isActive && (
                  <Sparkles className="w-3 h-3 animate-pulse opacity-70" />
                )}
                {isDone && !isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
                <span className="font-extrabold">{i + 1}. {p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Phase Content */}
        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Editor */}
            <div className="lg:col-span-2 space-y-4">
              {/* Timeline (only on Lab Design phase) */}
              {activePhase === 0 && (
                <div className="flex flex-col space-y-1.5 pb-4 border-b border-slate-100">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#007A61]" />
                    <span>Estimated Prototype Delivery Timeline *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 45 Days, 3 Months, By Q3 2026..."
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    disabled={isLocked}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white disabled:opacity-70 shadow-2xs"
                  />
                </div>
              )}

              {/* Rich Text Editor for the active phase */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                  <PhaseIcon className={`w-3.5 h-3.5 ${colors.text}`} />
                  <span>Phase {activePhase + 1}: {phase.label} — Documentation</span>
                </label>
                <div className={`bg-white rounded-xl overflow-hidden ${isLocked ? 'opacity-70 pointer-events-none' : ''}`}>
                  <ReactQuill
                    theme="snow"
                    value={phaseData[phase.key]}
                    onChange={(val) => updatePhase(phase.key, val)}
                    readOnly={isLocked}
                    placeholder={`Document Phase ${activePhase + 1} (${phase.label}): technical architecture, laboratory simulations, test results, field parameters...`}
                    className="bg-slate-50 border-none"
                    style={{ minHeight: '280px' }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Actions & Info */}
            <div className="space-y-4">
              {/* Phase Progress Card */}
              <div className={`${colors.bg} border ${colors.border} rounded-2xl p-4 space-y-3`}>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg ${colors.activeBg} flex items-center justify-center`}>
                    <PhaseIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-extrabold uppercase tracking-wider ${colors.text}`}>
                      Phase {activePhase + 1} of 4
                    </h4>
                    <p className="text-[10px] font-bold text-slate-600">{phase.label}</p>
                  </div>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.activeBg} transition-all duration-500`}
                    style={{ width: `${((activePhase + 1) / 4) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-600">
                  <span>Current Step: {activePhase + 1}/4</span>
                  <span>{completed}/4 Documented</span>
                </div>
              </div>

              {/* Navigation Stepper Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActivePhase(Math.max(0, activePhase - 1))}
                  disabled={activePhase === 0}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                >
                  ← Previous Phase
                </button>
                {activePhase < 3 ? (
                  <button
                    onClick={() => setActivePhase(activePhase + 1)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#007A61] hover:bg-[#00604c] text-white transition-all cursor-pointer shadow-2xs flex items-center justify-center space-x-1"
                  >
                    <span>Next Phase ({activePhase + 2}/4) →</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLocked || submitting || !hasAnyContent()}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-2xs flex items-center justify-center space-x-1 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit (4/4)</span>
                  </button>
                )}
              </div>

              {/* Draft & Submit Box */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Draft & Final Submission
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  You can save drafts anytime. Once you reach Phase 4 and complete documentation, submit the full blueprint to the University.
                </p>

                <div className="space-y-2 pt-1">
                  {!isLocked && (
                    <button
                      onClick={handleSaveDraft}
                      disabled={saving || submitting || !hasAnyContent()}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-2 border cursor-pointer ${
                        saveSuccess
                          ? 'bg-emerald-50 border-emerald-200 text-[#007A61]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-50'
                      }`}
                    >
                      {saving ? (
                        <span>Saving...</span>
                      ) : saveSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#007A61]" />
                          <span>Draft Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Progress Draft</span>
                        </>
                      )}
                    </button>
                  )}

                  {!isLocked && (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || saving || !hasAnyContent()}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#007A61] hover:bg-[#00604c] text-white transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-emerald-300 border-t-white rounded-full animate-spin" />
                      ) : success ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Submitted for Approval!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{needsChanges || isRejected ? 'Resubmit Blueprint' : 'Submit Full Prototype (Phase 1-4)'}</span>
                        </>
                      )}
                    </button>
                  )}

                  {!isLocked && hasAnyContent() && (
                    <button
                      onClick={handleDeleteDraft}
                      disabled={saving || submitting}
                      className="w-full py-2 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-2 border bg-white border-rose-200 hover:bg-rose-50 text-rose-600 disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear / Delete Draft</span>
                    </button>
                  )}
                  {isLocked && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                      <Lock className="w-4 h-4 text-slate-400 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">
                        {currentStatus === 'Approved' ? 'Blueprint Approved' : 'Locked (In Review)'}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {currentStatus === 'Approved'
                          ? 'Prototype dossier has been approved by the university.'
                          : 'Prototype blueprint has been submitted for university review.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyPrototypePanel;

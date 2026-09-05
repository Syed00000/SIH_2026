import React, { useState, useEffect } from 'react';
import { Lightbulb, Lock, FlaskConical, TestTube2, ShieldCheck, Rocket } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { facultyApiService } from '../../services/facultyApiService.js';
import { PrototypeStatusBanner } from './PrototypeStatusBanner.jsx';
import { PrototypePhasesStepper } from './PrototypePhasesStepper.jsx';
import { PrototypeSidebarActions } from './PrototypeSidebarActions.jsx';

const PHASES = [
  { key: 'labDesign',    label: 'Lab Design',    icon: FlaskConical, color: 'amber' },
  { key: 'fieldTest',    label: 'Field Test',    icon: TestTube2,    color: 'blue' },
  { key: 'stateCert',    label: 'State Cert',    icon: ShieldCheck,  color: 'purple' },
  { key: 'publicDeploy', label: 'Public Deploy', icon: Rocket,       color: 'emerald' },
];

const PHASE_COLORS = {
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-700' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-700' },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200', text: 'text-purple-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200',text: 'text-emerald-700' },
};

export const FacultyPrototypePanel = ({ project, faculty, onRefresh }) => {
  const [activePhase, setActivePhase] = useState(0);
  const [phaseData, setPhaseData] = useState({ labDesign: '', fieldTest: '', stateCert: '', publicDeploy: '' });
  const [timeline, setTimeline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (project?.prototypeData?.phases) {
      setPhaseData((prev) => ({ ...prev, ...project.prototypeData.phases }));
    } else if (project?.prototypeData?.content) {
      setPhaseData((prev) => ({ ...prev, labDesign: project.prototypeData.content }));
    }
    if (project?.prototypeData?.timeline) setTimeline(project.prototypeData.timeline);
  }, [project?.prototypeData]);

  const isFunded = Boolean(project && project.disbursedAmount && project.disbursedAmount !== '0' && project.disbursedAmount !== '₹ 0');
  const currentStatus = project?.prototypeStatus || 'Not Started';
  const isLocked = currentStatus === 'In Review' || currentStatus === 'Approved';
  const needsChanges = currentStatus === 'Changes Required';
  const isRejected = currentStatus === 'Rejected';
  const isCertified = project?.governmentStatus === 'Approved' || project?.status === 'Completed';

  const updatePhase = (key, value) => setPhaseData((prev) => ({ ...prev, [key]: value }));
  const hasAnyContent = () => Object.values(phaseData).some((v) => v && v.replace(/<[^>]*>/g, '').trim().length > 0);

  const handleSaveDraft = async () => {
    if (isLocked) return;
    setSaving(true);
    try {
      await facultyApiService.savePrototypeDraft(project.projectId || project.challengeId, {
        phases: phaseData, content: phaseData.labDesign, timeline,
        facultyEmail: faculty?.email, facultyName: faculty?.name
      });
      setSaveSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (isLocked) return;
    setSubmitting(true);
    try {
      await facultyApiService.submitPrototype(project.projectId || project.challengeId, {
        phases: phaseData, content: phaseData.labDesign, timeline,
        facultyEmail: faculty?.email, facultyName: faculty?.name
      });
      setSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error(err);
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
    } finally {
      setSaving(false);
    }
  };

  if (!isFunded && currentStatus === 'Not Started') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center"><Lock className="w-8 h-8 text-slate-400" /></div>
        <h2 className="text-lg font-bold text-slate-900">Prototype Lab Locked</h2>
        <p className="text-sm text-slate-500 text-center max-w-md">Prototyping phase unlocks automatically once Government Sanctioned Funds are disbursed for this project.</p>
      </div>
    );
  }

  const phase = PHASES[activePhase];

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      <PrototypeStatusBanner currentStatus={currentStatus} needsChanges={needsChanges} isRejected={isRejected} isCertified={isCertified} />

      <div className="flex items-center justify-between bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center"><Lightbulb className="w-5 h-5 text-[#007A61]" /></div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">Prototype Blueprint Lab</h2>
            <p className="text-[11px] text-slate-500 font-medium">Document across 4 lifecycle phases for Ranchi University Technical Evaluation & Lab Review.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-extrabold px-3 py-1.5 bg-emerald-50 text-[#007A61] border border-emerald-200 rounded-xl">Phase {activePhase + 1} of 4</span>
          <span className="text-[10px] font-extrabold px-3 py-1.5 border rounded-xl shadow-xs uppercase bg-slate-50 text-slate-700 border-slate-200">{currentStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <PrototypePhasesStepper phases={PHASES} activePhase={activePhase} setActivePhase={setActivePhase} phaseData={phaseData} phaseColors={PHASE_COLORS} />
          <div className="p-4 space-y-3 text-left">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{phase.label} Specifications & Telemetry Blueprint</h3>
            <ReactQuill
              theme="snow"
              value={phaseData[phase.key] || ''}
              onChange={(val) => updatePhase(phase.key, val)}
              readOnly={isLocked}
              placeholder={`Document ${phase.label} specifications, test results, hardware schematics, and sensor telemetry here...`}
              className="h-64 mb-12"
            />
          </div>
        </div>

        <PrototypeSidebarActions
          timeline={timeline} setTimeline={setTimeline} phases={PHASES} phaseData={phaseData}
          isLocked={isLocked} saving={saving} saveSuccess={saveSuccess} submitting={submitting} success={success}
          hasAnyContent={hasAnyContent()} needsChanges={needsChanges} isRejected={isRejected} currentStatus={currentStatus}
          onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} onDeleteDraft={handleDeleteDraft}
        />
      </div>
    </div>
  );
};

export default FacultyPrototypePanel;

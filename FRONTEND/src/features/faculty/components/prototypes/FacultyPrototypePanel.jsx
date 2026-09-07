import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, Lock, Rocket, Send, CheckCircle2, Cpu, FlaskConical, Factory, Loader2, Save } from 'lucide-react';
import { facultyApiService } from '../../services/facultyApiService.js';
import { PrototypeStatusBanner } from './PrototypeStatusBanner.jsx';
import { PrototypeDetailsTab } from './PrototypeDetailsTab.jsx';
import { PrototypeLabTestsTab } from './PrototypeLabTestsTab.jsx';
import { PrototypeIndustryRequisitionTab } from './PrototypeIndustryRequisitionTab.jsx';

const TABS = [
  { id: 0, label: '1. Architecture & Blueprint PDF', icon: Cpu },
  { id: 1, label: '2. In-House Lab Test Results', icon: FlaskConical },
  { id: 2, label: '3. Industry Testing Checklist', icon: Factory },
];

export const FacultyPrototypePanel = ({ project, faculty, onRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [protoData, setProtoData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const pId = project?.projectId || project?.challengeId || project?._id;
  const loadedProjectIdRef = useRef(null);
  const isDirtyRef = useRef(false);

  // Initialize once per project; do NOT let background 4s poll overwrite typed data
  useEffect(() => {
    if (!pId) return;
    if (loadedProjectIdRef.current !== pId) {
      loadedProjectIdRef.current = pId;
      isDirtyRef.current = false;
      let initial = project?.prototypeData ? { ...project.prototypeData } : {};
      // Seed milestoneRoadmap from proposal if not already in prototypeData
      if (!initial.milestoneRoadmap && project?.milestoneRoadmap?.length) {
        initial.milestoneRoadmap = project.milestoneRoadmap;
      }
      try {
        const savedDraft = localStorage.getItem(`joharsetu_proto_${pId}`);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          initial = { ...initial, ...parsed };
        }
      } catch {}
      setProtoData(initial);
    } else if (!isDirtyRef.current && project?.prototypeData) {
      setProtoData((prev) => ({ ...project.prototypeData, ...prev }));
    }
  }, [pId, project?.prototypeData, project?.milestoneRoadmap]);

  const isFunded = Boolean(project?.disbursedAmount && project.disbursedAmount !== '0' && project.disbursedAmount !== '₹ 0');
  const currentStatus = project?.prototypeStatus || 'Not Started';
  const isProjectDeployed = project?.status === 'Deployed' || Boolean(project?.isDeployed) || Boolean(project?.isLocked);
  const isLocked = isProjectDeployed || currentStatus === 'In Review' || currentStatus === 'Approved';
  const needsChanges = currentStatus === 'Changes Required';
  const isRejected = currentStatus === 'Rejected';
  const isCertified = isProjectDeployed || project?.governmentStatus === 'Approved' || project?.status === 'Completed';

  const handleChangeData = (key, value) => {
    isDirtyRef.current = true;
    setProtoData((prev) => {
      const next = { ...prev, [key]: value };
      try {
        if (pId) localStorage.setItem(`joharsetu_proto_${pId}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSaveOrSubmit = async (isFormalSubmit = false) => {
    if (!pId) return;
    if (isFormalSubmit) {
      if (!protoData?.title?.trim()) {
        alert('Please enter a Prototype Working Title in Tab 1 before submitting.');
        setActiveTab(0);
        return;
      }
      if (!confirm('Submit prototype dossier for University Review & Lab Approval?')) return;
    }
    setSubmitting(true);
    try {
      await facultyApiService.submitPrototype(pId, {
        ...protoData,
        facultyEmail: faculty?.email,
        facultyName: faculty?.name
      });
      isDirtyRef.current = false;
      try { localStorage.removeItem(`joharsetu_proto_${pId}`); } catch {}
      setSubmitSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      alert('Save failed: ' + (err.message || 'Error'));
    } finally {
      setSubmitting(false);
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

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none text-left">
      {project?.prototypeWorkRequested && (
        <div className="p-3.5 bg-white border border-emerald-200/90 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#007A61] text-white flex items-center justify-center shrink-0"><Rocket className="w-4 h-4" /></div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Official Directive from Ranchi University Authority</h4>
              <p className="text-[11px] text-slate-600 font-medium">1st Grant installment has been disbursed. You are authorized to proceed with prototype R&D and submit phase blueprints below.</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full shrink-0">Work Authorized</span>
        </div>
      )}

      <PrototypeStatusBanner currentStatus={currentStatus} needsChanges={needsChanges} isRejected={isRejected} isCertified={isCertified} />

      {/* Header with Navigation Pills & Action Button */}
      <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center"><Lightbulb className="w-5 h-5 text-[#007A61]" /></div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">Integrated Prototype R&D Lab</h2>
            <p className="text-[11px] text-slate-500 font-medium">Specs, in-house lab metrics, industry trial requisition & technical blueprint upload.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            type="button"
            onClick={() => handleSaveOrSubmit(false)}
            disabled={submitting}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#007A61] hover:bg-[#00604c] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{submitSuccess ? 'Specs Saved! 🎉' : 'Save / Update Specs'}</span>
          </button>

          {!isLocked && (
            <button
              type="button"
              onClick={() => handleSaveOrSubmit(true)}
              disabled={submitting}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          )}

          {isLocked && (
            <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl border border-slate-200 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
              <span>Dossier {currentStatus}</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 space-x-2 bg-white px-3 pt-2 rounded-xl border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2.5 px-3.5 text-xs font-black transition-all border-b-2 -mb-px rounded-t-lg ${
                isActive ? 'border-[#007A61] text-[#007A61] bg-emerald-50/50' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#007A61]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div>
        {activeTab === 0 && <PrototypeDetailsTab project={project} prototypeData={protoData} onChangeData={handleChangeData} isLocked={false} onRefresh={onRefresh} milestoneStages={protoData?.milestoneRoadmap || project?.milestoneRoadmap || []} onMilestoneChange={(stages) => handleChangeData('milestoneRoadmap', stages)} />}
        {activeTab === 1 && <PrototypeLabTestsTab prototypeData={protoData} onChangeData={handleChangeData} isLocked={isLocked} />}
        {activeTab === 2 && <PrototypeIndustryRequisitionTab project={project} prototypeData={protoData} onChangeData={handleChangeData} isLocked={isLocked} />}
      </div>
    </div>
  );
};

export default FacultyPrototypePanel;

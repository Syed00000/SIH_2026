import React, { useState } from 'react';
import { FlaskConical, Building2 } from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';
import { IndustryTestingStageCard } from './IndustryTestingStageCard.jsx';

export const IndustryTestingLabsView = ({ projects = {} }) => {
  const activeProjects = projects?.ongoing || [];
  const [selectedProjectId, setSelectedProjectId] = useState(activeProjects[0]?.id || null);
  const [stagesState, setStagesState] = useState({});
  const [savingStage, setSavingStage] = useState(false);

  const currentProject = activeProjects.find((p) => (p.id || p.projectId) === selectedProjectId) || activeProjects[0];

  const defaultStages = [
    { stageNumber: 1, title: 'Sample Intake & Equipment Calibration', description: 'Sample validation and spectrometer baseline calibration.', expectedDays: '5 Days', status: 'In Progress', notes: '' },
    { stageNumber: 2, title: 'Physical & Material Stress Testing', description: 'High-temperature variance, load bearing and sensor verification.', expectedDays: '10 Days', status: 'Pending', notes: '' },
    { stageNumber: 3, title: 'Certified Compliance & Lab Final Report', description: 'Issuing standardized testing certification and final analysis dossier.', expectedDays: '7 Days', status: 'Pending', notes: '' }
  ];

  const currentStages = stagesState[currentProject?.id] || (currentProject?.testingStages?.length ? currentProject.testingStages : defaultStages);

  const handleUpdateStage = async (stageIdx, newStatus, newNotes = null) => {
    if (!currentProject) return;
    const updated = currentStages.map((s, idx) => {
      if (idx === stageIdx) {
        return {
          ...s,
          status: newStatus,
          notes: newNotes !== null ? newNotes : (s.notes || ''),
          updatedAt: new Date()
        };
      }
      return s;
    });

    setStagesState((prev) => ({ ...prev, [currentProject.id]: updated }));
    setSavingStage(true);
    try {
      const targetId = currentProject.requestId || currentProject.id;
      const targetCode = currentProject.universityCode || 'RU001';
      await universityApiService.updateIndustryRequestStatus(targetId, 'Approved', targetCode, {
        testingStages: updated
      });
    } catch (err) {
      console.error('Failed to sync stage update:', err);
    } finally {
      setSavingStage(false);
    }
  };

  if (!activeProjects.length) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center space-y-4 shadow-2xs max-w-2xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#007A61] mx-auto shadow-inner">
          <FlaskConical className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900">Testing & Research Laboratories</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            No active projects currently requiring testing. Projects will appear here automatically as soon as the University accepts your quoted lab testing fee.
          </p>
        </div>
      </div>
    );
  }

  const completedCount = currentStages.filter((s) => s.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / (currentStages.length || 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#007A61] text-white flex items-center justify-center shrink-0 shadow-xs">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#007A61] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Industry R&D Facility
              </span>
              <span className="text-xs font-mono text-slate-400">{activeProjects.length} Active Testing Engagements</span>
            </div>
            <h2 className="text-base font-black text-slate-900 mt-0.5">Laboratory Testing & Staged Validation</h2>
          </div>
        </div>

        {/* Project Selector Tab Pills */}
        <div className="flex flex-wrap gap-1.5 self-stretch sm:self-auto">
          {activeProjects.map((p) => {
            const pId = p.id || p.projectId;
            const isSelected = (currentProject?.id || currentProject?.projectId) === pId;
            return (
              <button
                key={pId}
                type="button"
                onClick={() => setSelectedProjectId(pId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer truncate max-w-[200px] ${
                  isSelected ? 'bg-[#007A61] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Project Protocol Details */}
      {currentProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column: Project Overview */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 h-fit">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Current Project</span>
              <h3 className="text-base font-black text-slate-900">{currentProject.title}</h3>
              <div className="flex items-center text-xs font-bold text-slate-600 pt-1">
                <Building2 className="w-4 h-4 mr-1.5 text-[#007A61]" />
                <span>{currentProject.university || 'Ranchi University'}</span>
              </div>
            </div>

            {currentProject.problemStatement && (
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Problem Statement</span>
                <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 font-medium">
                  "{currentProject.problemStatement}"
                </p>
              </div>
            )}

            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950">Agreed Lab Fee:</span>
                <span className="font-black text-emerald-700">{currentProject.labChargesQuoted || currentProject.budget || '₹ 25,000'}</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 inline-block">
                ✓ University Fee Accepted
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Testing Progress</span>
                <span className="text-[#007A61] font-black">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#007A61] rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="text-[10.5px] text-slate-400 block">{completedCount} of {currentStages.length} stages completed</span>
            </div>
          </div>

          {/* Right Column: Stage-wise Testing Execution */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Testing Milestones & Staged Validation ({currentStages.length} Stages)
              </h4>
              {savingStage && <span className="text-xs text-emerald-600 font-bold animate-pulse">Syncing with Backend...</span>}
            </div>

            <div className="space-y-3">
              {currentStages.map((stage, idx) => (
                <IndustryTestingStageCard
                  key={idx}
                  stage={stage}
                  idx={idx}
                  onUpdateStage={handleUpdateStage}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryTestingLabsView;

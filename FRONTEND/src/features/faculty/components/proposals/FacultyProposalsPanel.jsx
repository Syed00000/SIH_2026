import React, { useState, useEffect } from 'react';
import {
  FileText,
  Send,
  Save,
  Plus,
  Trash2,
  Calculator,
  RotateCcw,
  Sparkles,
  Building2,
  Tag,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Loader2,
  Target,
  Cpu
} from 'lucide-react';
import { universityApiService } from '../../../university/services/universityApiService.js';

const PRESET_CATEGORIES = [
  { label: '+ Telemetry Sensors', title: 'Sensors & Microcontrollers', amount: 25000 },
  { label: '+ Lab Prototyping', title: '3D Enclosures & Lab PCB Rig', amount: 18000 },
  { label: '+ Ground Field Trials', title: 'District Field Trials & Calibration', amount: 15000 },
  { label: '+ Student Fellowship', title: 'Student Research Fellowship', amount: 10000 },
  { label: '+ Consumables & Reagents', title: 'Chemical Reagents & Test Kits', amount: 7000 }
];

const ROADMAP_PRESETS = [
  {
    label: '⚡ Hardware & IoT Sensors',
    stages: [
      { stage: 1, title: 'Lab CAD & Circuit Rig', targetDays: 'Days 1-30', deliverable: 'Component procurement, PCB milling, sensor bench test' },
      { stage: 2, title: 'Field Ground Testing', targetDays: 'Days 31-75', deliverable: 'Telemetry calibration in rural pilot site' },
      { stage: 3, title: 'NABL Lab Certification', targetDays: 'Days 76-120', deliverable: 'Safety and quality standard test report' },
      { stage: 4, title: 'Public Rollout & Scale', targetDays: 'Days 121-180', deliverable: 'Deployment and handover to district administration' }
    ]
  },
  {
    label: '💧 Aqua & Water Quality',
    stages: [
      { stage: 1, title: 'Spectrometric Bench Rig', targetDays: 'Days 1-30', deliverable: 'Optical probe sensor integration & lab bench setup' },
      { stage: 2, title: 'Panchayat Well Pilot', targetDays: 'Days 31-60', deliverable: 'Ground testing in 5 high-fluoride village borewells' },
      { stage: 3, title: 'Water Board Lab Audit', targetDays: 'Days 61-100', deliverable: 'Accreditation from State Water & Sanitation Board' },
      { stage: 4, title: 'District Grid Rollout', targetDays: 'Days 101-150', deliverable: 'Real-time telemetry feeds active on State JoharSetu map' }
    ]
  },
  {
    label: '🌱 Agro-Tech & Drone Telemetry',
    stages: [
      { stage: 1, title: 'Airframe & Payload Assembly', targetDays: 'Days 1-25', deliverable: 'Multispectral camera payload & telemetry rig' },
      { stage: 2, title: 'Crop Canopy Ground Flight', targetDays: 'Days 26-60', deliverable: 'Validation flights over agricultural blocks' },
      { stage: 3, title: 'DGCA & Safety Audit', targetDays: 'Days 61-90', deliverable: 'Aviation and battery endurance certification' },
      { stage: 4, title: 'FPO & Collectorate Handover', targetDays: 'Days 91-140', deliverable: 'Handover to Farmer Producer Organizations' }
    ]
  }
];

export const FacultyProposalsPanel = ({
  faculty = {},
  projects = [],
  onRefresh,
  initialProjectId = null,
  hideHeader = false
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(
    initialProjectId || projects[0]?.projectId || projects[0]?.challengeId || ''
  );

  const currentProject = projects.find(
    (p) => p.projectId === selectedProjectId || p.challengeId === selectedProjectId
  ) || projects[0];

  const [methodology, setMethodology] = useState(
    currentProject?.methodology ||
      'Multi-stage sensor calibration and low-power telemetry rig utilizing solar energy harvesting and real-time cloud data push to JoharSetu state server.'
  );

  // Milestone Stages Roadmap (Stage 1 to 4)
  const [milestoneStages, setMilestoneStages] = useState(
    Array.isArray(currentProject?.milestoneRoadmap) && currentProject.milestoneRoadmap.length > 0
      ? currentProject.milestoneRoadmap
      : ROADMAP_PRESETS[0].stages
  );

  // Dynamic Line Items for Budget Breakdown
  const [budgetItems, setBudgetItems] = useState([
    { id: 'item-1', title: 'Field Telemetry Sensors & Hardware Modules', amount: 35000 },
    { id: 'item-2', title: 'Lab Fabrication, 3D Casing & PCB Prototyping', amount: 20000 },
    { id: 'item-3', title: 'District Field Trials & On-Ground Calibration', amount: 15000 },
    { id: 'item-4', title: 'Student Research Fellowship & Institutional Overhead', amount: 10000 }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSavedSuccess, setDraftSavedSuccess] = useState(false);

  // Sync state if project changes
  useEffect(() => {
    if (currentProject) {
      if (currentProject.methodology) {
        setMethodology(currentProject.methodology);
      }
      if (Array.isArray(currentProject.milestoneRoadmap) && currentProject.milestoneRoadmap.length > 0) {
        setMilestoneStages(currentProject.milestoneRoadmap);
      }
      if (Array.isArray(currentProject.budgetBreakdown) && currentProject.budgetBreakdown.length > 0) {
        setBudgetItems(
          currentProject.budgetBreakdown.map((b, idx) => ({
            id: `item-${idx}-${Date.now()}`,
            title: b.category || b.title || 'Budget Item',
            amount:
              typeof b.amount === 'number'
                ? b.amount
                : Number((b.amount || '').replace(/[^0-9]/g, '')) || 10000
          }))
        );
      }
    }
  }, [currentProject?.projectId, currentProject?.budgetStatus, currentProject?.adminRemarks, currentProject?.governmentRemarks]);

  const totalCalculatedBudget = budgetItems.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );

  const handleSaveDraft = async () => {
    if (!currentProject) return;
    setSavingDraft(true);
    try {
      const budgetFormatted = `₹ ${totalCalculatedBudget.toLocaleString('en-IN')}`;
      const budgetBreakdown = budgetItems.map((item) => ({
        category: item.title || 'Custom Line Item',
        amount: `₹ ${Number(item.amount || 0).toLocaleString('en-IN')}`,
        amountNumber: Number(item.amount || 0)
      }));

      await universityApiService.updateProject(currentProject.projectId || currentProject._id, {
        ...currentProject,
        methodology,
        milestoneRoadmap: milestoneStages,
        budget: budgetFormatted,
        budgetBreakdown,
        proposedBudget: budgetFormatted
      });

      setDraftSavedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setDraftSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Draft save failed:', err);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleProjectSelect = (id) => {
    setSelectedProjectId(id);
  };

  const handleAddItem = () => {
    setBudgetItems([
      ...budgetItems,
      { id: `item-${Date.now()}`, title: '', amount: 5000 }
    ]);
  };

  const handleQuickAdd = (preset) => {
    setBudgetItems([
      ...budgetItems,
      { id: `item-${Date.now()}`, title: preset.title, amount: preset.amount }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (budgetItems.length <= 1) return;
    setBudgetItems(budgetItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id, field, value) => {
    setBudgetItems(
      budgetItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === 'amount' ? Number(value) || 0 : value
          };
        }
        return item;
      })
    );
  };

  const handleUpdateStage = (idx, field, value) => {
    const updated = [...milestoneStages];
    updated[idx] = { ...updated[idx], [field]: value };
    setMilestoneStages(updated);
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!currentProject) return;

    setSubmitting(true);
    try {
      const budgetFormatted = `₹ ${totalCalculatedBudget.toLocaleString('en-IN')}`;
      const budgetBreakdown = budgetItems.map((item) => ({
        category: item.title || 'Custom Line Item',
        amount: `₹ ${Number(item.amount || 0).toLocaleString('en-IN')}`,
        amountNumber: Number(item.amount || 0)
      }));

      const isRevision =
        currentProject.budgetStatus === 'Changes Required by University' ||
        currentProject.budgetStatus === 'Changes Required by Government' ||
        (currentProject.revisionCount || 0) > 0;
      const nextRevCount = isRevision ? Number(currentProject.revisionCount || 1) + 1 : 1;

      // Advance milestone to Proposal Submitted (Milestone 3 Done = 43%)
      const updatedMilestones = currentProject.milestones?.length
        ? currentProject.milestones.map((m, idx) => {
            if (idx === 0) return { ...m, status: 'Completed', completedAt: m.completedAt || new Date() };
            if (idx === 1) return { ...m, status: 'Completed', completedAt: m.completedAt || new Date() };
            if (idx === 2) return { ...m, status: 'Completed', completedAt: new Date() };
            if (idx === 3 && m.status === 'Pending') return { ...m, status: 'In Progress' };
            return m;
          })
        : [];

      await universityApiService.updateProject(currentProject.projectId || currentProject._id, {
        ...currentProject,
        methodology,
        milestoneRoadmap: milestoneStages,
        budget: budgetFormatted,
        budgetBreakdown,
        proposedBudget: budgetFormatted,
        budgetStatus: 'Submitted to University for Review',
        isRevised: isRevision,
        revisionCount: nextRevCount,
        milestones: updatedMilestones,
        milestonesCompleted: 3,
        progressPercentage: 43
      });

      setSubmittedSuccess(true);
      if (onRefresh) await onRefresh();
      setTimeout(() => setSubmittedSuccess(false), 3500);
    } catch (err) {
      console.error('Proposal submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`space-y-4 max-w-7xl mx-auto select-none ${hideHeader ? '' : 'pb-12'}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
              <span>Faculty Research Node</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Solution Proposal & Line-Item Budget Builder</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#007A61]" />
              <span>R&D Grant Proposal & Dynamic Roadmap Builder</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulate technical methodology, milestone stages, and itemized line-item budgets for University and Government sanction review.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-[#007A61] flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{faculty?.department || 'Engineering Lab'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Project Selector & Proposal Formulation Form */}
        <div className={hideHeader ? "lg:col-span-3 space-y-4" : "lg:col-span-2 space-y-4"}>
          <form onSubmit={handleSubmitProposal} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            {/* Project Selection Dropdown */}
            {!hideHeader && (
              <div>
                <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
                  Select Assigned Problem Project *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs cursor-pointer"
                >
                  {projects.map((p, i) => (
                    <option key={p.projectId || i} value={p.projectId || p.challengeId}>
                      {p.projectId} — {p.title} ({p.domain})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Problem Brief Card */}
            {currentProject && (
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase">Assigned Problem Statement</span>
                  <span className="text-[10px] font-mono font-bold bg-white border border-emerald-200 px-1.5 py-0.2 rounded text-emerald-900">
                    {currentProject.projectId}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-semibold line-clamp-2 leading-relaxed">
                  {currentProject.problemStatement || currentProject.description || currentProject.title}
                </p>
              </div>
            )}

            {/* Government Authority Clarification / Revision Banner */}
            {currentProject?.budgetStatus === 'Changes Required by Government' && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Government Authority Requested Proposal Clarifications / Revisions</span>
                </div>
                {currentProject.governmentRemarks && (
                  <p className="text-xs text-amber-800 font-medium pl-6">
                    Audit Note: "{currentProject.governmentRemarks}"
                  </p>
                )}
                <p className="text-[10.5px] text-amber-700 font-semibold pl-6">
                  Please update the line-item budget, methodology, or milestone stages below and resubmit for Government Grant Sanction.
                </p>
              </div>
            )}

            {/* University Authority Review Feedback Banner */}
            {currentProject?.budgetStatus === 'Changes Required by University' && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>University Authority Requested Revisions</span>
                </div>
                {currentProject.adminRemarks && (
                  <p className="text-xs text-amber-800 font-medium pl-6">
                    Authority Note: "{currentProject.adminRemarks}"
                  </p>
                )}
                <p className="text-[10.5px] text-amber-700 font-semibold pl-6">
                  Please adjust the technical methodology or budget allocations below and resubmit.
                </p>
              </div>
            )}

            {/* Government Grant Sanctioned Banner */}
            {(currentProject?.budgetStatus === 'Grant Sanctioned by Government' || currentProject?.budgetStatus === 'Forwarded to Escrow') && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#007A61] shrink-0" />
                  <span>Grant Sanctioned & Disbursed by Government Authority ✓</span>
                </div>
                <div className="pl-6 text-xs text-emerald-800 space-y-0.5">
                  <div><strong>Sanction Order:</strong> <span className="font-mono font-bold">{currentProject.sanctionOrderNo || 'JH-GOV-RD-2026-8842'}</span></div>
                  <div><strong>Sanctioned Grant:</strong> <span className="font-mono font-bold">{currentProject.sanctionedBudget || currentProject.proposedBudget || '₹ 75,000'}</span></div>
                </div>
              </div>
            )}

            {/* Research Methodology */}
            <div>
              <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                Technical Methodology & Research Plan *
              </label>
              <textarea
                rows={4}
                required
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="Detail scientific approach, sensor architecture, lab prototyping phases, and field testing protocol..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs leading-relaxed"
              />
            </div>

            {/* Milestone Roadmap & Stages Builder */}
            <div className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">
                      Milestone Roadmap & Research Stages (4 Stages)
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      Faculty-defined timeline and key deliverables for Government DPR review
                    </span>
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Roadmap Templates:</span>
                {ROADMAP_PRESETS.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setMilestoneStages(preset.stages)}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* 4 Editable Stages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {milestoneStages.map((stage, sIdx) => (
                  <div key={sIdx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-extrabold text-[#007A61] uppercase">
                        Stage {sIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={stage.targetDays || ''}
                        onChange={(e) => handleUpdateStage(sIdx, 'targetDays', e.target.value)}
                        placeholder="e.g. Days 1-30"
                        className="w-24 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700 text-right focus:outline-none focus:bg-white"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      value={stage.title || ''}
                      onChange={(e) => handleUpdateStage(sIdx, 'title', e.target.value)}
                      placeholder="Stage Title"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
                    />
                    <input
                      type="text"
                      value={stage.deliverable || ''}
                      onChange={(e) => handleUpdateStage(sIdx, 'deliverable', e.target.value)}
                      placeholder="Key Output / Deliverable"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 focus:outline-none focus:bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Line-Item Budget Section */}
            <div className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">
                      Line-Item Budget Breakdown ({budgetItems.length} Items)
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      Specify exact research headings, hardware costs & field allocations
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Total Grant Requested
                  </span>
                  <span className="text-base font-black font-mono text-[#007A61]">
                    ₹ {totalCalculatedBudget.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Quick Add Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Preset Headings:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_CATEGORIES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAdd(preset)}
                      className="px-2 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Items List */}
              <div className="space-y-2 pt-1">
                {budgetItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs flex items-center gap-2.5"
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-mono font-bold text-[10.5px] flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        required
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                        placeholder="e.g. Field Telemetry Sensors & Hardware Modules"
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
                      />
                    </div>

                    <div className="w-32 shrink-0 relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={item.amount}
                        onChange={(e) => handleUpdateItem(item.id, 'amount', e.target.value)}
                        placeholder="Amount"
                        className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 text-right focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={budgetItems.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-1 flex justify-start">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#007A61]" />
                  <span>Add Custom Budget Line Item</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="text-[11px] text-slate-500">
                Author: <strong>{faculty?.name || 'Lead Mentor'}</strong> ({faculty?.department})
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={savingDraft}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  {savingDraft ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#007A61]" />
                  ) : draftSavedSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-[#007A61]" />
                  ) : (
                    <Save className="w-4 h-4 text-slate-600" />
                  )}
                  <span>{draftSavedSuccess ? 'Draft Saved!' : 'Save Draft'}</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : submittedSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  ) : currentProject?.budgetStatus?.includes('Changes Required') ? (
                    <RotateCcw className="w-4 h-4" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>
                    {submittedSuccess
                      ? 'Proposal Submitted to University!'
                      : currentProject?.budgetStatus === 'Changes Required by Government'
                      ? 'Resubmit Revised Proposal to Government'
                      : currentProject?.budgetStatus === 'Changes Required by University'
                      ? 'Resubmit Revised Proposal'
                      : 'Submit Proposal to University'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Live Project Status & Governance Summary */}
        {!hideHeader && (
          <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Governance & Approval Status
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Review Status</span>
                <div className="font-bold text-xs text-slate-900">
                  {currentProject?.budgetStatus || 'Proposal Formulated'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Sanctioned Grant Budget</span>
                <div className="font-black font-mono text-xs text-[#007A61]">
                  {currentProject?.sanctionedBudget || currentProject?.proposedBudget || `₹ ${totalCalculatedBudget.toLocaleString('en-IN')}`}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Research Team Lead</span>
                <div className="font-bold text-xs text-slate-800">
                  {currentProject?.studentLead || currentProject?.studentTeam || 'Student Research Team'}
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyProposalsPanel;

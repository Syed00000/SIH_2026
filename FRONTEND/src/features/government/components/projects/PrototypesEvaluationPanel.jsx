import React, { useState, useEffect } from 'react';
import {
  Cpu,
  FlaskConical,
  Building2,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  RotateCcw,
  ShieldCheck,
  Award,
  Layers,
  MapPin,
  ArrowRight,
  TrendingUp,
  Activity,
  IndianRupee,
  HelpCircle,
  Zap,
  Check,
  AlertTriangle,
  Radio,
  FileCheck2,
  Users
} from 'lucide-react';

import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { InspectPrototypeModal } from './InspectPrototypeModal.jsx';

// Prototype Stage Data Generator for all 4 distinct stages
const getStageDetails = (project, stageIndex) => {
  const curTrlNum = parseInt(String(project.trlLevel || '4').replace('TRL-', ''), 10) || 4;

  if (stageIndex === 1) {
    const isUnlocked = curTrlNum >= 1;
    return {
      stageNum: 1,
      title: '1. College Lab Design',
      shortTitle: 'Lab Design',
      trlRange: 'TRL 1-3',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      isCompleted: curTrlNum >= 4,
      isCurrent: curTrlNum <= 3,
      isUnlocked,
      details: {
        labName: `${project.hei} Embedded & Robotics Innovation Lab`,
        leadScientist: project.teamLead || 'Dr. Amitabh Verma (Lead SPOC)',
        problemOrigin: project.problemOrigin || `${project.district} Rural Community Area`,
        labScope: 'Circuit schematic CAD simulation, PCB layout routing, and initial breadboard testing.',
        sensorRig: project.hardwareSpecs || 'Integrated embedded microcontroller with LoRaWAN wireless telemetry.',
        deliverables: [
          '3D CAD housing model fabricated',
          'Power consumption & solar battery profiling cleared',
          'Initial sensor calibration against baseline standards'
        ]
      }
    };
  }

  if (stageIndex === 2) {
    const isUnlocked = curTrlNum >= 4;
    return {
      stageNum: 2,
      title: '2. Ground & Field Tested',
      shortTitle: 'Field Test',
      trlRange: 'TRL 4-6',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      isCompleted: curTrlNum >= 7,
      isCurrent: curTrlNum >= 4 && curTrlNum <= 6,
      isUnlocked,
      details: {
        fieldLocation: `${project.district} District Field Sites (Panchayats & Mining Clusters)`,
        environmentTested: 'Real environmental stress: coal dust, high humidity, monsoon rain & thermal heat.',
        telemetryUptime: '99.2% RF Packet Delivery to JoharSetu Gateway',
        batteryEndurance: '72+ Hours Continuous Autonomous Operation',
        fieldOfficerSignoff: `Verified by District Technical Inspection Cell (${project.district})`,
        deliverables: [
          'Real ground environmental stress tests passed',
          'Autonomous battery endurance verified over 72 hours',
          'Live data packets received on JoharSetu IoT server'
        ]
      }
    };
  }

  if (stageIndex === 3) {
    const isUnlocked = curTrlNum >= 7;
    return {
      stageNum: 3,
      title: '3. State & NABL Certified',
      shortTitle: 'State Certified',
      trlRange: 'TRL 7-8',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
      isCompleted: curTrlNum >= 9,
      isCurrent: curTrlNum >= 7 && curTrlNum <= 8,
      isUnlocked,
      details: {
        certRef: `NABL-JH-${project.id}-2026-CAL`,
        testingAgency: 'National Accreditation Board for Testing and Calibration Labs (NABL) & DHTE',
        safetyStandards: 'Passed IS/IEC 60950 electrical safety & RF radiation emissions benchmarks.',
        handoverStatus: 'Official State Safety Clearance Accorded — Ready for District Handover',
        deliverables: [
          'NABL calibrated laboratory certification awarded',
          'State Government technical steering committee vetting cleared',
          'District administration procurement compliance signed'
        ]
      }
    };
  }

  // Stage 4
  const isUnlocked = curTrlNum >= 9;
  return {
    stageNum: 4,
    title: '4. Public Deployment',
    shortTitle: 'Public Deploy',
    trlRange: 'TRL 9',
    badgeColor: 'bg-slate-900 text-white border-slate-900',
    isCompleted: curTrlNum >= 9,
    isCurrent: curTrlNum >= 9,
    isUnlocked,
    details: {
      deploymentSite: `${project.district} District Community Health Centers, Hostels & Panchayats`,
      beneficiariesCount: '12,500+ Rural Citizens, Farmers & Students',
      liveSystemUptime: '99.8% Live Uptime on JoharSetu State Cloud Gateway',
      socialImpact: 'Local community challenge solved with zero ground leakage and automated public telemetry.',
      deliverables: [
        'Mass district-wide deployment operational',
        'Direct beneficiary tracking active on JoharSetu ledger',
        'Final state innovation completion certificate generated'
      ]
    }
  };
};

// Individual Interactive Prototype Card with 4-Stage Step-by-Step Switcher
const PrototypeInteractiveCard = ({
  project,
  onInspect,
  onAdvanceTrl
}) => {
  const curTrlNum = parseInt(String(project.trlLevel || '4').replace('TRL-', ''), 10) || 4;
  
  // Default active stage tab based on current TRL level
  const defaultStage = curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4;
  const [selectedStageTab, setSelectedStageTab] = useState(defaultStage);

  // Sync tab if project TRL updates
  useEffect(() => {
    const nextStage = curTrlNum <= 3 ? 1 : curTrlNum <= 6 ? 2 : curTrlNum <= 8 ? 3 : 4;
    setSelectedStageTab(nextStage);
  }, [curTrlNum]);

  const currentStageInfo = getStageDetails(project, selectedStageTab);

  const handleNextStage = () => {
    setSelectedStageTab((prev) => (prev < 4 ? prev + 1 : 1));
  };

  const handlePrevStage = () => {
    setSelectedStageTab((prev) => (prev > 1 ? prev - 1 : 4));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-black bg-slate-900 text-white">
                {project.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {project.prototypeType || 'Hardware'}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-bold border ${currentStageInfo.badgeColor}`}>
                {project.trlLevel} · Stage {selectedStageTab}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 pt-1">{project.title}</h3>
          </div>
        </div>

        {/* 4 Interactive Stage Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200 text-center text-xs select-none">
          {[
            { num: 1, label: '1. Lab Design' },
            { num: 2, label: '2. Field Test' },
            { num: 3, label: '3. State Cert' },
            { num: 4, label: '4. Public Deploy' }
          ].map((tab) => {
            const stageMeta = getStageDetails(project, tab.num);
            const isTabActive = selectedStageTab === tab.num;

            return (
              <button
                key={tab.num}
                type="button"
                onClick={() => setSelectedStageTab(tab.num)}
                className={`py-1.5 px-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isTabActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center space-x-0.5">
                  {stageMeta.isCompleted ? (
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 inline shrink-0" />
                  ) : stageMeta.isCurrent ? (
                    <Zap className="w-2.5 h-2.5 text-amber-500 inline shrink-0 animate-pulse" />
                  ) : null}
                  <span className="truncate">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* DYNAMIC STAGE VIEW CONTENT */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2.5 text-xs animate-fadeIn">
          {/* Stage Header */}
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-900 text-xs">{currentStageInfo.title}</span>
              <span className="text-[10px] font-bold text-slate-500">({currentStageInfo.trlRange})</span>
            </div>

            {currentStageInfo.isCompleted ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3" />
                <span>Passed & Verified</span>
              </span>
            ) : currentStageInfo.isCurrent ? (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                <Activity className="w-3 h-3 animate-spin" />
                <span>In Progress</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full border border-slate-300">
                <span>Pending Stage</span>
              </span>
            )}
          </div>

          {/* STAGE 1 DETAILS: LAB DESIGN */}
          {selectedStageTab === 1 && (
            <div className="space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">College Testing Lab</span>
                  <span className="font-semibold text-slate-900 block truncate">{currentStageInfo.details.labName}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Problem Origin</span>
                  <span className="font-semibold text-slate-900 block truncate">{currentStageInfo.details.problemOrigin}</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Hardware Architecture</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {currentStageInfo.details.sensorRig}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-600 block uppercase">Lab Milestones Cleared:</span>
                {currentStageInfo.details.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 2 DETAILS: GROUND & FIELD TESTED */}
          {selectedStageTab === 2 && (
            <div className="space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Field Testing Site</span>
                  <span className="font-semibold text-slate-900 block truncate">{currentStageInfo.details.fieldLocation}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Telemetry Uptime</span>
                  <span className="font-semibold text-emerald-700 font-mono block">{currentStageInfo.details.telemetryUptime}</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Field Stress Test Scope</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {currentStageInfo.details.environmentTested}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-600 block uppercase">Field Deliverables Verified:</span>
                {currentStageInfo.details.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-purple-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 3 DETAILS: STATE & NABL CERTIFIED */}
          {selectedStageTab === 3 && (
            <div className="space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">NABL Certificate Ref</span>
                  <span className="font-mono font-bold text-emerald-800 block truncate">{currentStageInfo.details.certRef}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Accreditation Body</span>
                  <span className="font-semibold text-slate-900 block truncate">{currentStageInfo.details.testingAgency}</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Safety & Compliance Benchmarks</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {currentStageInfo.details.safetyStandards}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-600 block uppercase">Certification Milestones:</span>
                {currentStageInfo.details.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 4 DETAILS: PUBLIC DEPLOYMENT */}
          {selectedStageTab === 4 && (
            <div className="space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Live Deployment Zone</span>
                  <span className="font-semibold text-slate-900 block truncate">{currentStageInfo.details.deploymentSite}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-0.5">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Beneficiaries Reached</span>
                  <span className="font-black text-slate-900 block">{currentStageInfo.details.beneficiariesCount}</span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200/70 space-y-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Ground Social Impact</span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {currentStageInfo.details.socialImpact}
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-slate-600 block uppercase">Public Rollout Milestones:</span>
                {currentStageInfo.details.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-slate-900 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Real Submitted Phase Technical Documentation from Faculty */}
          {(() => {
            const phases = project.prototypeData?.phases;
            const legacy = project.prototypeData?.content;
            const phaseContent = phases 
              ? (selectedStageTab === 1 ? phases.labDesign : selectedStageTab === 2 ? phases.fieldTest : selectedStageTab === 3 ? phases.stateCert : phases.publicDeploy)
              : (selectedStageTab === 1 ? legacy : null);

            if (phaseContent && phaseContent.replace(/<[^>]*>/g, '').trim().length > 0) {
              return (
                <div className="mt-2.5 p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200/80 space-y-1">
                  <span className="text-[9.5px] font-extrabold text-[#007A61] uppercase block">
                    Faculty Submitted Phase {selectedStageTab} Blueprint:
                  </span>
                  <div
                    className="ql-editor prose prose-xs max-w-none text-[10.5px] text-slate-700 leading-relaxed max-h-24 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: phaseContent }}
                  />
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Stage Step Switcher Bar & Bottom Actions */}
      <div className="space-y-2.5 pt-1">
        {/* Next / Previous Stage Step Navigator */}
        <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={handlePrevStage}
            className="px-2.5 py-1 text-slate-700 hover:bg-white hover:shadow-2xs rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev Stage</span>
          </button>

          <span className="text-[11px] font-bold text-slate-600">
            Viewing Stage {selectedStageTab} of 4
          </span>

          <button
            type="button"
            onClick={handleNextStage}
            className="px-2.5 py-1 text-blue-700 hover:bg-white hover:shadow-2xs rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal & Advance Action Buttons */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onInspect(project)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
          >
            <FlaskConical className="w-3.5 h-3.5 text-slate-500" />
            <span>Inspect Tests & Specs</span>
          </button>

          <button
            type="button"
            onClick={() => onAdvanceTrl(project.id)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
          >
            <span>Advance Stage (+1 TRL)</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrototypesEvaluationPanel = () => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [selectedTrlFilter, setSelectedTrlFilter] = useState('All Stages');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedProjects) {
        setProjects(data.updatedProjects);
      }
    });
    return unsubscribe;
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAdvanceTrl = (projectId) => {
    const updated = projectCsrSyncService.advancePrototypeTrl(projectId);
    setProjects(updated);
    showToast(`Prototype readiness advanced to next level successfully!`);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hei.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hardwareSpecs?.toLowerCase().includes(searchQuery.toLowerCase());

    const num = parseInt(String(p.trlLevel || 'TRL-4').replace('TRL-', ''), 10) || 4;

    const matchesTrl =
      selectedTrlFilter === 'All Stages' ||
      (selectedTrlFilter === 'Stage 1: Lab Concept' && num <= 3) ||
      (selectedTrlFilter === 'Stage 2: Field Tested' && num >= 4 && num <= 6) ||
      (selectedTrlFilter === 'Stage 3: Deployment Ready' && num >= 7 && num <= 8) ||
      (selectedTrlFilter === 'Stage 4: Public Deployed' && num >= 9);

    const matchesType =
      selectedTypeFilter === 'All Types' || p.prototypeType === selectedTypeFilter;

    return matchesSearch && matchesTrl && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center space-x-1 text-slate-700">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Technology Readiness Level (TRL) Dashboard</span>
            </span>
            <span>•</span>
            <span>Interactive 4-Stage Lab-to-Field Tracker</span>
          </div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            PROTOTYPES & LAB-TO-FIELD TESTING (TRL)
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Switch between <strong>1. Lab Design</strong> ➔ <strong>2. Field Tested</strong> ➔ <strong>3. State Certified</strong> ➔ <strong>4. Public Deployment</strong> on any prototype card to inspect lab details, testing areas, and certification evidence.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
            {projects.length} Active Prototypes
          </span>
        </div>
      </div>

      {/* 4-Stage Visual Progress Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Stage 1 */}
        <div
          onClick={() => setSelectedTrlFilter('Stage 1: Lab Concept')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2 hover:shadow-xs hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Stage 1 (TRL 1-3)
            </span>
            <span className="text-xs font-black text-slate-900">
              {projects.filter((p) => parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10) <= 3).length} Units
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 pt-0.5">1. College Lab Design</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Circuit fabrication, CAD simulation & sensor bench testing in college labs.
          </p>
        </div>

        {/* Stage 2 */}
        <div
          onClick={() => setSelectedTrlFilter('Stage 2: Field Tested')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2 hover:shadow-xs hover:border-purple-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              Stage 2 (TRL 4-6)
            </span>
            <span className="text-xs font-black text-slate-900">
              {projects.filter((p) => {
                const n = parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10);
                return n >= 4 && n <= 6;
              }).length} Units
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 pt-0.5">2. Ground & Field Tested</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Real physical devices tested in actual Jharkhand villages, mines, and dam water reservoirs.
          </p>
        </div>

        {/* Stage 3 */}
        <div
          onClick={() => setSelectedTrlFilter('Stage 3: Deployment Ready')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2 hover:shadow-xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              Stage 3 (TRL 7-8)
            </span>
            <span className="text-xs font-black text-slate-900">
              {projects.filter((p) => {
                const n = parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10);
                return n >= 7 && n <= 8;
              }).length} Units
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 pt-0.5">3. State & NABL Certified</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Safety & calibration cleared by accredited labs, ready for district administration handover.
          </p>
        </div>

        {/* Stage 4 */}
        <div
          onClick={() => setSelectedTrlFilter('Stage 4: Public Deployed')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2 hover:shadow-xs hover:border-slate-800 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
              Stage 4 (TRL 9)
            </span>
            <span className="text-xs font-black text-slate-900">
              {projects.filter((p) => parseInt(String(p.trlLevel || '4').replace('TRL-', ''), 10) >= 9).length} Units
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 pt-0.5">4. Public Deployment</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Fully active and deployed across Jharkhand districts, directly benefiting citizens and farmers.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prototype by name, university, hardware sensor, or district..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden shadow-2xs"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedTrlFilter}
            onChange={(e) => setSelectedTrlFilter(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All Stages">All Readiness Stages (1 to 4)</option>
            <option value="Stage 1: Lab Concept">Stage 1: Lab Concept (TRL 1-3)</option>
            <option value="Stage 2: Field Tested">Stage 2: Field Tested (TRL 4-6)</option>
            <option value="Stage 3: Deployment Ready">Stage 3: Certified Ready (TRL 7-8)</option>
            <option value="Stage 4: Public Deployed">Stage 4: Public Deployed (TRL 9)</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All Types">All Architecture Types</option>
            <option value="Hardware">Physical Hardware Device</option>
            <option value="Software">Software & Cloud AI</option>
            <option value="Hybrid">Hybrid (Sensor Hardware + AI)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearchQuery('');
            setSelectedTrlFilter('All Stages');
            setSelectedTypeFilter('All Types');
          }}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Prototypes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            No prototypes found matching the selected filter criteria.
          </div>
        ) : (
          filteredProjects.map((p) => (
            <PrototypeInteractiveCard
              key={p.id}
              project={p}
              onInspect={(prj) => setSelectedProjectForModal(prj)}
              onAdvanceTrl={handleAdvanceTrl}
            />
          ))
        )}
      </div>

      {/* Inspect Prototype Modal */}
      <InspectPrototypeModal
        isOpen={Boolean(selectedProjectForModal)}
        onClose={() => setSelectedProjectForModal(null)}
        project={selectedProjectForModal}
        onAdvanceStage={(id) => {
          handleAdvanceTrl(id);
          setSelectedProjectForModal((prev) => {
            if (!prev) return null;
            const curNum = parseInt(String(prev.trlLevel || '4').replace('TRL-', ''), 10) || 4;
            const nextNum = Math.min(9, curNum + 1);
            return { ...prev, trlLevel: `TRL-${nextNum}` };
          });
        }}
      />
    </div>
  );
};

export default PrototypesEvaluationPanel;

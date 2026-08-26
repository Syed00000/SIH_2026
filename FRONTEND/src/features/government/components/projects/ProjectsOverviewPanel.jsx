import React from 'react';
import {
  FolderKanban,
  Building2,
  FileCheck,
  PlayCircle,
  CheckCircle2,
  Cpu,
  Rocket,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Radio,
  Trash2,
  Layers,
  IndianRupee,
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

import ProjectKpiCards from './ProjectKpiCards.jsx';
import ProjectLeafletMap from './ProjectLeafletMap.jsx';
import {
  PROJECTS_AND_SOLUTIONS_KPIS,
  FINANCIAL_GRANT_METRICS,
  ATTENTION_REQUIRED_ALERTS,
  RECENT_ACTIVITY_TIMELINE,
  HEI_IMPACT_PARTNERS,
  INNOVATION_LIFECYCLE_STEPS
} from '../../data/projectsSolutionsData.js';

export const ProjectsOverviewPanel = ({ onNavigateTab }) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Government of Jharkhand</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Societal Innovation Hub</span>
          </div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            INNOVATION LIFECYCLE MANAGEMENT DASHBOARD
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Master command overview for solution proposals, active R&D, milestone stage gates, prototypes, and field deployments
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('projects_proposals')}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Review Proposals (86)</span>
          </button>
        </div>
      </div>

      {/* 1. 6-Box KPI Metrics */}
      <ProjectKpiCards
        kpis={PROJECTS_AND_SOLUTIONS_KPIS}
        onKpiClick={(kpiId) => {
          if (kpiId === 'solution_proposals') onNavigateTab && onNavigateTab('projects_proposals');
          if (kpiId === 'in_progress') onNavigateTab && onNavigateTab('projects_active');
          if (kpiId === 'deployed') onNavigateTab && onNavigateTab('projects_deployment');
        }}
      />

      {/* 2. 5-Module Direct Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          {
            id: 'projects_active',
            title: 'Active Projects',
            count: '28 Active',
            desc: 'Funded R&D & milestones',
            icon: PlayCircle,
            badge: 'Stage Gates'
          },
          {
            id: 'projects_proposals',
            title: 'Solution Proposals',
            count: '86 Submissions',
            desc: 'Evaluation & grant sanctions',
            icon: FileCheck,
            badge: 'Extensive Queue'
          },
          {
            id: 'projects_milestones',
            title: 'Milestones & Monitoring',
            count: '92% Phase 1',
            desc: 'NABL lab compliance',
            icon: CheckCircle2,
            badge: 'Compliance Audit'
          },
          {
            id: 'projects_prototypes',
            title: 'Prototypes & TRL',
            count: 'TRL 1 to 9',
            desc: 'Hardware, software, hybrid',
            icon: Cpu,
            badge: 'Tech Readiness'
          },
          {
            id: 'projects_deployment',
            title: 'Deployment / Validation',
            count: '140+ Sensors',
            desc: 'Telemetry & field pilots',
            icon: Rocket,
            badge: 'Live Network'
          }
        ].map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.id}
              onClick={() => onNavigateTab && onNavigateTab(module.id)}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {module.badge}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 mt-3 group-hover:text-black">
                  {module.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{module.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3 text-xs">
                <span className="font-bold text-slate-900">{module.count}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Innovation Lifecycle Pipeline Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
              State Innovation Lifecycle Flow
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Structured pipeline from citizen challenge to deployment & scaling
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
            8-Stage Process
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
          {[
            { step: 1, label: 'Problem Identified', icon: AlertCircle },
            { step: 2, label: 'Challenge Created', icon: Layers },
            { step: 3, label: 'Solution Proposed', icon: FileCheck },
            { step: 4, label: 'Evaluation', icon: ShieldCheck },
            { step: 5, label: 'Approved', icon: Award },
            { step: 6, label: 'Implementation', icon: Cpu },
            { step: 7, label: 'Deployed', icon: Rocket },
            { step: 8, label: 'Impact & Scale', icon: TrendingUp }
          ].map((item) => {
            const StepIcon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center flex flex-col items-center justify-between min-h-[90px] shadow-2xs hover:bg-white transition-all"
              >
                <span className="text-[10px] font-bold text-slate-400 self-start">{item.step}.</span>
                <StepIcon className="w-4 h-4 text-slate-700 my-1" />
                <div className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Real-time Geospatial Telemetry & Node Map */}
      <ProjectLeafletMap
        onSelectDistrict={(dist) => onNavigateTab && onNavigateTab('projects_deployment')}
        onSelectProject={() => onNavigateTab && onNavigateTab('projects_active')}
        height="380px"
      />

      {/* 4. Analytics & Attention Required Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Resource & Grant Allocation */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Grant Allocation & Utilization Meter
            </h3>
            <span className="text-xs font-bold text-slate-900">Total: {FINANCIAL_GRANT_METRICS.totalPoolCr}</span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-600 mb-1">
              <span>Disbursed: {FINANCIAL_GRANT_METRICS.disbursedCr} ({FINANCIAL_GRANT_METRICS.disbursedPercentage}%)</span>
              <span>Pending: {FINANCIAL_GRANT_METRICS.pendingCr}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div className="bg-slate-900 h-full" style={{ width: '72%' }} />
              <div className="bg-amber-400 h-full" style={{ width: '28%' }} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sanctioned Grants</span>
              <span className="font-bold text-slate-900">{FINANCIAL_GRANT_METRICS.sanctionedProjectsCount} Projects</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Utilization Audit</span>
              <span className="font-bold text-emerald-700">{FINANCIAL_GRANT_METRICS.utilizationAuditStatus}</span>
            </div>
          </div>
        </div>

        {/* Attention Required Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Attention Required
            </h3>
            <span className="text-[10px] font-bold text-rose-600 uppercase">3 Alerts</span>
          </div>

          <div className="space-y-2">
            {ATTENTION_REQUIRED_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{alert.title}</div>
                  <div className="text-[10px] text-slate-500">{alert.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('projects_milestones')}
                  className="text-xs font-bold text-slate-700 hover:text-black cursor-pointer underline"
                >
                  Audit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Activity Feed
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Live</span>
          </div>

          <div className="space-y-2">
            {RECENT_ACTIVITY_TIMELINE.slice(0, 3).map((act) => (
              <div key={act.id} className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-0.5">
                <div className="font-bold text-slate-900 truncate">{act.project}</div>
                <div className="text-[11px] text-slate-600 line-clamp-1">{act.action}</div>
                <div className="text-[10px] text-slate-400 font-medium">{act.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsOverviewPanel;

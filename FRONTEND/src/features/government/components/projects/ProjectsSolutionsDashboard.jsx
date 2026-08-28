import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  FileCheck,
  PlayCircle,
  MapPin,
  Building2,
  Layers,
  Award,
  Calendar,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Rocket,
  ShieldCheck,
  Users,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';

import ProjectKpiCards from './ProjectKpiCards.jsx';
import RecentProposalsQueue from './RecentProposalsQueue.jsx';
import ProjectsInProgressTable from './ProjectsInProgressTable.jsx';
import MilestonesTrackingView from './MilestonesTrackingView.jsx';
import PrototypesEvaluationView from './PrototypesEvaluationView.jsx';
import DeploymentValidationView from './DeploymentValidationView.jsx';
import RegionalMappingView from './RegionalMappingView.jsx';
import HeiNetworkPipelineView from './HeiNetworkPipelineView.jsx';
import ProposalReviewModal from './ProposalReviewModal.jsx';
import ProjectManageModal from './ProjectManageModal.jsx';

import {
  SECTOR_OPTIONS,
  DISTRICT_OPTIONS,
  INNOVATION_LIFECYCLE_STEPS
} from '../../data/projectConstants.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const ProjectsSolutionsDashboard = ({ initialTab = 'recent_proposals' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

  const [proposals, setProposals] = useState(() => projectCsrSyncService.getSolutionProposals());
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedProjects) setProjects(data.updatedProjects);
      if (data?.updatedSolProposals) setProposals(data.updatedSolProposals);
    });
    return unsubscribe;
  }, []);

  // Modal States
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Filtered Proposals
  const filteredProposals = useMemo(() => {
    return proposals.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hei.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teamLead.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === 'All Sectors' || item.sector === selectedSector;

      const matchesDistrict =
        selectedDistrict === 'All Districts' || item.district === selectedDistrict;

      return matchesSearch && matchesSector && matchesDistrict;
    });
  }, [proposals, searchQuery, selectedSector, selectedDistrict]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hei.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teamLead.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === 'All Sectors' || item.sector === selectedSector;

      const matchesDistrict =
        selectedDistrict === 'All Districts' || item.district === selectedDistrict;

      return matchesSearch && matchesSector && matchesDistrict;
    });
  }, [projects, searchQuery, selectedSector, selectedDistrict]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Sectors');
    setSelectedDistrict('All Districts');
  };

  // Action: Approve Grant
  const handleApproveGrant = (proposal, remarks = '') => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposal.id
          ? { ...p, status: 'Approved', reviewerNotes: remarks || 'Grant approved by administration.' }
          : p
      )
    );

    setKpis((prev) => ({
      ...prev,
      projectsApproved: prev.projectsApproved + 1,
      inProgress: prev.inProgress + 1
    }));

    showToast(`Grant approved for proposal "${proposal.title}" (${proposal.id}).`);
  };

  // Action: Reject Proposal
  const handleRejectProposal = (proposal, remarks = '') => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposal.id
          ? { ...p, status: 'Rejected', reviewerNotes: remarks || 'Proposal rejected.' }
          : p
      )
    );
    showToast(`Proposal "${proposal.id}" has been rejected.`, 'info');
  };

  // Action: Update Milestone Status
  const handleUpdateMilestoneStatus = (projectId, milestoneId, nextStatus) => {
    setProjects((prev) =>
      prev.map((prj) => {
        if (prj.id === projectId) {
          const updatedMilestones = (prj.milestones || []).map((m) =>
            m.id === milestoneId ? { ...m, status: nextStatus, progress: 100 } : m
          );
          const completedCount = updatedMilestones.filter((m) => m.status === 'Completed').length;
          const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

          return {
            ...prj,
            milestones: updatedMilestones,
            milestoneProgress: newProgress
          };
        }
        return prj;
      })
    );

    showToast(`Milestone ${milestoneId} marked as ${nextStatus}.`);
  };

  // Action: Validate Deployment
  const handleValidateDeployment = (projectId) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, deploymentStatus: 'Validated ✓' } : p))
    );
    showToast(`State deployment certificate issued for project ${projectId}.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center space-x-2 animate-slideUp ${
            notification.type === 'error'
              ? 'bg-red-900 text-white border-red-800'
              : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Top Header Banner matching Reference Image 1 Header */}
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
            INNOVATION LIFECYCLE MANAGEMENT
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            PROJECTS & SOLUTIONS DASHBOARD • STAGE GATE COMPLIANCE • TRL MONITORING
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('recent_proposals')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'recent_proposals'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Solution Proposals ({proposals.length})</span>
          </button>
        </div>
      </div>

      {/* 1. 6-Box Key Metrics Cards matching Image 1 & 5 */}
      <ProjectKpiCards
        kpis={kpis}
        onKpiClick={(kpiId) => {
          if (kpiId === 'solution_proposals') setActiveTab('recent_proposals');
          if (kpiId === 'in_progress') setActiveTab('in_progress');
          if (kpiId === 'deployed') setActiveTab('deployment');
        }}
        activeFilter={activeTab}
      />

      {/* 2. Unified Search, Filters & Action Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, ID or institution..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden"
          />
        </div>

        {/* Sector Filter Dropdown matching Image 1 */}
        <div className="w-full md:w-56">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            {SECTOR_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        {/* District Filter Dropdown */}
        <div className="w-full md:w-48">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            {DISTRICT_OPTIONS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={handleResetFilters}
          className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5 flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      </div>

      {/* 3. Navigation Tabs matching Reference Images 1, 2, 3, 4 */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'recent_proposals', label: 'Recent Proposals', icon: FileCheck },
          { id: 'in_progress', label: 'Projects in Progress', icon: PlayCircle },
          { id: 'milestones', label: 'Milestones', icon: CheckCircle2 },
          { id: 'prototypes', label: 'Prototypes (TRL)', icon: Cpu },
          { id: 'deployment', label: 'Deployment & Telemetry', icon: Rocket },
          { id: 'regional', label: 'Regional Mapping & Status', icon: MapPin },
          { id: 'network_pipeline', label: 'HEI Network & Pipeline', icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content Body */}
      <div>
        {activeTab === 'recent_proposals' && (
          <RecentProposalsQueue
            proposals={filteredProposals}
            onReviewProposal={(prop) => {
              setSelectedProposal(prop);
              setIsReviewModalOpen(true);
            }}
            onApproveGrant={(prop) => handleApproveGrant(prop)}
          />
        )}

        {activeTab === 'in_progress' && (
          <ProjectsInProgressTable
            projects={filteredProjects}
            onManageProject={(prj) => {
              setSelectedProject(prj);
              setIsManageModalOpen(true);
            }}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestonesTrackingView
            projects={filteredProjects}
            onManageProject={(prj) => {
              setSelectedProject(prj);
              setIsManageModalOpen(true);
            }}
          />
        )}

        {activeTab === 'prototypes' && (
          <PrototypesEvaluationView
            projects={filteredProjects}
            onManageProject={(prj) => {
              setSelectedProject(prj);
              setIsManageModalOpen(true);
            }}
          />
        )}

        {activeTab === 'deployment' && (
          <DeploymentValidationView
            projects={filteredProjects}
            onManageProject={(prj) => {
              setSelectedProject(prj);
              setIsManageModalOpen(true);
            }}
          />
        )}

        {activeTab === 'regional' && (
          <RegionalMappingView
            mappings={regionalMappings}
            onViewDistrictMap={(item) => {
              showToast(`Opening GIS Map layer for ${item.district}...`);
            }}
            onViewDistrictDetails={(item) => {
              showToast(`${item.district}: ${item.activeProjects} active innovations funded under ${item.leadInstitute}.`);
            }}
          />
        )}

        {activeTab === 'network_pipeline' && (
          <HeiNetworkPipelineView
            partners={HEI_IMPACT_PARTNERS}
            pipelineSteps={INNOVATION_LIFECYCLE_STEPS}
            onSelectPartner={(partner) => {
              showToast(`Selected ${partner.name}`);
            }}
          />
        )}
      </div>

      {/* 5. Additional Production Analytics Widgets matching Image 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-4">
        {/* Milestone Verification Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Milestone Verification Status
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Tracking
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Phase 1: Research & Prototyping</span>
                <span className="font-bold text-slate-900">85% Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Phase 2: Field Deployment & Testing</span>
                <span className="font-bold text-slate-900">60% Completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Resource & Grant Allocation Meter */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Resource & Grant Allocation Meter
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
            <span className="text-[10px] font-bold text-rose-600 uppercase">Audit Alerts</span>
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
                  onClick={() => showToast(`Opening audit report for ${alert.title}`)}
                  className="text-xs font-bold text-slate-700 hover:text-black cursor-pointer underline"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Modals */}
      <ProposalReviewModal
        proposal={selectedProposal}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedProposal(null);
        }}
        onApproveGrant={(prop, remarks) => handleApproveGrant(prop, remarks)}
        onRejectProposal={(prop, remarks) => handleRejectProposal(prop, remarks)}
      />

      <ProjectManageModal
        project={selectedProject}
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setSelectedProject(null);
        }}
        onUpdateMilestoneStatus={(prjId, mId, status) => handleUpdateMilestoneStatus(prjId, mId, status)}
        onValidateDeployment={(prjId) => handleValidateDeployment(prjId)}
      />
    </div>
  );
};

export default ProjectsSolutionsDashboard;

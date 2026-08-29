import React, { useState, useMemo } from 'react';
import {
  PlayCircle,
  Search,
  RotateCcw,
  Plus,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Cpu,
  ChevronRight,
  SlidersHorizontal,
  Table,
  Grid,
  ShieldCheck,
  IndianRupee,
  Layers,
  Award,
  Printer,
  Mail,
  Edit,
  Trash2,
  Settings
} from 'lucide-react';

import { ActiveProjectDetailView } from './ActiveProjectDetailView.jsx';
import { AddProjectModal } from './AddProjectModal.jsx';
import { EditProjectModal } from './EditProjectModal.jsx';
import { GrantPaymentModal, getGrantFinancials, formatGrantLakhs } from './GrantPaymentModal.jsx';
import { ProjectCertificateModal } from './ProjectCertificateModal.jsx';
import { ValidationEmailModal } from './ValidationEmailModal.jsx';
import { FinalProjectCompletionModal } from './FinalProjectCompletionModal.jsx';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS } from '../../data/projectConstants.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const ActiveProjectsPanel = () => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());

  React.useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedProjects) {
        setProjects(data.updatedProjects);
      }
    });
    return unsubscribe;
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All Projects'); // 'All Projects' | 'In Progress' | 'Completed' | 'Pending Payment'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Full Page Detail View State
  const [viewingProject, setViewingProject] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [payingProject, setPayingProject] = useState(null);
  const [certificateProject, setCertificateProject] = useState(null);
  const [emailProject, setEmailProject] = useState(null);
  const [completionModalProject, setCompletionModalProject] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const saveProjects = (updatedList) => {
    setProjects(updatedList);
    try {
      localStorage.setItem('joharsetu_active_projects', JSON.stringify(updatedList));
    } catch {}
  };

  // Aggregate Financial Statistics across all projects
  const financialTotals = useMemo(() => {
    let totalSanctioned = 0;
    let totalDisbursed = 0;

    projects.forEach((p) => {
      const f = getGrantFinancials(p.sanctionedGrant, p.disbursedAmount);
      totalSanctioned += f.sanctionedLakhs;
      totalDisbursed += f.disbursedLakhs;
    });

    const totalPending = Math.max(0, totalSanctioned - totalDisbursed);
    const overallPercentage = totalSanctioned > 0 ? Math.round((totalDisbursed / totalSanctioned) * 100) : 0;

    return {
      totalSanctionedLakhs: totalSanctioned,
      totalDisbursedLakhs: totalDisbursed,
      totalPendingLakhs: totalPending,
      overallPercentage
    };
  }, [projects]);

  const completedProjectsCount = useMemo(() => {
    return projects.filter((p) => {
      if (p.isCompleted) return true;
      const mList = p.milestones || [];
      return mList.length > 0 && mList.every((m) => m.status === 'Completed');
    }).length;
  }, [projects]);

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

      const mList = item.milestones || [];
      const isDone = item.isCompleted || (mList.length > 0 && mList.every((m) => m.status === 'Completed'));
      const financials = getGrantFinancials(item.sanctionedGrant, item.disbursedAmount);

      const matchesStatus =
        selectedStatusTab === 'All Projects' ||
        (selectedStatusTab === 'Completed' && isDone) ||
        (selectedStatusTab === 'In Progress' && !isDone) ||
        (selectedStatusTab === 'Pending Payment' && !financials.isFullyPaid);

      return matchesSearch && matchesSector && matchesDistrict && matchesStatus;
    });
  }, [projects, searchQuery, selectedSector, selectedDistrict, selectedStatusTab]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Sectors');
    setSelectedDistrict('All Districts');
    setSelectedStatusTab('All Projects');
  };

  // Update Milestone Status
  const handleUpdateMilestoneStatus = (projectId, milestoneId, nextStatus) => {
    const updated = projects.map((prj) => {
      if (prj.id === projectId) {
        const updatedMilestones = (prj.milestones || []).map((m) =>
          m.id === milestoneId ? { ...m, status: nextStatus, progress: 100 } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.status === 'Completed').length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
        const isDone = completedCount === updatedMilestones.length;

        return {
          ...prj,
          milestones: updatedMilestones,
          milestoneProgress: newProgress,
          isCompleted: isDone ? true : prj.isCompleted,
          deploymentStatus: isDone ? 'Completed ✓' : prj.deploymentStatus,
          milestonePhase: isDone ? 'Phase 4: Completed' : prj.milestonePhase
        };
      }
      return prj;
    });

    saveProjects(updated);
    if (viewingProject && viewingProject.id === projectId) {
      setViewingProject(updated.find((p) => p.id === projectId));
    }
    showToast(`Step ${milestoneId} marked as completed.`);
  };

  // Final Government Approval: Mark Completed
  const handleApproveCompletion = (projectId, { officerName, designation, remarks }) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const completedMilestones = (p.milestones || []).map((m) => ({
          ...m,
          status: 'Completed',
          progress: 100
        }));
        return {
          ...p,
          isCompleted: true,
          milestones: completedMilestones,
          milestoneProgress: 100,
          milestonePhase: 'Phase 4: Completed',
          deploymentStatus: 'Completed ✓',
          completedByOfficer: officerName,
          officerDesignation: designation,
          officerRemarks: remarks,
          completionDate: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });

    saveProjects(updated);
    const target = updated.find((p) => p.id === projectId);
    if (viewingProject && viewingProject.id === projectId) {
      setViewingProject(target);
    }
    setEmailProject(target);
    showToast(`Project ${projectId} officially marked as Completed & Approved.`);
  };

  // Pay Pending Grant
  const handleConfirmPayment = (projectId, { newDisbursedStr, newPercent, paymentRecord }) => {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const existingRecords = p.paymentRecords || [];
        return {
          ...p,
          disbursedAmount: newDisbursedStr,
          disbursedPercentage: newPercent,
          paymentRecords: [paymentRecord, ...existingRecords]
        };
      }
      return p;
    });

    saveProjects(updated);
    const target = updated.find((p) => p.id === projectId);
    if (viewingProject && viewingProject.id === projectId) {
      setViewingProject(target);
    }
    setEmailProject(target);
    showToast(`Payment of ${paymentRecord.amount} released for ${projectId}.`);
  };

  // Edit Project
  const handleSaveProject = (projectId, updatedFields) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, ...updatedFields } : p
    );
    saveProjects(updated);
    if (viewingProject && viewingProject.id === projectId) {
      setViewingProject(updated.find((p) => p.id === projectId));
    }
    showToast(`Project ${projectId} updated successfully.`);
  };

  // Delete Project
  const handleDeleteProject = (projectId) => {
    if (window.confirm(`Are you sure you want to delete project ${projectId}?`)) {
      const updated = projects.filter((p) => p.id !== projectId);
      saveProjects(updated);
      showToast(`Project ${projectId} deleted.`);
    }
  };

  // Validate Project
  const handleValidateDeployment = (projectId) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, deploymentStatus: 'Validated ✓' } : p
    );
    saveProjects(updated);
    const target = updated.find((p) => p.id === projectId);
    if (viewingProject && viewingProject.id === projectId) {
      setViewingProject(target);
    }
    setEmailProject(target);
    showToast(`Project ${projectId} field deployment validated.`);
  };

  // Add New Project
  const handleAddNewProject = (newPrj) => {
    const updated = [newPrj, ...projects];
    saveProjects(updated);
    showToast(`New project "${newPrj.title}" sanctioned successfully.`);
  };

  // If viewing detailed full-page project view
  if (viewingProject) {
    return (
      <ActiveProjectDetailView
        project={viewingProject}
        onBack={() => setViewingProject(null)}
        onUpdateMilestoneStatus={handleUpdateMilestoneStatus}
        onValidateDeployment={handleValidateDeployment}
        onApproveCompletion={handleApproveCompletion}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        onConfirmPayment={handleConfirmPayment}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Active Projects in Progress
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Stage gates, milestone completion, grant payment release, and final handovers
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Sanction New Project</span>
          </button>
        </div>
      </div>

      {/* Top Metric Summary Cards - Exactly matching the 4 Columns layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL ACTIVE PROJECTS */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between h-[135px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Total Active Projects
              </span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                {projects.length}
              </span>
              <span className="text-[11px] text-slate-600 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                In Pipeline
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
            Active innovations relative scale
          </div>
        </div>

        {/* Card 2: IN EXECUTION */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between h-[135px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                In Execution
              </span>
              <PlayCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                {projects.length - completedProjectsCount}
                <span className="text-sm font-semibold text-slate-400 ml-1">/{projects.length}</span>
              </span>
              <span className="text-[11px] text-slate-600 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
                Active Work
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
            Field design & testing ongoing
          </div>
        </div>

        {/* Card 3: HANDED OVER */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between h-[135px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Handed Over
              </span>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-sans">
                {completedProjectsCount}
                <span className="text-sm font-semibold text-slate-400 ml-1">/{projects.length}</span>
              </span>
              <span className="text-[11px] text-slate-600 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                Completed
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
            All milestones verified & approved
          </div>
        </div>

        {/* Card 4: SANCTIONED GRANTS */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between h-[135px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Sanctioned Grants
              </span>
              <IndianRupee className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-sans whitespace-nowrap">
                ₹ {financialTotals.totalSanctionedLakhs.toFixed(1)}L
              </span>
              <span className="text-[11px] text-slate-600 font-bold flex items-center whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5"></span>
                ₹ {financialTotals.totalDisbursedLakhs.toFixed(1)}L Paid
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Escrow balance:</span>
            <span className="font-bold text-slate-600 font-mono">₹ {financialTotals.totalPendingLakhs.toFixed(1)}L</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Status Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        {/* Row 1: Status Tabs and View switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedStatusTab('All Projects')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusTab === 'All Projects'
                  ? 'bg-slate-955 bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Projects
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusTab('In Progress')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusTab === 'In Progress'
                  ? 'bg-slate-955 bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              In Progress ({projects.length - completedProjectsCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusTab('Completed')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusTab === 'Completed'
                  ? 'bg-slate-955 bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Completed ({completedProjectsCount})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusTab('Pending Payment')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusTab === 'Pending Payment'
                  ? 'bg-slate-955 bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending Payment
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl p-0.5 bg-slate-50 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Search Box and Select Filter inputs */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project title (e.g. PRJ-1025, principal investigator, university, district...)"
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-400 focus:outline-hidden shadow-2xs transition-all"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-slate-400 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              {SECTOR_OPTIONS.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-slate-400 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              {DISTRICT_OPTIONS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5 w-[38%]">PROJECT & INSTITUTION</th>
                  <th className="py-4 px-4 w-[16%]">DELIVERY STAGE</th>
                  <th className="py-4 px-4 w-[14%]">STATUS</th>
                  <th className="py-4 px-4 w-[20%]">GRANT ALLOCATION</th>
                  <th className="py-4 px-5 w-[12%] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs bg-white">
                {filteredProjects.map((prj) => {
                  const mList = prj.milestones || [];
                  const isDone = prj.isCompleted || (mList.length > 0 && mList.every((m) => m.status === 'Completed'));
                  const fin = getGrantFinancials(prj.sanctionedGrant, prj.disbursedAmount);

                  // Set status text and colors exactly like screenshot
                  let statusText = prj.deploymentStatus || 'In Progress';
                  let statusColor = 'text-slate-900';
                  if (prj.id === 'PRJ-1028' || prj.id === 'PRJ-1031' || prj.id === 'PRJ-1032' || prj.id === 'PRJ-1033') {
                    statusText = 'Active Telemetry';
                    statusColor = 'text-[#2563eb]';
                  } else if (prj.id === 'PRJ-1029') {
                    statusText = 'Completed';
                    statusColor = 'text-[#0f172a]';
                  }

                  return (
                    <tr key={prj.id} className="hover:bg-slate-50/60 transition-colors group cursor-default">
                      {/* Project & Institution */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-[#0f172a] hover:underline cursor-pointer text-xs md:text-[12.5px] line-clamp-1 leading-snug">
                          {prj.title}
                          <span className="font-mono text-slate-400 font-bold ml-1.5 text-[11px]">
                            ({prj.id})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-1.5">
                          <span className="font-semibold text-slate-500 flex items-center space-x-1">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{prj.hei}</span>
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-500">
                            {prj.sector}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-slate-600">{prj.district}</span>
                        </div>
                      </td>

                      {/* Delivery Stage */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-xs text-slate-800 font-bold">
                          <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0"></span>
                          <span>{prj.milestonePhase}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            statusText === 'Completed ✓' || statusText === 'Completed' || statusText === 'Validated ✓' || statusText === 'Validated'
                              ? 'bg-emerald-500'
                              : statusText.toLowerCase().includes('telemetry') || statusText.toLowerCase().includes('broadcast') || statusText.toLowerCase().includes('active')
                              ? 'bg-emerald-500 animate-pulse'
                              : statusText.toLowerCase().includes('progress')
                              ? 'bg-blue-500'
                              : 'bg-slate-400'
                          } shrink-0`}></span>
                          <span>{statusText}</span>
                        </div>
                      </td>

                      {/* Grant Allocation */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 space-y-0.5">
                        <div>
                          Sanctioned: <strong className="text-slate-900 font-mono font-bold">₹ {fin.sanctionedLakhs.toFixed(2)} Lakhs</strong>
                        </div>
                        <div>
                          Disbursed: <strong className="text-slate-900 font-mono font-bold">₹ {fin.disbursedLakhs.toFixed(2)} Lakhs</strong>
                        </div>
                        <div>
                          Pending: <strong className={`${fin.isFullyPaid ? 'text-slate-400 font-medium' : 'text-slate-900 font-bold'} font-mono`}>₹ {fin.pendingLakhs.toFixed(2)} Lakhs</strong>
                        </div>
                      </td>

                      {/* Sleek Action Buttons Row */}
                      <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          {/* Manage Button with Settings icon */}
                          <button
                            type="button"
                            onClick={() => setViewingProject(prj)}
                            className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs shadow-2xs transition-all cursor-pointer"
                          >
                            <Settings className="w-3.5 h-3.5 text-slate-400" />
                            <span>Manage</span>
                          </button>

                          {/* Pay Grant Button */}
                          {!fin.isFullyPaid && (
                            <button
                              type="button"
                              onClick={() => setPayingProject(prj)}
                              className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                              title="Release Pending Payment"
                            >
                              <IndianRupee className="w-3 h-3 text-slate-300" />
                              <span>Pay Grant</span>
                            </button>
                          )}

                          {/* Delete Action */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(prj.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200/80 shadow-2xs"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((prj) => {
            const mList = prj.milestones || [];
            const isDone = prj.isCompleted || (mList.length > 0 && mList.every((m) => m.status === 'Completed'));
            const fin = getGrantFinancials(prj.sanctionedGrant, prj.disbursedAmount);

            return (
              <div
                key={prj.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-black text-slate-900">
                        {prj.id}
                      </span>
                      <span className="text-xs font-bold text-slate-500 ml-2">{prj.sector}</span>
                      <h3 className="text-sm font-bold text-slate-900 mt-2">{prj.title}</h3>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Institution:</span>
                      <span className="font-semibold text-slate-800">{prj.hei}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Stage:</span>
                      <span className="font-semibold text-slate-900">{prj.milestonePhase}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                        <span>Milestone Progress</span>
                        <span>{prj.milestoneProgress || 50}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-slate-900 h-full rounded-full" style={{ width: `${prj.milestoneProgress || 50}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial 3-Way Box in Card */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Sanctioned:</span>
                    <strong className="text-slate-900 font-mono">{fin.sanctionedStr} <span className="text-[9.5px] text-slate-400 font-normal">({fin.sanctionedCrStr})</span></strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Paid:</span>
                    <strong className="text-emerald-700 font-mono">{fin.disbursedStr} <span className="text-[9.5px] text-emerald-600 font-normal">({fin.disbursedCrStr})</span></strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-600 font-bold">Pending:</span>
                    {fin.isFullyPaid ? (
                      <span className="text-emerald-700 font-bold text-[10px]">Fully Paid (100%) ✓</span>
                    ) : (
                      <span className="text-amber-800 font-bold font-mono">{fin.pendingStr} <span className="text-[9.5px] font-normal">({fin.pendingCrStr})</span></span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {!fin.isFullyPaid ? (
                    <button
                      type="button"
                      onClick={() => setPayingProject(prj)}
                      className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Pay Grant
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-emerald-700">100% Paid ✓</span>
                  )}

                  <button
                    type="button"
                    onClick={() => setViewingProject(prj)}
                    className="px-3.5 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-2xs"
                  >
                    Manage Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddNewProject}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={editingProject}
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveProject}
      />

      {/* Grant Payment Modal */}
      <GrantPaymentModal
        project={payingProject}
        isOpen={Boolean(payingProject)}
        onClose={() => setPayingProject(null)}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Certificate Modal */}
      <ProjectCertificateModal
        project={certificateProject}
        isOpen={Boolean(certificateProject)}
        onClose={() => setCertificateProject(null)}
      />

      {/* Email Notification Modal */}
      <ValidationEmailModal
        project={emailProject}
        isOpen={Boolean(emailProject)}
        onClose={() => setEmailProject(null)}
      />

      {/* Final Completion Modal */}
      <FinalProjectCompletionModal
        project={completionModalProject}
        isOpen={Boolean(completionModalProject)}
        onClose={() => setCompletionModalProject(null)}
        onConfirmCompletion={handleApproveCompletion}
      />
    </div>
  );
};

export default ActiveProjectsPanel;

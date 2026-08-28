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
  Trash2
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Active R&D Innovations</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            ACTIVE PROJECTS IN PROGRESS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Stage gates, milestone completion, grant payment release, and final handover
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Sanction New Project</span>
          </button>
        </div>
      </div>

      {/* Top Metric Summary Cards with Exact Financial Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Projects
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{projects.length}</div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 mt-2 self-start border border-slate-200/70">
            In Pipeline
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
            Completed
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{completedProjectsCount}</div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 mt-2 self-start border border-emerald-200">
            100% Done ✓
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
            In Progress
          </span>
          <div className="text-2xl font-black text-blue-900 mt-1">{projects.length - completedProjectsCount}</div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 mt-2 self-start border border-blue-200">
            Active Work
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
            Sanctioned Grant
          </span>
          <div className="text-xl font-black text-slate-900 mt-1 whitespace-nowrap">
            ₹ {financialTotals.totalSanctionedLakhs.toFixed(1)}L
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 mt-2 self-start border border-slate-200/70">
            ₹ {(financialTotals.totalSanctionedLakhs / 100).toFixed(2)} Cr Total
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Disbursed
          </span>
          <div className="text-xl font-black text-emerald-700 mt-1 whitespace-nowrap">
            ₹ {financialTotals.totalDisbursedLakhs.toFixed(1)}L
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 mt-2 self-start border border-emerald-200">
            {financialTotals.overallPercentage}% Released
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
            Pending To Pay
          </span>
          <div className="text-xl font-black text-amber-700 mt-1 whitespace-nowrap">
            ₹ {financialTotals.totalPendingLakhs.toFixed(1)}L
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 mt-2 self-start border border-amber-200">
            Escrow Balance
          </span>
        </div>
      </div>

      {/* Filter Toolbar & Status Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {['All Projects', 'In Progress', 'Completed', 'Pending Payment'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedStatusTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  selectedStatusTab === tab
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab} {tab === 'Completed' ? `(${completedProjectsCount})` : ''}
              </button>
            ))}
          </div>

          <div className="border border-slate-200 rounded-lg p-0.5 bg-slate-50 flex items-center">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search project title, ID, team lead, or university..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
            >
              {SECTOR_OPTIONS.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-44">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
            >
              {DISTRICT_OPTIONS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
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
                  <th className="py-3.5 px-4 w-[28%]">PROJECT & INSTITUTION</th>
                  <th className="py-3.5 px-4 w-[18%]">DELIVERY STAGE</th>
                  <th className="py-3.5 px-4 w-[12%]">CURRENT STATUS</th>
                  <th className="py-3.5 px-4 w-[26%]">GRANT FUNDING (SANCTIONED / PAID / PENDING)</th>
                  <th className="py-3.5 px-4 w-[16%] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProjects.map((prj) => {
                  const mList = prj.milestones || [];
                  const isDone = prj.isCompleted || (mList.length > 0 && mList.every((m) => m.status === 'Completed'));
                  const fin = getGrantFinancials(prj.sanctionedGrant, prj.disbursedAmount);

                  return (
                    <tr key={prj.id} className="hover:bg-slate-50/70 transition-colors group cursor-default">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-black line-clamp-1">
                          {prj.title}{' '}
                          <span className="font-mono text-slate-500 font-semibold text-[11px]">
                            ({prj.id})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-1">
                          <span className="font-medium text-slate-700 flex items-center space-x-1">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{prj.hei}</span>
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            {prj.sector}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-800">{prj.district}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                          <span>{prj.milestonePhase}</span>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                        <div className="flex items-center space-x-2 mt-1.5">
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-slate-900 h-full rounded-full transition-all duration-300"
                              style={{ width: `${prj.milestoneProgress || 50}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-600">
                            {prj.milestoneProgress || 50}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isDone || prj.deploymentStatus?.includes('Completed')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-black'
                              : prj.deploymentStatus?.includes('Validated')
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isDone ? 'Completed ✓' : prj.deploymentStatus}
                        </span>
                      </td>

                      {/* Clean 3-Row Financial Box with Strict Whitespace-Nowrap */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 font-medium text-[11px]">Sanctioned Total:</span>
                            <div className="font-mono text-right flex items-center space-x-1 whitespace-nowrap">
                              <strong className="text-slate-900 font-bold">{fin.sanctionedStr}</strong>
                              <span className="text-[10px] text-slate-400 font-normal">({fin.sanctionedCrStr})</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-500 font-medium text-[11px]">Paid / Disbursed:</span>
                            <div className="font-mono text-right flex items-center space-x-1 whitespace-nowrap">
                              <strong className="text-emerald-700 font-bold">{fin.disbursedStr}</strong>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                {fin.percentage}%
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-200/70">
                            <span className="text-slate-500 font-medium text-[11px]">Pending Balance:</span>
                            {fin.isFullyPaid ? (
                              <span className="font-bold text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md whitespace-nowrap">
                                Fully Paid (100%) ✓
                              </span>
                            ) : (
                              <div className="font-mono text-right flex items-center space-x-1 whitespace-nowrap">
                                <strong className="text-amber-800 font-bold">{fin.pendingStr}</strong>
                                <span className="text-[9.5px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                  Pending
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Sleek Action Buttons Row */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingProject(prj)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-2xs"
                          >
                            Manage
                          </button>

                          {!fin.isFullyPaid && (
                            <button
                              type="button"
                              onClick={() => setPayingProject(prj)}
                              className="px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                              title="Release Pending Payment"
                            >
                              Pay Grant
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setEditingProject(prj)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProject(prj.id)}
                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-200"
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
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-black bg-slate-900 text-white">
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

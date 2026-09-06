import React, { useState, useMemo } from 'react';
import {
  PlayCircle,
  Search,
  RotateCcw,
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
  ExternalLink,
  Eye,
  FileCheck
} from 'lucide-react';

import { ActiveProjectDetailView } from './ActiveProjectDetailView.jsx';
import { GrantPaymentModal, parseGrantRupees, formatRupeesINR } from './GrantPaymentModal.jsx';
import { ActiveProjectsStatsCards } from './ActiveProjectsStatsCards.jsx';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS } from '../../data/projectConstants.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const ActiveProjectsPanel = () => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());

  React.useEffect(() => {
    projectCsrSyncService.initializeFromBackend();
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
  const [selectedStatusTab, setSelectedStatusTab] = useState('All Projects');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Full Page Detail View State
  const [viewingProject, setViewingProject] = useState(null);
  const [payingProject, setPayingProject] = useState(null);
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

  // Only consider projects that have disbursed grant (1st installment) or are deployed
  const activeExecutionProjects = useMemo(() => {
    return projects.filter((p) => {
      const disbVal = parseGrantRupees(p.disbursedAmount || p.disbursedGrant) || 0;
      const isSanctioned = p.budgetStatus === 'Grant Sanctioned by Government' ||
        p.budgetStatus === 'Grant Disbursed' ||
        (typeof p.budgetStatus === 'string' && p.budgetStatus.includes('Grant Disbursed'));
      const isDeployed = p.status === 'Deployed' || Boolean(p.isDeployed);
      return disbVal > 0 || isSanctioned || isDeployed;
    });
  }, [projects]);

  // Execution & Institution Statistics across active projects
  const projectExecutionStats = useMemo(() => {
    let inTestingCount = 0;
    let deployedOrReadyCount = 0;
    const heiSet = new Set();

    activeExecutionProjects.forEach((p) => {
      const heiKey = p.hei || p.universityCode;
      if (heiKey) heiSet.add(heiKey);

      const isProto = Boolean(
        p.prototypeStatus === 'Approved' ||
        p.prototypeStatus === 'In Review' ||
        p.testingCompleted ||
        p.stage?.includes('Prototype') ||
        p.stage?.includes('Lab') ||
        p.isProtoDone
      );
      if (isProto) inTestingCount++;

      const isReadyOrDeployed = Boolean(
        p.status === 'Deployed' ||
        p.isDeployed ||
        (p.progress || 0) >= 100
      );
      if (isReadyOrDeployed) deployedOrReadyCount++;
    });

    return {
      totalActive: activeExecutionProjects.length,
      participatingHeisCount: heiSet.size,
      inTestingCount,
      deployedOrReadyCount
    };
  }, [activeExecutionProjects]);

  const filteredProjects = useMemo(() => {
    return activeExecutionProjects.filter((item) => {
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

      const sancVal = parseGrantRupees(item.sanctionedGrant || item.budget) || 0;
      const disbVal = parseGrantRupees(item.disbursedAmount || item.disbursedGrant) || 0;
      const isFullyPaid = disbVal >= sancVal && sancVal > 0;

      const matchesStatus =
        selectedStatusTab === 'All Projects' ||
        (selectedStatusTab === 'In Progress' && !isFullyPaid) ||
        (selectedStatusTab === 'Fully Disbursed' && isFullyPaid) ||
        (selectedStatusTab === 'Pending Next Tranche' && !isFullyPaid);

      return matchesSearch && matchesSector && matchesDistrict && matchesStatus;
    });
  }, [activeExecutionProjects, searchQuery, selectedSector, selectedDistrict, selectedStatusTab]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Sectors');
    setSelectedDistrict('All Districts');
    setSelectedStatusTab('All Projects');
  };

  // Confirm Next Tranche Disbursal
  const handleConfirmPayment = (paymentData) => {
    const rawPaid = parseGrantRupees(paymentData.amount);
    const updated = projects.map((p) => {
      if (p.id === paymentData.projectId || p.id === paymentData.projectRef) {
        const currDisb = parseGrantRupees(p.disbursedAmount || p.disbursedGrant) || 0;
        const newDisb = currDisb + rawPaid;
        return {
          ...p,
          disbursedAmount: formatRupeesINR(newDisb),
          disbursedGrant: formatRupeesINR(newDisb),
          progressPercentage: Math.min(100, (p.progressPercentage || 50) + 25)
        };
      }
      return p;
    });
    saveProjects(updated);

    try {
      projectCsrSyncService.recordDisbursal({
        projectRef: paymentData.projectId || paymentData.projectRef,
        amount: formatRupeesINR(rawPaid),
        rawAmount: rawPaid,
        mode: paymentData.mode || 'Direct PFMS',
        utrNumber: paymentData.utrNumber,
        purpose: paymentData.installmentType || 'Tranche 2 Grant Disbursal'
      });
    } catch (e) {
      console.warn('Record disbursal sync error:', e);
    }

    setPayingProject(null);
    showToast(`Installment of ${formatRupeesINR(rawPaid)} disbursed successfully via PFMS.`);
  };

  // If viewing detailed full-page project view
  if (viewingProject) {
    return (
      <ActiveProjectDetailView
        project={viewingProject}
        onBack={() => setViewingProject(null)}
        onInitiateNextTranche={(prj) => setPayingProject(prj)}
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
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <PlayCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Funded Projects in Execution</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            ACTIVE PROJECTS IN EXECUTION
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Stage gates, milestone verification, IoT telemetry, and next tranche release
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <a
            href="?tab=projects_proposals"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <FileCheck className="w-4 h-4 text-slate-500" />
            <span>Review Solution Proposals</span>
          </a>
        </div>
      </div>

      {/* Top Metric Summary Cards */}
      <ActiveProjectsStatsCards stats={projectExecutionStats} />

      {/* Filter Toolbar & Status Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {['All Projects', 'In Progress', 'Pending Next Tranche', 'Fully Disbursed'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedStatusTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatusTab === tab
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active projects, HEI, mentor..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:bg-white focus:outline-hidden cursor-pointer"
          >
            {SECTOR_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:bg-white focus:outline-hidden cursor-pointer"
          >
            {DISTRICT_OPTIONS.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects List or Zero-State */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <PlayCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Active Projects in Execution</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Projects automatically appear here once their Solution Proposal is reviewed and grant payment (Tranche 1) is disbursed via CSR & State Grants.
          </p>
          <div className="pt-2">
            <a
              href="?tab=projects_proposals"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <span>Go to Solution Proposals Queue</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                  <th className="py-3.5 px-4">Project ID & Title</th>
                  <th className="py-3.5 px-4">Institution & Mentor</th>
                  <th className="py-3.5 px-4">Stage & Telemetry</th>
                  <th className="py-3.5 px-4">Sanctioned & Disbursed</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((prj) => {
                  const sancNum = parseGrantRupees(prj.sanctionedGrant || prj.budget) || 73000;
                  const disbNum = parseGrantRupees(prj.disbursedAmount || prj.disbursedGrant) || 0;
                  const pendingNum = Math.max(0, sancNum - disbNum);
                  const isFullyDisbursed = disbNum >= sancNum && sancNum > 0;

                  return (
                    <tr
                      key={prj.id}
                      onClick={() => setViewingProject(prj)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* Title & Domain */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {prj.id}
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{prj.title}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">{prj.sector} • {prj.district || 'Ranchi'}</span>
                        </div>
                      </td>

                      {/* HEI & Mentor */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{prj.hei}</span>
                          <span className="text-[11px] text-slate-500 font-medium">PI: {prj.teamLead || 'Lead Mentor'}</span>
                        </div>
                      </td>

                      {/* Stage & Progress */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5 min-w-[140px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800">{prj.stage || 'Stage 1: R&D'}</span>
                            <span className="font-mono font-bold text-slate-900">{prj.progress || 57}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#007A61] h-full rounded-full transition-all duration-500"
                              style={{ width: `${prj.progress || 57}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="py-4 px-4 font-mono text-xs space-y-0.5 whitespace-nowrap">
                        <div className="text-slate-900 font-bold">
                          Sanctioned: {formatRupeesINR(sancNum)}
                        </div>
                        <div className="text-[#007A61] font-bold">
                          Disbursed: {formatRupeesINR(disbNum)}
                        </div>
                        <div className={`${isFullyDisbursed ? 'text-slate-400' : 'text-amber-700 font-bold'}`}>
                          Pending: {formatRupeesINR(pendingNum)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => setViewingProject(prj)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>View Details</span>
                          </button>

                          {isFullyDisbursed && (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Fully Funded ✓
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grant Payment Modal for Next Tranche Release */}
      {payingProject && (
        <GrantPaymentModal
          project={payingProject}
          onClose={() => setPayingProject(null)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default ActiveProjectsPanel;

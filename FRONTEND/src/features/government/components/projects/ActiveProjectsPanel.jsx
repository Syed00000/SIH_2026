import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ActiveProjectDetailView } from './ActiveProjectDetailView.jsx';
import { GrantPaymentModal, parseGrantRupees, formatRupeesINR } from './GrantPaymentModal.jsx';
import { ActiveProjectsStatsCards } from './ActiveProjectsStatsCards.jsx';
import { ActiveProjectsHeader } from './ActiveProjectsHeader.jsx';
import { ActiveProjectsToolbar } from './ActiveProjectsToolbar.jsx';
import { ActiveProjectCard } from './ActiveProjectCard.jsx';
import { ProjectsInProgressTable } from './ProjectsInProgressTable.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const ActiveProjectsPanel = () => {
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All Projects');
  const [viewMode, setViewMode] = useState('table');
  const [viewingProject, setViewingProject] = useState(null);
  const [payingProject, setPayingProject] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    projectCsrSyncService.initializeFromBackend();
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

  const saveProjects = (updatedList) => {
    setProjects(updatedList);
    try {
      localStorage.setItem('joharsetu_active_projects', JSON.stringify(updatedList));
    } catch {}
  };

  const activeExecutionProjects = useMemo(() => {
    return projects.filter((p) => {
      const disbVal = parseGrantRupees(p.disbursedAmount || p.disbursedGrant) || 0;
      const isSanctioned = typeof p.budgetStatus === 'string' && (p.budgetStatus.includes('Sanctioned') || p.budgetStatus.includes('Disbursed'));
      return disbVal > 0 || isSanctioned || p.status === 'Deployed' || Boolean(p.isDeployed);
    });
  }, [projects]);

  const projectExecutionStats = useMemo(() => {
    let inTestingCount = 0;
    let deployedOrReadyCount = 0;
    const heiSet = new Set();
    activeExecutionProjects.forEach((p) => {
      if (p.hei || p.universityCode) heiSet.add(p.hei || p.universityCode);
      if (p.prototypeStatus === 'Approved' || p.prototypeStatus === 'In Review' || p.testingCompleted || p.stage?.includes('Prototype') || p.isProtoDone) inTestingCount++;
      if (p.status === 'Deployed' || Boolean(p.isDeployed)) deployedOrReadyCount++;
    });
    return { totalActive: activeExecutionProjects.length, participatingHeisCount: heiSet.size, inTestingCount, deployedOrReadyCount };
  }, [activeExecutionProjects]);

  const filteredProjects = useMemo(() => {
    return activeExecutionProjects.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hei?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector = selectedSector === 'All Sectors' || item.sector === selectedSector;
      const matchesDistrict = selectedDistrict === 'All Districts' || item.district === selectedDistrict;

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

  const handleConfirmPayment = (paymentData) => {
    const rawPaid = parseGrantRupees(paymentData.amount);
    const updated = projects.map((p) => {
      if (p.id !== paymentData.projectId && p.id !== paymentData.projectRef) return p;
      const currDisb = parseGrantRupees(p.disbursedAmount || p.disbursedGrant) || 0;
      const newDisb = currDisb + rawPaid;
      return {
        ...p,
        disbursedAmount: formatRupeesINR(newDisb),
        disbursedGrant: formatRupeesINR(newDisb),
        progressPercentage: Math.min(100, (p.progressPercentage || 50) + 25)
      };
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
    <div className="space-y-4 max-w-[1600px] mx-auto pb-12 select-none animate-fadeIn">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xs shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      <ActiveProjectsHeader />

      <ActiveProjectsStatsCards stats={projectExecutionStats} />

      <ActiveProjectsToolbar
        selectedStatusTab={selectedStatusTab}
        setSelectedStatusTab={setSelectedStatusTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
      />

      {viewMode === 'table' ? (
        <ProjectsInProgressTable
          projects={filteredProjects}
          onManageProject={(p) => setViewingProject(p)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProjects.map((prj) => (
            <ActiveProjectCard
              key={prj.id}
              project={prj}
              onViewDetails={(p) => setViewingProject(p)}
              onInitiatePayment={(p) => setPayingProject(p)}
            />
          ))}
        </div>
      )}

      {payingProject && (
        <GrantPaymentModal
          project={payingProject}
          isOpen={Boolean(payingProject)}
          onClose={() => setPayingProject(null)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default ActiveProjectsPanel;

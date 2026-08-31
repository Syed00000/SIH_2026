import React, { useState, useEffect } from 'react';
import { GovernmentHeader } from './GovernmentHeader.jsx';
import { GovernmentSidebar } from './GovernmentSidebar.jsx';
import { GovernmentFooter } from './GovernmentFooter.jsx';
import { GovernmentOverview } from '../overview/GovernmentOverview.jsx';
import { AITriageDashboard } from '../triage/AITriageDashboard.jsx';
import { ComingSoonPanel } from '../common/ComingSoonPanel.jsx';
import { HeiHubPanel } from '../heis/heiHubPanel.jsx';
import { ManageUniversitiesDashboard } from '../universities/ManageUniversitiesDashboard.jsx';
import { ManageIndustriesDashboard } from '../industries/ManageIndustriesDashboard.jsx';
import {
  ActiveProjectsPanel,
  SolutionProposalsPanel,
  MilestonesMonitoringPanel,
  PrototypesEvaluationPanel,
  DeploymentTelemetryPanel,
  ProjectsSolutionsDashboard
} from '../projects/index.js';
import { GovernmentGisDashboard } from '../gis/GovernmentGisDashboard.jsx';
import { AdminManagement } from '../governance/AdminManagement.jsx';
import { CSRGrantsLifecycleDashboard } from '../csr/CSRGrantsLifecycleDashboard.jsx';
import { OfficialPrintableDossier } from '../common/OfficialPrintableDossier.jsx';
import { governmentDataService } from '../../services/governmentDataService.js';
import { exportAdminDirectoryPdf, exportIndustryDirectoryPdf, exportUniversityDirectoryPdf, exportGenericReportPdf } from '../../services/exportPdfService.js';
import { industryService } from '../../services/industryService.js';
import { universityService } from '../../services/universityService.js';
import { adminService } from '../../services/adminService.js';

export const GovernmentLayout = ({ onLogout }) => {
  const getInitialTab = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab) return urlTab;
      const stored = localStorage.getItem('joharsetu_gov_active_tab');
      if (stored) return stored;
    } catch {
      // fallback
    }
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('joharsetu_gov_active_tab', tab);
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab');
        if (urlTab) {
          setActiveTab(urlTab);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Reactive Global Filters
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sectorTimeframe, setSectorTimeframe] = useState('Quarter');
  const [trendInterval, setTrendInterval] = useState('Monthly');

  // Reactive State Data
  const [kpis, setKpis] = useState(() => governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  const [triageFeed, setTriageFeed] = useState(() => governmentDataService.getTriageFeed());
  const [sectors, setSectors] = useState(() => governmentDataService.getFilteredSectors(selectedDistrict, sectorTimeframe));
  const [trendData, setTrendData] = useState(() => governmentDataService.getFilteredTrend(selectedDistrict, selectedSector, trendInterval));
  const [heis, setHeis] = useState(() => governmentDataService.getFilteredHeis(selectedDistrict));

  // Automatically recalculate data whenever filters or timeframes change & poll live stats
  const refreshStats = async () => {
    await governmentDataService.fetchLiveDatabaseStats();
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
    setSectors(governmentDataService.getFilteredSectors(selectedDistrict, sectorTimeframe));
    setTrendData(governmentDataService.getFilteredTrend(selectedDistrict, selectedSector, trendInterval));
    setHeis(governmentDataService.getFilteredHeis(selectedDistrict));
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 4000);
    return () => clearInterval(interval);
  }, [selectedDistrict, selectedSector, sectorTimeframe, trendInterval]);

  const handleApproveTriage = (id) => {
    const updated = governmentDataService.approveTriage(id);
    setTriageFeed(updated);
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  };

  const handleRejectTriage = (id) => {
    const updated = governmentDataService.rejectTriage(id);
    setTriageFeed(updated);
    setKpis(governmentDataService.getFilteredKpis(selectedDistrict, selectedSector));
  };

  const handleExportPdf = async () => {
    if (activeTab === 'users_admin' || activeTab === 'user_governance') {
      try {
        const res = await adminService.getAdmins({
          limit: 200,
          district: selectedDistrict !== 'All' ? selectedDistrict : undefined
        });
        const list = res?.records?.length ? res.records : MOCK_ADMIN_RECORDS;
        exportAdminDirectoryPdf(list, { district: selectedDistrict });
      } catch (err) {
        console.error('Failed to fetch admins for export, using fallback:', err);
        exportAdminDirectoryPdf(MOCK_ADMIN_RECORDS, { district: selectedDistrict });
      }
    } else if (
      activeTab === 'governance_industries' ||
      activeTab === 'industries' ||
      activeTab === 'manage_industries'
    ) {
      try {
        const data = await industryService.getIndustries({
          limit: 200,
          district: selectedDistrict !== 'All' ? selectedDistrict : undefined
        });
        const list = data?.records || [];
        exportIndustryDirectoryPdf(list, { district: selectedDistrict, sector: selectedSector });
      } catch (err) {
        console.error('Failed to export industry directory:', err);
        exportIndustryDirectoryPdf([], { district: selectedDistrict, sector: selectedSector });
      }
    } else if (
      activeTab === 'governance_universities' ||
      activeTab === 'universities' ||
      activeTab === 'manage_universities' ||
      activeTab === 'heis'
    ) {
      try {
        const data = await universityService.getUniversities({
          limit: 200,
          district: selectedDistrict !== 'All' ? selectedDistrict : undefined
        });
        const list = data?.records?.length ? data.records : heis;
        exportUniversityDirectoryPdf(list, { district: selectedDistrict });
      } catch (err) {
        console.error('Failed to fetch universities for export, using local list:', err);
        exportUniversityDirectoryPdf(heis, { district: selectedDistrict });
      }
    } else {
      exportGenericReportPdf(getTabTitle(activeTab), { district: selectedDistrict });
    }
  };

  // Filtered Triage Feed by Selected District & Sector
  const filteredTriageFeed = triageFeed.filter((item) => {
    if (selectedDistrict !== 'All' && item.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (selectedSector !== 'All') {
      const secMatch = item.category?.toLowerCase();
      const selMatch = selectedSector.toLowerCase();
      if (!selMatch.includes(secMatch) && !secMatch.includes(selMatch.split(' ')[0])) {
        return false;
      }
    }
    return true;
  });

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'projects_solutions':
      case 'projects_overview': return 'Projects & Solutions Dashboard';
      case 'projects_active': return 'Active Projects in Progress';
      case 'projects_proposals': return 'Solution Proposals Queue';
      case 'projects_milestones': return 'Milestones & Stage Gate Compliance';
      case 'projects_prototypes': return 'Prototypes & TRL Monitoring';
      case 'projects_deployment': return 'Field Deployment & Telemetry';
      case 'triage': return 'Problem Triage & Verification';
      case 'heis': return 'HEI Hub & University Directory';
      case 'csr': return 'CSR Grants & Corporate Partnerships';
      case 'gis': return 'Jharkhand Geospatial Information System (GIS)';
      case 'user_governance':
      case 'governance_industries':
      case 'manage_industries':
      case 'industries': return 'Industry & Partner Directory';
      case 'users_admin': return 'User Admin & Departmental Governance';
      case 'users_audit': return 'System & Compliance Audit Trail';
      case 'reports':
      case 'reports_overview': return 'Report Overview';
      case 'reports_quick': return 'Quick Exports';
      case 'reports_custom': return 'Custom Reports';
      case 'reports_scheduled': return 'Scheduled Reports';
      case 'reports_history': return 'Report History';
      case 'settings': return 'Government Portal Settings';
      default: return 'Innovation Module';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col h-screen overflow-hidden text-slate-900 font-sans">
      {/* 1. Top Fixed Government Header with real-time District & Sector Selectors */}
      <GovernmentHeader
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={(dist) => setSelectedDistrict(dist)}
        selectedSector={selectedSector}
        setSelectedSector={(sec) => setSelectedSector(sec)}
        onExportPdf={handleExportPdf}
        notificationCount={7}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* 2. Body Container with Sidebar and Content Area */}
      <div className="flex-1 flex overflow-hidden relative min-h-0 bg-white">
        {/* Navigation Sidebar */}
        <GovernmentSidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          onLogout={onLogout}
        />

        {/* Content Area with Independent Scrolling & Bottom Footer */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
          <main className="flex-1 p-3 md:p-4 overflow-y-auto overflow-x-hidden min-w-0 w-full min-h-0 bg-slate-50">
            {activeTab === 'overview' ? (
              <GovernmentOverview
                kpis={kpis}
                triageFeed={filteredTriageFeed}
                sectors={sectors}
                sectorTimeframe={sectorTimeframe}
                onChangeSectorTimeframe={(tf) => setSectorTimeframe(tf)}
                trendData={trendData}
                trendInterval={trendInterval}
                onChangeTrendInterval={(interval) => setTrendInterval(interval)}
                heis={heis}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={(dist) => setSelectedDistrict(dist)}
                onSelectSector={(sec) => setSelectedSector(sec)}
                onApproveTriage={handleApproveTriage}
                onRejectTriage={handleRejectTriage}
                onViewAllTriage={() => handleSetActiveTab('triage')}
                onViewAllHeis={() => handleSetActiveTab('heis')}
              />
            ) : activeTab === 'triage' ? (
              <AITriageDashboard
                selectedDistrict={selectedDistrict}
                onSelectDistrict={(dist) => setSelectedDistrict(dist)}
              />
            ) : activeTab === 'projects_solutions' || activeTab === 'projects_overview' || activeTab === 'projects_active' ? (
              <ActiveProjectsPanel />
            ) : activeTab === 'projects_proposals' ? (
              <SolutionProposalsPanel />
            ) : activeTab === 'projects_milestones' ? (
              <MilestonesMonitoringPanel />
            ) : activeTab === 'projects_prototypes' ? (
              <PrototypesEvaluationPanel />
            ) : activeTab === 'projects_deployment' ? (
              <DeploymentTelemetryPanel />
            ) : activeTab === 'heis' ? (
              <HeiHubPanel
                selectedDistrict={selectedDistrict}
                onSelectDistrict={(dist) => setSelectedDistrict(dist)}
              />
            ) : activeTab === 'csr' || activeTab === 'csr_grants' ? (
              <CSRGrantsLifecycleDashboard />
            ) : activeTab === 'governance_universities' || activeTab === 'manage_universities' ? (
              <ManageUniversitiesDashboard initialMode="list" />
            ) : activeTab === 'governance_industries' || activeTab === 'manage_industries' || activeTab === 'industries' ? (
              <ManageIndustriesDashboard />
            ) : activeTab === 'gis' ? (
              <GovernmentGisDashboard />
            ) : activeTab === 'users_admin' || activeTab === 'user_governance' ? (
              <AdminManagement />
            ) : (
              <ComingSoonPanel
                title={getTabTitle(activeTab)}
                onBackToOverview={() => handleSetActiveTab('overview')}
              />
            )}
          </main>

          {/* Fixed Bottom Footer */}
          <GovernmentFooter />
        </div>
      </div>

      {/* Official Government Printable Dossier (Hidden on screen, prints directly on Export PDF) */}
      <OfficialPrintableDossier
        selectedDistrict={selectedDistrict}
        selectedSector={selectedSector}
        kpis={kpis}
        triageFeed={filteredTriageFeed}
      />
    </div>
  );
};

export default GovernmentLayout;
